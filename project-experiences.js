export const experiences = [
  {
    "index": 1,
    "slug": "solarops",
    "headline": "One installation. A continuous record.",
    "lede": "SolarOps connects the commercial and physical sides of rooftop solar: enquiry, site evidence, quotation, equipment custody, installation, and support.",
    "body": "An installation crosses six role workspaces. The backend checks record ownership and allowed state transitions as customer, sales, warehouse, installation and support teams hand off the same work.",
    "workflow": [
      "Record enquiry and survey",
      "Review versioned quotation",
      "Confirm customer acceptance",
      "Verify payment",
      "Release order to fulfilment"
    ],
    "kind": "solar"
  },
  {
    "index": 2,
    "slug": "praxis",
    "headline": "Evaluation that retains the evidence.",
    "lede": "Praxis turns versioned scenarios into inspectable evaluation artifacts, keeping raw outputs, assertion results, and comparison conditions together.",
    "body": "The local runner supports model, agent and HTTP application targets. Each run records the conditions, raw outputs and assertion results needed to trace a failure back to its scenario.",
    "workflow": [
      "Bind versioned scenarios and conditions",
      "Execute the appropriate target adapter",
      "Validate the output schema",
      "Evaluate assertions",
      "Persist outputs, failures, traces and evidence"
    ],
    "kind": "praxis"
  },
  {
    "index": 3,
    "slug": "worldspeak",
    "headline": "Your meaning. Your decision to speak.",
    "lede": "WorldSpeak separates choosing an intent, reviewing its words, and authorizing speech. Every change to meaning or language creates a new composition revision.",
    "body": "English and Tamil communication templates render words for review. The board binds speech permission to the current composition and requires a deliberate Speak gesture.",
    "workflow": [
      "Choose meaning",
      "Render reviewable words",
      "Bind approval to revision",
      "Check current composition",
      "Require explicit Speak gesture"
    ],
    "kind": "speech"
  },
  {
    "index": 4,
    "slug": "rlb",
    "headline": "Build quickly. Keep decisions recoverable.",
    "lede": "RLB coordinates AI-assisted engineering around durable tasks, version-bound approval, staged proposals, and recoverable file publication.",
    "body": "The local machine owns execution. Plans and code proposals pass through persisted review gates before publication. Publication checks for external edits and retains conflicts for review.",
    "workflow": [
      "Persist proposed work",
      "Check proposal version",
      "Resolve human approval",
      "Compare expected file identity",
      "Publish or retain conflict"
    ],
    "kind": "rlb"
  },
  {
    "index": 5,
    "slug": "stocksense",
    "headline": "Every stock change has a corresponding movement.",
    "lede": "StockSense connects receipts, deliveries, transfers, and physical counts through a PostgreSQL inventory engine and movement ledger.",
    "body": "Receipts, transfers, deliveries and adjustments update balances through validated operations. The database commits balance changes and movement records together.",
    "workflow": [
      "Validate operation",
      "Lock operation row",
      "Acquire ordered stock locks",
      "Update quants and ledger",
      "Commit or roll back"
    ],
    "kind": "stock"
  },
  {
    "index": 6,
    "slug": "survey-intelligence",
    "headline": "Turn unusual records into inspectable questions.",
    "lede": "Survey Data Intelligence brings rules, statistical signals, and Isolation Forest evidence into a persisted investigation workflow.",
    "body": "Uploaded batches preserve the source identity and the normalized analytical dataset. Investigators can review rule violations, statistical evidence and model findings separately.",
    "workflow": [
      "Normalize submissions",
      "Persist Parquet batch",
      "Build SIRL profiles",
      "Run three evidence channels",
      "Investigate findings"
    ],
    "kind": "survey"
  },
  {
    "index": 7,
    "slug": "nyrc",
    "headline": "A companion that stays useful with AI off.",
    "lede": "NYRC combines local tools, durable scheduling, optional intelligence, and a host-authorized presentation protocol.",
    "body": "The desktop companion routes supported local commands to deterministic tools. Persisted reminders can be recovered after the application restarts.",
    "workflow": [
      "Route local request",
      "Resolve deterministic tool",
      "Persist schedule",
      "Recover pending work",
      "Present companion state"
    ],
    "kind": "reminder"
  },
  {
    "index": 8,
    "slug": "enterprise-rag",
    "headline": "Retrieve within the boundary of access.",
    "lede": "Enterprise RAG combines tenant-aware retrieval, cited evidence, optional reranking, and persistent inference-budget accounting.",
    "body": "Retrieval applies tenant and role restrictions before ranking candidates. Query responses can carry source citations, while hosted generation follows the configured budget policy.",
    "workflow": [
      "Authenticate identity",
      "Filter tenant and role",
      "Retrieve and optionally rerank",
      "Reserve generation budget",
      "Return sources and settle usage"
    ],
    "kind": "rag"
  },
  {
    "index": 9,
    "slug": "atrium",
    "headline": "A shared mystery. Individually protected secrets.",
    "lede": "The Atrium is a procedural multiplayer mystery where players hide keys, interpret clues, explore rival libraries, and race to unlock a portal.",
    "body": "The browser renders each player’s view of the library. The server owns timed rounds, private state, key collection and the finale.",
    "workflow": [
      "Accept validated intent",
      "Project private state",
      "Advance timed rounds",
      "Track unique keys",
      "Resolve finale"
    ],
    "kind": "game"
  },
  {
    "index": 10,
    "slug": "space-debris",
    "headline": "Explore a mission without overstating the physics.",
    "lede": "Space Debris Sim is an educational modular-thruster simulation with phase-based telemetry, mission logs, and debris-collection modeling.",
    "body": "The desktop program pairs mission controls with telemetry plots, per-thruster collection records and CSV export.",
    "workflow": [
      "Configure educational mission",
      "Prelaunch checks",
      "Ascent phase",
      "Collection phase",
      "Return and summarize"
    ],
    "kind": "space"
  },
  {
    "index": 11,
    "slug": "workplace-safety",
    "headline": "A detection becomes useful when its state is understood.",
    "lede": "Hazard Zone Sentinel connects tracked observations to restricted-zone incidents, reviewable evidence, and an operations dashboard.",
    "body": "The system tracks zone occupancy from detections and records incidents when an entry satisfies its confidence and timing rules. Operators review the resulting events in the dashboard.",
    "workflow": [
      "Read tracked observation",
      "Check confidence",
      "Apply consecutive-frame guard",
      "Compare prior occupancy",
      "Emit entry or suppress duplicate"
    ],
    "kind": "safety"
  },
  {
    "index": 12,
    "slug": "engineering-portfolio",
    "headline": "A visual introduction that still works without WebGL.",
    "lede": "The engineering portfolio combines a Three.js opening, a scroll-driven gallery, project documentation, and ordinary HTML navigation.",
    "body": "A Three.js layer responds to the reader’s scroll while the document provides project details, navigation and contact information.",
    "workflow": [
      "Create WebGL presentation",
      "Bind scroll state",
      "Expose project records",
      "Provide rendering fallback",
      "Respect motion preferences"
    ],
    "kind": "portfolio"
  }
];

export const architectureDetails = {
  "solar": [
    "Link customer intent to site evidence.",
    "Keep changes attached to a versioned commercial record.",
    "Require the customer’s acceptance before advancing.",
    "Retain a pending state until settlement is verified.",
    "Carry equipment identity into delivery and installation."
  ],
  "praxis": [
    "Bind inputs, assertions, seed and suite identity.",
    "Execute the adapter appropriate to the target kind.",
    "Reject output that does not satisfy the declared shape.",
    "Retain expected and actual values for every required check.",
    "Persist outputs, failures, conditions and provenance for review."
  ],
  "speech": [
    "Capture selected intent without granting speech authority.",
    "Render exact words for deliberate user review.",
    "Bind permission to composition identity, locale and revision.",
    "Invalidate stale permission when meaning or language changes.",
    "Authorize speech only inside the explicit user gesture."
  ],
  "rlb": [
    "Persist the proposal before asking for a decision.",
    "An earlier approval cannot authorize a newer artifact.",
    "Retain the decision as part of durable task state.",
    "Compare target content with approved publication intent.",
    "Recover approved writes or preserve a conflicting external edit."
  ],
  "stock": [
    "Recheck the persisted operation status and requested lines.",
    "Serialize competing transitions on the same operation.",
    "Deduplicate and order product-location locks before updates.",
    "Change balances and append movement history together.",
    "Publish the complete operation or roll back its changes."
  ],
  "survey": [
    "Normalize names, aliases, missing values and numeric types.",
    "Preserve batch identity and the processed analytical dataset.",
    "Build reusable variable, record and hierarchy context.",
    "Keep rule, statistical and model evidence distinguishable.",
    "Present the evidence as an investigation, not a fraud verdict."
  ],
  "reminder": [
    "Resolve supported requests through local deterministic routing.",
    "Keep scheduling separate from optional AI conversation.",
    "Persist reminders so process state is not the only record.",
    "Recover due and overdue items after interruption.",
    "Keep host permissions separate from body presentation."
  ],
  "rag": [
    "Derive tenant and role from the authenticated principal.",
    "Apply access predicates before candidate text is returned.",
    "Rank only within the authorized candidate set.",
    "Reserve budget before an opted-in hosted generation call.",
    "Settle usage and retain the returned evidence identity."
  ],
  "game": [
    "Validate incoming player intent on the server.",
    "Keep hidden answers out of other players’ personalized views.",
    "Advance rounds against authoritative server deadlines.",
    "Deduplicate key collection and retain disconnected seats.",
    "Resolve portal access and tie-breaking from server state."
  ],
  "space": [
    "Configure the educational mission before telemetry starts.",
    "Represent readiness as a distinct simulation phase.",
    "Advance through simplified ascent telemetry.",
    "Track modeled collections per modular thruster.",
    "Summarize mission logs and export research data."
  ],
  "safety": [
    "Decode source observations and retain source identity.",
    "Use each person box’s bottom-center point for zone membership.",
    "Apply confidence and consecutive-frame entry guards.",
    "Retain occupancy state to avoid repeated entry events.",
    "Persist incidents and deliver updates for operator review."
  ],
  "portfolio": [
    "Render the opening and gallery in a fixed Three.js layer.",
    "Drive presentation from scroll position.",
    "Retain project records and detail controls in the document.",
    "Provide a static path when WebGL is unavailable.",
    "Adjust motion while keeping navigation and contact routes available."
  ]
};
