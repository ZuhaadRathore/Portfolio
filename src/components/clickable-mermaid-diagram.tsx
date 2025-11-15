'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { motion, AnimatePresence } from 'framer-motion'
import { X } from 'lucide-react'

interface MermaidDiagram {
  title: string
  chart: string
}

interface ClickableSection {
  id: string
  title: string
  diagrams: MermaidDiagram[]
}

interface ClickableMermaidDiagramProps {
  mainChart: string
  title?: string
  clickableSections: ClickableSection[]
}

export default function ClickableMermaidDiagram({
  mainChart,
  title,
  clickableSections,
}: ClickableMermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)
  const [expandedSection, setExpandedSection] = useState<string | null>(null)
  const diagramIdRef = useRef<string>('')

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return

      try {
        // Initialize mermaid
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#FDC435',
            primaryTextColor: '#000',
            primaryBorderColor: '#000',
            lineColor: '#FDC435',
            secondaryColor: '#1E1E1E',
            tertiaryColor: '#2A2A2A',
            background: '#121212',
            mainBkg: '#1E1E1E',
            secondBkg: '#2A2A2A',
            border1: '#000',
            border2: '#FDC435',
            arrowheadColor: '#FDC435',
            fontFamily: '"Roboto Mono", monospace',
            fontSize: '14px',
            textColor: '#F3F3F3',
            nodeBorder: '#000',
            clusterBkg: '#2A2A2A',
            clusterBorder: '#FDC435',
            defaultLinkColor: '#FDC435',
            titleColor: '#FDC435',
            edgeLabelBackground: '#1E1E1E',
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
          securityLevel: 'loose',
        })

        // Generate unique ID
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`
        diagramIdRef.current = id

        // Render diagram
        const { svg: renderedSvg } = await mermaid.render(id, mainChart)
        setSvg(renderedSvg)
        setError(null)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError('Failed to render diagram')
      }
    }

    renderDiagram()
  }, [mainChart])

  // Add click handlers after SVG is rendered
  useEffect(() => {
    if (!svg || !containerRef.current) return

    const handleNodeClick = (sectionId: string) => {
      setExpandedSection((current) => (current === sectionId ? null : sectionId))
    }

    const listeners: Array<{ element: Element; handler: EventListener }> = []

    clickableSections.forEach((section) => {
      // Try multiple selectors to find the node
      const selectors = [
        `#${diagramIdRef.current} .node[id$="${section.id}"]`,
        `#${diagramIdRef.current} [id*="flowchart-${section.id}"]`,
        `#${diagramIdRef.current} g[id*="${section.id}"]`,
      ]

      for (const selector of selectors) {
        const nodeElement = containerRef.current?.querySelector(selector)
        if (nodeElement) {
          const handler = (e: Event) => {
            e.stopPropagation()
            handleNodeClick(section.id)
          }

          nodeElement.addEventListener('click', handler)
          ;(nodeElement as HTMLElement).style.cursor = 'pointer'
          listeners.push({ element: nodeElement, handler })
          break // Found the element, no need to try other selectors
        }
      }
    })

    // Cleanup function
    return () => {
      listeners.forEach(({ element, handler }) => {
        element.removeEventListener('click', handler)
      })
    }
  }, [svg, clickableSections])

  if (error) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-6 shadow-brutal-light dark:shadow-brutal-dark">
        <p className="text-red-500 font-mono text-sm">{error}</p>
      </div>
    )
  }

  const currentSection = clickableSections.find((s) => s.id === expandedSection)

  return (
    <div className="space-y-6">
      {/* Main Diagram */}
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
        <div
          ref={containerRef}
          className="p-6 overflow-x-auto cursor-pointer"
          dangerouslySetInnerHTML={{ __html: svg }}
        />
        <div className="px-6 pb-4 text-center">
          <p className="text-xs text-text-light/60 dark:text-text-dark/60 font-body">
            💡 Click on the colored boxes in the diagram to explore detailed architecture
          </p>
        </div>
      </motion.div>

      {/* Expanded Section */}
      <AnimatePresence>
        {currentSection && (
          <motion.div
            initial={{ opacity: 0, height: 0, overflow: 'hidden' }}
            animate={{ opacity: 1, height: 'auto', overflow: 'visible' }}
            exit={{ opacity: 0, height: 0, overflow: 'hidden' }}
            transition={{ duration: 0.4 }}
            className="space-y-6"
          >
            {/* Section Header */}
            <motion.div
              className="bg-primary text-black px-6 py-4 border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark flex items-center justify-between"
              initial={{ opacity: 0, x: -20 }}
              animate={{ opacity: 1, x: 0 }}
              transition={{ duration: 0.4, delay: 0.1 }}
            >
              <h4 className="font-display text-2xl md:text-3xl uppercase tracking-wider">
                {currentSection.title}
              </h4>
              <button
                onClick={() => setExpandedSection(null)}
                className="p-2 hover:bg-black/10 transition-colors border-2 border-black"
                aria-label="Close section"
              >
                <X className="h-5 w-5" />
              </button>
            </motion.div>

            {/* Section Diagrams */}
            <div className="space-y-6">
              {currentSection.diagrams.map((diagram, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.4, delay: 0.2 + index * 0.1 }}
                  className="bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark shadow-brutal-light dark:shadow-brutal-dark overflow-hidden"
                >
                  <div className="bg-primary text-black px-6 py-3 border-b-3 border-border-light dark:border-border-dark">
                    <h5 className="font-display text-lg uppercase tracking-wider">
                      {diagram.title}
                    </h5>
                  </div>
                  <DiagramRenderer chart={diagram.chart} />
                </motion.div>
              ))}
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}

// Separate component to render individual diagrams
function DiagramRenderer({ chart }: { chart: string }) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return

      try {
        mermaid.initialize({
          startOnLoad: false,
          theme: 'dark',
          themeVariables: {
            primaryColor: '#FDC435',
            primaryTextColor: '#000',
            primaryBorderColor: '#000',
            lineColor: '#FDC435',
            secondaryColor: '#1E1E1E',
            tertiaryColor: '#2A2A2A',
            background: '#121212',
            mainBkg: '#1E1E1E',
            secondBkg: '#2A2A2A',
            border1: '#000',
            border2: '#FDC435',
            arrowheadColor: '#FDC435',
            fontFamily: '"Roboto Mono", monospace',
            fontSize: '14px',
            textColor: '#F3F3F3',
            nodeBorder: '#000',
            clusterBkg: '#2A2A2A',
            clusterBorder: '#FDC435',
            defaultLinkColor: '#FDC435',
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
          securityLevel: 'loose',
        })

        const id = `mermaid-detail-${Math.random().toString(36).substr(2, 9)}`
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        setSvg(renderedSvg)
      } catch (err) {
        console.error('Detail diagram error:', err)
      }
    }

    renderDiagram()
  }, [chart])

  return (
    <div
      ref={containerRef}
      className="p-6 overflow-x-auto"
      dangerouslySetInnerHTML={{ __html: svg }}
    />
  )
}
