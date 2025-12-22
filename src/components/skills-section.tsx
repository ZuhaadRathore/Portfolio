'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'
import Magnetic from '@/components/ui/magnetic'

interface Skill {
  name: string
  icon: string
}

const programmingLanguages: Skill[] = [
  {
    name: 'Rust',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg'
  },
  {
    name: 'TypeScript',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/typescript/typescript-original.svg'
  },
  {
    name: 'Python',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/python/python-original.svg'
  },
  {
    name: 'Java',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/java/java-original.svg'
  },
  {
    name: 'C++',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/cplusplus/cplusplus-original.svg'
  }
]

const frameworks: Skill[] = [
  {
    name: 'React',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/react/react-original.svg'
  },
  {
    name: 'Vite',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vitejs/vitejs-original.svg'
  },
  {
    name: 'Tauri',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/tauri/tauri-original.svg'
  },
  {
    name: 'Node.js',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/nodejs/nodejs-original.svg'
  },
  {
    name: 'Axum',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/rust/rust-original.svg'
  },
  {
    name: 'Django',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/django/django-plain.svg'
  }
]

const tools: Skill[] = [
  {
    name: 'PostgreSQL',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/postgresql/postgresql-original.svg'
  },
  {
    name: 'Git',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/git/git-original.svg'
  },
  {
    name: 'Docker',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/docker/docker-original.svg'
  },
  {
    name: 'VS Code',
    icon: 'https://cdn.jsdelivr.net/gh/devicons/devicon@latest/icons/vscode/vscode-original.svg'
  }
]

interface SkillCardProps {
  title: string
  skills: Skill[]
  index: number
}

const cardVariants = {
  hidden: {
    opacity: 0,
    y: 50,
  },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94] as const,
      staggerChildren: 0.1
    }
  }
}

const skillItemVariants = {
  hidden: {
    opacity: 0,
    x: -20
  },
  visible: {
    opacity: 1,
    x: 0,
    transition: {
      duration: 0.5,
    }
  }
}

function SkillCard({ title, skills, index }: SkillCardProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 })

  return (
    <motion.div
      ref={ref as any}
      className="bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-6 sm:p-8 shadow-brutal-light dark:shadow-brutal-dark hover:translate-x-[-4px] hover:translate-y-[-4px] hover:shadow-[8px_8px_0px_#000000] dark:hover:shadow-[8px_8px_0px_#FFFFFF] transition-all duration-300"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{ delay: index * 0.2 }}
    >
      <motion.h3
        className="font-display text-2xl sm:text-3xl uppercase text-primary mb-6 sm:mb-8 text-center"
      >
        {title}
      </motion.h3>
      <div className="space-y-4">
        {skills.map((skill) => (
          <motion.div
            key={skill.name}
            className="flex items-center gap-4 group"
            variants={skillItemVariants}
          >
            <Magnetic>
                <div className="relative w-10 h-10 sm:w-12 sm:h-12 flex-shrink-0 bg-background-light dark:bg-background-dark border-2 border-border-light dark:border-border-dark flex items-center justify-center group-hover:bg-primary transition-colors duration-300">
                    <Image
                        src={skill.icon}
                        alt={skill.name}
                        width={24}
                        height={24}
                        className="object-contain w-6 h-6 sm:w-7 sm:h-7"
                    />
                </div>
            </Magnetic>
            <span className="font-body font-bold text-lg sm:text-xl text-text-light dark:text-text-dark group-hover:text-primary transition-colors duration-300">
              {skill.name}
            </span>
          </motion.div>
        ))}
      </div>
    </motion.div>
  )
}

export default function SkillsSection() {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.2 })

  return (
    <motion.section
      ref={ref}
      className="py-16 md:py-32"
    >
      <motion.h2
        className="font-display text-5xl sm:text-6xl md:text-8xl uppercase tracking-tighter text-center mb-16 md:mb-24 text-text-light dark:text-text-dark"
        initial={{ opacity: 0, y: 50 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: 50 }}
        transition={{ duration: 0.8 }}
      >
        Skills
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8 max-w-7xl mx-auto px-4">
        <SkillCard title="Languages" skills={programmingLanguages} index={0} />
        <SkillCard title="Frameworks" skills={frameworks} index={1} />
        <SkillCard title="Tools" skills={tools} index={2} />
      </div>
    </motion.section>
  )
}       