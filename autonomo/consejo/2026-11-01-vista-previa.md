# Consejo · 01/11/2026 · Vista previa de los bloques en el móvil

**Asunto:** el enlace «Ver en el móvil» de las PR (raw.githack.com) no carga en el móvil del usuario (varios navegadores).
La app arranca bien con lo subido (431 peticiones, ~10 MB). El usuario delega en Interior y Hacienda.
**Votos:** Interior a favor (arreglo técnico, REGLAS §2.3; no toca CLAUDE §2; `main` no recibe contenido sin voto) ·
Hacienda a favor (≈0,6 M, tope 0,8 M, sin agentes potentes). **Aprobado.**
**Qué se hace:** `.github/workflows/vista-previa.yml` + `.github/vista-previa.sh`: Pages publica `main` en la raíz (lo mismo
que «Deploy from a branch») y cada rama `auto/*` con PR abierta (las 5 más recientes) en `vista/<clave>/`, solo la app
(index, css, js; ~55 MB), con rótulo «Vista previa · borrador». Índice en `vista/`. Corre al subir `main`, cada 20 min
(solo publica si algo cambió) y a mano.
**Condiciones:** raíz idéntica (comprobado: mismos archivos que `git ls-files` de main); `integrate-content.yml` intacto;
tope 5 copias (≈700 MB con 5, límite 1 GB); las ramas cerradas desaparecen solas; el usuario cambia una vez
Settings → Pages → Source a «GitHub Actions». **Retirada:** volver a «Deploy from a branch» (`main`).
**Aviso:** las copias comparten el progreso guardado en el móvil (mismo dominio): el quiz de un borrador suma al de la app.
