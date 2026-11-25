# SolarArc web app

Project knowledge lives in [.ai-knowledge/](.ai-knowledge/README.md). At the start of every session read:
1. `.ai-knowledge/README.md` (index + hard rules)
2. `.ai-knowledge/10-progress.md` (what's done / next)
3. `.ai-knowledge/09-decisions.md` (agreed deviations, open questions)

Then load only the topic files relevant to the task.

Non-negotiables (details in `.ai-knowledge/04-data-and-content-rules.md`):
- No financial figures; no banned claims.
- All numbers only in `src/data/project.ts`.
- No hard-coded UI text — EN/AZ/RU locale files only.
- Simulator must stay honest (no tuning in the arch's favour).

After finishing work: update `10-progress.md`, and log new decisions in `09-decisions.md`.
