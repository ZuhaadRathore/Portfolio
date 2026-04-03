# Charcoal Smoke Design

**Date:** 2026-03-27
**Status:** Approved
**Scope:** `src/components/ui/spooky-smoke-animation.tsx` (fragment shader only)

---

## Summary

Rework the smoke shader to feel hand-drawn — specifically charcoal on paper. More smoke in the corners, with posterized density bands and scratchy anisotropic stroke texture at band edges. No JS/React changes.

---

## Goals

1. Smoke feels drawn rather than procedurally smooth
2. More smoke density in corners at the fully revealed state
3. Charcoal aesthetic: visible layering (bands), scratchy edges, directional grain

---

## Shader Changes

### 1. Posterized Density Bands

After computing `density = (r + g + b) / 3.0`, quantize into 3 discrete levels:

```glsl
float bandCount = 3.0;
float bandT = density * bandCount;
float band = floor(bandT) / bandCount;
```

`band` replaces `density` as the input to the `smoothstep` alpha threshold. Creates three distinct smoke masses instead of a smooth continuous gradient — the defining characteristic of charcoal layering.

### 2. Anisotropic Scratch Texture

High-frequency noise stretched diagonally to simulate charcoal stroke direction:

```glsl
vec2 scratchUV = vec2(uv.x * 1.6 - uv.y * 0.5, uv.y * 0.4 + uv.x * 0.2) * 38.0;
float scratch = noise(scratchUV + vec2(T * 0.008, 0.0));
```

Applied multiplicatively to alpha. Contribution is weighted by `atEdge` (see below) so it hits hardest at band transitions.

### 3. Band-Edge Roughness

`fract(bandT)` approaches 0 at every band boundary. Use this to detect transitions and amplify scratch there:

```glsl
float edgeFrac = fract(bandT);
float atEdge = 1.0 - smoothstep(0.0, 0.18, edgeFrac) * smoothstep(1.0, 0.82, edgeFrac);
// ~1 near band transitions, ~0 in band interiors
charcoalAlpha *= mix(1.0, scratch, 0.3 + atEdge * 0.5);
```

Smooth interior per band, rough/scratchy boundary — matches how charcoal strokes look on paper.

### 4. Body Grain

Medium-frequency noise adds gentle roughness throughout the smoke body:

```glsl
float grain = noise(uv * 18.0 + vec2(0.0, T * 0.01));
charcoalAlpha *= mix(0.88, 1.0, grain);
```

Slow drift over time keeps it from looking like a static texture.

### 5. More Smoke in Corners

Increase the final revealed corner parameters (the `u_reveal=1` end of the `mix`):

| Parameter | Old | New |
|-----------|-----|-----|
| Corner radius multiplier (revealed) | `2.4` | `2.8` |
| Corner falloff power (revealed) | `2.8` | `4.0` |
| Alpha multiplier | `1.5` | `2.2` |

The cinematic reveal animation drives these via:
```glsl
float cornerRadius = mix(0.4, 2.8, u_reveal);
float cornerPower  = mix(0.8, 4.0, u_reveal);
```

Higher power means denser smoke at the corners with a sharper dropoff toward center — smoke concentrates harder into the corners while the center stays clear.

---

## What Does Not Change

- Smoke color (`#D00000`)
- FBM noise structure (5-octave fbm)
- Mouse repulsion logic
- Text zone suppression
- Corner reveal animation timing (1200ms ease-out cubic)
- All JS/React code — Renderer class, SmokeBackground, HeroSection
- WebGL setup, blend mode, canvas sizing

---

## Files Modified

| File | Change |
|------|--------|
| `src/components/ui/spooky-smoke-animation.tsx` | Fragment shader only — posterize, scratch, grain, corner params |
