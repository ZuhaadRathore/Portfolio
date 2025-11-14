export interface InfrastructureDiagram {
  title: string
  chart: string
}

export interface ProjectInfrastructure {
  projectId: number
  diagrams: InfrastructureDiagram[]
}

export const projectInfrastructure: ProjectInfrastructure[] = [
  // ez-tauri Infrastructure
  {
    projectId: 1,
    diagrams: [
      {
        title: 'System Architecture Overview',
        chart: `graph TB
    subgraph "Desktop Environment"
        User[User Desktop<br/>Windows/macOS/Linux]
    end

    subgraph "Tauri Application Layer"
        Frontend[React Frontend<br/>TypeScript + Vite]
        Backend[Rust Backend<br/>Tauri Core]
        IPC[IPC Bridge<br/>Command System]
    end

    subgraph "Database & Caching"
        PostgreSQL[(PostgreSQL<br/>SQLx ORM)]
        Redis[(Redis<br/>Caching Layer)]
    end

    subgraph "Core Features"
        Auth[Authentication<br/>Argon2 Hashing]
        Logger[Logging & Tracing<br/>System Monitoring]
        RateLimit[Rate Limiting<br/>Request Control]
    end

    subgraph "Development Tools"
        CLI[ez-tauri-cli<br/>Project Scaffolding]
        Docker[Docker<br/>Containerization]
        Tests[Testing Suite<br/>Automated Tests]
    end

    User --> Frontend
    Frontend <--> IPC
    IPC <--> Backend

    Backend --> PostgreSQL
    Backend --> Redis
    Backend --> Auth
    Backend --> Logger
    Backend --> RateLimit

    CLI -.Generates.-> Frontend
    CLI -.Generates.-> Backend
    Docker -.Contains.-> PostgreSQL
    Docker -.Contains.-> Redis
    Tests -.Validates.-> Backend

    style Frontend fill:#61dafb,color:#000
    style Backend fill:#ce422b,color:#fff
    style PostgreSQL fill:#336791,color:#fff
    style Redis fill:#dc382d,color:#fff
    style CLI fill:#FDC435,color:#000`,
      },
      {
        title: 'Frontend Architecture',
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

    subgraph "Build System"
        Vite[Vite<br/>Build Tool]
        TypeScript[TypeScript<br/>Type Safety]
        ESLint[ESLint<br/>Code Quality]
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

    Vite --> TypeScript
    Vite --> ESLint

    style App fill:#61dafb,color:#000
    style Store fill:#443e38,color:#fff
    style Vite fill:#646cff,color:#fff
    style Tailwind fill:#06b6d4,color:#fff`,
      },
      {
        title: 'Backend Architecture',
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

    subgraph "Authentication"
        AuthService[Auth Service<br/>User Management]
        PasswordHash[Password Hashing<br/>Argon2]
        Sessions[Session Management<br/>Token Storage]
    end

    subgraph "Middleware"
        Logging[Logging Middleware<br/>tracing crate]
        RateLimiter[Rate Limiter<br/>Request Throttling]
        ErrorHandler[Error Handler<br/>Centralized Errors]
    end

    Main --> Commands
    Main --> State
    Commands --> SQLx
    Commands --> RedisClient
    Commands --> AuthService

    SQLx --> Models
    Migrations --> SQLx

    RedisClient --> CacheOps

    AuthService --> PasswordHash
    AuthService --> Sessions
    Sessions --> RedisClient

    Commands --> Logging
    Commands --> RateLimiter
    Commands --> ErrorHandler

    style Main fill:#ce422b,color:#fff
    style SQLx fill:#336791,color:#fff
    style RedisClient fill:#dc382d,color:#fff
    style AuthService fill:#28a745,color:#fff`,
      },
      {
        title: 'Development Workflow',
        chart: `graph LR
    subgraph "Developer"
        Dev[Developer]
        CLI[ez-tauri-cli<br/>Scaffolding Tool]
    end

    subgraph "Local Development"
        Code[Write Code<br/>TypeScript/Rust]
        DevServer[Vite Dev Server<br/>localhost:5173]
        TauriDev[Tauri Dev<br/>cargo tauri dev]
    end

    subgraph "Quality Assurance"
        Lint[ESLint + Clippy<br/>Code Linting]
        Format[Prettier + rustfmt<br/>Code Formatting]
        Tests[Tests<br/>cargo test + vitest]
    end

    subgraph "Build"
        Build[Production Build<br/>cargo tauri build]
        Bundle[Platform Bundles<br/>.exe/.dmg/.AppImage]
    end

    subgraph "Docker Deployment"
        DockerFile[Dockerfile<br/>Container Definition]
        DockerCompose[docker-compose.yml<br/>Services Orchestration]
        Container[Running Container<br/>PostgreSQL + Redis + App]
    end

    Dev --> CLI
    CLI -.Generates.-> Code
    Code --> DevServer
    Code --> TauriDev

    DevServer --> Lint
    TauriDev --> Lint
    Lint --> Format
    Format --> Tests

    Tests --> Build
    Build --> Bundle

    Code --> DockerFile
    DockerFile --> DockerCompose
    DockerCompose --> Container

    style CLI fill:#FDC435,color:#000
    style Build fill:#ce422b,color:#fff
    style Container fill:#2496ed,color:#fff`,
      },
    ],
  },

  // Tetris Infrastructure
  {
    projectId: 2,
    diagrams: [
      {
        title: 'System Architecture Overview',
        chart: `graph TB
    subgraph "Platform Support"
        Desktop[Desktop Platforms<br/>Windows/macOS/Linux]
        Mobile[Mobile Platforms<br/>Android/iOS]
    end

    subgraph "Tauri Application"
        Frontend[React Frontend<br/>Game UI + Logic]
        Backend[Rust Backend<br/>System Integration]
        IPC[IPC Bridge<br/>Commands & Events]
    end

    subgraph "Game Engine"
        GameState[Game State<br/>Board + Score]
        GameLoop[Game Loop<br/>60 FPS Rendering]
        Physics[Physics Engine<br/>Block Movement]
        Collision[Collision Detection<br/>Boundary Checks]
    end

    subgraph "Input Handling"
        Keyboard[Keyboard Input<br/>Desktop Controls]
        Touch[Touch Input<br/>Mobile Controls]
        Gestures[Gesture Recognition<br/>Swipe/Tap]
    end

    subgraph "Rendering"
        Canvas[Canvas Rendering<br/>HTML5 Canvas]
        Animation[Animation Loop<br/>requestAnimationFrame]
    end

    Desktop --> Frontend
    Mobile --> Frontend

    Frontend <--> IPC
    IPC <--> Backend

    Frontend --> GameState
    GameState --> GameLoop
    GameLoop --> Physics
    Physics --> Collision

    Desktop --> Keyboard
    Mobile --> Touch
    Touch --> Gestures

    Keyboard --> GameState
    Gestures --> GameState

    GameLoop --> Canvas
    Canvas --> Animation

    style Frontend fill:#61dafb,color:#000
    style Backend fill:#ce422b,color:#fff
    style GameLoop fill:#FDC435,color:#000
    style Mobile fill:#3ddc84,color:#000`,
      },
      {
        title: 'Game Architecture',
        chart: `graph TB
    subgraph "Game Components"
        Board[Game Board<br/>10x20 Grid]
        Tetromino[Tetromino<br/>Active Piece]
        NextPiece[Next Piece<br/>Preview]
        Score[Score System<br/>Points + Level]
    end

    subgraph "Game Logic"
        SpawnPiece[Spawn Piece<br/>Random Generation]
        MovePiece[Move Piece<br/>Left/Right/Down]
        RotatePiece[Rotate Piece<br/>90° Rotation]
        LockPiece[Lock Piece<br/>Fix to Board]
        ClearLines[Clear Lines<br/>Row Completion]
    end

    subgraph "Game State"
        Playing[Playing State]
        Paused[Paused State]
        GameOver[Game Over State]
    end

    subgraph "Rendering"
        DrawBoard[Draw Board<br/>Grid + Cells]
        DrawPiece[Draw Active Piece<br/>Current Position]
        DrawGhost[Draw Ghost<br/>Landing Preview]
        DrawUI[Draw UI<br/>Score + Next Piece]
    end

    Board --> DrawBoard
    Tetromino --> DrawPiece
    Tetromino --> DrawGhost
    Score --> DrawUI
    NextPiece --> DrawUI

    SpawnPiece --> Tetromino
    Tetromino --> MovePiece
    Tetromino --> RotatePiece
    MovePiece --> LockPiece
    LockPiece --> Board
    Board --> ClearLines
    ClearLines --> Score
    Score --> SpawnPiece

    Playing --> MovePiece
    Paused -.Resume.-> Playing
    Playing -.Pause.-> Paused
    LockPiece -.Check.-> GameOver

    style Tetromino fill:#FDC435,color:#000
    style Playing fill:#28a745,color:#fff
    style GameOver fill:#dc3545,color:#fff`,
      },
      {
        title: 'Cross-Platform Build System',
        chart: `graph TB
    subgraph "Source Code"
        React[React Components<br/>TypeScript]
        Rust[Rust Backend<br/>Tauri Core]
        Assets[Game Assets<br/>Images/Sounds]
    end

    subgraph "Build Tools"
        Vite[Vite<br/>Frontend Bundler]
        Cargo[Cargo<br/>Rust Compiler]
        TauriBuild[Tauri CLI<br/>Build Orchestrator]
    end

    subgraph "Desktop Builds"
        Windows[Windows Build<br/>.exe + .msi]
        MacOS[macOS Build<br/>.app + .dmg]
        Linux[Linux Build<br/>.AppImage + .deb]
    end

    subgraph "Mobile Builds"
        Android[Android Build<br/>.apk + .aab]
        iOS[iOS Build<br/>.ipa]
    end

    subgraph "Platform-Specific"
        AndroidSDK[Android SDK<br/>NDK + Tools]
        XcodeSDK[Xcode SDK<br/>iOS Toolchain]
        WinSDK[Windows SDK<br/>MSVC Toolchain]
    end

    React --> Vite
    Rust --> Cargo
    Assets --> Vite

    Vite --> TauriBuild
    Cargo --> TauriBuild

    TauriBuild --> Windows
    TauriBuild --> MacOS
    TauriBuild --> Linux
    TauriBuild --> Android
    TauriBuild --> iOS

    Windows --> WinSDK
    Android --> AndroidSDK
    iOS --> XcodeSDK

    style TauriBuild fill:#FFC131,color:#000
    style Android fill:#3ddc84,color:#000
    style iOS fill:#147efb,color:#fff
    style Windows fill:#0078d4,color:#fff`,
      },
      {
        title: 'Input Control System',
        chart: `graph LR
    subgraph "Desktop Input"
        ArrowKeys[Arrow Keys<br/>Move/Rotate]
        SpaceBar[Space Bar<br/>Hard Drop]
        PKey[P Key<br/>Pause]
        EscKey[Esc Key<br/>Exit]
    end

    subgraph "Mobile Input"
        SwipeLeft[Swipe Left<br/>Move Left]
        SwipeRight[Swipe Right<br/>Move Right]
        SwipeDown[Swipe Down<br/>Soft Drop]
        Tap[Tap<br/>Rotate]
        DoubleTap[Double Tap<br/>Hard Drop]
    end

    subgraph "Input Handler"
        EventListener[Event Listener<br/>Unified Handler]
        InputQueue[Input Queue<br/>Command Buffer]
    end

    subgraph "Game Actions"
        MoveLeft[Move Left Action]
        MoveRight[Move Right Action]
        RotateAction[Rotate Action]
        DropAction[Drop Action]
        PauseAction[Pause Action]
    end

    ArrowKeys --> EventListener
    SpaceBar --> EventListener
    PKey --> EventListener
    EscKey --> EventListener

    SwipeLeft --> EventListener
    SwipeRight --> EventListener
    SwipeDown --> EventListener
    Tap --> EventListener
    DoubleTap --> EventListener

    EventListener --> InputQueue

    InputQueue --> MoveLeft
    InputQueue --> MoveRight
    InputQueue --> RotateAction
    InputQueue --> DropAction
    InputQueue --> PauseAction

    style EventListener fill:#FDC435,color:#000
    style SwipeLeft fill:#3ddc84,color:#000
    style ArrowKeys fill:#0078d4,color:#fff`,
      },
    ],
  },

  // Portfolio Website Infrastructure
  {
    projectId: 3,
    diagrams: [
      {
        title: 'System Architecture Overview',
        chart: `graph TB
    subgraph "Client Layer"
        Browser[Web Browser]
        Mobile[Mobile Browser]
    end

    subgraph "CDN & Hosting"
        Vercel[Vercel CDN<br/>Primary Hosting]
        GHPages[GitHub Pages<br/>Static Hosting]
    end

    subgraph "Application Layer"
        NextJS[Next.js Application<br/>React 18 + TypeScript]
        SSG[Static Site Generation<br/>Build-time Rendering]
        API[API Routes<br/>/api/github/contributions]
    end

    subgraph "External Services"
        GitHub[GitHub GraphQL API<br/>Contribution Data]
        GoogleFonts[Google Fonts CDN<br/>Typography Assets]
        Devicons[Devicons CDN<br/>Technology Icons]
    end

    subgraph "CI/CD Pipeline"
        Actions[GitHub Actions<br/>Automated Deployment]
        Cache[Build Cache<br/>.next/cache]
    end

    Browser --> Vercel
    Mobile --> Vercel
    Browser -.Fallback.-> GHPages

    Vercel --> NextJS
    GHPages --> SSG

    NextJS --> SSG
    NextJS --> API

    API --> GitHub
    NextJS --> GoogleFonts
    NextJS --> Devicons

    Actions --> Vercel
    Actions --> GHPages
    Actions --> Cache

    style NextJS fill:#0070f3,color:#fff
    style Vercel fill:#000,color:#fff
    style GitHub fill:#333,color:#fff
    style Actions fill:#2088ff,color:#fff`,
      },
      {
        title: 'Frontend Architecture',
        chart: `graph TB
    subgraph "App Router"
        Layout[app/layout.tsx<br/>Root Layout]
        Home[app/page.tsx<br/>Home Page]
        ProjectDetail[app/projects/[id]/page.tsx<br/>Dynamic Project Pages]
        APIRoute[app/api/github/contributions/route.ts<br/>GitHub API Proxy]
    end

    subgraph "Component Tree"
        ThemeProvider[ThemeProvider<br/>next-themes Context]
        Header[Header Component<br/>Navigation + Theme Toggle]
        Hero[Hero Section<br/>Full-screen Landing]
        About[About Section<br/>Developer Bio]
        Skills[Skills Section<br/>Technology Grid]
        Experience[Experience Section<br/>Timeline Carousel]
        Projects[Projects Section<br/>Featured Projects Gallery]
        GitHubActivity[GitHub Activity<br/>Contribution Heatmap]
        Footer[Footer<br/>Social Links]
    end

    subgraph "Hooks & Utilities"
        ScrollReveal[useScrollReveal Hook<br/>Intersection Observer]
        FramerMotion[Framer Motion<br/>Animation Engine]
    end

    subgraph "Styling Layer"
        Tailwind[Tailwind CSS<br/>Utility Classes]
        GlobalCSS[globals.css<br/>Custom Styles]
        Theme[Theme Config<br/>Light/Dark Mode]
    end

    Layout --> ThemeProvider
    ThemeProvider --> Home
    ThemeProvider --> ProjectDetail

    Home --> Header
    Home --> Hero
    Home --> About
    Home --> Skills
    Home --> Experience
    Home --> Projects
    Home --> GitHubActivity
    Home --> Footer

    GitHubActivity --> APIRoute

    Hero --> ScrollReveal
    About --> ScrollReveal
    Skills --> ScrollReveal
    Experience --> ScrollReveal
    Projects --> ScrollReveal

    ScrollReveal --> FramerMotion

    Header --> Theme
    ThemeProvider --> Theme
    Theme --> Tailwind
    GlobalCSS --> Tailwind

    style Layout fill:#0070f3,color:#fff
    style ThemeProvider fill:#61dafb,color:#000
    style Tailwind fill:#06b6d4,color:#fff`,
      },
      {
        title: 'Build & Deployment Pipeline',
        chart: `graph TB
    subgraph "Source Control"
        Dev[Developer]
        Git[Git Repository]
        MainBranch[main branch]
    end

    subgraph "CI/CD Triggers"
        PushTrigger[Push to main]
    end

    subgraph "GitHub Actions Workflow"
        Checkout[Checkout Code<br/>actions/checkout@v4]
        SetupNode[Setup Node.js 20<br/>with npm cache]
        RestoreCache[Restore Build Cache<br/>.next/cache]
        InstallDeps[Install Dependencies<br/>npm ci]
        Build[Build Application<br/>next build]
        Upload[Upload Artifact<br/>./out directory]
    end

    subgraph "Deployment Targets"
        GHPagesDeploy[Deploy to GitHub Pages<br/>actions/deploy-pages@v4]
        VercelDeploy[Deploy to Vercel<br/>Automatic Integration]
    end

    subgraph "Build Outputs"
        NextBuild[.next/ directory<br/>Next.js build artifacts]
        StaticExport[out/ directory<br/>Static HTML/CSS/JS]
    end

    subgraph "Production Environments"
        GHPages[GitHub Pages]
        Vercel[Vercel Production<br/>zuhaad.com]
    end

    Dev --> Git
    Git --> MainBranch
    MainBranch --> PushTrigger
    PushTrigger --> Checkout

    Checkout --> SetupNode
    SetupNode --> RestoreCache
    RestoreCache --> InstallDeps
    InstallDeps --> Build

    Build --> NextBuild
    Build --> StaticExport

    NextBuild --> Upload
    StaticExport --> Upload

    Upload --> GHPagesDeploy
    Upload --> VercelDeploy

    GHPagesDeploy --> GHPages
    VercelDeploy --> Vercel

    style Build fill:#0070f3,color:#fff
    style Vercel fill:#000,color:#fff
    style Checkout fill:#2088ff,color:#fff`,
      },
      {
        title: 'External Integrations',
        chart: `graph LR
    subgraph "Portfolio Application"
        App[Next.js Application]
        APIProxy[API Route<br/>/api/github/contributions]
        Components[React Components]
    end

    subgraph "GitHub Integration"
        GitHubAPI[GitHub GraphQL API<br/>api.github.com/graphql]
        Auth[Bearer Token Auth<br/>GITHUB_TOKEN]
        Account1[ZuhaadRathore<br/>Primary Account]
        Account2[Archontas123<br/>Secondary Account]
        ContribData[Contribution Calendar<br/>Weekly Breakdown]
    end

    subgraph "CDN Services"
        GoogleFonts[Google Fonts CDN<br/>Typography]
        Devicons[Devicons CDN<br/>Technology Icons]
    end

    Components --> APIProxy
    APIProxy --> Auth
    Auth --> GitHubAPI

    GitHubAPI --> Account1
    GitHubAPI --> Account2
    Account1 --> ContribData
    Account2 --> ContribData
    ContribData --> Components

    Components --> GoogleFonts
    Components --> Devicons

    style GitHubAPI fill:#333,color:#fff
    style GoogleFonts fill:#4285f4,color:#fff
    style Auth fill:#28a745,color:#fff`,
      },
    ],
  },
]

// Helper function to get infrastructure diagrams for a project
export function getProjectInfrastructure(projectId: number): InfrastructureDiagram[] {
  const project = projectInfrastructure.find((p) => p.projectId === projectId)
  return project?.diagrams || []
}
