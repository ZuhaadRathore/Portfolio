'use client'

import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0
    }
  }
}

const itemVariants = {
  hidden: {
    opacity: 0,
    y: 30
  },
  visible: {
    opacity: 1,
    y: 0
  }
}

export default function AboutSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 })

  return (
    <section
      ref={ref}
      className="mb-16 md:mb-24"
    >
      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="space-y-8 md:space-y-12"
      >
        <motion.div variants={itemVariants}>
          <h2 className="font-display text-4xl sm:text-5xl md:text-6xl uppercase tracking-tighter mb-6 md:mb-8 text-text-light dark:text-text-dark">
            About Me
          </h2>
        </motion.div>

        <motion.div
          variants={itemVariants}
          className="grid grid-cols-1 lg:grid-cols-2 gap-6 md:gap-12"
        >
          <div className="space-y-6">
            <motion.div
              className="bg-background-light dark:bg-background-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark p-5 sm:p-6 md:p-8"
              whileHover={{
                scale: 1.02,
                rotate: 1
              }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight mb-3 md:mb-4 text-primary">
                Bio
              </h3>
              <div className="text-sm sm:text-base text-text-light/80 dark:text-text-dark/80">
                <p>
                  With over 4 years of experience, I&apos;m a passionate full-stack developer who thrives on
                  turning complex problems into elegant solutions. My expertise spans React, Next.js, TypeScript,
                  Rust, and Node.js—but what truly drives me is building products that make a real impact.
                  Whether it&apos;s serving 1000+ students or empowering gaming creators, I focus on crafting
                  digital experiences that are both technically excellent and genuinely useful.
                </p>
              </div>
            </motion.div>

          </div>

          <div className="space-y-6">
            <motion.div
              className="bg-background-light dark:bg-background-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark p-5 sm:p-6 md:p-8"
              whileHover={{
                scale: 1.02,
                rotate: -1
              }}
              transition={{ duration: 0.2 }}
            >
              <h3 className="font-display text-xl sm:text-2xl uppercase tracking-tight mb-3 md:mb-4 text-primary">
                What I Do
              </h3>
              <div className="text-sm sm:text-base text-text-light/80 dark:text-text-dark/80 space-y-3 md:space-y-4">
                <p>
                  From pixel-perfect UIs to high-performance backends, I build complete systems.
                  My frontend work prioritizes accessibility and responsiveness, while my backend
                  expertise includes designing robust APIs, optimizing databases, and architecting
                  scalable infrastructure with PostgreSQL, Redis, and modern cloud platforms.
                </p>
                <p>
                  I believe in owning projects end-to-end. This means not just writing code, but
                  understanding business requirements, making architectural decisions, and shipping
                  products that solve real problems. Currently leading technical teams and building
                  platforms that serve thousands of users daily.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>
      </motion.div>
    </section>
  )
}