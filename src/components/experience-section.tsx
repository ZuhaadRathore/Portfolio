'use client'

import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import { Briefcase, Calendar, ExternalLink } from 'lucide-react'
import Link from 'next/link'

interface Experience {
  id: number
  role: string
  company: string
  period: string
  startYear: number
  description: string
  current?: boolean
  websiteUrl?: string
}

const experiences: Experience[] = [
  {
    id: 1,
    role: 'CTO',
    company: 'Aequitas STEM',
    period: '2025 - Present',
    startYear: 2025,
    description: 'Leading technical strategy and development initiatives for STEM education platform serving 1000+ students across 5+ schools.',
    current: true
  },
  {
    id: 2,
    role: 'CTO',
    company: 'Kids in Motion',
    period: '2024 - Present',
    startYear: 2024,
    description: 'Built and architected full-stack sports program management system using Spring Boot, React, and Firebase. Platform has successfully hosted numerous sports drives, engaging nearly 100 kids while managing technical operations and infrastructure.',
    current: true,
    websiteUrl: 'https://kidsinmotionpa.org'
  },
  {
    id: 3,
    role: 'CTO',
    company: 'Mythofy Inc',
    period: '2024 - Present',
    startYear: 2024,
    description: 'Leading a team of 5 developers to revolutionize the gaming space for creators and gamers. Built MythoPay, a multi-platform currency exchange service enabling creators to host stores and seamlessly connect with their favorite games.',
    current: true,
    websiteUrl: 'https://mythofy.net'
  },
  {
    id: 4,
    role: 'Freelance Software Developer',
    company: 'Self-Employed',
    period: '2021 - 2024',
    startYear: 2021,
    description: 'Built custom web applications, desktop solutions, and provided technical consulting for diverse clients.',
    current: false
  }
]

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
      delayChildren: 0.3
    }
  }
}

const itemVariants = {
  hidden: {
    opacity: 0,
    x: -50
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const
    }
  }
}

export default function ExperienceSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 })

  return (
    <motion.section
      ref={ref}
      className="py-8 md:py-16"
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="font-display text-4xl sm:text-5xl md:text-7xl uppercase tracking-tighter text-center mb-8 md:mb-12 text-text-light dark:text-text-dark"
        initial={{ opacity: 0, y: -30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Experience
      </motion.h2>

      <motion.div
        variants={containerVariants}
        initial="hidden"
        animate={isVisible ? "visible" : "hidden"}
        className="max-w-4xl mx-auto space-y-6 md:space-y-8"
      >
        {experiences.map((experience, index) => (
          <motion.div
            key={experience.id}
            variants={itemVariants}
            className="relative"
            whileHover={{
              x: 8,
              transition: { duration: 0.3 }
            }}
          >
            {/* Timeline connector - hide on last item */}
            {index < experiences.length - 1 && (
              <div className="hidden md:block absolute left-6 top-20 w-0.5 h-full bg-border-light dark:bg-border-dark opacity-30" />
            )}

            <div className="bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-5 sm:p-6 md:p-8 shadow-brutal-light dark:shadow-brutal-dark relative overflow-hidden group">
              {/* Hover gradient effect */}
              <motion.div
                className="absolute -inset-1 bg-gradient-to-r from-primary to-yellow-300 rounded-lg blur opacity-0 group-hover:opacity-20 transition duration-1000"
                animate={{
                  rotate: [0, 5, -5, 0],
                }}
                transition={{
                  duration: 6,
                  repeat: Infinity,
                  ease: "easeInOut"
                }}
              />

              <div className="relative z-10">
                <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3 mb-4">
                  <div className="flex-1">
                    <div className="flex items-center gap-3 mb-2">
                      <motion.div
                        className="flex-shrink-0 w-10 h-10 sm:w-12 sm:h-12 bg-primary border-3 border-border-light dark:border-border-dark flex items-center justify-center"
                        whileHover={{ rotate: 5, scale: 1.1 }}
                        transition={{ duration: 0.2 }}
                      >
                        <Briefcase className="h-5 w-5 sm:h-6 sm:w-6 text-black" />
                      </motion.div>
                      <div>
                        <h3 className="font-display text-xl sm:text-2xl md:text-3xl uppercase text-primary leading-tight">
                          {experience.role}
                        </h3>
                        {experience.websiteUrl ? (
                          <Link
                            href={experience.websiteUrl}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="font-body font-bold text-base sm:text-lg text-text-light dark:text-text-dark hover:text-primary transition-colors inline-flex items-center gap-1 group"
                          >
                            {experience.company}
                            <ExternalLink className="h-3 w-3 sm:h-4 sm:w-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                          </Link>
                        ) : (
                          <p className="font-body font-bold text-base sm:text-lg text-text-light dark:text-text-dark">
                            {experience.company}
                          </p>
                        )}
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2 bg-background-light dark:bg-background-dark border-2 border-border-light dark:border-border-dark px-3 py-2 self-start">
                    <Calendar className="h-4 w-4 text-primary" />
                    <span className="font-mono text-sm font-bold text-text-light dark:text-text-dark whitespace-nowrap">
                      {experience.period}
                    </span>
                    {experience.current && (
                      <motion.span
                        className="ml-2 px-2 py-0.5 bg-primary text-black text-xs font-bold uppercase"
                        animate={{
                          scale: [1, 1.05, 1],
                        }}
                        transition={{
                          duration: 2,
                          repeat: Infinity,
                          ease: "easeInOut"
                        }}
                      >
                        Current
                      </motion.span>
                    )}
                  </div>
                </div>

                <p className="text-sm sm:text-base text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                  {experience.description}
                </p>
              </div>
            </div>
          </motion.div>
        ))}
      </motion.div>

      {/* Timeline summary */}
      <motion.div
        className="mt-12 text-center"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.8 }}
      >
        <p className="font-mono text-sm text-text-light/60 dark:text-text-dark/60">
          {experiences.length} positions • {new Date().getFullYear() - 2021}+ years of experience
        </p>
      </motion.div>
    </motion.section>
  )
}
