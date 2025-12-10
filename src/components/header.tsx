'use client'

import { useTheme } from 'next-themes'
import { useEffect, useState } from 'react'
import { Sun, Moon, Download, Menu, X, Github, Linkedin, Twitter } from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

const navItems = [
  { name: 'Home', href: '#home' },
  { name: 'About', href: '#about' },
  { name: 'Experience', href: '#experience' },
  { name: 'Skills', href: '#skills' },
  { name: 'Projects', href: '#projects' }
]

const logThemeTransition = (...args: unknown[]) => {
  // Debug logging disabled in production
}

const TRANSITION_DURATION = 300

// Helper function to get scroll position across all browsers/devices
const getScrollPosition = (): number => {
  return window.scrollY || document.documentElement.scrollTop || document.body.scrollTop || 0
}

// Helper function to scroll to position across all browsers/devices
const setScrollPosition = (position: number): void => {
  window.scrollTo({ top: position, behavior: 'smooth' })
  // Fallback for browsers that don't support scrollTo with options
  if (getScrollPosition() === 0 && position > 0) {
    document.documentElement.scrollTop = position
    document.body.scrollTop = position
  }
}

export default function Header() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)
  const [currentTime, setCurrentTime] = useState('')
  const [isDaytime, setIsDaytime] = useState(true)
  const [activeSection, setActiveSection] = useState('home')
  const [isScrolled, setIsScrolled] = useState(false)
  const [isTransitioning, setIsTransitioning] = useState(false)
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false)

  useEffect(() => {
    setMounted(true)

    const updateTime = () => {
      const now = new Date()
      const eastern = new Intl.DateTimeFormat('en-US', {
        timeZone: 'America/New_York',
        hour12: false,
        hour: '2-digit',
        minute: '2-digit'
      }).format(now)
      setCurrentTime(eastern)

      const easternHour = new Date().toLocaleString('en-US', {
        timeZone: 'America/New_York',
        hour: 'numeric',
        hour12: false
      })
      const hour = parseInt(easternHour)

      setIsDaytime(hour >= 6 && hour < 18)
    }

    updateTime()
    const interval = setInterval(updateTime, 1000)

    const handleScroll = () => {
      const currentScroll = getScrollPosition()
      setIsScrolled(currentScroll > 50)

      const sections = ['home', 'about', 'experience', 'skills', 'projects']
      const headerOffset = 160
      const scrollPosition = currentScroll + headerOffset

      for (const section of sections) {
        const element = document.getElementById(section)
        if (element) {
          const offsetTop = element.offsetTop
          const height = element.offsetHeight

          if (scrollPosition >= offsetTop && scrollPosition < offsetTop + height) {
            setActiveSection(section)
            break
          }
        }
      }
    }

    window.addEventListener('scroll', handleScroll)
    handleScroll()

    return () => {
      clearInterval(interval)
      window.removeEventListener('scroll', handleScroll)
    }
  }, [])


  const handleThemeToggle = () => {
    if (!mounted || isTransitioning) {
      return
    }

    const newTheme = theme === 'dark' ? 'light' : 'dark'

    logThemeTransition('Simple theme transition start', {
      currentTheme: theme,
      newTheme
    })

    setIsTransitioning(true)
    setTheme(newTheme)

    setTimeout(() => {
      setIsTransitioning(false)
      logThemeTransition('Simple theme transition completed', { newTheme })
    }, TRANSITION_DURATION)
  }

  const scrollToSection = (href: string) => {
    const targetId = href.replace('#', '')

    // Close mobile menu when navigating
    setIsMobileMenuOpen(false)

    if (targetId === 'home') {
      setScrollPosition(0)
      return
    }

    const element = document.getElementById(targetId)
    if (element) {
      const headerOffset = 100
      const currentScroll = getScrollPosition()
      const elementPosition = element.getBoundingClientRect().top + currentScroll - headerOffset
      setScrollPosition(elementPosition)
    }
  }

  if (!mounted) return null

  return (
    <>
      <motion.header
        className={`sticky top-0 z-50 w-full border-b-3 ${
          isScrolled
            ? 'bg-background-light dark:bg-background-dark/95 backdrop-blur-md'
            : 'bg-background-light dark:bg-background-dark'
        } border-border-light dark:border-border-dark`}
        initial={{ y: -100, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 0.6, ease: 'easeOut' }}
      >
        <div className="container mx-auto flex items-center justify-between whitespace-nowrap px-4 sm:px-6 lg:px-8 py-4">
          <div className="flex items-center gap-4 md:gap-8">
            <motion.a
              className="text-2xl md:text-3xl font-display text-text-light dark:text-text-dark"
              href="/"
              whileHover={{ scale: 1.05 }}
              transition={{ duration: 0.2 }}
            >
              ZUHAAD
            </motion.a>

            <nav className="hidden md:flex items-center gap-6">
              {navItems.map((item) => (
                <motion.button
                  key={item.name}
                  onClick={() => scrollToSection(item.href)}
                  className="relative text-sm font-bold uppercase tracking-wider text-text-light/70 dark:text-text-dark/70 hover:text-primary"
                  whileHover={{ y: -2 }}
                  transition={{ duration: 0.2 }}
                >
                  {item.name}
                  {activeSection === item.href.replace('#', '') && (
                    <motion.div
                      className="absolute -bottom-1 left-0 w-full h-0.5 bg-primary"
                      layoutId="activeSection"
                      initial={false}
                      transition={{ duration: 0.3, ease: 'easeInOut' }}
                    />
                  )}
                </motion.button>
              ))}
            </nav>
          </div>

          <div className="flex items-center gap-2 md:gap-4">
            <motion.div
              className="hidden md:flex flex-col text-right"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              <p className="text-xs uppercase tracking-widest font-bold text-primary">
                Malvern, PA
              </p>
              <p className="text-xs font-mono text-text-light dark:text-text-dark">
                EST {currentTime}
              </p>
            </motion.div>

            <motion.a
              href="/resume.pdf"
              download="Zuhaad_Resume.pdf"
              className="hidden sm:flex items-center gap-2 px-3 py-2 bg-primary text-black font-bold uppercase text-sm border-3 border-border-light dark:border-border-dark hover:bg-yellow-300 transition-colors duration-200 shadow-brutal-light dark:shadow-brutal-dark"
              whileHover={{ scale: 1.05, y: -2 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
              title="Download Resume"
            >
              <Download className="h-4 w-4" />
              <span>Resume</span>
            </motion.a>

            <motion.button
              onClick={handleThemeToggle}
              className="theme-toggle-btn relative flex h-10 w-10 items-center justify-center rounded-none bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark text-text-light dark:text-text-dark shadow-brutal-light dark:shadow-brutal-dark overflow-hidden transition-all duration-300 ease-in-out"
              title="Toggle theme"
              whileHover={{ scale: 1.15 }}
              whileTap={{ scale: 0.95 }}
              initial={{ opacity: 0, rotate: -90 }}
              animate={{
                opacity: 1,
                rotate: 0,
                filter: isTransitioning ? 'brightness(1.2)' : 'brightness(1)'
              }}
              transition={{ duration: 0.6, delay: 0.4 }}
              disabled={isTransitioning}
              aria-disabled={isTransitioning}
            >
              <AnimatePresence mode="wait">
                {isDaytime ? (
                  <motion.div
                    key="sun"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Sun className="h-5 w-5 relative z-10" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="moon"
                    initial={{ scale: 0, rotate: -180 }}
                    animate={{ scale: 1, rotate: 0 }}
                    exit={{ scale: 0, rotate: 180 }}
                    transition={{ duration: 0.3 }}
                  >
                    <Moon className="h-5 w-5 relative z-10" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>

            {/* Mobile Menu Toggle */}
            <motion.button
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="md:hidden flex h-10 w-10 items-center justify-center bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark text-text-light dark:text-text-dark shadow-brutal-light dark:shadow-brutal-dark"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
              aria-label="Toggle mobile menu"
            >
              <AnimatePresence mode="wait">
                {isMobileMenuOpen ? (
                  <motion.div
                    key="close"
                    initial={{ rotate: -90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: 90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <X className="h-5 w-5" />
                  </motion.div>
                ) : (
                  <motion.div
                    key="menu"
                    initial={{ rotate: 90, opacity: 0 }}
                    animate={{ rotate: 0, opacity: 1 }}
                    exit={{ rotate: -90, opacity: 0 }}
                    transition={{ duration: 0.2 }}
                  >
                    <Menu className="h-5 w-5" />
                  </motion.div>
                )}
              </AnimatePresence>
            </motion.button>
          </div>
        </div>

        {/* Mobile Menu */}
        <AnimatePresence>
          {isMobileMenuOpen && (
            <motion.div
              initial={{ height: 0, opacity: 0 }}
              animate={{ height: 'auto', opacity: 1 }}
              exit={{ height: 0, opacity: 0 }}
              transition={{ duration: 0.3, ease: 'easeInOut' }}
              className="md:hidden overflow-hidden border-t-3 border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark"
            >
              <nav className="container mx-auto px-4 py-6 space-y-4">
                {navItems.map((item, index) => (
                  <motion.button
                    key={item.name}
                    onClick={() => scrollToSection(item.href)}
                    className="block w-full text-left py-3 px-4 font-bold uppercase tracking-wider text-text-light dark:text-text-dark hover:bg-primary hover:text-black border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark transition-colors duration-200"
                    initial={{ x: -50, opacity: 0 }}
                    animate={{ x: 0, opacity: 1 }}
                    exit={{ x: -50, opacity: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.1 }}
                    whileTap={{ scale: 0.98 }}
                  >
                    {item.name}
                    {activeSection === item.href.replace('#', '') && (
                      <motion.span className="ml-2 text-primary">●</motion.span>
                    )}
                  </motion.button>
                ))}

                {/* Mobile Resume Button */}
                <motion.a
                  href="/resume.pdf"
                  download="Zuhaad_Resume.pdf"
                  className="sm:hidden flex items-center justify-center gap-2 w-full py-3 px-4 bg-primary text-black font-bold uppercase border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark"
                  initial={{ x: -50, opacity: 0 }}
                  animate={{ x: 0, opacity: 1 }}
                  exit={{ x: -50, opacity: 0 }}
                  transition={{ duration: 0.3, delay: navItems.length * 0.1 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Download className="h-4 w-4" />
                  Download Resume
                </motion.a>

                {/* Mobile Social Links */}
                <motion.div
                  className="flex justify-center gap-6 pt-4 border-t-3 border-border-light dark:border-border-dark"
                  initial={{ y: 20, opacity: 0 }}
                  animate={{ y: 0, opacity: 1 }}
                  exit={{ y: 20, opacity: 0 }}
                  transition={{ duration: 0.3, delay: (navItems.length + 1) * 0.1 }}
                >
                  <Link
                    href="https://github.com/ZuhaadRathore"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="GitHub"
                    className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
                  >
                    <Github className="w-6 h-6" />
                  </Link>
                  <Link
                    href="https://linkedin.com/in/zuhaad-rathore"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="LinkedIn"
                    className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
                  >
                    <Linkedin className="w-6 h-6" />
                  </Link>
                  <Link
                    href="https://twitter.com/zuhaad_rathore"
                    target="_blank"
                    rel="noopener noreferrer"
                    aria-label="Twitter"
                    className="text-text-light dark:text-text-dark hover:text-primary transition-colors"
                  >
                    <Twitter className="w-6 h-6" />
                  </Link>
                </motion.div>
              </nav>
            </motion.div>
          )}
        </AnimatePresence>
      </motion.header>
    </>
  )
}
