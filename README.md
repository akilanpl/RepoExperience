# RepoExperience

**Try the workflow before you clone the repository.**

[Explore RepoExperience →](https://repoexperience.vercel.app)

RepoExperience is an interactive showcase of projects built by [Akilan P L](https://github.com/akilanpl). It gives visitors a practical first look at each product: what it does, how its interface behaves, what inputs it accepts, and how a workflow reaches an outcome.

A repository explains how a system is built. RepoExperience lets you experience the idea first—then explore the source and decide what to run locally.

## From discovery to understanding

Browse the collection, open a project postcard, and enter its dedicated experience. Each project pairs a concise introduction with a product-specific demonstration and an explanation of the implementation behind it.

- **Explore the interface.** See the project's interaction model, with examples suited to its actual purpose.
- **Follow a workflow.** Move from an input or action through planning, processing, and a visible result.
- **Understand the system.** Read the supporting architecture and follow links to implementation files and repository setup instructions.
- **Continue locally.** Use the original repository when you are ready for the complete runtime and its dependencies.

## The collection

| Project | What you can explore |
| --- | --- |
| **Mindscape** | Reasoning examples across mathematics, code, and physics, with recorded results and inspectable execution evidence. |
| **Relax Lemme Build** | An editor-style agent workflow with planning, approval, staged execution, and example outputs. |
| **NYRC** | A desktop companion experience with example requests, thinking states, and contextual desktop panels. |
| **Survey Intelligence** | A survey investigation interface for navigating sample data, signals, and analysis. |
| **WorldSpeak** | A first-person café scenario where selecting a person opens communication actions. |
| **SolarOps** | An installation operations workspace spanning survey, equipment, and project handoffs. |
| **StockSense** | A market analysis workspace reconstructed around supplied product evidence. |
| **Enterprise RAG** | A retrieval workspace for exploring questions, supporting context, and source evidence. |
| **Space Debris Sim** | An interactive mission interface for exploring orbital objects and simulation controls. |
| **Workplace Safety** | A safety monitoring workspace with supplied footage and inspection evidence. |
| **The Atrium** | A game preview with character assets and a complete recorded gameplay sequence. |
| **Engineering Portfolio** | An embedded portfolio experience visitors can browse directly. |
| **Praxis** | A project brief describing its intended direction; currently in development. |

## What the previews represent

The site combines interactive browser demonstrations, original browser builds where available, source-linked walkthroughs, and recorded product evidence. These formats are selected per project rather than forcing every system into the same chat interface.

Browser previews do not start the original projects' model services, native integrations, databases, multiplayer servers, or hardware. Mindscape's examples replay recorded results; its thinking animation indicates playback preparation, not a live model inference. Workflow demonstrations use curated examples and local UI state where the full backend is unavailable.

For complete functionality, consult each linked repository's requirements and run instructions. The experience is a way to evaluate a project before setup, with a clear route to the underlying code.

## Run locally

No build step is required for the showcase. From the repository root:

```sh
python3 -m http.server 8767 --bind 127.0.0.1
```

Open **http://localhost:8767**. Serve the repository root so that embedded demos and their assets resolve correctly.

## Structure

```text
index.html            Project collection and landing page
about/                About page
experience/           Dedicated project reading and experience pages
demos/                Project-specific browser demonstrations and media
assets/               Artwork, fonts, datasets, and recorded evidence
vendor/               Bundled third-party animation engine
projects.js           Collection metadata and repository links
nav-orb.js            Animated orb-to-monogram navigation mark
style.css             Shared layout, typography, and navigation transitions
```

The showcase uses HTML, CSS, JavaScript modules, and Canvas. Individual embedded experiences may include their own bundled runtime. The main site can be hosted directly on Vercel or another static host.

## Interaction and accessibility

The collection includes keyboard navigation, visible focus states, reduced-motion handling, and responsive layouts. Page transitions use the browser's View Transition API where supported. The corner particle orb forms an A on hover or keyboard focus and returns to its thinking state afterward.

## Credits

- Portfolio design and project experiences by **Akilan P L**, with visual and motion direction inspired by [Andreas' portfolio](https://andreas.vision).
- Thinking Orbs engine by **Jakub Antalik**, bundled under its [MIT license](vendor/thinking-orbs/LICENSE).
- Geist and Newsreader fonts are distributed with their included SIL Open Font License notices. TRJN DaVinci is referenced as an optional locally installed typeface; its webfont is not bundled.
- Globe geometry is derived from Natural Earth through World Atlas.
- Project-specific evidence, assets, and source attribution remain alongside the relevant experiences. See the original repositories for their licensing and runtime requirements.

---

Built to make the first encounter with a project something you can experience, not just read.
