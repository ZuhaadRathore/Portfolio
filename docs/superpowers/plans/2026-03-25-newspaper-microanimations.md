# Newspaper Microanimations Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Layer newspaper/print microdetails across all portfolio sections — grain texture, print marks, ink behaviors — with zero structural layout changes.

**Architecture:** Three additive CSS layers: global atmosphere (grain, paper warmth), print marks (datelines, double rule, fold corners, halftone), interactive ink behaviors (draw borders, tag press, ink bleed, drop-shadow). All changes are presentational. No new components, no new JS logic — only CSS additions and minimal span insertions for datelines.

**Tech Stack:** CSS Modules, CSS custom properties, `@media (prefers-reduced-motion)`, Next.js

---

## Implementation Notes (Read Before Starting)

- **`body::before` is taken** — overscroll gap fix uses it in `globals.css:39`. Use `body::after` for grain overlay instead of `body::before` as written in the spec.
- **Hero name is SVG `<text>`** — `text-shadow` does not apply to SVG. Apply misregistration only to HTML elements: `.headerIndex` spans and `.cardTitle`.
- **`photoFrame` pseudos are both taken** — `::before` = roughened border, `::after` = red corner accent. Apply halftone via a layered `background-image` on `.photoFrame` directly instead of a pseudo-element.
- **`cardPreview::after` is free** — use it for halftone overlay on the project preview area.
- **No unit tests exist** — this is a visual CSS project. Verification = run `npm run dev` and visually inspect in browser. Screenshot or annotate clearly what to look for.

---

## File Map

| File | What changes |
|------|-------------|
| `src/app/globals.css` | Add `body::after` grain overlay; adjust `--paper-mid`; add `.headerIndex` misregistration rule |
| `src/components/about-section.module.css` | Dateline stamp styles; thick/thin rule; halftone on `.photoFrame`; ink bleed on `.socialLink` |
| `src/components/about-section.tsx` | Add `<span className={s.dateline}>` inside `.header` |
| `src/components/experience-section.module.css` | Dateline stamp styles; thick/thin rule; tag press on `.entryTag`; ink drop-shadow on `.entryTag::before` |
| `src/components/experience-section.tsx` | Add `<span className={s.dateline}>` inside `.header` |
| `src/components/skills-section.module.css` | Dateline stamp styles; thick/thin rule; fold corner on `.tile::after`; ink-draw border animation on `.tile::before`; ink bleed on `.tileName` |
| `src/components/skills-section.tsx` | Add `<span className={s.dateline}>` inside `.header` |
| `src/components/projects-section.module.css` | Dateline stamp styles; thick/thin rule; fold corner on `.card::after`; ink-draw border on `.card::before`; tag press on `.cardTag`; halftone on `.cardPreview::after`; misregistration on `.cardTitle`; ink bleed on `.cardArrow`, `.cardTitle` |
| `src/components/projects-section.tsx` | Add `<span className={s.dateline}>` inside `.header` |

---

## Task 1: Grain Overlay & Paper Warmth

**Files:**
- Modify: `src/app/globals.css`

- [ ] **Step 1: Open `globals.css` and locate the `body::before` block (line 39)**

  Note that `body::before` is already used. We will use `body::after`.

- [ ] **Step 2: Add grain overlay as `body::after` at the end of the `body` ruleset block**

  Add this CSS after the existing `body::before` block (around line 48):

  ```css
  /* Grain overlay — simulates newsprint texture */
  body::after {
    content: '';
    position: fixed;
    inset: 0;
    z-index: 9999;
    pointer-events: none;
    background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='200' height='200'%3E%3Cfilter id='grain'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.85' numOctaves='4' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='200' height='200' filter='url(%23grain)' opacity='1'/%3E%3C/svg%3E");
    background-repeat: repeat;
    background-size: 200px 200px;
    opacity: 0.03;
  }
  ```

- [ ] **Step 3: Adjust `--paper-mid` toward warmer aged newsprint**

  In the `:root` block, change:
  ```css
  --paper-mid: #f6efe8;
  ```
  to:
  ```css
  --paper-mid: #f5ead8;
  ```
  (Slightly more yellow-cream. If this feels too strong, back off to `#f5eedd`.)

- [ ] **Step 4: Start dev server and verify**

  ```bash
  npm run dev
  ```

  Open `http://localhost:3000`. Check:
  - Very subtle grain texture visible across the page (felt not seen — ~3% opacity)
  - Paper background feels slightly warmer/more aged than before
  - Grain does NOT capture mouse events (hovering links still works)

- [ ] **Step 5: Commit**

  ```bash
  git add src/app/globals.css
  git commit -m "feat: add grain overlay and warmer paper tint"
  ```

---

## Task 2: Misregistration Shadow on Display Text

**Files:**
- Modify: `src/app/globals.css`
- Modify: `src/components/projects-section.module.css`

- [ ] **Step 1: Add global `.headerIndex` misregistration rule in `globals.css`**

  Append to the end of `globals.css`:

  ```css
  /* Misregistration shadow — CMYK print separation effect */
  .headerIndex {
    text-shadow: 1px 1px 0 rgba(208, 0, 0, 0.18), -1px -1px 0 rgba(0, 0, 0, 0.04);
  }
  ```

  Note: `.headerIndex` is a CSS Modules class but since all modules define it identically and globals are global scope, this won't match scoped module classes. **Skip the global approach** — add the `text-shadow` directly inside each section's `.headerIndex` rule instead. Proceed to Step 2.

- [ ] **Step 2: Add misregistration to `.headerIndex` in `about-section.module.css` (line 53–66)**

  In the `.headerIndex` rule, add:
  ```css
  text-shadow: 1px 1px 0 rgba(208, 0, 0, 0.18), -1px -1px 0 rgba(0, 0, 0, 0.04);
  ```

- [ ] **Step 3: Repeat for `experience-section.module.css` `.headerIndex` (line 69–82)**

  Same `text-shadow` line added inside `.headerIndex`.

- [ ] **Step 4: Repeat for `skills-section.module.css` `.headerIndex` (line 53–66)**

  Same `text-shadow` line.

- [ ] **Step 5: Repeat for `projects-section.module.css` `.headerIndex` (line 60–73)**

  Same `text-shadow` line.

- [ ] **Step 6: Add misregistration to `.cardTitle` in `projects-section.module.css` (line 216–222)**

  Inside `.cardTitle`, add:
  ```css
  text-shadow: 1px 1px 0 rgba(208, 0, 0, 0.18), -1px -1px 0 rgba(0, 0, 0, 0.04);
  ```

- [ ] **Step 7: Verify in browser**

  Scroll through each section. The large watermark index numbers (01, 02, 03, 05) should have a faint red ghost offset — visible on close inspection, not distracting. Project card titles should show the same subtle misregistration.

- [ ] **Step 8: Commit**

  ```bash
  git add src/components/about-section.module.css src/components/experience-section.module.css src/components/skills-section.module.css src/components/projects-section.module.css
  git commit -m "feat: add CMYK misregistration text-shadow to display elements"
  ```

---

## Task 3: Dateline Stamps — Markup

**Files:**
- Modify: `src/components/about-section.tsx`
- Modify: `src/components/experience-section.tsx`
- Modify: `src/components/skills-section.tsx`
- Modify: `src/components/projects-section.tsx`

- [ ] **Step 1: Add dateline span to `about-section.tsx` header**

  At line 118–119, the header currently reads:
  ```tsx
  <span className={s.headerIndex} aria-hidden="true">01</span>
  <span className={s.headerTitle}>ABOUT</span>
  ```

  Add the dateline after `headerTitle`:
  ```tsx
  <span className={s.headerIndex} aria-hidden="true">01</span>
  <span className={s.headerTitle}>ABOUT</span>
  <span className={s.dateline} aria-hidden="true">VOL. I · ISSUE 2025</span>
  ```

- [ ] **Step 2: Add dateline span to `experience-section.tsx` header**

  At line 268–270, the header currently reads:
  ```tsx
  <span className={s.headerIndex} aria-hidden="true">02</span>
  <span className={s.headerTitle}>EXPERIENCE</span>
  <span className={s.headerSub}>2020 – PRESENT</span>
  ```

  Add dateline after `headerSub`:
  ```tsx
  <span className={s.headerIndex} aria-hidden="true">02</span>
  <span className={s.headerTitle}>EXPERIENCE</span>
  <span className={s.headerSub}>2020 – PRESENT</span>
  <span className={s.dateline} aria-hidden="true">VOL. I · ISSUE 2025</span>
  ```

- [ ] **Step 3: Add dateline span to `skills-section.tsx` header**

  At line 174–175:
  ```tsx
  <span className={s.headerIndex} aria-hidden="true">03</span>
  <span className={s.headerTitle}>SKILLS</span>
  ```

  Add dateline:
  ```tsx
  <span className={s.headerIndex} aria-hidden="true">03</span>
  <span className={s.headerTitle}>SKILLS</span>
  <span className={s.dateline} aria-hidden="true">VOL. I · ISSUE 2025</span>
  ```

- [ ] **Step 4: Add dateline span to `projects-section.tsx` header**

  At line 87–89:
  ```tsx
  <span className={s.headerIndex} aria-hidden="true">05</span>
  <span className={s.headerTitle}>SELECTED WORKS</span>
  <span className={s.headerSub}>2023–2025</span>
  ```

  Add dateline:
  ```tsx
  <span className={s.headerIndex} aria-hidden="true">05</span>
  <span className={s.headerTitle}>SELECTED WORKS</span>
  <span className={s.headerSub}>2023–2025</span>
  <span className={s.dateline} aria-hidden="true">VOL. I · ISSUE 2025</span>
  ```

- [ ] **Step 5: Commit markup (CSS comes next task)**

  ```bash
  git add src/components/about-section.tsx src/components/experience-section.tsx src/components/skills-section.tsx src/components/projects-section.tsx
  git commit -m "feat: add dateline stamp spans to all section headers"
  ```

---

## Task 4: Dateline Stamps — Styles

**Files:**
- Modify: `src/components/about-section.module.css`
- Modify: `src/components/experience-section.module.css`
- Modify: `src/components/skills-section.module.css`
- Modify: `src/components/projects-section.module.css`

The `.dateline` style is identical across all four files. The fade-in hooks into the existing `.headerVisible` state.

- [ ] **Step 1: Add `.dateline` to `about-section.module.css`**

  After the `.headerTitle` rule (around line 47–51), add:

  ```css
  .dateline {
    display: block;
    font-family: var(--font-mono);
    font-size: 0.6rem;
    letter-spacing: 0.18em;
    color: var(--ink);
    opacity: 0;
    transition: opacity 0.5s ease 0.6s;
    pointer-events: none;
    user-select: none;
  }

  .headerVisible .dateline {
    opacity: 0.28;
  }
  ```

  Also add `.dateline` to the `@media (prefers-reduced-motion: reduce)` block at the bottom:
  ```css
  .dateline {
    transition: none;
    opacity: 0.28;
  }
  ```

- [ ] **Step 2: Verify about header layout**

  Run dev server. Scroll to About section. The dateline `VOL. I · ISSUE 2025` should appear below the ABOUT title at ~28% opacity, fading in slightly after the header. Check that the header flex layout accommodates the extra span without breaking alignment.

  The about header uses `align-items: flex-end` — the dateline will sit in the flex row. If layout looks off, add `width: 100%` or change `.header` to `flex-wrap: wrap` in about's CSS. Adjust as needed.

- [ ] **Step 3: Add `.dateline` to `experience-section.module.css`**

  Experience header uses `flex-direction: column; gap: 0.35rem` — the dateline will flow naturally as a column item. Add the same `.dateline` and `.headerVisible .dateline` rules after `.headerTitle`.

  Add to `prefers-reduced-motion` block:
  ```css
  .dateline {
    transition: none;
    opacity: 0.28;
  }
  ```

- [ ] **Step 4: Add `.dateline` to `skills-section.module.css`**

  Skills header uses `align-items: flex-end`. Same dateline rules. Add to reduced-motion block.

- [ ] **Step 5: Add `.dateline` to `projects-section.module.css`**

  Same dateline rules. Add to reduced-motion block.

- [ ] **Step 6: Verify all four sections**

  Scroll through all sections. Each header should show the `VOL. I · ISSUE 2025` stamp fading in during scroll-in. Check alignment is clean in each section. Check at mobile breakpoint (≤768px).

- [ ] **Step 7: Commit**

  ```bash
  git add src/components/about-section.module.css src/components/experience-section.module.css src/components/skills-section.module.css src/components/projects-section.module.css
  git commit -m "feat: add dateline stamp styles with scroll-in fade"
  ```

---

## Task 5: Thick/Thin Newspaper Rule

**Files:**
- Modify: `src/components/about-section.module.css`
- Modify: `src/components/experience-section.module.css`
- Modify: `src/components/skills-section.module.css`
- Modify: `src/components/projects-section.module.css`

The `header::after` pseudo currently draws a single 2px line. Upgrade it to a double rule using `box-shadow`: thick primary line + thin secondary line 2px below.

- [ ] **Step 1: Update `header::after` in `about-section.module.css` (lines 29–44)**

  The current `::after` rule:
  ```css
  .header::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: rgba(0, 0, 0, 0.35);
    filter: url(#pencil-roughen-soft);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s;
  }
  ```

  Replace with:
  ```css
  .header::after {
    content: '';
    position: absolute;
    left: 0;
    right: 0;
    bottom: 0;
    height: 2px;
    background: rgba(0, 0, 0, 0.35);
    box-shadow: 0 4px 0 rgba(0, 0, 0, 0.1);
    filter: url(#pencil-roughen-soft);
    transform: scaleX(0);
    transform-origin: left;
    transition: transform 0.8s cubic-bezier(0.22, 1, 0.36, 1) 0.3s;
  }
  ```

  The `box-shadow: 0 4px 0 rgba(0,0,0,0.1)` creates the thin companion line: 4px below the thick 2px line = 2px gap between them.

- [ ] **Step 2: Apply same `box-shadow` addition to `experience-section.module.css` `header::after` (lines 31–43)**

- [ ] **Step 3: Apply to `skills-section.module.css` `header::after` (lines 29–41)**

- [ ] **Step 4: Apply to `projects-section.module.css` `header::after` (lines 29–41)**

- [ ] **Step 5: Verify all section headers**

  Scroll through all sections. Each header underline should now show a thick line + thinner ghost line below it. Both lines animate left-to-right together (same `scaleX` transform applies to the entire `::after` including its shadow).

- [ ] **Step 6: Commit**

  ```bash
  git add src/components/about-section.module.css src/components/experience-section.module.css src/components/skills-section.module.css src/components/projects-section.module.css
  git commit -m "feat: upgrade section header underline to thick/thin newspaper double rule"
  ```

---

## Task 6: Fold Corner on Cards & Tiles

**Files:**
- Modify: `src/components/projects-section.module.css`
- Modify: `src/components/skills-section.module.css`

Pure CSS folded corner using `::after`. Both `.card::after` and `.tile::after` are currently unused.

- [ ] **Step 1: Add fold corner to `.card` in `projects-section.module.css`**

  After the `.card:hover` rule (around line 127), add:

  ```css
  /* Folded corner — top right, pure CSS */
  .card::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 14px;
    height: 14px;
    background: linear-gradient(225deg, var(--paper) 50%, rgba(0, 0, 0, 0.08) 50%);
    pointer-events: none;
    z-index: 2;
  }
  ```

- [ ] **Step 2: Add fold corner to `.tile` in `skills-section.module.css`**

  After the `.tile:hover` rule (around line 128), add:

  ```css
  /* Folded corner — top right */
  .tile::after {
    content: '';
    position: absolute;
    top: 0;
    right: 0;
    width: 14px;
    height: 14px;
    background: linear-gradient(225deg, var(--paper) 50%, rgba(0, 0, 0, 0.08) 50%);
    pointer-events: none;
    z-index: 2;
  }
  ```

- [ ] **Step 3: Verify**

  Each project card and each skills tile should show a small dog-ear fold at the top-right corner. The fold should match the paper background color. Check on hover — it should remain stable. Check that tiles in the bento grid all have the corner regardless of size class.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/projects-section.module.css src/components/skills-section.module.css
  git commit -m "feat: add pure CSS folded corner to project cards and skill tiles"
  ```

---

## Task 7: Halftone Overlays

**Files:**
- Modify: `src/components/projects-section.module.css`
- Modify: `src/components/about-section.module.css`

- [ ] **Step 1: Add halftone to `cardPreview` in `projects-section.module.css`**

  `cardPreview::before` is used for the border. `cardPreview::after` is free. After the `.cardPreview::before` rule (around line 166), add:

  ```css
  .cardPreview::after {
    content: '';
    position: absolute;
    inset: 0;
    background-image: radial-gradient(circle, rgba(0, 0, 0, 0.12) 1px, transparent 1px);
    background-size: 4px 4px;
    opacity: 0.15;
    pointer-events: none;
    z-index: 2;
  }
  ```

- [ ] **Step 2: Add halftone to `photoFrame` in `about-section.module.css`**

  Both `photoFrame` pseudos are taken. Layer halftone into the background directly. Find the `.photoFrame` rule (line 98–109) and change:

  ```css
  background: rgba(0, 0, 0, 0.03);
  ```

  to:

  ```css
  background-color: rgba(0, 0, 0, 0.03);
  background-image: radial-gradient(circle, rgba(0, 0, 0, 0.12) 1px, transparent 1px);
  background-size: 4px 4px;
  ```

  This layers the dot pattern directly on the frame without a pseudo-element.

- [ ] **Step 3: Verify**

  On the project cards, the preview area should show a very faint dot halftone pattern over the image/placeholder (opacity 15%). In the About section, the photo frame background should have a subtle grid of dots simulating newsprint halftone.

- [ ] **Step 4: Commit**

  ```bash
  git add src/components/projects-section.module.css src/components/about-section.module.css
  git commit -m "feat: add halftone dot overlay to card preview and photo frame"
  ```

---

## Task 8: Ink-Draw Borders on Scroll-In

**Files:**
- Modify: `src/components/projects-section.module.css`
- Modify: `src/components/skills-section.module.css`

Currently the `::before` border appears instantly with the element. Animate it via `clip-path`.

- [ ] **Step 1: Update `.card::before` in `projects-section.module.css`**

  Current rule (lines 110–118):
  ```css
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid rgba(0, 0, 0, 0.1);
    filter: url(#pencil-roughen-soft);
    pointer-events: none;
    transition: border-color 0.3s;
  }
  ```

  Replace with:
  ```css
  .card::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid rgba(0, 0, 0, 0.1);
    filter: url(#pencil-roughen-soft);
    pointer-events: none;
    clip-path: inset(0 100% 0 0);
    transition: border-color 0.3s, clip-path 0.6s ease-out 0.15s;
  }
  ```

  Then update `.cardVisible::before` (add after the `.cardVisible` rule around line 107):
  ```css
  .cardVisible::before {
    clip-path: inset(0 0% 0 0);
  }
  ```

- [ ] **Step 2: Update `.tile::before` in `skills-section.module.css`**

  Current rule (lines 111–119):
  ```css
  .tile::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid rgba(0, 0, 0, 0.1);
    filter: url(#pencil-roughen-soft);
    pointer-events: none;
    transition: border-color 0.3s;
  }
  ```

  Replace with:
  ```css
  .tile::before {
    content: '';
    position: absolute;
    inset: 0;
    border: 2px solid rgba(0, 0, 0, 0.1);
    filter: url(#pencil-roughen-soft);
    pointer-events: none;
    clip-path: inset(0 100% 0 0);
    transition: border-color 0.3s, clip-path 0.6s ease-out 0.15s;
  }
  ```

  Add after `.tileVisible` rule (around line 108):
  ```css
  .tileVisible::before {
    clip-path: inset(0 0% 0 0);
  }
  ```

  Also update `.tile:hover::before` to keep border-color behavior — the existing rule is fine since `clip-path` will already be `inset(0 0%)` once visible.

- [ ] **Step 3: Add to `prefers-reduced-motion` blocks**

  In `projects-section.module.css`, find the `@media (prefers-reduced-motion: reduce)` block and add:
  ```css
  .card::before {
    clip-path: none;
    transition: border-color 0.3s;
  }
  ```

  In `skills-section.module.css`, same in the reduced-motion block:
  ```css
  .tile::before {
    clip-path: none;
    transition: border-color 0.3s;
  }
  ```

- [ ] **Step 4: Verify**

  Scroll to projects and skills. Cards and tiles should reveal their border with a left-to-right ink draw animation (~0.6s) triggered slightly after the element fades in. With reduced-motion preference, borders appear instantly.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/projects-section.module.css src/components/skills-section.module.css
  git commit -m "feat: animate card and tile borders as ink-draw on scroll-in"
  ```

---

## Task 9: Tag Press

**Files:**
- Modify: `src/components/experience-section.module.css`
- Modify: `src/components/projects-section.module.css`

- [ ] **Step 1: Add press behavior to `.entryTag` in `experience-section.module.css`**

  After the `.entryTag::before` rule (around line 416), add:

  ```css
  .entryTag {
    transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s ease;
  }

  .entryTag:hover {
    transform: translateY(-1px);
    box-shadow: 0 1px 0 rgba(208, 0, 0, 0.25);
  }

  .entryTag:active {
    transform: scale(0.94);
    box-shadow: none;
  }
  ```

  Note: `.entryTag` already has `position: relative` and `white-space: nowrap`. The transition adds on top.

- [ ] **Step 2: Add press behavior to `.cardTag` in `projects-section.module.css`**

  After the `.cardTag::before` rule (around line 263), add:

  ```css
  .cardTag {
    transition: transform 0.15s cubic-bezier(0.34, 1.56, 0.64, 1), box-shadow 0.15s ease;
  }

  .cardTag:hover {
    transform: translateY(-1px);
    box-shadow: 0 1px 0 rgba(208, 0, 0, 0.25);
  }

  .cardTag:active {
    transform: scale(0.94);
    box-shadow: none;
  }
  ```

- [ ] **Step 3: Add to reduced-motion blocks**

  In both files, inside `@media (prefers-reduced-motion: reduce)`:
  ```css
  .entryTag { transition: none; } /* experience */
  .cardTag { transition: none; }  /* projects */
  ```

- [ ] **Step 4: Verify**

  Hover each tag — should lift 1px with a faint red shadow. Click/press — should snap down to 94% scale, shadow disappears. Release — spring-back via the cubic-bezier.

- [ ] **Step 5: Commit**

  ```bash
  git add src/components/experience-section.module.css src/components/projects-section.module.css
  git commit -m "feat: add stamp press interaction to experience and project tags"
  ```

---

## Task 10: Ink Bleed — Link Transitions

**Files:**
- Modify: `src/components/about-section.module.css`
- Modify: `src/components/projects-section.module.css`

Normalize all link hover `color` transitions to `0.25s ease-in` (ink spreads slow-then-fast on fibrous paper).

- [ ] **Step 1: Update `.socialLink` in `about-section.module.css` (line 259–270)**

  Current:
  ```css
  transition: color 0.2s, transform 0.2s;
  ```

  Change to:
  ```css
  transition: color 0.25s ease-in, transform 0.2s;
  ```

- [ ] **Step 2: Update `.cardArrow` in `projects-section.module.css` (line 207)**

  Current:
  ```css
  transition: color 0.2s, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  ```

  Change to:
  ```css
  transition: color 0.25s ease-in, transform 0.3s cubic-bezier(0.22, 1, 0.36, 1);
  ```

- [ ] **Step 3: Update `.cardTitle` in `projects-section.module.css` (line 222)**

  Current:
  ```css
  transition: color 0.2s;
  ```

  Change to:
  ```css
  transition: color 0.25s ease-in;
  ```

- [ ] **Step 4: Update `.entryCompany` in `experience-section.module.css` (line 316–326)**

  Add `color` transition (currently only `opacity` and `transform` are transitioned). Add after the existing transition or update:

  The current rule has `transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s`. Add color bleed on hover. First add the hover color rule (currently missing), then the transition:

  ```css
  .entryCompany:hover {
    color: var(--red);
  }
  ```

  Then add the ink-bleed transition to the visible state:
  ```css
  .entryVisible .entryCompany {
    transition: opacity 0.5s ease 0.2s, transform 0.5s ease 0.2s, color 0.25s ease-in;
  }
  ```

- [ ] **Step 5: Verify**

  Hover social links, card arrows, card titles. The color change should feel like ink bleeding — slightly slow start then faster transition compared to a symmetric `ease`.

- [ ] **Step 6: Commit**

  ```bash
  git add src/components/about-section.module.css src/components/projects-section.module.css src/components/experience-section.module.css
  git commit -m "feat: normalize link hover color transitions to ease-in ink bleed"
  ```

---

## Task 11: Ink Drop-Shadow on Roughened Elements

**Files:**
- Modify: `src/components/experience-section.module.css`
- Modify: `src/components/projects-section.module.css`
- Modify: `src/components/about-section.module.css`

Add `drop-shadow(1px 1px 0 rgba(208,0,0,0.08))` to elements already using `filter: url(#pencil-roughen-soft)`.

**Important:** CSS `filter` only accepts one `filter` property value — stack multiple filter functions in the same property: `filter: url(#pencil-roughen-soft) drop-shadow(...)`.

- [ ] **Step 1: Update `.entryTag::before` in `experience-section.module.css` (line 409–416)**

  Current:
  ```css
  .entryTag::before {
    ...
    filter: url(#pencil-roughen-soft);
    ...
  }
  ```

  Change `filter` to:
  ```css
  filter: url(#pencil-roughen-soft) drop-shadow(1px 1px 0 rgba(208, 0, 0, 0.08));
  ```

- [ ] **Step 2: Update `.cardTag::before` in `projects-section.module.css` (line 256–263)**

  Same filter stacking:
  ```css
  filter: url(#pencil-roughen-soft) drop-shadow(1px 1px 0 rgba(208, 0, 0, 0.08));
  ```

- [ ] **Step 3: Update `.socialSep` in `about-section.module.css` (line 283–288)**

  Current:
  ```css
  filter: url(#pencil-roughen-soft);
  ```

  Change to:
  ```css
  filter: url(#pencil-roughen-soft) drop-shadow(1px 1px 0 rgba(208, 0, 0, 0.08));
  ```

- [ ] **Step 4: Update section header title `.headerTitle` in all four module CSS files**

  `.headerTitle` currently has `filter: url(#pencil-roughen-soft)` in all four files. Update each to:
  ```css
  filter: url(#pencil-roughen-soft) drop-shadow(1px 1px 0 rgba(208, 0, 0, 0.08));
  ```

- [ ] **Step 5: Verify**

  Tags, social separator lines, and section header titles should have a very faint red ghost ink shadow. This effect is subtle — look at the right/bottom edges of roughened elements for the bleed.

- [ ] **Step 6: Commit**

  ```bash
  git add src/components/experience-section.module.css src/components/projects-section.module.css src/components/about-section.module.css src/components/skills-section.module.css
  git commit -m "feat: add red ink drop-shadow to roughened elements"
  ```

---

## Final Verification

- [ ] **Run full visual pass** — scroll through every section at desktop (1280px) and mobile (375px)
- [ ] **Test reduced-motion** — in browser DevTools, enable `prefers-reduced-motion: reduce`. All transitions/animations should be suppressed; visual states should still appear (datelines, borders, fold corners visible without animation)
- [ ] **Check no layout shifts** — the dateline spans and fold corners should not affect element sizing or layout flow
- [ ] **Check grain overlay doesn't block interaction** — hover links, click tags, ensure `pointer-events: none` on `body::after` works
