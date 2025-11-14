'use client'

import { useEffect, useRef, useState } from 'react'
import mermaid from 'mermaid'
import { motion } from 'framer-motion'

interface MermaidDiagramProps {
  chart: string
  title?: string
}

export default function MermaidDiagram({ chart, title }: MermaidDiagramProps) {
  const containerRef = useRef<HTMLDivElement>(null)
  const [svg, setSvg] = useState<string>('')
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    const renderDiagram = async () => {
      if (!containerRef.current) return

      try {
        // Initialize mermaid with theme configuration
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
            actorBorder: '#000',
            actorBkg: '#1E1E1E',
            actorTextColor: '#F3F3F3',
            actorLineColor: '#FDC435',
            signalColor: '#F3F3F3',
            signalTextColor: '#F3F3F3',
            labelBoxBkgColor: '#1E1E1E',
            labelBoxBorderColor: '#000',
            labelTextColor: '#F3F3F3',
            loopTextColor: '#F3F3F3',
            noteBorderColor: '#FDC435',
            noteBkgColor: '#2A2A2A',
            noteTextColor: '#F3F3F3',
            activationBorderColor: '#000',
            activationBkgColor: '#1E1E1E',
            sequenceNumberColor: '#000',
          },
          flowchart: {
            useMaxWidth: true,
            htmlLabels: true,
            curve: 'basis',
          },
          securityLevel: 'loose',
        })

        // Generate unique ID for this diagram
        const id = `mermaid-${Math.random().toString(36).substr(2, 9)}`

        // Render the diagram
        const { svg: renderedSvg } = await mermaid.render(id, chart)
        setSvg(renderedSvg)
        setError(null)
      } catch (err) {
        console.error('Mermaid rendering error:', err)
        setError('Failed to render diagram')
      }
    }

    renderDiagram()
  }, [chart])

  if (error) {
    return (
      <div className="bg-surface-light dark:bg-surface-dark border-3 border-border-light dark:border-border-dark p-6 shadow-brutal-light dark:shadow-brutal-dark">
        <p className="text-red-500 font-mono text-sm">{error}</p>
      </div>
    )
  }

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
      <div
        ref={containerRef}
        className="p-6 overflow-x-auto"
        dangerouslySetInnerHTML={{ __html: svg }}
      />
    </motion.div>
  )
}
