'use client'

import { useEffect, useRef } from 'react'
import RetroComputerHero from './ui/retro-computer-hero'

export default function HeroSection({
  onLoaded,
  onEnterMain,
  skipIntro = false,
}: {
  onLoaded?: () => void
  onEnterMain: () => void
  skipIntro?: boolean
}) {
  const hasCompletedLoadRef = useRef(skipIntro)

  useEffect(() => {
    if (skipIntro && !hasCompletedLoadRef.current) {
      hasCompletedLoadRef.current = true
      onLoaded?.()
    }
  }, [onLoaded, skipIntro])

  const handleLoaded = () => {
    if (hasCompletedLoadRef.current) return
    hasCompletedLoadRef.current = true
    onLoaded?.()
  }

  return (
    <header
      className="hero-terminal-shell"
      style={{ scrollSnapAlign: 'start', position: 'relative', width: '100%', background: '#000' }}
    >
      <RetroComputerHero onLoaded={handleLoaded} onEnterMain={onEnterMain} />
    </header>
  )
}

