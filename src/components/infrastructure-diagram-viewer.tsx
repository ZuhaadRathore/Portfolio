'use client'

import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { X, ChevronLeft, ChevronRight, Maximize2 } from 'lucide-react'
import MermaidDiagram from './mermaid-diagram'
import { InfrastructureDiagram } from '@/data/infrastructure-diagrams'

interface InfrastructureDiagramViewerProps {
  diagrams: InfrastructureDiagram[]
}

export default function InfrastructureDiagramViewer({ diagrams }: InfrastructureDiagramViewerProps) {
  const [isModalOpen, setIsModalOpen] = useState(false)
  const [currentIndex, setCurrentIndex] = useState(0)

  if (diagrams.length === 0) return null

  const openModal = () => {
    setIsModalOpen(true)
    setCurrentIndex(0)
  }

  const closeModal = () => {
    setIsModalOpen(false)
  }

  const goToNext = () => {
    if (currentIndex < diagrams.length - 1) {
      setCurrentIndex(currentIndex + 1)
    }
  }

  const goToPrev = () => {
    if (currentIndex > 0) {
      setCurrentIndex(currentIndex - 1)
    }
  }

  const goToIndex = (index: number) => {
    setCurrentIndex(index)
  }

  // Keyboard navigation
  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === 'ArrowRight') goToNext()
    if (e.key === 'ArrowLeft') goToPrev()
    if (e.key === 'Escape') closeModal()
  }

  return (
    <>
      {/* Preview - First Diagram */}
      <motion.div
        initial={{ opacity: 0, y: 30 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6 }}
        className="relative group cursor-pointer"
        onClick={openModal}
      >
        {/* Hover overlay */}
        <div className="absolute inset-0 bg-black/0 group-hover:bg-black/20 transition-all duration-300 z-10 flex items-center justify-center border-3 border-transparent group-hover:border-primary">
          <motion.div
            className="opacity-0 group-hover:opacity-100 bg-primary text-black px-6 py-3 font-display text-lg uppercase tracking-wider border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark flex items-center gap-2"
            initial={{ scale: 0.8, y: 10 }}
            whileHover={{ scale: 1 }}
          >
            <Maximize2 className="h-5 w-5" />
            View All {diagrams.length} Diagrams
          </motion.div>
        </div>

        {/* First diagram preview */}
        <MermaidDiagram chart={diagrams[0].chart} title={diagrams[0].title} />
      </motion.div>

      {/* Modal */}
      <AnimatePresence>
        {isModalOpen && (
          <motion.div
            className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/90"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={closeModal}
            onKeyDown={handleKeyDown}
            tabIndex={0}
          >
            {/* Modal Content */}
            <motion.div
              className="relative w-full max-w-7xl max-h-[90vh] bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark overflow-hidden"
              initial={{ scale: 0.9, y: 50 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 50 }}
              transition={{ duration: 0.3 }}
              onClick={(e) => e.stopPropagation()}
            >
              {/* Header */}
              <div className="bg-primary text-black px-6 py-4 border-b-3 border-border-light dark:border-border-dark flex items-center justify-between">
                <div>
                  <h4 className="font-display text-xl md:text-2xl uppercase tracking-wider">
                    Infrastructure Diagrams
                  </h4>
                  <p className="font-body text-sm mt-1">
                    {currentIndex + 1} / {diagrams.length}
                  </p>
                </div>
                <button
                  onClick={closeModal}
                  className="p-2 hover:bg-black/10 transition-colors border-2 border-black"
                  aria-label="Close modal"
                >
                  <X className="h-6 w-6" />
                </button>
              </div>

              {/* Diagram Content */}
              <div className="overflow-y-auto max-h-[calc(90vh-180px)] p-6">
                <AnimatePresence mode="wait">
                  <motion.div
                    key={currentIndex}
                    initial={{ opacity: 0, x: 20 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: -20 }}
                    transition={{ duration: 0.3 }}
                  >
                    <MermaidDiagram
                      chart={diagrams[currentIndex].chart}
                      title={diagrams[currentIndex].title}
                    />
                  </motion.div>
                </AnimatePresence>
              </div>

              {/* Navigation Footer */}
              <div className="bg-surface-light dark:bg-surface-dark border-t-3 border-border-light dark:border-border-dark px-6 py-4">
                <div className="flex items-center justify-between gap-4">
                  {/* Previous Button */}
                  <button
                    onClick={goToPrev}
                    disabled={currentIndex === 0}
                    className={`flex items-center gap-2 px-4 py-2 font-bold uppercase text-sm border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark transition-colors ${
                      currentIndex === 0
                        ? 'opacity-30 cursor-not-allowed bg-surface-light dark:bg-surface-dark'
                        : 'bg-primary text-black hover:bg-yellow-300'
                    }`}
                  >
                    <ChevronLeft className="h-4 w-4" />
                    Previous
                  </button>

                  {/* Diagram Indicators */}
                  <div className="flex items-center gap-2">
                    {diagrams.map((_, index) => (
                      <button
                        key={index}
                        onClick={() => goToIndex(index)}
                        className={`w-3 h-3 border-2 border-border-light dark:border-border-dark transition-colors ${
                          index === currentIndex
                            ? 'bg-primary'
                            : 'bg-surface-light dark:bg-surface-dark hover:bg-primary/50'
                        }`}
                        aria-label={`Go to diagram ${index + 1}`}
                      />
                    ))}
                  </div>

                  {/* Next Button */}
                  <button
                    onClick={goToNext}
                    disabled={currentIndex === diagrams.length - 1}
                    className={`flex items-center gap-2 px-4 py-2 font-bold uppercase text-sm border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark transition-colors ${
                      currentIndex === diagrams.length - 1
                        ? 'opacity-30 cursor-not-allowed bg-surface-light dark:bg-surface-dark'
                        : 'bg-primary text-black hover:bg-yellow-300'
                    }`}
                  >
                    Next
                    <ChevronRight className="h-4 w-4" />
                  </button>
                </div>

                {/* Current Diagram Title */}
                <p className="text-center mt-4 font-display text-sm uppercase tracking-wider text-text-light/60 dark:text-text-dark/60">
                  {diagrams[currentIndex].title}
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
}
