'use client'

import { useEffect, useRef, useState } from 'react'
import * as THREE from 'three'
import { GLTFLoader } from 'three/examples/jsm/loaders/GLTFLoader.js'

// ─── Screen canvas constants ───────────────────────────────────────────────
const SW = 512
const SH = 384
const FONT_PX = 13
const LINE_H = 19
const PAD = 18
const AMBER = '#ffb000'
const AMBER_DIM = '#7a5200'
const BG = '#000000'

const BOOT_LINES = [
  'ZRPC BIOS v2.6.1  Copyright (C) 1984-2024',
  '',
  'CPU: ZRPC-386DX   33 MHz',
  'Co-Processor: Present',
  'Memory Test: 640K OK',
  '',
  'Detecting IDE drives...',
  '  Drive C: 20MB  [OK]',
  '  Drive D: CD-ROM [OK]',
  '',
  'Loading ZR-DOS 6.2...',
  '',
  '▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓▓  100%',
  '',
  'C:\\>',
]

// ─── Terminal screen class ─────────────────────────────────────────────────
type Phase =
  | 'idle'
  | 'flickering'
  | 'booting'
  | 'clearing'
  | 'typing-name'
  | 'typing-title'
  | 'ready'

class TerminalScreen {
  canvas: HTMLCanvasElement
  ctx: CanvasRenderingContext2D
  texture: THREE.CanvasTexture
  phase: Phase = 'idle'

  private flickerT = 0
  private bootLineIdx = 0
  private bootCharIdx = 0
  private bootTimer = 0
  private completedLines: string[] = []
  private cursorOn = true
  private cursorT = 0
  private clearAlpha = 0
  private nameLen = 0
  private titleLen = 0
  private typeTimer = 0

  constructor() {
    this.canvas = document.createElement('canvas')
    this.canvas.width = SW
    this.canvas.height = SH
    const ctx = this.canvas.getContext('2d')!
    this.ctx = ctx
    this.texture = new THREE.CanvasTexture(this.canvas)
    this.texture.flipY = true
    this.fillBlack()
    this.texture.needsUpdate = true
  }

  private fillBlack() {
    this.ctx.fillStyle = BG
    this.ctx.fillRect(0, 0, SW, SH)
  }

  powerOn() {
    this.phase = 'flickering'
    this.flickerT = 0
    this.bootLineIdx = 0
    this.bootCharIdx = 0
    this.bootTimer = 0
    this.completedLines = []
    this.cursorOn = true
    this.cursorT = 0
    this.clearAlpha = 0
    this.nameLen = 0
    this.titleLen = 0
    this.typeTimer = 0
  }

  update(dt: number) {
    switch (this.phase) {
      case 'idle':
        return

      case 'flickering': {
        this.flickerT += dt
        const t = this.flickerT
        if (t < 80)       this.fillBlack()
        else if (t < 110) { this.ctx.fillStyle = '#2a1500'; this.ctx.fillRect(0, 0, SW, SH) }
        else if (t < 140) this.fillBlack()
        else if (t < 200) { this.ctx.fillStyle = '#4a2800'; this.ctx.fillRect(0, 0, SW, SH) }
        else if (t < 240) this.fillBlack()
        else if (t < 310) { this.ctx.fillStyle = AMBER_DIM; this.ctx.fillRect(0, 0, SW, SH) }
        else if (t < 360) this.fillBlack()
        else {
          this.phase = 'booting'
          this.fillBlack()
        }
        this.texture.needsUpdate = true
        break
      }

      case 'booting': {
        this.bootTimer += dt
        this.cursorT += dt
        if (this.cursorT > 500) { this.cursorT = 0; this.cursorOn = !this.cursorOn }

        // advance one char every 16 ms
        while (this.bootTimer >= 16 && this.bootLineIdx < BOOT_LINES.length) {
          this.bootTimer -= 16
          const line = BOOT_LINES[this.bootLineIdx]
          if (this.bootCharIdx < line.length) {
            this.bootCharIdx++
          } else {
            this.completedLines.push(line)
            this.bootLineIdx++
            this.bootCharIdx = 0
            // small pause on empty lines
            if (this.bootLineIdx < BOOT_LINES.length && BOOT_LINES[this.bootLineIdx] === '')
              this.bootTimer -= 120
          }
        }

        if (this.bootLineIdx >= BOOT_LINES.length) {
          this.phase = 'clearing'
          this.clearAlpha = 0
        }

        this.renderBoot()
        break
      }

      case 'clearing': {
        this.clearAlpha += dt * 0.004
        if (this.clearAlpha >= 1) {
          this.clearAlpha = 1
          this.phase = 'typing-name'
          this.typeTimer = 0
          this.cursorT = 0
        }
        this.renderBoot()
        this.ctx.fillStyle = `rgba(0,0,0,${Math.min(this.clearAlpha, 1)})`
        this.ctx.fillRect(0, 0, SW, SH)
        this.texture.needsUpdate = true
        break
      }

      case 'typing-name': {
        this.typeTimer += dt
        this.cursorT += dt
        if (this.cursorT > 500) { this.cursorT = 0; this.cursorOn = !this.cursorOn }

        const target = 'Zuhaad Rathore'
        if (this.typeTimer >= 90) {
          this.typeTimer = 0
          if (this.nameLen < target.length) this.nameLen++
          else { this.phase = 'typing-title'; this.typeTimer = 500 /* pause before title */ }
        }
        this.renderHero()
        break
      }

      case 'typing-title': {
        this.typeTimer += dt
        this.cursorT += dt
        if (this.cursorT > 500) { this.cursorT = 0; this.cursorOn = !this.cursorOn }

        const target = 'Software Engineer'
        if (this.typeTimer >= 70) {
          this.typeTimer = 0
          if (this.titleLen < target.length) this.titleLen++
          else this.phase = 'ready'
        }
        this.renderHero()
        break
      }

      case 'ready': {
        this.cursorT += dt
        if (this.cursorT > 500) { this.cursorT = 0; this.cursorOn = !this.cursorOn }
        this.renderHero()
        break
      }
    }
  }

  private renderBoot() {
    const { ctx } = this
    this.fillBlack()

    // scanlines for atmosphere
    for (let y = 0; y < SH; y += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.12)'
      ctx.fillRect(0, y, SW, 1)
    }

    ctx.font = `${FONT_PX}px "Courier New", monospace`
    ctx.fillStyle = AMBER

    let y = PAD + FONT_PX
    for (const line of this.completedLines) {
      ctx.fillText(line, PAD, y)
      y += LINE_H
    }

    // partial current line
    if (this.bootLineIdx < BOOT_LINES.length) {
      const partial = BOOT_LINES[this.bootLineIdx].slice(0, this.bootCharIdx)
      ctx.fillText(partial, PAD, y)
      if (this.cursorOn) {
        const w = ctx.measureText(partial).width
        ctx.fillRect(PAD + w, y - FONT_PX + 1, 7, FONT_PX + 1)
      }
    }

    this.texture.needsUpdate = true
  }

  private renderHero() {
    const { ctx } = this
    this.fillBlack()

    // scanlines
    for (let y = 0; y < SH; y += 3) {
      ctx.fillStyle = 'rgba(0,0,0,0.14)'
      ctx.fillRect(0, y, SW, 1)
    }

    const nameFull = 'Zuhaad Rathore'
    const titleFull = 'Software Engineer'
    const namePart = nameFull.slice(0, this.nameLen)
    const titlePart = titleFull.slice(0, this.titleLen)

    // glow backdrop for name
    ctx.save()
    ctx.shadowColor = AMBER
    ctx.shadowBlur = 18

    // Name
    ctx.font = `bold 46px "Courier New", monospace`
    ctx.fillStyle = AMBER
    const nameY = Math.round(SH * 0.42)
    ctx.fillText(namePart, PAD, nameY)

    // cursor after name while typing
    if (this.phase === 'typing-name' && this.cursorOn) {
      const nw = ctx.measureText(namePart).width
      ctx.fillRect(PAD + nw, nameY - 40, 26, 44)
    }

    ctx.restore()

    // Title
    ctx.font = `${FONT_PX + 3}px "Courier New", monospace`
    ctx.fillStyle = AMBER_DIM
    ctx.shadowColor = 'transparent'
    const titleY = nameY + 40
    ctx.fillText(titlePart, PAD + 2, titleY)

    if (this.phase === 'typing-title' && this.cursorOn) {
      const tw = ctx.measureText(titlePart).width
      ctx.fillStyle = AMBER_DIM
      ctx.fillRect(PAD + 2 + tw, titleY - FONT_PX - 2, 9, FONT_PX + 2)
    }

    // ready: blinking prompt
    if (this.phase === 'ready') {
      ctx.font = `${FONT_PX}px "Courier New", monospace`
      ctx.fillStyle = AMBER
      const py = titleY + 32
      ctx.fillText('C:\\>', PAD, py)
      if (this.cursorOn) {
        const pw = ctx.measureText('C:\\>').width
        ctx.fillRect(PAD + pw + 3, py - FONT_PX + 1, 8, FONT_PX + 1)
      }
    }

    this.texture.needsUpdate = true
  }

  dispose() {
    this.texture.dispose()
  }
}

// ─── React component ───────────────────────────────────────────────────────
export default function RetroComputerHero({
  onLoaded,
  onEnterMain,
}: {
  onLoaded?: () => void
  onEnterMain?: () => void
}) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [modelReady, setModelReady] = useState(false)
  const terminalRef = useRef<TerminalScreen | null>(null)
  const onEnterMainRef = useRef(onEnterMain)
  onEnterMainRef.current = onEnterMain

  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    // ── renderer ──────────────────────────────────────────────────────────
    const renderer = new THREE.WebGLRenderer({ antialias: true })
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2))
    renderer.setClearColor(0x000000, 1)
    renderer.setSize(container.clientWidth, container.clientHeight)
    container.appendChild(renderer.domElement)

    // ── scene / camera ────────────────────────────────────────────────────
    const scene = new THREE.Scene()
    const camera = new THREE.PerspectiveCamera(
      42,
      container.clientWidth / container.clientHeight,
      0.01,
      200
    )

    // ── lights — neutral even illumination ────────────────────────────────
    scene.add(new THREE.AmbientLight(0xffffff, 2.5))

    // ── edge line material — thin dark lines ───────────────────────────────
    const edgeMat = new THREE.LineBasicMaterial({
      color: 0x1a1208,
      transparent: true,
      opacity: 0.3,
    })

    const terminal = new TerminalScreen()
    terminalRef.current = terminal
    const screenMat = new THREE.MeshBasicMaterial({ map: terminal.texture })

    // ── edge outline helper — angle threshold 6° ───────────────────────────
    const addEdges = (mesh: THREE.Mesh) => {
      const createSketchyLines = () => {
        const edges = new THREE.EdgesGeometry(mesh.geometry, 5)
        const pos = edges.attributes.position
        if (pos) {
          for (let i = 0; i < pos.count; i++) {
            pos.setXYZ(
              i,
              pos.getX(i) + (Math.random() - 0.5) * 0.007,
              pos.getY(i) + (Math.random() - 0.5) * 0.007,
              pos.getZ(i) + (Math.random() - 0.5) * 0.007
            )
          }
        }
        return new THREE.LineSegments(edges, edgeMat)
      }

      mesh.add(createSketchyLines())
      mesh.add(createSketchyLines())
      mesh.add(createSketchyLines())
    }

    // ── load model ────────────────────────────────────────────────────────
    const loader = new GLTFLoader()
    loader.load(
      '/computer.glb',
      (gltf) => {
        const model = gltf.scene

        const meshes: THREE.Mesh[] = []
        model.traverse((obj) => {
          if (!(obj instanceof THREE.Mesh)) return
          const mats = Array.isArray(obj.material) ? obj.material : [obj.material]

          mats.forEach((m: THREE.Material) => {
            if (!(m instanceof THREE.MeshStandardMaterial)) return
            m.map = null
            m.normalMap = null
            m.roughnessMap = null
            m.metalnessMap = null
            m.aoMap = null
            m.emissiveMap = null
            m.color.set(0xf0ece6)
            m.roughness = 0.85
            m.metalness = 0.0
            m.needsUpdate = true
          })

          const isScreen = mats.some((m: THREE.Material) => m.name === 'Monitor_Glass')
          if (isScreen) obj.material = screenMat

          meshes.push(obj)
        })

        meshes.forEach(addEdges)

        model.rotation.y = Math.PI * 1.5
        scene.add(model)

        const box = new THREE.Box3().setFromObject(model)
        const center = box.getCenter(new THREE.Vector3())
        const size = box.getSize(new THREE.Vector3())
        const maxDim = Math.max(size.x, size.y, size.z)

        camera.position.set(
          center.x,
          center.y + maxDim * 0.18,
          center.z + maxDim * 1.6
        )
        camera.lookAt(center)

        setModelReady(true)
        onLoaded?.()
        terminal.powerOn()
      },
      undefined,
      (err) => console.error('GLB load error', err)
    )

    // ── scroll to enter main once terminal is ready ───────────────────────
    const handleScroll = () => {
      if (terminalRef.current?.phase === 'ready') {
        onEnterMainRef.current?.()
      }
    }
    window.addEventListener('scroll', handleScroll, { passive: true })

    // ── resize ────────────────────────────────────────────────────────────
    const handleResize = () => {
      const w = container.clientWidth
      const h = container.clientHeight
      camera.aspect = w / h
      camera.updateProjectionMatrix()
      renderer.setSize(w, h)
    }
    window.addEventListener('resize', handleResize)

    // ── render loop ───────────────────────────────────────────────────────
    let rafId: number
    let prev = performance.now()

    const animate = (now: number) => {
      rafId = requestAnimationFrame(animate)
      const dt = Math.min(now - prev, 100)
      prev = now
      terminal.update(dt)
      renderer.render(scene, camera)
    }
    rafId = requestAnimationFrame(animate)

    // ── cleanup ───────────────────────────────────────────────────────────
    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', handleResize)
      window.removeEventListener('scroll', handleScroll)
      terminal.dispose()
      edgeMat.dispose()
      screenMat.dispose()
      renderer.dispose()
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement)
      }
    }
  }, [onLoaded])

  return (
    <div
      ref={containerRef}
      style={{
        position: 'relative',
        width: '100%',
        height: '100vh',
        background: '#000',
        overflow: 'hidden',
      }}
    >
      {/* ZR loading overlay */}
      <div
        style={{
          position: 'absolute',
          inset: 0,
          background: '#000',
          display: 'flex',
          flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center',
          gap: '1.5rem',
          zIndex: 10,
          transition: 'opacity 0.6s ease',
          opacity: modelReady ? 0 : 1,
          pointerEvents: modelReady ? 'none' : 'auto',
        }}
      >
        <span
          style={{
            color: '#fff',
            fontFamily: 'var(--font-im-fell), serif',
            fontSize: 'clamp(3rem, 10vw, 6rem)',
            letterSpacing: '-0.02em',
            lineHeight: 1,
          }}
        >
          ZR.
        </span>
        <span
          style={{
            color: '#555',
            fontFamily: '"Courier New", monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.3em',
            textTransform: 'uppercase',
            animation: 'zr-blink 1.2s step-end infinite',
          }}
        >
          Loading
        </span>
      </div>

      {/* Scroll hint — shown once model is ready */}
      {modelReady && (
        <div
          style={{
            position: 'absolute',
            bottom: '2rem',
            left: '50%',
            transform: 'translateX(-50%)',
            color: '#ffb000',
            fontFamily: '"Courier New", monospace',
            fontSize: '0.6rem',
            letterSpacing: '0.24em',
            textTransform: 'uppercase',
            opacity: 0.4,
            pointerEvents: 'none',
          }}
        >
          Scroll to read
        </div>
      )}

      <style>{`
        @keyframes zr-blink {
          0%, 100% { opacity: 1; }
          50% { opacity: 0.15; }
        }
      `}</style>
    </div>
  )
}
