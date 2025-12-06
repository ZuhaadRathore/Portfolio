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

const ezTauriSvg = `<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="background-color:#0d1117;font-family:'SF Mono','Segoe UI Mono','Roboto Mono',monospace;">
  <defs>
    <linearGradient id="ez-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#161b22"/>
      <stop offset="100%" stop-color="#0d1117"/>
    </linearGradient>
    <pattern id="ez-grid" width="40" height="40" patternUnits="userSpaceOnUse">
      <path d="M 40 0 L 0 0 0 40" fill="none" stroke="#21262d" stroke-width="1"/>
    </pattern>
    <marker id="ez-arrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,8 L10,4 z" fill="#FDC435"/>
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="url(#ez-bg)" />
  <rect width="100%" height="100%" fill="url(#ez-grid)" opacity="0.25" />

  <text x="40" y="50" fill="#ffffff" font-size="20" font-weight="700" letter-spacing="2">EZ-TAURI DELIVERY</text>
  <text x="40" y="75" fill="#8b949e" font-size="12">Scaffold - Build - Ship loop</text>

  <rect x="40" y="120" width="220" height="360" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="60" y="145" fill="#8b949e" font-size="10" letter-spacing="1">CLI + TOOLING</text>

  <rect x="300" y="120" width="240" height="160" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="320" y="145" fill="#8b949e" font-size="10" letter-spacing="1">DESKTOP SHELL</text>

  <rect x="300" y="320" width="240" height="160" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="320" y="345" fill="#8b949e" font-size="10" letter-spacing="1">BACKEND SERVICES</text>

  <rect x="580" y="200" width="260" height="220" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="600" y="225" fill="#8b949e" font-size="10" letter-spacing="1">OPS + RELEASE</text>

  <g transform="translate(70, 180)">
    <rect width="170" height="60" rx="6" fill="#21262d" stroke="#FDC435" stroke-width="2"/>
    <text x="85" y="25" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Developer</text>
    <text x="85" y="45" fill="#8b949e" font-size="11" text-anchor="middle">codes + runs CLI</text>
  </g>
  <g transform="translate(70, 260)">
    <rect width="170" height="60" rx="6" fill="#21262d" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="85" y="25" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">ez-tauri CLI</text>
    <text x="85" y="45" fill="#8b949e" font-size="11" text-anchor="middle">scaffold + doctor</text>
  </g>
  <g transform="translate(70, 340)">
    <rect width="170" height="60" rx="6" fill="#21262d" stroke="#7ee787" stroke-width="1.5"/>
    <text x="85" y="25" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Local Assets</text>
    <text x="85" y="45" fill="#8b949e" font-size="11" text-anchor="middle">logs + env + sqlx</text>
  </g>
  <g transform="translate(70, 420)">
    <rect width="170" height="60" rx="6" fill="#21262d" stroke="#c9d1d9" stroke-width="1.5"/>
    <text x="85" y="25" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Tests + Lints</text>
    <text x="85" y="45" fill="#8b949e" font-size="11" text-anchor="middle">fmt, clippy, vitest</text>
  </g>

  <g transform="translate(330, 170)">
    <rect width="180" height="60" rx="6" fill="#0d1117" stroke="#FDC435" stroke-width="2"/>
    <text x="90" y="25" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Tauri Shell</text>
    <text x="90" y="45" fill="#FDC435" font-size="11" text-anchor="middle">window, updater, native</text>
  </g>
  <g transform="translate(330, 240)">
    <rect width="180" height="60" rx="6" fill="#0d1117" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="90" y="25" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">React UI</text>
    <text x="90" y="45" fill="#8b949e" font-size="11" text-anchor="middle">Vite + TS + Zustand</text>
  </g>

  <g transform="translate(330, 370)">
    <rect width="180" height="50" rx="6" fill="#0d1117" stroke="#7ee787" stroke-width="1.5"/>
    <text x="90" y="22" fill="#c9d1d9" font-size="12" font-weight="700" text-anchor="middle">Auth + Sessions</text>
    <text x="90" y="40" fill="#7ee787" font-size="10" text-anchor="middle">argon2 + rate limit</text>
  </g>
  <g transform="translate(330, 430)">
    <rect width="180" height="50" rx="6" fill="#0d1117" stroke="#d2a8ff" stroke-width="1.5"/>
    <text x="90" y="22" fill="#c9d1d9" font-size="12" font-weight="700" text-anchor="middle">Rust Core</text>
    <text x="90" y="40" fill="#d2a8ff" font-size="10" text-anchor="middle">commands + async</text>
  </g>

  <g transform="translate(610, 240)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#FDC435" stroke-width="2"/>
    <text x="100" y="25" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Release Pipeline</text>
    <text x="100" y="45" fill="#8b949e" font-size="11" text-anchor="middle">CI, signing, notarize</text>
  </g>
  <g transform="translate(610, 310)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="100" y="25" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Installers</text>
    <text x="100" y="45" fill="#8b949e" font-size="11" text-anchor="middle">msi, dmg, appimage</text>
  </g>
  <g transform="translate(610, 380)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#7ee787" stroke-width="1.5"/>
    <text x="100" y="25" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Auto Update</text>
    <text x="100" y="45" fill="#7ee787" font-size="11" text-anchor="middle">channels + rollback</text>
  </g>

  <g transform="translate(520, 150)">
    <rect width="70" height="30" rx="4" fill="#21262d" stroke="#30363d"/>
    <text x="35" y="20" fill="#8b949e" font-size="10" text-anchor="middle">Assets</text>
  </g>

  <path d="M 240 210 L 300 210" stroke="#FDC435" stroke-width="2" fill="none" marker-end="url(#ez-arrow)"/>
  <path d="M 240 290 L 330 290 L 330 200" stroke="#58a6ff" stroke-width="2" fill="none" marker-end="url(#ez-arrow)"/>
  <path d="M 240 370 L 330 370 L 330 260" stroke="#7ee787" stroke-width="1.8" fill="none" marker-end="url(#ez-arrow)"/>
  <path d="M 240 450 L 330 450 L 330 240" stroke="#d2a8ff" stroke-width="1.8" fill="none" marker-end="url(#ez-arrow)"/>

  <path d="M 420 300 L 420 370" stroke="#8b949e" stroke-width="2" fill="none" marker-end="url(#ez-arrow)"/>
  <path d="M 420 420 L 420 430" stroke="#8b949e" stroke-width="2" fill="none" marker-end="url(#ez-arrow)"/>

  <path d="M 510 200 L 610 200 L 610 250" stroke="#FDC435" stroke-width="2" fill="none" marker-end="url(#ez-arrow)"/>
  <path d="M 510 430 L 610 430" stroke="#d2a8ff" stroke-width="2" fill="none" marker-end="url(#ez-arrow)"/>
  <path d="M 710 200 L 710 180 L 560 180" stroke="#FDC435" stroke-width="1.6" stroke-dasharray="6,6" fill="none" marker-end="url(#ez-arrow)"/>
  <path d="M 710 440 L 710 470 L 450 470 L 450 480" stroke="#7ee787" stroke-width="1.6" stroke-dasharray="6,6" fill="none" marker-end="url(#ez-arrow)"/>
</svg>`

const tetrisSvg = `<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="background-color:#0d1117;font-family:'SF Mono','Segoe UI Mono','Roboto Mono',monospace;">
  <defs>
    <linearGradient id="tet-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#131722"/>
      <stop offset="100%" stop-color="#0d1117"/>
    </linearGradient>
    <pattern id="tet-grid" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#1f2633" stroke-width="1"/>
    </pattern>
    <marker id="tet-arrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,8 L10,4 z" fill="#FDC435"/>
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="url(#tet-bg)" />
  <rect width="100%" height="100%" fill="url(#tet-grid)" opacity="0.3" />

  <text x="50" y="50" fill="#ffffff" font-size="20" font-weight="700" letter-spacing="2">TETRIS ENGINE</text>
  <text x="50" y="72" fill="#8b949e" font-size="12">Cross-platform loop + build targets</text>

  <rect x="40" y="120" width="220" height="360" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="60" y="145" fill="#8b949e" font-size="10" letter-spacing="1">PLAYER IO</text>

  <rect x="300" y="120" width="250" height="180" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="320" y="145" fill="#8b949e" font-size="10" letter-spacing="1">GAME LOOP</text>

  <rect x="300" y="340" width="250" height="140" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="320" y="365" fill="#8b949e" font-size="10" letter-spacing="1">RENDER + AUDIO</text>

  <rect x="590" y="200" width="250" height="200" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="610" y="225" fill="#8b949e" font-size="10" letter-spacing="1">BUILDS</text>

  <g transform="translate(70, 180)">
    <rect width="170" height="60" rx="6" fill="#1d2734" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="85" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Player Input</text>
    <text x="85" y="46" fill="#8b949e" font-size="11" text-anchor="middle">keyboard / touch</text>
  </g>
  <g transform="translate(70, 260)">
    <rect width="170" height="60" rx="6" fill="#1d2734" stroke="#FDC435" stroke-width="2"/>
    <text x="85" y="26" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Controller Map</text>
    <text x="85" y="46" fill="#FDC435" font-size="11" text-anchor="middle">repeat rates + DAS</text>
  </g>
  <g transform="translate(70, 340)">
    <rect width="170" height="60" rx="6" fill="#1d2734" stroke="#7ee787" stroke-width="1.5"/>
    <text x="85" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Telemetry</text>
    <text x="85" y="46" fill="#7ee787" font-size="11" text-anchor="middle">fps, input lag</text>
  </g>
  <g transform="translate(70, 420)">
    <rect width="170" height="60" rx="6" fill="#1d2734" stroke="#d2a8ff" stroke-width="1.5"/>
    <text x="85" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Save Data</text>
    <text x="85" y="46" fill="#d2a8ff" font-size="11" text-anchor="middle">scores + replay</text>
  </g>

  <g transform="translate(330, 170)">
    <rect width="190" height="60" rx="6" fill="#0d1117" stroke="#FDC435" stroke-width="2"/>
    <text x="95" y="26" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Tick Loop</text>
    <text x="95" y="46" fill="#FDC435" font-size="11" text-anchor="middle">gravity + speed ramp</text>
  </g>
  <g transform="translate(330, 240)">
    <rect width="190" height="60" rx="6" fill="#0d1117" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="95" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Collision</text>
    <text x="95" y="46" fill="#8b949e" font-size="11" text-anchor="middle">bag randomizer</text>
  </g>

  <g transform="translate(330, 370)">
    <rect width="190" height="50" rx="6" fill="#0d1117" stroke="#7ee787" stroke-width="1.5"/>
    <text x="95" y="24" fill="#c9d1d9" font-size="12" font-weight="700" text-anchor="middle">Renderer</text>
    <text x="95" y="42" fill="#7ee787" font-size="10" text-anchor="middle">canvas + shaders</text>
  </g>
  <g transform="translate(330, 430)">
    <rect width="190" height="50" rx="6" fill="#0d1117" stroke="#d2a8ff" stroke-width="1.5"/>
    <text x="95" y="24" fill="#c9d1d9" font-size="12" font-weight="700" text-anchor="middle">Audio</text>
    <text x="95" y="42" fill="#d2a8ff" font-size="10" text-anchor="middle">fx + music bus</text>
  </g>

  <g transform="translate(620, 230)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#FDC435" stroke-width="2"/>
    <text x="100" y="26" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Desktop Targets</text>
    <text x="100" y="46" fill="#FDC435" font-size="11" text-anchor="middle">win / mac / linux</text>
  </g>
  <g transform="translate(620, 300)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="100" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Mobile Targets</text>
    <text x="100" y="46" fill="#8b949e" font-size="11" text-anchor="middle">android / ios</text>
  </g>
  <g transform="translate(620, 370)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#7ee787" stroke-width="1.5"/>
    <text x="100" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Bundles</text>
    <text x="100" y="46" fill="#7ee787" font-size="11" text-anchor="middle">tauri, vite assets</text>
  </g>

  <path d="M 240 210 L 330 210" stroke="#FDC435" stroke-width="2" fill="none" marker-end="url(#tet-arrow)"/>
  <path d="M 240 290 L 330 290" stroke="#58a6ff" stroke-width="2" fill="none" marker-end="url(#tet-arrow)"/>
  <path d="M 240 370 L 330 370" stroke="#7ee787" stroke-width="1.8" fill="none" marker-end="url(#tet-arrow)"/>
  <path d="M 240 450 L 330 450" stroke="#d2a8ff" stroke-width="1.8" fill="none" marker-end="url(#tet-arrow)"/>

  <path d="M 425 300 L 425 370" stroke="#8b949e" stroke-width="2" fill="none" marker-end="url(#tet-arrow)"/>
  <path d="M 425 420 L 425 430" stroke="#8b949e" stroke-width="2" fill="none" marker-end="url(#tet-arrow)"/>

  <path d="M 520 200 L 620 200 L 620 260" stroke="#FDC435" stroke-width="2" fill="none" marker-end="url(#tet-arrow)"/>
  <path d="M 520 320 L 620 320" stroke="#58a6ff" stroke-width="2" fill="none" marker-end="url(#tet-arrow)"/>
  <path d="M 520 430 L 620 430" stroke="#7ee787" stroke-width="1.6" fill="none" marker-end="url(#tet-arrow)"/>
  <path d="M 720 430 L 720 470 L 430 470" stroke="#d2a8ff" stroke-width="1.6" stroke-dasharray="6,6" fill="none" marker-end="url(#tet-arrow)"/>
</svg>`

const portfolioSvg = `<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="background-color:#0d1117;font-family:'SF Mono','Segoe UI Mono','Roboto Mono',monospace;">
  <defs>
    <linearGradient id="port-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#121826"/>
      <stop offset="100%" stop-color="#0d1117"/>
    </linearGradient>
    <pattern id="port-grid" width="32" height="32" patternUnits="userSpaceOnUse">
      <path d="M 32 0 L 0 0 0 32" fill="none" stroke="#1f2633" stroke-width="1"/>
    </pattern>
    <marker id="port-arrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,8 L10,4 z" fill="#FDC435"/>
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="url(#port-bg)" />
  <rect width="100%" height="100%" fill="url(#port-grid)" opacity="0.25" />

  <text x="50" y="50" fill="#ffffff" font-size="20" font-weight="700" letter-spacing="2">PORTFOLIO DELIVERY</text>
  <text x="50" y="72" fill="#8b949e" font-size="12">Edge first, cached, reactive</text>

  <rect x="40" y="120" width="230" height="360" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="60" y="145" fill="#8b949e" font-size="10" letter-spacing="1">VISITOR FLOW</text>

  <rect x="310" y="120" width="240" height="180" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="330" y="145" fill="#8b949e" font-size="10" letter-spacing="1">EDGE + API</text>

  <rect x="310" y="340" width="240" height="140" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="330" y="365" fill="#8b949e" font-size="10" letter-spacing="1">UI LAYERS</text>

  <rect x="590" y="200" width="250" height="200" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="610" y="225" fill="#8b949e" font-size="10" letter-spacing="1">DATA + CACHE</text>

  <g transform="translate(70, 180)">
    <rect width="180" height="60" rx="6" fill="#21262d" stroke="#FDC435" stroke-width="2"/>
    <text x="90" y="26" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Visitor</text>
    <text x="90" y="46" fill="#FDC435" font-size="11" text-anchor="middle">arrives from search</text>
  </g>
  <g transform="translate(70, 260)">
    <rect width="180" height="60" rx="6" fill="#21262d" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="90" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Hero + CTA</text>
    <text x="90" y="46" fill="#8b949e" font-size="11" text-anchor="middle">scroll cues</text>
  </g>
  <g transform="translate(70, 340)">
    <rect width="180" height="60" rx="6" fill="#21262d" stroke="#7ee787" stroke-width="1.5"/>
    <text x="90" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Projects</text>
    <text x="90" y="46" fill="#7ee787" font-size="11" text-anchor="middle">carousel + deep dives</text>
  </g>
  <g transform="translate(70, 420)">
    <rect width="180" height="60" rx="6" fill="#21262d" stroke="#d2a8ff" stroke-width="1.5"/>
    <text x="90" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Contact</text>
    <text x="90" y="46" fill="#d2a8ff" font-size="11" text-anchor="middle">email + socials</text>
  </g>

  <g transform="translate(340, 170)">
    <rect width="180" height="60" rx="6" fill="#0d1117" stroke="#FDC435" stroke-width="2"/>
    <text x="90" y="26" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Edge (Vercel)</text>
    <text x="90" y="46" fill="#FDC435" font-size="11" text-anchor="middle">ISR + headers</text>
  </g>
  <g transform="translate(340, 240)">
    <rect width="180" height="60" rx="6" fill="#0d1117" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="90" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Next.js API</text>
    <text x="90" y="46" fill="#8b949e" font-size="11" text-anchor="middle">GitHub GraphQL</text>
  </g>

  <g transform="translate(340, 380)">
    <rect width="180" height="50" rx="6" fill="#0d1117" stroke="#7ee787" stroke-width="1.5"/>
    <text x="90" y="24" fill="#c9d1d9" font-size="12" font-weight="700" text-anchor="middle">Hero + Skills</text>
    <text x="90" y="42" fill="#7ee787" font-size="10" text-anchor="middle">animated reveals</text>
  </g>
  <g transform="translate(340, 440)">
    <rect width="180" height="40" rx="6" fill="#0d1117" stroke="#d2a8ff" stroke-width="1.5"/>
    <text x="90" y="26" fill="#c9d1d9" font-size="12" font-weight="700" text-anchor="middle">GitHub Activity</text>
  </g>

  <g transform="translate(620, 230)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="100" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">GitHub API</text>
    <text x="100" y="46" fill="#8b949e" font-size="11" text-anchor="middle">GraphQL queries</text>
  </g>
  <g transform="translate(620, 300)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#FDC435" stroke-width="2"/>
    <text x="100" y="26" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Hot Cache</text>
    <text x="100" y="46" fill="#FDC435" font-size="11" text-anchor="middle">precomputed tiles</text>
  </g>
  <g transform="translate(620, 370)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#7ee787" stroke-width="1.5"/>
    <text x="100" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Images + CDN</text>
    <text x="100" y="46" fill="#7ee787" font-size="11" text-anchor="middle">optimized assets</text>
  </g>

  <path d="M 250 210 L 340 210" stroke="#FDC435" stroke-width="2" fill="none" marker-end="url(#port-arrow)"/>
  <path d="M 250 290 L 340 290" stroke="#58a6ff" stroke-width="2" fill="none" marker-end="url(#port-arrow)"/>
  <path d="M 250 370 L 340 370" stroke="#7ee787" stroke-width="1.8" fill="none" marker-end="url(#port-arrow)"/>
  <path d="M 250 450 L 340 450" stroke="#d2a8ff" stroke-width="1.8" fill="none" marker-end="url(#port-arrow)"/>

  <path d="M 430 300 L 430 380" stroke="#8b949e" stroke-width="2" fill="none" marker-end="url(#port-arrow)"/>
  <path d="M 430 420 L 430 440" stroke="#8b949e" stroke-width="2" fill="none" marker-end="url(#port-arrow)"/>

  <path d="M 550 200 L 620 200 L 620 260" stroke="#58a6ff" stroke-width="2" fill="none" marker-end="url(#port-arrow)"/>
  <path d="M 550 320 L 620 320" stroke="#FDC435" stroke-width="2" fill="none" marker-end="url(#port-arrow)"/>
  <path d="M 550 430 L 620 430" stroke="#7ee787" stroke-width="1.6" fill="none" marker-end="url(#port-arrow)"/>
  <path d="M 720 430 L 720 470 L 450 470" stroke="#d2a8ff" stroke-width="1.6" stroke-dasharray="6,6" fill="none" marker-end="url(#port-arrow)"/>
</svg>`

const antonSvg = `<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="background-color:#0d1117;font-family:'SF Mono','Segoe UI Mono','Roboto Mono',monospace;">
  <defs>
    <linearGradient id="anton-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#141824"/>
      <stop offset="100%" stop-color="#0d1117"/>
    </linearGradient>
    <pattern id="anton-grid" width="34" height="34" patternUnits="userSpaceOnUse">
      <path d="M 34 0 L 0 0 0 34" fill="none" stroke="#1f2633" stroke-width="1"/>
    </pattern>
    <marker id="anton-arrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,8 L10,4 z" fill="#FDC435"/>
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="url(#anton-bg)" />
  <rect width="100%" height="100%" fill="url(#anton-grid)" opacity="0.28" />

  <text x="50" y="50" fill="#ffffff" font-size="20" font-weight="700" letter-spacing="2">ANTON TUI-LIB</text>
  <text x="50" y="72" fill="#8b949e" font-size="12">Immediate mode, deterministic frames</text>

  <rect x="40" y="120" width="220" height="360" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="60" y="145" fill="#8b949e" font-size="10" letter-spacing="1">AUTHORING</text>

  <rect x="300" y="120" width="250" height="180" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="320" y="145" fill="#8b949e" font-size="10" letter-spacing="1">LAYOUT + STATE</text>

  <rect x="300" y="340" width="250" height="140" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="320" y="365" fill="#8b949e" font-size="10" letter-spacing="1">RENDER PIPE</text>

  <rect x="590" y="200" width="250" height="200" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="610" y="225" fill="#8b949e" font-size="10" letter-spacing="1">OUTPUT</text>

  <g transform="translate(70, 180)">
    <rect width="180" height="60" rx="6" fill="#21262d" stroke="#FDC435" stroke-width="2"/>
    <text x="90" y="26" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Developer</text>
    <text x="90" y="46" fill="#FDC435" font-size="11" text-anchor="middle">write frame code</text>
  </g>
  <g transform="translate(70, 260)">
    <rect width="180" height="60" rx="6" fill="#21262d" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="90" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Widget DSL</text>
    <text x="90" y="46" fill="#8b949e" font-size="11" text-anchor="middle">buttons, tables</text>
  </g>
  <g transform="translate(70, 340)">
    <rect width="180" height="60" rx="6" fill="#21262d" stroke="#7ee787" stroke-width="1.5"/>
    <text x="90" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Keybinds</text>
    <text x="90" y="46" fill="#7ee787" font-size="11" text-anchor="middle">modal / global</text>
  </g>
  <g transform="translate(70, 420)">
    <rect width="180" height="60" rx="6" fill="#21262d" stroke="#d2a8ff" stroke-width="1.5"/>
    <text x="90" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Theme Tokens</text>
    <text x="90" y="46" fill="#d2a8ff" font-size="11" text-anchor="middle">.ath palette</text>
  </g>

  <g transform="translate(330, 170)">
    <rect width="190" height="60" rx="6" fill="#0d1117" stroke="#FDC435" stroke-width="2"/>
    <text x="95" y="26" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Immediate API</text>
    <text x="95" y="46" fill="#FDC435" font-size="11" text-anchor="middle">frame scoped state</text>
  </g>
  <g transform="translate(330, 240)">
    <rect width="190" height="60" rx="6" fill="#0d1117" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="95" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Layout Engine</text>
    <text x="95" y="46" fill="#8b949e" font-size="11" text-anchor="middle">stack / grid / split</text>
  </g>

  <g transform="translate(330, 380)">
    <rect width="190" height="50" rx="6" fill="#0d1117" stroke="#7ee787" stroke-width="1.5"/>
    <text x="95" y="24" fill="#c9d1d9" font-size="12" font-weight="700" text-anchor="middle">Renderer</text>
    <text x="95" y="42" fill="#7ee787" font-size="10" text-anchor="middle">double buffered</text>
  </g>
  <g transform="translate(330, 440)">
    <rect width="190" height="40" rx="6" fill="#0d1117" stroke="#d2a8ff" stroke-width="1.5"/>
    <text x="95" y="26" fill="#c9d1d9" font-size="12" font-weight="700" text-anchor="middle">Diff to Terminal</text>
  </g>

  <g transform="translate(620, 230)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="100" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Terminal</text>
    <text x="100" y="46" fill="#8b949e" font-size="11" text-anchor="middle">ansi safe paint</text>
  </g>
  <g transform="translate(620, 300)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#FDC435" stroke-width="2"/>
    <text x="100" y="26" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Focus Model</text>
    <text x="100" y="46" fill="#FDC435" font-size="11" text-anchor="middle">deterministic</text>
  </g>
  <g transform="translate(620, 370)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#7ee787" stroke-width="1.5"/>
    <text x="100" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Output Frame</text>
    <text x="100" y="46" fill="#7ee787" font-size="11" text-anchor="middle">no flicker</text>
  </g>

  <path d="M 250 210 L 330 210" stroke="#FDC435" stroke-width="2" fill="none" marker-end="url(#anton-arrow)"/>
  <path d="M 250 290 L 330 290" stroke="#58a6ff" stroke-width="2" fill="none" marker-end="url(#anton-arrow)"/>
  <path d="M 250 370 L 330 370" stroke="#7ee787" stroke-width="1.8" fill="none" marker-end="url(#anton-arrow)"/>
  <path d="M 250 450 L 330 450" stroke="#d2a8ff" stroke-width="1.8" fill="none" marker-end="url(#anton-arrow)"/>

  <path d="M 425 300 L 425 380" stroke="#8b949e" stroke-width="2" fill="none" marker-end="url(#anton-arrow)"/>
  <path d="M 425 420 L 425 440" stroke="#8b949e" stroke-width="2" fill="none" marker-end="url(#anton-arrow)"/>

  <path d="M 520 200 L 620 200 L 620 260" stroke="#58a6ff" stroke-width="2" fill="none" marker-end="url(#anton-arrow)"/>
  <path d="M 520 320 L 620 320" stroke="#FDC435" stroke-width="2" fill="none" marker-end="url(#anton-arrow)"/>
  <path d="M 520 430 L 620 430" stroke="#7ee787" stroke-width="1.6" fill="none" marker-end="url(#anton-arrow)"/>
  <path d="M 720 430 L 720 470 L 450 470" stroke="#d2a8ff" stroke-width="1.6" stroke-dasharray="6,6" fill="none" marker-end="url(#anton-arrow)"/>
</svg>`

const retentionSvg = `<svg viewBox="0 0 900 520" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%" style="background-color:#0d1117;font-family:'SF Mono','Segoe UI Mono','Roboto Mono',monospace;">
  <defs>
    <linearGradient id="ret-bg" x1="0%" y1="0%" x2="0%" y2="100%">
      <stop offset="0%" stop-color="#161b22"/>
      <stop offset="100%" stop-color="#0d1117"/>
    </linearGradient>
    <pattern id="ret-grid" width="36" height="36" patternUnits="userSpaceOnUse">
      <path d="M 36 0 L 0 0 0 36" fill="none" stroke="#1f2633" stroke-width="1"/>
    </pattern>
    <marker id="ret-arrow" markerWidth="12" markerHeight="8" refX="10" refY="4" orient="auto" markerUnits="strokeWidth">
      <path d="M0,0 L0,8 L10,4 z" fill="#FDC435"/>
    </marker>
  </defs>
  <rect width="100%" height="100%" fill="url(#ret-bg)" />
  <rect width="100%" height="100%" fill="url(#ret-grid)" opacity="0.3" />

  <text x="50" y="50" fill="#ffffff" font-size="20" font-weight="700" letter-spacing="2">RETENTION DESKTOP</text>
  <text x="50" y="72" fill="#8b949e" font-size="12">Bundled sidecar, offline model</text>

  <rect x="40" y="120" width="220" height="360" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="60" y="145" fill="#8b949e" font-size="10" letter-spacing="1">USER</text>

  <rect x="300" y="120" width="250" height="180" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="320" y="145" fill="#8b949e" font-size="10" letter-spacing="1">TAURI APP</text>

  <rect x="300" y="340" width="250" height="140" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="320" y="365" fill="#8b949e" font-size="10" letter-spacing="1">SIDECAR</text>

  <rect x="590" y="200" width="250" height="200" rx="10" fill="#161b22" stroke="#30363d" stroke-dasharray="6,4"/>
  <text x="610" y="225" fill="#8b949e" font-size="10" letter-spacing="1">MODEL + STORAGE</text>

  <g transform="translate(70, 180)">
    <rect width="180" height="60" rx="6" fill="#21262d" stroke="#FDC435" stroke-width="2"/>
    <text x="90" y="26" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Learner</text>
    <text x="90" y="46" fill="#FDC435" font-size="11" text-anchor="middle">start session</text>
  </g>
  <g transform="translate(70, 260)">
    <rect width="180" height="60" rx="6" fill="#21262d" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="90" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Prompts</text>
    <text x="90" y="46" fill="#8b949e" font-size="11" text-anchor="middle">cards + hints</text>
  </g>
  <g transform="translate(70, 340)">
    <rect width="180" height="60" rx="6" fill="#21262d" stroke="#7ee787" stroke-width="1.5"/>
    <text x="90" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Responses</text>
    <text x="90" y="46" fill="#7ee787" font-size="11" text-anchor="middle">inputs + ratings</text>
  </g>
  <g transform="translate(70, 420)">
    <rect width="180" height="60" rx="6" fill="#21262d" stroke="#d2a8ff" stroke-width="1.5"/>
    <text x="90" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Feedback</text>
    <text x="90" y="46" fill="#d2a8ff" font-size="11" text-anchor="middle">next steps</text>
  </g>

  <g transform="translate(330, 170)">
    <rect width="190" height="60" rx="6" fill="#0d1117" stroke="#FDC435" stroke-width="2"/>
    <text x="95" y="26" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">React UI</text>
    <text x="95" y="46" fill="#FDC435" font-size="11" text-anchor="middle">Zustand state</text>
  </g>
  <g transform="translate(330, 240)">
    <rect width="190" height="60" rx="6" fill="#0d1117" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="95" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Commands</text>
    <text x="95" y="46" fill="#8b949e" font-size="11" text-anchor="middle">invoke sidecar</text>
  </g>

  <g transform="translate(330, 380)">
    <rect width="190" height="50" rx="6" fill="#0d1117" stroke="#7ee787" stroke-width="1.5"/>
    <text x="95" y="24" fill="#c9d1d9" font-size="12" font-weight="700" text-anchor="middle">FastAPI</text>
    <text x="95" y="42" fill="#7ee787" font-size="10" text-anchor="middle">/score /decks</text>
  </g>
  <g transform="translate(330, 440)">
    <rect width="190" height="40" rx="6" fill="#0d1117" stroke="#d2a8ff" stroke-width="1.5"/>
    <text x="95" y="26" fill="#c9d1d9" font-size="12" font-weight="700" text-anchor="middle">PyInstaller binary</text>
  </g>

  <g transform="translate(620, 230)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#58a6ff" stroke-width="1.5"/>
    <text x="100" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Model Bundle</text>
    <text x="100" y="46" fill="#8b949e" font-size="11" text-anchor="middle">sentence-transformers</text>
  </g>
  <g transform="translate(620, 300)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#FDC435" stroke-width="2"/>
    <text x="100" y="26" fill="#ffffff" font-size="13" font-weight="700" text-anchor="middle">Local Storage</text>
    <text x="100" y="46" fill="#FDC435" font-size="11" text-anchor="middle">progress cache</text>
  </g>
  <g transform="translate(620, 370)">
    <rect width="200" height="60" rx="6" fill="#21262d" stroke="#7ee787" stroke-width="1.5"/>
    <text x="100" y="26" fill="#c9d1d9" font-size="13" font-weight="700" text-anchor="middle">Offline Ready</text>
    <text x="100" y="46" fill="#7ee787" font-size="11" text-anchor="middle">single installer</text>
  </g>

  <path d="M 250 210 L 330 210" stroke="#FDC435" stroke-width="2" fill="none" marker-end="url(#ret-arrow)"/>
  <path d="M 250 290 L 330 290" stroke="#58a6ff" stroke-width="2" fill="none" marker-end="url(#ret-arrow)"/>
  <path d="M 250 370 L 330 370" stroke="#7ee787" stroke-width="1.8" fill="none" marker-end="url(#ret-arrow)"/>
  <path d="M 250 450 L 330 450" stroke="#d2a8ff" stroke-width="1.8" fill="none" marker-end="url(#ret-arrow)"/>

  <path d="M 425 300 L 425 380" stroke="#8b949e" stroke-width="2" fill="none" marker-end="url(#ret-arrow)"/>
  <path d="M 425 420 L 425 440" stroke="#8b949e" stroke-width="2" fill="none" marker-end="url(#ret-arrow)"/>

  <path d="M 520 200 L 620 200 L 620 260" stroke="#58a6ff" stroke-width="2" fill="none" marker-end="url(#ret-arrow)"/>
  <path d="M 520 320 L 620 320" stroke="#FDC435" stroke-width="2" fill="none" marker-end="url(#ret-arrow)"/>
  <path d="M 520 430 L 620 430" stroke="#7ee787" stroke-width="1.6" fill="none" marker-end="url(#ret-arrow)"/>
  <path d="M 720 430 L 720 470 L 450 470" stroke="#d2a8ff" stroke-width="1.6" stroke-dasharray="6,6" fill="none" marker-end="url(#ret-arrow)"/>
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

