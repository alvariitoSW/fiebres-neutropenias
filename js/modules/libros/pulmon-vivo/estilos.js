// El CSS del pulmón con respirador, acotado a .pul-raiz (una sola vez, al arrancar el modelo; core/dibujo-iso.js instalarCss).
// Solo tokens de css/variables.css (la pantalla del respirador, de respirador.js, lleva su propia paleta clara de equipo real).
import { RESPIRADOR_CSS } from './respirador.js';
import { ESCENA_CSS } from './escena.js';
export const PUL_CSS = `
.pul-raiz { --card2: color-mix(in srgb, var(--text-main) 9%, var(--bg-main)); --line: var(--border-color); --serif: Georgia, 'Times New Roman', serif; --sans: system-ui, -apple-system, 'Segoe UI', sans-serif;
  display: grid; gap: 8px; min-width: 0; padding-bottom: calc(var(--dock-h, 190px) + 14px); }
.pul-raiz > * { min-width: 0; }
.pul-raiz p { margin: 0; }
.pul-raiz button { font-family: inherit; }
.pul-raiz .pul-cabecera { display: grid; gap: 4px; }
.pul-raiz .pul-eyebrow { font: 600 .68rem var(--sans); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); margin: 0; }
.pul-raiz h2.pul-titulo { font-size: 1.22rem; line-height: 1.2; margin: 0; color: var(--accent-yellow); font-weight: normal; }
.pul-raiz h2.pul-titulo em { color: var(--text-main); }
.pul-raiz .pul-main { display: grid; gap: 6px; grid-template-columns: minmax(0, 1fr); }
.pul-raiz .pul-main > * { min-width: 0; }
.pul-raiz .cab { display: flex; align-items: baseline; justify-content: space-between; gap: 6px; flex-wrap: wrap; }
.pul-raiz .cab h1 { font-size: 1rem; white-space: nowrap; line-height: 1.2; margin: 0; color: var(--accent-yellow); font-weight: normal; }
.pul-raiz .cab h1 em { color: var(--text-main); }
.pul-raiz .aviso { flex: 0 1 auto; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; min-width: 0; font: 600 .62rem/1.2 var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--bg-main); background: var(--accent-yellow); border-radius: 6px; padding: 3px 6px; }
.pul-raiz .org { font: .66rem/1.25 var(--sans); color: var(--text-muted); border: 1px solid var(--line); border-radius: 999px; padding: 0 6px; white-space: nowrap; }
.pul-raiz .org.ilu { border-style: dashed; }
.pul-raiz .hl-azul, .pul-raiz .hl-verde, .pul-raiz .hl-rojo { padding: 0 2px; border-radius: 2px; font-weight: 600; }
.pul-raiz .hl-azul { background: linear-gradient(to bottom, transparent 58%, color-mix(in srgb, var(--accent-blue) 32%, transparent) 58%); color: var(--accent-blue); }
.pul-raiz .hl-verde { background: linear-gradient(to bottom, transparent 58%, color-mix(in srgb, var(--accent-green) 36%, transparent) 58%); }
.pul-raiz .hl-rojo { background: linear-gradient(to bottom, transparent 58%, color-mix(in srgb, var(--accent-red) 38%, transparent) 58%); }
.pul-raiz .interruptor { display: grid; grid-template-columns: repeat(3, 1fr); border: 1px solid var(--line); border-radius: 999px; overflow: hidden; font: .8rem/1.1 var(--sans); }
.pul-raiz .interruptor button { min-height: 44px; background: transparent; color: var(--text-muted); border: 0; font: inherit; cursor: pointer; padding: 0 4px; }
.pul-raiz .interruptor button + button { border-left: 1px solid var(--line); }
.pul-raiz .interruptor button[aria-selected="true"] { background: var(--accent-yellow); color: var(--bg-main); font-weight: 600; }
.pul-raiz .pacientes { display: flex; gap: 5px; overflow-x: auto; scrollbar-width: none; padding-bottom: 1px; }
.pul-raiz .pacientes::-webkit-scrollbar { display: none; }
.pul-raiz .pacientes button { flex: none; min-height: 44px; padding: 2px 10px; border-radius: 999px; border: 1px solid var(--line); background: var(--card2); color: var(--text-dim); font: 600 .74rem/1.1 var(--sans); cursor: pointer; text-align: left; }
.pul-raiz .pacientes button small { display: block; font-weight: 400; font-size: .62rem; color: var(--text-muted); }
.pul-raiz .pacientes button[aria-pressed="true"] { background: var(--accent-yellow); color: var(--bg-main); border-color: var(--accent-yellow); }
.pul-raiz .pacientes button[aria-pressed="true"] small { color: var(--bg-main); }
.pul-raiz .ficha-pac { font: .72rem/1.3 var(--sans); color: var(--text-dim); white-space: normal; overflow-wrap: anywhere; }
.pul-raiz .ficha-pac b { color: var(--text-main); }
/* El monitor: la pieza común (js/core/monitor.js pone su CSS). Aquí, solo lo propio de la cabecera del shock */
.pul-raiz .mon-cab { overflow: hidden; justify-content: flex-start; gap: 5px; text-transform: none; letter-spacing: .03em; }
.pul-raiz .mon-cab .quien { flex: 1; min-width: 0; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.pul-raiz .chip-b { min-height: 30px; min-width: 40px; border: 1px solid var(--line); background: transparent; color: var(--text-dim); border-radius: 8px; font: 600 .66rem var(--sans); cursor: pointer; padding: 0 6px; }
.pul-raiz .chip-b[aria-pressed="true"] { background: color-mix(in srgb, var(--accent-yellow) 24%, transparent); border-color: var(--accent-yellow); color: var(--text-main); }
.pul-raiz .chip-b:disabled { opacity: .45; cursor: default; }
.pul-raiz .monitor { --mon-v: .95rem; }
.pul-raiz .cifra { padding-left: 5px; }
.pul-raiz .c-sat { color: var(--text-dim); }
.pul-raiz .cifra.c-sat .v { color: var(--text-dim); }
.pul-raiz .c-co2 { color: var(--text-muted); }
.pul-raiz .mon-chispa, .pul-raiz .mon-infla, .pul-raiz .mon-vacia { fill: var(--accent-blue); }
.pul-raiz .calc { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 3px; }
.pul-raiz .calc .celda .t { display: none; }
.pul-raiz .celda { background: var(--card2); border: 0; border-radius: 8px; padding: 2px 5px; min-width: 0; display: grid; cursor: pointer; text-align: left; color: var(--text-main); font: inherit; min-height: 34px; }
.pul-raiz .celda .k { font: .58rem/1.15 var(--sans); color: var(--text-muted); display: flex; justify-content: space-between; gap: 2px; }
.pul-raiz .celda .g { font: 700 .92rem/1.15 var(--sans); font-variant-numeric: tabular-nums; white-space: nowrap; }
.pul-raiz .celda .g small { font: 600 .54rem var(--sans); color: var(--text-dim); margin-left: 1px; }
.pul-raiz .celda .t { font: .55rem/1.15 var(--sans); color: var(--text-muted); overflow-wrap: anywhere; }
.pul-raiz .celda.no .g { color: var(--accent-red); }
.pul-raiz .celda.si .g { color: var(--accent-green); }
.pul-raiz .consola-tira { display: flex; flex-wrap: wrap; gap: 2px 10px; align-items: center; font: .7rem/1.3 ui-monospace, Menlo, monospace; color: var(--accent-blue); background: var(--bg-main); border: 1px solid color-mix(in srgb, var(--accent-yellow) 30%, transparent); border-radius: 8px; padding: 3px 7px; }
.pul-raiz .consola-tira b { color: var(--text-main); font-weight: 600; }
.pul-raiz .consola-aviso { flex-basis: 100%; font: 600 .72rem/1.35 var(--sans); color: var(--text-main); border-left: 3px solid var(--accent-red); padding-left: 6px; }
.pul-raiz .discrepa { display: flex; flex-wrap: wrap; gap: 4px 8px; align-items: center; font: .72rem/1.35 var(--sans); color: var(--text-dim); border-left: 3px solid var(--accent-purple); background: var(--bg-card); border-radius: 0 8px 8px 0; padding: 4px 8px; }
.pul-raiz .discrepa .nota-tipo { flex: none; }
.pul-raiz .velo-tapa { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; background: color-mix(in srgb, var(--bg-main) 94%, transparent); border-radius: inherit; font: 600 .86rem/1.35 var(--sans); color: var(--text-dim); padding: 16px; z-index: 3; }
.pul-raiz .detalle-fila { font: .76rem/1.4 var(--sans); color: var(--text-dim); background: var(--bg-card); border-radius: 10px; padding: 5px 8px; display: grid; gap: 2px; }
/* La escena */
.pul-raiz .escena-caja { position: relative; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: var(--bg-main); }
.pul-raiz .esc-pest { display: flex; gap: 4px; align-items: center; padding: 4px 4px 0; }
.pul-raiz .esc-pest .chip-b { min-height: 32px; }
.pul-raiz .esc-pest .sep { flex: 1; }
.pul-raiz #pul-esc-svg { display: block; width: 100%; height: auto; }
.pul-raiz .sello { position: absolute; left: 50%; top: 52%; transform: translate(-50%, -50%) rotate(-8deg); border: 3px solid var(--accent-red); color: var(--accent-red); background: color-mix(in srgb, var(--bg-main) 70%, transparent); font: 800 .95rem/1.15 var(--sans); letter-spacing: .08em; text-transform: uppercase; padding: 6px 12px; border-radius: 8px; text-align: center; pointer-events: none; max-width: 86%; }
.pul-raiz .sello small { display: block; font: 600 .66rem/1.25 var(--sans); letter-spacing: 0; text-transform: none; color: var(--text-main); }
.pul-raiz .escena-caja.gris #pul-esc-svg { filter: grayscale(1); opacity: .55; }
.pul-raiz .fig-esq { position: absolute; left: 8px; bottom: 5px; font: 600 .62rem var(--sans); color: var(--text-muted); pointer-events: none; }
.pul-raiz .fig-lectura { position: absolute; right: 8px; bottom: 5px; font: .62rem ui-monospace, Menlo, monospace; color: var(--text-dim); pointer-events: none; text-align: right; max-width: 60%; }
.pul-raiz .leyenda { display: flex; flex-wrap: wrap; gap: 4px; }
.pul-raiz .leyenda button { min-height: 36px; font: .7rem/1.2 var(--sans); background: var(--card2); color: var(--text-dim); border: 1px solid var(--line); border-radius: 8px; padding: 3px 7px; cursor: pointer; text-align: left; }
.pul-raiz .leyenda button b { color: var(--accent-yellow); margin-right: 3px; font-variant-numeric: tabular-nums; }
.pul-raiz .leyenda button[aria-pressed="true"] { border-color: var(--accent-blue); color: var(--text-main); }
.pul-raiz .leyenda-txt { font: .76rem/1.4 var(--sans); color: var(--text-dim); }
.pul-raiz .escena-aparato [data-foco="fuera"] { opacity: .3; }
.pul-raiz .escena-aparato .dp.lit-sel .iso-l.mid, .pul-raiz .escena-aparato .dp.lit-sel .iso-l.lo { stroke: var(--accent-blue); }
.pul-raiz .escena-aparato .dp.lit-sel { filter: drop-shadow(0 0 2px color-mix(in srgb, var(--accent-blue) 60%, transparent)); }
/* Laboratorio, tendencias y abajo */
.pul-raiz .plegable { background: var(--bg-card); border: 1px solid var(--card2); border-radius: 12px; padding: 2px 10px; }
.pul-raiz .plegable summary { cursor: pointer; min-height: 44px; display: flex; align-items: center; font: 600 .84rem var(--sans); color: var(--text-dim); }
.pul-raiz .plegable[open] { padding-bottom: 10px; }
.pul-raiz .lab { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; }
.pul-raiz .lab .celda { cursor: default; }
.pul-raiz .tendencia { width: 100%; height: 64px; display: block; }
.pul-raiz .tend-l { fill: none; stroke-width: 1.4; }
.pul-raiz .tend-t { font: 9.5px var(--sans); fill: var(--text-muted); }
.pul-raiz ul.lista { margin: 4px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; font: .8rem/1.45 var(--sans); color: var(--text-dim); }
.pul-raiz ul.lista li { border-left: 2px solid var(--line); padding-left: 8px; min-width: 0; overflow-wrap: anywhere; display: grid; gap: 2px; }
.pul-raiz .nota { border-left: 3px solid var(--accent-purple); background: var(--bg-card); border-radius: 0 10px 10px 0; padding: 7px 9px; font: .78rem/1.45 var(--sans); color: var(--text-dim); display: grid; gap: 3px; }
.pul-raiz .nota b { color: var(--text-main); }
.pul-raiz .nota-tipo { display: inline-block; width: fit-content; font: 700 .6rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--text-main); background: var(--accent-purple); border-radius: 5px; padding: 1px 6px; }
.pul-raiz .nota-tipo.calla { background: var(--text-muted); color: var(--bg-main); }
.pul-raiz .nota-tipo.autor { background: var(--accent-yellow); color: var(--bg-main); }
.pul-raiz .nota-tipo.errata { background: var(--accent-red); }
.pul-raiz .tira { display: flex; flex-wrap: wrap; gap: 8px; }
.pul-raiz .lamina-libro { display: grid; gap: 2px; justify-items: center; background: var(--text-main); border: 1px solid var(--line); border-radius: 8px; padding: 3px; cursor: zoom-in; min-height: 44px; width: 104px; }
.pul-raiz .lamina-libro img { display: block; height: 58px; width: 96px; object-fit: contain; }
.pul-raiz .lamina-libro span { font: 600 .6rem/1.15 var(--sans); color: var(--bg-main); text-align: center; }
.pul-raiz dialog#pul-visor { width: min(96vw, 560px); max-height: 92vh; padding: 10px; border: 1px solid var(--accent-yellow); border-radius: 14px; background: var(--card2); color: var(--text-main); }
.pul-raiz dialog#pul-visor::backdrop { background: color-mix(in srgb, var(--bg-main) 85%, transparent); }
.pul-raiz #pul-visor img { display: block; width: 100%; height: auto; max-height: 62vh; object-fit: contain; background: var(--text-main); border-radius: 8px; }
.pul-raiz #pul-visor p { font: .84rem/1.4 var(--sans); color: var(--text-dim); margin-top: 8px; }
/* Citas (como core/citas.js) */
.pul-raiz .cita { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; }
.pul-raiz .cita-ir { display: inline-flex; align-items: center; min-height: 40px; padding: 0 10px; border: 1px dashed var(--accent-yellow); border-radius: 999px; background: transparent; color: var(--accent-yellow); font: 600 .72rem/1.2 var(--sans); text-align: left; cursor: pointer; max-width: 100%; overflow-wrap: anywhere; }
.pul-raiz .cita-pdf { display: inline-flex; align-items: center; min-height: 40px; color: var(--text-muted); font: .7rem var(--sans); text-decoration: underline; text-underline-offset: 2px; }
.pul-raiz .toast { position: fixed; left: 50%; top: 10px; transform: translateX(-50%); z-index: 40; width: min(92vw, 520px); background: var(--card2); border: 1px solid var(--accent-yellow); border-radius: 12px; padding: 10px 12px; font: .8rem/1.4 var(--sans); color: var(--text-main); }
/* Dock fijo: la frase (entera), las pestañas y los mandos */
.pul-raiz .dock { position: fixed; left: 0; right: 0; bottom: 0; z-index: 20; background: var(--bg-main); border-top: 1px solid var(--line); padding: 4px max(8px, env(safe-area-inset-left, 0px)) calc(4px + env(safe-area-inset-bottom, 0px)); }
.pul-raiz .dock-in { max-width: 560px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr); gap: 3px; }
.pul-raiz .frase { display: flex; gap: 6px; align-items: flex-start; font: .8rem/1.32 var(--serif); color: var(--text-main); box-shadow: inset 3px 0 0 var(--accent-yellow); padding: 2px 0 2px 8px; }
.pul-raiz .frase-txt { flex: 1; min-width: 0; }
.pul-raiz .frase-txt .org { white-space: nowrap; }
.pul-raiz .frase-txt .estado { font: 700 .62rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--accent-yellow); display: block; }
.pul-raiz .btn-guia { flex: none; min-height: 44px; min-width: 44px; border-radius: 10px; border: 1px solid var(--accent-yellow); background: var(--accent-yellow); color: var(--bg-main); font: 700 .7rem/1.1 var(--sans); cursor: pointer; padding: 2px 6px; }
.pul-raiz .dock-tabs { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 2px; }
.pul-raiz .dock-tabs button { min-height: 38px; background: transparent; border: 0; border-bottom: 2px solid transparent; color: var(--text-muted); font: 600 .72rem/1.1 var(--sans); cursor: pointer; padding: 0 1px; }
.pul-raiz .dock-tabs button[aria-selected="true"] { color: var(--accent-yellow); border-bottom-color: var(--accent-yellow); }
.pul-raiz .dock-panel { display: grid; gap: 3px; align-content: start; min-height: 64px; }
.pul-raiz .seg { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
.pul-raiz .seg button { min-height: 44px; font: 600 .7rem/1.1 var(--sans); background: transparent; color: var(--text-muted); border: 0; padding: 2px; cursor: pointer; min-width: 0; }
.pul-raiz .seg button + button { border-left: 1px solid var(--line); }
.pul-raiz .seg button[aria-pressed="true"] { background: var(--accent-yellow); color: var(--bg-main); }
.pul-raiz .seg button small { display: block; font-weight: 400; font-size: .56rem; }
.pul-raiz .rejilla { display: grid; gap: 4px; grid-template-columns: repeat(var(--n, 3), minmax(0, 1fr)); }
.pul-raiz .tog { min-height: 44px; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 2px 6px; border-radius: 10px; background: var(--card2); border: 1px solid var(--line); color: var(--text-main); font: 600 .7rem/1.1 var(--sans); cursor: pointer; min-width: 0; text-align: center; }
.pul-raiz .tog small { display: block; font-weight: 400; font-size: .56rem; color: var(--text-muted); }
.pul-raiz .tog[aria-pressed="true"] { border-color: var(--accent-yellow); background: color-mix(in srgb, var(--accent-yellow) 22%, transparent); }
.pul-raiz .tog:disabled { opacity: .45; cursor: default; }
.pul-raiz .deslizador { display: grid; grid-template-columns: minmax(0, 1fr) 124px; gap: 6px; align-items: center; min-height: 44px; }
.pul-raiz .deslizador input { width: 100%; min-height: 40px; accent-color: var(--accent-yellow); margin: 0; }
.pul-raiz .deslizador output { font: 700 .8rem/1.15 var(--sans); text-align: right; font-variant-numeric: tabular-nums; }
.pul-raiz .deslizador output small { display: block; font: 600 .6rem var(--sans); color: var(--text-muted); }
.pul-raiz .dock-nota { font: .64rem/1.25 var(--sans); color: var(--text-muted); }
.pul-raiz .pasos { display: flex; gap: 4px; }
.pul-raiz .pasos i { flex: 1; height: 6px; border-radius: 3px; background: var(--card2); }
.pul-raiz .pasos i.on { background: var(--accent-green); }
.pul-raiz .pasos i.mal { background: var(--accent-red); }
.pul-raiz .pasos i.aqui { box-shadow: 0 0 0 2px var(--accent-blue); }
.pul-raiz .dock-est-txt { font: .72rem/1.3 var(--sans); color: var(--text-muted); display: flex; justify-content: space-between; gap: 8px; }
/* Explicación guiada (en el dock) */
.pul-raiz .guia { display: grid; grid-template-columns: minmax(0, 1fr); gap: 5px; font: .86rem/1.4 var(--serif); }
.pul-raiz .guia > *, .pul-raiz .dock-in > * { min-width: 0; }
.pul-raiz .guia .cita-ir { white-space: normal; text-align: left; }
.pul-raiz .guia-cab { display: flex; align-items: center; gap: 8px; }
.pul-raiz .guia-n { font: 700 .64rem/1.2 var(--sans); letter-spacing: .06em; text-transform: uppercase; color: var(--accent-yellow); white-space: nowrap; }
.pul-raiz .guia-tit { flex: 1; min-width: 0; font: 600 .8rem/1.2 var(--sans); color: var(--text-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.pul-raiz .guia-x { flex: none; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--line); background: transparent; color: var(--text-main); font-size: 1.2rem; cursor: pointer; }
.pul-raiz .guia-txt { margin: 0; border-left: 3px solid var(--accent-yellow); padding: 1px 0 1px 9px; max-height: 24vh; overflow-y: auto; }
.pul-raiz .guia-nav { display: grid; grid-template-columns: minmax(0, auto) minmax(0, 1fr) minmax(0, auto); gap: 6px; align-items: center; }
.pul-raiz .guia-puntos { min-width: 0; overflow: hidden; }
@media (max-width: 370px) { .pul-raiz .guia-txt { max-height: 20vh; } }
.pul-raiz .guia-b { min-height: 44px; padding: 0 10px; white-space: nowrap; max-width: 100%; overflow: hidden; text-overflow: ellipsis; border-radius: 999px; border: 1px solid var(--line); background: var(--card2); color: var(--text-main); font: 600 .82rem var(--sans); cursor: pointer; }
.pul-raiz .guia-b:disabled { opacity: .45; }
.pul-raiz .guia-b.prim { background: var(--accent-yellow); border-color: var(--accent-yellow); color: var(--bg-main); }
.pul-raiz .guia-puntos { display: flex; justify-content: center; gap: 5px; }
.pul-raiz .guia-puntos i { width: 7px; height: 7px; border-radius: 50%; border: 1px solid var(--accent-yellow); }
.pul-raiz .guia-puntos i.hecho { background: var(--accent-yellow); opacity: .5; }
.pul-raiz .guia-puntos i.aqui { background: var(--accent-yellow); }
.pul-raiz .guia-anillo { fill: none; stroke: var(--accent-blue); stroke-width: 2.2; stroke-dasharray: 6 3; vector-effect: non-scaling-stroke; pointer-events: none; }
.pul-raiz .guia-marco { box-shadow: 0 0 0 2px var(--accent-blue) !important; border-radius: 8px; }
@media (prefers-reduced-motion: no-preference) { .pul-raiz .guia-anillo { animation: late 1.4s ease-in-out infinite; } }
@keyframes late { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
/* Formatos (¿Qué shock es? y Mayéutica) */
.pul-raiz .formato { background: var(--bg-card); border: 1px solid var(--line); border-radius: 14px; padding: 10px; display: grid; gap: 8px; min-width: 0; }
.pul-raiz .cab-preg { display: flex; gap: 6px; align-items: baseline; flex-wrap: wrap; }
.pul-raiz .num { font: 700 .74rem var(--sans); color: var(--accent-yellow); border: 1px solid var(--accent-yellow); border-radius: 6px; padding: 1px 7px; }
.pul-raiz .tipo { font: 600 .66rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
.pul-raiz .grupo { font: 700 .64rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--bg-main); background: var(--text-dim); border-radius: 6px; padding: 1px 6px; }
.pul-raiz .grupo.examen { background: var(--accent-red); color: var(--text-main); }
.pul-raiz .grupo.repaso { background: var(--accent-yellow); color: var(--bg-main); }
.pul-raiz .grupo.caso { background: var(--accent-purple); color: var(--text-main); }
.pul-raiz .pregunta { font-size: .98rem; line-height: 1.45; }
.pul-raiz .op { display: grid; gap: 6px; }
.pul-raiz button.b { min-height: 44px; font: 600 .82rem/1.25 var(--sans); background: var(--card2); color: var(--text-main); border: 1px solid var(--line); border-radius: 10px; padding: 8px 11px; cursor: pointer; text-align: left; }
.pul-raiz button.b.prim { background: var(--accent-yellow); color: var(--bg-main); border-color: var(--accent-yellow); }
.pul-raiz button.b:disabled { opacity: .6; cursor: default; }
.pul-raiz button.b.bien { border-color: var(--accent-green); box-shadow: inset 3px 0 0 var(--accent-green); }
.pul-raiz button.b.malb { border-color: var(--accent-red); box-shadow: inset 3px 0 0 var(--accent-red); }
.pul-raiz button.b.marcada { border-color: var(--accent-yellow); background: color-mix(in srgb, var(--accent-yellow) 18%, var(--card2)); }
.pul-raiz .fila { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
.pul-raiz .respuesta { background: var(--card2); border-radius: 10px; padding: 10px; display: grid; gap: 6px; font: .88rem/1.45 var(--serif); }
.pul-raiz .ok { color: var(--accent-green); font: 600 .86rem var(--sans); }
.pul-raiz .mal { color: var(--accent-red); font: 600 .86rem var(--sans); }
.pul-raiz .para { font: .8rem/1.45 var(--sans); color: var(--text-muted); }
.pul-raiz .dia { font: 700 .72rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--accent-purple); }
.pul-raiz dl.paciente { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; margin: 0; font: .8rem/1.35 var(--sans); background: var(--card2); border-radius: 10px; padding: 7px 9px; }
.pul-raiz dl.paciente dt { color: var(--text-muted); }
.pul-raiz dl.paciente dd { margin: 0; }
.pul-raiz dl.paciente dd.nuevo { color: var(--accent-red); font-weight: 600; }
.pul-raiz .punto { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px; align-items: center; }
.pul-raiz .etapas { display: flex; gap: 4px; flex-wrap: wrap; }
.pul-raiz .etapas span { font: 600 .66rem var(--sans); border-radius: 999px; padding: 2px 8px; border: 1px solid var(--line); color: var(--text-muted); }
.pul-raiz .etapas span.on { border-color: var(--accent-yellow); color: var(--accent-yellow); }
.pul-raiz .interruptor { grid-template-columns: repeat(2, 1fr); }
.pul-raiz .lema { font: .9rem/1.35 var(--serif); color: var(--text-dim); }
.pul-raiz .mon-quien { font: 600 .7rem/1.2 var(--sans); color: var(--text-muted); letter-spacing: .04em; text-transform: uppercase; }
.pul-raiz .calc { grid-template-columns: repeat(3, minmax(0, 1fr)); }
.pul-raiz .lupa[open] { padding: 2px 4px 6px; }
.pul-raiz .calc .celda .t { display: block; }
.pul-raiz .escena-caja { padding: 0; }
.pul-raiz #pul-esc-svg { display: block; width: 100%; height: auto; }
.pul-raiz .leyenda button { min-height: 40px; }
.pul-raiz .dock-tabs { grid-auto-columns: minmax(0, 1fr); }
.pul-raiz .deslizador output b { color: var(--accent-yellow); }
.pul-raiz .dock-nota .org { white-space: normal; }
.pul-raiz .cambia { color: var(--accent-red); font-weight: 600; }
.pul-raiz .elegida-bien { border-color: var(--accent-green) !important; box-shadow: inset 3px 0 0 var(--accent-green); }
.pul-raiz .elegida-mal { border-color: var(--accent-red) !important; box-shadow: inset 3px 0 0 var(--accent-red); }
.pul-raiz .entra { animation: entra .25s ease-out; }
@keyframes entra { from { opacity: .4; transform: translateY(4px); } to { opacity: 1; transform: none; } }
@media (prefers-reduced-motion: reduce) { .pul-raiz .entra { animation: none; } }
`;
export { RESPIRADOR_CSS, ESCENA_CSS };
