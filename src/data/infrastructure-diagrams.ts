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
      chart: `graph LR
    Frontend[React Frontend<br/>TypeScript] -->|IPC Commands| IPC[Tauri IPC Bridge<br/>Type-Safe]

    IPC -->|Invokes| Backend[Rust Backend<br/>Async Runtime]

    Backend --> Auth[Auth Layer<br/>Argon2 + JWT]
    Backend --> Database[(PostgreSQL<br/>SQLx Pool)]
    Backend --> Cache[(Redis<br/>Sessions)]

    CLI[ez-tauri-cli] -.Scaffolds.-> Frontend
    CLI -.Scaffolds.-> Backend

    style IPC fill:#FDC435,color:#000,stroke:#000,stroke-width:3px,cursor:pointer
    style Auth fill:#28a745,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style Backend fill:#ce422b,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style Database fill:#336791,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style Cache fill:#dc382d,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style CLI fill:#FDC435,color:#000,stroke:#000,stroke-width:3px,cursor:pointer`,
    },
    clickableSections: [
      {
        id: 'IPC',
        title: 'Tauri IPC Bridge',
        diagrams: [
          {
            title: 'Type-Safe Command System',
            chart: `graph LR
    React[React Component] -->|invoke| Command["#[tauri::command]<br/>Rust Function"]

    Command --> Validation[Serde Deserialization<br/>Type Validation]
    Validation -->|Ok| Handler[Command Handler<br/>Business Logic]
    Validation -->|Err| Error[Type Error<br/>Returned to Frontend]

    Handler -->|Result| Serialize[Serde Serialization<br/>JSON Response]
    Serialize --> React

    style Command fill:#ce422b,color:#fff,stroke:#000,stroke-width:3px
    style Validation fill:#FDC435,color:#000,stroke:#000,stroke-width:3px
    style Serialize fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'Event System',
            chart: `graph TB
    Backend[Rust Backend] -->|emit| Event[Event Channel<br/>Tauri Event System]

    Event --> Listeners[Frontend Listeners<br/>Event Callbacks]

    Listeners -->|Progress| UI1[Progress Bar Updates]
    Listeners -->|Notifications| UI2[Toast Notifications]
    Listeners -->|State Sync| UI3[Real-time State]

    style Event fill:#FDC435,color:#000,stroke:#000,stroke-width:3px
    style Backend fill:#ce422b,color:#fff,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'Backend',
        title: 'Rust Backend Runtime',
        diagrams: [
          {
            title: 'Async Runtime Architecture',
            chart: `graph TB
    Main[Main Thread<br/>Event Loop] --> Tokio[Tokio Runtime<br/>Work-Stealing Scheduler]

    Tokio --> Pool[Thread Pool<br/>Concurrent Tasks]

    Pool --> DB[DB Operations<br/>Non-blocking]
    Pool --> Redis[Cache Operations<br/>Async I/O]
    Pool --> FS[File System<br/>Async reads/writes]

    State[Shared State<br/>Arc + Mutex] --> Pool

    style Tokio fill:#ce422b,color:#fff,stroke:#000,stroke-width:3px
    style State fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'Auth',
        title: 'Authentication System',
        diagrams: [
          {
            title: 'Secure Auth Flow',
            chart: `graph LR
    Login[Credentials] --> Hash[Argon2id Hashing<br/>Memory-hard KDF]

    Hash -->|Compare| DB[(User Hash<br/>PostgreSQL)]

    DB -->|Valid| JWT[JWT Generation<br/>HS256 Signing]
    DB -->|Invalid| Reject[401 Unauthorized]

    JWT --> Session[Session ID<br/>Redis Cache]
    JWT --> Token[Access Token<br/>Returned to Client]

    style Hash fill:#28a745,color:#fff,stroke:#000,stroke-width:3px
    style JWT fill:#FDC435,color:#000,stroke:#000,stroke-width:3px
    style Session fill:#dc382d,color:#fff,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'Session Management',
            chart: `graph TB
    Request[API Request] --> Verify[Verify JWT<br/>Signature Check]

    Verify -->|Valid| Redis[(Redis<br/>Session Store)]
    Verify -->|Invalid| Reject[403 Forbidden]

    Redis -->|Hit| Allow[Request Allowed]
    Redis -->|Miss| Expire[Session Expired<br/>Re-login Required]

    style Redis fill:#dc382d,color:#fff,stroke:#000,stroke-width:3px
    style Verify fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'CLI',
        title: 'CLI Scaffolding Tool',
        diagrams: [
          {
            title: 'Project Generation',
            chart: `graph LR
    CLI[ez-tauri-cli] --> Templates[Template Engine<br/>Handlebars]

    Templates --> FE[Frontend Scaffold<br/>React + TypeScript + Vite]
    Templates --> BE[Backend Scaffold<br/>Rust + Tauri + SQLx]
    Templates --> Config[Config Files<br/>tauri.conf + Cargo.toml]

    Config --> Docker[Docker Compose<br/>Postgres + Redis]

    style CLI fill:#FDC435,color:#000,stroke:#000,stroke-width:3px
    style Templates fill:#ce422b,color:#fff,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'Database',
        title: 'PostgreSQL Database',
        diagrams: [
          {
            title: 'SQLx Compile-Time Verification',
            chart: `graph LR
    Query["SQL Query<br/>sqlx::query!()"] -->|Compile Time| Verify[SQLx Macro<br/>Verifies Against Live DB]

    Verify -->|✓ Schema Match| Type[Generate Typed Structs<br/>Rust Types]
    Verify -->|✗ Invalid| Error[Compilation Error<br/>Fails at Build]

    Type --> Compile[Compiled Binary<br/>No Runtime SQL Errors]

    style Verify fill:#336791,color:#fff,stroke:#000,stroke-width:3px
    style Type fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'Migration System',
            chart: `graph TB
    Dev[Schema Changes] --> Migration[Migration File<br/>Timestamped SQL]

    Migration --> Apply[sqlx migrate run<br/>Apply to DB]

    Apply --> Version[Schema Version<br/>_sqlx_migrations table]

    Version -->|Rollback| Revert[sqlx migrate revert<br/>Undo Changes]
    Version -->|Forward| Next[Next Migration]

    style Migration fill:#336791,color:#fff,stroke:#000,stroke-width:3px
    style Version fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'Cache',
        title: 'Redis Cache Layer',
        diagrams: [
          {
            title: 'Caching Strategy',
            chart: `graph TB
    Request[Data Request] --> Check{Check Redis<br/>Cache Hit?}

    Check -->|Hit| Return[Return Cached<br/>Sub-ms Response]
    Check -->|Miss| Query[(Query PostgreSQL<br/>~10ms)]

    Query --> Store[Store in Redis<br/>TTL: 5min]
    Store --> Return

    style Check fill:#dc382d,color:#fff,stroke:#000,stroke-width:3px
    style Query fill:#336791,color:#fff,stroke:#000,stroke-width:3px`,
          },
        ],
      },
    ],
  },

  // Tetris Infrastructure
  {
    projectId: 2,
    mainDiagram: {
      title: 'Cross-Platform Architecture',
      chart: `graph LR
    Source[Shared Codebase<br/>React + Tauri] --> Build[Build System<br/>Platform Detection]

    Build -->|cargo tauri build| Desktop[Desktop Binaries<br/>.exe/.dmg/.AppImage]
    Build -->|cargo tauri android| Android[Android APK/AAB<br/>Native ARM64]
    Build -->|cargo tauri ios| iOS[iOS IPA<br/>Native ARM64]

    GameLoop[Game Loop<br/>60 FPS RAF] --> Render[Canvas Renderer<br/>2D Context]

    Input[Input Handler<br/>Unified API] --> GameLoop
    Desktop --> Input
    Android --> Input
    iOS --> Input

    style Build fill:#FDC435,color:#000,stroke:#000,stroke-width:3px,cursor:pointer
    style GameLoop fill:#28a745,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style Input fill:#0078d4,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style Render fill:#61dafb,color:#000,stroke:#000,stroke-width:3px,cursor:pointer`,
    },
    clickableSections: [
      {
        id: 'Build',
        title: 'Cross-Platform Build System',
        diagrams: [
          {
            title: 'Platform-Specific Compilation',
            chart: `graph TB
    Tauri[Tauri CLI] --> Detect{Detect Platform<br/>Target}

    Detect -->|Desktop| Cargo[cargo build --release<br/>Native x86_64/ARM64]
    Detect -->|Android| NDK[Android NDK<br/>Cross-compile to ARM64]
    Detect -->|iOS| Xcode[Xcode Toolchain<br/>Cross-compile to ARM64]

    Cargo --> WebView[WebView2/WebKitGTK<br/>OS Native]
    NDK --> WebView2[Android WebView<br/>Chromium-based]
    Xcode --> WKWebView[WKWebView<br/>Safari Engine]

    style Detect fill:#FDC435,color:#000,stroke:#000,stroke-width:3px
    style NDK fill:#3ddc84,color:#000,stroke:#000,stroke-width:3px
    style Xcode fill:#147efb,color:#fff,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'Bundle Packaging',
            chart: `graph LR
    Vite[Vite Build<br/>Frontend Bundle] --> Assets[Static Assets<br/>HTML/CSS/JS]

    Assets --> Desktop[Desktop Bundle<br/>.exe/.dmg/.AppImage]
    Assets --> Android[Android Package<br/>APK/AAB]
    Assets --> iOS[iOS Package<br/>IPA]

    Sign[Code Signing] --> Desktop
    Sign --> Android
    Sign --> iOS

    style Vite fill:#646cff,color:#fff,stroke:#000,stroke-width:3px
    style Sign fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'GameLoop',
        title: 'Game Loop Architecture',
        diagrams: [
          {
            title: '60 FPS Game Loop',
            chart: `graph TB
    RAF[requestAnimationFrame<br/>Browser API] --> Delta[Calculate Delta Time<br/>Frame Timing]

    Delta --> Update[Update Game State<br/>Physics & Logic]
    Update --> Check{Check Collisions<br/>Lock Piece?}

    Check -->|No| Render[Render Frame<br/>Canvas Draw]
    Check -->|Yes| Lock[Lock Piece<br/>Clear Lines]

    Lock --> Score[Update Score<br/>Increment Level]
    Score --> Render

    Render --> RAF

    style RAF fill:#28a745,color:#fff,stroke:#000,stroke-width:3px
    style Update fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'State Management',
            chart: `graph LR
    State[Game State<br/>React useState] --> Board[Board Array<br/>10x20 Matrix]

    State --> Current[Current Piece<br/>Tetromino + Position]
    State --> Next[Next Piece<br/>Random Queue]
    State --> Score[Score Metadata<br/>Points/Lines/Level]

    Update[State Update] --> Immutable[Immutable Update<br/>New State Object]
    Immutable --> Rerender[React Re-render<br/>Virtual DOM Diff]

    style State fill:#61dafb,color:#000,stroke:#000,stroke-width:3px
    style Immutable fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'Input',
        title: 'Unified Input System',
        diagrams: [
          {
            title: 'Input Abstraction Layer',
            chart: `graph TB
    Desktop[Keyboard Events<br/>addEventListener] --> Handler[Input Handler<br/>Action Mapper]
    Mobile[Touch Events<br/>Gesture Detection] --> Handler

    Handler --> Actions{Game Action<br/>Type}

    Actions -->|Move| Move[moveLeft/moveRight<br/>Position Update]
    Actions -->|Rotate| Rotate[rotatePiece<br/>Matrix Rotation]
    Actions -->|Drop| Drop[hardDrop<br/>Instant Lock]

    style Handler fill:#0078d4,color:#fff,stroke:#000,stroke-width:3px
    style Actions fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'Touch Gesture Recognition',
            chart: `graph LR
    Touch[touchstart/touchmove] --> Track[Track Coordinates<br/>Delta X/Y]

    Track --> Analyze{Analyze<br/>Gesture}

    Analyze -->|ΔX > 50px| Swipe[Horizontal Swipe<br/>Move Piece]
    Analyze -->|ΔY > 50px| Drop[Vertical Swipe<br/>Soft Drop]
    Analyze -->|Quick Tap| Rotate[Single Tap<br/>Rotate 90°]

    style Track fill:#3ddc84,color:#000,stroke:#000,stroke-width:3px
    style Analyze fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'Render',
        title: 'Canvas Rendering',
        diagrams: [
          {
            title: 'Rendering Pipeline',
            chart: `graph LR
    Clear[Clear Canvas<br/>clearRect] --> Grid[Draw Grid<br/>10x20 Background]

    Grid --> Locked[Draw Locked Blocks<br/>Board State]
    Locked --> Ghost[Draw Ghost Piece<br/>Projected Position]
    Ghost --> Active[Draw Active Piece<br/>Current Tetromino]

    Active --> Buffer[Double Buffering<br/>Smooth Frame]

    style Clear fill:#61dafb,color:#000,stroke:#000,stroke-width:3px
    style Buffer fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'Performance Optimization',
            chart: `graph TB
    Render[Render Request] --> Dirty{Dirty Check<br/>State Changed?}

    Dirty -->|No| Skip[Skip Frame<br/>Preserve FPS]
    Dirty -->|Yes| Draw[Draw Canvas<br/>2D Context API]

    Draw --> Cache[Cache Sprites<br/>Reusable Blocks]

    style Dirty fill:#28a745,color:#fff,stroke:#000,stroke-width:3px
    style Cache fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
    ],
  },

  // Portfolio Website Infrastructure
  {
    projectId: 3,
    mainDiagram: {
      title: 'Deployment & Data Flow',
      chart: `graph LR
    Push[git push main] --> Actions[GitHub Actions<br/>CI/CD Pipeline]

    Actions --> Build[next build<br/>Static Export]
    Build --> Deploy[Vercel Deployment<br/>Edge Network]

    User[Browser] --> CDN[Vercel CDN<br/>Edge Caching]
    CDN --> SSG[Static Pages<br/>Pre-rendered]

    SSG --> API[API Route<br/>/api/github/contributions]
    API --> GraphQL[GitHub GraphQL API<br/>Multi-Account Aggregation]

    style Actions fill:#2088ff,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style Deploy fill:#000,color:#fff,stroke:#FDC435,stroke-width:3px,cursor:pointer
    style GraphQL fill:#333,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer
    style API fill:#0070f3,color:#fff,stroke:#000,stroke-width:3px,cursor:pointer`,
    },
    clickableSections: [
      {
        id: 'Actions',
        title: 'CI/CD Pipeline',
        diagrams: [
          {
            title: 'GitHub Actions Workflow',
            chart: `graph TB
    Trigger[git push main] --> Checkout[Checkout Repository<br/>actions/checkout@v4]

    Checkout --> Node[Setup Node.js 20<br/>actions/setup-node@v4]
    Node --> Cache[Restore Dependencies<br/>npm cache]

    Cache -->|Cache Hit| Install[npm ci<br/>Clean Install]
    Cache -->|Cache Miss| Download[Download Packages<br/>~2min]

    Download --> Install
    Install --> Lint[ESLint + Type Check<br/>Fail on Errors]
    Lint --> Build[next build<br/>Generate Static HTML]

    Build --> Artifact[Upload Build Artifact<br/>actions/upload-artifact@v4]

    style Checkout fill:#2088ff,color:#fff,stroke:#000,stroke-width:3px
    style Build fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'Deployment Strategy',
            chart: `graph LR
    Artifact[Build Artifact] --> Vercel[Vercel CLI<br/>Deploy Command]

    Vercel --> Edge[Edge Network<br/>Global CDN]

    Edge --> Region1[US East]
    Edge --> Region2[EU West]
    Edge --> Region3[Asia Pacific]

    Health[Health Check] --> Vercel
    Health -->|✓ Pass| Live[Make Live<br/>Update DNS]
    Health -->|✗ Fail| Rollback[Rollback<br/>Previous Version]

    style Edge fill:#000,color:#fff,stroke:#FDC435,stroke-width:3px
    style Live fill:#28a745,color:#fff,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'Deploy',
        title: 'Vercel Edge Network',
        diagrams: [
          {
            title: 'CDN Caching Strategy',
            chart: `graph TB
    Request[User Request] --> Edge[Edge Node<br/>Nearest Location]

    Edge --> Cache{Cache Status}

    Cache -->|Hit| Static[Serve Cached<br/>~10ms TTFB]
    Cache -->|Miss| Origin[Fetch from Origin<br/>~100ms]

    Origin --> Store[Store in Cache<br/>Revalidate: 60s]
    Store --> Static

    style Edge fill:#000,color:#fff,stroke:#FDC435,stroke-width:3px
    style Static fill:#28a745,color:#fff,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'Static Generation',
            chart: `graph LR
    Build[next build] --> SSG[Static Site Generation<br/>All Routes Pre-rendered]

    SSG --> HTML[HTML Files<br/>Hydration Ready]
    SSG --> Assets[Static Assets<br/>JS/CSS/Images]

    HTML --> Optimize[Optimize<br/>Minify + Compress]
    Assets --> Optimize

    Optimize --> CDN[Deploy to CDN<br/>Immutable Cache]

    style SSG fill:#0070f3,color:#fff,stroke:#000,stroke-width:3px
    style CDN fill:#000,color:#fff,stroke:#FDC435,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'GraphQL',
        title: 'GitHub GraphQL Integration',
        diagrams: [
          {
            title: 'Multi-Account Aggregation',
            chart: `graph TB
    Client[Client Request] --> API[API Route<br/>/api/github/contributions]

    API --> Query1[GraphQL Query<br/>ZuhaadRathore]
    API --> Query2[GraphQL Query<br/>Archontas123]

    Query1 --> GH[GitHub GraphQL API<br/>Parallel Requests]
    Query2 --> GH

    GH --> Data1[Contribution Data<br/>User 1]
    GH --> Data2[Contribution Data<br/>User 2]

    Data1 --> Merge[Merge & Aggregate<br/>Deduplicate by Date]
    Data2 --> Merge

    Merge --> Response[JSON Response<br/>Combined Activity]

    style GH fill:#333,color:#fff,stroke:#000,stroke-width:3px
    style Merge fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
          {
            title: 'GraphQL Query Structure',
            chart: `graph LR
    Query[GraphQL Query] --> ContribCollection[contributionsCollection<br/>Date Range Filter]

    ContribCollection --> Calendar[contributionCalendar<br/>Daily Breakdown]
    ContribCollection --> Count[totalCommitContributions<br/>Aggregate Count]

    Calendar --> Weeks[weeks<br/>Array of Weeks]
    Weeks --> Days[contributionDays<br/>Per-Day Data]

    Days --> Stats[Date + Count + Level<br/>Activity Intensity]

    style Query fill:#333,color:#fff,stroke:#000,stroke-width:3px
    style Stats fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
          },
        ],
      },
      {
        id: 'API',
        title: 'Next.js API Routes',
        diagrams: [
          {
            title: 'Server-Side Data Fetching',
            chart: `graph TB
    Request[Client Fetch] --> Route[API Route Handler<br/>Edge Runtime]

    Route --> Auth[GitHub Token<br/>Environment Variable]
    Auth --> Fetch[Fetch GitHub API<br/>Authenticated Request]

    Fetch --> Parse[Parse Response<br/>JSON Transform]
    Parse --> Cache[Cache Response<br/>In-Memory 5min]

    Cache --> Return[Return JSON<br/>CORS Headers]

    style Route fill:#0070f3,color:#fff,stroke:#000,stroke-width:3px
    style Cache fill:#FDC435,color:#000,stroke:#000,stroke-width:3px`,
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
