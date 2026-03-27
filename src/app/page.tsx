'use client'

import { useCallback, useEffect, useState } from 'react'
import Header from '@/components/header'
import Footer from '@/components/footer'
import HeroSection from '@/components/hero-section'
import Marquee from '@/components/marquee'
import AboutSection from '@/components/about-section'
import ExperienceSection from '@/components/experience-section'
import GitGraph from '@/components/git-graph'
import SkillsSection from '@/components/skills-section'
import ProjectsSection from '@/components/projects-section'
import LoadingScreen from '@/components/loading-screen'

let homeIntroCompleted = false

export default function Home() {
  const [skipIntro] = useState(() => homeIntroCompleted)
  const [heroLoaded, setHeroLoaded] = useState(skipIntro)
  const [activeSection, setActiveSection] = useState<string | null>(null)

  useEffect(() => {
    const ids = ['about', 'experience', 'skills', 'git-graph', 'projects']
    const update = () => {
      const vh = window.innerHeight
      let active: string | null = null
      for (const id of ids) {
        const el = document.getElementById(id)
        if (!el) continue
        const { top, bottom } = el.getBoundingClientRect()
        if (bottom > 0 && top < vh) active = id
      }
      setActiveSection(active)
    }
    window.addEventListener('scroll', update, { passive: true })
    update()
    return () => window.removeEventListener('scroll', update)
  }, [])

  const handleHeroLoaded = useCallback(() => {
    homeIntroCompleted = true
    setHeroLoaded(true)
  }, [])

  return (
    <>
      <LoadingScreen isLoaded={heroLoaded} disabled={skipIntro} />
      <div className="min-h-screen w-full relative">
        <Header />
        <main className="relative z-10">
          <HeroSection skipIntro={skipIntro} onLoaded={handleHeroLoaded} />
          
          <div 
            className="transition-opacity duration-1000" 
            style={{ 
              opacity: heroLoaded ? 1 : 0,
              pointerEvents: heroLoaded ? 'auto' : 'none'
            }}
          >
            <Marquee />
            <>
              <AboutSection skipIntro={skipIntro} isActive={activeSection === 'about'} />
              <ExperienceSection skipIntro={skipIntro} isActive={activeSection === 'experience'} />
              <SkillsSection skipIntro={skipIntro} isActive={activeSection === 'skills'} />
              <GitGraph skipIntro={skipIntro} isActive={activeSection === 'git-graph'} />
              <ProjectsSection skipIntro={skipIntro} isActive={activeSection === 'projects'} />
            </>
          </div>
        </main>
        <Footer />
      </div>
    </>
  )
}
