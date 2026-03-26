'use client'

import { useEffect, useRef, useState } from 'react'
import s from './about-section.module.css'

const SOCIALS = [
  {
    label: 'GitHub',
    href: 'https://github.com/ZuhaadRathore',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className={s.socialIcon}>
        <path d="M8 0C3.58 0 0 3.58 0 8c0 3.54 2.29 6.53 5.47 7.59.4.07.55-.17.55-.38 0-.19-.01-.82-.01-1.49-2.01.37-2.53-.49-2.69-.94-.09-.23-.48-.94-.82-1.13-.28-.15-.68-.52-.01-.53.63-.01 1.08.58 1.23.82.72 1.21 1.87.87 2.33.66.07-.52.28-.87.51-1.07-1.78-.2-3.64-.89-3.64-3.95 0-.87.31-1.59.82-2.15-.08-.2-.36-1.02.08-2.12 0 0 .67-.21 2.2.82.64-.18 1.32-.27 2-.27.68 0 1.36.09 2 .27 1.53-1.04 2.2-.82 2.2-.82.44 1.1.16 1.92.08 2.12.51.56.82 1.27.82 2.15 0 3.07-1.87 3.75-3.65 3.95.29.25.54.73.54 1.48 0 1.07-.01 1.93-.01 2.2 0 .21.15.46.55.38A8.013 8.013 0 0016 8c0-4.42-3.58-8-8-8z" />
      </svg>
    ),
  },
  {
    label: 'LinkedIn',
    href: 'https://linkedin.com/in/zuhaad-rathore',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className={s.socialIcon}>
        <path d="M0 1.146C0 .513.526 0 1.175 0h13.65C15.474 0 16 .513 16 1.146v13.708c0 .633-.526 1.146-1.175 1.146H1.175C.526 16 0 15.487 0 14.854V1.146zm4.943 12.248V6.169H2.542v7.225h2.401zm-1.2-8.212c.837 0 1.358-.554 1.358-1.248-.015-.709-.52-1.248-1.342-1.248-.822 0-1.359.54-1.359 1.248 0 .694.521 1.248 1.327 1.248h.016zm4.908 8.212V9.359c0-.216.016-.432.08-.586.173-.431.568-.878 1.232-.878.869 0 1.216.662 1.216 1.634v3.865h2.401V9.25c0-2.22-1.184-3.252-2.764-3.252-1.274 0-1.845.7-2.165 1.193v.025h-.016l.016-.025V6.169h-2.4c.03.678 0 7.225 0 7.225h2.4z" />
      </svg>
    ),
  },
  {
    label: 'X',
    href: 'https://x.com/ZuhaadRathore',
    icon: (
      <svg viewBox="0 0 16 16" fill="currentColor" className={s.socialIcon}>
        <path d="M12.6.75h2.454l-5.36 6.142L16 15.25h-4.937l-3.867-5.07-4.425 5.07H.316l5.733-6.57L0 .75h5.063l3.495 4.633L12.601.75zm-.86 13.028h1.36L4.323 2.145H2.865l8.875 11.633z" />
      </svg>
    ),
  },
]

export default function AboutSection({
  skipIntro = false,
  isActive = false,
}: {
  skipIntro?: boolean
  isActive?: boolean
}) {
  const [headerVisible, setHeaderVisible] = useState(skipIntro)
  const [contentVisible, setContentVisible] = useState(skipIntro)
  const headerRef = useRef<HTMLDivElement>(null)
  const contentRef = useRef<HTMLDivElement>(null)
  const photoFrameRef = useRef<HTMLDivElement>(null)
  const photoGlareRef = useRef<HTMLDivElement>(null)

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
    if (!contentRef.current) return
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) {
          setContentVisible(true)
          obs.disconnect()
        }
      },
      { threshold: 0.15 }
    )
    obs.observe(contentRef.current)
    return () => obs.disconnect()
  }, [skipIntro])

  function handlePhotoMove(e: React.MouseEvent<HTMLDivElement>) {
    const el = photoFrameRef.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    const dx = (e.clientX - rect.left - rect.width / 2) / (rect.width / 2)
    const dy = (e.clientY - rect.top - rect.height / 2) / (rect.height / 2)
    const rx = -dy * 10
    const ry = dx * 10
    el.style.transition = 'transform 0.05s linear, box-shadow 0.05s linear'
    el.style.transform = `perspective(600px) rotateX(${rx}deg) rotateY(${ry}deg) scale(1.02)`
    el.style.boxShadow = `${-ry * 2.5}px ${rx * 2.5}px 32px rgba(0,0,0,0.22)`
    if (photoGlareRef.current) {
      const gx = ((e.clientX - rect.left) / rect.width) * 100
      const gy = ((e.clientY - rect.top) / rect.height) * 100
      photoGlareRef.current.style.background = `radial-gradient(circle at ${gx}% ${gy}%, rgba(255,255,255,0.14) 0%, transparent 60%)`
      photoGlareRef.current.style.opacity = '1'
    }
  }

  function handlePhotoLeave() {
    const el = photoFrameRef.current
    if (!el) return
    el.style.transition = 'transform 0.6s cubic-bezier(0.22, 1, 0.36, 1), box-shadow 0.5s ease'
    el.style.transform = 'perspective(600px) rotateX(0deg) rotateY(0deg) scale(1)'
    el.style.boxShadow = ''
    if (photoGlareRef.current) {
      photoGlareRef.current.style.opacity = '0'
    }
  }

  return (
    <section id="about" className={`${s.section} ${isActive ? s.sectionInView : ''}`}>
      <div
        ref={headerRef}
        className={`${s.header} ${headerVisible ? s.headerVisible : ''}`}
      >
        <span className={s.headerIndex} aria-hidden="true">01</span>
        <span className={s.headerTitle}>ABOUT</span>
        <span className={s.dateline} aria-hidden="true">VOL. I · ISSUE 2025</span>
      </div>

      <div
        ref={contentRef}
        className={`${s.content} ${contentVisible ? s.visible : ''}`}
      >
        <div className={s.photoWrap}>
          <div
            ref={photoFrameRef}
            className={s.photoFrame}
            onMouseMove={handlePhotoMove}
            onMouseLeave={handlePhotoLeave}
          >
            <div ref={photoGlareRef} className={s.photoGlare} />
            <span className={s.photoPlaceholder}>Photo</span>
          </div>
        </div>

        <div className={s.bio}>
          <h2 className={s.bioName}>
            {'Zuhaad Rathore'.split('').map((char, i) => (
              <span key={i} className={s.bioNameChar} style={{ '--i': i } as React.CSSProperties}>
                {char === ' ' ? '\u00a0' : char}
              </span>
            ))}
          </h2>
          <span className={s.bioRole}>
            {'FULL-STACK ENGINEER'.split('').map((char, i) => (
              <span key={i} className={s.bioRoleChar} style={{ '--i': i } as React.CSSProperties}>
                {char === ' ' ? '\u00a0' : char}
              </span>
            ))}
          </span>
          <p className={s.bioText}>
            I see code the way others see paint — as a medium. I&apos;ve been
            building for the web since 2020, treating every project like a craft
            problem: how the architecture breathes, how the interface feels
            under your hands, how the details land. That belief led me to
            co-found <span className={s.bioAccent}>Mythofy</span>, where I
            shaped the engineering from a blank canvas. I&apos;m looking for a
            team that sees software the same way — as an art worth getting right.
          </p>

          <div className={s.socials}>
            {SOCIALS.map((social, i) => (
              <span key={social.label} style={{ display: 'contents' }}>
                {i > 0 && <span className={s.socialSep} />}
                <a
                  className={s.socialLink}
                  href={social.href}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {social.icon}
                  {social.label}
                </a>
              </span>
            ))}
            <span className={s.socialSep} />
            <a
              className={s.socialLink}
              href="/resume.pdf"
              download
            >
              <svg viewBox="0 0 16 16" fill="currentColor" className={s.socialIcon}>
                <path d="M8 12l-4-4h2.5V2h3v6H12L8 12z" />
                <path d="M2 13h12v1.5H2z" />
              </svg>
              Resume
            </a>
          </div>
        </div>
      </div>
    </section>
  )
}
