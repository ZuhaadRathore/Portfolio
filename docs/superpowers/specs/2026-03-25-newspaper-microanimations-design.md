# Newspaper Microanimations & Microdetails — Design Spec

**Date:** 2026-03-25
**Project:** Web Portfolio
**Scope:** Polish pass — microanimations and newspaper-themed microdetails across all sections

---

## Overview

A layered polish pass that deepens the portfolio's existing newspaper/print aesthetic. Three compounding layers: global texture sets atmosphere, print marks establish newspaper identity, ink behaviors make interactions feel physical. No structural layout changes — all additions are presentational and additive.

---

## Layer 1: Global Texture & Atmosphere

### Grain Overlay
- Full-page fixed grain using a `::before` pseudo-element on `body`
- Implementation: SVG `feTurbulence` noise filter rendered as a `data:` URI background, tiled at ~200×200px
- Opacity: ~3% — felt more than seen
- `pointer-events: none`, `z-index: 9999`, fixed position covering viewport

### Warm Paper Tint
- Shift `--paper` CSS variable from current value toward warm (~4° hue, slight yellow-cream)
- Target: feels like aged newsprint rather than printer paper
- Adjust in `globals.css`

### Misregistration Shadow on Display Text
- Apply `text-shadow: 1px 1px 0 rgba(208, 0, 0, 0.18), -1px -1px 0 rgba(0,0,0,0.04)` to large display elements:
  - Section index numbers (`.headerIndex` in all sections)
  - Hero name / large display headings
  - Project card titles (`.cardTitle`)
- Simulates CMYK color separation misalignment — print authenticity detail

---

## Layer 2: Typography & Print Marks

### Dateline Stamps
- Added directly below each section header underline (inside the `.header` element)
- Content: `VOL. I · ISSUE 2025` — static, same across all sections
- Styles: `font-family: var(--font-mono)`, `font-size: 0.6rem`, `letter-spacing: 0.18em`, `opacity: 0.28`, `color: var(--ink)`
- Fades in as part of the header's existing scroll-in animation (add to `.headerVisible` state)
- Added to: about, experience, skills, projects sections

### Thick/Thin Newspaper Rule
- Upgrade section header underline (`::after`) from single 2px line to a double rule
- Implementation: use `border-bottom` on the `::after` + a new `::before` on `.header` for the thin companion line, OR use a `box-shadow` trick: `box-shadow: 0 2px 0 rgba(0,0,0,0.35), 0 4px 0 rgba(0,0,0,0.1)` (thick line + 2px gap + thin line)
- The existing left-to-right `scaleX` draw animation is retained
- Apply to all section headers

### Fold Corner on Cards & Tiles
- Pure CSS folded corner, top-right, ~14px
- Implementation: two pseudo-elements forming overlapping triangles — one `var(--paper)`-colored and one `transparent` — creating a physical lift illusion
- Applied to: `.card` in projects section, `.tile` in skills section
- No JS required

### Halftone on Preview / Image Areas
- CSS `radial-gradient` dot pattern overlay on the project card preview and about section photo frame
- Implementation: `background-image: radial-gradient(circle, rgba(0,0,0,0.12) 1px, transparent 1px)`, `background-size: 4px 4px`
- Applied as a `::after` pseudo-element overlay (already in use for borders, so use a wrapper or `outline`-based approach)
- Opacity: ~15% — simulates newspaper photo halftone reproduction

---

## Layer 3: Interactive Ink Behaviors

### Ink-Draw Borders on Scroll-In
- Currently: card/tile `::before` borders appear instantly with the element fade
- Change: animate border reveal via `clip-path: inset(0 100% 0 0)` → `clip-path: inset(0 0% 0 0)` triggered by the existing `.cardVisible` / `.tileVisible` class
- Duration: `0.6s ease-out`, delayed slightly after the element fade begins (`delay: 0.15s`)
- Applied to: `.card` in projects, `.tile` in skills

### Tag Press
- `:hover`: `translateY(-1px)` + `box-shadow: 0 1px 0 rgba(208,0,0,0.25)` (stamp raised off surface)
- `:active`: `transform: scale(0.94)` + `box-shadow: none` (stamp pressing down)
- `transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1)` for spring-back on release
- Applied to: `.entryTag` in experience, `.cardTag` in projects

### Link / Social Ink Bleed
- Normalize all link hover `color` transitions to `0.25s ease-in` across the site
- Currently inconsistent — some are instant, some have `0.2s` but with `ease` (symmetric)
- `ease-in` specifically: ink starts slow then accelerates, matching how ink spreads on fibrous paper
- Applied to: `.socialLink`, `.cardArrow`, `.cardTitle`, `.entryCompany`, nav links

### Ink Drop-Shadow on Roughened Elements
- Elements using `filter: url(#pencil-roughen-soft)` get an additional `drop-shadow(1px 1px 0 rgba(208,0,0,0.08))`
- Stacking: `filter: url(#pencil-roughen-soft) drop-shadow(1px 1px 0 rgba(208,0,0,0.08))`
- Applied to: `.entryTag::before`, `.cardTag::before`, `.socialSep`, section header titles
- Creates ghost red ink bleed on fibrous paper effect

---

## Files Affected

| File | Changes |
|------|---------|
| `src/app/globals.css` | Grain overlay on `body::before`, warm `--paper` variable |
| `src/components/about-section.module.css` | Dateline stamp, thick/thin rule, halftone on photo frame, misregistration on name, ink bleed on socials |
| `src/components/experience-section.module.css` | Dateline stamp, thick/thin rule, tag press, ink drop-shadow on tags |
| `src/components/skills-section.module.css` | Dateline stamp, thick/thin rule, fold corner, ink-draw border, tile name ink bleed |
| `src/components/projects-section.module.css` | Dateline stamp, thick/thin rule, fold corner, ink-draw border, tag press, cardTitle misregistration |
| `src/components/about-section.tsx` | Add dateline stamp span to header markup |
| `src/components/experience-section.tsx` | Add dateline stamp span to header markup |
| `src/components/skills-section.tsx` | Add dateline stamp span to header markup |
| `src/components/projects-section.tsx` | Add dateline stamp span to header markup |

---

## Accessibility

- All additions are purely visual/decorative
- `prefers-reduced-motion`: grain overlay remains (not motion), all transition/animation additions wrapped in `@media (prefers-reduced-motion: no-preference)` where applicable
- Fold corners and halftone patterns use `pointer-events: none` and no semantic meaning

---

## Out of Scope

- Structural layout changes (columns, mastheads, full page redesign)
- New components beyond a dateline stamp span
- JavaScript changes beyond the dateline span additions to TSX markup
- Font changes
