# Panel de subida de contenido + integración automática

Esta carpeta (`backend/`) y `admin/` son la única pieza **no estática** de
todo el proyecto — rompen deliberadamente la decisión de "sin backend" que
rige el resto de la app (ver `CLAUDE.md`). El resto de la app sigue siendo
100% HTML/CSS/JS estático servido por GitHub Pages.

## Qué hace

1. Abres `/admin` en la web, metes la contraseña, subes un PDF o pegas un
   link, y añades notas de contexto.
2. Un **Cloudflare Worker** valida la contraseña, sube el PDF a una rama
   nueva del repo (si hay PDF) y dispara un workflow de GitHub Actions.
3. Ese workflow instala Python/`poppler-utils`/Playwright, y corre el
   **Claude Agent SDK** (el mismo motor de Claude Code) con acceso a
   Bash/ficheros para construir el contenido real, siguiendo las
   convenciones de `CLAUDE.md`, verificar con Playwright, y auditar su
   propio trabajo contra la fuente.
4. Al terminar, abre una **Pull Request en borrador** a `main` — nunca
   mergea sola. La revisas y la mergeas tú, desde GitHub (web o móvil).

## Coste real

Esto no es gratis como el resto de la app:
- **API de Anthropic**: cada integración cuesta tokens reales, facturados
  a tu propia cuenta/API key — separado de tu plan de Claude Code o
  claude.ai. El tope por defecto es 8 USD por integración
  (`AGENT_MAX_BUDGET_USD`, variable de repositorio de GitHub Actions,
  ajustable si hace falta para fuentes muy largas).
- **GitHub Actions**: gratis si el repo es público; si es privado, cuenta
  contra los minutos gratuitos mensuales (cada integración tarda
  aproximadamente 5-20 min, así que el riesgo de agotar el cupo con uso
  personal es bajo).
- **Cloudflare Workers**: la capa gratuita sobra de largo para este uso.

## Configuración (una sola vez)

### 1. Cuenta de Cloudflare + desplegar el Worker

```bash
cd backend/worker
npm install
npx wrangler login
npx wrangler secret put ADMIN_PASSCODE   # elige tú la contraseña del panel
npx wrangler secret put GITHUB_TOKEN     # ver paso 2
npx wrangler deploy
```

Al terminar, `wrangler deploy` imprime la URL real del Worker (algo como
`https://hud-clinico-uci-admin.<tu-subdominio>.workers.dev`). Cópiala en
`admin/admin.js` (constante `WORKER_URL`, con `/api/submit` al final) y
comitea ese cambio.

### 2. Token de GitHub de grano fino

En GitHub → Settings → Developer settings → Fine-grained tokens → crea
uno con acceso **solo a este repositorio** y estos permisos:
- Contents: **Read and write**
- Pull requests: **Read and write**
- Actions: **Read and write**

Ese token es el que metes en `wrangler secret put GITHUB_TOKEN` arriba.

### 3. API key de Anthropic, como secreto del repo (no del Worker)

En GitHub → este repo → Settings → Secrets and variables → Actions →
New repository secret:
- `ANTHROPIC_API_KEY`: tu API key de la consola de Anthropic
  (console.anthropic.com), no tu login de Claude Code/claude.ai.

Opcional, como **Variables** (no secretos) del mismo sitio, si quieres
ajustar el comportamiento sin tocar código:
- `AGENT_MODEL` (por defecto `claude-sonnet-5`; sube a `claude-opus-5`
  si necesitas más calidad en fuentes difíciles, a costa de más coste)
- `AGENT_MAX_TURNS` (por defecto 80)
- `AGENT_MAX_BUDGET_USD` (por defecto 8)

### 4. Primera prueba — a mano, antes de exponerlo por la web

Sigue el orden ya decidido: valida el pipeline real (Actions + agente)
disparándolo tú mismo antes de fiarte del panel público.

1. Sube un PDF corto (2-3 páginas) a `docs/incoming/` en una rama de
   prueba y comitéalo.
2. En GitHub → Actions → "Integrar contenido nuevo" → Run workflow, con
   `source_pdf_path` = la ruta de ese PDF, `branch` = tu rama de prueba,
   y unas notas cortas.
3. Sigue el *run* en vivo. Si el Agent SDK falla por un nombre de opción
   incorrecto (ver la nota al principio de `backend/agent/run.mjs`),
   corrígelo ahí contra el error real de los logs.
4. Cuando termine, revisa la PR en borrador a mano contra el PDF, con el
   mismo criterio de auditoría que ya se usa en el resto del proyecto,
   antes de aprobarla.

Solo cuando este paso dé resultados de calidad aceptable, usa el panel
`/admin` de verdad — GitHub Pages lo sirve automáticamente en cuanto esta
carpeta se mergea a `main`, en `<tu-dominio>/admin/`.

### 5. Después de la primera ejecución real

- Fija la versión exacta del Agent SDK que se resolvió (`npm install` en
  `backend/agent/` deja un `package-lock.json` — comitéalo, y cambia
  `"latest"` por esa versión exacta en `package.json`, para que futuras
  ejecuciones no cambien de comportamiento solas).

## Qué NO hace este sistema

- No mergea nunca a `main` por sí solo.
- No toca `backend/` ni `admin/` (el propio agente tiene esa regla
  explícita en `backend/agent/system-prompt.md`).
- No sustituye a las sesiones normales de Claude Code — sigue siendo
  igual de válido pedirle contenido nuevo aquí, directamente. Este
  sistema es solo un atajo para cuando no quieres abrir una sesión.
