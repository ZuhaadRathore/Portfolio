'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown, ChevronUp } from 'lucide-react'
import MermaidDiagram from './mermaid-diagram'
import { ProjectInfrastructure } from '@/data/infrastructure-diagrams'

interface ExpandableInfrastructureDiagramProps {
  infrastructure: ProjectInfrastructure
}

export default function ExpandableInfrastructureDiagram({
  infrastructure,
}: ExpandableInfrastructureDiagramProps) {
  const [expandedSection, setExpandedSection] = useState<string | null>(null)

  const toggleSection = (sectionId: string) => {
    setExpandedSection(expandedSection === sectionId ? null : sectionId)
  }

  return (
    <div className="space-y-8">
      {/* Main Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
      >
        <MermaidDiagram
          chart={infrastructure.mainDiagram.chart}
          title={infrastructure.mainDiagram.title}
        />
      </motion.div>

      {/* Expandable Sections */}
      <motion.div
        className="space-y-4"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.2 }}
      >
        <p className="text-sm text-text-light/60 dark:text-text-dark/60 font-body text-center">
          Click below to explore detailed infrastructure diagrams
        </p>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
          {infrastructure.expandableSections.map((section, index) => (
            <motion.button
              key={section.id}
              onClick={() => toggleSection(section.id)}
              className={`relative p-4 border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark transition-all duration-300 ${
                expandedSection === section.id
                  ? 'bg-primary text-black'
                  : 'bg-surface-light dark:bg-surface-dark text-text-light dark:text-text-dark hover:bg-primary hover:text-black'
              }`}
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.4, delay: 0.3 + index * 0.1 }}
              whileHover={{ scale: 1.02, y: -2 }}
              whileTap={{ scale: 0.98 }}
            >
              <div className="flex items-center justify-between gap-2">
                <span className="font-display text-lg uppercase tracking-wider">
                  {section.buttonLabel}
                </span>
                {expandedSection === section.id ? (
                  <ChevronUp className="h-5 w-5" />
                ) : (
                  <ChevronDown className="h-5 w-5" />
                )}
              </div>
              {section.description && (
                <p className="text-xs mt-2 text-left opacity-70">
                  {section.description}
                </p>
              )}
            </motion.button>
          ))}
        </div>
      </motion.div>

      {/* Expanded Section Content */}
      <AnimatePresence>
        {expandedSection && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.4 }}
          >
            {infrastructure.expandableSections
              .filter((section) => section.id === expandedSection)
              .map((section) => (
                <div key={section.id} className="space-y-6">
                  {/* Section Header */}
                  <motion.div
                    className="bg-primary text-black px-6 py-4 border-3 border-border-light dark:border-border-dark"
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ duration: 0.4, delay: 0.1 }}
                  >
                    <h4 className="font-display text-2xl md:text-3xl uppercase tracking-wider">
                      {section.title}
                    </h4>
                    {section.description && (
                      <p className="text-sm mt-2 opacity-80">
                        {section.description}
                      </p>
                    )}
                  </motion.div>

                  {/* Section Diagrams */}
                  <div className="space-y-6">
                    {section.diagrams.map((diagram, diagramIndex) => (
                      <motion.div
                        key={diagramIndex}
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        transition={{
                          duration: 0.4,
                          delay: 0.2 + diagramIndex * 0.1,
                        }}
                      >
                        <MermaidDiagram
                          chart={diagram.chart}
                          title={diagram.title}
                        />
                      </motion.div>
                    ))}
                  </div>
                </div>
              ))}
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
