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
// The filter definition lives in the standalone zero-size SVG. The halftone pattern
// must be defined here so url(#halftone) resolves correctly.
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
  { text: 'WEB DEVELOPMENT',      icon: (cls?: string) => <StubIcon className={cls} /> },
  { text: 'SYSTEMS DESIGN',       icon: (cls?: string) => <StubIcon className={cls} /> },
  { text: 'UI ENGINEERING',       icon: (cls?: string) => <StubIcon className={cls} /> },
  { text: 'API ARCHITECTURE',     icon: (cls?: string) => <StubIcon className={cls} /> },
  { text: 'PERFORMANCE TUNING',   icon: (cls?: string) => <StubIcon className={cls} /> },
  { text: 'DEVOPS & CI/CD',       icon: (cls?: string) => <StubIcon className={cls} /> },
  { text: '3D & WEBGL',           icon: (cls?: string) => <StubIcon className={cls} /> },
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
