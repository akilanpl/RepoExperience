# Praxis interactive experience — engineering handoff

Praxis now opens an interactive evaluation workspace within RepoExperience’s existing project article. Visitors can select all six source suites (40 scenarios), replay committed results, inspect individual task outputs and assertions, follow agent/HTTP traces, inspect explanatory comparisons, and export JSON or print a report.

## Architecture and source inspection

RepoExperience stays a build-free static HTML/CSS/JavaScript application. The existing `projects.js` index 2, artwork mapping, `project-experiences.js` workflow, `product-tour.js` steps, shared article styles, `project-page.js` iframe surface and `project-navigation.js` onboarding controls are reused. Only Praxis uses the continuous iframe update: step changes replace the same-document hash, retaining suite/mode/task/replay state. Other projects retain their existing asset handling. The shared source/download navigation needed a Praxis-specific release branch because it previously rewrote setup links to HEAD.

The pre-change findings were verified: Praxis was labeled in development, had five architecture stages but no `productTours.praxis`, and its page was a static note. `project-page.js` dereferences `tour.steps`, so a real tour entry was required before enabling the shared controller. The requested `project-tour.js` does not exist; the actual module is `product-tour.js`.

Inspected destination structure, shared HTML/JS/CSS and Mindscape/RLB/NYRC/Survey experiences and demos, plus all existing Praxis evidence. Inspected the source README, verification/qualification/SAST/recovery documents, web entrypoint/API/styles/HTML, all six suites, engine/model/agent/HTTP adapters, acceptance screenshots and suite/run evidence. Source qualification includes native Windows failure and scoped Linux/macOS 15 acceptance; those limits are retained in onboarding. All source checkouts and browser work remained in Codex Cloud. The source checkout is unchanged.

## Faithful UI adaptation

The upstream React app depends on authenticated local `/api` transport. Bundling it directly would introduce the unavailable local runtime and auth flow. The dedicated static adapter instead loads only committed public JSON; it has no inference, registration, upload, credentials, local files, analytics or arbitrary endpoint controls.

Adapted from the version-matched UI and screenshots:

- Charcoal panels, lime actions, workspace wordmark/eyebrows, sidebar and responsive scrolling navigation.
- Dashboard/Models/Agents/Apps/Suites/Launch/Run evidence/Artifacts/Compare/Arena concepts; reports and methodology/settings have dedicated explanatory states.
- Actual suite slug/version, task IDs, seed, target kind, trust, duration and completed/pass/fail distinctions.
- Input/output JSON panels, schema details, exact assertion definitions, expected/observed assertion tables, tool traces and safe model metadata.
- Run summaries, export/print controls, matched-evaluation matrix explanation and original comparison/Arena captures.

No customer activity, ratings, votes, model scores or API connections are fabricated. MIT attribution is retained in `demos/praxis/NOTICE.md`.

## Evidence classes

The deterministic model/agent reports use `demo` trust: outputs/actions are prescribed infrastructure fixtures, not neural inference. Structured passing reports **8/8 tasks and 24/24 checks**. The independently loaded failing report has real `incorrect` output values, **0/8 tasks and 8/24 checks**; valid schema checks still pass.

Owned HTTP reports record actual requests made by the source runner against an owned regression fixture and retain **self-reported** trust. Browser playback makes no HTTP application requests. They are not mislabeled as model inference or demo-trust evidence.

The historical SmolLM2-135M report preserves the exact prose output, model revision and Transformers.js CPU q4 metadata: **0/8 tasks, 0/24 assertions, 64,372.706 ms**. Invocation completed and evidence persisted, while every selected task failed. The direct historical link uses `?mode=recorded#evidence`.

Comparisons are explicitly explanatory because no authentic match receipt was included. Passing/failing regression evidence is not an official quality comparison. Demo-trust fixtures are never ranked against the self-reported model result. Arena displays an authentic historical capture and explains persisted A/B assignments; no public vote or rating is simulated.

## Public-data provenance

Source repository: https://github.com/akilanpl/praxis, branch `codex/praxis-final-release`. Verified branch head and qualified baseline both equal **`75243f70731fb5b8001ff39c64d83af9a02120b5`**. Every table row below uses that precise SHA (abbreviated in the table). Normalized on **2026-11-10**.

Each JSON contains repository, full commit, source path, normalization date and sanitization metadata. Extraction uses explicit report/task field allowlists: no account/target/run IDs, fingerprints, credentials, sessions, provider endpoints, runtime DBs or local filesystem paths. Public task prompts, outputs, assertions, schemas and simulated tool state remain verbatim. Retained hashes identify original evidence, not the normalized file or independent verification.

Regenerate using `python3 scripts/extract-praxis.py /path/to/read-only/praxis-checkout`. Data regression checks compare every retained field against source.

| Source file | Public file under `demos/praxis/data/` | Evidence scope | Source SHA |
|---|---|---|---|
| [packages/scenarios/agent-workflows-v1.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/packages/scenarios/agent-workflows-v1.json) | suite-definitions.json · agent-workflows | Exact public scenario definition | `75243f70731f` |
| [packages/scenarios/developer-contracts-v1.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/packages/scenarios/developer-contracts-v1.json) | suite-definitions.json · developer-contracts | Exact public scenario definition | `75243f70731f` |
| [packages/scenarios/grounded-research-v1.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/packages/scenarios/grounded-research-v1.json) | suite-definitions.json · grounded-research | Exact public scenario definition | `75243f70731f` |
| [packages/scenarios/http-application-v1.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/packages/scenarios/http-application-v1.json) | suite-definitions.json · http-application | Exact public scenario definition | `75243f70731f` |
| [packages/scenarios/security-resilience-v1.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/packages/scenarios/security-resilience-v1.json) | suite-definitions.json · security-resilience | Exact public scenario definition | `75243f70731f` |
| [packages/scenarios/structured-agent-v1.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/packages/scenarios/structured-agent-v1.json) | suite-definitions.json · structured-agent | Exact public scenario definition | `75243f70731f` |
| [evidence/review/acceptance/suite-runs/agent-workflows-failing.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/evidence/review/acceptance/suite-runs/agent-workflows-failing.json) | agent-workflows-failing.json | deterministic-fixture · trust: demo | `75243f70731f` |
| [evidence/review/acceptance/suite-runs/agent-workflows-passing.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/evidence/review/acceptance/suite-runs/agent-workflows-passing.json) | agent-workflows-passing.json | deterministic-fixture · trust: demo | `75243f70731f` |
| [evidence/review/acceptance/suite-runs/developer-contracts-failing.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/evidence/review/acceptance/suite-runs/developer-contracts-failing.json) | developer-contracts-failing.json | deterministic-fixture · trust: demo | `75243f70731f` |
| [evidence/review/acceptance/suite-runs/developer-contracts-passing.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/evidence/review/acceptance/suite-runs/developer-contracts-passing.json) | developer-contracts-passing.json | deterministic-fixture · trust: demo | `75243f70731f` |
| [evidence/review/acceptance/suite-runs/grounded-research-failing.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/evidence/review/acceptance/suite-runs/grounded-research-failing.json) | grounded-research-failing.json | deterministic-fixture · trust: demo | `75243f70731f` |
| [evidence/review/acceptance/suite-runs/grounded-research-passing.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/evidence/review/acceptance/suite-runs/grounded-research-passing.json) | grounded-research-passing.json | deterministic-fixture · trust: demo | `75243f70731f` |
| [evidence/review/acceptance/suite-runs/http-application-failing.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/evidence/review/acceptance/suite-runs/http-application-failing.json) | http-application-failing.json | owned-http-recording · trust: self-reported | `75243f70731f` |
| [evidence/review/acceptance/suite-runs/http-application-passing.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/evidence/review/acceptance/suite-runs/http-application-passing.json) | http-application-passing.json | owned-http-recording · trust: self-reported | `75243f70731f` |
| [evidence/review/acceptance/browser/run-1.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/evidence/review/acceptance/browser/run-1.json) | recorded-model-run.json | recorded-real-inference · trust: self-reported | `75243f70731f` |
| [evidence/review/acceptance/suite-runs/security-resilience-failing.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/evidence/review/acceptance/suite-runs/security-resilience-failing.json) | security-resilience-failing.json | deterministic-fixture · trust: demo | `75243f70731f` |
| [evidence/review/acceptance/suite-runs/security-resilience-passing.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/evidence/review/acceptance/suite-runs/security-resilience-passing.json) | security-resilience-passing.json | deterministic-fixture · trust: demo | `75243f70731f` |
| [evidence/review/acceptance/suite-runs/structured-agent-failing.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/evidence/review/acceptance/suite-runs/structured-agent-failing.json) | structured-agent-failing.json | deterministic-fixture · trust: demo | `75243f70731f` |
| [evidence/review/acceptance/suite-runs/structured-agent-passing.json](https://github.com/akilanpl/praxis/blob/75243f70731fb5b8001ff39c64d83af9a02120b5/evidence/review/acceptance/suite-runs/structured-agent-passing.json) | structured-agent-passing.json | deterministic-fixture · trust: demo | `75243f70731f` |

Existing `demos/praxis/evidence/` screenshots and reports are byte-for-byte unchanged. No additional raw runtime acceptance records were copied.

## Verification and accessibility

Run from repository root:

```sh
python3 -m http.server 8767 --bind 127.0.0.1
# In another cloud shell; Playwright and Chromium required:
python3 tests/praxis-data.py /path/to/read-only/praxis-checkout
python3 tests/praxis-browser.py
# Optional automated accessibility sampling, with axe-core installed outside this repo:
python3 tests/praxis-accessibility.py /path/to/axe-core/axe.min.js
```

- Five data regression tests pass, including exact source equality, genuine assertion summaries, public-field sanitization and historical output integrity.
- Sixteen browser acceptance groups pass: all 40 task selections, passing/failing/recorded replay, real outputs/assertions, agent and HTTP examples, copy, JSON download, print, five persistent walkthrough states, onboarding, existing project smoke checks and homepage beta metadata.
- Additional checks pass for the recorded-result deep link and stop/restart replay control.
- Keyboard skip-link, visible focus and native select operation pass. Reduced motion completes replay without paced animation. PASS/FAIL/DEMO use text as well as color.
- No document horizontal overflow at 390/768/1024/1280/1440 across eleven workspace states. Compact navigation, task lists and assertion tables intentionally scroll within their own regions; the assertion region is keyboard-focusable.
- Axe sampled eleven states at 390 and 1280: zero detected WCAG A/AA violations. Incomplete contrast checks for clipped/offscreen items in scrollable containers remain in `accessibility-results.json`; visual review checked the actual rendered colors. This is not exhaustive screen-reader/WCAG certification.
- No console errors, failed responses, broken observed assets, or Praxis API traffic in the complete browser journey. A root favicon removes the browser’s default missing-icon request.
- Seven source/branch/archive/installation URLs returned HTTP 200, including the codeload archive redirect. This verifies link access, not installation execution.

Detailed receipts: [browser](browser-results.json), [accessibility](accessibility-results.json), [links](link-results.json), [cold local performance](performance-cold.json).

## Browser performance

The isolated cold-context workspace rendered its heading by the observed 232 ms checkpoint and loaded about 152 KB of uncompressed resource bodies (including font, all suite definitions and the initial report). Larger reports load on demand and are cached in memory. The application JavaScript is about 25 KB, with no added production dependency/build step.

Warm local page-load observations were 17–53 ms across the requested viewports. These are cloud-loopback Chromium observations, not production network or Core Web Vitals claims. Screenshots are documentation assets and are not fetched by the demo.

## Screenshots

All fifteen images were inspected as viewport contact sheets, with detailed mobile/desktop evidence review. Full-page screenshots include the article, workspace and task inspector at each requested width.

| Width | Product article | Workspace | Task evidence |
|---|---|---|---|
| 390px | [Page](screenshots/page-390.png) | [Workspace](screenshots/workspace-390.png) | [Evidence](screenshots/evidence-390.png) |
| 768px | [Page](screenshots/page-768.png) | [Workspace](screenshots/workspace-768.png) | [Evidence](screenshots/evidence-768.png) |
| 1024px | [Page](screenshots/page-1024.png) | [Workspace](screenshots/workspace-1024.png) | [Evidence](screenshots/evidence-1024.png) |
| 1280px | [Page](screenshots/page-1280.png) | [Workspace](screenshots/workspace-1280.png) | [Evidence](screenshots/evidence-1280.png) |
| 1440px | [Page](screenshots/page-1440.png) | [Workspace](screenshots/workspace-1440.png) | [Evidence](screenshots/evidence-1440.png) |

## Remaining limits

This is a faithful static demonstration, not the installed application. No current inference, backend, account persistence, real target configuration, authentic public blind match, voting or model ranking is provided. Clipboard access depends on browser secure-context policy; selectable output remains available on failure. Tests use Chromium in cloud; Safari/Firefox and exhaustive assistive-technology acceptance were not performed. Original Praxis runtime tests were not rerun because the source application was read-only and unchanged.

The PR targets `main` from `codex/praxis-interactive-experience`; no merge or production deployment is part of this work. See the PR for the exact destination commit and review status.
