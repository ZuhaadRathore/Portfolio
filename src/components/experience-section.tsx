'use client'

import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import { Briefcase, Calendar, ExternalLink } from 'lucide-react'
import Link from 'next/link'
import Magnetic from '@/components/ui/magnetic'

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

export default function ExperienceSection() {
  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({
    target: containerRef,
    offset: ["start end", "end center"]
  })

  return (
    <section
      ref={containerRef}
      className="py-16 md:py-32 relative"
    >
      <div className="max-w-4xl mx-auto px-4">
        <motion.h2
            className="font-display text-5xl sm:text-6xl md:text-8xl uppercase tracking-tighter text-center mb-16 md:mb-24 text-text-light dark:text-text-dark"
            initial={{ opacity: 0, y: 50 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, margin: "-100px" }}
            transition={{ duration: 0.8 }}
        >
            Experience
        </motion.h2>

        <div className="relative space-y-12 md:space-y-16">
            {/* Animated Timeline Line */}
            <div className="absolute left-6 md:left-8 top-4 w-1 bg-border-light/20 dark:bg-border-dark/20 hidden md:block" style={{ height: 'calc(100% - 1rem)' }}>
                <motion.div
                    className="w-full bg-primary origin-top"
                    style={{ scaleY: scrollYProgress, height: "100%" }}
                />
            </div>

            {experiences.map((experience, index) => (
            <motion.div
                key={experience.id}
                initial={{ opacity: 0, x: -50 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.6, delay: index * 0.1 }}
                className="relative pl-0 md:pl-24"
            >
                {/* Timeline Dot */}
                <div className="absolute left-6 md:left-8 top-8 -translate-x-1/2 w-4 h-4 rounded-full bg-surface-light dark:bg-surface-dark border-4 border-primary z-10 hidden md:block" />

                <div className="group relative bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-6 sm:p-8 shadow-brutal-light dark:shadow-brutal-dark hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_#000000] dark:hover:shadow-[8px_8px_0px_#FFFFFF] transition-all duration-300">
                    
                    <div className="flex flex-col md:flex-row md:items-start md:justify-between gap-4 mb-6">
                        <div>
                            <h3 className="font-display text-2xl sm:text-3xl uppercase text-text-light dark:text-text-dark mb-2">
                                {experience.role}
                            </h3>
                            <div className="flex items-center gap-2 text-primary font-bold text-lg">
                                <Briefcase className="w-5 h-5" />
                                {experience.websiteUrl ? (
                                    <Link 
                                        href={experience.websiteUrl}
                                        target="_blank"
                                        className="hover:underline decoration-2 underline-offset-4 flex items-center gap-1"
                                    >
                                        {experience.company}
                                        <ExternalLink className="w-4 h-4" />
                                    </Link>
                                ) : (
                                    <span>{experience.company}</span>
                                )}
                            </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-3">
                            <span className="flex items-center gap-2 px-3 py-1 font-mono text-sm font-bold border-2 border-border-light dark:border-border-dark bg-background-light dark:bg-background-dark">
                                <Calendar className="w-4 h-4" />
                                {experience.period}
                            </span>
                            {experience.current && (
                                <span className="px-3 py-1 font-mono text-sm font-bold bg-primary text-black border-2 border-primary">
                                    CURRENT
                                </span>
                            )}
                        </div>
                    </div>

                    <p className="text-lg text-text-light/80 dark:text-text-dark/80 leading-relaxed font-body">
                        {experience.description}
                    </p>
                </div>
            </motion.div>
            ))}
        </div>

        <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
             <Link href="/public/README_RESUME.md" target="_blank" className="inline-block">
                <Magnetic>
                    <div className="px-8 py-4 bg-text-light dark:bg-text-dark text-background-light dark:text-background-dark font-display text-xl uppercase tracking-wider hover:bg-primary hover:text-black transition-colors">
                        View Full Resume
                    </div>
                </Magnetic>
            </Link>
        </motion.div>
      </div>
    </section>
  )
}