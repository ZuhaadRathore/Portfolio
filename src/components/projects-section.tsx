'use client'

import { useEffect, useRef, useState } from 'react'
import s from './projects-section.module.css'
import { TransitionLink } from './page-transition'

const projects = [
  {
    title: 'Anton',
    description:
      'A modern, immediate-mode TUI library for Rust with CSS-like theming. Flexbox layout, double-buffered diff rendering, and a custom .ath theming DSL with its own PEG grammar.',
    tags: ['Rust', 'Crossterm', 'Pest', 'Library'],
    href: '/projects/anton',
    image: '',
  },
]

export default function ProjectsSection({
  skipIntro = false,
  isActive = false,
}: {
  skipIntro?: boolean
  isActive?: boolean
}) {
  const [headerVisible, setHeaderVisible] = useState(skipIntro)
  const [visibleCards, setVisibleCards] = useState<Set<number>>(
    () => (
      skipIntro
        ? new Set(projects.map((_, idx) => idx))
        : new Set<number>()
    )
  )
  const headerRef = useRef<HTMLDivElement>(null)
  const cardRefs = useRef<(HTMLDivElement | null)[]>([])

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

  useEffect(() => {
    if (skipIntro) return
    const timers: ReturnType<typeof setTimeout>[] = []
    const obs = new IntersectionObserver(
      (entries) => {
        entries.forEach((e) => {
          if (e.isIntersecting) {
            const idx = Number(e.target.getAttribute('data-index'))
            const t = setTimeout(() => {
              setVisibleCards((prev) => new Set(prev).add(idx))
            }, idx * 200)
            timers.push(t)
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0.1, rootMargin: '0px 0px 40px 0px' }
    )

    cardRefs.current.forEach((el) => {
      if (el) obs.observe(el)
    })

    return () => {
      obs.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [skipIntro])

  return (
    <section id="projects" className={`${s.section} ${isActive ? s.sectionInView : ''}`}>
      <div
        ref={headerRef}
        className={`${s.header} ${headerVisible ? s.headerVisible : ''}`}
      >
        <span className={s.headerIndex} aria-hidden="true">05</span>
        <span className={s.headerTitle}>SELECTED WORKS</span>
        <span className={s.headerSub}>2023–2025</span>
      </div>

      {projects.map((project, i) => (
        <div
          key={i}
          ref={(el) => { cardRefs.current[i] = el }}
          data-index={i}
          className={`${s.card} ${visibleCards.has(i) ? s.cardVisible : ''}`}
        >
          <TransitionLink href={project.href} className={s.cardLink}>
            <div className={s.cardInner}>
              <div className={s.cardInfo}>
                <div className={s.cardTop}>
                  <span className={s.cardNumber}>
                    {String(i + 1).padStart(2, '0')}
                  </span>
                  <svg
                    className={s.cardArrow}
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="1.5"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                  >
                    <path d="M7 17L17 7" />
                    <path d="M7 7h10v10" />
                  </svg>
                </div>

                <div className={s.cardTitle}>{project.title}</div>
                <div className={s.cardDesc}>{project.description}</div>

                <div className={s.cardTags}>
                  {project.tags.map((tag) => (
                    <span key={tag} className={s.cardTag}>{tag}</span>
                  ))}
                </div>
              </div>

              <div className={s.cardPreview}>
                {project.image ? (
                  <img
                    src={project.image}
                    alt={`${project.title} preview`}
                    className={s.cardImage}
                    loading="lazy"
                    decoding="async"
                  />
                ) : (
                  <span className={s.cardPlaceholder}>Preview</span>
                )}
              </div>
            </div>
          </TransitionLink>
        </div>
      ))}
    </section>
  )
}
