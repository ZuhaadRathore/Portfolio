'use client'

import { useEffect, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

export default function LoadingScreen({
  isLoaded,
  disabled = false,
}: {
  isLoaded: boolean
  disabled?: boolean
}) {
  const [show, setShow] = useState(!disabled)

  useEffect(() => {
    if (disabled) {
      setShow(false)
      return
    }

    if (isLoaded) {
      const timer = setTimeout(() => setShow(false), 800)
      return () => clearTimeout(timer)
    }
  }, [disabled, isLoaded])

  useEffect(() => {
    if (!disabled && show) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
    return () => {
      document.body.style.overflow = ''
    }
  }, [disabled, show])

  return (
    <AnimatePresence>
      {!disabled && show && (
        <motion.div
          initial={{ opacity: 1 }}
          exit={{ opacity: 0 }}
          transition={{ duration: 0.8, ease: [0.43, 0.13, 0.23, 0.96] }}
          className="fixed inset-0 z-[1000] flex flex-col items-center justify-center bg-[var(--paper-light)]"
        >
          {/* Subtle paper texture overlay */}
          <div 
            className="absolute inset-0 pointer-events-none opacity-[0.03]"
            style={{ 
              backgroundImage: `url("data:image/svg+xml,%3Csvg viewBox='0 0 200 200' xmlns='http://www.w3.org/2000/svg'%3E%3Cfilter id='noiseFilter'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.65' numOctaves='3' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23noiseFilter)'/%3E%3C/svg%3E")`,
              mixBlendMode: 'multiply'
            }}
          />

          <div className="relative flex flex-col items-center gap-8">
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
              style={{ fontFamily: 'var(--font-display)', fontSize: '3rem' }}
              className="text-[var(--ink)]"
            >
              ZR.
            </motion.div>

            <div className="w-48 h-[2px] bg-[var(--ink)] opacity-10 relative overflow-hidden">
              <motion.div 
                className="absolute inset-0 bg-[var(--red)]"
                initial={{ x: '-100%' }}
                animate={isLoaded ? { x: '0%' } : { x: '-20%' }}
                transition={{ 
                  duration: isLoaded ? 0.8 : 2, 
                  ease: isLoaded ? "easeOut" : "linear",
                  repeat: isLoaded ? 0 : Infinity
                }}
                style={{ filter: 'url(#pencil-roughen-soft)' }}
              />
            </div>

            <motion.p 
              initial={{ opacity: 0 }}
              animate={{ opacity: 0.5 }}
              className="text-[10px] font-mono tracking-[0.3em] text-[var(--ink)] uppercase"
            >
              {isLoaded ? 'Loaded' : 'Loading'}
            </motion.p>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  )
}
