'use client'

import Image from 'next/image'
import { motion } from 'framer-motion'
import { useScrollReveal } from '@/hooks/useScrollReveal'

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
    scale: 0.9
  },
  visible: {
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      duration: 0.6,
      ease: [0.25, 0.46, 0.45, 0.94]
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
      ease: "easeOut"
    }
  }
}

function SkillCard({ title, skills, index }: SkillCardProps) {
  const { ref, isVisible } = useScrollReveal({ threshold: 0.3 })

  return (
    <motion.div
      ref={ref as any}
      className="bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-6 shadow-brutal-light dark:shadow-brutal-dark"
      variants={cardVariants}
      initial="hidden"
      animate={isVisible ? "visible" : "hidden"}
      transition={{ delay: index * 0.2 }}
      whileHover={{
        y: -8,
        scale: 1.02,
        transition: { duration: 0.3 }
      }}
    >
      <motion.h3
        className="font-display text-3xl uppercase text-primary mb-6 text-center"
        initial={{ opacity: 0, y: -20 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -20 }}
        transition={{ duration: 0.6, delay: index * 0.2 + 0.3 }}
      >
        {title}
      </motion.h3>
      <div className="space-y-4">
        {skills.map((skill, skillIndex) => (
          <motion.div
            key={skill.name}
            className="flex items-center gap-4 skill-item"
            variants={skillItemVariants}
            initial="hidden"
            animate={isVisible ? "visible" : "hidden"}
            transition={{ delay: index * 0.2 + skillIndex * 0.1 + 0.5 }}
            whileHover={{
              x: 8,
              scale: 1.05,
              transition: { duration: 0.2 }
            }}
          >
            <motion.div
              className="relative w-10 h-10"
              whileHover={{
                scale: 1.1
              }}
              transition={{ duration: 0.2 }}
            >
              <Image
                src={skill.icon}
                alt={skill.name}
                fill
                sizes="40px"
                className="skill-icon object-contain"
              />
            </motion.div>
            <span className="font-body font-bold text-lg text-text-light dark:text-text-dark">
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
      className="py-16"
      initial={{ opacity: 0 }}
      animate={isVisible ? { opacity: 1 } : { opacity: 0 }}
      transition={{ duration: 0.8 }}
    >
      <motion.h2
        className="font-display text-5xl md:text-7xl uppercase tracking-tighter text-center mb-12 text-text-light dark:text-text-dark"
        initial={{ opacity: 0, y: -30 }}
        animate={isVisible ? { opacity: 1, y: 0 } : { opacity: 0, y: -30 }}
        transition={{ duration: 0.8, delay: 0.2 }}
      >
        Skills
      </motion.h2>
      <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
        <SkillCard title="Programming Languages" skills={programmingLanguages} index={0} />
        <SkillCard title="Frameworks" skills={frameworks} index={1} />
        <SkillCard title="Tools" skills={tools} index={2} />
      </div>
    </motion.section>
  )
}