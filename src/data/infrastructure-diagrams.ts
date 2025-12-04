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
  // ez-tauri (user journey)
  {
    projectId: 1,
    mainDiagram: {
      title: 'User Journey',
      chart: `graph LR
    classDef card fill:#0b0c10,stroke:#FDC435,stroke-width:3px,color:#fff;
    classDef accent fill:#FDC435,stroke:#000,stroke-width:3px,color:#000;
    classDef quiet fill:#1f2937,stroke:#FDC435,stroke-width:2px,color:#FDC435;

    User["<div>👤 User<br/><svg width='60' height='6'><rect width='60' height='6' fill='#FDC435'/></svg></div>"]:::accent --> Shell["<div>🖥️ Shell<br/>Tauri + React</div>"]:::card
    Shell --> Actions["<div>⚡ Actions<br/>Create / run</div>"]:::card
    Actions --> Feedback["<div>🔔 Feedback<br/>Toasts + status</div>"]:::card
    Actions --> Data["<div>💾 Local data<br/>Projects + logs</div>"]:::card
    Shell --> Auth["<div>🔐 Access<br/>Signed-in or local</div>"]:::card
    Data --> Offline["<div>🛰️ Offline<br/>Keeps working</div>"]:::card
    Feedback --> Next["<div>➡️ Next steps<br/>Retry or ship</div>"]:::quiet
    class Next quiet;`,
    },
    clickableSections: [],
  },

  // Tetris (player journey)
  {
    projectId: 2,
    mainDiagram: {
      title: 'Player Journey',
      chart: `graph LR
    classDef card fill:#0b0c10,stroke:#FDC435,stroke-width:3px,color:#fff;
    classDef accent fill:#FDC435,stroke:#000,stroke-width:3px,color:#000;
    classDef blue fill:#1d4ed8,stroke:#000,stroke-width:3px,color:#fff;
    classDef green fill:#16a34a,stroke:#000,stroke-width:3px,color:#fff;

    Player["<div>🕹️ Player<br/><svg width='60' height='6'><rect width='60' height='6' fill='#1d4ed8'/></svg></div>"]:::blue --> Controls["<div>⌨️ / 🤏 Controls<br/>Keyboard or touch</div>"]:::accent
    Controls --> Loop["<div>♻️ Loop<br/>Speed ramps</div>"]:::card
    Loop --> Feedback["<div>✨ Feedback<br/>Flashes + SFX</div>"]:::card
    Loop --> Progress["<div>📈 Progress<br/>Score + level</div>"]:::green
    Progress --> Share["<div>🔄 Restart / share</div>"]:::accent
    Feedback --> Clarity["<div>👁️ Clarity<br/>State stays readable</div>"]:::card`,
    },
    clickableSections: [],
  },

  // Portfolio Website (visitor journey)
  {
    projectId: 3,
    mainDiagram: {
      title: 'Visitor Journey',
      chart: `graph LR
    classDef card fill:#0b0c10,stroke:#FDC435,stroke-width:3px,color:#fff;
    classDef accent fill:#FDC435,stroke:#000,stroke-width:3px,color:#000;
    classDef green fill:#16a34a,stroke:#000,stroke-width:3px,color:#fff;
    classDef gray fill:#333,stroke:#000,stroke-width:3px,color:#fff;

    Visitor["<div>👀 Visitor<br/><svg width='60' height='6'><rect width='60' height='6' fill='#FDC435'/></svg></div>"]:::accent --> Landing["<div>🚀 Hero<br/>Tagline + CTA</div>"]:::card
    Landing --> Projects["<div>🖼️ Carousel<br/>Featured builds</div>"]:::card
    Landing --> Github["<div>📊 Live GitHub<br/>Heatmap</div>"]:::gray
    Projects --> CTA["<div>🔗 Open<br/>Detail or repo</div>"]:::accent
    CTA --> Contact["<div>✉️ Contact<br/>Email / socials</div>"]:::green
    Github --> Trust["<div>✅ Trust<br/>Activity proof</div>"]:::card`,
    },
    clickableSections: [],
  },

  // Anton (developer journey)
  {
    projectId: 4,
    mainDiagram: {
      title: 'Developer Journey',
      chart: `graph LR
    classDef card fill:#0b0c10,stroke:#FDC435,stroke-width:3px,color:#fff;
    classDef accent fill:#FDC435,stroke:#000,stroke-width:3px,color:#000;
    classDef quiet fill:#1f2937,stroke:#FDC435,stroke-width:2px,color:#FDC435;

    Dev["<div>👩‍💻 Developer<br/><svg width='60' height='6'><rect width='60' height='6' fill='#FDC435'/></svg></div>"]:::accent --> API["<div>🧠 Immediate API<br/>state → frame</div>"]:::card
    API --> Layout["<div>📐 Layout<br/>VBox / HStack / split</div>"]:::card
    API --> Widgets["<div>🧰 Widgets<br/>buttons / tables / inputs</div>"]:::card
    Layout --> Theme["<div>🎨 Theming<br/>Tokens + .ath DSL</div>"]:::card
    Theme --> Output["<div>🖼️ Output<br/>Flicker-free frame</div>"]:::accent
    Output --> Iterate["<div>🔄 Iterate<br/>Tweak + rerun</div>"]:::quiet`,
    },
    clickableSections: [],
  },

  // RetentionAI (learner journey)
  {
    projectId: 5,
    mainDiagram: {
      title: 'Learner Journey',
      chart: `graph LR
    classDef card fill:#0b0c10,stroke:#FDC435,stroke-width:3px,color:#fff;
    classDef accent fill:#FDC435,stroke:#000,stroke-width:3px,color:#000;
    classDef cyan fill:#22d3ee,stroke:#000,stroke-width:3px,color:#000;
    classDef quiet fill:#1f2937,stroke:#FDC435,stroke-width:2px,color:#FDC435;

    Learner["<div>📚 Learner<br/><svg width='60' height='6'><rect width='60' height='6' fill='#22d3ee'/></svg></div>"]:::cyan --> Choose["<div>🗂️ Pick deck<br/>Session start</div>"]:::accent
    Choose --> Review["<div>✍️ Review<br/>Prompts + inputs</div>"]:::card
    Review --> Score["<div>🧠 Score<br/>Self-rate + hints</div>"]:::card
    Score --> Progress["<div>💾 Progress<br/>Saved locally</div>"]:::quiet
    Progress --> Next["<div>⏭️ Next session<br/>Nudges/reminders</div>"]:::accent
    Review --> Offline["<div>🛰️ Offline ready<br/>Bundled model</div>"]:::card`,
    },
    clickableSections: [],
  },
]

// Helper function to get infrastructure for a project
export function getProjectInfrastructure(projectId: number): ProjectInfrastructure | undefined {
  return projectInfrastructure.find((p) => p.projectId === projectId)
}
