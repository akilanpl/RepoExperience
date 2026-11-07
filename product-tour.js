// Each entry describes a real product surface or an explicitly documented local workflow.
const livePortfolio = 'https://akilan-portfolio-henna.vercel.app/';

export const productTours = {
  solarops: {
    steps: [
      ['Customer store', 'Explore the customer store or use the Workspace menu to switch between all six roles.', 'apps/web/src/app/customer/store/page.tsx', 'demos/solarops/#customer/store'],
      ['Enquiry', 'Submit an enquiry and track it from the customer workspace.', 'apps/web/src/app/customer/page.tsx', 'demos/solarops/#customer/new'],
      ['Sales review', 'Use the sales workspace to advance the survey and quotation.', 'apps/web/src/app/sales', 'demos/solarops/#sales/home'],
      ['Warehouse picking', 'Open Picking to review the warehouse queue and equipment handoff.', 'apps/web/src/app/warehouse/picking/page.tsx', 'demos/solarops/#warehouse/picking'],
      ['Warranty', 'Review equipment coverage and service records in the support workspace.', 'apps/web/src/app/support/warranty/page.tsx', 'demos/solarops/#support/warranty']
    ]
  },
  worldspeak: {
    steps: [
      ['Try the café', 'From your seat, select someone and choose whether to ask for help or call them over. Review the exact message before you speak.', 'packages/communication', 'demos/worldspeak/cafe.html'],
      ['Review exact words', 'Read the rendered sentence before using the Speak control.', 'packages/communication', 'demos/worldspeak/'],
      ['Change language', 'Switch between English and Tamil and review the updated sentence.', 'packages/catalog/data', 'demos/worldspeak/'],
      ['Speak deliberately', 'Press Speak when ready. Audio uses your browser’s speech synthesis.', 'apps/web/src/lib/speech.ts', 'demos/worldspeak/'],
      ['Stop speech', 'Use Stop to interrupt speech playback.', 'scripts/build-offline.mjs', 'demos/worldspeak/']
    ]
  },
  rlb: {
    steps: [
      ['Try three tasks', 'Choose a Turtle drawing, a support-ticket AI classifier, or a feature for a sample repository. Review the plan before running the task.', 'backend/app/services/durable_worker.py', 'demos/rlb/'],
      ['Create workspace', 'Use the workspace form to configure the project context.', 'frontend/src/app/dashboard/workspaces/new/page.tsx', 'http://localhost:3000/dashboard/workspaces/new'],
      ['Review tasks', 'Inspect task state in the workspace. Plan and code approvals belong to the durable workflow.', 'frontend/src/app/dashboard/workspaces/[workspaceId]/page.tsx'],
      ['Terminal', 'Inspect the terminal surface and its connection to the local runtime.', 'frontend/src/app/terminal/page.tsx', 'http://localhost:3000/terminal'],
      ['Devices', 'Review the paired device interface when using the remote control plane.', 'frontend/src/app/devices/page.tsx', 'http://localhost:3000/devices']
    ]
  },
  stocksense: {
    steps: [
      ['Receive 100 units', 'Create a receipt into Rack A, mark it ready and validate it.', 'src/app/(app)/receipts/page.tsx', 'demos/stocksense/#receipts'],
      ['Transfer 30 units', 'Move stock from Rack A to Rack B through a transfer operation.', 'src/app/(app)/transfers/page.tsx', 'demos/stocksense/#transfers'],
      ['Deliver 20 units', 'Validate a delivery from Rack B.', 'src/app/(app)/deliveries/page.tsx', 'demos/stocksense/#deliveries'],
      ['Count 8 units', 'Record the physical count and validate the adjustment.', 'src/app/(app)/adjustments/page.tsx', 'demos/stocksense/#adjustments'],
      ['Inspect final balances', 'Compare Stock and Move History after the documented rehearsal.', 'docs/DEMO.md', 'demos/stocksense/#stock']
    ]
  },
  'survey-intelligence': {
    steps: [
      ['Dashboard', 'Open the dashboard to see the batch and assessment entry points.', 'frontend/app/dashboard/page.tsx', 'demos/survey/#overview'],
      ['Upload a batch', 'Use the batch form with a sample CSV from the repository.', 'frontend/app/dashboard/batches/new/page.tsx', 'demos/survey/#upload'],
      ['Inspect a batch', 'Open the batch detail to follow ingestion and assessment state.', 'frontend/app/dashboard/batches/[batchId]/page.tsx', 'demos/survey/#batch'],
      ['Review anomalies', 'Inspect flagged records through the anomalies view.', 'frontend/app/dashboard/anomalies/page.tsx', 'demos/survey/#review'],
      ['Open investigations', 'Follow record-level evidence into the investigations workspace.', 'frontend/app/dashboard/investigations/page.tsx', 'demos/survey/#investigations']
    ]
  },
  nyrc: {
    steps: [
      ['Try NYRC', 'Open the Windows-style desktop or switch to the physical AI film from the side dropdown.', 'src/App.svelte', 'demos/nyrc/experience.html'],
      ['Desktop appearance', 'Inspect the repository capture of the native desktop companion.', 'src/lib/components/Pet.svelte', 'demos/nyrc/evidence/nyrc-desktop.png'],
      ['Assistant input', 'See the native assistant’s command and response layout.', 'src/lib/components/AssistantInput.svelte', 'demos/nyrc/evidence/nyrc-assistant-final.png'],
      ['Settings', 'Explore the presentation settings available in the browser build.', 'src/lib/components/Settings.svelte', 'demos/nyrc/'],
      ['Device diagnostics', 'Inspect the desktop capture of the device workflow.', 'src/lib/components/BodyDiagnostics.svelte', 'demos/nyrc/evidence/nyrc-devices.png']
    ]
  },
  'enterprise-rag': {
    steps: [
      ['Open retrieval console', 'Run a query and inspect the cited evidence and response JSON.', 'app/api/chat.py', 'demos/enterprise-rag/'],
      ['Switch identity', 'Change the demo key to see how tenant and role affect the results.', 'app/core/security.py', 'demos/enterprise-rag/'],
      ['Ingest a document', 'Select the Acme administrator key, then index an example document.', 'app/ingestion', 'demos/enterprise-rag/'],
      ['Compare cited responses', 'Run the leave policy query as Acme and Northwind employees.', 'app/api/chat.py', 'demos/enterprise-rag/'],
      ['Inspect retrieval scope', 'Compare the procurement response as an employee and a manager.', 'app/retrieval/retriever.py', 'demos/enterprise-rag/']
    ]
  },
  atrium: {
    steps: [
      ['Watch a complete match', 'Watch a two-player run from the private lobby through the hidden key, portal, and final score.', 'apps/server/src/game.ts', 'demos/atrium/match.html'],
      ['Select a character', 'Switch between travelers and toggle Portrait in the original 3D character picker. Start the local client and room server for multiplayer.', 'apps/client/src/AvatarSelect.tsx', 'demos/atrium/'],
      ['Prepare the library', 'Hide a key and mark the room ready.', 'apps/server/src/game.ts'],
      ['Search a rival library', 'Follow the clue and inspect objects during the timed round.', 'apps/server/src/game.ts'],
      ['Unlock the portal', 'Collect the required keys and interact with the portal in the finale.', 'apps/server/src/game.ts']
    ]
  },
  'space-debris': {
    steps: [
      ['Configure a mission', 'Set a commander, rocket, orbit altitude and launch coordinates.', 'src/space_debris_sim/gui/setup.py', 'demos/space-debris/'],
      ['Start the simulation', 'Launch, pause, or step through the mission in the browser.', 'src/space_debris_sim/core/simulation.py', 'demos/space-debris/'],
      ['Read telemetry', 'Follow the temperature and average thruster speed plots alongside the mission log.', 'src/space_debris_sim/gui/main_window.py', 'demos/space-debris/'],
      ['Inspect thruster loads', 'Compare the mass and materials captured by the three thrusters.', 'src/space_debris_sim/core/models.py', 'demos/space-debris/'],
      ['Export telemetry', 'Download telemetry and debris as separate CSV files.', 'src/space_debris_sim/core/data_manager.py', 'demos/space-debris/']
    ]
  },
  'workplace-safety': {
    steps: [
      ['Overview', 'Inspect the source dashboard with recorded warehouse evidence.', 'frontend/src/App.tsx', 'demos/workplace-safety/#overview'],
      ['Monitoring', 'Review the source selection and monitoring surface.', 'frontend/src/App.tsx', 'demos/workplace-safety/#monitoring'],
      ['Incidents', 'Inspect the operator view for incident review and acknowledgment.', 'backend/engine.py', 'demos/workplace-safety/#incidents'],
      ['Analytics', 'View the dashboard’s historical breakdown.', 'frontend/src/App.tsx', 'demos/workplace-safety/#analytics'],
      ['Camera monitor', 'See the separate interface for independent inference.', 'backend/independent_inference.py', 'demos/workplace-safety/#camera']
    ]
  },
  'engineering-portfolio': {
    steps: [
      ['Live portfolio', 'Explore the live portfolio here or open it in a new tab.', 'dist/app.js', livePortfolio],
      ['Project gallery', 'Scroll to move through the gallery.', 'dist/app.js', livePortfolio],
      ['Project details', 'Select a project and open its details in the original interface.', 'dist/app.js', livePortfolio],
      ['Responsive layout', 'Resize the original page to see the gallery and navigation adapt.', 'dist/style.css', livePortfolio],
      ['Resume', 'Open the original portfolio’s downloadable resume.', 'dist/AKILAN_P_L.pdf', 'demos/engineering-portfolio/AKILAN_P_L.pdf']
    ]
  }
};
