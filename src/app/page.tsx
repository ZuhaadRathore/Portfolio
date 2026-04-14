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
import TerminalHero from '@/components/terminal-hero'

let homeIntroCompleted = false

export default function Home() {
  const [skipIntro] = useState(() => homeIntroCompleted)
  const [heroLoaded, setHeroLoaded] = useState(skipIntro)
  const [activeSection, setActiveSection] = useState<string | null>(null)
  
  // Two main states: 'intro' (3D computer) and 'main' (rest of site)
  const [view, setView] = useState<'intro' | 'main'>(skipIntro ? 'main' : 'intro')

  useEffect(() => {
    if (view !== 'main') return
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
  }, [view])

  const handleHeroLoaded = useCallback(() => {
    setHeroLoaded(true)
  }, [])

  const handleEnterMain = useCallback(() => {
    homeIntroCompleted = true
    setView('main')
    // Scroll to top immediately so the seamless handoff works
    window.scrollTo(0, 0)
  }, [])

  return (
    <>
      <LoadingScreen isLoaded={heroLoaded} disabled={skipIntro} />
      <div className="min-h-screen w-full relative">
        {view === 'intro' && (
          <main className="relative z-50">
            <HeroSection skipIntro={skipIntro} onLoaded={handleHeroLoaded} onEnterMain={handleEnterMain} />
          </main>
        )}
        
        {view === 'main' && (
          <div className="relative z-10 animate-fade-in">
            <Header />
            <main>
              <TerminalHero />
              <Marquee />
              <AboutSection skipIntro={true} isActive={activeSection === 'about'} />
              <ExperienceSection skipIntro={true} isActive={activeSection === 'experience'} />
              <SkillsSection skipIntro={true} isActive={activeSection === 'skills'} />
              <GitGraph skipIntro={true} isActive={activeSection === 'git-graph'} />
              <ProjectsSection skipIntro={true} isActive={activeSection === 'projects'} />
            </main>
            <Footer />
          </div>
        )}
      </div>

      <style jsx global>{`
        .animate-fade-in {
          animation: fadeIn 1s ease-out forwards;
        }
        @keyframes fadeIn {
          from { opacity: 0; }
          to { opacity: 1; }
        }
      `}</style>
    </>
  )
}

