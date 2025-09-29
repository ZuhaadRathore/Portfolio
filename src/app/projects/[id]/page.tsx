'use client'

import { useParams, useRouter } from 'next/navigation'
import Image from 'next/image'
import { ArrowLeft, ExternalLink, Github, Calendar, User, Building } from 'lucide-react'
import { motion } from 'framer-motion'

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
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVPQt-SeRFPjgIqJcOmerdZV6FUh9k_blC8cIO_99GIB7jsj4-pdZISn6Zf8bfNAyd1G9BNFDshLQBtWz7sH0dcWOO3pVUvqBatrMRGmD3c8eZTjUSEH7KHDIu2DzFOXWpqr7xnSsTjzfPdebhM5PE6l8oI-_BW0gD9zXv_KHrnnUy-WftrJ1N--GJ_i4F-vJ6xsJbu73fD5_XX11z2BPBgNGPW2YkmE19mg5tcxFmbIF9J5hLCQx-pDHoL9uRg2v3D9j9CCB48IyD',
    technologies: ['Rust', 'Tauri', 'React', 'TypeScript', 'PostgreSQL', 'Redis', 'Vite', 'TailwindCSS', 'Zustand', 'Node.js'],
    date: '2024',
    role: 'Open Source Author',
    client: 'Open Source Community',
    overview: 'A production-ready Tauri boilerplate with full-stack capabilities and enterprise features.',
    githubUrl: 'https://github.com/ZuhaadRathore/ez-tauri'
  },
  {
    id: 2,
    title: 'Social Media Dashboard',
    description: 'A fully functional e-commerce platform with a user-friendly interface.',
    detailedDescription: 'A comprehensive social media management dashboard that allows users to manage multiple social platforms from a single interface. Features include post scheduling, analytics tracking, engagement monitoring, and team collaboration tools.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkuQKlxgbvdvYr9Ag9hzbz0CftKXqNsxzzzJzGjDPpvGUY9cYtYWQoTBxrgmDyfThzkCOmljVkwLF82mboylBallQKDqmbDPTx61quNkUrY6Xapk8WOcUG7_U1Czwi-twKwIc2dTUSCsvkwJw3B_VrJ1g4xkci0zqPyNAu0D38jhFiClN_ECFo_Mvmicl0awpNugUb-U2hHugNKYlD9bBXtoOid2ELT0DfFSdPYdH5Rnsc1GPe2fyF5SYRalr4Kw22iQLhzVnbSciV',
    technologies: ['Next.js', 'MongoDB', 'Stripe', 'Chart.js', 'Socket.io'],
    date: '2024',
    role: 'Frontend Lead',
    client: 'Social Media Agency',
    overview: 'A comprehensive social media management platform.',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example/project'
  },
  {
    id: 3,
    title: 'Mobile Analytics App',
    description: 'A mobile-first social media dashboard with analytics.',
    detailedDescription: 'A mobile-first analytics application designed to provide comprehensive insights into user behavior and app performance. The app features real-time data visualization, custom dashboard creation, and automated reporting capabilities.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuBVPQt-SeRFPjgIqJcOmerdZV6FUh9k_blC8cIO_99GIB7jsj4-pdZISn6Zf8bfNAyd1G9BNFDshLQBtWz7sH0dcWOO3pVUvqBatrMRGmD3c8eZTjUSEH7KHDIu2DzFOXWpqr7xnSsTjzfPdebhM5PE6l8oI-_BW0gD9zXv_KHrnnUy-WftrJ1N--GJ_i4F-vJ6xsJbu73fD5_XX11z2BPBgNGPW2YkmE19mg5tcxFmbIF9J5hLCQx-pDHoL9uRg2v3D9j9CCB48IyD',
    technologies: ['React Native', 'Firebase', 'Chart.js', 'Redux'],
    date: '2023',
    role: 'Mobile Developer',
    client: 'Tech Startup',
    overview: 'Real-time analytics for mobile applications.',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example/project'
  },
  {
    id: 4,
    title: 'Collaborative Workspace',
    description: 'A collaborative workspace app with real-time features.',
    detailedDescription: 'A comprehensive collaborative workspace application that enables teams to work together seamlessly. Features include real-time document editing, video conferencing, task management, and file sharing capabilities.',
    image: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDkuQKlxgbvdvYr9Ag9hzbz0CftKXqNsxzzzJzGjDPpvGUY9cYtYWQoTBxrgmDyfThzkCOmljVkwLF82mboylBallQKDqmbDPTx61quNkUrY6Xapk8WOcUG7_U1Czwi-twKwIc2dTUSCsvkwJw3B_VrJ1g4xkci0zqPyNAu0D38jhFiClN_ECFo_Mvmicl0awpNugUb-U2hHugNKYlD9bBXtoOid2ELT0DfFSdPYdH5Rnsc1GPe2fyF5SYRalr4Kw22iQLhzVnbSciV',
    technologies: ['Vue.js', 'Socket.io', 'PostgreSQL', 'WebRTC'],
    date: '2024',
    role: 'Full-Stack Developer',
    client: 'Remote Team Solutions',
    overview: 'Real-time collaboration platform for distributed teams.',
    liveUrl: 'https://example.com',
    githubUrl: 'https://github.com/example/project'
  }
]

export default function ProjectDetailsPage() {
  const params = useParams()
  const router = useRouter()
  const projectId = parseInt(params.id as string)

  const project = projects.find(p => p.id === projectId)

  if (!project) {
    return (
      <div className="min-h-screen bg-background-light dark:bg-background-dark flex items-center justify-center">
        <div className="text-center">
          <h1 className="font-display text-4xl uppercase text-text-light dark:text-text-dark mb-4">
            Project Not Found
          </h1>
          <button
            onClick={() => router.push('/')}
            className="bg-primary text-black px-6 py-3 font-bold uppercase border-3 border-border-light dark:border-border-dark hover:bg-yellow-300 transition-colors duration-200 shadow-brutal-light dark:shadow-brutal-dark"
          >
            Back to Home
          </button>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen bg-background-light dark:bg-background-dark font-body text-text-light dark:text-text-dark">
      <main className="container mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <div className="max-w-4xl mx-auto">
          {/* Hero Image with Glitch Border Effect */}
          <motion.div
            className="relative mb-12"
            initial={{ opacity: 0, scale: 0.9 }}
            animate={{ opacity: 1, scale: 1 }}
            transition={{ duration: 0.6 }}
          >
            <div className="absolute -inset-2 bg-gradient-to-r from-primary to-yellow-300 rounded-lg blur opacity-20" />
            <div className="relative aspect-video bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark overflow-hidden">
              <Image
                src={project.image}
                alt={project.title}
                fill
                sizes="(max-width: 768px) 100vw, 896px"
                className="object-cover"
                priority
              />
              <div className="absolute inset-0 bg-black/30 flex items-center justify-center">
                <button className="w-20 h-20 bg-black/50 backdrop-blur-sm flex items-center justify-center text-white border-3 border-white hover:bg-primary/50 transition-colors">
                  <svg fill="currentColor" height="36px" viewBox="0 0 256 256" width="36px" xmlns="http://www.w3.org/2000/svg">
                    <path d="M240,128a15.74,15.74,0,0,1-7.6,13.51L88.32,229.65a16,16,0,0,1-16.2.3A15.86,15.86,0,0,1,64,216.13V39.87a15.86,15.86,0,0,1,8.12-13.82,16,16,0,0,1,16.2.3L232.4,114.49A15.74,15.74,0,0,1,240,128Z"></path>
                  </svg>
                </button>
              </div>
            </div>
          </motion.div>

          {/* Project Content */}
          <motion.div
            className="bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-8 shadow-brutal-light dark:shadow-brutal-dark"
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            <motion.h1
              className="font-display text-4xl md:text-6xl uppercase tracking-widest text-primary mb-2"
              initial={{ opacity: 0, x: -30 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.6, delay: 0.3 }}
            >
              {project.title}
            </motion.h1>

            <motion.p
              className="text-base text-text-light/60 dark:text-text-dark/60 mb-8 font-body"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.4 }}
            >
              {project.overview}
            </motion.p>

            {/* Project Meta Information */}
            <motion.div
              className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.5 }}
            >
              {project.date && (
                <div className="border-t-3 border-border-light dark:border-border-dark pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Calendar className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-light/60 dark:text-text-dark/60">
                      Date
                    </h3>
                  </div>
                  <p className="text-lg font-display text-text-light dark:text-text-dark">
                    {project.date}
                  </p>
                </div>
              )}

              {project.role && (
                <div className="border-t-3 border-border-light dark:border-border-dark pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <User className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-light/60 dark:text-text-dark/60">
                      Role
                    </h3>
                  </div>
                  <p className="text-lg font-display text-text-light dark:text-text-dark">
                    {project.role}
                  </p>
                </div>
              )}

              {project.client && (
                <div className="border-t-3 border-border-light dark:border-border-dark pt-4">
                  <div className="flex items-center gap-2 mb-2">
                    <Building className="h-4 w-4 text-primary" />
                    <h3 className="text-sm font-bold uppercase tracking-wider text-text-light/60 dark:text-text-dark/60">
                      Client
                    </h3>
                  </div>
                  <p className="text-lg font-display text-text-light dark:text-text-dark">
                    {project.client}
                  </p>
                </div>
              )}
            </motion.div>

            {/* Project Overview */}
            <motion.div
              className="space-y-10"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ duration: 0.6, delay: 0.6 }}
            >
              <div>
                <h3 className="font-display text-2xl md:text-3xl uppercase tracking-widest text-primary mb-4">
                  Project Overview
                </h3>
                <p className="font-body text-base text-text-light/80 dark:text-text-dark/80 leading-relaxed">
                  {project.detailedDescription || project.description}
                </p>
              </div>

              {/* Technologies */}
              {project.technologies && (
                <div>
                  <h3 className="font-display text-2xl md:text-3xl uppercase tracking-widest text-primary mb-4">
                    Technologies Used
                  </h3>
                  <div className="flex flex-wrap gap-3">
                    {project.technologies.map((tech, index) => (
                      <motion.span
                        key={tech}
                        className="px-3 py-2 text-sm font-bold uppercase bg-primary text-black border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark"
                        initial={{ opacity: 0, scale: 0.8, y: 20 }}
                        animate={{ opacity: 1, scale: 1, y: 0 }}
                        transition={{ duration: 0.4, delay: 0.7 + index * 0.1 }}
                        whileHover={{
                          scale: 1.1,
                          backgroundColor: "#fbbf24",
                          y: -2
                        }}
                      >
                        {tech}
                      </motion.span>
                    ))}
                  </div>
                </div>
              )}
            </motion.div>

            {/* Action Buttons */}
            <motion.div
              className="flex flex-col sm:flex-row gap-4 mt-12"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.8 }}
            >
              {project.liveUrl && (
                <motion.a
                  href={project.liveUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-primary text-black font-bold py-3 px-6 text-center uppercase tracking-wider border-3 border-border-light dark:border-border-dark hover:bg-yellow-300 transition-all duration-300 shadow-brutal-light dark:shadow-brutal-dark"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <ExternalLink className="h-5 w-5" />
                  Live Demo
                </motion.a>
              )}

              {project.githubUrl && (
                <motion.a
                  href={project.githubUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex-1 flex items-center justify-center gap-2 bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark font-bold py-3 px-6 text-center uppercase tracking-wider border-3 border-border-light dark:border-border-dark hover:bg-primary hover:text-black transition-all duration-300 shadow-brutal-light dark:shadow-brutal-dark"
                  whileHover={{ scale: 1.02, y: -2 }}
                  whileTap={{ scale: 0.98 }}
                >
                  <Github className="h-5 w-5" />
                  GitHub Repo
                </motion.a>
              )}
            </motion.div>
          </motion.div>

          {/* Back to Projects Link */}
          <motion.div
            className="mt-16 text-center"
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, delay: 0.9 }}
          >
            <motion.button
              onClick={() => router.push('/#projects')}
              className="inline-flex items-center gap-2 text-text-light/60 dark:text-text-dark/60 hover:text-primary underline underline-offset-4 decoration-text-light/30 dark:decoration-text-dark/30 hover:decoration-primary transition-all font-body"
              whileHover={{ x: -5 }}
            >
              <ArrowLeft className="h-4 w-4" />
              Back to Projects
            </motion.button>
          </motion.div>
        </div>
      </main>
    </div>
  )
}