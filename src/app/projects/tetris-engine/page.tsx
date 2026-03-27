'use client'

import { useState } from 'react'
import { TransitionLink } from '@/components/page-transition'
import styles from './page.module.css'

interface InspectorData {
  type: string
  title: string
  desc: string
  code?: string
}

export default function TetrisEnginePage() {
  const [inspectorVisible, setInspectorVisible] = useState(false)
  const [inspectorData, setInspectorData] = useState<InspectorData>({
    type: 'COMPONENT',
    title: 'Select a Node',
    desc: 'Click on any system component or connection wire to inspect its architectural purpose.'
  })

  const showInspector = (type: string, title: string, desc: string, code?: string) => {
    setInspectorData({ type, title, desc, code })
    setInspectorVisible(true)
  }

  const closeInspector = () => {
    setInspectorVisible(false)
  }

  return (
    <div className="min-h-screen">
      <div style={{ filter: 'url(#pencil-roughen-soft)' }}>
        <nav className={styles.navBack}>
          <TransitionLink href="/" className={styles.backLink}>
            ← Back to Portfolio
          </TransitionLink>
        </nav>

        <header className={styles.projectHero}>
          <div className={styles.projectHeader}>
            <h1>TETRIS<br />ENGINE</h1>
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <h5>Role</h5>
                <p>Core Engineer</p>
              </div>
              <div className={styles.metaItem}>
                <h5>Date</h5>
                <p>2024</p>
              </div>
              <div className={styles.metaItem}>
                <h5>Stack</h5>
                <p>Rust, WGPU, React</p>
              </div>
              <div className={styles.metaItem}>
                <h5>Platform</h5>
                <p>Web & Desktop</p>
              </div>
            </div>
            <a href="#" className={styles.githubBtn}>View on Github</a>
          </div>
          <div className={styles.projectDesc}>
            <div className={styles.heroImageWrap}>
              <img
                src="/images/tetris.png"
                alt="Tetris Engine screenshot"
                className={styles.heroImage}
              />
            </div>
            <h3>OVERVIEW</h3>
            <p>
              A high-performance implementation of the classic Tetris game logic, architected to
              run natively on desktop and via WebAssembly in the browser.
            </p>
          </div>
        </header>

        <section className={styles.techDiagramSection}>
          <div className={styles.blueprintGrid}></div>

          <div className={styles.diagramHeader}>
            <h3>HOW IT WORKS</h3>
            <span>Click nodes and connection dots for further information</span>
          </div>

          <div className={styles.systemMap}>
            <svg className={styles.connectionsLayer}>
              <defs>
                <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                  <path d="M0,0 L0,6 L9,3 z" fill="#0A0A0A" />
                </marker>
              </defs>

              <path className={styles.wire} d="M 500 115 L 500 220" markerEnd="url(#arrow)" />
              <circle
                cx="500"
                cy="160"
                r="4"
                className={styles.dataDot}
                onClick={() =>
                  showInspector(
                    'DATA FLOW',
                    'Input Stream',
                    'Raw byte stream from HID devices normalized into a unified InputFrame struct.',
                    'struct InputFrame { x: i8, rotate: bool, drop: bool }'
                  )
                }
              />

              <path className={styles.wire} d="M 400 290 L 250 290" markerEnd="url(#arrow)" />
              <circle
                cx="325"
                cy="290"
                r="4"
                className={styles.dataDot}
                onClick={() =>
                  showInspector(
                    'DATA FLOW',
                    'State Mutation',
                    'Game tick logic applies gravity and collision checks, returning a dirty flag.',
                    'fn tick(&mut self) -> Result<GameState, Error>'
                  )
                }
              />

              <path className={styles.wire} d="M 600 290 L 750 290" markerEnd="url(#arrow)" />
              <circle
                cx="675"
                cy="290"
                r="4"
                className={styles.dataDot}
                onClick={() =>
                  showInspector(
                    'DATA FLOW',
                    'Geometry Calc',
                    'Computes screen-space coordinates for UI overlays and particle effects.',
                    'vec2<f32> normalized_coords'
                  )
                }
              />

              <path className={styles.wire} d="M 500 360 L 500 480" markerEnd="url(#arrow)" />
              <circle
                cx="500"
                cy="420"
                r="4"
                className={styles.dataDot}
                onClick={() =>
                  showInspector(
                    'DATA FLOW',
                    'Draw Call',
                    'WGPU Command Encoder submits vertex buffers to the GPU.',
                    'queue.submit(command_buffers)'
                  )
                }
              />
            </svg>

            <div
              className={styles.node}
              style={{ top: '20px', left: '400px' }}
              onClick={() =>
                showInspector(
                  'COMPONENT',
                  'INPUT DRIVER',
                  'Abstracts platform-specific input (Keyboard/Gamepad/Touch) into a unified event stream.'
                )
              }
            >
              <div className={styles.nodeIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="6" width="20" height="12" rx="2" />
                  <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
                </svg>
              </div>
              <div className={styles.nodeLabel}>INPUT DRIVER</div>
            </div>

            <div
              className={styles.node}
              style={{ top: '220px', left: '400px', width: '200px', height: '140px', borderWidth: '2px' }}
              onClick={() =>
                showInspector(
                  'COMPONENT',
                  'EVENT LOOP',
                  '60Hz Fixed-Timestep Loop. Orchestrates the flow between input, physics simulation, and rendering.'
                )
              }
            >
              <div className={styles.nodeIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M12 2v4M12 18v4M4.93 4.93l2.83 2.83M16.24 16.24l2.83 2.83M2 12h4M18 12h4M4.93 19.07l2.83-2.83M16.24 7.76l2.83-2.83" />
                  <circle cx="12" cy="12" r="3" />
                </svg>
              </div>
              <div className={styles.nodeLabel}>CORE LOOP</div>
            </div>

            <div
              className={styles.node}
              style={{ top: '230px', left: '50px' }}
              onClick={() =>
                showInspector(
                  'COMPONENT',
                  'STATE MACHINE',
                  'Immutable state container. Holds the grid matrix, score, and next piece queue.'
                )
              }
            >
              <div className={styles.nodeIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <path d="M21 16V8a2 2 0 0 0-1-1.73l-7-4a2 2 0 0 0-2 0l-7 4A2 2 0 0 0 3 8v8a2 2 0 0 0 1 1.73l7 4a2 2 0 0 0 2 0l7-4A2 2 0 0 0 21 16z" />
                  <polyline points="7.5 4.21 12 6.81 16.5 4.21" />
                  <polyline points="7.5 19.79 7.5 14.6 3 12" />
                  <polyline points="21 12 16.5 14.6 16.5 19.79" />
                  <polyline points="3.27 6.96 12 12.01 20.73 6.96" />
                  <line x1="12" y1="22.08" x2="12" y2="12" />
                </svg>
              </div>
              <div className={styles.nodeLabel}>STATE</div>
            </div>

            <div
              className={styles.node}
              style={{ top: '230px', right: '50px' }}
              onClick={() =>
                showInspector(
                  'COMPONENT',
                  'LAYOUT ENGINE',
                  'Flexbox-inspired layout calculator for positioning HUD elements dynamically.'
                )
              }
            >
              <div className={styles.nodeIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="3" y="3" width="18" height="18" rx="2" />
                  <path d="M3 9h18" />
                  <path d="M9 21V9" />
                </svg>
              </div>
              <div className={styles.nodeLabel}>LAYOUT</div>
            </div>

            <div
              className={styles.node}
              style={{ bottom: '40px', left: '400px' }}
              onClick={() =>
                showInspector(
                  'COMPONENT',
                  'WGPU RENDERER',
                  'Hardware accelerated rendering pipeline using WebGPU shaders.'
                )
              }
            >
              <div className={styles.nodeIcon}>
                <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                  <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                  <line x1="8" y1="21" x2="16" y2="21" />
                  <line x1="12" y1="17" x2="12" y2="21" />
                </svg>
              </div>
              <div className={styles.nodeLabel}>RENDERER</div>
            </div>
          </div>
        </section>
      </div>

      <div
        className={`${styles.inspectorPanel} ${inspectorVisible ? styles.visible : ''}`}
        style={{ filter: 'url(#pencil-roughen-soft)' }}
      >
        <div className={styles.inspectorHeader}>
          <span className={styles.inspectorLabel}>{inspectorData.type}</span>
          <span style={{ cursor: 'pointer' }} onClick={closeInspector}>
            ×
          </span>
        </div>
        <div className={styles.inspectorTitle}>{inspectorData.title}</div>
        <div className={styles.inspectorDesc}>{inspectorData.desc}</div>
        {inspectorData.code && (
          <div className={styles.inspectorData}>{inspectorData.code}</div>
        )}
      </div>
    </div>
  )
}
