'use client'

import { useCallback, useRef, useState } from 'react'
import { TransitionLink } from '@/components/page-transition'
import styles from './page.module.css'

interface InspectorData {
  type: string
  title: string
  desc: string
  code?: string
}

type ViewId = 'main' | 'theme-engine'

interface SubGraphNode {
  id: string
  label: string
  icon: React.ReactNode
  top: number
  left: number
  width?: number
  inspectorType: string
  inspectorTitle: string
  desc: string
  code?: string
}

interface SubGraphConnection {
  path: string
  dotPos: [number, number]
  label: string
  desc: string
  code?: string
}

interface SubGraph {
  id: ViewId
  title: string
  subtitle: string
  nodes: SubGraphNode[]
  connections: SubGraphConnection[]
}

// ── Sub-graph definitions ──

const THEME_ENGINE_SUBGRAPH: SubGraph = {
  id: 'theme-engine',
  title: 'THEME ENGINE INTERNALS',
  subtitle: 'Click nodes to inspect',
  nodes: [
    {
      id: 'ath-file',
      label: '.ATH FILE',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M14 2H6a2 2 0 00-2 2v16a2 2 0 002 2h12a2 2 0 002-2V8z" />
          <polyline points="14,2 14,8 20,8" />
        </svg>
      ),
      top: 20, left: 400, width: 200,
      inspectorType: 'INPUT',
      inspectorTitle: '.ath Theme File',
      desc: 'Human-authored theme definition using Anton\'s custom DSL syntax. Defines palettes, token aliases, widget-level style rules, and state-based variant overrides.',
      code: '@palette {\n  primary: #D00000;\n  surface: #1A1A2E;\n}\n\nbutton {\n  bg: surface;\n  fg: primary;\n}\n\nbutton:focused {\n  bg: primary;\n  fg: surface;\n}',
    },
    {
      id: 'parser',
      label: 'PEST PARSER',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
        </svg>
      ),
      top: 160, left: 400, width: 200,
      inspectorType: 'COMPONENT',
      inspectorTitle: 'PEG Parser',
      desc: 'Pest PEG grammar parses .ath source text into a typed token stream. Handles @palette blocks, widget selectors, state pseudo-classes (:focused, :hovered, :active, :disabled), class selectors (.primary), and nested property declarations.',
      code: 'theme_file = { SOI ~ (palette_block | rule_block)* ~ EOI }\nrule_block  = { selector ~ "{" ~ declaration* ~ "}" }\nselector    = { widget_kind ~ pseudo_class? ~ class_sel? }',
    },
    {
      id: 'ast',
      label: 'AST',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="5" r="3" />
          <circle cx="5" cy="19" r="3" />
          <circle cx="19" cy="19" r="3" />
          <path d="M12 8v3M8.5 16.5L10.5 13M15.5 16.5L13.5 13" />
        </svg>
      ),
      top: 160, left: 120, width: 180,
      inspectorType: 'DATA',
      inspectorTitle: 'Theme AST',
      desc: 'Structured representation of parsed theme. Contains: Palette (color name → hex/rgb), RuleSet (widget kind → declarations grouped by state), and Alias table for cross-referencing token names.',
      code: 'struct ThemeAst {\n  palette: HashMap<String, Color>,\n  rules: Vec<Rule>,\n  aliases: HashMap<String, String>,\n}',
    },
    {
      id: 'resolver',
      label: 'RESOLVER',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M9 3H5a2 2 0 00-2 2v4m6-6h10a2 2 0 012 2v4M9 3v18m0 0h10a2 2 0 002-2v-4M9 21H5a2 2 0 01-2-2v-4" />
        </svg>
      ),
      top: 310, left: 250, width: 200,
      inspectorType: 'COMPONENT',
      inspectorTitle: 'Style Resolver',
      desc: 'Walks the AST to resolve a concrete style for a given (widget_kind, classes, states) query. Resolves token aliases with cycle detection (DFS visited set). Applies cascade: base → class → state overrides.',
      code: 'fn resolve(\n  ast: &ThemeAst,\n  kind: &str,\n  classes: &[&str],\n  states: &[State],\n) -> ResolvedStyle',
    },
    {
      id: 'variants',
      label: 'VARIANT ENGINE',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <rect x="3" y="3" width="18" height="18" rx="2" />
          <path d="M3 12h18M12 3v18" />
        </svg>
      ),
      top: 310, left: 550, width: 200,
      inspectorType: 'COMPONENT',
      inspectorTitle: 'Variant Engine',
      desc: 'Manages state-based style overrides. When a widget reports its interactive state (focused, hovered, active, disabled), the variant engine selects the correct override layer and merges it on top of the base resolved style.',
      code: '// State priority (highest wins):\n// disabled > active > focused > hovered > base\nfn apply_variants(\n  base: ResolvedStyle,\n  states: &[State],\n) -> ResolvedStyle',
    },
    {
      id: 'presets',
      label: 'PRESETS',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <circle cx="12" cy="12" r="5" />
          <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2" />
        </svg>
      ),
      top: 160, left: 700, width: 180,
      inspectorType: 'DATA',
      inspectorTitle: 'Built-in Presets',
      desc: 'Three shipped theme presets compiled into the binary: dark (default), light, and green. Each is a complete .ath file parsed at compile time via include_str!, providing zero-cost default theming.',
      code: '// Usage:\nlet theme = Theme::dark(); // built-in\nlet theme = Theme::from_file("my.ath")?;',
    },
    {
      id: 'resolved',
      label: 'RESOLVED STYLE',
      icon: (
        <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
          <path d="M20 6L9 17l-5-5" />
        </svg>
      ),
      top: 460, left: 370, width: 260,
      inspectorType: 'OUTPUT',
      inspectorTitle: 'ResolvedStyle',
      desc: 'Final computed style output consumed by widgets. Contains concrete fg/bg Color values, border style, text attributes (bold, italic, underline). Fully resolved — no aliases, no cascading left to do.',
      code: 'struct ResolvedStyle {\n  fg: Color,\n  bg: Color,\n  bold: bool,\n  italic: bool,\n  underline: bool,\n  border: BorderStyle,\n}',
    },
  ],
  connections: [
    {
      path: 'M 500 100 L 500 160',
      dotPos: [500, 130],
      label: 'Source Text',
      desc: 'Raw .ath file content is fed into the Pest parser as a string.',
    },
    {
      path: 'M 400 230 L 250 160',
      dotPos: [325, 195],
      label: 'Token Stream',
      desc: 'Parser outputs a typed token stream which is transformed into the Theme AST.',
    },
    {
      path: 'M 550 230 L 750 160',
      dotPos: [650, 195],
      label: 'Preset Loading',
      desc: 'Built-in presets are parsed at compile time and provide fallback AST nodes.',
    },
    {
      path: 'M 210 240 L 300 310',
      dotPos: [255, 275],
      label: 'AST Input',
      desc: 'Resolver reads the AST to look up palette entries, rules, and aliases for a given query.',
    },
    {
      path: 'M 790 240 L 700 310',
      dotPos: [745, 275],
      label: 'Preset Fallback',
      desc: 'When no user-defined rule matches, resolver falls back to preset theme values.',
    },
    {
      path: 'M 400 380 L 430 460',
      dotPos: [415, 420],
      label: 'Base Style',
      desc: 'Resolver produces a base ResolvedStyle from palette + rule cascade.',
    },
    {
      path: 'M 600 380 L 570 460',
      dotPos: [585, 420],
      label: 'State Overrides',
      desc: 'Variant engine merges state-specific overrides onto the base style to produce the final ResolvedStyle.',
    },
  ],
}

const SUB_GRAPHS: Record<string, SubGraph> = {
  'theme-engine': THEME_ENGINE_SUBGRAPH,
}

// Which main-graph nodes are drillable and which sub-graph they open
const DRILLABLE_NODES: Record<string, ViewId> = {
  'THEME ENGINE': 'theme-engine',
}

export default function AntonPage() {
  const [inspectorVisible, setInspectorVisible] = useState(false)
  const [inspectorData, setInspectorData] = useState<InspectorData>({
    type: 'CRATE',
    title: 'Select a Node',
    desc: 'Click on any component or connection to inspect its architectural role.',
  })

  // View / zoom state
  const [activeView, setActiveView] = useState<ViewId>('main')
  const [zooming, setZooming] = useState(false)
  const [subGraphExiting, setSubGraphExiting] = useState(false)
  const zoomTimerRef = useRef<ReturnType<typeof setTimeout> | null>(null)

  const showInspector = (type: string, title: string, desc: string, code?: string) => {
    setInspectorData({ type, title, desc, code })
    setInspectorVisible(true)
  }

  const closeInspector = () => {
    setInspectorVisible(false)
  }

  const drillInto = useCallback((viewId: ViewId) => {
    if (zooming) return
    setInspectorVisible(false)
    setZooming(true)
    // After zoom-out animation, swap to sub-graph
    zoomTimerRef.current = setTimeout(() => {
      setActiveView(viewId)
      setZooming(false)
    }, 500)
  }, [zooming])

  const drillOut = useCallback(() => {
    if (zooming) return
    setInspectorVisible(false)
    setSubGraphExiting(true)
    zoomTimerRef.current = setTimeout(() => {
      setActiveView('main')
      setSubGraphExiting(false)
    }, 350)
  }, [zooming])

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
            <h1>ANTON</h1>
            <div className={styles.metaGrid}>
              <div className={styles.metaItem}>
                <h5>Role</h5>
                <p>Sole Author</p>
              </div>
              <div className={styles.metaItem}>
                <h5>Date</h5>
                <p>2025</p>
              </div>
              <div className={styles.metaItem}>
                <h5>Stack</h5>
                <p>Rust, Crossterm, Pest</p>
              </div>
              <div className={styles.metaItem}>
                <h5>Type</h5>
                <p>Library / Framework</p>
              </div>
            </div>
            <a
              href="https://github.com/ZuhaadRathore/anton"
              target="_blank"
              rel="noopener noreferrer"
              className={styles.githubBtn}
            >
              View on Github
            </a>
          </div>
          <div className={styles.projectDesc}>
            <h3>OVERVIEW</h3>
            <p>
              A modern, immediate-mode TUI library for Rust with a CSS-like theming DSL.
              Anton brings web-standard flexbox layout, double-buffered diff rendering,
              and a rich widget library to the terminal — all designed around the
              principle that UI should be a pure function of state.
            </p>
            <p>
              Named after Anton Ego from Ratatouille, the library is structured as a
              Cargo workspace of three crates: a rendering engine, an interactive widget
              library, and a theming system with its own custom grammar.
            </p>
          </div>
        </header>

        <section className={styles.techDiagramSection}>
          <div className={styles.blueprintGrid} />

          <div className={styles.diagramHeader}>
            <h3>{activeView === 'main' ? 'THREE-CRATE ARCHITECTURE' : SUB_GRAPHS[activeView]?.title}</h3>
            <span>
              {activeView === 'main'
                ? 'Click nodes and connection dots for further information'
                : SUB_GRAPHS[activeView]?.subtitle}
            </span>
          </div>

          {/* ── Main Graph ── */}
          {activeView === 'main' && (
            <div className={`${styles.systemMap} ${zooming ? styles.systemMapZoomOut : ''}`}>
              <svg className={styles.connectionsLayer}>
                <defs>
                  <marker id="arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                    <path d="M0,0 L0,6 L9,3 z" fill="#0A0A0A" />
                  </marker>
                </defs>

                {/* User App -> Context */}
                <path className={styles.wire} d="M 500 145 L 500 176" markerEnd="url(#arrow)" />
                <circle cx="500" cy="154" r="4" className={styles.dataDot}
                  onClick={() => showInspector('DATA FLOW', 'Frame Closure', 'User app closure is called every frame with a mutable Context reference. The UI is re-described each frame — no retained widget tree.')} />

                {/* Context -> Surface */}
                <path className={styles.wire} d="M 400 260 L 216 342" markerEnd="url(#arrow)" />
                <circle cx="308" cy="301" r="4" className={styles.dataDot}
                  onClick={() => showInspector('DATA FLOW', 'Buffer Write', 'Context exposes the current frame buffer for widget drawing. Each cell is written with content, style, and color.', 'ctx.buffer_mut().set_cell(x, y, cell)')} />

                {/* Context -> Layout */}
                <path className={styles.wire} d="M 600 260 L 784 342" markerEnd="url(#arrow)" />
                <circle cx="692" cy="301" r="4" className={styles.dataDot}
                  onClick={() => showInspector('DATA FLOW', 'Layout Compute', 'vbox/hbox closures build a LayoutTree per frame. After ui() returns, computed Rects are available.', 'let node = ctx.ui(props, |ctx| { ... })')} />

                {/* Surface -> Diff -> Backend */}
                <path className={styles.wire} d="M 200 440 L 200 530" markerEnd="url(#arrow)" />
                <circle cx="200" cy="485" r="4" className={styles.dataDot}
                  onClick={() => showInspector('DATA FLOW', 'Diff & Flush', 'Line-based diff computes minimal DiffOps between current and previous buffer, generates ANSI sequences, and flushes to stdout.', 'diff_buffers(prev, curr) -> Vec<DiffOp>')} />

                {/* Theme -> Widgets */}
                <path className={styles.wire} d="M 500 460 L 500 530" markerEnd="url(#arrow)" />
                <circle cx="500" cy="495" r="4" className={styles.dataDot}
                  onClick={() => showInspector('DATA FLOW', 'Style Resolution', 'Resolver walks token hierarchy, applies variant state overrides, resolves aliases (cycle-detected), returns ResolvedStyle.', 'resolve(theme, widget_kind, classes, states)')} />

                {/* Widgets -> Context (uses) */}
                <path className={styles.wire} d="M 600 580 L 615 316" markerEnd="url(#arrow)" />
                <circle cx="610" cy="413" r="4" className={styles.dataDot}
                  onClick={() => showInspector('DATA FLOW', 'Widget Rendering', 'Widgets call Context APIs: buffer drawing, layout rects, focus checks, and input state. All immediate-mode.', 'button(ctx, id!("ok"), props)?')} />
              </svg>

              {/* Layer labels */}
              <span className={styles.layerLabel} style={{ top: 10, left: 0 }}>APPLICATION LAYER</span>
              <span className={styles.layerLabel} style={{ top: 160, left: 0 }}>CORE ENGINE</span>
              <span className={styles.layerLabel} style={{ top: 520, left: 0 }}>OUTPUT</span>

              {/* User App */}
              <div className={styles.node} style={{ top: 20, left: 400, width: 200 }}
                onClick={() => showInspector('APPLICATION', 'User App', 'Your application code. A closure called every frame with a mutable Context. Describe your UI imperatively — no retained state, no lifecycle methods.', 'fn app(ctx: &mut Context) { ... }')}>
                <div className={styles.nodeIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <path d="M16 18l6-6-6-6M8 6l-6 6 6 6" />
                  </svg>
                </div>
                <div className={styles.nodeLabel}>USER APP</div>
              </div>

              {/* Context */}
              <div className={styles.node} style={{ top: 180, left: 380, width: 240, height: 120, borderWidth: 2 }}
                onClick={() => showInspector('CRATE', 'Context', 'The central API surface passed every frame. Provides: buffer access, input events, focus management, input state cache, layout tree, and exit control.')}>
                <div className={styles.nodeIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="10" />
                    <path d="M12 2v20M2 12h20" />
                  </svg>
                </div>
                <div className={styles.nodeLabel}>CONTEXT</div>
              </div>

              {/* Surface (Double Buffer) */}
              <div className={styles.node} style={{ top: 350, left: 100 }}
                onClick={() => showInspector('COMPONENT', 'Double-Buffered Surface', 'Holds current and previous frame buffers. After drawing, diff_buffers() computes the minimal set of changed cell-spans as DiffOps, generating ANSI escape sequences only for changed regions.')}>
                <div className={styles.nodeIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" />
                    <rect x="4" y="5" width="16" height="10" rx="1" strokeDasharray="3 2" />
                  </svg>
                </div>
                <div className={styles.nodeLabel}>SURFACE</div>
              </div>

              {/* Layout Engine */}
              <div className={styles.node} style={{ top: 350, left: 700 }}
                onClick={() => showInspector('COMPONENT', 'Flexbox Layout', 'Web-standard-inspired layout engine. Supports vbox/hbox, flex-grow/shrink, justify-content, align-items, padding/margin edges, min/max constraints. Two APIs: immediate-mode (vbox/hbox/ui) and low-level LayoutTree.', 'vbox(ctx, props, |ctx| { hbox(...) })')}>
                <div className={styles.nodeIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="18" height="18" rx="2" />
                    <path d="M3 9h18M9 21V9" />
                  </svg>
                </div>
                <div className={styles.nodeLabel}>LAYOUT ENGINE</div>
              </div>

              {/* Theme — drillable */}
              <div
                className={`${styles.node} ${styles.nodeDrillable}`}
                style={{ top: 370, left: 400 }}
                onClick={() => drillInto('theme-engine')}
              >
                <div className={styles.nodeIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="5" />
                    <path d="M12 1v2M12 21v2M4.22 4.22l1.42 1.42M18.36 18.36l1.42 1.42M1 12h2M21 12h2M4.22 19.78l1.42-1.42M18.36 5.64l1.42-1.42" />
                  </svg>
                </div>
                <div className={styles.nodeLabel}>THEME ENGINE</div>
              </div>

              {/* Backend */}
              <div className={styles.node} style={{ top: 530, left: 100 }}
                onClick={() => showInspector('COMPONENT', 'Crossterm Backend', 'RAII crash-safe terminal backend. Initializes raw mode + alternate screen, writes ANSI sequences to stdout. Drop impl guarantees terminal restoration even during panics.', 'impl Drop for CrosstermBackend { fn drop(&mut self) { restore(); } }')}>
                <div className={styles.nodeIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="3" width="20" height="14" rx="2" ry="2" />
                    <line x1="8" y1="21" x2="16" y2="21" />
                    <line x1="12" y1="17" x2="12" y2="21" />
                  </svg>
                </div>
                <div className={styles.nodeLabel}>BACKEND</div>
              </div>

              {/* Widgets */}
              <div className={styles.node} style={{ top: 530, left: 400, width: 200 }}
                onClick={() => showInspector('CRATE', 'anton-widgets', '10+ interactive widgets built entirely on the Context API. All immediate-mode: called each frame, return state, integrate with focus system and theme variants. Includes: button, input, list, tabs, scroll, charts, text, panel, block.')}>
                <div className={styles.nodeIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="3" y="3" width="7" height="7" />
                    <rect x="14" y="3" width="7" height="7" />
                    <rect x="3" y="14" width="7" height="7" />
                    <rect x="14" y="14" width="7" height="7" />
                  </svg>
                </div>
                <div className={styles.nodeLabel}>WIDGETS</div>
              </div>

              {/* Focus System */}
              <div className={styles.node} style={{ top: 180, left: 770, width: 170 }}
                onClick={() => showInspector('COMPONENT', 'Focus Registry', 'Three-phase frame lifecycle focus management. Tracks which ElementId is focused. Tab/Shift+Tab navigation runs after all widgets have registered, ensuring correct ordering.', 'ctx.is_focused(id) / ctx.request_focus(id)')}>
                <div className={styles.nodeIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <circle cx="12" cy="12" r="3" />
                    <path d="M12 5V3M12 21v-2M5 12H3M21 12h-2" />
                  </svg>
                </div>
                <div className={styles.nodeLabel}>FOCUS</div>
              </div>

              {/* Input System */}
              <div className={styles.node} style={{ top: 180, left: 30, width: 170 }}
                onClick={() => showInspector('COMPONENT', 'Input System', 'Full keyboard and mouse event handling. TextInputState caches per-element cursor position and text across frames. KeybindingRegistry provides scoped keybinding registration.', 'ctx.key_pressed(KeyCode::Enter)')}>
                <div className={styles.nodeIcon}>
                  <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="1.5">
                    <rect x="2" y="6" width="20" height="12" rx="2" />
                    <path d="M6 12h.01M10 12h.01M14 12h.01M18 12h.01" />
                  </svg>
                </div>
                <div className={styles.nodeLabel}>INPUT</div>
              </div>
            </div>
          )}

          {/* ── Sub-Graph View ── */}
          {activeView !== 'main' && SUB_GRAPHS[activeView] && (
            <div className={styles.subGraphWrap}>
              <div className={styles.subGraphHeader}>
                <button className={styles.subGraphBack} onClick={drillOut}>
                  ← Back
                </button>
                <span className={styles.subGraphTitle}>{SUB_GRAPHS[activeView].title}</span>
                <span className={styles.subGraphSubtitle}>{SUB_GRAPHS[activeView].subtitle}</span>
              </div>

              <div className={`${styles.subGraphMap} ${subGraphExiting ? styles.subGraphExit : ''}`}>
                <svg className={styles.connectionsLayer}>
                  <defs>
                    <marker id="sub-arrow" markerWidth="10" markerHeight="10" refX="8" refY="3" orient="auto">
                      <path d="M0,0 L0,6 L9,3 z" fill="#0A0A0A" />
                    </marker>
                  </defs>
                  {SUB_GRAPHS[activeView].connections.map((conn, i) => (
                    <g key={i}>
                      <path className={styles.wire} d={conn.path} markerEnd="url(#sub-arrow)" />
                      <circle
                        cx={conn.dotPos[0]}
                        cy={conn.dotPos[1]}
                        r="4"
                        className={styles.dataDot}
                        onClick={() => showInspector('DATA FLOW', conn.label, conn.desc, conn.code)}
                      />
                    </g>
                  ))}
                </svg>

                {SUB_GRAPHS[activeView].nodes.map((node) => (
                  <div
                    key={node.id}
                    className={styles.node}
                    style={{ top: node.top, left: node.left, width: node.width }}
                    onClick={() => showInspector(node.inspectorType, node.inspectorTitle, node.desc, node.code)}
                  >
                    <div className={styles.nodeIcon}>{node.icon}</div>
                    <div className={styles.nodeLabel}>{node.label}</div>
                  </div>
                ))}
              </div>
            </div>
          )}
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
      </div>
    </div>
  )
}
