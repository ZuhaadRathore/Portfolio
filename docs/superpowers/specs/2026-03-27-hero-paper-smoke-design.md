# Hero: Paper Smoke Effect + Full-Width Name

**Date:** 2026-03-27
**Status:** Approved

## Summary

Redesign the portfolio hero section into a full-viewport typographic statement — just the name "Zuhaad Rathore" centered in large IM Fell display type — with an ambient paper smoke effect rendered on a canvas behind it. Smoke reacts to mouse movement and fades on scroll.

---

## Layout

- Hero is full-viewport height, content centered horizontally and vertically
- **Only two elements remain:** the name and the "Scroll to read" indicator
- All other content is removed: edition label, kicker, copy, buttons, notes stack
- Name: `var(--font-display)` (IM Fell), fluid size `clamp(4rem, 14vw, 11rem)`, single line or natural wrap, tight letter-spacing, color `#2b1f16`
- "Scroll to read" indicator stays at bottom center, unchanged

## Layer Order (back to front)

| z-index | Layer |
|---------|-------|
| 0 | Paper background gradient (CSS on `.hero-paper-shell`) |
| 0 | `<SmokeCanvas>` — absolute, inset 0 |
| 0 | `.hero-paper-fibers` overlay |
| 1 | `.hero-paper-vignette` overlay |
| 2 | `.hero-paper-frame` overlay |
| 3 | Name + scroll indicator (content) |

The existing grain texture on `body::after` (z-index 9999) sits above everything, giving the smoke a fibrous paper appearance for free.

---

## SmokeCanvas Component

**File:** `src/components/smoke-canvas.tsx`
Client component. Renders a `<canvas>` absolutely filling the hero shell.

### Particle Schema

Each particle holds:
- `x, y` — position, spawned randomly across full canvas dimensions
- `vx, vy` — velocity; `vy` is −0.15 to −0.4 px/frame (upward drift), `vx` near-zero
- `radius` — 60–140px, randomized at spawn
- `baseAlpha` — 0→peak→0 lifecycle eased over 8–14 seconds total lifespan; at peak, 0.08–0.18
- `age, lifespan` — frame counters; particle respawns at a random position when lifespan is reached
- `phase` — random offset for sine-wave lateral wobble, so particles don't move in sync

**Count:** 50 particles, staggered initial ages across the full lifespan range so the canvas isn't empty on first frame.

### Drawing

Each particle is drawn as `ctx.createRadialGradient`:
- Center stop: `rgba(160, 155, 150, computedAlpha)`
- Edge stop: `rgba(160, 155, 150, 0)`

`globalCompositeOperation` is set to `'multiply'` so particles darken the warm parchment background, producing a natural pale grey smoke tone.

### Ambient Motion

Each frame:
```
x += vx + sin(age * 0.018 + phase) * 0.3
y += vy
age++
```
When `age >= lifespan`, respawn at random `(x, y)` with new randomized properties.

### Mouse Interaction

`mousemove` on the hero element → update a `mousePos` ref.

Each frame, for every particle within 200px of the cursor:
```
push = (1 - dist / 200) * 0.8
vx += (dx / dist) * -push   // push away from cursor
vy += (dy / dist) * -push
```
Velocity decays: `vx *= 0.96`, `vy = lerp(vy, baseVy, 0.02)` per frame.

### Scroll Fade

`scroll` listener on `window` → compute:
```
scrollProgress = window.scrollY / heroHeight
alphaMultiplier = clamp(1 - (scrollProgress - 0.4) / 0.3, 0, 1)
```
Fade begins at 40% scroll depth, fully gone at 70%. All particle alphas are multiplied by `alphaMultiplier` before drawing.

### Reduced Motion

If `window.matchMedia('(prefers-reduced-motion: reduce)').matches`, do not start the `requestAnimationFrame` loop. Canvas remains empty (transparent).

### Cleanup

`useEffect` returns a cleanup that cancels the RAF loop and removes event listeners.

---

## CSS Changes (`globals.css`)

### `.hero-paper-shell`
- No structural changes; keep background gradient, overflow hidden, isolation

### Remove / simplify
- `.hero-paper-main` card styles (gradient background, border, box-shadow, tape pseudo-elements) → replaced with simple centered flex wrapper or removed entirely
- `.hero-paper-content` grid → replaced with centered flex layout
- `.hero-paper-stack`, `.hero-paper-note`, `.hero-paper-note-label` → deleted
- `.hero-paper-edition`, `.hero-paper-kicker`, `.hero-paper-copy`, `.hero-paper-actions`, `.hero-paper-btn` → deleted

### New / updated rules
- `.hero-name` — centered, `var(--font-display)`, `clamp(4rem, 14vw, 11rem)`, `line-height: 0.95`, `color: #2b1f16`, `text-align: center`, `z-index: 3`, `position: relative`
- Canvas element — `position: absolute; inset: 0; width: 100%; height: 100%; z-index: 0; pointer-events: none`
- `.hero-paper-content` — `display: flex; align-items: center; justify-content: center; width: 100%; padding: clamp(1rem, 4vw, 3rem)`

---

## hero-section.tsx Changes

- Remove: edition, kicker, copy, actions, notes stack JSX
- Add: `<SmokeCanvas>` as first child of `hero-paper-shell`
- Rename `hero-paper-main` → `hero-name` (or inline the class change)
- `isLoaded` fade-in: apply `is-ready` to the name element only (opacity 0→1, translateY 24px→0), same timing as before
- Pass a ref to the hero `<header>` element down into `SmokeCanvas` for the mouse listener attachment

---

## Out of Scope

- Paper background gradient — unchanged
- Fiber / vignette / frame SVG overlays — unchanged
- Body grain texture — unchanged
- `--font-display`, color variables — unchanged
- Scroll indicator — unchanged
- Header / nav — unchanged
- All other sections — unchanged
