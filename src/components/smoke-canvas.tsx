'use client'

import { useEffect, useRef } from 'react'

interface Particle {
  x: number
  y: number
  vx: number
  vy: number
  baseVy: number
  radius: number
  baseAlpha: number
  age: number
  lifespan: number
  phase: number
}

const PARTICLE_COUNT = 50

function spawnParticle(w: number, h: number, age?: number): Particle {
  const lifespan = Math.floor((8 + Math.random() * 6) * 60)
  const baseVy = -(0.15 + Math.random() * 0.25)
  return {
    x: Math.random() * w,
    y: Math.random() * h,
    vx: (Math.random() - 0.5) * 0.1,
    vy: baseVy,
    baseVy,
    radius: 60 + Math.random() * 80,
    baseAlpha: 0.08 + Math.random() * 0.10,
    age: age !== undefined ? age : Math.floor(Math.random() * lifespan),
    lifespan,
    phase: Math.random() * Math.PI * 2,
  }
}

function computeAlpha(p: Particle, alphaMultiplier: number): number {
  const t = p.age / p.lifespan
  // Triangle envelope: fade in over first 30%, full from 30-70%, fade out over last 30%
  const envelope = t < 0.3 ? t / 0.3 : t < 0.7 ? 1 : (1 - t) / 0.3
  return p.baseAlpha * envelope * alphaMultiplier
}

function clamp(value: number, min: number, max: number): number {
  return Math.min(Math.max(value, min), max)
}

export default function SmokeCanvas({
  heroRef,
}: {
  heroRef: React.RefObject<HTMLElement | null>
}) {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let rafId: number
    const mousePos = { x: -9999, y: -9999 }
    let alphaMultiplier = 1
    let heroHeight = canvas.offsetHeight

    const resize = () => {
      canvas.width = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      heroHeight = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    const particles: Particle[] = Array.from({ length: PARTICLE_COUNT }, () =>
      spawnParticle(canvas.width, canvas.height)
    )

    const hero = heroRef.current
    const onMouseMove = (e: MouseEvent) => {
      const rect = canvas.getBoundingClientRect()
      mousePos.x = e.clientX - rect.left
      mousePos.y = e.clientY - rect.top
    }
    hero?.addEventListener('mousemove', onMouseMove)

    const onScroll = () => {
      if (heroHeight <= 0) return
      const scrollProgress = window.scrollY / heroHeight
      alphaMultiplier = clamp(1 - (scrollProgress - 0.4) / 0.3, 0, 1)
    }
    window.addEventListener('scroll', onScroll, { passive: true })

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height)
      ctx.globalCompositeOperation = 'multiply'

      for (const p of particles) {
        // Mouse push — repel particles within 200px of cursor
        const dx = p.x - mousePos.x
        const dy = p.y - mousePos.y
        const dist = Math.sqrt(dx * dx + dy * dy)
        if (dist < 200 && dist > 0) {
          const push = (1 - dist / 200) * 0.8
          p.vx += (dx / dist) * push
          p.vy += (dy / dist) * push
        }

        // Velocity decay back to ambient
        p.vx *= 0.96
        p.vx += (0 - p.vx) * 0.01
        p.vy = p.vy + (p.baseVy - p.vy) * 0.02

        // Ambient motion: upward drift + sine wobble
        p.x += p.vx + Math.sin(p.age * 0.018 + p.phase) * 0.3
        p.y += p.vy
        p.age++

        // Respawn when lifespan ends
        if (p.age >= p.lifespan) {
          Object.assign(p, spawnParticle(canvas.width, canvas.height, 0))
        }

        const alpha = computeAlpha(p, alphaMultiplier)
        if (alpha <= 0) continue

        // Draw as a soft radial gradient blob
        const grad = ctx.createRadialGradient(p.x, p.y, 0, p.x, p.y, p.radius)
        grad.addColorStop(0, `rgba(160, 155, 150, ${alpha})`)
        grad.addColorStop(1, `rgba(160, 155, 150, 0)`)

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = grad
        ctx.fill()
      }

      rafId = requestAnimationFrame(draw)
    }

    rafId = requestAnimationFrame(draw)

    return () => {
      cancelAnimationFrame(rafId)
      window.removeEventListener('resize', resize)
      hero?.removeEventListener('mousemove', onMouseMove)
      window.removeEventListener('scroll', onScroll)
    }
  }, [heroRef])

  return (
    <canvas
      ref={canvasRef}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        zIndex: 0,
        pointerEvents: 'none',
      }}
      aria-hidden="true"
    />
  )
}
