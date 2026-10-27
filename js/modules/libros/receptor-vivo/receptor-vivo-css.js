// El CSS del receptor vivo (prefijo rcv-: todas las vistas comparten el DOM). Solo tokens de color de css/variables.css.
import { instalarCss } from '../../../core/dibujo-iso.js';
const CSS = `
:root {
  color-scheme: dark;
  --bg-main: #17140f;
  --bg-card: rgba(46, 38, 28, 0.72);
  --border-color: rgba(196, 154, 74, 0.35);
  --text-main: #ece3cc;
  --text-muted: #a5967c;
  --text-dim: #c9bda4;
  --accent-green: #90a06a;
  --accent-red: #b85c3e;
  --accent-yellow: #cf9a3e;
  --accent-blue: #d4af37;
  --accent-purple: #9c5476;
  --rcv-bg: var(--bg-main); --rcv-card: var(--bg-card); --rcv-card2: rgba(46, 38, 28, 1); --rcv-line: var(--border-color);
  --rcv-fg: var(--text-main); --rcv-dim: var(--text-dim); --rcv-muted: var(--text-muted);
  --rcv-oro: var(--accent-yellow); --rcv-oro-claro: var(--accent-blue); --rcv-rojo: var(--accent-red); --rcv-verde: var(--accent-green); --rcv-purpura: var(--accent-purple);
  --rcv-serif: Georgia, 'Times New Roman', serif;
  --rcv-sans: system-ui, -apple-system, 'Segoe UI', sans-serif;
  --rcv-dock-h: 152px;
}
.rcv-raiz, .rcv-raiz * { box-sizing: border-box; }
.rcv-raiz { color: var(--rcv-fg); font: 16px/1.5 var(--rcv-serif); padding: 8px max(12px, env(safe-area-inset-right, 0px)) calc(var(--rcv-dock-h) + var(--rcv-frase-h, 44px) + 16px) max(12px, env(safe-area-inset-left, 0px)); }
.rcv-main { max-width: 560px; margin: 0 auto; display: grid; gap: 10px; grid-template-columns: minmax(0, 1fr); }
.rcv-main > *, .rcv-bloque > * { min-width: 0; }
.rcv-raiz .rcv-titulo { font-size: 1.18rem; line-height: 1.2; margin: 0; color: var(--rcv-oro); font-weight: normal; }
.rcv-raiz .rcv-titulo em { color: var(--rcv-fg); }
.rcv-raiz h2 { font-size: 1.06rem; margin: 0 0 4px; color: var(--rcv-oro); font-weight: normal; }
.rcv-raiz h3 { font: 600 .74rem var(--rcv-sans); letter-spacing: .06em; text-transform: uppercase; color: var(--rcv-muted); margin: 4px 0 2px; }
.rcv-raiz p { margin: 0; }
.rcv-raiz button { font-family: inherit; }
.rcv-raiz button:focus-visible, .rcv-raiz input:focus-visible, .rcv-raiz summary:focus-visible, .rcv-raiz a:focus-visible { outline: 2px solid var(--rcv-oro); outline-offset: 2px; }
.rcv-aviso { font: 600 .66rem/1.2 var(--rcv-sans); letter-spacing: .06em; text-transform: uppercase; color: var(--rcv-bg); background: var(--rcv-oro); border-radius: 6px; padding: 3px 8px; width: fit-content; }
.rcv-cabecera { display: grid; gap: 5px; }
.rcv-lead { color: var(--rcv-dim); font-size: .9rem; line-height: 1.36; }
.rcv-org { font: .66rem/1.25 var(--rcv-sans); color: var(--rcv-muted); border: 1px solid var(--rcv-line); border-radius: 999px; padding: 0 6px; vertical-align: 1px; white-space: nowrap; }
.rcv-org.rcv-ilu { border-style: dashed; }
.rcv-org.rcv-otra { border-color: var(--rcv-purpura); color: var(--rcv-dim); }
.rcv-frase .rcv-org, .rcv-para .rcv-org, .rcv-nota-fuentes .rcv-org, .rcv-lead .rcv-org, .rcv-cas-txt .rcv-org, .rcv-raiz dd .rcv-org, .rcv-pieza-info .rcv-org, .rcv-ficha-pac .rcv-org, .rcv-guia-txt .rcv-org { white-space: normal; overflow-wrap: anywhere; }
.rcv-hl-a, .rcv-hl-r, .rcv-hl-v, .rcv-hl-p, .rcv-hl-azul { padding: 0 2px; border-radius: 2px; font-weight: 600; }
.rcv-hl-a { background: linear-gradient(to bottom, transparent 58%, rgba(207, 154, 62, .34) 58%); }
.rcv-hl-r { background: linear-gradient(to bottom, transparent 58%, rgba(184, 92, 62, .38) 58%); }
.rcv-hl-v { background: linear-gradient(to bottom, transparent 58%, rgba(144, 160, 106, .36) 58%); }
.rcv-hl-p { background: linear-gradient(to bottom, transparent 58%, rgba(156, 84, 118, .36) 58%); }
.rcv-hl-azul { background: linear-gradient(to bottom, transparent 58%, rgba(212, 175, 55, .32) 58%); color: var(--rcv-oro-claro); }
.rcv-interruptor { display: grid; grid-template-columns: repeat(2, 1fr); border: 1px solid var(--rcv-line); border-radius: 999px; overflow: hidden; font: .82rem/1.1 var(--rcv-sans); }
.rcv-interruptor button { min-height: 44px; background: transparent; color: var(--rcv-muted); border: 0; font: inherit; cursor: pointer; padding: 0 4px; }
.rcv-interruptor button + button { border-left: 1px solid var(--rcv-line); }
.rcv-interruptor button[aria-selected="true"] { background: var(--rcv-oro); color: var(--rcv-bg); font-weight: 600; }
.rcv-ficha-pac { font: .78rem/1.35 var(--rcv-sans); color: var(--rcv-dim); }
.rcv-ficha-pac b { color: var(--rcv-fg); }
.rcv-familias { display: grid; gap: 8px; }
.rcv-familia h3 { margin: 0 0 4px; }
.rcv-estados { display: flex; flex-wrap: wrap; gap: 6px; }
.rcv-estados button { min-height: 44px; padding: 4px 10px; border-radius: 12px; border: 1px solid var(--rcv-line); background: var(--rcv-card2); color: var(--rcv-dim); font: 600 .76rem/1.15 var(--rcv-sans); cursor: pointer; text-align: left; max-width: 100%; }
.rcv-estados button small { display: block; font-weight: 400; font-size: .62rem; color: var(--rcv-muted); }
.rcv-estados button[aria-pressed="true"] { background: var(--rcv-oro); color: var(--rcv-bg); border-color: var(--rcv-oro); }
.rcv-estados button[aria-pressed="true"] small { color: var(--rcv-bg); }
.rcv-raiz .monitor { --mon-cifras: 104px; --mon-v: 1.3rem; border-radius: 14px; padding: 6px; gap: 4px; box-shadow: inset 0 0 0 1px rgba(23, 20, 15, 1), inset 0 0 18px rgba(23, 20, 15, .9); }
.rcv-raiz .mon-cab { font-size: .66rem; }
#rcv-mon-quien { min-width: 0; overflow-wrap: anywhere; }
.rcv-pieza-info:empty { display: none; }
.rcv-raiz .mon-cab .rcv-pausa { white-space: nowrap; min-height: 32px; min-width: 44px; border: 1px solid var(--rcv-line); background: transparent; color: var(--rcv-dim); border-radius: 8px; font: 600 .68rem var(--rcv-sans); cursor: pointer; text-transform: none; letter-spacing: 0; position: relative; }
.rcv-raiz .mon-cab .rcv-pausa::after { content: ''; position: absolute; inset: -6px 0; }
.rcv-mon-botones { display: flex; gap: 6px; }
.rcv-raiz .cifra { padding-left: 7px; }
.rcv-raiz .cifra .et { font-size: .62rem; }
.rcv-raiz .cifra .obj { font-size: .6rem; white-space: normal; }
.rcv-raiz .marca { margin-left: 2px; font-size: .66rem; }
.rcv-perfusion { display: grid; grid-template-columns: repeat(5, minmax(0, 1fr)); gap: 3px; }
.rcv-celda { background: var(--rcv-card); border: 1px solid var(--rcv-card2); border-radius: 9px; padding: 3px 4px; min-width: 0; display: grid; align-content: start; cursor: pointer; text-align: left; color: var(--rcv-fg); font: inherit; min-height: 44px; }
.rcv-celda .rcv-k { font: .58rem/1.15 var(--rcv-sans); color: var(--rcv-muted); display: flex; justify-content: space-between; gap: 2px; white-space: nowrap; overflow: hidden; }
.rcv-celda .rcv-g { font: 700 .92rem/1.15 var(--rcv-sans); font-variant-numeric: tabular-nums; overflow-wrap: anywhere; }
.rcv-celda .rcv-t { font: .54rem/1.15 var(--rcv-sans); color: var(--rcv-muted); overflow-wrap: anywhere; }
.rcv-celda.no .rcv-g { color: var(--rcv-rojo); }
.rcv-celda.si .rcv-g { color: var(--rcv-verde); }
.rcv-celda.rcv-apagada { opacity: .5; }
.rcv-celda.rcv-encendida { border-color: var(--rcv-oro); }
.rcv-oculto .v, .rcv-oculto .rcv-g { color: var(--rcv-muted) !important; }
.rcv-mon-pie { display: flex; flex-wrap: wrap; gap: 4px 8px; align-items: center; font: .68rem/1.3 var(--rcv-sans); color: var(--rcv-muted); }
.rcv-detalle-fila { font: .78rem/1.4 var(--rcv-sans); color: var(--rcv-dim); background: var(--rcv-card); border-radius: 10px; padding: 6px 8px; display: grid; gap: 2px; }
.rcv-fig { border: 1px solid var(--rcv-line); border-radius: 14px; background: var(--bg-main); position: relative; overflow: hidden; display: grid; }
.rcv-fig-cab, .rcv-fig-pie { display: flex; justify-content: space-between; align-items: baseline; gap: 8px; padding: 6px 10px 0; font: 600 .66rem/1.25 var(--rcv-sans); color: var(--rcv-muted); letter-spacing: .03em; }
.rcv-fig-cab .rcv-n { color: var(--rcv-oro); text-transform: uppercase; letter-spacing: .08em; white-space: nowrap; }
.rcv-fig-cab .rcv-t { color: var(--rcv-dim); text-align: right; font-weight: 600; min-width: 0; }
.rcv-fig-pie { padding: 0 10px 7px; font-weight: 400; align-items: flex-end; }
.rcv-fig-pie { flex-wrap: wrap; }
.rcv-fig-pie .rcv-pista { color: var(--rcv-muted); font-style: italic; min-width: 0; flex: 1 1 15em; }
.rcv-fig-pie .rcv-lect { color: var(--rcv-fg); font: 600 .7rem/1.3 var(--rcv-sans); font-variant-numeric: tabular-nums; text-align: right; white-space: nowrap; }
.rcv-fig-pie .rcv-lect small { display: block; color: var(--rcv-muted); font-weight: 400; }
.rcv-fig svg { display: block; width: 100%; height: auto; touch-action: manipulation; }
.rcv-celulas { display: flex; flex-wrap: wrap; gap: 6px; }
.rcv-celulas button { min-height: 44px; padding: 4px 10px; border-radius: 999px; border: 1px solid var(--rcv-line); background: transparent; color: var(--rcv-dim); font: 600 .74rem/1.15 var(--rcv-sans); cursor: pointer; }
.rcv-celulas button[aria-pressed="true"] { background: var(--rcv-oro); color: var(--rcv-bg); border-color: var(--rcv-oro); }
.rcv-barra-lupa { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 8px; align-items: center; }
.rcv-seg { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); border: 1px solid var(--rcv-line); border-radius: 10px; overflow: hidden; min-width: 0; }
.rcv-seg button { min-height: 44px; font: 600 .72rem/1.1 var(--rcv-sans); background: transparent; color: var(--rcv-muted); border: 0; padding: 2px 6px; cursor: pointer; min-width: 0; }
.rcv-seg button + button { border-left: 1px solid var(--rcv-line); }
.rcv-seg button[aria-pressed="true"] { background: var(--rcv-oro); color: var(--rcv-bg); }
.rcv-seg button small { display: block; font-weight: 400; font-size: .58rem; }
.rcv-pieza-info { font: .8rem/1.4 var(--rcv-sans); color: var(--rcv-dim); background: var(--rcv-card); border-left: 3px solid var(--rcv-oro); border-radius: 0 10px 10px 0; padding: 6px 9px; display: grid; gap: 4px; }
.rcv-pieza-info b { color: var(--rcv-fg); }
.rcv-leyenda { display: flex; flex-wrap: wrap; gap: 4px 12px; font: .7rem/1.3 var(--rcv-sans); color: var(--rcv-dim); }
.rcv-leyenda span { display: inline-flex; align-items: center; gap: 4px; }
.rcv-leyenda svg { width: 20px; height: 16px; flex: none; }
.rcv-lamina-ancha { display: grid; grid-template-columns: 120px minmax(0, 1fr); gap: 8px; align-items: center; background: var(--rcv-card); border: 1px solid var(--rcv-card2); border-radius: 12px; padding: 6px; cursor: zoom-in; text-align: left; color: var(--rcv-dim); font: .78rem/1.35 var(--rcv-sans); width: 100%; min-height: 44px; }
.rcv-lamina-ancha .rcv-caja { background: var(--text-main); border-radius: 6px; padding: 2px; }
.rcv-lamina-ancha img { display: block; width: 100%; height: auto; }
.rcv-lamina-ancha b { color: var(--rcv-fg); }
.rcv-frase { position: fixed; left: 0; right: 0; bottom: var(--rcv-dock-h); z-index: 19; margin: 0; background: var(--bg-main); border-top: 1px solid var(--rcv-line);
  font: .84rem/1.3 var(--rcv-serif); color: var(--rcv-fg); padding: 5px max(14px, calc((100% - 560px) / 2)); box-shadow: inset 3px 0 0 var(--rcv-oro); cursor: pointer; }
.rcv-frase-txt { display: block; max-height: 30vh; overflow-y: auto; }
.rcv-frase-txt .rcv-org { white-space: normal; }
.rcv-frase:not(.rcv-abierta) .rcv-resto { display: none; }
.rcv-raiz button.rcv-b { min-height: 44px; font: 600 .86rem/1.2 var(--rcv-sans); background: var(--rcv-card2); color: var(--rcv-fg); border: 1px solid var(--rcv-line); border-radius: 10px; padding: 8px 12px; cursor: pointer; text-align: left; }
.rcv-raiz button.rcv-b.rcv-prim { background: var(--rcv-oro); color: var(--rcv-bg); border-color: var(--rcv-oro); }
.rcv-raiz button.rcv-b:disabled { opacity: .55; cursor: default; }
.rcv-fila { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.rcv-para { font: .82rem/1.45 var(--rcv-sans); color: var(--rcv-muted); }
.rcv-cita { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; }
.rcv-cita-ir { display: inline-flex; align-items: center; min-height: 44px; padding: 0 10px; border: 1px dashed var(--rcv-oro); border-radius: 999px; background: transparent; color: var(--rcv-oro); font: 600 .74rem/1.2 var(--rcv-sans); text-align: left; cursor: pointer; max-width: 100%; overflow-wrap: anywhere; }
.rcv-cita-ir.rcv-otra { border-color: var(--rcv-purpura); color: var(--rcv-dim); }
.rcv-cita-c { display: inline; white-space: nowrap; }
.rcv-cita-c .rcv-cita-pdf-c { margin-left: 4px; }
.rcv-cita-ir.rcv-cita-corta { display: inline-block; min-height: 0; padding: 1px 8px; font: 600 .68rem/1.4 var(--rcv-sans); position: relative; white-space: nowrap; }
.rcv-cita-ir.rcv-cita-corta::after { content: ''; position: absolute; inset: -13px -3px; }
.rcv-cita-pdf-c { font: .66rem var(--rcv-sans); color: var(--rcv-muted); text-decoration: underline; text-underline-offset: 2px; position: relative; }
.rcv-cita-pdf-c::after { content: ''; position: absolute; inset: -14px -6px; }
.rcv-cita-pdf { display: inline-flex; align-items: center; min-height: 44px; color: var(--rcv-muted); font: .72rem var(--rcv-sans); text-decoration: underline; text-underline-offset: 2px; }
.rcv-toast { position: fixed; left: 50%; top: 12px; transform: translateX(-50%); z-index: 40; width: min(92vw, 520px); background: var(--rcv-card2); border: 1px solid var(--rcv-oro); border-radius: 12px; padding: 10px 12px; font: .82rem/1.4 var(--rcv-sans); color: var(--rcv-fg); box-shadow: 0 8px 22px rgba(23, 20, 15, .9); }
.rcv-guia { display: grid; gap: 6px; font: .9rem/1.4 var(--rcv-serif); color: var(--rcv-fg); padding: 6px 0 4px; }
.rcv-guia-cab { display: flex; align-items: center; gap: 8px; min-width: 0; }
.rcv-guia-n { font: 700 .66rem/1.2 var(--rcv-sans); letter-spacing: .06em; text-transform: uppercase; color: var(--rcv-oro); white-space: nowrap; }
.rcv-guia-tit { flex: 1; min-width: 0; font: 600 .84rem/1.2 var(--rcv-sans); color: var(--rcv-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.rcv-guia-x { flex: none; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--rcv-line); background: transparent; color: var(--rcv-fg); font-size: 1.2rem; cursor: pointer; }
.rcv-guia-txt { margin: 0; border-left: 3px solid var(--rcv-oro); padding: 1px 0 1px 9px; max-height: 22vh; overflow-y: auto; }
.rcv-guia-nav { display: grid; grid-template-columns: auto 1fr auto; gap: 8px; align-items: center; }
.rcv-guia-b { min-height: 44px; padding: 0 14px; border-radius: 999px; border: 1px solid var(--rcv-line); background: var(--rcv-card); color: var(--rcv-fg); font: 600 .84rem var(--rcv-sans); cursor: pointer; }
.rcv-guia-b:disabled { opacity: .45; cursor: default; }
.rcv-guia-b.rcv-prim { background: var(--rcv-oro); border-color: var(--rcv-oro); color: var(--rcv-bg); }
.rcv-guia-puntos { display: flex; justify-content: center; gap: 5px; }
.rcv-guia-puntos i { width: 7px; height: 7px; border-radius: 50%; border: 1px solid var(--rcv-oro); }
.rcv-guia-puntos i.rcv-hecho { background: var(--rcv-oro); opacity: .5; }
.rcv-guia-puntos i.rcv-aqui { background: var(--rcv-oro); }
.rcv-guia-anillo { fill: none; stroke: var(--rcv-oro-claro); stroke-width: 2.4; stroke-dasharray: 6 3; vector-effect: non-scaling-stroke; pointer-events: none; }
.rcv-guia-marco { box-shadow: 0 0 0 2px var(--rcv-oro-claro) !important; border-radius: 8px; }
@media (prefers-reduced-motion: no-preference) {
.rcv-guia-anillo { animation: rcv-guia-late 1.4s ease-in-out infinite; }
.rcv-entra { animation: rcv-entra .25s ease-out; }

}
@keyframes rcv-guia-late { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
@keyframes rcv-entra { from { opacity: .3; } to { opacity: 1; } }
.rcv-dock { position: fixed; left: 0; right: 0; bottom: 0; z-index: 20; background: var(--bg-main); border-top: 1px solid var(--rcv-line);
  padding: 4px max(8px, env(safe-area-inset-left, 0px)) calc(4px + env(safe-area-inset-bottom, 0px)); }
.rcv-dock-in { max-width: 560px; margin: 0 auto; display: grid; gap: 4px; }
.rcv-bomba { display: grid; grid-template-columns: 112px minmax(0, 1fr); gap: 6px; align-items: center; background: var(--rcv-card); border: 1px solid var(--rcv-card2); border-radius: 12px; padding: 3px 6px 3px 3px; }
.rcv-bomba-dib { display: block; width: 112px; height: 58px; }
.rcv-bomba-mando { display: grid; gap: 0; min-width: 0; position: relative; }
.rcv-bomba-cab { display: flex; justify-content: space-between; gap: 6px; font: .62rem/1.2 var(--rcv-sans); color: var(--rcv-dim); }
.rcv-bomba-cab b { color: var(--rcv-fg); font-weight: 600; }
.rcv-tramos { position: relative; height: 7px; border-radius: 4px; margin: 2px 8px 0; overflow: hidden; display: flex; }
.rcv-tramos i { display: block; height: 100%; }
.rcv-bomba-mando input { width: 100%; min-height: 34px; accent-color: var(--rcv-oro); margin: 0; }
.rcv-bomba-marcas { position: relative; height: 12px; margin: 0 8px; font: .58rem/1 var(--rcv-sans); color: var(--rcv-muted); }
.rcv-bomba-marcas span { position: absolute; transform: translateX(-50%); white-space: nowrap; }
.rcv-bomba-tramo-txt { font: .62rem/1.2 var(--rcv-sans); color: var(--rcv-dim); }
.rcv-candado { display: flex; align-items: center; gap: 6px; font: .68rem/1.25 var(--rcv-sans); color: var(--rcv-dim); }
.rcv-candado svg { width: 18px; height: 20px; flex: none; }
.rcv-tog { min-height: 44px; display: inline-flex; align-items: center; justify-content: center; gap: 2px; padding: 2px 8px; border-radius: 10px; background: var(--rcv-card2); border: 1px solid var(--rcv-line); color: var(--rcv-fg); font: 600 .72rem/1.1 var(--rcv-sans); cursor: pointer; min-width: 0; text-align: center; flex-direction: column; }
.rcv-tog small { display: block; font-weight: 400; font-size: .58rem; color: var(--rcv-muted); }
.rcv-tog[aria-pressed="true"] { border-color: var(--rcv-oro); background: rgba(207, 154, 62, .22); box-shadow: inset 0 0 0 1px var(--rcv-oro); }
.rcv-dock-nota { font: .64rem/1.3 var(--rcv-sans); color: var(--rcv-muted); }
.rcv-dock-est { display: grid; gap: 4px; padding: 6px 0; }
.rcv-pasos { display: flex; gap: 4px; }
.rcv-pasos i { flex: 1; height: 6px; border-radius: 3px; background: var(--rcv-card2); border: 1px solid rgba(196, 154, 74, .2); }
.rcv-pasos i.rcv-on { background: var(--rcv-oro); border-color: var(--rcv-oro); }
.rcv-pasos i.rcv-mal { background: var(--rcv-rojo); border-color: var(--rcv-rojo); }
.rcv-pasos i.rcv-aqui { box-shadow: 0 0 0 2px var(--rcv-oro-claro); }
.rcv-dock-est-txt { font: .74rem/1.3 var(--rcv-sans); color: var(--rcv-muted); display: flex; justify-content: space-between; gap: 8px; }
.rcv-bloque { display: grid; gap: 8px; }
.rcv-raiz details.rcv-plegable { background: var(--rcv-card); border: 1px solid var(--rcv-card2); border-radius: 12px; padding: 2px 12px; }
.rcv-raiz details.rcv-plegable summary { cursor: pointer; min-height: 44px; display: flex; align-items: center; font: 600 .86rem var(--rcv-sans); color: var(--rcv-dim); }
.rcv-raiz details.rcv-plegable[open] { padding-bottom: 12px; }
.rcv-raiz details.rcv-farmaco summary { color: var(--rcv-fg); }
.rcv-raiz details.rcv-farmaco summary small { font-weight: 400; color: var(--rcv-muted); margin-left: 6px; }
.rcv-raiz dl.rcv-kv { display: grid; grid-template-columns: minmax(0, 1fr); gap: 2px; margin: 0; font: .82rem/1.45 var(--rcv-sans); }
.rcv-raiz dl.rcv-kv dt { color: var(--rcv-oro); font: 700 .66rem var(--rcv-sans); letter-spacing: .06em; text-transform: uppercase; margin-top: 8px; }
.rcv-raiz dl.rcv-kv dd { margin: 0; color: var(--rcv-dim); display: grid; gap: 4px; min-width: 0; overflow-wrap: anywhere; }
.rcv-raiz dl.rcv-kv dd b { color: var(--rcv-fg); }
.rcv-dosis-lista { list-style: none; margin: 0; padding: 0; display: grid; gap: 6px; }
.rcv-dosis-lista li { border-left: 2px solid var(--rcv-line); padding-left: 8px; display: grid; gap: 1px; }
.rcv-otra-fuente { border-left: 3px solid var(--rcv-purpura); background: var(--rcv-card2); border-radius: 0 10px 10px 0; padding: 6px 9px; display: grid; gap: 4px; }
.rcv-nota-fuentes { border-left: 3px solid var(--rcv-purpura); background: var(--rcv-card); border-radius: 0 10px 10px 0; padding: 8px 10px; font: .8rem/1.45 var(--rcv-sans); color: var(--rcv-dim); display: grid; gap: 4px; }
.rcv-nota-fuentes b { color: var(--rcv-fg); }
.rcv-nota-tipo { display: inline-block; width: fit-content; font: 700 .62rem var(--rcv-sans); letter-spacing: .05em; text-transform: uppercase; color: var(--rcv-fg); background: var(--rcv-purpura); border-radius: 5px; padding: 1px 6px; }
.rcv-nota-tipo.rcv-calla { background: var(--rcv-muted); color: var(--rcv-bg); }
.rcv-nota-tipo.rcv-autor { background: var(--rcv-oro); color: var(--rcv-bg); }
.rcv-nota-tipo.rcv-errata { background: var(--rcv-rojo); }
.rcv-raiz ul.rcv-lista { margin: 6px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; font: .82rem/1.45 var(--rcv-sans); color: var(--rcv-dim); }
.rcv-raiz ul.rcv-lista li { border-left: 2px solid var(--rcv-line); padding-left: 8px; min-width: 0; overflow-wrap: anywhere; display: grid; gap: 2px; }
.rcv-tabla-crece { width: 100%; border-collapse: collapse; font: .74rem/1.35 var(--rcv-sans); color: var(--rcv-dim); }
.rcv-tabla-crece th, .rcv-tabla-crece td { border-top: 1px solid var(--rcv-line); padding: 5px 4px; text-align: left; vertical-align: top; }
.rcv-tabla-crece th { color: var(--rcv-oro); font-weight: 600; }
.rcv-envuelve { overflow-x: auto; }
#rcv-visor { width: min(96vw, 560px); max-height: 92vh; padding: 10px; border: 1px solid var(--rcv-oro); border-radius: 14px; background: var(--rcv-card2); color: var(--rcv-fg); }
#rcv-visor::backdrop { background: rgba(23, 20, 15, .82); }
#rcv-visor .rcv-caja-img { background: var(--text-main); border-radius: 8px; padding: 4px; }
#rcv-visor img { display: block; width: 100%; height: auto; max-height: 62vh; object-fit: contain; }
#rcv-visor p { font: .84rem/1.4 var(--rcv-sans); color: var(--rcv-dim); margin-top: 8px; }
.rcv-formato { background: var(--rcv-card); border: 1px solid var(--rcv-line); border-radius: 14px; padding: 12px; display: grid; gap: 10px; min-width: 0; }
.rcv-cab-preg { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
.rcv-num { font: 700 .76rem var(--rcv-sans); color: var(--rcv-oro); border: 1px solid var(--rcv-oro); border-radius: 6px; padding: 1px 7px; }
.rcv-tipo { font: 600 .68rem var(--rcv-sans); letter-spacing: .06em; text-transform: uppercase; color: var(--rcv-muted); }
.rcv-grupo { font: 700 .66rem var(--rcv-sans); letter-spacing: .06em; text-transform: uppercase; color: var(--rcv-bg); background: var(--rcv-dim); border-radius: 6px; padding: 1px 6px; }
.rcv-grupo.rcv-examen { background: var(--rcv-rojo); color: var(--rcv-fg); }
.rcv-grupo.rcv-caso { background: var(--rcv-purpura); color: var(--rcv-fg); }
.rcv-pregunta { font-size: 1rem; line-height: 1.45; }
.rcv-op { display: grid; gap: 8px; }
.rcv-op button.rcv-elegida-bien { border-color: var(--rcv-verde); }
.rcv-op button.rcv-elegida-mal { border-color: var(--rcv-rojo); }
.rcv-respuesta { background: var(--rcv-card2); border-radius: 10px; padding: 12px; display: grid; gap: 8px; min-width: 0; font: .9rem/1.45 var(--rcv-serif); }
.rcv-ok { color: var(--rcv-verde); font: 600 .9rem var(--rcv-sans); }
.rcv-mal { color: var(--rcv-rojo); font: 600 .9rem var(--rcv-sans); }
.rcv-dia { font: 700 .74rem var(--rcv-sans); letter-spacing: .06em; text-transform: uppercase; color: var(--rcv-purpura); }
.rcv-raiz dl.rcv-paciente { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; margin: 0; font: .82rem/1.35 var(--rcv-sans); background: var(--rcv-card2); border-radius: 10px; padding: 8px 10px; }
.rcv-raiz dl.rcv-paciente dt { color: var(--rcv-muted); }
.rcv-raiz dl.rcv-paciente dd { margin: 0; color: var(--rcv-fg); }
.rcv-raiz dl.rcv-paciente dd.rcv-cambia { color: var(--rcv-rojo); font-weight: 600; }
.rcv-dib text { font-family: var(--rcv-serif); }
.rcv-dib .rcv-rot { fill: var(--text-dim); font-style: italic; }
.rcv-dib .rcv-espasmo { fill: var(--accent-red); font: 700 12px var(--rcv-sans); font-style: normal; }
.rcv-dib .rcv-fondo { fill: var(--bg-main); }
.rcv-dib .rcv-punto { fill: var(--text-dim); }
.rcv-dib .rcv-halo-s { fill: var(--bg-main); opacity: .7; }
.rcv-dib .rcv-oro { fill: var(--accent-blue); stroke: var(--bg-main); stroke-width: .6; stroke-linejoin: round; }
.rcv-dib .rcv-oro-osc { fill: var(--accent-yellow); stroke: var(--bg-main); stroke-width: .6; stroke-linejoin: round; }
.rcv-dib .rcv-crema { fill: var(--text-main); stroke: var(--bg-main); stroke-width: .6; stroke-linejoin: round; }
.rcv-dib .rcv-ciega { fill: var(--bg-main); stroke: var(--text-main); stroke-width: 1; stroke-linejoin: round; }
.rcv-dib .rcv-ciega-b { fill: none; stroke: var(--text-main); stroke-width: 1.6; stroke-linecap: round; }
.rcv-dib .rcv-hueco { fill: var(--bg-main); stroke: var(--text-dim); stroke-width: .6; }
.rcv-dib .rcv-sangre { fill: var(--accent-red); fill-opacity: .16; stroke: var(--text-main); stroke-width: .8; }
.rcv-dib .rcv-luz { fill: var(--bg-main); stroke: var(--text-main); stroke-width: .9; }
.rcv-dib .rcv-liso { fill: url(#rcv-g-liso); stroke: var(--text-main); stroke-width: .7; stroke-linejoin: round; }
.rcv-dib .rcv-liso.rcv-on { fill: url(#rcv-g-liso-on); }
.rcv-dib .rcv-nucleo { fill: url(#rcv-g-punteado); stroke: var(--text-dim); stroke-width: .6; }
.rcv-dib .rcv-endo { fill: var(--rcv-card2); stroke: var(--text-dim); stroke-width: .5; }
.rcv-dib .rcv-elastica { fill: none; stroke: var(--text-main); stroke-width: .8; }
.rcv-dib .rcv-adventicia { fill: url(#rcv-g-fina); stroke: var(--text-muted); stroke-width: .7; }
.rcv-dib .rcv-nervio { fill: none; stroke: var(--text-dim); stroke-width: 1.6; stroke-linecap: round; }
.rcv-dib .rcv-varic { fill: var(--rcv-card2); stroke: var(--text-dim); stroke-width: .7; }
.rcv-dib .rcv-miocito { fill: url(#rcv-g-miocito); stroke: var(--text-main); stroke-width: .8; stroke-linejoin: round; }
.rcv-dib .rcv-estria { stroke: var(--text-muted); stroke-width: .45; }
.rcv-dib .rcv-disco { fill: none; stroke: var(--text-main); stroke-width: 1; }
.rcv-dib .rcv-cartilago { fill: url(#rcv-g-punteado); stroke: var(--text-main); stroke-width: .8; }
.rcv-dib .rcv-epitelio { fill: var(--rcv-card2); stroke: var(--text-dim); stroke-width: .5; }
.rcv-dib .rcv-gran { fill: var(--accent-purple); fill-opacity: .55; stroke: var(--text-main); stroke-width: .6; }
.rcv-dib .rcv-gran-p { fill: var(--text-main); }
.rcv-dib .rcv-tubo { fill: var(--rcv-card2); stroke: var(--text-dim); stroke-width: .7; }
.rcv-dib .rcv-tubo-luz { fill: var(--accent-red); fill-opacity: .2; stroke: none; }
.rcv-dib .rcv-esfera { fill: var(--rcv-card2); stroke: var(--text-main); stroke-width: .8; }
.rcv-dib .rcv-aguja { stroke: var(--text-main); stroke-width: 1.3; stroke-linecap: round; }
.rcv-dib .rcv-ampc { fill: var(--accent-blue); stroke: var(--bg-main); stroke-width: .5; }
.rcv-dib .rcv-atp { fill: var(--rcv-card2); stroke: var(--text-dim); stroke-width: .6; }
.rcv-dib .rcv-tinta-oro { fill: none; stroke: var(--accent-blue); stroke-width: .9; stroke-linecap: round; }
.rcv-dib .rcv-ap { opacity: .14; }
.rcv-dib [data-pieza] { cursor: pointer; }
.rcv-dib .rcv-marca-pin { stroke: var(--accent-red); stroke-width: 1; stroke-dasharray: 2 2; }
.rcv-org, .rcv-frase .rcv-org, .rcv-para .rcv-org, .rcv-nota-fuentes .rcv-org, .rcv-lead .rcv-org, .rcv-cas-txt .rcv-org, .rcv-raiz dd .rcv-org, .rcv-pieza-info .rcv-org, .rcv-ficha-pac .rcv-org, .rcv-guia-txt .rcv-org, .rcv-frase-txt .rcv-org { display: inline-block; white-space: nowrap; overflow-wrap: normal; max-width: 100%; overflow: hidden; text-overflow: ellipsis; vertical-align: bottom; }

.rcv-formato [data-accion], .rcv-formato button { scroll-margin-bottom: calc(var(--rcv-dock-h, 190px) + 16px); }
.rcv-eyebrow { font: 600 .68rem var(--rcv-sans); letter-spacing: .08em; text-transform: uppercase; color: var(--rcv-muted); }
.rcv-h { font: 600 1.15rem/1.25 var(--rcv-serif); margin: 2px 0 6px; }
.rcv-ruta { font: .84rem/1.5 var(--rcv-sans); color: var(--rcv-dim); display: grid; gap: 4px; }
.rcv-punto { display: flex; gap: 10px; align-items: flex-start; font: .94rem/1.45 var(--rcv-serif); cursor: pointer; min-height: 44px; padding: 4px 0; }
.rcv-punto input { margin-top: 4px; width: 20px; height: 20px; accent-color: var(--accent-green); flex: none; }
.rcv-raiz .rcv-frase-e { display: flex; gap: 10px; width: 100%; min-height: 44px; font: .95rem/1.45 var(--rcv-serif); background: transparent; color: var(--text-main); border: 1px solid var(--rcv-card2); border-radius: 8px; padding: 8px 10px; text-align: left; cursor: pointer; }
.rcv-frase-e .rcv-n { font: 700 .76rem var(--rcv-sans); color: var(--rcv-muted); padding-top: 3px; }
.rcv-frase-e.rcv-marcada { border-color: var(--accent-yellow); background: rgba(207, 154, 62, .1); }
.rcv-frase-e.rcv-acierto { border-color: var(--accent-green); }
.rcv-frase-e.rcv-fallo { border-color: var(--accent-red); background: rgba(184, 92, 62, .12); }
.rcv-correccion { font: .88rem/1.45 var(--rcv-sans); color: var(--rcv-dim); padding: 2px 0 0 26px; }
.rcv-mando { border: 1px dashed var(--accent-yellow); border-radius: 12px; padding: 8px 10px; display: grid; gap: 6px; background: rgba(207, 154, 62, .06); }
.rcv-mando .rcv-pista { font: .84rem/1.4 var(--rcv-sans); color: var(--accent-yellow); }
.rcv-fuente-p { font: .72rem/1.6 var(--rcv-sans); color: var(--rcv-muted); }
.rcv-lleva { display: grid; gap: 6px; margin: 0; padding-left: 20px; }
.rcv-lleva li { font: .94rem/1.45 var(--rcv-serif); }
.rcv-repaso-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.rcv-casos-lista { display: grid; gap: 8px; }
.rcv-casos-lista button small { display: block; font-weight: 400; color: var(--rcv-muted); }
.rcv-raiz button.rcv-b.rcv-link { display: inline-flex; flex-direction: column; align-items: flex-start; justify-content: center; text-align: left; background: transparent; border-style: dashed; color: var(--accent-yellow); }
.rcv-nuevo { font: 700 .62rem var(--rcv-sans); letter-spacing: .06em; text-transform: uppercase; border: 1px solid var(--rcv-rojo); border-radius: 4px; padding: 0 4px; }
.rcv-consecuencia p { margin: 2px 0 0; }
@media (prefers-reduced-motion: reduce) { .rcv-entra { animation: none; } }
`;
export const instalarCssReceptor = () => instalarCss('receptor-vivo', CSS);
