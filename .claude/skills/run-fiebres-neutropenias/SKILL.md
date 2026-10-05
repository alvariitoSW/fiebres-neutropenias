---
name: run-fiebres-neutropenias
description: Build, run, and drive the "HUD Clínico UCI" static web app (fiebres-neutropenias). Use when asked to start the app, serve it locally, take a screenshot of a view/ficha/calculadora, test navigation or the global search, or confirm a change renders correctly in the running app.
---

A pure static HTML/CSS/JS site, no build tool, no `package.json`. Serve it
with Python's built-in http server, then drive it headless via the
Playwright REPL at `.claude/skills/run-fiebres-neutropenias/driver.mjs`.

All paths below are relative to the repo root.

## Prerequisites

Nothing to install — `python3` and Node 22 with a global Playwright +
pre-installed Chromium are already present in this container
(`PLAYWRIGHT_BROWSERS_PATH=/opt/pw-browsers`). No `apt-get` needed.

## Build

None — there is no build step. The app is the repo as-is.

## Run (agent path)

1. Start the static server (poll the port, don't `sleep`):

```bash
cd /home/user/fiebres-neutropenias
nohup python3 -m http.server 8000 > /tmp/http-server.log 2>&1 &
disown
timeout 15 bash -c 'until curl -sf http://localhost:8000/ >/dev/null; do sleep 0.3; done'
```

Stop it with `lsof -ti:8000 -sTCP:LISTEN | xargs -r kill` before relaunching,
or the next run hits `EADDRINUSE`.

2. Launch the driver REPL under tmux and poke it:

```bash
tmux new-session -d -s app -x 200 -y 50
tmux send-keys -t app 'cd /home/user/fiebres-neutropenias && node .claude/skills/run-fiebres-neutropenias/driver.mjs' Enter
timeout 20 bash -c 'until tmux capture-pane -t app -p | grep -q "driver>"; do sleep 0.2; done'
tmux send-keys -t app 'launch' Enter
timeout 30 bash -c 'until tmux capture-pane -t app -p | grep -q "launched\."; do sleep 0.3; done'
tmux send-keys -t app 'ss landing' Enter
timeout 10 bash -c 'until tmux capture-pane -t app -p | grep -q "screenshot:"; do sleep 0.2; done'
tmux send-keys -t app 'console --errors' Enter
tmux capture-pane -t app -p
```

Then actually open the screenshot (`Read` tool on the PNG path) — don't
trust the "screenshot:" line alone.

Screenshots land in `/tmp/shots/` (override: `SCREENSHOT_DIR`). The driver
launches at a 390×844 mobile viewport by default (this app is built
"para consultarse a pie de cama en el móvil" per `CLAUDE.md`) — that's
also the viewport every verification pass in this repo's history uses, so
match it unless the task specifically needs desktop width.

### Commands

| command | what it does |
|---|---|
| `launch` | launch headless Chromium, navigate to `http://localhost:8000/` |
| `nav <path-or-url>` | go to another path (relative to the base URL) or full URL |
| `ss [name]` | screenshot → `/tmp/shots/<name>.png` |
| `click <css-sel>` | DOM click (not coordinate-based — see Gotchas) |
| `click-text <text>` | click first `button`/`a`/`[role=button]` whose text matches — **scope it or use `eval` instead on this app, see Gotchas** |
| `type <text>` / `press <key>` | keyboard input on the focused element |
| `wait <css-sel>` | wait up to 10s for a selector |
| `eval <js-expr>` | evaluate an expression in the page, prints JSON |
| `text [css-sel]` | print `innerText` of a selector (or `body`) |
| `console [--errors]` | print captured console/page-error messages |
| `quit` | close the browser, exit the REPL |

## Run (human path)

```bash
python3 -m http.server 8000   # from the repo root
```

Open `http://localhost:8000/` in a real browser. Opening `index.html`
directly via `file://` does **not** work — `fetch()` of the HTML partials
(`data-include`) requires `http(s)`. Ctrl-C to stop.

## Test

No test suite — this project has none (verification is always "launch it
and look," per `CLAUDE.md`'s own `## Cómo probar cambios`).

---

## Gotchas

- **Playwright must be imported by absolute path.** This repo has no
  `package.json`/`node_modules` at all — a bare `import 'playwright'`
  fails with `Cannot find package 'playwright'`. Playwright is a *global*
  module in this container at `/opt/node22/lib/node_modules/playwright`;
  the driver imports `/opt/node22/lib/node_modules/playwright/index.mjs`
  directly. Don't "fix" this to a bare import.

- **Every specialty's HTML is loaded into the DOM at once, even when
  hidden** (`data-include` fetches all partials on startup — see
  `js/core/include.js` / `CLAUDE.md`'s own warning on `core/tabs.js`
  about unscoped `.tab-content.active` queries). This means **text-based
  or `.tab-content.active`-based selectors can silently match the wrong
  element** in a totally different, invisible specialty panel that
  happens to share wording or also carries the `active` class. Hit this
  for real: `click-text` on a search-result label matched a hidden
  duplicate instead of the visible `.search-result-row`, and filling
  `.tab-content.active input[type="number"]` wrote into a calculator in
  a different, unrelated ficha. **Always prefer a precise `#id` (every
  real input/button in this app has one) or scope the query to the
  specific panel id** (e.g. `#citrato-diagnostico input`, not
  `.tab-content.active input`). Grep the module's `.html` for the exact
  `id` before scripting a fill/click.

- **Search results live under `.search-result-row`**, not just any
  clickable element with matching text (`js/core/search.js`) — scope
  clicks there explicitly when testing the 🔍 global search
  (`#btn-buscar-global`), rather than `click-text`.

- **Calculators update on the `input`/`change` event, not on value
  assignment alone.** Setting `el.value = '...'` via `eval` does nothing
  until you also `el.dispatchEvent(new Event('input', {bubbles:true}))`
  (these are plain vanilla-JS listeners, not React, so a bare `input`
  event is enough — no React-controlled-input dance needed).

- **Cache-busting query strings on CSS/JS** (`?v=YYYYMMDD[-N]` in
  `index.html`) mean a *second* http.server run on the same port after
  editing `css/*.css` or `js/main.js` needs that date bumped in
  `index.html`, same rule as production deploys (`CLAUDE.md`'s
  `### Cache-busting de CSS/JS`) — otherwise you may be screenshotting a
  browser-cached old stylesheet, not your edit. Irrelevant for a single
  one-off server start, but matters if you restart the server across
  edits to re-verify.

## Troubleshooting

- **`EADDRINUSE` on `:8000`**: a previous server is still up —
  `lsof -ti:8000 -sTCP:LISTEN | xargs -r kill` before restarting.
- **Driver REPL hangs after `launch`**: check `/tmp/http-server.log` —
  the server isn't actually serving yet (didn't poll `curl -sf` before
  launching Chromium), or crashed.
- **`click`/`click-text` reports `OK` but nothing visibly changes**: see
  the DOM-duplication Gotcha above — it very likely clicked a different,
  hidden element with matching text/selector. Verify with
  `eval document.querySelectorAll('<your-selector>').length` first; if
  it's more than 1, use a precise `#id` instead.
