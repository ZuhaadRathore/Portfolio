'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.3,
      delayChildren: 0.2
    }
  }
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1
  }
}

const profileVariants = {
  hidden: {
    opacity: 0,
    scale: 0.8,
    rotate: -10
  },
  visible: {
    opacity: 1,
    scale: 1,
    rotate: 0
  }
}

const badgeVariants = {
  hidden: {
    opacity: 0,
    x: 20,
    y: 20
  },
  visible: {
    opacity: 1,
    x: 0,
    y: 0
  }
}

export default function HeroSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 })

  return (
    <section
      ref={ref}
      className="grid grid-cols-1 md:grid-cols-3 gap-6 md:gap-8 items-center"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="contents"
      >
      <div className="md:col-span-2">
        <motion.h1
          className="font-display text-4xl sm:text-6xl md:text-7xl lg:text-9xl uppercase tracking-tighter mb-4 text-text-light dark:text-text-dark leading-tight"
          variants={itemVariants}
        >
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, x: -50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: -50 }}
            transition={{ duration: 0.8, delay: 0.3 }}
          >
            Digital Craftsman
          </motion.span>
          <br />
          <motion.span
            className="inline-block"
            initial={{ opacity: 0, x: 50 }}
            animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 50 }}
            transition={{ duration: 0.8, delay: 0.6 }}
          >
            &amp; Code Artisan
          </motion.span>
        </motion.h1>
        <motion.p
          className="text-base sm:text-lg text-text-light/80 dark:text-text-dark/80 max-w-2xl"
          variants={itemVariants}
        >
          I build exceptional and accessible digital experiences for the web.
        </motion.p>
      </div>
      <div className="relative w-full max-w-[250px] sm:max-w-xs mx-auto md:mx-0">
        <motion.div
          className="absolute top-2 left-2 w-full h-full bg-primary rounded-full"
          initial={{ scale: 0, rotate: 45 }}
          animate={isVisible ? { scale: 1, rotate: 0 } : { scale: 0, rotate: 45 }}
          transition={{ duration: 0.8, delay: 0.7, ease: "backOut" }}
        />
        <motion.div
          className="relative z-10 w-full aspect-square rounded-full border-3 border-border-light dark:border-border-dark overflow-hidden"
          variants={profileVariants}
        >
          <motion.div
            className="relative w-full h-full"
            whileHover={{ scale: 1.05 }}
            transition={{ duration: 0.3 }}
          >
            <Image
              src="/images/pfp.jpg"
              alt="Profile Picture"
              fill
              className="object-cover"
              priority
            />
          </motion.div>
        </motion.div>
        <motion.div
          className="absolute bottom-0 right-0 bg-background-light dark:bg-background-dark p-2 border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark z-20"
          variants={badgeVariants}
          whileHover={{
            scale: 1.1,
            rotate: -2
          }}
          transition={{ duration: 0.2 }}
        >
          <p className="font-body text-sm font-bold uppercase text-primary">
            AVAILABLE FOR HIRE
          </p>
        </motion.div>
      </div>
      </motion.div>
    </section>
  )
}