'use client'

import { useEffect, useRef, useState } from 'react'
import s from './experience-section.module.css'

const experiences = [
  {
    year: '2024',
    yearLabel: '2024–PRESENT',
    title: 'Chief Technology Officer (CTO)',
    company: 'MYTHOFY',
    description:
      'Owns technical strategy and execution across product, platform, and delivery. Leads engineering decisions, architecture, and shipping cadence.',
    active: true,
    stack: ['Next.js', 'TypeScript', 'Node.js', 'PostgreSQL', 'AWS'],
    highlights: [
      'Defined and shipped the core product architecture from scratch',
      'Established CI/CD pipelines and engineering processes',
      'Led technical hiring and team growth',
    ],
  },
  {
    year: '2020',
    yearLabel: '2020–SUMMER 2024',
    title: 'Freelance Software Engineer',
    company: 'INDEPENDENT',
    description:
      'Built and shipped web products end-to-end: UI engineering, backend integrations, deployment, and performance tuning. Worked across varied scopes from quick iterations to longer-term systems.',
    active: false,
    stack: ['React', 'Vue', 'Node.js', 'Firebase', 'Tailwind CSS'],
    highlights: [
      'Delivered 15+ client projects across e-commerce, SaaS, and media',
      'Built real-time dashboards and data visualization tools',
      'Optimized site performance achieving sub-second load times',
    ],
  },
]

// ── Scramble hook ──
const SCRAMBLE_CHARS = '0123456789ABCDEFGHIJKLMNOPQRSTUVWXYZ–·:/'

function useTextScramble(text: string, trigger: boolean) {
  const [display, setDisplay] = useState('')
  const frameRef = useRef(0)
  const hasRun = useRef(false)

  useEffect(() => {
    if (!trigger || hasRun.current) return
    hasRun.current = true

    const length = text.length
    const totalDuration = 600 // ms
    const startTime = performance.now()

    const tick = (now: number) => {
      const elapsed = now - startTime
      const progress = Math.min(elapsed / totalDuration, 1)

      const result = text
        .split('')
        .map((char, i) => {
          if (char === ' ' || char === '–') return char
          const charThreshold = 0.2 + (i / length) * 0.7
          if (progress >= charThreshold) return char
          return SCRAMBLE_CHARS[Math.floor(Math.random() * SCRAMBLE_CHARS.length)]
        })
        .join('')

      setDisplay(result)

      if (progress < 1) {
        frameRef.current = requestAnimationFrame(tick)
      }
    }

    frameRef.current = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(frameRef.current)
  }, [trigger, text])

  return trigger ? display : ''
}

// ── Hover hook that works during scroll ──
function useScrollHover(
  entryRefs: React.MutableRefObject<(HTMLDivElement | null)[]>
) {
  const [hoveredIndex, setHoveredIndex] = useState<number | null>(null)
  const pointerPos = useRef<{ x: number; y: number } | null>(null)

  useEffect(() => {
    const onPointerMove = (e: PointerEvent) => {
      pointerPos.current = { x: e.clientX, y: e.clientY }
      checkHover()
    }

    const onPointerLeave = () => {
      pointerPos.current = null
      setHoveredIndex(null)
    }

    const checkHover = () => {
      const pos = pointerPos.current
      if (!pos) {
        setHoveredIndex(null)
        return
      }

      let found: number | null = null
      for (let i = 0; i < entryRefs.current.length; i++) {
        const el = entryRefs.current[i]
        if (!el) continue
        const rect = el.getBoundingClientRect()
        if (
          pos.x >= rect.left &&
          pos.x <= rect.right &&
          pos.y >= rect.top &&
          pos.y <= rect.bottom
        ) {
          found = i
          break
        }
      }
      setHoveredIndex(found)
    }

    let scrollRaf = 0
    const onScroll = () => {
      cancelAnimationFrame(scrollRaf)
      scrollRaf = requestAnimationFrame(checkHover)
    }

    window.addEventListener('pointermove', pointerPos.current ? undefined as never : onPointerMove, { passive: true })
    document.addEventListener('pointermove', onPointerMove, { passive: true })
    document.addEventListener('pointerleave', onPointerLeave)
    window.addEventListener('scroll', onScroll, { passive: true })

    return () => {
      document.removeEventListener('pointermove', onPointerMove)
      document.removeEventListener('pointerleave', onPointerLeave)
      window.removeEventListener('scroll', onScroll)
      cancelAnimationFrame(scrollRaf)
    }
  }, [entryRefs])

  return hoveredIndex
}

function ScrambleYearInstant({
  text,
  trigger,
  instant,
}: {
  text: string
  trigger: boolean
  instant: boolean
}) {
  const display = useTextScramble(text, trigger && !instant)
  if (instant) return <>{text}</>
  return <>{display}</>
}

// ── Main component ──
export default function ExperienceSection({
  skipIntro = false,
  isActive = false,
}: {
  skipIntro?: boolean
  isActive?: boolean
}) {
  const [headerVisible, setHeaderVisible] = useState(skipIntro)
  const [lineVisible, setLineVisible] = useState(skipIntro)
  const [visibleEntries, setVisibleEntries] = useState<Set<number>>(
    () => (
      skipIntro
        ? new Set(experiences.map((_, idx) => idx))
        : new Set<number>()
    )
  )
  const [revealedEntries, setRevealedEntries] = useState<Set<number>>(
    () => (
      skipIntro
        ? new Set(experiences.map((_, idx) => idx))
        : new Set<number>()
    )
  )

  const headerRef = useRef<HTMLDivElement>(null)
  const lineRef = useRef<HTMLDivElement>(null)
  const entryRefs = useRef<(HTMLDivElement | null)[]>([])
  const hoveredIndex = useScrollHover(entryRefs)

  // Header observer
  useEffect(() => {
    if (skipIntro) return
    if (!headerRef.current) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setHeaderVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.3 }
    )
    obs.observe(headerRef.current)
    return () => obs.disconnect()
  }, [skipIntro])

  // Timeline line observer
  useEffect(() => {
    if (skipIntro) return
    if (!lineRef.current) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setLineVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.1 }
    )
    obs.observe(lineRef.current)
    return () => obs.disconnect()
  }, [skipIntro])

  // Entry observers — staggered reveal
  useEffect(() => {
    if (skipIntro) return
    const timers: ReturnType<typeof setTimeout>[] = []

    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number(e.target.getAttribute('data-index'))
            const delay = idx * 150
            const t = setTimeout(() => {
              setVisibleEntries((prev) => new Set(prev).add(idx))
              const reveal = setTimeout(() => {
                setRevealedEntries((prev) => new Set(prev).add(idx))
              }, 400)
              timers.push(reveal)
            }, delay)
            timers.push(t)
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0, rootMargin: '0px 0px 60px 0px' }
    )

    entryRefs.current.forEach((el) => {
      if (el) obs.observe(el)
    })

    return () => {
      obs.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [skipIntro])

  return (
    <section id="experience" className={`${s.section} ${isActive ? s.sectionInView : ''}`}>
      <div
        ref={headerRef}
        className={`${s.header} ${headerVisible ? s.headerVisible : ''}`}
      >
        <span className={s.headerIndex} aria-hidden="true">02</span>
        <span className={s.headerTitle}>EXPERIENCE</span>
        <span className={s.headerSub}>2020 – PRESENT</span>
        <span className={s.dateline} aria-hidden="true">VOL. I · ISSUE 2025</span>
      </div>

      <div className={s.timeline}>
        <div
          ref={lineRef}
          className={`${s.timelineLine} ${lineVisible ? s.timelineLineVisible : ''}`}
        />

        {experiences.map((exp, i) => {
          const visible = visibleEntries.has(i)
          const hovered = visible && hoveredIndex === i
          return (
            <div
              key={i}
              ref={(el) => { entryRefs.current[i] = el }}
              data-index={i}
              className={[
                s.entry,
                visible ? s.entryVisible : '',
                hovered ? s.entryHovered : '',
              ].join(' ')}
            >
              <div className={s.entryNode}>
                <div className={s.entryDot} />
              </div>
              <div className={s.entryRing} />
              {exp.active && <div className={s.entryActivePulse} />}

              <div className={s.entryWatermark} aria-hidden="true">
                {exp.year}
              </div>

              <div className={s.entryCard}>
                <div className={s.entryYear}>
                  <ScrambleYearInstant
                    text={exp.yearLabel}
                    trigger={visible}
                    instant={skipIntro}
                  />
                </div>
                <h3 className={s.entryTitle}>{exp.title}</h3>
                <span className={s.entryCompany}>{exp.company}</span>
                <p className={s.entryDesc}>{exp.description}</p>

                {/* Details — revealed on scroll into view */}
                <div className={[s.entryReveal, revealedEntries.has(i) ? s.entryRevealOpen : ''].join(' ')}>
                  <div className={s.entryStack}>
                    {exp.stack.map((tech) => (
                      <span key={tech} className={s.entryTag}>{tech}</span>
                    ))}
                  </div>
                  <ul className={s.entryHighlights}>
                    {exp.highlights.map((h, j) => (
                      <li key={j} className={s.entryHighlight}>{h}</li>
                    ))}
                  </ul>
                </div>
              </div>
            </div>
          )
        })}

        <div className={`${s.timelineTail} ${lineVisible ? s.timelineTailVisible : ''}`} />
      </div>
    </section>
  )
}
