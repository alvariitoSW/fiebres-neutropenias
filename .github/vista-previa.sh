#!/usr/bin/env bash
# Monta la web de GitHub Pages: la app de `main` en la raíz (igual que antes) y una copia de cada bloque en curso
# (ramas auto/* con PR abierta, las 5 más recientes) en vista/<clave>/, con un rótulo «Vista previa · borrador».
# Lo llama .github/workflows/vista-previa.yml. Decisión del Consejo (Interior y Hacienda) del 01/11/2026.
set -euo pipefail
SITIO=_site
MAX=5
rm -rf "$SITIO"; mkdir -p "$SITIO"

# 1. La raíz: todo lo que hay en main, tal cual (lo mismo que servía «Deploy from a branch»).
git archive HEAD | tar -x -C "$SITIO"

# 2. Los bloques en curso: ramas auto/* con PR abierta en este repositorio, las más recientes primero.
gh pr list --state open --limit 50 --json headRefName,updatedAt,isCrossRepository \
  --jq '[.[] | select(.isCrossRepository | not) | select(.headRefName | startswith("auto/"))] | sort_by(.updatedAt) | reverse | .[].headRefName' \
  | head -n "$MAX" > /tmp/ramas.txt || true
mkdir -p "$SITIO/vista"
ESTADO="main $(git rev-parse HEAD)"
LISTA=""
while read -r RAMA; do
  [ -z "$RAMA" ] && continue
  CLAVE="${RAMA#auto/}"; CLAVE="${CLAVE//\//-}"
  git fetch -q --depth 1 origin "$RAMA" || { echo "No se pudo traer $RAMA"; continue; }
  SHA="$(git rev-parse FETCH_HEAD)"
  DEST="$SITIO/vista/$CLAVE"; mkdir -p "$DEST"
  # Solo la app (sin PDF, sin el trabajo de los agentes): ~55 MB por copia.
  git archive FETCH_HEAD index.html css js $(git ls-tree --name-only FETCH_HEAD | grep -E '^(LICENSE\.txt|diagnostico\.html|\.nojekyll)$' || true) | tar -x -C "$DEST"
  ROTULO="<div style=\"box-sizing:border-box;width:100%;max-width:100vw;overflow-wrap:anywhere;background:var(--accent-yellow);color:var(--bg-main);font:600 13px/1.3 system-ui,sans-serif;padding:6px 12px;margin-bottom:12px;border-radius:6px;text-align:center\">Vista previa · borrador de <b>${CLAVE}</b> (aún no está en la app; los PDF de las fuentes no abren aquí) · <a href=\"../../\" style=\"color:inherit\">ir a la app</a></div>"
  # Dentro del contenedor de la app (el <body> coloca sus hijos en fila); margen abajo para separarlo de la cabecera.
  ROTULO="$ROTULO" perl -0pi -e 's/(<div class="app-container">)/$1\n$ENV{ROTULO}/' "$DEST/index.html"
  grep -q 'Vista previa · borrador' "$DEST/index.html" || { echo "No se pudo poner el rótulo en $CLAVE"; exit 1; }
  ESTADO="$ESTADO
$RAMA $SHA"
  LISTA="$LISTA<li><a href=\"$CLAVE/\">$CLAVE</a> <small>(${SHA:0:7})</small></li>"
done < /tmp/ramas.txt

cat > "$SITIO/vista/index.html" <<HTML
<!doctype html><html lang="es"><head><meta charset="utf-8"><meta name="viewport" content="width=device-width,initial-scale=1">
<title>Vista previa</title><link rel="stylesheet" href="../css/variables.css"><link rel="stylesheet" href="../css/base.css"></head>
<body style="padding:16px"><h1>Bloques en curso</h1><p>Borradores que aún no están en la app. Toca uno para verlo.</p>
<ul>${LISTA:-<li>Ninguno ahora mismo.</li>}</ul><p><a href="../">← Volver a la app</a></p></body></html>
HTML
echo "$ESTADO" > "$SITIO/vista/estado.txt"
echo "$ESTADO"
du -sh "$SITIO" "$SITIO"/vista/* 2>/dev/null || true
