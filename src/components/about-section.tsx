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
                  I&apos;m a <span className="text-primary font-semibold">systems-focused engineer</span> who builds at the intersection of
                  <span className="text-primary font-semibold"> low-level performance and modern web</span>. With deep expertise in
                  <span className="text-primary font-semibold"> Rust for high-performance systems</span>, I bring that same rigor to crafting
                  blazing-fast web applications. My work spans from <span className="text-primary font-semibold">machine learning pipelines</span> to
                  production web platforms serving <span className="text-primary font-semibold">1000+ users daily</span>—all built with a focus on
                  performance, scalability, and elegant architecture.
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
                  On the web, I architect full-stack applications with <span className="text-primary font-semibold">React, Next.js, and TypeScript</span>,
                  building <span className="text-primary font-semibold">real-time systems</span> and crafting interfaces that feel effortless.
                  My <span className="text-primary font-semibold">Rust expertise</span> powers everything from performance-critical backends to
                  <span className="text-primary font-semibold"> WebAssembly modules</span> that bring native speed to the browser.
                  I leverage <span className="text-primary font-semibold">PostgreSQL, Redis</span>, and modern infrastructure to build systems that scale.
                </p>
                <p>
                  In the <span className="text-primary font-semibold">ML space</span>, I build and deploy practical models—from
                  <span className="text-primary font-semibold"> NLP pipelines to computer vision</span> systems. I focus on the entire ML lifecycle:
                  data engineering, model training, optimization, and production deployment. Whether it&apos;s integrating
                  <span className="text-primary font-semibold"> LLMs into applications</span> or building custom ML solutions from scratch,
                  I bridge the gap between research and real-world impact.
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