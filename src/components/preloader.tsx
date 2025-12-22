'use client'

import { motion } from 'framer-motion'
import { useState, useEffect } from 'react'

export default function Preloader() {
  const [index, setIndex] = useState(0)
  const [dimension, setDimension] = useState({ width: 0, height: 0 })

  useEffect(() => {
    setDimension({ width: window.innerWidth, height: window.innerHeight })
  }, [])

  const initialPath = `M0 0 L${dimension.width} 0 L${dimension.width} ${dimension.height} Q${dimension.width / 2} ${dimension.height + 300} 0 ${dimension.height}  L0 0`
  const targetPath = `M0 0 L${dimension.width} 0 L${dimension.width} 0 Q${dimension.width / 2} 0 0 0 L0 0`

  const curve = {
    initial: {
      d: initialPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] }
    },
    exit: {
      d: targetPath,
      transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1], delay: 0.3 }
    }
  }

  const words = ["Hello", "Bonjour", "Ciao", "Olà", "やあ", "Hallå", "Guten tag", "Hallo"]

  useEffect(() => {
    if (index === words.length - 1) return
    const timeout = setTimeout(() => {
      setIndex(index + 1)
    }, 140) // 140ms per word * 8 words ~= 1.1s + exit animation
    return () => clearTimeout(timeout)
  }, [index, words.length])

  return (
    <motion.div
      variants={{
        initial: { top: 0 },
        exit: { top: "-100vh", transition: { duration: 0.8, ease: [0.76, 0, 0.24, 1], delay: 0.2 } }
      }}
      initial="initial"
      exit="exit"
      className="fixed h-screen w-screen bg-text-light dark:bg-text-dark z-50 flex items-center justify-center"
    >
      <motion.p
        className="text-white dark:text-black text-4xl sm:text-6xl font-display uppercase tracking-widest flex items-center"
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        exit={{ opacity: 0 }}
      >
        <span className="block w-2.5 h-2.5 bg-primary rounded-full mr-4" />
        {words[index]}
      </motion.p>
      
      <svg className="absolute top-0 w-full h-[calc(100%+300px)] pointer-events-none fill-text-light dark:fill-text-dark">
        <motion.path variants={curve} initial="initial" exit="exit"></motion.path>
      </svg>
    </motion.div>
  )
}
