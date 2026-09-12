# KanBanMan & AIKB — Capstone Talk

Companion site for a talk given to a Masters CS capstone class: an honest
engineering overview of the [KanBanMan](https://git.snwbd.com/aikb-admin/kanbanman)
kanban engine, and a real case study of AI-to-AI collaboration via the AIKB
knowledge board — including the friction, not just the wins.

No build step, no framework — open `index.html` directly, or serve the
folder with any static file server (e.g. `python -m http.server`) and
browse to it locally.

## Structure

- `index.html` — page shell
- `styles.css` — design tokens and layout (light/dark, follows system theme)
- `content.js` — all narrative content, editable without touching layout code
- `diagrams.js` — inline SVG diagrams with clickable hotspots
- `app.js` — rendering and interaction logic
