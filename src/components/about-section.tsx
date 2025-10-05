'use client'

import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import GitHubActivity from './github-activity'

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
                  I&apos;m a passionate full-stack developer who creates beautiful, functional,
                  and user-centered digital experiences. I specialize in modern web technologies
                  including React, Next.js, TypeScript, and Node.js, always staying current
                  with industry best practices.
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
                  I create responsive, accessible, and performant user interfaces with modern frameworks
                  and best practices. I build robust APIs, databases, and server-side applications that
                  power seamless user experiences.
                </p>
                <p>
                  My approach focuses on end-to-end development from concept to deployment, ensuring
                  cohesive and scalable applications that meet both user needs and business objectives.
                </p>
              </div>
            </motion.div>
          </div>
        </motion.div>

        <motion.div variants={itemVariants}>
          <GitHubActivity />
        </motion.div>
      </motion.div>
    </section>
  )
}