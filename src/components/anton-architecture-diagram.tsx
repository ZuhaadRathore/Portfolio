'use client'

import { motion, AnimatePresence } from 'framer-motion'
import { useState } from 'react'
import {
  Keyboard,
  Cpu,
  Database,
  Layers,
  Palette,
  Box,
  Monitor,
  ArrowDown,
  ArrowRight,
  Activity,
  Code2,
  GripVertical
} from 'lucide-react'

// -- Data Definitions --

type NodeType = 'input' | 'core' | 'state' | 'layout' | 'theme' | 'widgets' | 'render'

interface NodeDef {
  id: NodeType
  title: string
  icon: React.ElementType
  shortDesc: string
  fullDesc: string
  mechanism: string
  codeSnippet: string
  color: string
  borderColor: string
  bgColor: string
  shadowColor: string
}

const nodeDefs: Record<NodeType, NodeDef> = {
  input: {
    id: 'input',
    title: 'Input Driver',
    icon: Keyboard,
    shortDesc: 'Event Capture',
    fullDesc: 'Captures raw ANSI escape codes from stdin. Spawns a dedicated thread to poll for events without blocking the main render loop.',
    mechanism: 'Crossbeam Channel (MPSC)',
    codeSnippet: 'thread::spawn(move || {\n  while let Ok(evt) = term::poll() {\n    tx.send(evt).unwrap();\n  }\n});',
    color: 'text-emerald-500',
    borderColor: 'border-emerald-500',
    bgColor: 'bg-emerald-500/10',
    shadowColor: 'shadow-emerald-500/20'
  },
  core: {
    id: 'core',
    title: 'Event Loop',
    icon: Cpu,
    shortDesc: 'Orchestrator',
    fullDesc: 'The deterministic heart of the TUI. Dequeues events, mutates state, and triggers the render pipeline. Ensures strict serial execution.',
    mechanism: 'Loop { Poll -> Update -> Draw }',
    codeSnippet: 'loop {\n  let event = rx.recv().unwrap();\n  state.handle(event);\n  terminal.draw(|f| ui(f, &state));\n}',
    color: 'text-amber-500',
    borderColor: 'border-amber-500',
    bgColor: 'bg-amber-500/10',
    shadowColor: 'shadow-amber-500/20'
  },
  state: {
    id: 'state',
    title: 'App State',
    icon: Database,
    shortDesc: 'Truth Source',
    fullDesc: 'Holds the entire application state (cursor pos, data tables, active tab). Passed mutably to update logic, immutably to render logic.',
    mechanism: '&mut borrow / RefCell',
    codeSnippet: 'struct AppState {\n  counter: i64,\n  input_buffer: String,\n  active_tab: usize,\n}',
    color: 'text-blue-500',
    borderColor: 'border-blue-500',
    bgColor: 'bg-blue-500/10',
    shadowColor: 'shadow-blue-500/20'
  },
  layout: {
    id: 'layout',
    title: 'Layout Engine',
    icon: Layers,
    shortDesc: 'Constraint Solver',
    fullDesc: 'Computes screen coordinates for every widget based on available terminal size. Supports Flexbox-like constraints (Min, Max, Percent).',
    mechanism: 'Cassowary / Flex Algo',
    codeSnippet: 'Layout::default()\n  .direction(Direction::Vertical)\n  .constraints([Min(0), Length(3)])\n  .split(area);',
    color: 'text-indigo-500',
    borderColor: 'border-indigo-500',
    bgColor: 'bg-indigo-500/10',
    shadowColor: 'shadow-indigo-500/20'
  },
  theme: {
    id: 'theme',
    title: 'Theme Engine',
    icon: Palette,
    shortDesc: 'Style Injection',
    fullDesc: 'Resolves style rules (colors, modifiers) against the current widget state. Allows hot-reloading of .ath theme files.',
    mechanism: 'Hashmap Lookup / Styling Trait',
    codeSnippet: 'let style = theme.get(Kind::Button)\n  .state(State::Hover)\n  .resolve();',
    color: 'text-pink-500',
    borderColor: 'border-pink-500',
    bgColor: 'bg-pink-500/10',
    shadowColor: 'shadow-pink-500/20'
  },
  widgets: {
    id: 'widgets',
    title: 'Widget Tree',
    icon: Box,
    desc: 'UI Composition',
    shortDesc: 'Component Graph',
    fullDesc: 'A transient tree of UI components created every frame. Widgets consume the Layout Rects and App State to determine what to draw.',
    mechanism: 'Immediate Mode Construction',
    codeSnippet: 'Paragraph::new("Hello World")\n  .style(style)\n  .block(Block::default().borders(ALL))\n  .render(area, buf);',
    color: 'text-orange-500',
    borderColor: 'border-orange-500',
    bgColor: 'bg-orange-500/10',
    shadowColor: 'shadow-orange-500/20'
  } as any,
  render: {
    id: 'render',
    title: 'Renderer',
    icon: Monitor,
    shortDesc: 'Diff & Paint',
    fullDesc: 'Compares the current frame buffer against the previous frame. Generates the minimal set of ANSI escape codes needed to update the user\'s screen.',
    mechanism: 'Double Buffering / Diff',
    codeSnippet: 'let diff = buffer.diff(&prev_buffer);\nstdout.queue(SetAttribute(diff.attr));\nstdout.queue(Print(diff.symbol));',
    color: 'text-cyan-500',
    borderColor: 'border-cyan-500',
    bgColor: 'bg-cyan-500/10',
    shadowColor: 'shadow-cyan-500/20'
  }
}

// -- Components --

function ConnectionLabel({ text, vertical = false }: { text: string, vertical?: boolean }) {
    return (
        <div className={`absolute ${vertical ? 'left-1/2 -translate-x-1/2 top-1/2 -translate-y-1/2' : 'top-1/2 -translate-y-1/2 left-1/2 -translate-x-1/2'} z-30`}>
            <span className="font-mono text-[10px] font-bold uppercase tracking-wider text-text-light dark:text-text-dark bg-surface-light dark:bg-surface-dark border border-border-light dark:border-border-dark px-2 py-1 rounded shadow-md whitespace-nowrap">
                {text}
            </span>
        </div>
    )
}

function Arrow({ vertical = false }: { vertical?: boolean }) {
    return (
        <div className={`absolute ${vertical ? 'bottom-0 left-1/2 -translate-x-1/2 translate-y-2/3' : 'right-0 top-1/2 -translate-y-1/2 translate-x-2/3'} z-20 text-text-light dark:text-text-dark`}>
            {vertical ? <ArrowDown className="w-5 h-5" /> : <ArrowRight className="w-5 h-5" />}
        </div>
    )
}

function ConnectionLine({ vertical = false, height, width }: { vertical?: boolean, height?: string, width?: string }) {
  return (
    <div 
      className={`absolute z-0 bg-text-light/20 dark:bg-text-dark/20 ${vertical ? 'w-[2px] left-1/2 -translate-x-1/2' : 'h-[2px] top-1/2 -translate-y-1/2'}`}
      style={{
        height: vertical ? height || '100%' : '2px',
        width: !vertical ? width || '100%' : '2px'
      }}
    />
  )
}

export default function AntonArchitectureDiagram() {
  const [selectedNode, setSelectedNode] = useState<NodeType | null>('core')

  const isTopNode = (id: string) => ['input', 'core', 'state', 'layout'].includes(id)

  return (
    <div className="w-full py-8 text-text-light dark:text-text-dark selection:bg-primary/30 relative">
      
      {/* Header */}
      <div className="mb-12 border-b-2 border-border-light/10 dark:border-border-dark/10 pb-6 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
            <h3 className="font-display text-4xl uppercase tracking-tighter text-primary mb-2">
                System Internals
            </h3>
            <p className="font-body text-sm opacity-70 max-w-2xl">
                Interactive architecture map. Click nodes to examine the immediate-mode pipeline.
            </p>
        </div>
        <div className="font-mono text-[10px] uppercase opacity-50">
            Click any node to view details
        </div>
      </div>

      <div className="relative min-h-[800px] bg-background-light dark:bg-background-dark p-8 md:p-16 border-2 border-border-light/10 dark:border-border-dark/10 rounded-xl shadow-inner overflow-hidden">
            
        {/* Background Grid */}
        <div className="absolute inset-0 bg-[linear-gradient(to_right,#80808012_1px,transparent_1px),linear-gradient(to_bottom,#80808012_1px,transparent_1px)] bg-[size:32px_32px] pointer-events-none rounded-xl" />

        {/* --- TOP ROW: INPUT --- */}
        <div className="flex justify-center mb-32 relative z-10">
                <div className="relative w-fit mx-auto">
                <DiagramNode
                    id="input"
                    selected={selectedNode === 'input'}
                    onClick={() => setSelectedNode('input')}
                />
                {/* Down to Core */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 h-24 w-px -z-10">
                    <ConnectionLine vertical height="100%" />
                    <ConnectionLabel text="Events" vertical />
                    <Arrow vertical />
                </div>
                </div>
        </div>

        {/* --- MIDDLE ROW: STATE - CORE - LAYOUT --- */}
        <div className="flex flex-col md:flex-row justify-center gap-16 md:gap-48 mb-32 relative z-10 items-center">
            
            {/* State (Left) */}
            <div className="relative w-fit mx-auto">
                <DiagramNode
                    id="state"
                    selected={selectedNode === 'state'}
                    onClick={() => setSelectedNode('state')}
                />
                {/* Arrow to Core */}
                <div className="absolute top-1/2 left-full w-24 md:w-48 h-px hidden md:block -z-10">
                    <ConnectionLine width="100%" />
                    <Arrow />
                </div>
            </div>

            {/* Core (Center) */}
            <div className="relative w-fit mx-auto">
                <DiagramNode
                    id="core"
                    selected={selectedNode === 'core'}
                    onClick={() => setSelectedNode('core')}
                    isMain
                />
                {/* Down to Widget Tree */}
                <div className="absolute top-full left-1/2 -translate-x-1/2 h-32 w-px -z-10">
                    <ConnectionLine vertical height="100%" />
                    <ConnectionLabel text="State" vertical />
                    <Arrow vertical />
                </div>
            </div>

            {/* Layout (Right) */}
            <div className="relative w-fit mx-auto">
                    {/* Bidirectional connection with Core */}
                    <div className="absolute top-1/2 right-full w-24 md:w-48 h-px hidden md:block -z-10">
                    <ConnectionLine width="100%" />
                    {/* Left arrow (Core to Layout) */}
                    <div className="absolute left-0 top-1/2 -translate-y-1/2 -translate-x-1/2 text-text-light dark:text-text-dark rotate-180 z-20">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                    {/* Right arrow (Layout to Core) */}
                    <div className="absolute right-0 top-1/2 -translate-y-1/2 translate-x-1/2 text-text-light dark:text-text-dark z-20">
                        <ArrowRight className="w-5 h-5" />
                    </div>
                    </div>

                <DiagramNode
                    id="layout"
                    selected={selectedNode === 'layout'}
                    onClick={() => setSelectedNode('layout')}
                />
            </div>
        </div>

        {/* --- BOTTOM ROW: THEME - WIDGETS --- */}
        <div className="flex flex-col md:flex-row justify-center gap-16 md:gap-48 mb-32 relative z-10 items-center">
                {/* Theme (Side Input) */}
                <div className="relative w-fit mx-auto">
                <DiagramNode 
                    id="theme" 
                    selected={selectedNode === 'theme'}
                    onClick={() => setSelectedNode('theme')} 
                />
                    {/* Arrow to Widgets */}
                    <div className="absolute top-1/2 left-full translate-x-2 w-24 md:w-44 h-px hidden md:block -z-10">
                    <ConnectionLine width="100%" />
                    <ConnectionLabel text="Styles" />
                    <Arrow />
                    </div>
                </div>

                {/* Widgets (Center) */}
                <div className="relative w-fit mx-auto">
                <DiagramNode 
                    id="widgets" 
                    selected={selectedNode === 'widgets'}
                    onClick={() => setSelectedNode('widgets')} 
                />
                    {/* Down to Render */}
                    <div className="absolute top-full left-1/2 -translate-x-1/2 translate-y-2 h-28 w-px -z-10">
                    <ConnectionLine vertical height="100%" />
                    <ConnectionLabel text="Draw Calls" vertical />
                    <Arrow vertical />
                    </div>
                </div>
        </div>

        {/* --- FOOTER: RENDER --- */}
        <div className="flex justify-center relative z-10">
            <DiagramNode
                id="render"
                selected={selectedNode === 'render'}
                onClick={() => setSelectedNode('render')}
                width="w-full max-w-sm"
            />
        </div>

      </div>

      {/* --- SMART FLOATING POPUP --- */}
      <AnimatePresence>
          {selectedNode && (
              <motion.div
                  drag
                  dragMomentum={false}
                  dragElastic={0}
                  initial={{
                      opacity: 0,
                      scale: 0.95,
                      x: isTopNode(selectedNode) ? 0 : 0,
                      y: isTopNode(selectedNode) ? 0 : 0
                  }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.95 }}
                  transition={{ duration: 0.2 }}
                  className={`
                      fixed z-50 w-full md:w-[400px] max-w-[calc(100%-2rem)]
                      right-4 md:right-8
                      ${isTopNode(selectedNode) ? 'bottom-4 md:bottom-8' : 'top-4 md:top-8'}
                      cursor-move
                  `}
              >
                  <InspectorPanel node={nodeDefs[selectedNode]} onClose={() => setSelectedNode(null)} />
              </motion.div>
          )}
      </AnimatePresence>
    </div>
  )
}

// -- Sub-Components --

function DiagramNode({ id, selected, onClick, isMain = false, width = 'w-32 md:w-44' }: { id: NodeType, selected: boolean, onClick: () => void, isMain?: boolean, width?: string }) {
    const def = nodeDefs[id]
    
    return (
        <motion.button
            onClick={onClick}
            whileHover={{ scale: 1.05 }}
            whileTap={{ scale: 0.95 }}
            className={`
                relative flex flex-col items-center justify-center gap-3 p-5
                border-3 rounded-xl transition-all duration-300
                ${width}
                bg-surface-light dark:bg-surface-dark
                ${selected 
                    ? `${def.borderColor} ${def.shadowColor} shadow-[0_0_30px_rgba(var(--tw-shadow-color))] z-20` 
                    : `border-border-light/10 dark:border-border-dark/10 hover:border-primary/50 opacity-100`
                }
            `}>

            <div className={`
                p-3 rounded-full border-2
                ${selected ? `${def.bgColor} ${def.borderColor} ${def.color}` : 'bg-background-light dark:bg-background-dark border-border-light/10 dark:border-border-dark/10 text-text-light/40 dark:text-text-dark/40'}
            `}>
                <def.icon className="w-6 h-6" />
            </div>
            <div className="text-center">
                <div className={`font-display uppercase tracking-wider ${isMain ? 'text-xl' : 'text-sm'} ${selected ? 'text-text-light dark:text-text-dark' : 'text-text-light/60 dark:text-text-dark/60'}`}>
                    {def.title}
                </div>
                {/* Colored Underline for emphasis */}
                {selected && (
                    <motion.div 
                        layoutId="underline" 
                        className={`h-1 w-8 mx-auto mt-2 rounded-full ${def.bgColor.replace('/10', '')}`} 
                    />
                )}
            </div>
        </motion.button>
    )
}

function InspectorPanel({ node, onClose }: { node: NodeDef, onClose: () => void }) {
    return (
        <div className={`
            bg-surface-light/95 dark:bg-surface-dark/95 backdrop-blur-md
            border-3 ${node.borderColor}
            p-6
            shadow-2xl shadow-black/20
            flex flex-col rounded-xl
            relative
        `}>
            {/* Drag Handle Indicator */}
            <div className="absolute top-2 left-1/2 -translate-x-1/2 opacity-30 pointer-events-none">
                <GripVertical className="w-4 h-4" />
            </div>

            {/* Close Button */}
            <button
                onClick={(e) => { e.stopPropagation(); onClose(); }}
                className="absolute top-2 right-2 p-2 opacity-50 hover:opacity-100 hover:bg-black/5 dark:hover:bg-white/5 rounded-full z-10"
            >
                <div className="w-4 h-4 relative">
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-current rotate-45" />
                    <div className="absolute top-1/2 left-0 w-full h-0.5 bg-current -rotate-45" />
                </div>
            </button>

            <div className="flex items-center gap-4 mb-6 border-b-2 border-border-light/10 dark:border-border-dark/10 pb-4">
                <div className={`w-12 h-12 ${node.bgColor} flex items-center justify-center border-2 ${node.borderColor} ${node.color} rounded-lg flex-shrink-0`}>
                    <node.icon className="w-6 h-6" />
                </div>
                <div>
                    <h2 className="font-display text-2xl uppercase tracking-tighter text-text-light dark:text-text-dark">
                        {node.title}
                    </h2>
                    <div className={`font-mono text-[10px] uppercase tracking-widest font-bold ${node.color}`}>
                        {node.mechanism}
                    </div>
                </div>
            </div>

            <div className="space-y-6">
                <div>
                    <h4 className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest mb-2 opacity-60">
                        <Activity className="w-3 h-3" />
                        Responsibility
                    </h4>
                    <p className="text-sm leading-relaxed text-text-light/90 dark:text-text-dark/90 font-body">
                        {node.fullDesc}
                    </p>
                </div>

                <div className="bg-background-light dark:bg-background-dark border-2 border-border-light/10 dark:border-border-dark/10 p-4 rounded-lg relative group overflow-hidden">
                    <div className={`absolute top-0 right-0 px-2 py-1 ${node.bgColor} text-[9px] font-mono uppercase rounded-bl text-text-light dark:text-text-dark font-bold`}>
                        Rust
                    </div>
                    <h4 className="flex items-center gap-2 font-bold uppercase text-[10px] tracking-widest mb-2 opacity-60">
                        <Code2 className="w-3 h-3" />
                        Logic Snippet
                    </h4>
                    <pre className={`font-mono text-[10px] md:text-xs overflow-x-auto ${node.color}`}>
                        {node.codeSnippet}
                    </pre>
                </div>
            </div>
        </div>
    )
}
