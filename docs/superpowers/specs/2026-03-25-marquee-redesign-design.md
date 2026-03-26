# Marquee Redesign — Design Spec

**Date:** 2026-03-25
**Status:** Approved

---

## Overview

Redesign `src/components/marquee.tsx` and `src/components/marquee.module.css` as a visually full-SVG marquee band with a newspaper print/press aesthetic. The implementation uses a **layered approach**: a full-width background SVG provides the torn-paper edges and halftone texture, while the scrolling HTML content sits on top.

No Lucide or third-party icon libraries.

---

## Visual Direction

**Theme:** Old broadsheet letterpress — the band looks like a strip torn from a newspaper and pressed with heavy ink. Halftone dots visible against the dark background. Irregular torn edges top and bottom. Red accent dingbats between items.

**Colors:** `var(--ink)` background, `var(--paper-light)` text, `var(--red)` accents.
**Font:** `var(--font-mono)` / Space Mono, uppercase, 0.9rem, letter-spacing 0.1em.
**Tilt:** Wrapping `<div>` keeps `transform: rotate(-1.5deg) scaleX(1.1)` — unchanged.

---

## DOM Structure

```
.marqueeShell         — position: relative; overflow: hidden; margin-top: -6rem; padding: 4rem 0; z-index: 10
  <svg width="0" height="0" aria-hidden>   ← FILTER-ONLY SVG (no visible output)
    <defs>
      <filter id="sketch-rough-mq"> ... </filter>
    </defs>
  </svg>
  .marqueeWrapper     — position: relative; height: 64px; overflow: hidden; transform: rotate(-1.5deg) scaleX(1.1)
    <svg .marqueeBackground>   ← VISUAL BAND SVG (no defs, no filter)
      <path>  — torn-edge band fill var(--ink)
      <rect>  — halftone overlay fill url(#halftone) opacity 0.12
      <pattern> — defined here, id="halftone"
    </svg>
    .marqueeScroll    — position: relative; z-index: 1; height: 100%; overflow: hidden; white-space: nowrap; display: flex; align-items: center
      .marqueeTrack   — CSS animated, 3 copies
        .marqueeGroup — 8 items each
          .itemWrapper
            .itemContent — icon SVG + label text
            .separator   — wraps one dingbat SVG
```

**Important — filter scope:** The `sketch-rough-mq` filter is defined **only** in the standalone zero-size `<svg>` element (first child of `.marqueeShell`). The background SVG contains **no `<defs>` and no filter definition**. `filter="url(#sketch-rough-mq)"` on icon SVGs resolves correctly because the zero-size SVG is inline in the same HTML document body. This matches the existing pattern in the current codebase.

**Important — overflow clipping:** `.marqueeWrapper` has `overflow: hidden`. The background SVG fills the wrapper exactly via `position: absolute; inset: 0`. The SVG viewBox is `0 0 1200 64` and the wrapper height is `64px`. The torn path's y-coordinates span 0–7 (top) and 57–64 (bottom) — both within the 64-unit height. Consequently `overflow: hidden` does not clip the torn edges; it only clips content that would extend beyond the 64px wrapper.

---

## Standalone Filter SVG

```jsx
<svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
  <defs>
    <filter id="sketch-rough-mq" colorInterpolationFilters="sRGB"
            x="-10%" y="-10%" width="120%" height="120%">
      <feTurbulence type="fractalNoise" baseFrequency="0.04"
                    numOctaves="3" result="noise" />
      <feDisplacementMap in="SourceGraphic" in2="noise"
                         scale="0.8" xChannelSelector="R" yChannelSelector="G" />
    </filter>
  </defs>
</svg>
```

---

## Background SVG

```
viewBox="0 0 1200 64"
width="100%"
height="100%"
preserveAspectRatio="none"
```

Contains:
1. `<defs>` with halftone pattern (see below)
2. Torn-edge `<path>` filling with `var(--ink)`
3. Halftone `<rect>` overlay

### Torn-Edge Path

```
M 0,6
L 60,2  L 120,7  L 200,1  L 270,5  L 350,0
L 420,4 L 500,2  L 580,7  L 650,1  L 730,5
L 810,0 L 880,4  L 960,2  L 1040,6 L 1120,1
L 1200,4
L 1200,59
L 1130,64 L 1060,60 L 980,57  L 910,63 L 830,59
L 750,64  L 670,60  L 590,57  L 510,62 L 430,59
L 350,64  L 270,60  L 190,57  L 110,63 L 40,59
L 0,57
Z
```

`fill="var(--ink)"` — no stroke.

### Halftone Pattern and Overlay

```xml
<defs>
  <pattern id="halftone" x="0" y="0" width="10" height="10"
           patternUnits="userSpaceOnUse">
    <circle cx="5" cy="5" r="1.8" fill="white" />
  </pattern>
</defs>
<rect x="0" y="0" width="1200" height="64"
      fill="url(#halftone)" opacity="0.12" />
```

`patternUnits="userSpaceOnUse"` with `preserveAspectRatio="none"` means the dot pattern scales horizontally with the SVG viewport. At typical screen widths (1200–1920px), the x-scale factor is 1.0–1.6×, mildly squishing the dot spacing. At `opacity="0.12"` this distortion is imperceptible — the halftone is purely textural. This is the accepted trade-off.

---

## Custom SVG Icons

**Shared attributes on each `<svg>` element:**
`viewBox="0 0 20 20"`, `stroke="currentColor"`, `strokeWidth="1.5"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `fill="none"`, `filter="url(#sketch-rough-mq)"`.

**`filter` is hardcoded inside each icon function** — not applied by the caller.

Each icon is a named function `(cls?: string) => JSX.Element`. The `<svg>` receives `className={cls}`. The caller passes `styles.itemIcon` as `cls`, providing `color: var(--red); width: 20px; height: 20px` — this sets `stroke` via `currentColor` inheritance.

All coordinates are in the `0 0 20 20` coordinate space:

| Item | Icon — explicit shapes |
|------|----------------------|
| WEB DEVELOPMENT | Left bracket: `M 5,4 L 3,10 L 5,16`. Right bracket: `M 15,4 L 17,10 L 15,16`. Slash: `M 12,4 L 8,16`. Cursor: `M 9,17.5 L 12,17.5` |
| SYSTEMS DESIGN | Nodes: circles r=2 at (3,10), (10,4), (17,10). Edges: lines (3,10)→(10,4), (10,4)→(17,10), (3,10)→(17,10). Midpoint dots: filled circles r=1 at (6.5,7), (13.5,7), (10,10) |
| UI ENGINEERING | Outer rect: `rect x=1.5 y=2 width=17 height=16`. Header line: `M 1.5,7 L 18.5,7`. Sidebar line: `M 6.5,7 L 6.5,18`. Content lines: `M 9,11 L 17,11` and `M 9,14 L 17,14` |
| API ARCHITECTURE | Left plug body: `rect x=1 y=8 width=5 height=6`. Prongs: `M 2.5,8 L 2.5,6` and `M 4.5,8 L 4.5,6`. Right socket body: `rect x=14 y=8 width=5 height=6`. Notches: `M 15.5,8 L 15.5,10` and `M 17.5,8 L 17.5,10`. Arrow: `M 7,11 L 13,11 M 11,9 L 13,11 L 11,13 M 9,9 L 7,11 L 9,13` |
| PERFORMANCE TUNING | Arc: `M 2,15 A 8,8 0 0,1 18,15`. 5 tick marks evenly on arc. Needle: `M 10,15 L 6,8`. Pivot: filled circle r=1.5 at (10,15) |
| DEVOPS & CI/CD | Box 1: `rect x=1 y=8 width=4 height=4 rx=1`. Box 2: `rect x=8 y=8 width=4 height=4 rx=1`. Box 3: `rect x=15 y=8 width=4 height=4 rx=1`. Arrows: `M 5,10 L 8,10 M 7,9 L 8,10 L 7,11` and `M 12,10 L 15,10 M 14,9 L 15,10 L 14,11`. Loop above center box: `M 8.5,6 A 2.5,2.5 0 1,1 11.5,6 M 11.5,4.5 L 11.5,6 L 13,6` |
| 3D & WEBGL | Top face: `M 10,1 L 17,5 L 10,9 L 3,5 Z`. Left face: `M 3,5 L 3,13 L 10,17 L 10,9`. Right face: `M 17,5 L 17,13 L 10,17 L 10,9`. Shading lines across top: `M 5,7 L 12,3`, `M 7,8 L 14,4`, `M 9,9 L 16,5` |
| TOOLING & AUTOMATION | Handle: `M 4,17 L 11,10`. Head circle: `circle cx=14 cy=6 r=4`. Hex lines (6 at 60° intervals from center): each `M 14,6 L ...` extending r=3. Bolt: filled `circle cx=14 cy=6 r=1.5` |

---

## Ornamental Dingbat Separators

**DOM position:** Each `.separator` div (retained as wrapper) contains exactly one dingbat `<svg>` element with `.sepIcon` class. The old `.sepDot` and `.sepLine` child elements are removed.

**Shared attributes on dingbat `<svg>`:** `viewBox="0 0 16 16"`, `fill="none"`, `stroke="currentColor"`, `strokeWidth="1.2"`, `strokeLinecap="round"`.

`.sepIcon` class: `color: var(--red); opacity: 0.55; width: 14px; height: 14px`.

6 dingbats cycling by `index % 6` (index = item's position in STACK_ITEMS):

| # | Name | Paths — all in 0 0 16 16 space |
|---|------|-------------------------------|
| 0 | Fleuron | Left arc: `M 8,2 C 4,3 2,7 5,11 C 6,13 7,13 7,14`. Right arc: `M 8,2 C 12,3 14,7 11,11 C 10,13 9,13 9,14`. Stem: `M 7,14 L 8,15 L 9,14` |
| 1 | Asterism | Filled circles r=1 at (8,3), (4,12), (12,12). Lines: `M 8,4 L 4,11`, `M 8,4 L 12,11`, `M 5,12 L 11,12` |
| 2 | Six-point star | Up triangle: `M 8,1 L 14,11 L 2,11 Z`. Down triangle: `M 8,15 L 2,5 L 14,5 Z` |
| 3 | Cross-hatch diamond | Outline: `M 8,1 L 15,8 L 8,15 L 1,8 Z`. Interior: `M 3.5,8 L 12.5,8` and `M 8,3.5 L 8,12.5` |
| 4 | Section curl | Top serif: `M 5.5,2 L 10.5,2`. Upper S: `M 8,2 C 12,2 12,8 8,8`. Lower S: `M 8,8 C 4,8 4,14 8,14`. Bottom serif: `M 5.5,14 L 10.5,14` |
| 5 | Pilcrow | Staff lines: `M 9,7 L 9,14` and `M 11,7 L 11,14`. Cap: `M 7,7 A 2,2 0 0,1 11,7` |

---

## Scrolling Mechanism

Animation on `.marqueeTrack` (HTML `div`):

```css
@keyframes scroll {
  from { transform: translate3d(0, 0, 0); }
  to   { transform: translate3d(-33.333%, 0, 0); }
}
.marqueeTrack {
  display: flex;
  width: max-content;
  animation: scroll 45s linear infinite;
  will-change: transform;
}
.marqueeTrack:hover { animation-play-state: paused; }
@media (prefers-reduced-motion: reduce) {
  .marqueeTrack { animation: none; transform: translate3d(0, 0, 0); }
}
```

`-33.333%` resolves against the `div`'s own `max-content` width. Three groups ensure seamless loop. `renderTags` is called exactly 3 times (keys `'a'`, `'b'`, `'c'`); groups `'b'` and `'c'` get `aria-hidden="true"`.

---

## CSS Module Class Inventory

| Class | Status | Definition |
|-------|--------|------------|
| `@keyframes scroll` | Kept | Unchanged |
| `.marqueeShell` | Kept | `position: relative; overflow: hidden; margin-top: -6rem; padding: 4rem 0; z-index: 10;` |
| `.marqueeWrapper` | Updated | Remove `background`, `border-top`, `border-bottom`, `box-shadow`. Keep `position: relative; height: 64px; overflow: hidden; transform: rotate(-1.5deg) scaleX(1.1); transform-origin: center;` |
| `.marqueeBackground` | New | `position: absolute; inset: 0; width: 100%; height: 100%; display: block;` |
| `.marqueeScroll` | New | `position: relative; z-index: 1; height: 100%; overflow: hidden; white-space: nowrap; display: flex; align-items: center;` |
| `.marqueeTrack` | Kept | `display: flex; width: max-content; animation: scroll 45s linear infinite; will-change: transform;` + hover + reduced motion |
| `.marqueeGroup` | Kept | `display: flex; align-items: center; flex-shrink: 0;` |
| `.itemWrapper` | Kept | `display: flex; align-items: center; padding: 0 1.5rem;` |
| `.itemContent` | Kept | `display: flex; align-items: center; gap: 0.75rem;` |
| `.itemIcon` | Updated | `color: var(--red); opacity: 0.9; width: 20px; height: 20px;` |
| `.marqueeTag` | Kept | `font-family: var(--font-mono); font-size: 0.9rem; font-weight: 700; letter-spacing: 0.1em; text-transform: uppercase; color: var(--paper-light);` |
| `.separator` | Updated | `display: flex; align-items: center; margin-left: 3rem;` — children replaced by one `.sepIcon` SVG |
| `.sepIcon` | New | `color: var(--red); opacity: 0.55; width: 14px; height: 14px;` |
| `.sepDot` | Removed | — |
| `.sepLine` | Removed | — |

---

## What Does NOT Change

- `margin-top: -6rem` and `z-index: 10` on `.marqueeShell`
- Tilt and scaleX on `.marqueeWrapper`
- 8 STACK_ITEMS with same labels, hardcoded, no props
- `aria-label` on `.marqueeShell`
- `aria-hidden="true"` on groups `'b'` and `'c'`

---

## Files Changed

| File | Change |
|------|--------|
| `src/components/marquee.tsx` | Full rewrite |
| `src/components/marquee.module.css` | Updated per class inventory |

No new files. No new dependencies.
