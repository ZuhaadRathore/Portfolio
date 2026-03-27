'use client'

import React, { useEffect, useRef } from 'react'

// Fragment shader — white background, dark smoke wisps, mouse distortion
// White bg + mix-blend-mode:multiply on the canvas element lets parchment show through
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
  vec3 col=vec3(1);
  uv.x+=.25;
  uv*=vec2(2,1);

  // Mouse repulsion — push smoke away from cursor in UV space
  vec2 mouseUV=(u_mouse-0.5)*vec2(R.x/R.y,1.0);
  mouseUV.x+=0.25;
  mouseUV*=vec2(2.0,1.0);
  vec2 toMouse=uv-mouseUV;
  float mouseDist=length(toMouse);
  float mouseEffect=smoothstep(0.55,0.0,mouseDist);
  uv+=normalize(toMouse+vec2(0.001,0.001))*mouseEffect*0.22;

  float n=fbm(uv*.28-vec2(T*.01,0));
  n=noise(uv*3.+n*2.);

  col.r-=fbm(uv+vec2(0,T*.015)+n);
  col.g-=fbm(uv*1.003+vec2(0,T*.015)+n+.003);
  col.b-=fbm(uv*1.006+vec2(0,T*.015)+n+.006);

  // Tint smoke wisps with u_color; brighter regions take more of the tint
  col=mix(col,u_color,dot(col,vec3(.21,.71,.07)));

  // Clamp — background stays near white (1.0) so multiply blend is transparent
  col=clamp(col,0.0,1.0);
  O=vec4(col,1);
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
  private color: [number, number, number] = [0.627, 0.608, 0.588] // warm grey default
  private mouse: [number, number] = [0.5, 0.5] // center default

  constructor(canvas: HTMLCanvasElement, fragmentSource: string) {
    this.canvas = canvas
    const ctx = canvas.getContext('webgl2')
    if (!ctx) throw new Error('WebGL2 not supported')
    this.gl = ctx
    this.setup(fragmentSource)
    this.init()
  }

  updateColor(newColor: [number, number, number]) {
    this.color = newColor
  }

  updateMouse(x: number, y: number) {
    // x, y are normalized 0-1 coords (y from top); flip y for WebGL
    this.mouse = [x, 1.0 - y]
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
    ;(program as any).time = gl.getUniformLocation(program, 'time')
    ;(program as any).u_color = gl.getUniformLocation(program, 'u_color')
    ;(program as any).u_mouse = gl.getUniformLocation(program, 'u_mouse')
  }

  render(now = 0) {
    const { gl, program, buffer, canvas } = this
    if (!program || !gl.isProgram(program)) return
    gl.clearColor(1, 1, 1, 1)
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
  smokeColor?: string // hex, e.g. "#a09b96"
}

export const SmokeBackground: React.FC<SmokeBackgroundProps> = ({
  smokeColor = '#a09b96',
}) => {
  const canvasRef = useRef<HTMLCanvasElement>(null)
  const rendererRef = useRef<Renderer | null>(null)

  // Init renderer and RAF loop
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return

    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let renderer: Renderer
    try {
      renderer = new Renderer(canvas, fragmentShaderSource)
    } catch {
      return // WebGL2 not available, silently skip
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
    // Listen on window so mouse outside the element still influences it
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

  // Update color when prop changes
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
