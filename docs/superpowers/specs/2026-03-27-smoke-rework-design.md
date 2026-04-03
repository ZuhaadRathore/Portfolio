# Smoke Rework Design

**Date:** 2026-03-27
**Status:** Approved
**Scope:** `src/components/ui/spooky-smoke-animation.tsx`, `src/components/hero-section.tsx`

---

## Summary

Rework the WebGL smoke effect on the hero to be more visible, more dramatically reactive to the mouse, properly concentrated in all 4 corners, and animated to retreat from a screen-wide opening state as the hero name fades in.

---

## Goals

1. Smoke is clearly visible on parchment (currently barely perceptible)
2. All 4 corners emit dense smoke; center stays clear — name appears to split the smoke
3. Mouse creates a large, dramatic parting effect
4. On load: smoke covers ~60% of screen, retreats to corners over ~1.2s as name fades in
5. Keep red (#D00000) — intentional contrast against parchment theme

---

## Shader Changes (fragment shader)

### 1. Visibility
- Lower density threshold: `smoothstep(0.72, 1.35, density)` → `smoothstep(0.52, 1.1, density)`
- Raise final alpha multiplier: `alpha * 0.82` → `alpha * 1.5`
- More FBM density regions pass through; smoke is clearly visible on parchment

### 2. Corner Sharpness
- Steepen corner mask falloff power: `1.3` → `2.8`
- Smoke is denser at corners and drops off harder toward center
- Current: `pow(clamp(1.0 - d * 2.1, 0.0, 1.0), 1.3)`
- New: `pow(clamp(1.0 - d * 2.4, 0.0, 1.0), 2.8)`
- Larger radius multiplier (2.4 > 2.1) = tighter corners; higher power = sharper falloff

### 3. Text Repulsion Zone (new)
- New uniforms: `u_text_center` (vec2), `u_text_radius` (float)
- UV coordinates pushed outward from text center using same technique as mouse repulsion
- Alpha suppressed within the zone
- Values: center `(0.5, 0.5)`, radius `0.32`
- Static — set once on mount, not dynamic

### 4. Cinematic Reveal (new)
- New uniform: `u_reveal` (float, 0→1)
- At `0`: corner mask radius is wide — smoke covers ~60% of screen
- At `1`: corners tighten to final shape
- Implemented by modulating the corner mask radius multiplier: `mix(0.4, 2.4, u_reveal)` replaces the hardcoded `2.1`
- At `u_reveal=0`: multiplier=0.4 → smoke bleeds far from corners across ~75% of screen
- At `u_reveal=1`: multiplier=2.4 → tight corners, final resting state
- Allows the corner mask to start loose (wide coverage) and tighten as reveal progresses

### 5. Mouse Drama
- Expand repulsion radius: `smoothstep(0.55, 0.0, mouseDist)` → `smoothstep(0.75, 0.0, mouseDist)`
- Increase UV distortion: `0.28` → `0.55`
- Increase alpha kill: `mouseEffect * 0.85` → `mouseEffect * 0.97`
- Result: large, sharp smoke parting that follows the cursor

---

## JS/React Changes

### Renderer class
- Cache new uniform locations in `init()`: `u_reveal`, `u_text_center`, `u_text_radius`
- Add `updateReveal(v: number)` method
- Add `updateTextZone(cx: number, cy: number, r: number)` method
- Both follow the existing `updateMouse` pattern

### SmokeBackground component
- New prop: `reveal: boolean` (default `false`)
- When `reveal` flips `true`, run a one-shot easing animation:
  - Duration: 1200ms
  - Curve: ease-out (e.g. `1 - Math.pow(1 - t, 3)`)
  - Drives `renderer.updateReveal(easedValue)` each frame
- Set text zone once on mount: `renderer.updateTextZone(0.5, 0.5, 0.32)`
- Before reveal fires, `u_reveal` stays at `0`

### HeroSection component
- Pass `reveal={isLoaded}` to `SmokeBackground`
- No other changes

---

## What Does Not Change

- Smoke color (#D00000) — intentional
- FBM noise structure — retain current 5-octave fbm
- WebGL setup, blend mode, canvas sizing — no changes
- Mouse tracking logic in JS — only shader-side values change

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/ui/spooky-smoke-animation.tsx` | Shader constants, Renderer methods, SmokeBackground props |
| `src/components/hero-section.tsx` | Pass `reveal={isLoaded}` prop |
