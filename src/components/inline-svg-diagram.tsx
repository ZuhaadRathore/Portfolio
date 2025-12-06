'use client'

import { motion } from 'framer-motion'

interface InlineSvgDiagramProps {
  svg: string
  title?: string
}

export default function InlineSvgDiagram({ svg, title }: InlineSvgDiagramProps) {
  return (
    <motion.div
      className="bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark overflow-hidden"
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {title && (
        <div className="bg-primary text-black px-6 py-3 border-b-3 border-border-light dark:border-border-dark">
          <h4 className="font-display text-lg md:text-xl uppercase tracking-wider">
            {title}
          </h4>
        </div>
      )}
      <div className="p-4 sm:p-6 overflow-x-auto">
        <div
          className="min-w-[320px]"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
      </div>
    </motion.div>
  )
}
