export interface InfrastructureDiagram {
  title: string
  svg: string
}

export interface ClickableSection {
  id: string
  title: string
  diagrams: InfrastructureDiagram[]
}

export interface ProjectInfrastructure {
  projectId: number
  mainDiagram: InfrastructureDiagram
  clickableSections: ClickableSection[]
}

// TODO: Design and implement EZ-TAURI system architecture diagram
// Consider: CLI workflow, desktop shell, backend services, ops/release pipeline
const ezTauriSvg = `<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="background-color:#0d1117;">
  <rect width="100%" height="100%" fill="#0d1117"/>
  <text x="450" y="260" fill="#6b7280" font-size="16" text-anchor="middle" font-family="monospace">
    Architecture diagram placeholder - to be designed
  </text>
</svg>`

// TODO: Design and implement TETRIS system architecture diagram
// Consider: Game loop, player IO, render/audio pipeline, cross-platform builds
const tetrisSvg = `<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="background-color:#0d1117;">
  <rect width="100%" height="100%" fill="#0d1117"/>
  <text x="450" y="260" fill="#6b7280" font-size="16" text-anchor="middle" font-family="monospace">
    Architecture diagram placeholder - to be designed
  </text>
</svg>`

// TODO: Design and implement PORTFOLIO system architecture diagram
// Consider: Edge delivery, visitor flow, GitHub API integration, caching strategy
const portfolioSvg = `<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="background-color:#0d1117;">
  <rect width="100%" height="100%" fill="#0d1117"/>
  <text x="450" y="260" fill="#6b7280" font-size="16" text-anchor="middle" font-family="monospace">
    Architecture diagram placeholder - to be designed
  </text>
</svg>`

// TODO: Design and implement ANTON TUI-LIB system architecture diagram
// Consider: Immediate mode API, layout engine, render pipeline, widget DSL, theming
const antonSvg = `<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="background-color:#0d1117;">
  <rect width="100%" height="100%" fill="#0d1117"/>
  <text x="450" y="260" fill="#6b7280" font-size="16" text-anchor="middle" font-family="monospace">
    Architecture diagram placeholder - to be designed
  </text>
</svg>`

// TODO: Design and implement RETENTION system architecture diagram
// Consider: Tauri UI, FastAPI sidecar, ML model bundling, offline-first design
const retentionSvg = `<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="background-color:#0d1117;">
  <rect width="100%" height="100%" fill="#0d1117"/>
  <text x="450" y="260" fill="#6b7280" font-size="16" text-anchor="middle" font-family="monospace">
    Architecture diagram placeholder - to be designed
  </text>
</svg>`

export const projectInfrastructure: ProjectInfrastructure[] = [
  {
    projectId: 1,
    mainDiagram: {
      title: 'Build + Runtime',
      svg: ezTauriSvg,
    },
    clickableSections: [],
  },
  {
    projectId: 2,
    mainDiagram: {
      title: 'Gameplay + Builds',
      svg: tetrisSvg,
    },
    clickableSections: [],
  },
  {
    projectId: 3,
    mainDiagram: {
      title: 'Edge Delivery',
      svg: portfolioSvg,
    },
    clickableSections: [],
  },
  {
    projectId: 4,
    mainDiagram: {
      title: 'Runtime Loop',
      svg: antonSvg,
    },
    clickableSections: [],
  },
  {
    projectId: 5,
    mainDiagram: {
      title: 'Desktop + Sidecar',
      svg: retentionSvg,
    },
    clickableSections: [],
  },
]

export function getProjectInfrastructure(projectId: number): ProjectInfrastructure | undefined {
  return projectInfrastructure.find((p) => p.projectId === projectId)
}

