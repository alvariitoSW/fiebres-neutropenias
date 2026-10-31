// El CSS del shock vivo, acotado a .shv-raiz (se pone una sola vez, al arrancar el modelo; core/dibujo-iso.js instalarCss).
// Solo tokens de css/variables.css.
export const SHV_CSS = `
.shv-raiz { --card2: color-mix(in srgb, var(--text-main) 9%, var(--bg-main)); --line: var(--border-color); --serif: Georgia, 'Times New Roman', serif; --sans: system-ui, -apple-system, 'Segoe UI', sans-serif;
  display: grid; gap: 8px; min-width: 0; padding-bottom: calc(var(--dock-h, 190px) + 14px); }
.shv-raiz > * { min-width: 0; }
.shv-raiz .shv-cabecera { display: grid; gap: 4px; }
.shv-raiz .shv-eyebrow { font: 600 .68rem var(--sans); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); margin: 0; }
.shv-raiz h2.shv-titulo { font-size: 1.22rem; line-height: 1.2; margin: 0; color: var(--accent-yellow); font-weight: normal; }
.shv-raiz h2.shv-titulo em { color: var(--text-main); }
.shv-raiz .shv-main { display: grid; gap: 6px; grid-template-columns: minmax(0, 1fr); }
.shv-raiz .shv-main > * { min-width: 0; }
.shv-raiz p { margin: 0; }
.shv-raiz button { font-family: inherit; }
.shv-raiz h2 { font-size: 1.04rem; margin: 0 0 4px; color: var(--accent-yellow); font-weight: normal; }
.shv-raiz .org { font: .66rem/1.25 var(--sans); color: var(--text-muted); border: 1px solid var(--line); border-radius: 10px; padding: 0 6px; white-space: normal; }
.shv-raiz .org.ilu { border-style: dashed; }
.shv-raiz .hl-azul, .shv-raiz .hl-verde, .shv-raiz .hl-rojo { padding: 0 2px; border-radius: 2px; font-weight: 600; }
.shv-raiz .hl-azul { background: linear-gradient(to bottom, transparent 58%, color-mix(in srgb, var(--accent-blue) 32%, transparent) 58%); color: var(--accent-blue); }
.shv-raiz .hl-verde { background: linear-gradient(to bottom, transparent 58%, color-mix(in srgb, var(--accent-green) 36%, transparent) 58%); }
.shv-raiz .hl-rojo { background: linear-gradient(to bottom, transparent 58%, color-mix(in srgb, var(--accent-red) 38%, transparent) 58%); }
.shv-raiz .interruptor { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); border: 1px solid var(--line); border-radius: 999px; overflow: hidden; font: .8rem/1.1 var(--sans); }
.shv-raiz .interruptor button { min-height: 44px; background: transparent; color: var(--text-muted); border: 0; font: inherit; cursor: pointer; padding: 0 4px; }
.shv-raiz .interruptor button + button { border-left: 1px solid var(--line); }
.shv-raiz .interruptor button[aria-selected="true"] { background: var(--accent-yellow); color: var(--bg-main); font-weight: 600; }
.shv-raiz .pacientes { display: flex; gap: 5px; overflow-x: auto; scrollbar-width: none; padding-bottom: 1px; }
.shv-raiz .pacientes::-webkit-scrollbar { display: none; }
.shv-raiz .pacientes button { flex: none; min-height: 44px; padding: 2px 10px; border-radius: 999px; border: 1px solid var(--line); background: var(--card2); color: var(--text-dim); font: 600 .74rem/1.1 var(--sans); cursor: pointer; text-align: left; }
.shv-raiz .pacientes button small { display: block; font-weight: 400; font-size: .62rem; color: var(--text-muted); }
.shv-raiz .pacientes button[aria-pressed="true"] { background: var(--accent-yellow); color: var(--bg-main); border-color: var(--accent-yellow); }
.shv-raiz .pacientes button[aria-pressed="true"] small { color: var(--bg-main); }
.shv-raiz .ficha-pac { font: .72rem/1.3 var(--sans); color: var(--text-dim); }
.shv-raiz .ficha-pac b { color: var(--text-main); }
/* El monitor: la pieza común (js/core/monitor.js pone su CSS). Aquí, solo lo propio de la cabecera del shock */
.shv-raiz .mon-cab { overflow: hidden; justify-content: flex-start; gap: 5px; text-transform: none; letter-spacing: .03em; }
.shv-raiz .mon-cab .quien { flex: 1; min-width: 0; text-transform: uppercase; white-space: nowrap; overflow: hidden; text-overflow: ellipsis; }
.shv-raiz .chip-b { min-height: 30px; min-width: 40px; border: 1px solid var(--line); background: transparent; color: var(--text-dim); border-radius: 8px; font: 600 .66rem var(--sans); cursor: pointer; padding: 0 6px; }
.shv-raiz .chip-b[aria-pressed="true"] { background: color-mix(in srgb, var(--accent-yellow) 24%, transparent); border-color: var(--accent-yellow); color: var(--text-main); }
.shv-raiz .chip-b:disabled { opacity: .45; cursor: default; }
.shv-raiz .monitor { --mon-v: .95rem; }
.shv-raiz .cifra { padding-left: 5px; }
.shv-raiz .c-sat { color: var(--text-dim); }
.shv-raiz .cifra.c-sat .v { color: var(--text-dim); }
.shv-raiz .c-co2 { color: var(--text-muted); }
.shv-raiz .mon-chispa, .shv-raiz .mon-infla, .shv-raiz .mon-vacia { fill: var(--accent-blue); }
.shv-raiz .calc { display: grid; grid-template-columns: repeat(4, minmax(0, 1fr)); gap: 3px; }
.shv-raiz .calc .celda .t { display: none; }
.shv-raiz .celda { background: var(--card2); border: 0; border-radius: 8px; padding: 2px 5px; min-width: 0; display: grid; cursor: pointer; text-align: left; color: var(--text-main); font: inherit; min-height: 34px; }
.shv-raiz .celda .k { font: .58rem/1.15 var(--sans); color: var(--text-muted); display: flex; justify-content: space-between; gap: 2px; }
.shv-raiz .celda .g { font: 700 .92rem/1.15 var(--sans); font-variant-numeric: tabular-nums; white-space: nowrap; }
.shv-raiz .celda .g small { font: 600 .54rem var(--sans); color: var(--text-dim); margin-left: 1px; }
.shv-raiz .celda .t { font: .55rem/1.15 var(--sans); color: var(--text-muted); overflow-wrap: anywhere; }
.shv-raiz .celda.no .g { color: var(--accent-red); }
.shv-raiz .celda.si .g { color: var(--accent-green); }
.shv-raiz .consola-tira { display: flex; flex-wrap: wrap; gap: 2px 10px; align-items: center; font: .7rem/1.3 ui-monospace, Menlo, monospace; color: var(--accent-blue); background: var(--bg-main); border: 1px solid color-mix(in srgb, var(--accent-yellow) 30%, transparent); border-radius: 8px; padding: 3px 7px; }
.shv-raiz .consola-tira b { color: var(--text-main); font-weight: 600; }
.shv-raiz .consola-aviso { flex-basis: 100%; font: 600 .72rem/1.35 var(--sans); color: var(--text-main); border-left: 3px solid var(--accent-red); padding-left: 6px; }
.shv-raiz .discrepa { display: flex; flex-wrap: wrap; gap: 4px 8px; align-items: center; font: .72rem/1.35 var(--sans); color: var(--text-dim); border-left: 3px solid var(--accent-purple); background: var(--bg-card); border-radius: 0 8px 8px 0; padding: 4px 8px; }
.shv-raiz .discrepa .nota-tipo { flex: none; }
.shv-raiz .velo-tapa { position: absolute; inset: 0; display: grid; place-items: center; text-align: center; background: color-mix(in srgb, var(--bg-main) 94%, transparent); border-radius: inherit; font: 600 .86rem/1.35 var(--sans); color: var(--text-dim); padding: 16px; z-index: 3; }
.shv-raiz .detalle-fila { font: .76rem/1.4 var(--sans); color: var(--text-dim); background: var(--bg-card); border-radius: 10px; padding: 5px 8px; display: grid; gap: 2px; }
/* La escena */
.shv-raiz .escena-caja { position: relative; border: 1px solid var(--line); border-radius: 12px; overflow: hidden; background: var(--bg-main); }
.shv-raiz .esc-pest { display: flex; gap: 4px; align-items: center; padding: 4px 4px 0; }
.shv-raiz .esc-pest .chip-b { min-height: 32px; }
.shv-raiz .esc-pest .sep { flex: 1; }
.shv-raiz #shv-esc-svg { display: block; width: 100%; height: auto; }
.shv-raiz .sello { position: absolute; left: 50%; top: 52%; transform: translate(-50%, -50%) rotate(-8deg); border: 3px solid var(--accent-red); color: var(--accent-red); background: color-mix(in srgb, var(--bg-main) 70%, transparent); font: 800 .95rem/1.15 var(--sans); letter-spacing: .08em; text-transform: uppercase; padding: 6px 12px; border-radius: 8px; text-align: center; pointer-events: none; max-width: 86%; }
.shv-raiz .sello small { display: block; font: 600 .66rem/1.25 var(--sans); letter-spacing: 0; text-transform: none; color: var(--text-main); }
.shv-raiz .escena-caja.gris #shv-esc-svg { filter: grayscale(1); opacity: .55; }
.shv-raiz .fig-esq { position: absolute; left: 8px; bottom: 5px; font: 600 .62rem var(--sans); color: var(--text-muted); pointer-events: none; }
.shv-raiz .fig-lectura { position: absolute; right: 8px; bottom: 5px; font: .62rem ui-monospace, Menlo, monospace; color: var(--text-dim); pointer-events: none; text-align: right; max-width: 60%; }
.shv-raiz .leyenda { display: flex; flex-wrap: wrap; gap: 4px; }
.shv-raiz .leyenda button { min-height: 36px; font: .7rem/1.2 var(--sans); background: var(--card2); color: var(--text-dim); border: 1px solid var(--line); border-radius: 8px; padding: 3px 7px; cursor: pointer; text-align: left; }
.shv-raiz .leyenda button b { color: var(--accent-yellow); margin-right: 3px; font-variant-numeric: tabular-nums; }
.shv-raiz .leyenda button[aria-pressed="true"] { border-color: var(--accent-blue); color: var(--text-main); }
.shv-raiz .leyenda-txt { font: .76rem/1.4 var(--sans); color: var(--text-dim); }
.shv-raiz .escena-aparato [data-foco="fuera"] { opacity: .3; }
.shv-raiz .escena-aparato .dp.lit-sel .iso-l.mid, .shv-raiz .escena-aparato .dp.lit-sel .iso-l.lo { stroke: var(--accent-blue); }
.shv-raiz .escena-aparato .dp.lit-sel { filter: drop-shadow(0 0 2px color-mix(in srgb, var(--accent-blue) 60%, transparent)); }
/* Laboratorio, tendencias y abajo */
.shv-raiz .plegable { background: var(--bg-card); border: 1px solid var(--card2); border-radius: 12px; padding: 2px 10px; }
.shv-raiz .plegable summary { cursor: pointer; min-height: 44px; display: flex; align-items: center; font: 600 .84rem var(--sans); color: var(--text-dim); }
.shv-raiz .plegable[open] { padding-bottom: 10px; }
.shv-raiz .lab { display: grid; grid-template-columns: repeat(3, minmax(0, 1fr)); gap: 4px; }
.shv-raiz .lab .celda { cursor: default; }
.shv-raiz .tendencia { width: 100%; height: 64px; display: block; }
.shv-raiz .tend-l { fill: none; stroke-width: 1.4; }
.shv-raiz .tend-t { font: 10.5px var(--sans); fill: var(--text-muted); }
.shv-raiz ul.lista { margin: 4px 0 0; padding: 0; list-style: none; display: grid; gap: 8px; font: .8rem/1.45 var(--sans); color: var(--text-dim); }
.shv-raiz ul.lista li { border-left: 2px solid var(--line); padding-left: 8px; min-width: 0; overflow-wrap: anywhere; display: grid; gap: 2px; }
.shv-raiz .nota { border-left: 3px solid var(--accent-purple); background: var(--bg-card); border-radius: 0 10px 10px 0; padding: 7px 9px; font: .78rem/1.45 var(--sans); color: var(--text-dim); display: grid; gap: 3px; }
.shv-raiz .nota b { color: var(--text-main); }
.shv-raiz .nota-tipo { display: inline-block; width: fit-content; font: 700 .6rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--text-main); background: var(--accent-purple); border-radius: 5px; padding: 1px 6px; }
.shv-raiz .nota-tipo.calla { background: var(--text-muted); color: var(--bg-main); }
.shv-raiz .nota-tipo.autor { background: var(--accent-yellow); color: var(--bg-main); }
.shv-raiz .nota-tipo.errata { background: var(--accent-red); }
.shv-raiz .tira { display: flex; flex-wrap: wrap; gap: 8px; }
.shv-raiz .lamina-libro { display: grid; gap: 2px; justify-items: center; background: var(--text-main); border: 1px solid var(--line); border-radius: 8px; padding: 3px; cursor: zoom-in; min-height: 44px; width: 104px; }
.shv-raiz .lamina-libro img { display: block; height: 58px; width: 96px; object-fit: contain; }
.shv-raiz .lamina-libro span { font: 600 .6rem/1.15 var(--sans); color: var(--bg-main); text-align: center; }
.shv-raiz dialog#shv-visor { width: min(96vw, 560px); max-height: 92vh; padding: 10px; border: 1px solid var(--accent-yellow); border-radius: 14px; background: var(--card2); color: var(--text-main); }
.shv-raiz dialog#shv-visor::backdrop { background: color-mix(in srgb, var(--bg-main) 85%, transparent); }
.shv-raiz #shv-visor img { display: block; width: 100%; height: auto; max-height: 62vh; object-fit: contain; background: var(--text-main); border-radius: 8px; }
.shv-raiz #shv-visor p { font: .84rem/1.4 var(--sans); color: var(--text-dim); margin-top: 8px; }
/* Citas (como core/citas.js) */
.shv-raiz .cita { display: flex; flex-wrap: wrap; align-items: center; gap: 2px 8px; }
.shv-raiz .cita-ir { display: inline-flex; align-items: center; min-height: 40px; padding: 0 10px; border: 1px dashed var(--accent-yellow); border-radius: 999px; background: transparent; color: var(--accent-yellow); font: 600 .72rem/1.2 var(--sans); text-align: left; cursor: pointer; max-width: 100%; overflow-wrap: anywhere; }
.shv-raiz .cita-pdf { display: inline-flex; align-items: center; min-height: 40px; color: var(--text-muted); font: .7rem var(--sans); text-decoration: underline; text-underline-offset: 2px; }
/* Dock fijo: la frase (entera), las pestañas y los mandos */
.shv-raiz .dock { position: fixed; left: 0; right: 0; bottom: 0; z-index: 20; background: var(--bg-main); border-top: 1px solid var(--line); padding: 4px max(8px, env(safe-area-inset-left, 0px)) calc(4px + env(safe-area-inset-bottom, 0px)); }
.shv-raiz .dock-in { max-width: 560px; margin: 0 auto; display: grid; grid-template-columns: minmax(0, 1fr); gap: 3px; }
.shv-raiz .frase { display: flex; gap: 6px; align-items: flex-start; font: .8rem/1.32 var(--serif); color: var(--text-main); box-shadow: inset 3px 0 0 var(--accent-yellow); padding: 2px 0 2px 8px; }
.shv-raiz .frase-txt { flex: 1; min-width: 0; }
.shv-raiz .scai { flex: none; font: .7rem/1.3 var(--serif); color: var(--text-main); }
.shv-raiz .scai summary { cursor: pointer; min-height: 32px; display: flex; align-items: center; padding: 0 6px; box-shadow: inset 0 -2px 0 var(--accent-red); white-space: nowrap; list-style: none; }
.shv-raiz .scai-c { position: absolute; left: 8px; right: 8px; bottom: 100%; background: var(--bg-main); border: 1px solid var(--accent-red); padding: 6px 8px; }
.shv-raiz .scai b { font: 700 .66rem var(--sans); letter-spacing: .04em; color: var(--accent-red); }
.shv-raiz .scai-o { color: var(--text-dim); font-size: .68rem; }
.shv-raiz .scai-c .especialidad-link { display: inline; min-height: 32px; font-size: .72rem; }
.shv-raiz .frase-txt .estado { font: 700 .62rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--accent-yellow); display: block; }
.shv-raiz .btn-guia { flex: none; min-height: 44px; min-width: 48px; border-radius: 10px; border: 1px solid var(--accent-yellow); background: var(--accent-yellow); color: var(--bg-main); font: 700 .7rem/1.1 var(--sans); cursor: pointer; padding: 2px 6px; }
.shv-raiz .dock-tabs { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); gap: 2px; }
.shv-raiz .dock-tabs button { min-height: 38px; background: transparent; border: 0; border-bottom: 2px solid transparent; color: var(--text-muted); font: 600 .72rem/1.1 var(--sans); cursor: pointer; padding: 0 1px; }
.shv-raiz .dock-tabs button[aria-selected="true"] { color: var(--accent-yellow); border-bottom-color: var(--accent-yellow); }
.shv-raiz .dock-panel { display: grid; gap: 3px; align-content: start; min-height: 64px; }
.shv-raiz .seg { display: grid; grid-auto-flow: column; grid-auto-columns: minmax(0, 1fr); border: 1px solid var(--line); border-radius: 10px; overflow: hidden; }
.shv-raiz .seg button { min-height: 44px; font: 600 .7rem/1.1 var(--sans); background: transparent; color: var(--text-muted); border: 0; padding: 2px; cursor: pointer; min-width: 0; }
.shv-raiz .seg button + button { border-left: 1px solid var(--line); }
.shv-raiz .seg button[aria-pressed="true"] { background: var(--accent-yellow); color: var(--bg-main); }
.shv-raiz .seg button small { display: block; font-weight: 400; font-size: .56rem; }
.shv-raiz .rejilla { display: grid; gap: 4px; grid-template-columns: repeat(var(--n, 3), minmax(0, 1fr)); }
.shv-raiz .tog { min-height: 44px; display: flex; align-items: center; justify-content: center; flex-direction: column; padding: 2px 6px; border-radius: 10px; background: var(--card2); border: 1px solid var(--line); color: var(--text-main); font: 600 .7rem/1.1 var(--sans); cursor: pointer; min-width: 0; text-align: center; }
.shv-raiz .tog small { display: block; font-weight: 400; font-size: .56rem; color: var(--text-muted); }
.shv-raiz .tog[aria-pressed="true"] { border-color: var(--accent-yellow); background: color-mix(in srgb, var(--accent-yellow) 22%, transparent); }
.shv-raiz .tog:disabled { opacity: .45; cursor: default; }
.shv-raiz .deslizador { display: grid; grid-template-columns: minmax(0, 1fr) 124px; gap: 6px; align-items: center; min-height: 44px; }
.shv-raiz .deslizador input { width: 100%; min-height: 40px; accent-color: var(--accent-yellow); margin: 0; }
.shv-raiz .deslizador output { font: 700 .8rem/1.15 var(--sans); text-align: right; font-variant-numeric: tabular-nums; }
.shv-raiz .deslizador output small { display: block; font: 600 .6rem var(--sans); color: var(--text-muted); }
.shv-raiz .dock-nota { font: .64rem/1.25 var(--sans); color: var(--text-muted); }
.shv-raiz .pasos { display: flex; gap: 4px; }
.shv-raiz .pasos i { flex: 1; height: 6px; border-radius: 3px; background: var(--card2); }
.shv-raiz .pasos i.on { background: var(--accent-green); }
.shv-raiz .pasos i.mal { background: var(--accent-red); }
.shv-raiz .pasos i.aqui { box-shadow: 0 0 0 2px var(--accent-blue); }
.shv-raiz .dock-est-txt { font: .72rem/1.3 var(--sans); color: var(--text-muted); display: flex; justify-content: space-between; gap: 8px; }
/* Explicación guiada (en el dock) */
.shv-raiz .guia { display: grid; gap: 5px; font: .86rem/1.4 var(--serif); }
.shv-raiz .guia-cab { display: flex; align-items: center; gap: 8px; }
.shv-raiz .guia-n { font: 700 .64rem/1.2 var(--sans); letter-spacing: .06em; text-transform: uppercase; color: var(--accent-yellow); white-space: nowrap; }
.shv-raiz .guia-tit { flex: 1; min-width: 0; font: 600 .8rem/1.2 var(--sans); color: var(--text-dim); overflow: hidden; text-overflow: ellipsis; white-space: nowrap; }
.shv-raiz .guia-x { flex: none; width: 44px; height: 44px; border-radius: 50%; border: 1px solid var(--line); background: transparent; color: var(--text-main); font-size: 1.2rem; cursor: pointer; }
.shv-raiz .guia-txt { margin: 0; border-left: 3px solid var(--accent-yellow); padding: 1px 0 1px 9px; max-height: 24vh; overflow-y: auto; }
.shv-raiz .guia-nav { display: grid; grid-template-columns: auto 1fr auto; gap: 8px; align-items: center; }
.shv-raiz .guia-b { min-height: 44px; padding: 0 14px; border-radius: 999px; border: 1px solid var(--line); background: var(--card2); color: var(--text-main); font: 600 .82rem var(--sans); cursor: pointer; }
.shv-raiz .guia-b:disabled { opacity: .45; }
.shv-raiz .guia-b.prim { background: var(--accent-yellow); border-color: var(--accent-yellow); color: var(--bg-main); }
.shv-raiz .guia-puntos { display: flex; justify-content: center; gap: 5px; }
.shv-raiz .guia-puntos i { width: 7px; height: 7px; border-radius: 50%; border: 1px solid var(--accent-yellow); }
.shv-raiz .guia-puntos i.hecho { background: var(--accent-yellow); opacity: .5; }
.shv-raiz .guia-puntos i.aqui { background: var(--accent-yellow); }
.shv-raiz .guia-anillo { fill: none; stroke: var(--accent-blue); stroke-width: 2.2; stroke-dasharray: 6 3; vector-effect: non-scaling-stroke; pointer-events: none; }
.shv-raiz .guia-marco { box-shadow: 0 0 0 2px var(--accent-blue) !important; border-radius: 8px; }
@media (prefers-reduced-motion: no-preference) {.shv-raiz .guia-anillo { animation: shv-late 1.4s ease-in-out infinite; }
 }
@keyframes shv-late { 0%, 100% { opacity: 1; } 50% { opacity: .45; } }
/* Formatos (¿Qué shock es? y Mayéutica) */
.shv-raiz .formato { background: var(--bg-card); border: 1px solid var(--line); border-radius: 14px; padding: 10px; display: grid; gap: 8px; min-width: 0; }
.shv-raiz .cab-preg { display: flex; gap: 6px; align-items: baseline; flex-wrap: wrap; }
.shv-raiz .num { font: 700 .74rem var(--sans); color: var(--accent-yellow); border: 1px solid var(--accent-yellow); border-radius: 6px; padding: 1px 7px; }
.shv-raiz .tipo { font: 600 .66rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
.shv-raiz .grupo { font: 700 .64rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--bg-main); background: var(--text-dim); border-radius: 6px; padding: 1px 6px; }
.shv-raiz .grupo.examen { background: var(--accent-red); color: var(--text-main); }
.shv-raiz .grupo.repaso { background: var(--accent-yellow); color: var(--bg-main); }
.shv-raiz .grupo.caso { background: var(--accent-purple); color: var(--text-main); }
.shv-raiz .pregunta { font-size: .98rem; line-height: 1.45; }
.shv-raiz .op { display: grid; gap: 6px; }
.shv-raiz button.b { min-height: 44px; font: 600 .82rem/1.25 var(--sans); background: var(--card2); color: var(--text-main); border: 1px solid var(--line); border-radius: 10px; padding: 8px 11px; cursor: pointer; text-align: left; }
.shv-raiz button.b.prim { background: var(--accent-yellow); color: var(--bg-main); border-color: var(--accent-yellow); }
.shv-raiz button.b:disabled { opacity: .6; cursor: default; }
.shv-raiz button.b.bien { border-color: var(--accent-green); box-shadow: inset 3px 0 0 var(--accent-green); }
.shv-raiz button.b.malb { border-color: var(--accent-red); box-shadow: inset 3px 0 0 var(--accent-red); }
.shv-raiz button.b.marcada { border-color: var(--accent-yellow); background: color-mix(in srgb, var(--accent-yellow) 18%, var(--card2)); }
.shv-raiz .fila { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
.shv-raiz .respuesta { background: var(--card2); border-radius: 10px; padding: 10px; display: grid; gap: 6px; font: .88rem/1.45 var(--serif); }
.shv-raiz .ok { color: var(--accent-green); font: 600 .86rem var(--sans); }
.shv-raiz .mal { color: var(--accent-red); font: 600 .86rem var(--sans); }
.shv-raiz .para { font: .8rem/1.45 var(--sans); color: var(--text-muted); }
.shv-raiz .dia { font: 700 .72rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--accent-purple); }
.shv-raiz dl.antes-despues { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; margin: 0; font: .8rem/1.35 var(--sans); background: var(--card2); border-radius: 10px; padding: 7px 9px; font-variant-numeric: tabular-nums; }
.shv-raiz dl.antes-despues dt { color: var(--text-muted); }
.shv-raiz dl.antes-despues dd { margin: 0; }
.shv-raiz dl.antes-despues .flecha { color: var(--accent-yellow); }
.shv-raiz dl.paciente { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; margin: 0; font: .8rem/1.35 var(--sans); background: var(--card2); border-radius: 10px; padding: 7px 9px; }
.shv-raiz dl.paciente dt { color: var(--text-muted); }
.shv-raiz dl.paciente dd { margin: 0; }
.shv-raiz dl.paciente dd.nuevo { color: var(--accent-red); font-weight: 600; }
.shv-raiz .punto { display: grid; grid-template-columns: minmax(0, 1fr) auto; gap: 6px; align-items: center; }
.shv-raiz .etapas { display: flex; gap: 4px; flex-wrap: wrap; }
.shv-raiz .etapas span { font: 600 .66rem var(--sans); border-radius: 999px; padding: 2px 8px; border: 1px solid var(--line); color: var(--text-muted); }
.shv-raiz .etapas span.on { border-color: var(--accent-yellow); color: var(--accent-yellow); }
/* La escena: anatomía en grabado y aparatos (maqueta b3-shock v2). Solo tokens de css/variables.css. */
.shv-raiz .escena-aparato { --tejido: color-mix(in srgb, var(--accent-red) 38%, var(--bg-main)); --luz-art: color-mix(in srgb, var(--accent-red) 16%, var(--bg-main));
  --corte: color-mix(in srgb, var(--text-dim) 30%, var(--bg-main)); --grab: color-mix(in srgb, var(--accent-red) 55%, var(--bg-main)); }
.shv-raiz .escena-aparato .luz, .shv-raiz .escena-aparato .cav-luz { fill: var(--luz-art); }
.shv-raiz .escena-aparato .vaso.ven .luz { fill: color-mix(in srgb, var(--accent-purple) 18%, var(--bg-main)); }
.shv-raiz .escena-aparato .pared { fill: var(--corte); }
.shv-raiz .escena-aparato .grab { stroke: var(--grab); stroke-width: .5; fill: none; }
.shv-raiz .escena-aparato .intima { stroke: var(--text-dim); stroke-width: .55; fill: none; }
.shv-raiz .escena-aparato .adv { stroke: var(--text-muted); stroke-width: .7; fill: none; }
.shv-raiz .escena-aparato .miocardio { fill: var(--tejido); stroke: none; }
.shv-raiz .escena-aparato .miocardio.papilar { stroke: var(--grab); stroke-width: .5; }
.shv-raiz .escena-aparato .trab { stroke: var(--grab); stroke-width: 1.1; stroke-linecap: round; fill: none; }
.shv-raiz .escena-aparato .endo { stroke: var(--text-dim); stroke-width: .6; fill: none; }
.shv-raiz .escena-aparato .epi { stroke: var(--text-muted); stroke-width: .8; fill: none; }
.shv-raiz .escena-aparato .pared-fina { stroke: var(--text-muted); stroke-width: 1.6; fill: none; }
.shv-raiz .escena-aparato .velo { fill: color-mix(in srgb, var(--text-main) 22%, var(--bg-main)); stroke: var(--text-main); stroke-width: .7; }
.shv-raiz .escena-aparato .velo.detras { fill: color-mix(in srgb, var(--text-main) 12%, var(--bg-main)); stroke: var(--text-muted); }
.shv-raiz .escena-aparato .cuerda { stroke: var(--text-dim); stroke-width: .4; fill: none; }
.shv-raiz .escena-aparato .ostium { fill: var(--bg-main); stroke: var(--text-muted); stroke-width: .6; }
.shv-raiz .escena-aparato .hueco { fill: var(--bg-main); filter: brightness(.6); stroke: var(--text-muted); stroke-width: .35; }
.shv-raiz .escena-aparato .rotor-fondo { fill: color-mix(in srgb, var(--accent-red) 30%, var(--bg-main)); }
.shv-raiz .escena-aparato .alabe { stroke: var(--accent-blue); stroke-width: 1.1; fill: none; stroke-linecap: round; }
.shv-raiz .escena-aparato .hematie.art { fill: color-mix(in srgb, var(--accent-red) 75%, var(--text-main)); }
.shv-raiz .escena-aparato .hematie.ven { fill: color-mix(in srgb, var(--accent-purple) 80%, var(--text-main)); }
.shv-raiz .escena-aparato.apagado .iso-pieza, .shv-raiz .escena-aparato.apagado .iso-tubo { opacity: .45; }
.shv-raiz .escena-aparato .fibras { stroke: color-mix(in srgb, var(--accent-red) 62%, var(--bg-main)); stroke-width: .45; fill: none; }
.shv-raiz .escena-aparato .pantalla { fill: var(--bg-main); }
.shv-raiz .escena-aparato .pantalla-marco { fill: none; stroke: var(--text-muted); stroke-width: .6; }
.shv-raiz .escena-aparato .pantalla-txt { fill: var(--accent-blue); font-family: ui-monospace, Menlo, monospace; font-weight: 600; }
.shv-raiz .escena-aparato .placa { fill: color-mix(in srgb, var(--text-main) 18%, var(--bg-main)); stroke: var(--text-muted); stroke-width: .5; }
.shv-raiz .escena-aparato .placa-txt { stroke: var(--text-muted); stroke-width: .5; fill: none; }
.shv-raiz .escena-aparato .remache { fill: var(--text-dim); }
.shv-raiz .escena-aparato .ranura { fill: var(--bg-main); stroke: var(--text-muted); stroke-width: .25; }
.shv-raiz .escena-aparato .torso { fill: none; stroke: var(--text-muted); stroke-width: .8; }
.shv-raiz .escena-aparato .pulmon { fill: color-mix(in srgb, var(--accent-red) 10%, var(--bg-main)); stroke: var(--text-muted); stroke-width: .6; }
.shv-raiz .escena-aparato .gota { fill: color-mix(in srgb, var(--text-main) 60%, var(--bg-main)); }
.shv-raiz .escena-aparato .vena-luz { stroke: color-mix(in srgb, var(--accent-purple) 45%, var(--bg-main)); stroke-width: 9; fill: none; stroke-linecap: round; }
.shv-raiz .escena-aparato .vena-pared { stroke: color-mix(in srgb, var(--accent-purple) 25%, var(--bg-main)); stroke-width: 6; fill: none; stroke-linecap: round; }
.shv-raiz .escena-aparato .arteria-luz { stroke: color-mix(in srgb, var(--text-dim) 55%, var(--bg-main)); stroke-width: 10; fill: none; stroke-linecap: round; }
.shv-raiz .escena-aparato .arteria-luz.fina { stroke-width: 6; }
.shv-raiz .escena-aparato .arteria-pared { stroke: color-mix(in srgb, var(--accent-red) 35%, var(--bg-main)); stroke-width: 7; fill: none; stroke-linecap: round; }
.shv-raiz .escena-aparato .cav-ven { fill: color-mix(in srgb, var(--accent-purple) 40%, var(--bg-main)); stroke: var(--text-dim); stroke-width: .6; }
.shv-raiz .escena-aparato .cav-art { fill: color-mix(in srgb, var(--accent-red) 40%, var(--bg-main)); }
.shv-raiz .escena-aparato .velo-plano { stroke: var(--text-main); stroke-width: 1; fill: none; }
.shv-raiz .escena-aparato .fibra { stroke: color-mix(in srgb, var(--text-main) 40%, var(--bg-main)); stroke-width: .6; vector-effect: non-scaling-stroke; }
.shv-raiz .escena-aparato .ventana-oxi { fill: color-mix(in srgb, var(--accent-purple) 30%, var(--bg-main)); stroke: var(--text-muted); stroke-width: .5; }
.shv-raiz .escena-aparato .alabe.detras { stroke: color-mix(in srgb, var(--accent-yellow) 45%, var(--bg-main)); stroke-width: .9; }
/* El paciente en grabado (corazon.js) */
.shv-raiz .escena-aparato .saco { fill: color-mix(in srgb, var(--accent-red) calc(8% + 30% * var(--derrame, 0)), var(--bg-main)); stroke: var(--text-muted); stroke-width: .8; }
.shv-raiz .escena-aparato .mio { fill: color-mix(in srgb, var(--accent-red) 34%, var(--bg-main)); stroke: var(--text-muted); stroke-width: .7; }
.shv-raiz .escena-aparato .mio.grueso { fill: color-mix(in srgb, var(--accent-red) 42%, var(--bg-main)); }
.shv-raiz .escena-aparato .cav { stroke: var(--text-dim); stroke-width: .7; }
.shv-raiz .escena-aparato .cav.art { fill: color-mix(in srgb, var(--accent-red) 20%, var(--bg-main)); }
.shv-raiz .escena-aparato .cav.ven { fill: color-mix(in srgb, var(--accent-purple) 26%, var(--bg-main)); }
.shv-raiz .escena-aparato .tabique { fill: none; stroke: var(--text-main); stroke-width: 1.2; }
.shv-raiz .escena-aparato .valva { fill: none; stroke: var(--text-main); stroke-width: 1.3; stroke-linecap: round; }
.shv-raiz .escena-aparato .rot-g { font: 600 10.5px system-ui, sans-serif; fill: var(--text-dim); }
.shv-raiz .escena-aparato .rot-g.dim { fill: var(--text-muted); font-weight: 400; }
.shv-raiz .escena-aparato .lupa-aro { fill: var(--bg-main); stroke: var(--text-muted); stroke-width: 1; }
.shv-raiz .escena-aparato .art-pared { fill: color-mix(in srgb, var(--accent-red) 30%, var(--bg-main)); stroke: var(--text-dim); stroke-width: .6; }
.shv-raiz .escena-aparato .art-luz { fill: color-mix(in srgb, var(--accent-red) 70%, var(--text-main)); stroke: var(--text-main); stroke-width: .5; }
.shv-raiz .escena-aparato .vena-borde { fill: none; stroke: var(--text-muted); stroke-linecap: round; }
.shv-raiz .escena-aparato path.vena-luz { fill: none; stroke: color-mix(in srgb, var(--accent-purple) 40%, var(--bg-main)); stroke-linecap: round; }
.shv-raiz .escena-aparato .clavicula, .shv-raiz .escena-aparato .pelvis { fill: none; stroke: var(--text-muted); stroke-width: .8; }
.shv-raiz .escena-aparato .vaso-luz { fill: none; stroke-width: 6; stroke-linecap: round; }
.shv-raiz .escena-aparato .vaso-luz.fino { stroke-width: 4; }
.shv-raiz .escena-aparato .vaso-luz.art { stroke: color-mix(in srgb, var(--accent-red) 45%, var(--bg-main)); }
.shv-raiz .escena-aparato .vaso-luz.ven { stroke: color-mix(in srgb, var(--accent-purple) 45%, var(--bg-main)); }
.shv-raiz .escena-aparato .ruta { fill: none; stroke-width: 1.8; stroke-linecap: round; stroke-linejoin: round; }
.shv-raiz .escena-aparato .ruta-art { stroke: var(--accent-blue); }
.shv-raiz .escena-aparato .ruta-ven { stroke: var(--accent-blue); }
.shv-raiz .escena-aparato .punta { fill: var(--accent-blue); stroke: var(--text-main); stroke-width: .6; }
.shv-raiz .escena-aparato .fibras-g { stroke: color-mix(in srgb, var(--accent-red) 65%, var(--bg-main)); stroke-width: .55; fill: none; stroke-linecap: round; }
.shv-raiz .escena-aparato .pulmon { fill: color-mix(in srgb, var(--accent-red) 7%, var(--bg-main)); }
.shv-raiz .escena-aparato .pantalla-curva { fill: none; stroke: var(--accent-blue); stroke-width: .9; }
.shv-raiz .escena-aparato .pantalla-barra { fill: color-mix(in srgb, var(--accent-blue) 70%, var(--bg-main)); }
.shv-raiz .escena-aparato .rodete-mini { fill: var(--accent-blue); }
.shv-raiz .escena-aparato .balon-mini { fill: color-mix(in srgb, var(--text-main) 70%, var(--bg-main)); stroke: var(--text-main); stroke-width: .6; }
.shv-raiz .escena-aparato path.arteria-luz { stroke: color-mix(in srgb, var(--accent-red) 45%, var(--bg-main)); }
.shv-raiz .escena-aparato .aspa { fill: color-mix(in srgb, var(--accent-blue) 85%, var(--text-main)); stroke: color-mix(in srgb, var(--accent-yellow) 60%, var(--bg-main)); stroke-width: .25; }
.shv-raiz .escena-aparato .aspa.detras { fill: color-mix(in srgb, var(--accent-yellow) 45%, var(--bg-main)); }
/* El paciente y el recorrido (corazon.js, sobre la pieza común del corte) */
.shv-raiz .escena-aparato .cisura { fill: none; stroke: color-mix(in srgb, var(--text-muted) 70%, var(--bg-main)); stroke-width: .6; }
.shv-raiz .escena-aparato .bronquio { fill: none; stroke: color-mix(in srgb, var(--text-dim) 45%, var(--bg-main)); stroke-width: 1.1; stroke-linecap: round; stroke-linejoin: round; }
.shv-raiz .escena-aparato .art-adv { fill: color-mix(in srgb, var(--text-dim) 22%, var(--bg-main)); stroke: var(--text-muted); stroke-width: .6; }
.shv-raiz .escena-aparato .art-celula { fill: color-mix(in srgb, var(--accent-red) 46%, var(--bg-main)); stroke: color-mix(in srgb, var(--accent-red) 70%, var(--text-main)); stroke-width: .35; }
.shv-raiz .escena-aparato .art-endo { fill: none; stroke: var(--text-main); stroke-width: .6; }
.shv-raiz .escena-aparato .art-luz { fill: color-mix(in srgb, var(--accent-red) 22%, var(--bg-main)); stroke: none; }
.shv-raiz .escena-aparato .hematie-g { fill: color-mix(in srgb, var(--accent-red) 80%, var(--text-main)); }
.shv-raiz .escena-aparato .piel { fill: none; stroke: var(--text-muted); stroke-width: .9; stroke-linecap: round; }
.shv-raiz .escena-aparato .vertebra { fill: color-mix(in srgb, var(--text-dim) 12%, var(--bg-main)); stroke: color-mix(in srgb, var(--text-muted) 60%, var(--bg-main)); stroke-width: .5; }
.shv-raiz .escena-aparato .hueso { fill: color-mix(in srgb, var(--text-dim) 14%, var(--bg-main)); stroke: var(--text-muted); stroke-width: .7; stroke-linejoin: round; }
.shv-raiz .escena-aparato .hueso-l { fill: var(--bg-main); stroke: var(--text-muted); stroke-width: .5; }
.shv-raiz .escena-aparato .costilla { fill: none; stroke: color-mix(in srgb, var(--text-dim) 50%, var(--bg-main)); stroke-width: 2.6; stroke-linecap: round; opacity: .55; }
.shv-raiz .escena-aparato .cartilago { fill: none; stroke: color-mix(in srgb, var(--text-dim) 35%, var(--bg-main)); stroke-width: 2; stroke-linecap: round; }
.shv-raiz .escena-aparato .diafragma { fill: none; stroke: color-mix(in srgb, var(--accent-red) 40%, var(--text-muted)); stroke-width: 1.4; stroke-linecap: round; }
.shv-raiz .escena-aparato .vaso-a, .shv-raiz .escena-aparato .vaso-v, .shv-raiz .escena-aparato .vaso-a-pared, .shv-raiz .escena-aparato .vaso-v-pared { fill: none; stroke-linecap: round; stroke-linejoin: round; }
.shv-raiz .escena-aparato .vaso-a { stroke: color-mix(in srgb, var(--accent-red) 22%, var(--bg-main)); }
.shv-raiz .escena-aparato .vaso-a-pared { stroke: color-mix(in srgb, var(--text-dim) 45%, var(--bg-main)); }
.shv-raiz .escena-aparato .vaso-v { stroke: color-mix(in srgb, var(--accent-purple) 30%, var(--bg-main)); }
.shv-raiz .escena-aparato .vaso-v-pared { stroke: color-mix(in srgb, var(--accent-purple) 70%, var(--text-main)); }
.shv-raiz #shv-esc-eco { display: block; width: 100%; height: auto; background: var(--bg-main); }
.shv-raiz .escena-aparato .punta-canula { fill: var(--text-main); stroke: var(--bg-main); stroke-width: .5; }
.shv-raiz .escena-aparato .conector { fill: var(--card2); stroke: var(--text-main); stroke-width: .7; }
.shv-raiz .escena-aparato .lupa-linea { fill: none; stroke: var(--text-muted); stroke-width: .7; stroke-dasharray: 1.6 2; }
.shv-raiz .escena-aparato .lupa-marca { fill: none; stroke: var(--text-muted); stroke-width: .7; }
.shv-raiz .escena-aparato .lupa-fondo { fill: var(--bg-main); }
.shv-raiz #shv-esc-svg .cc-rot { font-size: 11px; }
.shv-raiz .mon-cab .quien { white-space: normal; }
.shv-raiz .tope-sello .cita button { white-space: normal; overflow: visible; text-overflow: clip; text-align: center; }
/* Mayéutica (motor común: clases con prefijo shv-) */
.shv-raiz .shv-h { font-size: 1.04rem; margin: 0; color: var(--accent-yellow); font-weight: normal; }
.shv-raiz .formato .shv-eyebrow { font: 600 .68rem var(--sans); letter-spacing: .08em; text-transform: uppercase; color: var(--text-muted); display: block; }
.shv-raiz .shv-cab-preg { display: flex; gap: 6px; align-items: baseline; flex-wrap: wrap; }
.shv-raiz .shv-num { font: 700 .74rem var(--sans); color: var(--accent-yellow); border: 1px solid var(--accent-yellow); border-radius: 6px; padding: 1px 7px; }
.shv-raiz .shv-tipo { font: 600 .66rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--text-muted); }
.shv-raiz .shv-serie { font: 700 .64rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--bg-main); background: var(--text-dim); border-radius: 6px; padding: 1px 6px; }
.shv-raiz .shv-serie.shv-examen { background: var(--accent-red); color: var(--text-main); }
.shv-raiz .shv-pregunta { font-size: .98rem; line-height: 1.45; }
.shv-raiz .shv-op, .shv-raiz .shv-fmt, .shv-raiz .shv-res, .shv-raiz .shv-mando { display: grid; gap: 6px; min-width: 0; }
.shv-raiz .shv-op[hidden], .shv-raiz .shv-mando[hidden] { display: none; }
.shv-raiz button.shv-b, .shv-raiz button.shv-frase-e { min-height: 44px; font: 600 .82rem/1.25 var(--sans); background: var(--card2); color: var(--text-main); border: 1px solid var(--line); border-radius: 10px; padding: 8px 11px; cursor: pointer; text-align: left; }
.shv-raiz button.shv-frase-e { display: flex; gap: 8px; align-items: baseline; width: 100%; }
.shv-raiz button.shv-b.shv-prim { background: var(--accent-yellow); color: var(--bg-main); border-color: var(--accent-yellow); }
.shv-raiz button.shv-b.shv-link { background: transparent; color: var(--accent-yellow); }
.shv-raiz button.shv-b:disabled, .shv-raiz button.shv-frase-e:disabled { opacity: .7; cursor: default; }
.shv-raiz button.shv-elegida-ok, .shv-raiz button.shv-acierto { border-color: var(--accent-green); box-shadow: inset 3px 0 0 var(--accent-green); }
.shv-raiz button.shv-elegida-mal, .shv-raiz button.shv-fallo { border-color: var(--accent-red); box-shadow: inset 3px 0 0 var(--accent-red); }
.shv-raiz button.shv-frase-e.shv-marcada { border-color: var(--accent-yellow); background: color-mix(in srgb, var(--accent-yellow) 18%, var(--card2)); }
.shv-raiz .shv-n { font: 700 .72rem var(--sans); color: var(--accent-yellow); flex: none; }
.shv-raiz .shv-fila { display: flex; gap: 6px; flex-wrap: wrap; align-items: center; }
.shv-raiz .shv-respuesta { background: var(--card2); border-radius: 10px; padding: 10px; display: grid; gap: 6px; font: .88rem/1.45 var(--serif); min-width: 0; }
.shv-raiz .shv-respuesta p { margin: 0; }
.shv-raiz .shv-ok { color: var(--accent-green); font: 600 .86rem var(--sans); }
.shv-raiz .shv-mal { color: var(--accent-red); font: 600 .86rem var(--sans); }
.shv-raiz .shv-para, .shv-raiz .shv-pista, .shv-raiz .shv-correccion { font: .8rem/1.45 var(--sans); color: var(--text-muted); }
.shv-raiz .shv-correccion { color: var(--text-main); background: var(--card2); border-radius: 8px; padding: 6px 8px; }
.shv-raiz .shv-nota-fuentes { font: .8rem/1.4 var(--sans); color: var(--text-muted); }
.shv-raiz .shv-dia { font: 700 .72rem var(--sans); letter-spacing: .05em; text-transform: uppercase; color: var(--accent-purple); }
.shv-raiz dl.shv-paciente { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; margin: 0; font: .8rem/1.35 var(--sans); background: var(--card2); border-radius: 10px; padding: 7px 9px; }
.shv-raiz dl.shv-paciente dt { color: var(--text-muted); }
.shv-raiz dl.shv-paciente dd { margin: 0; min-width: 0; }
.shv-raiz dl.shv-paciente dd.shv-cambia { color: var(--accent-red); font-weight: 600; }
.shv-raiz .shv-nuevo { font: 700 .6rem var(--sans); text-transform: uppercase; border: 1px solid var(--accent-red); border-radius: 6px; padding: 0 4px; }
.shv-raiz .shv-punto { display: flex; gap: 8px; align-items: flex-start; font: .86rem/1.4 var(--serif); min-height: 36px; }
.shv-raiz .shv-punto input { width: 22px; height: 22px; flex: none; margin-top: 2px; }
.shv-raiz .shv-ruta { display: grid; gap: 6px; font: .86rem/1.4 var(--sans); }
.shv-raiz .shv-repaso-chips, .shv-raiz .shv-casos-lista { display: grid; gap: 6px; }
.shv-raiz .shv-casos-lista small { display: block; font-weight: 400; color: var(--text-muted); }
.shv-raiz ol.shv-lleva { margin: 0; padding-left: 20px; display: grid; gap: 4px; font: .88rem/1.45 var(--serif); }
.shv-raiz .pasos i.shv-on { background: var(--accent-green); }
.shv-raiz .pasos i.shv-mal { background: var(--accent-red); }
.shv-raiz .pasos i.shv-aqui { box-shadow: 0 0 0 2px var(--accent-blue); }
.shv-raiz .shv-lamina { display: grid; gap: 4px; }
.shv-raiz .shv-lamina img { display: block; width: 100%; height: auto; background: var(--bg-main); border-radius: 6px; }
.shv-raiz .shv-lamina figcaption { font: .72rem/1.35 var(--sans); color: var(--text-muted); }
.shv-raiz .shv-lamina a { color: var(--accent-yellow); }
.shv-raiz .shv-fila, .shv-raiz .shv-respuesta, .shv-raiz .shv-res, .shv-raiz .shv-mando, .shv-raiz .shv-lleva { scroll-margin-bottom: calc(var(--dock-h, 190px) + 14px); }
.shv-raiz button.shv-b, .shv-raiz .shv-consecuencia { scroll-margin-bottom: calc(var(--dock-h, 190px) + 14px); }
`;
