'use client'

import { AnimatePresence } from 'framer-motion'
import { useState, useEffect } from 'react'
import Preloader from '@/components/preloader'

export default function LoadingProvider({ children }: { children: React.ReactNode }) {
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    // Total duration of preloader animation sequence
    // 8 words * 140ms = 1120ms
    // Plus a bit of buffer
    const timer = setTimeout(() => {
      setIsLoading(false)
      window.scrollTo(0, 0)
    }, 2000)

    return () => clearTimeout(timer)
  }, [])

  return (
    <AnimatePresence mode="wait">
      {isLoading ? (
        <Preloader key="preloader" />
      ) : (
        <div key="content">{children}</div>
      )}
    </AnimatePresence>
  )
}
