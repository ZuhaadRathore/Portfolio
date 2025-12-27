'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ArrowUpRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef, useState, MouseEvent } from 'react'

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
    image: '/images/tetris.png',
    technologies: ['Tauri', 'Rust', 'React', 'TypeScript', 'Vite'],
    githubUrl: 'https://github.com/ZuhaadRathore/Tetris',
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description: 'This site: a minimalist, high-contrast portfolio with animated interactions and live GitHub activity.',
    image: '/images/portfolio-page-screenshot.png',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion'],
    liveUrl: 'https://zuhaad.com',
    githubUrl: 'https://github.com/ZuhaadRathore/Portfolio',
  },
  {
    id: 4,
    title: 'Anton (TUI-LIB)',
    description: 'Immediate-mode terminal UI kit with deterministic event loop, flex-like layout, widget registry, and CSS-like theming for keyboard-native dashboards.',
    image: '/images/anton-tui-lib.svg',
    technologies: ['Rust', 'Terminal UI', 'Layout Engine', 'Widget Registry', 'Themes'],
    githubUrl: 'https://github.com/ZuhaadRathore/TUI-LIB',
  },
  {
    id: 5,
    title: 'RetentionAI',
    description: 'A Tauri desktop coach that bundles a FastAPI sidecar, PyInstaller-built model runtime, and React UI into a single installer for offline spaced repetition.',
    image: '/images/retentionai.svg',
    technologies: ['Tauri', 'React', 'TypeScript', 'FastAPI', 'Python', 'PyInstaller', 'Zustand'],
    liveUrl: 'https://github.com/ZuhaadRathore/Retention',
    githubUrl: 'https://github.com/ZuhaadRathore/Retention',
  }
]

function ProjectCard({ project }: { project: Project }) {
  const [isDragging, setIsDragging] = useState(false)
  const dragStartPos = useRef({ x: 0, y: 0 })

  const handleMouseDown = (e: MouseEvent) => {
    dragStartPos.current = { x: e.clientX, y: e.clientY }
    setIsDragging(false)
  }

  const handleMouseMove = (e: MouseEvent) => {
    const deltaX = Math.abs(e.clientX - dragStartPos.current.x)
    const deltaY = Math.abs(e.clientY - dragStartPos.current.y)
    if (deltaX > 5 || deltaY > 5) {
      setIsDragging(true)
    }
  }

  const handleClick = (e: MouseEvent<HTMLAnchorElement>) => {
    if (isDragging) {
      e.preventDefault()
    }
  }

  return (
    <div
        className="group relative flex-shrink-0 w-[85vw] sm:w-[60vw] md:w-[45vw] lg:w-[35vw] h-full snap-center"
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
    >
      <div className="h-full bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-4 sm:p-6 flex flex-col shadow-brutal-light dark:shadow-brutal-dark transition-all duration-300 hover:-translate-y-2 hover:shadow-[8px_8px_0px_#000000] dark:hover:shadow-[8px_8px_0px_#FFFFFF]">
        <Link
          href={`/projects/${project.id}`}
          onClick={handleClick}
          className="block w-full aspect-[16/9] bg-gray-100 dark:bg-gray-800 border-2 border-border-light dark:border-border-dark mb-6 overflow-hidden relative group/image cursor-pointer"
        >
          <Image
            src={project.image}
            alt={project.title}
            fill
            sizes="(max-width: 768px) 100vw, (max-width: 1280px) 50vw, 400px"
            className="object-cover object-top transition-transform duration-700 ease-out group-hover/image:scale-110"
          />
          <div className="absolute top-2 right-2 transition-opacity duration-300">
             <div className="bg-surface-light dark:bg-surface-dark border-2 border-border-light dark:border-border-dark p-2 hover:bg-primary transition-colors">
                <ArrowUpRight className="w-5 h-5 text-primary group-hover/image:text-white dark:group-hover/image:text-white" />
             </div>
          </div>
        </Link>

        <div className="flex-1 flex flex-col">
            <Link href={`/projects/${project.id}`} onClick={handleClick} className="block">
                <h3 className="font-display text-2xl sm:text-3xl uppercase text-text-light dark:text-text-dark mb-3 group-hover:text-primary transition-colors line-clamp-1">
                {project.title}
                </h3>
            </Link>
            
            <p className="font-body text-sm text-text-light/70 dark:text-text-dark/70 mb-6 leading-relaxed line-clamp-3">
            {project.description}
            </p>

            <div className="mt-auto flex flex-wrap gap-2">
            {project.technologies?.slice(0, 3).map((tech) => (
                <span
                key={tech}
                className="px-2 py-1 text-[10px] sm:text-xs font-bold uppercase bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark"
                >
                {tech}
                </span>
            ))}
            {project.technologies && project.technologies.length > 3 && (
                <span className="px-2 py-1 text-[10px] sm:text-xs font-bold uppercase bg-background-light dark:bg-background-dark border border-border-light dark:border-border-dark text-text-light dark:text-text-dark">
                    +{project.technologies.length - 3}
                </span>
            )}
            </div>
        </div>
      </div>
    </div>
  )
}

export default function ProjectsSection() {
  const targetRef = useRef<HTMLDivElement>(null)
  const { scrollYProgress } = useScroll({
    target: targetRef,
  })

  return (
    <section
        className="py-24 md:py-40 overflow-visible"
        ref={targetRef}
        id="projects"
    >
      <div className="container mx-auto px-4 mb-12 flex flex-col md:flex-row md:items-end justify-between gap-6">
        <motion.h2
            className="font-display text-5xl sm:text-6xl md:text-8xl uppercase tracking-tighter text-text-light dark:text-text-dark leading-[0.8]"
            initial={{ opacity: 0, x: -50 }}
            whileInView={{ opacity: 1, x: 0 }}
            transition={{ duration: 0.8 }}
            viewport={{ once: true }}
        >
            Selected
            <br />
            <span className="text-primary ml-12 md:ml-24">Works</span>
        </motion.h2>

        <motion.p 
            className="text-text-light/60 dark:text-text-dark/60 font-mono text-xs uppercase tracking-widest mb-2"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            transition={{ delay: 0.5 }}
        >
            Drag or Scroll &rarr;
        </motion.p>
      </div>

      {/* Horizontal Scroll Container */}
      <div
        className="relative w-full overflow-x-auto overflow-y-visible py-8 hide-scrollbar cursor-grab active:cursor-grabbing pl-4 md:pl-[max(1rem,calc((100vw-1280px)/2))]"
      >
        <div className="flex gap-6 sm:gap-8 w-max pr-8">
            {projects.map((project) => (
                <ProjectCard key={project.id} project={project} />
            ))}
            {/* 'View All' Card */}
            <div className="w-[40vw] sm:w-[30vw] md:w-[20vw] h-full flex items-center justify-center">
                <Link 
                    href="/projects" 
                    className="group flex flex-col items-center justify-center w-32 h-32 rounded-full border-2 border-dashed border-text-light/30 dark:border-text-dark/30 hover:border-primary hover:bg-primary transition-all duration-300"
                >
                    <span className="font-display text-xl uppercase text-text-light/50 dark:text-text-dark/50 group-hover:text-black">
                        View All
                    </span>
                    <ArrowUpRight className="w-5 h-5 text-text-light/50 dark:text-text-dark/50 group-hover:text-black mt-1" />
                </Link>
            </div>
        </div>
      </div>
    </section>
  )
}