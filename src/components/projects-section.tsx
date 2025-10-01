'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, ArrowUpRight } from 'lucide-react'
import { useState } from 'react'
import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'

interface Project {
  id: number
  title: string
  description: string
  image: string
  technologies?: string[]
  liveUrl?: string
  githubUrl?: string
}

const projects: Project[] = [
  {
    id: 1,
    title: 'ez-tauri',
    description: 'A production-ready Tauri boilerplate with PostgreSQL, Redis caching, authentication, and comprehensive tooling. Includes ez-tauri-cli for rapid project scaffolding.',
    image: '/images/ez-tauri-cli.png',
    technologies: ['Rust', 'Tauri', 'React', 'TypeScript', 'PostgreSQL', 'Redis'],
    githubUrl: 'https://github.com/ZuhaadRathore/ez-tauri',
  },
  {
    id: 2,
    title: 'Tetris',
    description: 'A fully cross-platform Tetris game with native Android and iOS mobile support alongside desktop builds. Built with Tauri, React, and TypeScript for seamless gameplay across all devices.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkuQKlxgbvdvYr9Ag9hzbz0CftKXqNsxzzzJzGjDPpvGUY9cYtYWQoTBxrgmDyfThzkCOmljVkwLF82mboylBallQKDqmbDPTx61quNkUrY6Xapk8WOcUG7_U1Czwi-twKwIc2dTUSCsvkwJw3B_VrJ1g4xkci0zqPyNAu0D38jhFiClN_ECFo_Mvmicl0awpNugUb-U2hHugNKYlD9bBXtoOid2ELT0DfFSdPYdH5Rnsc1GPe2fyF5SYRalr4Kw22iQLhzVnbSciV',
    technologies: ['Tauri', 'Rust', 'React', 'TypeScript', 'Vite'],
    githubUrl: 'https://github.com/ZuhaadRathore/Tetris',
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description: 'This site: a minimalist, high-contrast portfolio with animated interactions and live GitHub activity.',
    image: '/images/portfolio-site.svg',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://zuhaad.com',
    githubUrl: 'https://github.com/ZuhaadRathore/Portfolio',
  },
  {
    id: 4,
    title: 'Kids in Motion',
    description: 'A full-stack sports program management system for children\'s sports programs. Features event management, participant registration, volunteer coordination, and an admin dashboard with Firebase authentication and Spring Boot backend.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkuQKlxgbvdvYr9Ag9hzbz0CftKXqNsxzzzJzGjDPpvGUY9cYtYWQoTBxrgmDyfThzkCOmljVkwLF82mboylBallQKDqmbDPTx61quNkUrY6Xapk8WOcUG7_U1Czwi-twKwIc2dTUSCsvkwJw3B_VrJ1g4xkci0zqPyNAu0D38jhFiClN_ECFo_Mvmicl0awpNugUb-U2hHugNKYlD9bBXtoOid2ELT0DfFSdPYdH5Rnsc1GPe2fyF5SYRalr4Kw22iQLhzVnbSciV',
    technologies: ['Spring Boot', 'React', 'Firebase', 'PostgreSQL', 'Java', 'Tailwind CSS'],
    liveUrl: 'https://kidsinmotionpa.org',
    githubUrl: 'https://github.com/ZuhaadRathore/KidsInMotion',
  }
]

interface ProjectCardProps {
  project: Project
}

const projectCardVariants = {
  hidden: {
    opacity: 0,
    y: 60,
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
  }
}

function ProjectCard({ project }: ProjectCardProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 })

  return (
    <motion.div
      ref={ref as any}
      className="group relative block w-full"
      variants={projectCardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      whileHover={{
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      <motion.div
        className="absolute -inset-0.5 bg-gradient-to-r from-primary to-yellow-300 rounded-lg blur opacity-0 group-hover:opacity-75 transition duration-1000 group-hover:duration-200"
        animate={{
          rotate: [0, 5, -5, 0],
        }}
        transition={{
          duration: 6,
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />
      <motion.div
        className="relative bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-2 sm:p-3 rounded-none shadow-brutal-light dark:shadow-brutal-dark"
        whileHover={{
          x: -8,
          y: -8,
          transition: { duration: 0.3, ease: "easeOut" }
        }}
      >
        <div className="w-full aspect-[2/1] bg-center bg-no-repeat bg-cover border-3 border-border-light dark:border-border-dark mb-2 overflow-hidden relative group/image">
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 60vw, 600px"
            className="object-cover object-top transition-transform duration-500 group-hover/image:scale-110"
            priority
            loading="eager"
          />
          <Link
            href={`/projects/${project.id}`}
            aria-label={`Open ${project.title} details`}
            className="absolute top-2 right-2 sm:top-3 sm:right-3 z-10"
          >
            <motion.span
              className="inline-flex bg-surface-light dark:bg-surface-dark border-2 border-border-light dark:border-border-dark p-1.5 sm:p-2 hover:bg-primary hover:text-black shadow-brutal-light dark:shadow-brutal-dark transition-colors duration-200"
              whileHover={{
                scale: 1.1,
                rotate: 5
              }}
              whileTap={{ scale: 0.95 }}
            >
              <ArrowUpRight className="h-3 w-3 sm:h-4 sm:w-4" />
            </motion.span>
          </Link>
        </div>

        <Link href={`/projects/${project.id}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="block"
          >
            <h3 className="font-display text-lg sm:text-xl uppercase text-primary mb-1 hover:text-yellow-300 transition-colors">
              {project.title}
            </h3>
            <p className="font-body text-xs sm:text-sm text-text-light/70 dark:text-text-dark/70 mb-2 line-clamp-3">
              {project.description}
            </p>
            {project.technologies && (
              <div className="flex flex-wrap gap-2">
                {project.technologies.map((tech, index) => (
                  <motion.span
                    key={tech}
                    className="px-2 py-1 text-xs font-bold uppercase bg-primary text-black rounded-none"
                    initial={{ opacity: 0, scale: 0.8 }}
                    animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
                    transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                    whileHover={{
                      scale: 1.1,
                      backgroundColor: "#fbbf24"
                    }}
                  >
                    {tech}
                  </motion.span>
                ))}
              </div>
            )}
          </motion.div>
        </Link>
      </motion.div>
    </motion.div>
  )
}

export default function ProjectsSection() {
  const [currentIndex, setCurrentIndex] = useState(0)
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 })

  const nextProject = () => {
    if (currentIndex < projects.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const prevProject = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToProject = (index: number) => {
    setCurrentIndex(index)
  }

  const currentProject = projects[currentIndex]

  return (
    <section
      ref={ref}
      className="py-8 md:py-16"
    >
      <h2
        className="font-display text-4xl sm:text-5xl md:text-7xl uppercase tracking-tighter text-center mb-8 md:mb-12 text-text-light dark:text-text-dark"
      >
        Featured Projects
      </h2>
      <div className="relative flex items-center justify-center gap-2 sm:gap-4 md:gap-8 max-w-7xl mx-auto">
        <button
          onClick={prevProject}
          disabled={currentIndex === 0}
          className={`hidden sm:flex bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-3 md:p-4 shadow-brutal-light dark:shadow-brutal-dark transition-colors duration-200 ${
            currentIndex === 0
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-primary hover:text-black'
          }`}
        >
          <ChevronLeft className="h-6 w-6 md:h-8 md:w-8" />
        </button>

        <div className="flex-1 max-w-4xl">
          <ProjectCard
            key={currentProject.id}
            project={currentProject}
          />
        </div>

        <button
          onClick={nextProject}
          disabled={currentIndex === projects.length - 1}
          className={`hidden sm:flex bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-3 md:p-4 shadow-brutal-light dark:shadow-brutal-dark transition-colors duration-200 ${
            currentIndex === projects.length - 1
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-primary hover:text-black'
          }`}
        >
          <ChevronRight className="h-6 w-6 md:h-8 md:w-8" />
        </button>
      </div>

      {/* Mobile Navigation Buttons */}
      <div className="sm:hidden flex justify-center gap-4 mt-6">
        <button
          onClick={prevProject}
          disabled={currentIndex === 0}
          className={`flex items-center gap-2 px-4 py-2 bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark font-bold uppercase text-sm transition-colors duration-200 ${
            currentIndex === 0
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-primary hover:text-black'
          }`}
        >
          <ChevronLeft className="h-4 w-4" />
          Prev
        </button>
        <button
          onClick={nextProject}
          disabled={currentIndex === projects.length - 1}
          className={`flex items-center gap-2 px-4 py-2 bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark font-bold uppercase text-sm transition-colors duration-200 ${
            currentIndex === projects.length - 1
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-primary hover:text-black'
          }`}
        >
          Next
          <ChevronRight className="h-4 w-4" />
        </button>
      </div>

      {/* Navigation Indicators */}
      <motion.div
        className="flex justify-center items-center gap-3 mt-8"
        initial={{ opacity: 0, y: 20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
        transition={{ duration: 0.6, delay: 0.4 }}
      >
        {projects.map((_, index) => (
          <motion.button
            key={index}
            onClick={() => goToProject(index)}
            className={`relative w-3 h-3 border-2 border-border-light dark:border-border-dark transition-colors duration-200 ${
              index === currentIndex
                ? 'bg-primary'
                : 'bg-surface-light dark:bg-surface-dark hover:bg-primary/50'
            }`}
            whileHover={{ scale: 1.2 }}
            whileTap={{ scale: 0.9 }}
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isVisible ? { opacity: 1, scale: 1 } : { opacity: 0, scale: 0.8 }}
            transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
            aria-label={`Go to project ${index + 1}`}
          >
            {index === currentIndex && (
              <motion.div
                className="absolute inset-0 bg-primary"
                layoutId="activeIndicator"
                initial={false}
                transition={{ duration: 0.3, ease: "easeInOut" }}
              />
            )}
          </motion.button>
        ))}

        {/* Project Counter */}
        <motion.span
          className="ml-4 text-sm font-mono text-text-light/60 dark:text-text-dark/60"
          initial={{ opacity: 0, x: 10 }}
          animate={isVisible ? { opacity: 1, x: 0 } : { opacity: 0, x: 10 }}
          transition={{ duration: 0.6, delay: 0.6 }}
        >
          {String(currentIndex + 1).padStart(2, '0')} / {String(projects.length).padStart(2, '0')}
        </motion.span>
      </motion.div>

    </section>
  )
}
