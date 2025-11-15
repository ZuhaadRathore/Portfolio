export interface InfrastructureDiagram {
  title: string
  chart: string
}

export interface ClickableSection {
  id: string // Must match node ID in the main diagram
  title: string
  diagrams: InfrastructureDiagram[]
}

export interface ProjectInfrastructure {
  projectId: number
  mainDiagram: {
    title: string
    chart: string
  }
  clickableSections: ClickableSection[]
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

    style Frontend fill:#61dafb,color:#000,stroke:#000,stroke-width:3px,cursor:pointer
    style Backend fill:#ce422b,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style CLI fill:#FDC435,color:#000,stroke:#000,stroke-width:3px,cursor:pointer
    style PostgreSQL fill:#336791,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style Redis fill:#dc382d,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style Docker fill:#2496ed,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer`,
    },
    clickableSections: [
      {
        id: 'Frontend',
        title: 'Frontend Architecture',
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
        id: 'Backend',
        title: 'Backend Architecture',
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
        id: 'CLI',
        title: 'Development Workflow',
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
        BuildProd[Production Build<br/>cargo tauri build]
        Bundle[Platform Bundles<br/>.exe/.dmg/.AppImage]
    end

    subgraph "Docker"
        Container[Docker Container<br/>PostgreSQL + Redis]
    end

    Code --> DevServer
    DevServer --> Lint
    Lint --> Tests
    Tests --> BuildProd
    BuildProd --> Bundle
    Code --> Container

    style BuildProd fill:#ce422b,color:#fff,stroke:#000,stroke-width:3px
    style Container fill:#2496ed,color:#fff,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'PostgreSQL',
        title: 'PostgreSQL Database',
        diagrams: [
          {
            title: 'Database Schema & Connections',
            chart: `graph TB
    subgraph "Application Layer"
        Backend[Rust Backend]
        SQLx[SQLx ORM<br/>Type-Safe Queries]
    end

    subgraph "Database"
        PostgreSQL[(PostgreSQL<br/>Relational Database)]
        Tables[Tables<br/>Users, Sessions, Data]
        Indexes[Indexes<br/>Performance Optimization]
        Constraints[Constraints<br/>Data Integrity]
    end

    subgraph "Migration System"
        Migrations[SQL Migrations<br/>Version Control]
        Schema[Schema Evolution<br/>Automated Updates]
    end

    Backend --> SQLx
    SQLx --> PostgreSQL
    PostgreSQL --> Tables
    PostgreSQL --> Indexes
    PostgreSQL --> Constraints
    Migrations --> Schema
    Schema --> PostgreSQL

    style PostgreSQL fill:#336791,color:#fff,stroke:#000,stroke-width:3px
    style SQLx fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'Redis',
        title: 'Redis Cache Layer',
        diagrams: [
          {
            title: 'Caching Architecture',
            chart: `graph LR
    subgraph "Application"
        Backend[Rust Backend]
        CacheLogic[Cache Logic<br/>Get/Set/Delete]
    end

    subgraph "Redis Server"
        Redis[(Redis<br/>In-Memory Cache)]
        Sessions[Session Data<br/>JWT Tokens]
        TempData[Temporary Data<br/>Rate Limits]
        Cache[Cached Queries<br/>Performance]
    end

    Backend --> CacheLogic
    CacheLogic --> Redis
    Redis --> Sessions
    Redis --> TempData
    Redis --> Cache

    style Redis fill:#dc382d,color:#fff,stroke:#000,stroke-width:3px
    style CacheLogic fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'Docker',
        title: 'Docker Deployment',
        diagrams: [
          {
            title: 'Container Architecture',
            chart: `graph TB
    subgraph "Docker Compose"
        Compose[docker-compose.yml<br/>Service Orchestration]
    end

    subgraph "Containers"
        AppContainer[App Container<br/>Tauri Application]
        DBContainer[PostgreSQL Container<br/>Database Server]
        RedisContainer[Redis Container<br/>Cache Server]
    end

    subgraph "Volumes"
        DBVolume[DB Volume<br/>Persistent Data]
        RedisVolume[Redis Volume<br/>Cache Persistence]
    end

    subgraph "Network"
        AppNetwork[Internal Network<br/>Container Communication]
    end

    Compose --> AppContainer
    Compose --> DBContainer
    Compose --> RedisContainer

    DBContainer --> DBVolume
    RedisContainer --> RedisVolume

    AppContainer --> AppNetwork
    DBContainer --> AppNetwork
    RedisContainer --> AppNetwork

    style Compose fill:#2496ed,color:#fff,stroke:#000,stroke-width:3px
    style AppContainer fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
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

    style Frontend fill:#61dafb,color:#000,stroke:#000,stroke-width:3px,cursor:pointer
    style Backend fill:#ce422b,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style GameEngine fill:#FDC435,color:#000,stroke:#000,stroke-width:3px,cursor:pointer
    style Mobile fill:#3ddc84,color:#000,stroke:#000,stroke-width:3px,cursor:pointer
    style Keyboard fill:#0078d4,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style Touch fill:#3ddc84,color:#000,stroke:#000,stroke-width:3px,cursor:pointer`,
    },
    clickableSections: [
      {
        id: 'Frontend',
        title: 'React Game UI',
        diagrams: [
          {
            title: 'UI Components',
            chart: `graph TB
    subgraph "Game UI"
        GameCanvas[Game Canvas<br/>Main Play Area]
        Score[Score Display<br/>Points & Level]
        NextPiece[Next Piece Preview<br/>Upcoming Tetromino]
        Controls[Control Panel<br/>Pause/Restart]
    end

    subgraph "React Components"
        App[App Component]
        GameBoard[GameBoard Component]
        HUD[HUD Component]
        Menu[Menu Component]
    end

    App --> GameBoard
    App --> HUD
    App --> Menu

    GameBoard --> GameCanvas
    HUD --> Score
    HUD --> NextPiece
    Menu --> Controls

    style App fill:#61dafb,color:#000,stroke:#000,stroke-width:3px
    style GameCanvas fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'Backend',
        title: 'Tauri Backend',
        diagrams: [
          {
            title: 'System Integration',
            chart: `graph LR
    subgraph "Rust Backend"
        Main[Main Process]
        Platform[Platform APIs<br/>Window/File System]
        Commands[Tauri Commands<br/>Game Controls]
    end

    subgraph "Frontend"
        React[React UI]
        GameLogic[Game Logic<br/>JavaScript]
    end

    React <--> Commands
    Commands --> Main
    Main --> Platform

    style Main fill:#ce422b,color:#fff,stroke:#000,stroke-width:3px
    style Commands fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'Mobile',
        title: 'Mobile Platform Support',
        diagrams: [
          {
            title: 'Mobile Build Configuration',
            chart: `graph TB
    subgraph "Android"
        AndroidSDK[Android SDK<br/>NDK + Build Tools]
        APK[APK Build<br/>Android Package]
        AAB[AAB Build<br/>App Bundle]
    end

    subgraph "iOS"
        XcodeSDK[Xcode SDK<br/>iOS Toolchain]
        IPA[IPA Build<br/>iOS Package]
    end

    subgraph "Mobile Features"
        TouchInput[Touch Input<br/>Gesture Support]
        Orientation[Screen Orientation<br/>Portrait/Landscape]
        Performance[Performance<br/>60 FPS Native]
    end

    AndroidSDK --> APK
    AndroidSDK --> AAB
    XcodeSDK --> IPA

    APK --> TouchInput
    IPA --> TouchInput
    TouchInput --> Orientation
    Orientation --> Performance

    style APK fill:#3ddc84,color:#000,stroke:#000,stroke-width:3px
    style IPA fill:#147efb,color:#fff,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'GameEngine',
        title: 'Game Engine Architecture',
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
        id: 'Keyboard',
        title: 'Desktop Input Controls',
        diagrams: [
          {
            title: 'Keyboard Input Mapping',
            chart: `graph LR
    subgraph "Keyboard Keys"
        Left[Arrow Left]
        Right[Arrow Right]
        Down[Arrow Down]
        Up[Arrow Up]
        Space[Space Bar]
        P[P Key]
    end

    subgraph "Game Actions"
        MoveLeft[Move Left]
        MoveRight[Move Right]
        SoftDrop[Soft Drop]
        Rotate[Rotate]
        HardDrop[Hard Drop]
        Pause[Pause Game]
    end

    Left --> MoveLeft
    Right --> MoveRight
    Down --> SoftDrop
    Up --> Rotate
    Space --> HardDrop
    P --> Pause

    style MoveLeft fill:#FDC435,color:#000,stroke:#000,stroke-width:3px
    style Rotate fill:#FDC435,color:#000,stroke:#000,stroke-width:3px
    style HardDrop fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'Touch',
        title: 'Mobile Touch Controls',
        diagrams: [
          {
            title: 'Touch & Gesture Input',
            chart: `graph LR
    subgraph "Touch Gestures"
        SwipeL[Swipe Left]
        SwipeR[Swipe Right]
        SwipeD[Swipe Down]
        Tap[Tap]
        DoubleTap[Double Tap]
    end

    subgraph "Game Actions"
        MoveLeft[Move Left]
        MoveRight[Move Right]
        SoftDrop[Soft Drop]
        Rotate[Rotate]
        HardDrop[Hard Drop]
    end

    SwipeL --> MoveLeft
    SwipeR --> MoveRight
    SwipeD --> SoftDrop
    Tap --> Rotate
    DoubleTap --> HardDrop

    style MoveLeft fill:#3ddc84,color:#000,stroke:#000,stroke-width:3px
    style Rotate fill:#3ddc84,color:#000,stroke:#000,stroke-width:3px
    style HardDrop fill:#3ddc84,color:#000,stroke:#000,stroke-width:3px`,
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

    style NextJS fill:#0070f3,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style Vercel fill:#000,color:#fff,stroke:#FDC435,stroke-width:3px,cursor:pointer
    style GitHub fill:#333,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer`,
    },
    clickableSections: [
      {
        id: 'NextJS',
        title: 'Next.js Application Architecture',
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
        GitHubComp[GitHub Activity]
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
    Layout --> GitHubComp
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
        id: 'Vercel',
        title: 'Deployment Infrastructure',
        diagrams: [
          {
            title: 'CI/CD Pipeline',
            chart: `graph TB
    Push[Push to main] --> Actions[GitHub Actions]

    Actions --> Checkout[Checkout Code]
    Checkout --> Setup[Setup Node.js]
    Setup --> Cache[Restore Cache]
    Cache --> Install[npm ci]
    Install --> BuildStep[next build]
    BuildStep --> Upload[Upload Artifact]

    Upload --> VercelDeploy[Deploy to Vercel]
    Upload --> GHPages[Deploy to GitHub Pages]

    style Actions fill:#2088ff,color:#fff,stroke:#000,stroke-width:3px
    style VercelDeploy fill:#000,color:#fff,stroke:#FDC435,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'GitHub',
        title: 'GitHub API Integration',
        diagrams: [
          {
            title: 'Contribution Data Flow',
            chart: `graph LR
    subgraph "Application"
        Component[GitHub Activity Component]
        APIRoute[API Route<br/>/api/github/contributions]
    end

    subgraph "GitHub"
        GraphQL[GraphQL API]
        Account1[ZuhaadRathore]
        Account2[Archontas123]
    end

    Component --> APIRoute
    APIRoute --> GraphQL
    GraphQL --> Account1
    GraphQL --> Account2

    Account1 --> Component
    Account2 --> Component

    style GraphQL fill:#333,color:#fff,stroke:#000,stroke-width:3px
    style APIRoute fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
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
