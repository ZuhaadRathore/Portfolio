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

  // Mouse repulsion in UV space
  vec2 mouseUV=(u_mouse-0.5)*vec2(R.x/R.y,1.0);
  mouseUV.x+=0.25;
  mouseUV*=vec2(2.0,1.0);
  vec2 toMouse=uv-mouseUV;
  float mouseDist=length(toMouse);
  float mouseEffect=smoothstep(0.55,0.0,mouseDist);
  uv+=normalize(toMouse+vec2(0.001,0.001))*mouseEffect*0.28;

  float n=fbm(uv*.28-vec2(T*.01,0));
  n=noise(uv*3.+n*2.);

  // Average FBM across slight RGB offsets for the smoke density
  float r=fbm(uv+vec2(0,T*.015)+n);
  float g=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  float b=fbm(uv*1.006+vec2(0,T*.015)+n+.006);
  float density=(r+g+b)/3.0;

  // Map FBM density to smoke opacity — smoothstep selects only denser regions
  float alpha=smoothstep(0.72,1.35,density);

  // Corner mask — smoke concentrates at all 4 corners, transparent at center
  vec2 sc=FC/R;
  float d=min(min(length(sc),length(sc-vec2(1,0))),
              min(length(sc-vec2(0,1)),length(sc-vec2(1,1))));
  float cornerMask=pow(clamp(1.0-d*2.1,0.0,1.0),1.3);

  alpha*=cornerMask;

  // Reduce smoke directly under the cursor
  alpha*=(1.0-mouseEffect*0.85);

  O=vec4(u_color, clamp(alpha*0.82,0.0,1.0));
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
    gl.drawArrays(gl.TRIANGLE_STRIP, 0, 4)
  }
}

interface SmokeBackgroundProps {
  smokeColor?: string
}

export const SmokeBackground: React.FC<SmokeBackgroundProps> = ({
  smokeColor = '#D00000',
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

  return (
    <canvas
      ref={canvasRef}
      className="w-full h-full block"
      aria-hidden="true"
    />
  )
}
