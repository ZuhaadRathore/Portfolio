'use client'

import { createContext, useCallback, useContext, useEffect, useRef, useState } from 'react'
import { usePathname, useRouter } from 'next/navigation'
import { motion, AnimatePresence } from 'framer-motion'
import Link from 'next/link'

type TransitionContextType = {
  navigateTo: (href: string) => void
}

const TransitionContext = createContext<TransitionContextType>({
  navigateTo: () => {},
})

export function usePageTransition() {
  return useContext(TransitionContext)
}

/** Link that auto-prefetches and triggers the page transition overlay on click */
export function TransitionLink({
  href,
  children,
  className,
  style,
  onClick,
  ...rest
}: React.ComponentProps<typeof Link>) {
  const { navigateTo } = usePageTransition()

  return (
    <Link
      href={href}
      className={className}
      style={style}
      onClick={(e) => {
        onClick?.(e)
        if (e.defaultPrevented) return
        if (e.button !== 0 || e.metaKey || e.ctrlKey || e.shiftKey || e.altKey) {
          return
        }
        e.preventDefault()
        navigateTo(typeof href === 'string' ? href : href.pathname ?? '/')
      }}
      {...rest}
    >
      {children}
    </Link>
  )
}

const TRANSITION_MS = 600
const TRANSITION_EXIT_MS = 300

export default function PageTransitionProvider({
  children,
}: {
  children: React.ReactNode
}) {
  const router = useRouter()
  const pathname = usePathname()
  const [transitioning, setTransitioning] = useState(false)
  const enterTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const exitTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)
  const previousPathRef = useRef(pathname)
  const scrollPositionsRef = useRef<Map<string, number>>(new Map())

  useEffect(() => {
    return () => {
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current)
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (typeof window === 'undefined') return

    const previousPath = previousPathRef.current
    if (previousPath !== pathname) {
      scrollPositionsRef.current.set(previousPath, window.scrollY)
    }
    previousPathRef.current = pathname

    const restoreY = scrollPositionsRef.current.get(pathname) ?? 0
    const rafId = window.requestAnimationFrame(() => {
      window.scrollTo({ top: restoreY, behavior: 'auto' })
    })

    return () => {
      window.cancelAnimationFrame(rafId)
    }
  }, [pathname])

  const navigateTo = useCallback(
    (href: string) => {
      if (transitioning || href === pathname) return
      setTransitioning(true)

      if (typeof window !== 'undefined') {
        scrollPositionsRef.current.set(pathname, window.scrollY)
      }

      // Eagerly prefetch the target route
      router.prefetch(href)

      // Let the cover animate in, then navigate
      if (enterTimerRef.current) clearTimeout(enterTimerRef.current)
      if (exitTimerRef.current) clearTimeout(exitTimerRef.current)

      enterTimerRef.current = setTimeout(() => {
        router.push(href, { scroll: false })
        // Small extra delay for the new page to start rendering,
        // then lift the cover
        exitTimerRef.current = setTimeout(
          () => setTransitioning(false),
          TRANSITION_EXIT_MS
        )
      }, TRANSITION_MS)
    },
    [pathname, router, transitioning]
  )

  return (
    <TransitionContext.Provider value={{ navigateTo }}>
      {children}

      <AnimatePresence>
        {transitioning && (
          <motion.div
            key="page-transition"
            className="fixed inset-0 z-[999] pointer-events-auto"
            initial="hidden"
            animate="visible"
            exit="exit"
          >
            {/* Top half slides down */}
            <motion.div
              className="absolute top-0 left-0 right-0 h-1/2 bg-[var(--ink)]"
              variants={{
                hidden: { y: '-100%' },
                visible: { y: '0%' },
                exit: { y: '-100%' },
              }}
              transition={{
                duration: TRANSITION_MS / 1000,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
            {/* Bottom half slides up */}
            <motion.div
              className="absolute bottom-0 left-0 right-0 h-1/2 bg-[var(--ink)]"
              variants={{
                hidden: { y: '100%' },
                visible: { y: '0%' },
                exit: { y: '100%' },
              }}
              transition={{
                duration: TRANSITION_MS / 1000,
                ease: [0.76, 0, 0.24, 1],
              }}
            />
            {/* Center logo */}
            <motion.div
              className="absolute inset-0 flex items-center justify-center"
              variants={{
                hidden: { opacity: 0 },
                visible: { opacity: 1 },
                exit: { opacity: 0 },
              }}
              transition={{ duration: 0.25, delay: TRANSITION_MS / 1000 - 0.15 }}
            >
              <span
                className="text-[var(--paper-light)] text-3xl"
                style={{ fontFamily: 'var(--font-display)' }}
              >
                ZR.
              </span>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </TransitionContext.Provider>
  )
}
