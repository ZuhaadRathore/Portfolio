'use client'

import React, { useEffect, useRef } from 'react'

// Smoke is rendered as a colored, semi-transparent layer over a fully transparent canvas.
// The parchment background always shows through — only the smoke density adds opacity.
const fragmentShaderSource = `#version 300 es
precision highp float;
out vec4 O;
uniform float time;
uniform vec2 resolution;
uniform vec3 u_color;
uniform vec2 u_mouse;
uniform float u_reveal;
uniform vec2 u_text_center;
uniform float u_text_radius;

#define FC gl_FragCoord.xy
#define R resolution
#define T (time+660.)

float rnd(vec2 p){p=fract(p*vec2(12.9898,78.233));p+=dot(p,p+34.56);return fract(p.x*p.y);}
float noise(vec2 p){vec2 i=floor(p),f=fract(p),u=f*f*(3.-2.*f);return mix(mix(rnd(i),rnd(i+vec2(1,0)),u.x),mix(rnd(i+vec2(0,1)),rnd(i+1.),u.x),u.y);}
float fbm(vec2 p){float t=.0,a=1.;for(int i=0;i<5;i++){t+=a*noise(p);p*=mat2(1,-1.2,.2,1.2)*2.;a*=.5;}return t;}

void main(){
  vec2 uv=(FC-.5*R)/R.y;
  uv.x+=.25;
  uv*=vec2(2,1);

  // Mouse repulsion — expanded radius and stronger push
  vec2 mouseUV=(u_mouse-0.5)*vec2(R.x/R.y,1.0);
  mouseUV.x+=0.25;
  mouseUV*=vec2(2.0,1.0);
  vec2 toMouse=uv-mouseUV;
  float mouseDist=length(toMouse);
  float mouseEffect=smoothstep(0.75,0.0,mouseDist);
  uv+=normalize(toMouse+vec2(0.001,0.001))*mouseEffect*0.55;

  // Text repulsion — static void around name
  vec2 textUV=(u_text_center-0.5)*vec2(R.x/R.y,1.0);
  textUV.x+=0.25;
  textUV*=vec2(2.0,1.0);
  vec2 toText=uv-textUV;
  float textDist=length(toText);
  float textEffect=smoothstep(u_text_radius,0.0,textDist);
  uv+=normalize(toText+vec2(0.001,0.001))*textEffect*0.4;

  float n=fbm(uv*.28-vec2(T*.01,0));
  n=noise(uv*3.+n*2.);

  // RGB offset for smoke density
  float r=fbm(uv+vec2(0,T*.015)+n);
  float g=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  float b=fbm(uv*1.006+vec2(0,T*.015)+n+.006);
  float density=(r+g+b)/3.0;

  // Charcoal: compute smooth alpha first, then posterize it into 3 bands
  float rawAlpha=smoothstep(0.52,1.1,density);
  float bandCount=3.0;
  float bandT=rawAlpha*bandCount;
  float alpha=floor(bandT)/bandCount;

  // Anisotropic scratch — stretched diagonally to simulate charcoal stroke direction
  vec2 scratchUV=vec2(uv.x*1.6-uv.y*0.5,uv.y*0.4+uv.x*0.2)*38.0;
  float scratch=noise(scratchUV+vec2(T*0.008,0.0));

  // Band-edge roughness: fract(bandT) approaches 0 at band boundaries
  float edgeFrac=fract(bandT);
  float atEdge=1.0-smoothstep(0.0,0.18,edgeFrac)*smoothstep(1.0,0.82,edgeFrac);
  alpha*=mix(1.0,scratch,0.12+atEdge*0.18);

  // Body grain — gentle medium-freq roughness throughout
  float grain=noise(uv*18.0+vec2(0.0,T*0.01));
  alpha*=mix(0.88,1.0,grain);

  // Corner mask driven by u_reveal: starts wide (0.4), tightens to 2.8
  vec2 sc=FC/R;
  float d=min(min(length(sc),length(sc-vec2(1,0))),
              min(length(sc-vec2(0,1)),length(sc-vec2(1,1))));
  float cornerRadius=mix(0.4,2.8,u_reveal);
  float cornerPower=mix(0.8,4.0,u_reveal);
  float cornerMask=pow(clamp(1.0-d*cornerRadius,0.0,1.0),cornerPower);
  alpha*=cornerMask;

  // Mouse alpha kill — near-total clear under cursor
  alpha*=(1.0-mouseEffect*0.97);

  // Text zone alpha suppression
  alpha*=(1.0-textEffect*0.8);

  O=vec4(u_color,clamp(alpha*2.2,0.0,1.0));
}`

const VERTEX_SOURCE =
  '#version 300 es\nprecision highp float;\nin vec4 position;\nvoid main(){gl_Position=position;}'

const hexToRgb = (hex: string): [number, number, number] | null => {
  const result = /^#?([a-f\d]{2})([a-f\d]{2})([a-f\d]{2})$/i.exec(hex)
  return result
    ? [
        parseInt(result[1], 16) / 255,
        parseInt(result[2], 16) / 255,
        parseInt(result[3], 16) / 255,
      ]
    : null
}

class Renderer {
  private readonly vertices = [-1, 1, -1, -1, 1, 1, 1, -1]
  private gl: WebGL2RenderingContext
  private canvas: HTMLCanvasElement
  private program: WebGLProgram | null = null
  private vs: WebGLShader | null = null
  private fs: WebGLShader | null = null
  private buffer: WebGLBuffer | null = null
  private color: [number, number, number] = [0.816, 0, 0]
  private mouse: [number, number] = [-1, -1] // off-screen default
  private reveal: number = 0
  private textCenter: [number, number] = [0.5, 0.5]
  private textRadius: number = 0.32

  constructor(canvas: HTMLCanvasElement, fragmentSource: string) {
    this.canvas = canvas
    // alpha:true so the canvas is transparent where smoke alpha=0
    const ctx = canvas.getContext('webgl2', { alpha: true, premultipliedAlpha: false })
    if (!ctx) throw new Error('WebGL2 not supported')
    this.gl = ctx
    this.gl.enable(this.gl.BLEND)
    this.gl.blendFunc(this.gl.SRC_ALPHA, this.gl.ONE_MINUS_SRC_ALPHA)
    this.setup(fragmentSource)
    this.init()
  }

  updateColor(newColor: [number, number, number]) {
    this.color = newColor
  }

  updateMouse(x: number, y: number) {
    this.mouse = [x, 1.0 - y] // flip y for WebGL
  }

  updateReveal(v: number) {
    this.reveal = v
  }

  updateTextZone(cx: number, cy: number, r: number) {
    this.textCenter = [cx, cy]
    this.textRadius = r
  }

  updateScale() {
    const dpr = Math.max(1, window.devicePixelRatio)
    this.canvas.width = this.canvas.offsetWidth * dpr
    this.canvas.height = this.canvas.offsetHeight * dpr
    this.gl.viewport(0, 0, this.canvas.width, this.canvas.height)
  }

  private compile(shader: WebGLShader, source: string) {
    const gl = this.gl
    gl.shaderSource(shader, source)
    gl.compileShader(shader)
    if (!gl.getShaderParameter(shader, gl.COMPILE_STATUS)) {
      console.error('Shader error:', gl.getShaderInfoLog(shader))
    }
  }

  reset() {
    const { gl, program, vs, fs } = this
    if (!program) return
    if (vs) { gl.detachShader(program, vs); gl.deleteShader(vs) }
    if (fs) { gl.detachShader(program, fs); gl.deleteShader(fs) }
    gl.deleteProgram(program)
    this.program = null
  }

  private setup(fragmentSource: string) {
    const gl = this.gl
    this.vs = gl.createShader(gl.VERTEX_SHADER)
    this.fs = gl.createShader(gl.FRAGMENT_SHADER)
    const program = gl.createProgram()
    if (!this.vs || !this.fs || !program) return
    this.compile(this.vs, VERTEX_SOURCE)
    this.compile(this.fs, fragmentSource)
    this.program = program
    gl.attachShader(program, this.vs)
    gl.attachShader(program, this.fs)
    gl.linkProgram(program)
    if (!gl.getProgramParameter(program, gl.LINK_STATUS)) {
      console.error('Program link error:', gl.getProgramInfoLog(program))
    }
  }

  private init() {
    const { gl, program } = this
    if (!program) return
    this.buffer = gl.createBuffer()
    gl.bindBuffer(gl.ARRAY_BUFFER, this.buffer)
    gl.bufferData(gl.ARRAY_BUFFER, new Float32Array(this.vertices), gl.STATIC_DRAW)
    const pos = gl.getAttribLocation(program, 'position')
    gl.enableVertexAttribArray(pos)
    gl.vertexAttribPointer(pos, 2, gl.FLOAT, false, 0, 0)
    ;(program as any).resolution = gl.getUniformLocation(program, 'resolution')
    ;(program as any).time      = gl.getUniformLocation(program, 'time')
    ;(program as any).u_color   = gl.getUniformLocation(program, 'u_color')
    ;(program as any).u_mouse   = gl.getUniformLocation(program, 'u_mouse')
    ;(program as any).u_reveal      = gl.getUniformLocation(program, 'u_reveal')
    ;(program as any).u_text_center = gl.getUniformLocation(program, 'u_text_center')
    ;(program as any).u_text_radius = gl.getUniformLocation(program, 'u_text_radius')
  }

  render(now = 0) {
    const { gl, program, buffer, canvas } = this
    if (!program || !gl.isProgram(program)) return
    // Clear to fully transparent — parchment shows through everywhere smoke alpha=0
    gl.clearColor(0, 0, 0, 0)
    gl.clear(gl.COLOR_BUFFER_BIT)
    gl.useProgram(program)
    gl.bindBuffer(gl.ARRAY_BUFFER, buffer)
    gl.uniform2f((program as any).resolution, canvas.width, canvas.height)
    gl.uniform1f((program as any).time, now * 1e-3)
    gl.uniform3fv((program as any).u_color, this.color)
    gl.uniform2fv((program as any).u_mouse, this.mouse)
    gl.uniform1f((program as any).u_reveal,      this.reveal)
    gl.uniform2fv((program as any).u_text_center, this.textCenter)
    gl.uniform1f((program as any).u_text_radius,  this.textRadius)
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
}

interface SmokeBackgroundProps {
  smokeColor?: string
  reveal?: boolean
}

export const SmokeBackground: React.FC<SmokeBackgroundProps> = ({
  smokeColor = '#D00000',
  reveal = false,
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let renderer: Renderer
    try {
      renderer = new Renderer(canvas, fragmentShaderSource)
    } catch {
      return
    }
    rendererRef.current = renderer
    renderer.updateTextZone(0.5, 0.5, 0.32)

    const handleResize = () => renderer.updateScale()
    handleResize()
    window.addEventListener('resize', handleResize)

    const handleMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      renderer.updateMouse(
        (e.clientX - rect.left) / rect.width,
        (e.clientY - rect.top) / rect.height,
      )
    }
    window.addEventListener('mousemove', handleMouseMove)

    let rafId: number
    const loop = (now: number) => {
      renderer.render(now)
      rafId = requestAnimationFrame(loop)
    }
    rafId = requestAnimationFrame(loop)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('mousemove', handleMouseMove)
      renderer.reset()
      rendererRef.current = null
    }
  }, [])

  useEffect(() => {
    const renderer = rendererRef.current
    if (!renderer) return
    const rgb = hexToRgb(smokeColor)
    if (rgb) renderer.updateColor(rgb)
  }, [smokeColor])

  useEffect(() => {
    if (!reveal) return
    const renderer = rendererRef.current
    if (!renderer) return

    const startTime = performance.now()
    const duration = 1200
    let rafId: number = 0

    const animate = (now: number) => {
      const t = Math.min((now - startTime) / duration, 1)
      const eased = 1 - Math.pow(1 - t, 3) // ease-out cubic
      renderer.updateReveal(eased)
      if (t < 1) {
        rafId = requestAnimationFrame(animate)
      }
    }
    rafId = requestAnimationFrame(animate)
    return () => cancelAnimationFrame(rafId)
  }, [reveal])

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      aria-hidden="true"
    />
  )
}
