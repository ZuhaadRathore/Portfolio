# Marquee Redesign Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Replace the HTML-div marquee band with a layered SVG background (torn-paper edges + halftone) over scrolling HTML content, with new custom 20×20 icons and 6 ornamental dingbat separators.

**Architecture:** A standalone zero-size `<svg>` defines the sketch displacement filter at document scope. An absolutely-positioned background `<svg>` renders the visual band (torn-edge path + halftone overlay). The existing HTML scroll structure sits on top as `.marqueeScroll` > `.marqueeTrack`. Icons are 20×20 custom outline SVGs; separators are 16×16 ornamental dingbats cycling by index.

**Tech Stack:** Next.js 14, TypeScript, CSS Modules, inline SVG (no new dependencies)

---

## File Map

| File | Change |
|------|--------|
| `src/components/marquee.module.css` | Full rewrite per class inventory in spec |
| `src/components/marquee.tsx` | Full rewrite — new DOM structure, icons, dingbats |

---

### Task 1: Rewrite CSS Module

**Files:**
- Modify: `src/components/marquee.module.css`

- [ ] **Step 1: Replace the entire CSS file** with the new class inventory

  ```css
  @keyframes scroll {
    from { transform: translate3d(0, 0, 0); }
    to   { transform: translate3d(-33.333%, 0, 0); }
  }

  .marqueeShell {
    position: relative;
    overflow: hidden;
    margin-top: -6rem;
    padding: 4rem 0;
    z-index: 10;
  }

  .marqueeWrapper {
    position: relative;
    height: 64px;
    overflow: hidden;
    transform: rotate(-1.5deg) scaleX(1.1);
    transform-origin: center;
  }

  .marqueeBackground {
    position: absolute;
    inset: 0;
    width: 100%;
    height: 100%;
    display: block;
  }

  .marqueeScroll {
    position: relative;
    z-index: 1;
    height: 100%;
    overflow: hidden;
    white-space: nowrap;
    display: flex;
    align-items: center;
  }

  .marqueeTrack {
    display: flex;
    width: max-content;
    animation: scroll 45s linear infinite;
    will-change: transform;
  }

  .marqueeTrack:hover {
    animation-play-state: paused;
  }

  .marqueeGroup {
    display: flex;
    align-items: center;
    flex-shrink: 0;
  }

  .itemWrapper {
    display: flex;
    align-items: center;
    padding: 0 1.5rem;
  }

  .itemContent {
    display: flex;
    align-items: center;
    gap: 0.75rem;
  }

  .itemIcon {
    color: var(--red);
    opacity: 0.9;
    width: 20px;
    height: 20px;
  }

  .marqueeTag {
    font-family: var(--font-mono);
    font-size: 0.9rem;
    font-weight: 700;
    letter-spacing: 0.1em;
    text-transform: uppercase;
    color: var(--paper-light);
  }

  .separator {
    display: flex;
    align-items: center;
    margin-left: 3rem;
  }

  .sepIcon {
    color: var(--red);
    opacity: 0.55;
    width: 14px;
    height: 14px;
  }

  @media (prefers-reduced-motion: reduce) {
    .marqueeTrack {
      animation: none;
      transform: translate3d(0, 0, 0);
    }
  }
  ```

- [ ] **Step 2: Verify the file saved correctly** — check no old classes (`.sepDot`, `.sepLine`, `.--marquee-tilt`) remain

  ```bash
  grep -n "sepDot\|sepLine\|marquee-tilt\|background:" src/components/marquee.module.css
  ```

  Expected: no output (all removed).

- [ ] **Step 3: Commit**

  ```bash
  git add src/components/marquee.module.css
  git commit -m "refactor: rewrite marquee CSS module for SVG layered band"
  ```

---

### Task 2: Rewrite marquee.tsx — Structure and Background SVG

**Files:**
- Modify: `src/components/marquee.tsx`

Replace the entire file contents. Build up the new component in stages, starting with the shell/wrapper structure and background SVG. Icons and dingbats come in Task 3 — use placeholder stubs here.

- [ ] **Step 1: Write the new file with stub icons and dingbats**

  Replace `src/components/marquee.tsx` entirely:

  ```tsx
  'use client'

  import styles from './marquee.module.css'

  // ─── Background SVG ────────────────────────────────────────────────────────

  const TORN_PATH =
    'M 0,6 L 60,2 L 120,7 L 200,1 L 270,5 L 350,0 ' +
    'L 420,4 L 500,2 L 580,7 L 650,1 L 730,5 ' +
    'L 810,0 L 880,4 L 960,2 L 1040,6 L 1120,1 ' +
    'L 1200,4 L 1200,59 ' +
    'L 1130,64 L 1060,60 L 980,57 L 910,63 L 830,59 ' +
    'L 750,64 L 670,60 L 590,57 L 510,62 L 430,59 ' +
    'L 350,64 L 270,60 L 190,57 L 110,63 L 40,59 ' +
    'L 0,57 Z'

  // Note: BandBackground contains <defs> for the halftone <pattern> — this is correct.
  // The spec's "background SVG has no <defs>" note refers specifically to the filter
  // definition (which lives in the standalone zero-size SVG). The halftone pattern
  // must be defined here, inside BandBackground, so url(#halftone) resolves correctly.
  function BandBackground() {
    return (
      <svg
        className={styles.marqueeBackground}
        viewBox="0 0 1200 64"
        preserveAspectRatio="none"
        aria-hidden="true"
      >
        <defs>
          <pattern
            id="halftone"
            x="0" y="0"
            width="10" height="10"
            patternUnits="userSpaceOnUse"
          >
            <circle cx="5" cy="5" r="1.8" fill="white" />
          </pattern>
        </defs>
        <path d={TORN_PATH} fill="var(--ink)" />
        <rect x="0" y="0" width="1200" height="64" fill="url(#halftone)" opacity="0.12" />
      </svg>
    )
  }

  // ─── Placeholder icon (stub — replaced in Task 3) ─────────────────────────

  function StubIcon({ className }: { className?: string }) {
    return (
      <svg
        viewBox="0 0 20 20"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
        filter="url(#sketch-rough-mq)"
        className={className}
        aria-hidden="true"
      >
        <circle cx="10" cy="10" r="6" />
      </svg>
    )
  }

  // ─── Placeholder dingbat (stub — replaced in Task 4) ──────────────────────

  function StubDingbat({ className }: { className?: string }) {
    return (
      <svg
        viewBox="0 0 16 16"
        fill="none"
        stroke="currentColor"
        strokeWidth="1.2"
        strokeLinecap="round"
        className={className}
        aria-hidden="true"
      >
        <circle cx="8" cy="8" r="3" />
      </svg>
    )
  }

  // ─── Stack items ──────────────────────────────────────────────────────────

  const STACK_ITEMS = [
    { text: 'WEB DEVELOPMENT',    icon: (cls?: string) => <StubIcon className={cls} /> },
    { text: 'SYSTEMS DESIGN',     icon: (cls?: string) => <StubIcon className={cls} /> },
    { text: 'UI ENGINEERING',     icon: (cls?: string) => <StubIcon className={cls} /> },
    { text: 'API ARCHITECTURE',   icon: (cls?: string) => <StubIcon className={cls} /> },
    { text: 'PERFORMANCE TUNING', icon: (cls?: string) => <StubIcon className={cls} /> },
    { text: 'DEVOPS & CI/CD',     icon: (cls?: string) => <StubIcon className={cls} /> },
    { text: '3D & WEBGL',         icon: (cls?: string) => <StubIcon className={cls} /> },
    { text: 'TOOLING & AUTOMATION', icon: (cls?: string) => <StubIcon className={cls} /> },
  ]

  const DINGBATS = [
    (cls?: string) => <StubDingbat className={cls} />,
    (cls?: string) => <StubDingbat className={cls} />,
    (cls?: string) => <StubDingbat className={cls} />,
    (cls?: string) => <StubDingbat className={cls} />,
    (cls?: string) => <StubDingbat className={cls} />,
    (cls?: string) => <StubDingbat className={cls} />,
  ]

  // ─── Component ────────────────────────────────────────────────────────────

  export default function Marquee() {
    const renderTags = (keyPrefix: string) =>
      STACK_ITEMS.map((item, i) => (
        <div key={`${keyPrefix}-${i}`} className={styles.itemWrapper}>
          <div className={styles.itemContent}>
            {item.icon(styles.itemIcon)}
            <span className={styles.marqueeTag}>{item.text}</span>
          </div>
          <div className={styles.separator}>
            {DINGBATS[i % 6](styles.sepIcon)}
          </div>
        </div>
      ))

    return (
      <div className={styles.marqueeShell} aria-label="Tech stack and focus areas">
        {/* Filter definition — must be in document body scope for cross-SVG url() refs */}
        <svg width="0" height="0" style={{ position: 'absolute' }} aria-hidden="true">
          <defs>
            <filter
              id="sketch-rough-mq"
              colorInterpolationFilters="sRGB"
              x="-10%" y="-10%" width="120%" height="120%"
            >
              <feTurbulence type="fractalNoise" baseFrequency="0.04" numOctaves={3} result="noise" />
              <feDisplacementMap in="SourceGraphic" in2="noise" scale={0.8} xChannelSelector="R" yChannelSelector="G" />
            </filter>
          </defs>
        </svg>

        <div className={styles.marqueeWrapper}>
          <BandBackground />
          <div className={styles.marqueeScroll}>
            <div className={styles.marqueeTrack}>
              <div className={styles.marqueeGroup}>{renderTags('a')}</div>
              <div className={styles.marqueeGroup} aria-hidden="true">{renderTags('b')}</div>
              <div className={styles.marqueeGroup} aria-hidden="true">{renderTags('c')}</div>
            </div>
          </div>
        </div>
      </div>
    )
  }
  ```

- [ ] **Step 2: Start dev server and visually verify the band renders**

  ```bash
  npm run dev
  ```

  Open `http://localhost:3005`. Check:
  - Dark ink band is visible with torn top/bottom edges
  - Halftone dot texture is faintly visible inside band
  - Stub circle icons and dingbats appear (red circles), text scrolls
  - No console errors about missing filter or CSS

- [ ] **Step 3: Commit stub structure**

  ```bash
  git add src/components/marquee.tsx
  git commit -m "refactor: rewrite marquee with SVG band structure (stub icons)"
  ```

---

### Task 3: Replace Stub Icons with Custom SVGs

**Files:**
- Modify: `src/components/marquee.tsx` — replace `StubIcon` and `STACK_ITEMS` icon functions

All icons: `viewBox="0 0 20 20"`, `stroke="currentColor"`, `strokeWidth="1.5"`, `strokeLinecap="round"`, `strokeLinejoin="round"`, `fill="none"`, `filter="url(#sketch-rough-mq)"`.

- [ ] **Step 1: Replace `StubIcon` and the 8 icon entries in `STACK_ITEMS`**

  Delete `StubIcon`. Replace the `icon` entries in `STACK_ITEMS` with named inline icon functions using explicit path data from the spec:

  ```tsx
  const STACK_ITEMS = [
    {
      text: 'WEB DEVELOPMENT',
      icon: (cls?: string) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
             filter="url(#sketch-rough-mq)" className={cls} aria-hidden="true">
          {/* Left bracket */}
          <path d="M 5,4 L 3,10 L 5,16" />
          {/* Right bracket */}
          <path d="M 15,4 L 17,10 L 15,16" />
          {/* Slash */}
          <path d="M 12,4 L 8,16" />
          {/* Cursor */}
          <path d="M 9,17.5 L 12,17.5" />
        </svg>
      ),
    },
    {
      text: 'SYSTEMS DESIGN',
      icon: (cls?: string) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
             filter="url(#sketch-rough-mq)" className={cls} aria-hidden="true">
          {/* Nodes */}
          <circle cx="3" cy="10" r="2" />
          <circle cx="10" cy="4" r="2" />
          <circle cx="17" cy="10" r="2" />
          {/* Edges */}
          <line x1="3" y1="10" x2="10" y2="4" />
          <line x1="10" y1="4" x2="17" y2="10" />
          <line x1="3" y1="10" x2="17" y2="10" />
          {/* Edge midpoint dots */}
          <circle cx="6.5" cy="7" r="1" fill="currentColor" strokeWidth={0} />
          <circle cx="13.5" cy="7" r="1" fill="currentColor" strokeWidth={0} />
          <circle cx="10" cy="10" r="1" fill="currentColor" strokeWidth={0} />
        </svg>
      ),
    },
    {
      text: 'UI ENGINEERING',
      icon: (cls?: string) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
             filter="url(#sketch-rough-mq)" className={cls} aria-hidden="true">
          {/* Outer frame */}
          <rect x="1.5" y="2" width="17" height="16" />
          {/* Header bar */}
          <line x1="1.5" y1="7" x2="18.5" y2="7" />
          {/* Sidebar */}
          <line x1="6.5" y1="7" x2="6.5" y2="18" />
          {/* Content lines */}
          <line x1="9" y1="11" x2="17" y2="11" />
          <line x1="9" y1="14" x2="17" y2="14" />
        </svg>
      ),
    },
    {
      text: 'API ARCHITECTURE',
      icon: (cls?: string) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
             filter="url(#sketch-rough-mq)" className={cls} aria-hidden="true">
          {/* Left plug body */}
          <rect x="1" y="8" width="5" height="6" />
          {/* Prongs */}
          <line x1="2.5" y1="8" x2="2.5" y2="6" />
          <line x1="4.5" y1="8" x2="4.5" y2="6" />
          {/* Right socket body */}
          <rect x="14" y="8" width="5" height="6" />
          {/* Notches */}
          <line x1="15.5" y1="8" x2="15.5" y2="10" />
          <line x1="17.5" y1="8" x2="17.5" y2="10" />
          {/* Double-headed arrow */}
          <path d="M 7,11 L 13,11 M 11,9 L 13,11 L 11,13 M 9,9 L 7,11 L 9,13" />
        </svg>
      ),
    },
    {
      text: 'PERFORMANCE TUNING',
      icon: (cls?: string) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
             filter="url(#sketch-rough-mq)" className={cls} aria-hidden="true">
          {/* Speedometer arc */}
          <path d="M 2,15 A 8,8 0 0,1 18,15" />
          {/* Tick marks — 5 evenly spaced along arc */}
          <line x1="2" y1="15" x2="3.2" y2="12.4" />
          <line x1="6.1" y1="8.9" x2="7.6" y2="10" />
          <line x1="10" y1="7" x2="10" y2="8.5" />
          <line x1="13.9" y1="8.9" x2="12.4" y2="10" />
          <line x1="18" y1="15" x2="16.8" y2="12.4" />
          {/* Needle */}
          <line x1="10" y1="15" x2="6" y2="8" />
          {/* Pivot */}
          <circle cx="10" cy="15" r="1.5" fill="currentColor" strokeWidth={0} />
        </svg>
      ),
    },
    {
      text: 'DEVOPS & CI/CD',
      icon: (cls?: string) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
             filter="url(#sketch-rough-mq)" className={cls} aria-hidden="true">
          {/* Three pipeline boxes */}
          <rect x="1" y="8" width="4" height="4" rx="1" />
          <rect x="8" y="8" width="4" height="4" rx="1" />
          <rect x="15" y="8" width="4" height="4" rx="1" />
          {/* Connecting arrows */}
          <path d="M 5,10 L 8,10 M 7,9 L 8,10 L 7,11" />
          <path d="M 12,10 L 15,10 M 14,9 L 15,10 L 14,11" />
          {/* Loop arrow above center box */}
          <path d="M 8.5,6 A 2.5,2.5 0 1,1 11.5,6 M 11.5,4.5 L 11.5,6 L 13,6" />
        </svg>
      ),
    },
    {
      text: '3D & WEBGL',
      icon: (cls?: string) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
             filter="url(#sketch-rough-mq)" className={cls} aria-hidden="true">
          {/* Top face */}
          <path d="M 10,1 L 17,5 L 10,9 L 3,5 Z" />
          {/* Left face */}
          <path d="M 3,5 L 3,13 L 10,17 L 10,9" />
          {/* Right face */}
          <path d="M 17,5 L 17,13 L 10,17 L 10,9" />
          {/* Shading lines across top face */}
          <line x1="5" y1="7" x2="12" y2="3" />
          <line x1="7" y1="8" x2="14" y2="4" />
          <line x1="9" y1="9" x2="16" y2="5" />
        </svg>
      ),
    },
    {
      text: 'TOOLING & AUTOMATION',
      icon: (cls?: string) => (
        <svg viewBox="0 0 20 20" fill="none" stroke="currentColor"
             strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"
             filter="url(#sketch-rough-mq)" className={cls} aria-hidden="true">
          {/* Handle */}
          <line x1="4" y1="17" x2="11" y2="10" />
          {/* Head circle */}
          <circle cx="14" cy="6" r="4" />
          {/* Hex outline (6 lines at 60° intervals from center, length 3) */}
          <line x1="14" y1="6" x2="14" y2="3" />
          <line x1="14" y1="6" x2="16.6" y2="4.5" />
          <line x1="14" y1="6" x2="16.6" y2="7.5" />
          <line x1="14" y1="6" x2="14" y2="9" />
          <line x1="14" y1="6" x2="11.4" y2="7.5" />
          <line x1="14" y1="6" x2="11.4" y2="4.5" />
          {/* Bolt */}
          <circle cx="14" cy="6" r="1.5" fill="currentColor" strokeWidth={0} />
        </svg>
      ),
    },
  ]
  ```

- [ ] **Step 2: Visually verify all 8 icons render in browser**

  With dev server running at `http://localhost:3005`:
  - All 8 icons should be visible as red outline drawings
  - Icons should have slight hand-drawn roughness from the displacement filter
  - No console errors

- [ ] **Step 3: Commit icons**

  ```bash
  git add src/components/marquee.tsx
  git commit -m "feat: add custom 20x20 SVG icons to marquee"
  ```

---

### Task 4: Replace Stub Dingbats with Custom Ornamental SVGs

**Files:**
- Modify: `src/components/marquee.tsx` — replace `StubDingbat` and `DINGBATS` array

All dingbats: `viewBox="0 0 16 16"`, `fill="none"`, `stroke="currentColor"`, `strokeWidth="1.2"`, `strokeLinecap="round"`.

- [ ] **Step 1: Delete `StubDingbat` and replace `DINGBATS` array with all 6 custom SVGs**

  ```tsx
  const DINGBATS: Array<(cls?: string) => JSX.Element> = [
    // 0 — Fleuron
    (cls?: string) => (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
           strokeWidth="1.2" strokeLinecap="round" className={cls} aria-hidden="true">
        <path d="M 8,2 C 4,3 2,7 5,11 C 6,13 7,13 7,14" />
        <path d="M 8,2 C 12,3 14,7 11,11 C 10,13 9,13 9,14" />
        <path d="M 7,14 L 8,15 L 9,14" />
      </svg>
    ),
    // 1 — Asterism
    (cls?: string) => (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
           strokeWidth="1.2" strokeLinecap="round" className={cls} aria-hidden="true">
        <circle cx="8" cy="3" r="1" fill="currentColor" strokeWidth={0} />
        <circle cx="4" cy="12" r="1" fill="currentColor" strokeWidth={0} />
        <circle cx="12" cy="12" r="1" fill="currentColor" strokeWidth={0} />
        <line x1="8" y1="4" x2="4" y2="11" />
        <line x1="8" y1="4" x2="12" y2="11" />
        <line x1="5" y1="12" x2="11" y2="12" />
      </svg>
    ),
    // 2 — Six-point star
    (cls?: string) => (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
           strokeWidth="1.2" strokeLinecap="round" className={cls} aria-hidden="true">
        <path d="M 8,1 L 14,11 L 2,11 Z" />
        <path d="M 8,15 L 2,5 L 14,5 Z" />
      </svg>
    ),
    // 3 — Cross-hatch diamond
    (cls?: string) => (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
           strokeWidth="1.2" strokeLinecap="round" className={cls} aria-hidden="true">
        <path d="M 8,1 L 15,8 L 8,15 L 1,8 Z" />
        <line x1="3.5" y1="8" x2="12.5" y2="8" />
        <line x1="8" y1="3.5" x2="8" y2="12.5" />
      </svg>
    ),
    // 4 — Section curl
    (cls?: string) => (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
           strokeWidth="1.2" strokeLinecap="round" className={cls} aria-hidden="true">
        <line x1="5.5" y1="2" x2="10.5" y2="2" />
        <path d="M 8,2 C 12,2 12,8 8,8" />
        <path d="M 8,8 C 4,8 4,14 8,14" />
        <line x1="5.5" y1="14" x2="10.5" y2="14" />
      </svg>
    ),
    // 5 — Pilcrow
    (cls?: string) => (
      <svg viewBox="0 0 16 16" fill="none" stroke="currentColor"
           strokeWidth="1.2" strokeLinecap="round" className={cls} aria-hidden="true">
        <line x1="9" y1="7" x2="9" y2="14" />
        <line x1="11" y1="7" x2="11" y2="14" />
        <path d="M 7,7 A 2,2 0 0,1 11,7" />
      </svg>
    ),
  ]
  ```

- [ ] **Step 2: Visually verify all 6 dingbats cycle correctly**

  With dev server running at `http://localhost:3005`:
  - 8 items visible, each with a different dingbat (items 0–5 use all 6; items 6 and 7 reuse 0 and 1)
  - All dingbats red, semi-transparent
  - No console errors

- [ ] **Step 3: Commit dingbats**

  ```bash
  git add src/components/marquee.tsx
  git commit -m "feat: add ornamental dingbat separators to marquee"
  ```

---

### Task 5: Final Visual QA and Cleanup

**Files:**
- Read-only verification pass

- [ ] **Step 1: Full visual check at `http://localhost:3005`**

  Verify all of the following:
  - Torn-paper silhouette on top and bottom edges of the band
  - Halftone dot texture faintly visible inside the dark band
  - Band tilted at ~-1.5deg
  - 8 items scroll left continuously (45s loop)
  - Hovering the band pauses the scroll
  - All 8 icons render as red outline drawings with sketch roughness
  - All 6 dingbats cycle correctly (fleuron, asterism, star, diamond, section, pilcrow)
  - `var(--paper-light)` colored label text readable against dark band
  - No clipping of torn edges at top/bottom of wrapper

- [ ] **Step 2: Check no `StubIcon` or `StubDingbat` references remain**

  ```bash
  grep -n "StubIcon\|StubDingbat" src/components/marquee.tsx
  ```

  Expected: no output.

- [ ] **Step 3: Check accessibility**

  Open browser DevTools → Accessibility tree. Verify:
  - `aria-label="Tech stack and focus areas"` present on shell element
  - Duplicate groups have `aria-hidden="true"`
  - All decorative SVGs have `aria-hidden="true"`

- [ ] **Step 4: Build check**

  ```bash
  npm run build
  ```

  Expected: Build succeeds with no TypeScript or lint errors.

- [ ] **Step 5: Final commit**

  ```bash
  git add src/components/marquee.tsx src/components/marquee.module.css
  git commit -m "feat: complete marquee redesign with SVG band, custom icons, dingbats"
  ```
