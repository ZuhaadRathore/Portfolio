'use client'

import { useEffect, useRef, useState } from 'react'
import s from './skills-section.module.css'

type Skill = {
  name: string
  category: string
  iconSrc: string
  size: 'lg' | 'md'
}

const skills: Skill[] = [
  // Hero tiles (2×2)
  {
    name: 'Rust',
    category: 'LANGUAGE',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg',
    size: 'lg',
  },
  {
    name: 'React',
    category: 'FRAMEWORK',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg',
    size: 'lg',
  },
  // Medium tiles filling beside the first hero
  {
    name: 'Python',
    category: 'LANGUAGE',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg',
    size: 'md',
  },
  {
    name: 'Java',
    category: 'LANGUAGE',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg',
    size: 'md',
  },
  {
    name: 'C++',
    category: 'LANGUAGE',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg',
    size: 'md',
  },
  {
    name: 'Vite',
    category: 'TOOL',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg',
    size: 'md',
  },
  // Second row heroes
  {
    name: 'Next.js',
    category: 'FRAMEWORK',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nextjs/nextjs-original.svg',
    size: 'lg',
  },
  {
    name: 'TypeScript',
    category: 'LANGUAGE',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg',
    size: 'lg',
  },
  // Medium tiles filling beside
  {
    name: 'Node.js',
    category: 'RUNTIME',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg',
    size: 'md',
  },
  {
    name: 'Tauri',
    category: 'FRAMEWORK',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tauri/tauri-original.svg',
    size: 'md',
  },
  {
    name: 'Django',
    category: 'FRAMEWORK',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg',
    size: 'md',
  },
  {
    name: 'Axum',
    category: 'FRAMEWORK',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg',
    size: 'md',
  },
  // Bottom row
  {
    name: 'PostgreSQL',
    category: 'DATABASE',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg',
    size: 'md',
  },
  {
    name: 'Docker',
    category: 'TOOL',
    iconSrc: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg',
    size: 'md',
  },
]

export default function SkillsSection({
  skipIntro = false,
  isActive = false,
}: {
  skipIntro?: boolean
  isActive?: boolean
}) {
  const [headerVisible, setHeaderVisible] = useState(skipIntro)
  const [visibleTiles, setVisibleTiles] = useState<Set<number>>(
    () => (
      skipIntro
        ? new Set(skills.map((_, idx) => idx))
        : new Set<number>()
    )
  )
  const headerRef = useRef<HTMLDivElement>(null)
  const tileRefs = useRef<(HTMLDivElement | null)[]>([])

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
              setVisibleTiles((prev) => new Set(prev).add(idx))
            }, idx * 60 + (idx < 4 ? 0 : 100))
            timers.push(t)
            obs.unobserve(e.target)
          }
        })
      },
      { threshold: 0, rootMargin: '0px 0px 40px 0px' }
    )

    tileRefs.current.forEach((el) => {
      if (el) obs.observe(el)
    })

    return () => {
      obs.disconnect()
      timers.forEach(clearTimeout)
    }
  }, [skipIntro])

  return (
    <section id="skills" className={`${s.section} ${isActive ? s.sectionInView : ''}`}>
      <div
        ref={headerRef}
        className={`${s.header} ${headerVisible ? s.headerVisible : ''}`}
      >
        <span className={s.headerIndex} aria-hidden="true">03</span>
        <span className={s.headerTitle}>SKILLS</span>
      </div>

      <div className={s.grid}>
        {skills.map((skill, i) => (
          <div
            key={skill.name}
            ref={(el) => { tileRefs.current[i] = el }}
            data-index={i}
            className={[
              s.tile,
              skill.size === 'lg' ? s.tileLg : s.tileMd,
              visibleTiles.has(i) ? s.tileVisible : '',
            ].join(' ')}
          >
            <div>
              <div className={s.tileIcon}>
                <img
                  src={skill.iconSrc}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
              <div className={s.tileName}>{skill.name}</div>
              <div className={s.tileCategory}>{skill.category}</div>
            </div>

            {skill.size === 'lg' && (
              <div
                className={[
                  s.tileWatermark,
                  skill.name === 'React' ? s.tileWatermarkReact : '',
                ].join(' ')}
                aria-hidden="true"
              >
                <img
                  src={skill.iconSrc}
                  alt=""
                  loading="lazy"
                  decoding="async"
                  referrerPolicy="no-referrer"
                />
              </div>
            )}
          </div>
        ))}
      </div>
    </section>
  )
}
