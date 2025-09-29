'use client'

import Image from 'next/image'
import Link from 'next/link'
import { ChevronLeft, ChevronRight, Maximize2, X, ExternalLink, Github } from 'lucide-react'
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVPQt-SeRFPjgIqJcOmerdZV6FUh9k_blC8cIO_99GIB7jsj4-pdZISn6Zf8bfNAyd1G9BNFDshLQBtWz7sH0dcWOO3pVUvqBatrMRGmD3c8eZTjUSEH7KHDIu2DzFOXWpqr7xnSsTjzfPdebhM5PE6l8oI-_BW0gD9zXv_KHrnnUy-WftrJ1N--GJ_i4F-vJ6xsJbu73fD5_XX11z2BPBgNGPW2YkmE19mg5tcxFmbIF9J5hLCQx-pDHoL9uRg2v3D9j9CCB48IyD',
    technologies: ['Rust', 'Tauri', 'React', 'TypeScript', 'PostgreSQL', 'Redis'],
    githubUrl: 'https://github.com/ZuhaadRathore/ez-tauri',
  },
  {
    id: 2,
    title: 'Project Two',
    description: 'A fully functional e-commerce platform with a user-friendly interface.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkuQKlxgbvdvYr9Ag9hzbz0CftKXqNsxzzzJzGjDPpvGUY9cYtYWQoTBxrgmDyfThzkCOmljVkwLF82mboylBallQKDqmbDPTx61quNkUrY6Xapk8WOcUG7_U1Czwi-twKwIc2dTUSCsvkwJw3B_VrJ1g4xkci0zqPyNAu0D38jhFiClN_ECFo_Mvmicl0awpNugUb-U2hHugNKYlD9bBXtoOid2ELT0DfFSdPYdH5Rnsc1GPe2fyF5SYRalr4Kw22iQLhzVnbSciV',
    technologies: ['Next.js', 'MongoDB', 'Stripe'],
  },
  {
    id: 3,
    title: 'Project Three',
    description: 'A mobile-first social media dashboard with analytics.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVPQt-SeRFPjgIqJcOmerdZV6FUh9k_blC8cIO_99GIB7jsj4-pdZISn6Zf8bfNAyd1G9BNFDshLQBtWz7sH0dcWOO3pVUvqBatrMRGmD3c8eZTjUSEH7KHDIu2DzFOXWpqr7xnSsTjzfPdebhM5PE6l8oI-_BW0gD9zXv_KHrnnUy-WftrJ1N--GJ_i4F-vJ6xsJbu73fD5_XX11z2BPBgNGPW2YkmE19mg5tcxFmbIF9J5hLCQx-pDHoL9uRg2v3D9j9CCB48IyD',
    technologies: ['React Native', 'Firebase', 'Chart.js'],
  },
  {
    id: 4,
    title: 'Project Four',
    description: 'A collaborative workspace app with real-time features.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkuQKlxgbvdvYr9Ag9hzbz0CftKXqNsxzzzJzGjDPpvGUY9cYtYWQoTBxrgmDyfThzkCOmljVkwLF82mboylBallQKDqmbDPTx61quNkUrY6Xapk8WOcUG7_U1Czwi-twKwIc2dTUSCsvkwJw3B_VrJ1g4xkci0zqPyNAu0D38jhFiClN_ECFo_Mvmicl0awpNugUb-U2hHugNKYlD9bBXtoOid2ELT0DfFSdPYdH5Rnsc1GPe2fyF5SYRalr4Kw22iQLhzVnbSciV',
    technologies: ['Vue.js', 'Socket.io', 'PostgreSQL'],
  }
]

interface ProjectCardProps {
  project: Project
  onExpand: (project: Project) => void
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

function ProjectCard({ project, onExpand }: ProjectCardProps) {
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
        className="relative bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-3 rounded-none shadow-brutal-light dark:shadow-brutal-dark"
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
            className="object-cover transition-transform duration-500 group-hover/image:scale-110"
            priority
            loading="eager"
          />
          <Link href={`/projects/${project.id}`}>
            <motion.button
              className="absolute top-3 right-3 bg-surface-light dark:bg-surface-dark border-2 border-border-light dark:border-border-dark p-2 hover:bg-primary hover:text-black shadow-brutal-light dark:shadow-brutal-dark transition-colors duration-200"
              whileHover={{
                scale: 1.1,
                rotate: 5
              }}
              whileTap={{ scale: 0.95 }}
            >
              <Maximize2 className="h-4 w-4" />
            </motion.button>
          </Link>
        </div>

        <Link href={`/projects/${project.id}`}>
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 20 }}
            transition={{ duration: 0.6, delay: 0.3 }}
            className="block"
          >
            <h3 className="font-display text-xl uppercase text-primary mb-1 hover:text-yellow-300 transition-colors">
              {project.title}
            </h3>
            <p className="font-body text-sm text-text-light/70 dark:text-text-dark/70 mb-2">
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
  const [selectedProject, setSelectedProject] = useState<Project | null>(null)
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

  const handleExpandProject = (project: Project) => {
    setSelectedProject(project)
  }

  const handleCloseModal = () => {
    setSelectedProject(null)
  }

  const currentProject = projects[currentIndex]

  return (
    <section
      ref={ref}
      className="py-16"
    >
      <h2
        className="font-display text-5xl md:text-7xl uppercase tracking-tighter text-center mb-12 text-text-light dark:text-text-dark"
      >
        Featured Projects
      </h2>
      <div className="relative flex items-center justify-center gap-8 max-w-7xl mx-auto">
        <button
          onClick={prevProject}
          disabled={currentIndex === 0}
          className={`bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-4 shadow-brutal-light dark:shadow-brutal-dark transition-colors duration-200 ${
            currentIndex === 0
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-primary hover:text-black'
          }`}
        >
          <ChevronLeft className="h-8 w-8" />
        </button>

        <div className="flex-1 max-w-4xl">
          <ProjectCard
            key={currentProject.id}
            project={currentProject}
            onExpand={handleExpandProject}
          />
        </div>

        <button
          onClick={nextProject}
          disabled={currentIndex === projects.length - 1}
          className={`bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-4 shadow-brutal-light dark:shadow-brutal-dark transition-colors duration-200 ${
            currentIndex === projects.length - 1
              ? 'opacity-30 cursor-not-allowed'
              : 'hover:bg-primary hover:text-black'
          }`}
        >
          <ChevronRight className="h-8 w-8" />
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

      {/* Project Modal */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            className="fixed inset-0 bg-black/80 backdrop-blur-sm z-50 flex items-center justify-center p-4"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            transition={{ duration: 0.3 }}
            onClick={handleCloseModal}
          >
            <motion.div
              className="relative bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark max-w-4xl w-full max-h-[90vh] overflow-y-auto"
              initial={{ scale: 0.8, opacity: 0, y: 50 }}
              animate={{ scale: 1, opacity: 1, y: 0 }}
              exit={{ scale: 0.8, opacity: 0, y: 50 }}
              transition={{ duration: 0.4, ease: [0.25, 0.46, 0.45, 0.94] }}
              onClick={(e) => e.stopPropagation()}
            >
              <motion.button
                onClick={handleCloseModal}
                className="absolute top-4 right-4 bg-surface-light dark:bg-surface-dark border-2 border-border-light dark:border-border-dark p-2 hover:bg-primary hover:text-black transition-colors duration-200 shadow-brutal-light dark:shadow-brutal-dark z-10"
                whileHover={{ scale: 1.1, rotate: 90 }}
                whileTap={{ scale: 0.95 }}
                initial={{ opacity: 0, rotate: -90 }}
                animate={{ opacity: 1, rotate: 0 }}
                transition={{ duration: 0.5, delay: 0.2 }}
              >
                <X className="h-6 w-6" />
              </motion.button>

              <div className="p-6">
                <motion.div
                  className="w-full aspect-[2/1] bg-center bg-no-repeat bg-cover border-3 border-border-light dark:border-border-dark mb-6 overflow-hidden relative"
                  initial={{ opacity: 0, scale: 0.9 }}
                  animate={{ opacity: 1, scale: 1 }}
                  transition={{ duration: 0.6, delay: 0.1 }}
                >
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.title}
                    fill
                    sizes="(max-width: 768px) 100vw, 960px"
                    className="object-cover"
                    priority
                    loading="eager"
                  />
                </motion.div>

                <div className="space-y-4">
                  <motion.h2
                    className="font-display text-3xl md:text-4xl uppercase text-primary"
                    initial={{ opacity: 0, x: -30 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.6, delay: 0.2 }}
                  >
                    {selectedProject.title}
                  </motion.h2>

                  <motion.p
                    className="font-body text-lg text-text-light/80 dark:text-text-dark/80 leading-relaxed"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.3 }}
                  >
                    {selectedProject.description}
                  </motion.p>

                  {selectedProject.technologies && (
                    <motion.div
                      className="flex flex-wrap gap-3"
                      initial={{ opacity: 0 }}
                      animate={{ opacity: 1 }}
                      transition={{ duration: 0.6, delay: 0.4 }}
                    >
                      {selectedProject.technologies.map((tech, index) => (
                        <motion.span
                          key={tech}
                          className="px-3 py-2 text-sm font-bold uppercase bg-primary text-black border-2 border-border-light dark:border-border-dark"
                          initial={{ opacity: 0, scale: 0.8, y: 20 }}
                          animate={{ opacity: 1, scale: 1, y: 0 }}
                          transition={{ duration: 0.4, delay: 0.5 + index * 0.1 }}
                          whileHover={{ scale: 1.1, backgroundColor: "#fbbf24" }}
                        >
                          {tech}
                        </motion.span>
                      ))}
                    </motion.div>
                  )}

                  <motion.div
                    className="flex gap-4 pt-4"
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.6, delay: 0.6 }}
                  >
                    {selectedProject.liveUrl && (
                      <motion.a
                        href={selectedProject.liveUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-primary text-black px-4 py-3 font-bold uppercase border-3 border-border-light dark:border-border-dark hover:bg-yellow-300 transition-colors duration-200 shadow-brutal-light dark:shadow-brutal-dark"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <ExternalLink className="h-5 w-5" />
                        Live Demo
                      </motion.a>
                    )}

                    {selectedProject.githubUrl && (
                      <motion.a
                        href={selectedProject.githubUrl}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark px-4 py-3 font-bold uppercase border-3 border-border-light dark:border-border-dark hover:bg-primary hover:text-black transition-colors duration-200 shadow-brutal-light dark:shadow-brutal-dark"
                        whileHover={{ scale: 1.05, y: -2 }}
                        whileTap={{ scale: 0.95 }}
                      >
                        <Github className="h-5 w-5" />
                        View Code
                      </motion.a>
                    )}
                  </motion.div>
                </div>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  )
}