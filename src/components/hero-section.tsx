'use client'

import { useEffect, useRef, useState } from 'react'
import SmokeCanvas from './smoke-canvas'

export default function HeroSection({
  onLoaded,
  skipIntro = false,
}: {
  onLoaded?: () => void
  skipIntro?: boolean
}) {
  const hasCompletedLoadRef = useRef(skipIntro)
  const [isLoaded, setIsLoaded] = useState(skipIntro)
  const heroRef = useRef<HTMLElement>(null)

  useEffect(() => {
    const completeLoad = () => {
      if (hasCompletedLoadRef.current) return
      hasCompletedLoadRef.current = true
      setIsLoaded(true)
      onLoaded?.()
    }

    if (skipIntro) {
      completeLoad()
      return
    }

    const fallback = window.setTimeout(completeLoad, 1050)
    return () => clearTimeout(fallback)
  }, [onLoaded, skipIntro])

  return (
    <header
      ref={heroRef}
      className="hero-paper-shell"
      style={{ scrollSnapAlign: 'start' }}
    >
      <SmokeCanvas heroRef={heroRef} />
      <div className="hero-paper-fibers" aria-hidden="true" />
      <div className="hero-paper-vignette" aria-hidden="true" />
      <div className="hero-paper-frame" aria-hidden="true" />

      <div className="hero-paper-content">
        <h1 className={`hero-name ${isLoaded ? 'is-ready' : ''}`}>
          Zuhaad Rathore
        </h1>
      </div>

      <div className={`hero-paper-scroll ${isLoaded ? 'is-ready' : ''}`}>Scroll to read</div>
    </header>
  )
}
