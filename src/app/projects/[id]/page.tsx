'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Github, ArrowRight } from 'lucide-react'
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import AntonArchitectureDiagram from '@/components/anton-architecture-diagram'
import Magnetic from '@/components/ui/magnetic'
import Link from 'next/link'

interface Project {
  id: number
  title: string
  description: string
  detailedDescription?: string
  image: string
  technologies?: string[]
  liveUrl?: string
  githubUrl?: string
  date?: string
  role?: string
  client?: string
  overview?: string
}

const projects: Project[] = [
  {
    id: 1,
    title: 'ez-tauri',
    description: 'A production-ready Tauri boilerplate with database integration, caching, authentication, and CLI tooling.',
    detailedDescription: 'ez-tauri is a production-ready boilerplate that eliminates the complexity of setting up modern desktop applications. Built with Tauri v2, it provides a complete foundation featuring PostgreSQL database integration with SQLx, Redis caching for performance optimization, robust authentication with Argon2 password hashing, comprehensive logging and tracing, rate limiting, and modular architecture. The accompanying ez-tauri-cli tool enables rapid project scaffolding with React, TypeScript, and Rust components pre-configured. Features include Docker containerization, automated testing suites, linting and formatting tools, and deployment scripts - everything needed to build scalable desktop applications.',
    image: '/images/ez-tauri-cli.png',
    technologies: ['Rust', 'Tauri', 'React', 'TypeScript', 'PostgreSQL', 'Redis', 'Vite', 'TailwindCSS', 'Zustand', 'Node.js'],
    date: '2024',
    role: 'Open Source Author',
    client: 'Open Source Community',
    overview: 'A production-ready Tauri boilerplate with full-stack capabilities and enterprise features.',
    githubUrl: 'https://github.com/ZuhaadRathore/ez-tauri'
  },
  {
    id: 2,
    title: 'Tetris',
    description: 'A fully cross-platform Tetris game with native Android and iOS mobile support alongside desktop builds.',
    detailedDescription: 'A modern implementation of the classic Tetris game built as a truly cross-platform application using Tauri v2. The game features smooth gameplay mechanics, intuitive touch and keyboard controls, and a polished user interface built with React and TypeScript. The Tauri framework enables the application to run efficiently on Windows, macOS, and Linux desktop platforms, with full native mobile support for both Android and iOS devices. The mobile builds are fully configured and tested, providing a native app experience on smartphones and tablets with optimized touch controls. The frontend is powered by Vite for fast development and optimized builds, while the Rust backend handles system-level operations and ensures seamless cross-platform compatibility across all six platforms.',
    image: '/images/tetris.png',
    technologies: ['Tauri', 'Rust', 'React', 'TypeScript', 'Vite'],
    date: '2024',
    role: 'Developer',
    client: 'Personal Project',
    overview: 'Classic Tetris game with native mobile support for Android & iOS, plus desktop builds.',
    githubUrl: 'https://github.com/ZuhaadRathore/Tetris'
  },
  {
    id: 3,
    title: 'Portfolio Website',
    description: 'Personal site built to showcase projects, writing, and live GitHub activity.',
    detailedDescription: 'An immersive personal portfolio built with Next.js 14 that showcases selected work, GitHub activity, and interactive scroll-based animations. Features a high-contrast design, responsive layout, dynamic project filtering, and server-rendered GitHub activity powered by the GraphQL API.',
    image: '/images/portfolio-page-screenshot.png',
    technologies: ['Next.js', 'TypeScript', 'Tailwind CSS', 'Framer Motion', 'GitHub GraphQL API', 'Vercel'],
    date: '2024',
    role: 'Full-Stack Developer',
    client: 'Personal Brand',
    overview: 'Interactive portfolio with animated sections, project deep-dives, and automated GitHub highlights.',
    liveUrl: 'https://zuhaad.com',
    githubUrl: 'https://github.com/ZuhaadRathore/Portfolio'
  },
  {
    id: 4,
    title: 'Anton (TUI-LIB)',
    description: 'Immediate-mode terminal UI kit for keyboard-driven dashboards.',
    detailedDescription: 'Anton (TUI-LIB) is a modern immediate-mode TUI library. It centers on a deterministic event loop, flexbox-style layout (stacks, grids, splits), a widget registry (tables, inputs, status bars, keybind help), and CSS-like theming with semantic tokens and state variants (focused/hovered/disabled) expressed through a `.ath` DSL. Rendering stays double-buffered and flicker-free, input is keyboard-first, and the API keeps layouts explicit so refreshes stay predictable even under heavy state changes.',
    image: '/images/anton-tui-lib.svg',
    technologies: ['Rust', 'Terminal UI', 'Widget System', 'Layout Engine', 'Theming'],
    date: '2024',
    role: 'Library Author',
    client: 'Open Source Community',
    overview: 'Custom terminal UI library focused on fast rendering, keyboard UX, and composable widgets.',
    githubUrl: 'https://github.com/ZuhaadRathore/TUI-LIB'
  },
  {
    id: 5,
    title: 'RetentionAI',
    description: 'A Tauri desktop coach bundling a FastAPI sidecar and embedded ML model into a single installer.',
    detailedDescription: 'RetentionAI wraps a React/Zustand front-end in a Tauri shell and talks to a FastAPI Python sidecar over HTTP. The sidecar exposes /health, /score, /decks, etc., and ships an embedded model under `models/sentence-transformers`. Build scripts download the model, run PyInstaller, stage the binary under `src-tauri/binaries/<platform>`, and then package everything so the user gets one installer with the sidecar bundled.',
    image: '/images/retentionai.svg',
    technologies: ['Tauri', 'React', 'TypeScript', 'FastAPI', 'Python', 'PyInstaller', 'Zustand'],
    date: '2024',
    role: 'Full-Stack Developer',
    client: 'Personal Project',
    overview: 'Cross-platform study coach that ships a bundled ML sidecar and offline-friendly desktop UI.',
    liveUrl: 'https://github.com/ZuhaadRathore/Retention',
    githubUrl: 'https://github.com/ZuhaadRathore/Retention'
  }
]

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = parseInt(params.id as string)
  const project = projects.find(p => p.id === projectId)
  
  // Find next project for navigation
  const nextProjectIndex = projects.findIndex(p => p.id === projectId) + 1
  const nextProject = nextProjectIndex < projects.length ? projects[nextProjectIndex] : projects[0]

  const containerRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: containerRef })
  const y = useTransform(scrollYProgress, [0, 1], [0, 100])

  if (!project) return null

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-body text-text-light dark:text-text-dark selection:bg-primary selection:text-black">
      
      {/* Navigation Bar */}
      <nav className="fixed top-0 left-0 w-full p-6 z-50 flex justify-between items-center mix-blend-difference text-white">
        <Magnetic>
          <button 
            onClick={() => router.push('/')}
            className="flex items-center gap-2 group cursor-pointer"
          >
            <ArrowLeft className="w-6 h-6 group-hover:-translate-x-1 transition-transform" />
            <span className="font-display uppercase tracking-widest text-lg hidden sm:inline">Back</span>
          </button>
        </Magnetic>
      </nav>

      {/* Hero Section */}
      <header className="relative h-[80vh] w-full flex items-end justify-start p-4 sm:p-8 md:p-16 overflow-hidden">
        <motion.div 
            className="absolute inset-0 z-0"
            initial={{ scale: 1.1 }}
            animate={{ scale: 1 }}
            transition={{ duration: 1.5, ease: "easeOut" }}
        >
            <Image
                src={project.image}
                alt={project.title}
                fill
                className="object-cover opacity-60 dark:opacity-40"
                priority
            />
            <div className="absolute inset-0 bg-gradient-to-t from-background-light dark:from-background-dark via-transparent to-transparent" />
        </motion.div>

        <div className="relative z-10 w-full max-w-7xl mx-auto">
            <motion.h1 
                className="font-display text-6xl sm:text-7xl md:text-9xl uppercase tracking-tighter text-text-light dark:text-text-dark leading-[0.8]"
                initial={{ y: 100, opacity: 0 }}
                animate={{ y: 0, opacity: 1 }}
                transition={{ duration: 0.8, delay: 0.2 }}
            >
                {project.title}
            </motion.h1>
        </div>
      </header>

      <main className="max-w-7xl mx-auto px-4 sm:px-8 md:px-16 pb-32" ref={containerRef}>
        <div className="flex flex-col lg:flex-row gap-16 lg:gap-32">
            
            {/* Sidebar / Meta Info */}
            <aside className="lg:w-1/3 space-y-12 h-fit lg:sticky lg:top-32">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    className="space-y-8"
                >
                    <div className="border-t-2 border-border-light/20 dark:border-border-dark/20 pt-4">
                        <span className="block font-mono text-xs uppercase tracking-widest text-text-light/50 dark:text-text-dark/50 mb-2">Role</span>
                        <span className="font-display text-xl sm:text-2xl">{project.role}</span>
                    </div>
                    <div className="border-t-2 border-border-light/20 dark:border-border-dark/20 pt-4">
                        <span className="block font-mono text-xs uppercase tracking-widest text-text-light/50 dark:text-text-dark/50 mb-2">Client</span>
                        <span className="font-display text-xl sm:text-2xl">{project.client}</span>
                    </div>
                    <div className="border-t-2 border-border-light/20 dark:border-border-dark/20 pt-4">
                        <span className="block font-mono text-xs uppercase tracking-widest text-text-light/50 dark:text-text-dark/50 mb-2">Date</span>
                        <span className="font-display text-xl sm:text-2xl">{project.date}</span>
                    </div>

                    <div className="flex flex-col gap-4 pt-4">
                        {project.liveUrl && (
                            <Magnetic>
                                <a 
                                    href={project.liveUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between w-full px-6 py-4 bg-surface-light dark:bg-surface-dark border-2 border-border-light dark:border-border-dark hover:bg-primary hover:text-black transition-colors group"
                                >
                                    <span className="font-display uppercase tracking-wider text-lg">Live Site</span>
                                    <ExternalLink className="w-5 h-5 group-hover:rotate-45 transition-transform" />
                                </a>
                            </Magnetic>
                        )}
                        {project.githubUrl && (
                            <Magnetic>
                                <a 
                                    href={project.githubUrl}
                                    target="_blank"
                                    rel="noopener noreferrer"
                                    className="flex items-center justify-between w-full px-6 py-4 bg-transparent border-2 border-border-light dark:border-border-dark hover:bg-text-light hover:text-background-light dark:hover:bg-text-dark dark:hover:text-background-dark transition-colors group"
                                >
                                    <span className="font-display uppercase tracking-wider text-lg">GitHub</span>
                                    <Github className="w-5 h-5" />
                                </a>
                            </Magnetic>
                        )}
                    </div>
                </motion.div>
            </aside>

            {/* Main Content */}
            <div className="lg:w-2/3 space-y-16">
                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                    transition={{ delay: 0.2 }}
                >
                    <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-primary mb-6">Overview</h2>
                    <p className="text-lg sm:text-xl leading-relaxed opacity-90">
                        {project.overview}
                    </p>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-primary mb-6">The Challenge & Solution</h2>
                    <div className="prose prose-lg dark:prose-invert max-w-none text-text-light/80 dark:text-text-dark/80 font-body">
                         <p>{project.detailedDescription || project.description}</p>
                    </div>
                </motion.div>

                <motion.div
                    initial={{ opacity: 0, y: 20 }}
                    whileInView={{ opacity: 1, y: 0 }}
                    viewport={{ once: true }}
                >
                    <h2 className="font-display text-2xl sm:text-3xl uppercase tracking-wider text-primary mb-6">Technologies</h2>
                    <div className="flex flex-wrap gap-2">
                        {project.technologies?.map((tech, i) => (
                            <span 
                                key={i}
                                className="px-3 py-1 text-sm font-mono border border-border-light/40 dark:border-border-dark/40 rounded-full"
                            >
                                {tech}
                            </span>
                        ))}
                    </div>
                </motion.div>

            </div>
        </div>

        {/* Specific Component Injection for Anton TUI - Full Width Breakout */}
        {project.id === 4 && (
            <motion.div
                initial={{ opacity: 0, y: 50 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, margin: "-100px" }}
                transition={{ duration: 0.8 }}
                className="mt-32 max-w-5xl mx-auto"
            >
                <div className="bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-8 md:p-12 shadow-brutal-light dark:shadow-brutal-dark">
                    <AntonArchitectureDiagram />
                </div>
            </motion.div>
        )}

        {/* Next Project CTA - Full Width */}
        <motion.div 
            className="border-t-2 border-border-light/20 dark:border-border-dark/20 pt-16 mt-32 max-w-5xl mx-auto"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true }}
        >
            <p className="font-mono text-sm uppercase tracking-widest opacity-50 mb-4">Next Project</p>
            <Link href={`/projects/${nextProject.id}`} className="group block">
                <div className="flex items-center justify-between">
                    <span className="font-display text-5xl sm:text-6xl md:text-8xl uppercase tracking-tighter group-hover:text-primary transition-colors">
                        {nextProject.title}
                    </span>
                    <div className="p-4 sm:p-6 rounded-full border-2 border-border-light dark:border-border-dark group-hover:bg-primary group-hover:text-black transition-all">
                        <ArrowRight className="w-8 h-8 sm:w-12 sm:h-12 -rotate-45 group-hover:rotate-0 transition-transform duration-300" />
                    </div>
                </div>
            </Link>
        </motion.div>
      </main>
    </div>
  )
}