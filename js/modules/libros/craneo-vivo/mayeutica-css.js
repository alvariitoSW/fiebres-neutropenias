// El CSS de la Mayéutica del cráneo vivo (prefijo crv-): las reglas del motor común, con las variables de #crv-raiz. Solo tokens de color.
import { instalarCss } from '../../../core/dibujo-iso.js';
const CSS = `
#crv-raiz button.crv-b { min-height: 44px; font: 600 .86rem/1.2 var(--sans); background: var(--card2); color: var(--fg); border: 1px solid var(--line); border-radius: 10px; padding: 8px 12px; cursor: pointer; text-align: left; }
#crv-raiz button.crv-b.crv-prim { background: var(--oro); color: var(--bg); border-color: var(--oro); }
#crv-raiz button.crv-b:disabled { opacity: .55; cursor: default; }
.crv-fila { display: flex; gap: 8px; flex-wrap: wrap; align-items: center; }
.crv-para { font: .82rem/1.45 var(--sans); color: var(--muted); }
.crv-entra { animation: crv-entra .25s ease-out; }
@keyframes crv-entra { from { opacity: .3; } to { opacity: 1; } }
.crv-dock-est { display: grid; gap: 4px; padding: 6px 0; }
.crv-pasos { display: flex; gap: 4px; }
.crv-pasos i { flex: 1; height: 6px; border-radius: 3px; background: var(--card2); border: 1px solid rgba(196, 154, 74, .2); }
.crv-pasos i.crv-on { background: var(--oro); border-color: var(--oro); }
.crv-pasos i.crv-mal { background: var(--rojo); border-color: var(--rojo); }
.crv-pasos i.crv-aqui { box-shadow: 0 0 0 2px var(--oro-claro); }
.crv-dock-est-txt { font: .74rem/1.3 var(--sans); color: var(--muted); display: flex; justify-content: space-between; gap: 8px; }
.crv-formato { background: var(--card); border: 1px solid var(--line); border-radius: 14px; padding: 12px; display: grid; gap: 10px; min-width: 0; }
.crv-cab-preg { display: flex; gap: 8px; align-items: baseline; flex-wrap: wrap; }
.crv-num { font: 700 .76rem var(--sans); color: var(--oro); border: 1px solid var(--oro); border-radius: 6px; padding: 1px 7px; }
.crv-tipo { font: 600 .68rem var(--sans); letter-spacing: .06em; text-transform: uppercase; color: var(--muted); }
.crv-grupo { font: 700 .66rem var(--sans); letter-spacing: .06em; text-transform: uppercase; color: var(--bg); background: var(--dim); border-radius: 6px; padding: 1px 6px; }
.crv-grupo.crv-examen { background: var(--rojo); color: var(--fg); }
.crv-grupo.crv-caso { background: var(--purpura); color: var(--fg); }
.crv-pregunta { font-size: 1rem; line-height: 1.45; }
.crv-op { display: grid; gap: 8px; }
.crv-op button.crv-elegida-bien { border-color: var(--verde); }
.crv-op button.crv-elegida-mal { border-color: var(--rojo); }
.crv-respuesta { background: var(--card2); border-radius: 10px; padding: 12px; display: grid; gap: 8px; min-width: 0; font: .9rem/1.45 var(--serif); }
.crv-ok { color: var(--verde); font: 600 .9rem var(--sans); }
.crv-mal { color: var(--rojo); font: 600 .9rem var(--sans); }
.crv-dia { font: 700 .74rem var(--sans); letter-spacing: .06em; text-transform: uppercase; color: var(--purpura); }
#crv-raiz dl.crv-paciente { display: grid; grid-template-columns: auto 1fr; gap: 2px 10px; margin: 0; font: .82rem/1.35 var(--sans); background: var(--card2); border-radius: 10px; padding: 8px 10px; }
#crv-raiz dl.crv-paciente dt { color: var(--muted); }
#crv-raiz dl.crv-paciente dd { margin: 0; color: var(--fg); }
#crv-raiz dl.crv-paciente dd.crv-cambia { color: var(--rojo); font-weight: 600; }
.crv-formato [data-accion], .crv-formato button { scroll-margin-bottom: calc(var(--crv-dock-h, 190px) + 16px); }
.crv-eyebrow { font: 600 .68rem var(--sans); letter-spacing: .08em; text-transform: uppercase; color: var(--muted); }
.crv-h { font: 600 1.15rem/1.25 var(--serif); margin: 2px 0 6px; }
.crv-ruta { font: .84rem/1.5 var(--sans); color: var(--dim); display: grid; gap: 4px; }
.crv-punto { display: flex; gap: 10px; align-items: flex-start; font: .94rem/1.45 var(--serif); cursor: pointer; min-height: 44px; padding: 4px 0; }
.crv-punto input { margin-top: 4px; width: 20px; height: 20px; accent-color: var(--accent-green); flex: none; }
#crv-raiz .crv-frase-e { display: flex; gap: 10px; width: 100%; min-height: 44px; font: .95rem/1.45 var(--serif); background: transparent; color: var(--text-main); border: 1px solid var(--card2); border-radius: 8px; padding: 8px 10px; text-align: left; cursor: pointer; }
.crv-frase-e .crv-n { font: 700 .76rem var(--sans); color: var(--muted); padding-top: 3px; }
.crv-frase-e.crv-marcada { border-color: var(--accent-yellow); background: rgba(207, 154, 62, .1); }
.crv-frase-e.crv-acierto { border-color: var(--accent-green); }
.crv-frase-e.crv-fallo { border-color: var(--accent-red); background: rgba(184, 92, 62, .12); }
.crv-correccion { font: .88rem/1.45 var(--sans); color: var(--dim); padding: 2px 0 0 26px; }
.crv-mando { border: 1px dashed var(--accent-yellow); border-radius: 12px; padding: 8px 10px; display: grid; gap: 6px; background: rgba(207, 154, 62, .06); }
.crv-mando .crv-pista { font: .84rem/1.4 var(--sans); color: var(--accent-yellow); }
.crv-fuente-p { font: .72rem/1.6 var(--sans); color: var(--muted); }
.crv-lleva { display: grid; gap: 6px; margin: 0; padding-left: 20px; }
.crv-lleva li { font: .94rem/1.45 var(--serif); }
.crv-repaso-chips { display: flex; flex-wrap: wrap; gap: 6px; }
.crv-casos-lista { display: grid; gap: 8px; }
.crv-casos-lista button small { display: block; font-weight: 400; color: var(--muted); }
#crv-raiz button.crv-b.crv-link { display: inline-flex; flex-direction: column; align-items: flex-start; justify-content: center; text-align: left; background: transparent; border-style: dashed; color: var(--accent-yellow); }
.crv-nuevo { font: 700 .62rem var(--sans); letter-spacing: .06em; text-transform: uppercase; border: 1px solid var(--rojo); border-radius: 4px; padding: 0 4px; }
.crv-consecuencia p { margin: 2px 0 0; }
@media (prefers-reduced-motion: reduce) { .crv-entra { animation: none; } }
`;
export const instalarCssMayeutica = () => instalarCss('crv-mayeutica', CSS);
