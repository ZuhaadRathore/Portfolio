'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'
import InlineSvgDiagram from './inline-svg-diagram'
import type { ClickableSection, InfrastructureDiagram } from '@/data/infrastructure-diagrams'

interface ClickableSvgDiagramProps {
  mainDiagram: InfrastructureDiagram
  clickableSections: ClickableSection[]
}

export default function ClickableSvgDiagram({ mainDiagram, clickableSections }: ClickableSvgDiagramProps) {
  const [expandedSection, setExpandedSection] = useState<ClickableSection | null>(null)
  const hasSections = clickableSections.length > 0

  return (
    <>
      <InlineSvgDiagram svg={mainDiagram.svg} title={mainDiagram.title} />

      {hasSections && (
        <div className="mt-4 sm:mt-6 border-3 border-dashed border-border-light dark:border-border-dark bg-surface-light dark:bg-surface-dark p-4 shadow-brutal-light dark:shadow-brutal-dark">
          <div className="flex flex-col gap-3">
            <p className="text-xs sm:text-sm font-mono uppercase text-text-light/70 dark:text-text-dark/70">
              Deep dives available — choose a focus area to open detailed flows.
            </p>
            <div className="flex flex-wrap gap-2">
              {clickableSections.map((section) => (
                <motion.button
                  key={section.id}
                  onClick={() => setExpandedSection(section)}
                  className="px-3 py-2 bg-primary text-black border-3 border-border-light dark:border-border-dark font-bold uppercase text-xs shadow-brutal-light dark:shadow-brutal-dark hover:bg-yellow-300 transition-colors"
                  whileHover={{ y: -2, scale: 1.02 }}
                  whileTap={{ scale: 0.97 }}
                >
                  {section.title}
                </motion.button>
              ))}
            </div>
          </div>
        </div>
      )}

      <AnimatePresence>
        {expandedSection && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setExpandedSection(null)}
          >
            <motion.div
              className="relative w-full max-w-6xl max-h-[90vh] bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark overflow-hidden"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              <div className="bg-primary text-black px-6 py-4 border-b-3 border-border-light dark:border-border-dark flex items-center justify-between">
                <h4 className="font-display text-xl md:text-2xl uppercase tracking-wider">
                  {expandedSection.title}
                </h4>
                <button
                  onClick={() => setExpandedSection(null)}
                  className="p-2 hover:bg-black/10 transition-colors border-2 border-black"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              <div className="overflow-y-auto max-h-[calc(90vh-80px)] p-6 space-y-6">
                {expandedSection.diagrams.map((diagram, index) => (
                  <motion.div
                    key={diagram.title + index}
                    initial={{ opacity: 0, y: 20 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ duration: 0.3, delay: index * 0.05 }}
                  >
                    <InlineSvgDiagram svg={diagram.svg} title={diagram.title} />
                  </motion.div>
                ))}
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
