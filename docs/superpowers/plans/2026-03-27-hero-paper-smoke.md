# Hero: Paper Smoke Effect + Full-Width Name — Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the hero section with a full-viewport typographic name display backed by an ambient paper smoke canvas effect that reacts to mouse movement and scroll.

**Architecture:** Three coordinated changes — CSS strips the old newspaper-card layout and adds a centered name style; `hero-section.tsx` is gutted to name + scroll indicator only with a `heroRef` for the canvas; a new `SmokeCanvas` client component runs a `requestAnimationFrame` particle loop on a `<canvas>` behind the paper overlay layers.

**Tech Stack:** Next.js 14, React 18, TypeScript, globals.css, Canvas 2D API

---

## File Map

| Action | File | Responsibility |
|--------|------|----------------|
| Modify | `src/app/globals.css` | Remove old hero card/note/button classes; update `.hero-paper-content` to centered flex; add `.hero-name` and `.hero-name.is-ready` |
| Modify | `src/components/hero-section.tsx` | Strip content to name + scroll indicator; add `heroRef`; render `SmokeCanvas` |
| Create | `src/components/smoke-canvas.tsx` | Canvas particle system — ambient drift, mouse push, scroll fade, reduced-motion guard |

---

### Task 1: Strip obsolete hero CSS and add name styles

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Replace `.hero-paper-content` grid with centered flex**

In `src/app/globals.css`, replace:
```css
.hero-paper-content {
  position: relative;
  z-index: 3;
  width: min(1120px, 100%);
  display: grid;
  grid-template-columns: minmax(0, 1fr) minmax(230px, 320px);
  gap: clamp(1rem, 2vw, 2rem);
  align-items: center;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 800ms ease, transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-paper-content.is-ready {
  opacity: 1;
  transform: translateY(0);
}
```
With:
```css
.hero-paper-content {
  position: relative;
  z-index: 3;
  display: flex;
  align-items: center;
  justify-content: center;
  width: 100%;
  padding: clamp(1rem, 4vw, 3rem);
}
```

- [ ] **Step 2: Delete `.hero-paper-main` and its pseudo-elements**

Remove these rules entirely from `src/app/globals.css`:
```css
.hero-paper-main {
  position: relative;
  padding: clamp(1.4rem, 3.5vw, 2.5rem);
  background: linear-gradient(180deg, rgba(254, 250, 243, 0.97) 0%, rgba(247, 237, 221, 0.96) 100%);
  border: 1px solid rgba(20, 14, 10, 0.2);
  box-shadow:
    0 14px 36px rgba(28, 18, 10, 0.16),
    0 2px 0 rgba(255, 255, 255, 0.42) inset;
}

.hero-paper-main::before,
.hero-paper-main::after {
  content: '';
  position: absolute;
  top: -14px;
  width: 74px;
  height: 28px;
  background: linear-gradient(180deg, rgba(248, 236, 184, 0.75) 0%, rgba(236, 211, 144, 0.75) 100%);
  border: 1px solid rgba(74, 52, 18, 0.18);
  transform: rotate(-3deg);
  box-shadow: 0 6px 16px rgba(48, 34, 14, 0.18);
}

.hero-paper-main::before {
  left: 8%;
}

.hero-paper-main::after {
  right: 7%;
  transform: rotate(4deg);
}
```

- [ ] **Step 3: Delete typography and action rules**

Remove these rules from `src/app/globals.css`:
```css
.hero-paper-edition {
  display: inline-flex;
  margin-bottom: 0.85rem;
  border: 1px solid rgba(63, 43, 14, 0.42);
  background: rgba(255, 250, 235, 0.8);
  padding: 0.3rem 0.6rem;
  font-family: var(--font-mono);
  font-size: 0.66rem;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--paper-ink-soft);
}

.hero-paper-kicker {
  margin-bottom: 0.6rem;
  font-family: var(--font-mono);
  font-size: clamp(0.72rem, 1.2vw, 0.85rem);
  letter-spacing: 0.18em;
  text-transform: uppercase;
  color: var(--paper-ink-soft);
}

.hero-paper-title {
  margin-bottom: 0.8rem;
  font-family: var(--font-display);
  font-size: clamp(2.2rem, 7.5vw, 5.4rem);
  line-height: 0.95;
  letter-spacing: 0.01em;
  color: #2b1f16;
}

.hero-paper-copy {
  max-width: 64ch;
  margin-bottom: 1.4rem;
  font-size: clamp(0.97rem, 1.35vw, 1.12rem);
  line-height: 1.65;
  color: #3f3227;
}

.hero-paper-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.7rem;
}

.hero-paper-btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-width: 155px;
  padding: 0.72rem 1rem;
  border: 1px solid transparent;
  font-family: var(--font-mono);
  font-size: 0.72rem;
  letter-spacing: 0.16em;
  text-transform: uppercase;
  transition: transform 220ms ease, box-shadow 220ms ease, background-color 220ms ease;
}

.hero-paper-btn:hover {
  transform: translateY(-2px);
}

.hero-paper-btn-primary {
  border-color: rgba(58, 33, 22, 0.6);
  background: linear-gradient(180deg, #b25f4d 0%, #934334 100%);
  color: #fff9f2;
  box-shadow: 0 10px 20px rgba(82, 40, 28, 0.24);
}

.hero-paper-btn-secondary {
  border-color: rgba(58, 33, 22, 0.45);
  background: rgba(255, 249, 236, 0.8);
  color: #322519;
}
```

- [ ] **Step 4: Delete note and stack rules**

Remove these rules from `src/app/globals.css`:
```css
.hero-paper-stack {
  display: grid;
  gap: 0.8rem;
}

.hero-paper-note {
  position: relative;
  padding: 1rem 0.9rem 0.9rem;
  border: 1px solid rgba(26, 18, 10, 0.22);
  background: rgba(255, 247, 229, 0.92);
  box-shadow: 0 8px 16px rgba(28, 18, 10, 0.12);
}

.hero-paper-note::before {
  content: '';
  position: absolute;
  top: -10px;
  left: 14px;
  width: 50px;
  height: 20px;
  background: rgba(247, 228, 178, 0.9);
  border: 1px solid rgba(71, 48, 15, 0.2);
  transform: rotate(-6deg);
}

.hero-paper-note:nth-child(1) {
  transform: rotate(-2deg);
}

.hero-paper-note:nth-child(2) {
  transform: rotate(1.5deg);
}

.hero-paper-note:nth-child(3) {
  transform: rotate(-1deg);
}

.hero-paper-note-label {
  display: block;
  margin-bottom: 0.4rem;
  font-family: var(--font-mono);
  font-size: 0.64rem;
  letter-spacing: 0.15em;
  text-transform: uppercase;
  color: var(--paper-accent);
}

.hero-paper-note p {
  font-size: 0.9rem;
  line-height: 1.5;
  color: #3b2e22;
}
```

- [ ] **Step 5: Add `.hero-name` styles**

After the `.hero-paper-content` rule, add:
```css
.hero-name {
  position: relative;
  z-index: 3;
  font-family: var(--font-display);
  font-size: clamp(4rem, 14vw, 11rem);
  line-height: 0.95;
  letter-spacing: -0.01em;
  color: #2b1f16;
  text-align: center;
  opacity: 0;
  transform: translateY(24px);
  transition: opacity 800ms ease, transform 800ms cubic-bezier(0.22, 1, 0.36, 1);
}

.hero-name.is-ready {
  opacity: 1;
  transform: translateY(0);
}
```

- [ ] **Step 6: Replace responsive breakpoints**

Replace the entire `@media (max-width: 980px)` block (hero section rules only) with:
```css
@media (max-width: 980px) {
  .hero-paper-content {
    padding: clamp(1rem, 3vw, 2rem);
  }
}
```

Replace the entire `@media (max-width: 760px)` block with:
```css
@media (max-width: 760px) {
  .hero-paper-shell {
    align-items: stretch;
    padding-top: 6.8rem;
  }

  .hero-name {
    font-size: clamp(2.4rem, 15vw, 4rem);
  }

  .hero-paper-scroll {
    bottom: 0.9rem;
    letter-spacing: 0.19em;
  }
}
```

- [ ] **Step 7: Build check**

Run: `npm run build`
Expected: Exits 0 with no errors.

- [ ] **Step 8: Commit**
```bash
git add src/app/globals.css
git commit -m "refactor: strip hero card/note CSS, add hero-name styles"
```

---

### Task 2: Rewrite hero-section.tsx to name-only layout

**Files:**
- Modify: `src/components/hero-section.tsx`

- [ ] **Step 1: Replace file contents**

Replace the entire contents of `src/components/hero-section.tsx` with:
```tsx
'use client'

import { useEffect, useRef, useState } from 'react'

export default function HeroSection({
  onLoaded,
  skipIntro = false,
}: {
  onLoaded?: () => void
  skipIntro?: boolean
}) {
  const hasCompletedLoadRef = useRef(skipIntro)
  const [isLoaded, setIsLoaded] = useState(skipIntro)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const completeLoad = () => {
      if (hasCompletedLoadRef.current) return
      hasCompletedLoadRef.current = true
      setIsLoaded(true)
      onLoaded?.()
    }

    if (skipIntro) {
      completeLoad()
      return
    }

    const fallback = window.setTimeout(completeLoad, 1050)
    return () => clearTimeout(fallback)
  }, [onLoaded, skipIntro])

  return (
    <header
      ref={heroRef}
      className="hero-paper-shell scroll-snap-align-start"
      style={{ scrollSnapAlign: 'start' }}
    >
      <div className="hero-paper-fibers" aria-hidden="true" />
      <div className="hero-paper-vignette" aria-hidden="true" />
      <div className="hero-paper-frame" aria-hidden="true" />

      <div className="hero-paper-content">
        <h1 className={`hero-name ${isLoaded ? 'is-ready' : ''}`}>
          Zuhaad Rathore
        </h1>
      </div>

      <div className={`hero-paper-scroll ${isLoaded ? 'is-ready' : ''}`}>Scroll to read</div>
    </header>
  )
}
```

- [ ] **Step 2: Build check**

Run: `npm run build`
Expected: Exits 0 with no TypeScript errors.

- [ ] **Step 3: Dev server visual check**

Run: `npm run dev`
Open `http://localhost:3005`
Expected:
- Hero shows only "Zuhaad Rathore" centered in large IM Fell serif type
- "Scroll to read" label at the bottom
- Paper background gradient, fiber, vignette, and frame overlays all intact
- Name fades in ~1s after page load
- No card, no buttons, no sticky notes

- [ ] **Step 4: Commit**
```bash
git add src/components/hero-section.tsx
git commit -m "refactor: gut hero to name-only typographic layout"
```

---

### Task 3: Create SmokeCanvas and wire into hero

**Files:**
- Create: `src/components/smoke-canvas.tsx`
- Modify: `src/components/hero-section.tsx`

- [ ] **Step 1: Create `src/components/smoke-canvas.tsx`**

```tsx
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
```

- [ ] **Step 2: Build check**

Run: `npm run build`
Expected: Exits 0 with no TypeScript errors.

- [ ] **Step 3: Wire SmokeCanvas into hero-section.tsx**

In `src/components/hero-section.tsx`, add the import after the existing imports:
```tsx
import SmokeCanvas from './smoke-canvas'
```

Then add `<SmokeCanvas heroRef={heroRef} />` as the **first child** inside the `<header>` (before the fiber/vignette/frame divs):
```tsx
    <header
      ref={heroRef}
      className="hero-paper-shell scroll-snap-align-start"
      style={{ scrollSnapAlign: 'start' }}
    >
      <SmokeCanvas heroRef={heroRef} />
      <div className="hero-paper-fibers" aria-hidden="true" />
      <div className="hero-paper-vignette" aria-hidden="true" />
      <div className="hero-paper-frame" aria-hidden="true" />

      <div className="hero-paper-content">
        <h1 className={`hero-name ${isLoaded ? 'is-ready' : ''}`}>
          Zuhaad Rathore
        </h1>
      </div>

      <div className={`hero-paper-scroll ${isLoaded ? 'is-ready' : ''}`}>Scroll to read</div>
    </header>
```

- [ ] **Step 4: Build check**

Run: `npm run build`
Expected: Exits 0 with no TypeScript errors.

- [ ] **Step 5: Dev server full visual check**

Run: `npm run dev`
Open `http://localhost:3005`
Expected:
- Soft pale grey smoke blobs drift upward slowly across the whole hero background
- Moving the mouse over the hero gently pushes smoke away from the cursor
- Scrolling down causes the smoke to fade out; fully gone by ~70% scroll depth
- "Zuhaad Rathore" is legible in large IM Fell type above the smoke
- Paper fiber/vignette/frame overlays are visible above the smoke layer
- No visual artifacts at page edges or on mobile viewport

- [ ] **Step 6: Commit**
```bash
git add src/components/smoke-canvas.tsx src/components/hero-section.tsx
git commit -m "feat: add paper smoke canvas effect to hero"
```
