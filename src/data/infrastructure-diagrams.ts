export interface InfrastructureDiagram {
  title: string
  chart: string
}

export interface ExpandableSection {
  id: string
  title: string
  buttonLabel: string
  description?: string
  diagrams: InfrastructureDiagram[]
}

export interface ProjectInfrastructure {
  projectId: number
  mainDiagram: InfrastructureDiagram
  expandableSections: ExpandableSection[]
}

export const projectInfrastructure: ProjectInfrastructure[] = [
  // ez-tauri Infrastructure
  {
    projectId: 1,
    mainDiagram: {
      title: 'System Architecture Overview',
      chart: `graph TB
    subgraph "Desktop Environment"
        User[User Desktop<br/>Windows/macOS/Linux]
    end

    subgraph "Tauri Application"
        Frontend[React Frontend<br/>TypeScript + Vite]
        Backend[Rust Backend<br/>Tauri Core]
    end

    subgraph "Data Layer"
        PostgreSQL[(PostgreSQL<br/>Database)]
        Redis[(Redis<br/>Cache)]
    end

    subgraph "Development"
        CLI[ez-tauri-cli<br/>Scaffolding]
        Docker[Docker<br/>Deployment]
    end

    User --> Frontend
    Frontend <--> Backend
    Backend --> PostgreSQL
    Backend --> Redis
    CLI -.Generates.-> Frontend
    CLI -.Generates.-> Backend
    Docker -.Contains.-> PostgreSQL
    Docker -.Contains.-> Redis

    style Frontend fill:#61dafb,color:#000,stroke:#000,stroke-width:3px
    style Backend fill:#ce422b,color:#fff,stroke:#000,stroke-width:3px
    style PostgreSQL fill:#336791,color:#fff,stroke:#000,stroke-width:3px
    style Redis fill:#dc382d,color:#fff,stroke:#000,stroke-width:3px
    style CLI fill:#FDC435,color:#000,stroke:#000,stroke-width:3px
    style Docker fill:#2496ed,color:#fff,stroke:#000,stroke-width:3px

    click Frontend "javascript:alert('frontend')" "Click to explore Frontend Architecture"
    click Backend "javascript:alert('backend')" "Click to explore Backend Architecture"
    click CLI "javascript:alert('development')" "Click to explore Development Workflow"`,
    },
    expandableSections: [
      {
        id: 'frontend',
        title: 'Frontend Architecture',
        buttonLabel: 'Frontend',
        description: 'Explore the React frontend architecture, components, and state management',
        diagrams: [
          {
            title: 'Component Structure',
            chart: `graph TB
    subgraph "React Application"
        App[App Component<br/>Main Entry]
        Router[React Router<br/>Navigation]
        Store[Zustand Store<br/>State Management]
    end

    subgraph "UI Components"
        Auth[Auth Components<br/>Login/Register]
        Dashboard[Dashboard<br/>Main Interface]
        Settings[Settings<br/>Configuration]
    end

    subgraph "API Layer"
        Commands[Tauri Commands<br/>Backend Invocation]
        Events[Tauri Events<br/>Backend Listeners]
    end

    subgraph "Styling"
        Tailwind[TailwindCSS<br/>Utility Styles]
        Components[Component Styles<br/>Custom CSS]
    end

    App --> Router
    App --> Store
    Router --> Auth
    Router --> Dashboard
    Router --> Settings

    Auth --> Commands
    Dashboard --> Commands
    Settings --> Commands

    Commands --> Events

    App --> Tailwind
    Dashboard --> Components

    style App fill:#61dafb,color:#000,stroke:#000,stroke-width:3px
    style Store fill:#443e38,color:#fff,stroke:#000,stroke-width:3px
    style Tailwind fill:#06b6d4,color:#fff,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'Build System',
            chart: `graph LR
    subgraph "Source"
        TS[TypeScript Files]
        TSX[React Components]
        CSS[Styles]
    end

    subgraph "Build Tools"
        Vite[Vite<br/>Build Tool]
        TypeScript[TypeScript Compiler]
        ESLint[ESLint<br/>Linter]
    end

    subgraph "Output"
        Bundle[JavaScript Bundle]
        Assets[Static Assets]
    end

    TS --> TypeScript
    TSX --> TypeScript
    CSS --> Vite
    TypeScript --> Vite
    Vite --> ESLint
    ESLint --> Bundle
    Vite --> Assets

    style Vite fill:#646cff,color:#fff,stroke:#000,stroke-width:3px
    style TypeScript fill:#3178c6,color:#fff,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'backend',
        title: 'Backend Architecture',
        buttonLabel: 'Backend',
        description: 'Deep dive into the Rust backend, database connections, and authentication',
        diagrams: [
          {
            title: 'Core Backend Services',
            chart: `graph TB
    subgraph "Tauri Core"
        Main[Main Process<br/>Rust Entry Point]
        Commands[Command Handlers<br/>IPC Endpoints]
        State[Application State<br/>Shared State]
    end

    subgraph "Database Layer"
        SQLx[SQLx Pool<br/>Connection Pool]
        Migrations[Migrations<br/>Schema Management]
        Models[Data Models<br/>Rust Structs]
    end

    subgraph "Cache Layer"
        RedisClient[Redis Client<br/>Connection Manager]
        CacheOps[Cache Operations<br/>Get/Set/Delete]
    end

    Main --> Commands
    Main --> State
    Commands --> SQLx
    Commands --> RedisClient

    SQLx --> Models
    Migrations --> SQLx

    RedisClient --> CacheOps

    style Main fill:#ce422b,color:#fff,stroke:#000,stroke-width:3px
    style SQLx fill:#336791,color:#fff,stroke:#000,stroke-width:3px
    style RedisClient fill:#dc382d,color:#fff,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'Authentication System',
            chart: `graph LR
    subgraph "Auth Flow"
        Login[Login Request]
        Validate[Validate Credentials]
        Hash[Argon2 Hashing]
        Session[Create Session]
        Token[JWT Token]
    end

    subgraph "Storage"
        DB[(PostgreSQL<br/>User Data)]
        Cache[(Redis<br/>Sessions)]
    end

    Login --> Validate
    Validate --> DB
    Validate --> Hash
    Hash --> Session
    Session --> Token
    Session --> Cache

    style Hash fill:#28a745,color:#fff,stroke:#000,stroke-width:3px
    style Token fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'development',
        title: 'Development Workflow',
        buttonLabel: 'Development',
        description: 'See the complete development workflow from CLI scaffolding to deployment',
        diagrams: [
          {
            title: 'CLI Scaffolding',
            chart: `graph LR
    Dev[Developer] --> CLI[ez-tauri-cli]
    CLI --> Init[Initialize Project]
    Init --> Template[Choose Template]
    Template --> Generate[Generate Files]

    subgraph "Generated Structure"
        SrcFE[src/ Frontend]
        SrcBE[src-tauri/ Backend]
        Config[Configuration Files]
    end

    Generate --> SrcFE
    Generate --> SrcBE
    Generate --> Config

    style CLI fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'Build & Deploy Pipeline',
            chart: `graph TB
    subgraph "Development"
        Code[Write Code]
        DevServer[Dev Server<br/>Vite + Tauri]
    end

    subgraph "Quality Assurance"
        Lint[Linting<br/>ESLint + Clippy]
        Tests[Tests<br/>cargo test + vitest]
    end

    subgraph "Production"
        Build[Production Build<br/>cargo tauri build]
        Bundle[Platform Bundles<br/>.exe/.dmg/.AppImage]
    end

    subgraph "Docker"
        Container[Docker Container<br/>PostgreSQL + Redis]
    end

    Code --> DevServer
    DevServer --> Lint
    Lint --> Tests
    Tests --> Build
    Build --> Bundle
    Code --> Container

    style Build fill:#ce422b,color:#fff,stroke:#000,stroke-width:3px
    style Container fill:#2496ed,color:#fff,stroke:#000,stroke-width:3px`,
          },
        ],
      },
    ],
  },

  // Tetris Infrastructure
  {
    projectId: 2,
    mainDiagram: {
      title: 'System Architecture Overview',
      chart: `graph TB
    subgraph "Platforms"
        Desktop[Desktop<br/>Win/Mac/Linux]
        Mobile[Mobile<br/>Android/iOS]
    end

    subgraph "Application"
        Frontend[React Game UI<br/>TypeScript]
        Backend[Rust Backend<br/>Tauri]
        GameEngine[Game Engine<br/>Physics + Logic]
    end

    subgraph "Input"
        Keyboard[Keyboard Controls]
        Touch[Touch Controls]
    end

    Desktop --> Frontend
    Mobile --> Frontend
    Desktop --> Keyboard
    Mobile --> Touch

    Frontend <--> Backend
    Frontend --> GameEngine
    Keyboard --> GameEngine
    Touch --> GameEngine

    style Frontend fill:#61dafb,color:#000,stroke:#000,stroke-width:3px
    style Backend fill:#ce422b,color:#fff,stroke:#000,stroke-width:3px
    style GameEngine fill:#FDC435,color:#000,stroke:#000,stroke-width:3px
    style Mobile fill:#3ddc84,color:#000,stroke:#000,stroke-width:3px`,
    },
    expandableSections: [
      {
        id: 'game-engine',
        title: 'Game Engine',
        buttonLabel: 'Game Engine',
        description: 'Explore the game logic, physics, and rendering system',
        diagrams: [
          {
            title: 'Game State Machine',
            chart: `graph LR
    Start[Start Game] --> Playing[Playing State]
    Playing --> Pause[Paused State]
    Pause --> Playing
    Playing --> GameOver[Game Over State]
    GameOver --> Start

    subgraph "Playing State"
        Spawn[Spawn Piece]
        Move[Move Piece]
        Rotate[Rotate Piece]
        Lock[Lock Piece]
        Clear[Clear Lines]
    end

    Playing --> Spawn
    Spawn --> Move
    Move --> Rotate
    Rotate --> Lock
    Lock --> Clear
    Clear --> Spawn

    style Playing fill:#28a745,color:#fff,stroke:#000,stroke-width:3px
    style GameOver fill:#dc3545,color:#fff,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'Rendering Pipeline',
            chart: `graph TB
    subgraph "Game State"
        Board[Game Board<br/>10x20 Grid]
        Piece[Active Tetromino]
        Next[Next Piece]
        Score[Score Data]
    end

    subgraph "Rendering"
        Canvas[HTML5 Canvas]
        DrawBoard[Draw Board]
        DrawPiece[Draw Active Piece]
        DrawGhost[Draw Ghost Piece]
        DrawUI[Draw UI Elements]
    end

    Board --> DrawBoard
    Piece --> DrawPiece
    Piece --> DrawGhost
    Next --> DrawUI
    Score --> DrawUI

    DrawBoard --> Canvas
    DrawPiece --> Canvas
    DrawGhost --> Canvas
    DrawUI --> Canvas

    style Canvas fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'cross-platform',
        title: 'Cross-Platform Build',
        buttonLabel: 'Build System',
        description: 'See how the game builds for 6 different platforms',
        diagrams: [
          {
            title: 'Platform Build Matrix',
            chart: `graph TB
    Source[Source Code<br/>React + Rust]

    subgraph "Desktop Targets"
        Win[Windows<br/>.exe + .msi]
        Mac[macOS<br/>.app + .dmg]
        Lin[Linux<br/>.AppImage + .deb]
    end

    subgraph "Mobile Targets"
        And[Android<br/>.apk + .aab]
        iOS_[iOS<br/>.ipa]
    end

    subgraph "Build Tools"
        Tauri[Tauri CLI]
        Cargo[Cargo]
        Vite[Vite]
    end

    Source --> Tauri
    Tauri --> Cargo
    Tauri --> Vite

    Tauri --> Win
    Tauri --> Mac
    Tauri --> Lin
    Tauri --> And
    Tauri --> iOS_

    style Tauri fill:#FFC131,color:#000,stroke:#000,stroke-width:3px
    style And fill:#3ddc84,color:#000,stroke:#000,stroke-width:3px
    style iOS_ fill:#147efb,color:#fff,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'input-system',
        title: 'Input Control System',
        buttonLabel: 'Controls',
        description: 'Unified input handling for keyboard and touch',
        diagrams: [
          {
            title: 'Input Mapping',
            chart: `graph LR
    subgraph "Desktop"
        Left[Arrow Left]
        Right[Arrow Right]
        Down[Arrow Down]
        Up[Arrow Up]
        Space[Space Bar]
    end

    subgraph "Mobile"
        SwipeL[Swipe Left]
        SwipeR[Swipe Right]
        SwipeD[Swipe Down]
        Tap[Tap]
        DoubleTap[Double Tap]
    end

    subgraph "Actions"
        MoveLeft[Move Left]
        MoveRight[Move Right]
        SoftDrop[Soft Drop]
        Rotate[Rotate]
        HardDrop[Hard Drop]
    end

    Left --> MoveLeft
    SwipeL --> MoveLeft

    Right --> MoveRight
    SwipeR --> MoveRight

    Down --> SoftDrop
    SwipeD --> SoftDrop

    Up --> Rotate
    Tap --> Rotate

    Space --> HardDrop
    DoubleTap --> HardDrop

    style MoveLeft fill:#FDC435,color:#000,stroke:#000,stroke-width:3px
    style Rotate fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
    ],
  },

  // Portfolio Website Infrastructure
  {
    projectId: 3,
    mainDiagram: {
      title: 'System Architecture Overview',
      chart: `graph TB
    subgraph "Users"
        Browser[Web Browser]
    end

    subgraph "Hosting"
        Vercel[Vercel CDN]
    end

    subgraph "Application"
        NextJS[Next.js App<br/>React + TypeScript]
        API[API Routes]
    end

    subgraph "External Services"
        GitHub[GitHub API<br/>Contributions]
        Fonts[Google Fonts]
    end

    Browser --> Vercel
    Vercel --> NextJS
    NextJS --> API
    API --> GitHub
    NextJS --> Fonts

    style NextJS fill:#0070f3,color:#fff,stroke:#000,stroke-width:3px
    style Vercel fill:#000,color:#fff,stroke:#FDC435,stroke-width:3px
    style GitHub fill:#333,color:#fff,stroke:#000,stroke-width:3px`,
    },
    expandableSections: [
      {
        id: 'frontend',
        title: 'Frontend Architecture',
        buttonLabel: 'Frontend',
        description: 'Component structure and styling system',
        diagrams: [
          {
            title: 'Page Structure',
            chart: `graph TB
    Layout[Root Layout<br/>Metadata + Themes]

    subgraph "Home Page"
        Header[Header<br/>Nav + Theme Toggle]
        Hero[Hero Section]
        About[About Section]
        Skills[Skills Section]
        Experience[Experience Section]
        Projects[Projects Section]
        GitHub[GitHub Activity]
        Footer[Footer]
    end

    subgraph "Project Pages"
        ProjectDetail[Project Detail Page<br/>Dynamic Routes]
    end

    Layout --> Header
    Layout --> Hero
    Layout --> About
    Layout --> Skills
    Layout --> Experience
    Layout --> Projects
    Layout --> GitHub
    Layout --> Footer
    Layout --> ProjectDetail

    style Layout fill:#0070f3,color:#fff,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'Styling System',
            chart: `graph LR
    subgraph "Theme"
        Light[Light Mode]
        Dark[Dark Mode]
        Toggle[Theme Toggle]
    end

    subgraph "Styling"
        Tailwind[Tailwind CSS<br/>Utility Classes]
        Custom[Custom Styles<br/>globals.css]
    end

    subgraph "Design Tokens"
        Colors[Color Palette<br/>Yellow Primary]
        Fonts[Typography<br/>Bebas + Roboto Mono]
        Shadows[Brutal Shadows]
    end

    Toggle --> Light
    Toggle --> Dark

    Light --> Tailwind
    Dark --> Tailwind

    Tailwind --> Colors
    Tailwind --> Fonts
    Tailwind --> Shadows

    Custom --> Tailwind

    style Tailwind fill:#06b6d4,color:#fff,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'deployment',
        title: 'Build & Deployment',
        buttonLabel: 'Deployment',
        description: 'CI/CD pipeline and hosting infrastructure',
        diagrams: [
          {
            title: 'GitHub Actions Pipeline',
            chart: `graph TB
    Push[Push to main] --> Actions[GitHub Actions]

    Actions --> Checkout[Checkout Code]
    Checkout --> Setup[Setup Node.js]
    Setup --> Cache[Restore Cache]
    Cache --> Install[npm ci]
    Install --> Build[next build]
    Build --> Upload[Upload Artifact]

    Upload --> Vercel[Deploy to Vercel]
    Upload --> GHPages[Deploy to GitHub Pages]

    style Actions fill:#2088ff,color:#fff,stroke:#000,stroke-width:3px
    style Vercel fill:#000,color:#fff,stroke:#FDC435,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'integrations',
        title: 'External Integrations',
        buttonLabel: 'Integrations',
        description: 'GitHub API and external services',
        diagrams: [
          {
            title: 'GitHub Integration',
            chart: `graph LR
    subgraph "Application"
        Component[GitHub Activity Component]
        API[API Route<br/>/api/github/contributions]
    end

    subgraph "GitHub"
        GraphQL[GraphQL API]
        Account1[ZuhaadRathore]
        Account2[Archontas123]
    end

    Component --> API
    API --> GraphQL
    GraphQL --> Account1
    GraphQL --> Account2

    Account1 --> Component
    Account2 --> Component

    style GraphQL fill:#333,color:#fff,stroke:#000,stroke-width:3px`,
          },
        ],
      },
    ],
  },
]

// Helper function to get infrastructure for a project
export function getProjectInfrastructure(projectId: number): ProjectInfrastructure | undefined {
  return projectInfrastructure.find((p) => p.projectId === projectId)
}
