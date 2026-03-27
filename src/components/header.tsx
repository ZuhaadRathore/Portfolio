'use client'

import { useEffect, useState } from 'react'
import { TransitionLink } from './page-transition'

const NAV_LINKS = [
  { label: 'About', href: '#about' },
  { label: 'Experience', href: '#experience' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
]

export default function Header() {
  const [pastHero, setPastHero] = useState(false)

  useEffect(() => {
    const check = () => setPastHero(window.scrollY > window.innerHeight * 0.85)
    check()
    window.addEventListener('scroll', check, { passive: true })
    return () => window.removeEventListener('scroll', check)
  }, [])

  return (
    <nav
      className={`fixed top-0 w-full z-[100] px-5 py-4 sm:px-12 sm:py-6 flex justify-between items-center ${
        pastHero ? '' : 'mix-blend-difference text-white'
      }`}
    >
      {/* Frosted parchment background — fades in past the hero */}
      <div
        className="absolute inset-0 -z-10 transition-opacity duration-500"
        style={{
          opacity: pastHero ? 1 : 0,
          background: 'rgba(253, 251, 247, 0.92)',
          backdropFilter: 'blur(8px)',
          WebkitBackdropFilter: 'blur(8px)',
          borderBottom: '1px solid rgba(10, 10, 10, 0.08)',
        }}
      />

      <TransitionLink
        href="/"
        className="hover:opacity-80 transition-opacity"
        style={{ fontFamily: 'var(--font-display)', fontSize: '1.5rem' }}
      >
        ZR.
      </TransitionLink>

      {/* Right side: identity over hero, nav links past it */}
      <div className="relative flex items-center">
        {/* Identity text — visible over hero */}
        <div
          className="absolute right-0 text-right uppercase text-[10px] sm:text-xs tracking-wider leading-snug transition-opacity duration-300"
          style={{
            fontFamily: 'var(--font-mono)',
            opacity: pastHero ? 0 : 1,
            pointerEvents: pastHero ? 'none' : 'auto',
          }}
        >
          <div>Software Engineer</div>
          <div style={{ opacity: 0.85 }}>Malvern, PA • 2020–Present</div>
        </div>

        {/* Nav links — visible past hero */}
        <div
          className="flex items-center gap-6 sm:gap-8 transition-opacity duration-300"
          style={{
            opacity: pastHero ? 1 : 0,
            pointerEvents: pastHero ? 'auto' : 'none',
          }}
        >
          {NAV_LINKS.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="uppercase text-[10px] sm:text-xs tracking-wider hover:opacity-50 transition-opacity"
              style={{ fontFamily: 'var(--font-mono)', color: 'var(--ink)' }}
            >
              {link.label}
            </a>
          ))}
        </div>
      </div>
    </nav>
  )
}
