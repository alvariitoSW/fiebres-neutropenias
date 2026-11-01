// La Mayéutica del hepatocito vivo: el motor común (core/mayeutica-motor.js) con los enganches de este modelo.
// Datos: js/data/hepatocito-vivo-mayeutica.js. Primero predices (monitor y dibujo tapados), luego el modelo lo confirma.
// d: { poner(clave, ajustes, tapado), tapar(b), aplicar(o), estado(), ver(b), cita(p), abrir(clave), medir() }
import { crearMayeuticaModelo } from '../../../core/mayeutica-motor.js';
import { PREGUNTAS, CASOS } from '../../../data/hepatocito-vivo-mayeutica.js';
import { leer, fmt, vitales } from './modelo.js';
import { sinMovimiento } from '../../../core/motion.js';

const ORG = '<span class="org">cifras: ilustrativo</span>';
// Lo que dice el monitor tras «Compruébalo»: se calcula con el propio modelo, con el estado antes y después.
function cuenta(s0, s1, T) {
  const a = leer(s0), b = leer(s1), v = vitales(s1);
  if (T.k === 'fl') return `el amonio sigue en ${fmt(b.a)} µmol/L, pero el astrocito pasa de ${Math.round(a.sw * 100)} % a ${Math.round(b.sw * 100)} % de su hinchazón máxima y la PA queda en ${v.pa}: el Ringer lactato no baja el amonio y empeora el edema.`;
  if (T.k === 'dep') return `con ${T.de} deposiciones el amonio arterial es ${fmt(a.a)} µmol/L; con ${T.a}, ${fmt(b.a)}${T.a > 3 ? ` (no baja más) y la PA cae a ${v.pa} con FC ${v.fc}: el modelo avisa de hipovolemia` : ''}.`;
  if (T.k === 'func') return `con el ${T.de} % de hepatocitos el amonio arterial es ${fmt(a.a)} µmol/L; con el ${T.a} %, ${b.a >= 300 ? 'se pasa de 300' : fmt(b.a)}${b.a > 150 ? ', por encima de 150' : ''}; el astrocito ${b.sw > 0.4 ? 'se hincha' : 'sigue normal'}.`;
  return `el amonio arterial pasa de ${fmt(a.a)} a ${fmt(b.a)} µmol/L${T.k === 'tips' ? ': la sangre de la porta se salta el hígado' : ''}.`;
}
export function crearMayeutica(d) {
  const P = PREGUNTAS.map(q => ({ ...q })), C = CASOS;
  const subir = () => { const r = document.getElementById('hpv-raiz').getBoundingClientRect(); if (r.top < 0) window.scrollBy({ top: r.top, behavior: 'auto' }); };
  let texto = '';
  const preparar = q => { d.ver(!q.sinModelo); if (q.estado) d.poner(q.estado, q.ajustes, !!q.predice && !q.sinModelo); d.medir(); };
  return crearMayeuticaModelo({
    p: 'hpv', cont: () => document.getElementById('hpv-preg'), clave: 'hepatocito-vivo-mayeutica-v1', preguntas: P, casos: C, subir, volverPor: 'El hepatocito vivo',
    reiniciar: () => { d.ver(true); d.poner('sano', {}, false); },
    pregunta: {
      alEmpezar: q => preparar(q),
      verEnTexto: q => `<p class="hpv-fuente-p">${[].concat(q.fuente || []).map(p => d.cita(p)).join('')}</p>`,
      alCerrar: q => { d.tapar(false); d.ver(!q.sinModelo); },
      tocar: {
        mandoHTML: t => `<p class="hpv-para"><b>Compruébalo en el modelo:</b></p><button type="button" class="hpv-b hpv-prim" data-mando="sube">${t.txt}</button>`,
        alMostrar: (q, cont) => { d.tapar(false); d.ver(true); const f = cont.querySelector('[data-accion="comprobar"]').closest('.hpv-fila'); if (f) f.hidden = true; },
        comprobar: () => true,
        confirma: () => texto,
        accion: (m, cont, q) => {
          const T = q.tocar, s0 = { ...d.estado() }; m.disabled = true;
          d.aplicar({ [T.k]: T.a });
          texto = `${cuenta({ ...s0, [T.k]: T.de }, d.estado(), T)} ${ORG}`;
          document.getElementById('hpv-monitor').scrollIntoView({ behavior: sinMovimiento() ? 'auto' : 'smooth', block: 'start' });
          cont.querySelector('[data-accion="comprobar"]').click();
        },
      },
    },
    textos: {
      ruta: (nG, nE) => `<span><b>1. Guía socrática</b> (${nG}): del intestino al hígado y al astrocito; casi todas se predicen y se comprueban en el monitor.</span>
        <span><b>2. Examen, nivel MIR</b> (${nE}): distractores finos que salen de la ficha.</span>
        <span><b>3.</b> Otra vez lo que fallaste, solo eso.</span>
        <span><b>4.</b> Dos casos que evolucionan: Casimira (fallo agudo) e Hilario (cirrótico con TIPS).</span>`,
      empezar: 'Empezar la guía socrática', seguir: 'Seguir',
      pie: 'Las cifras del monitor salen cuando contestas: primero predices, luego compruebas. El paciente se inventa; la medicina sale de la ficha, y cada pregunta dice dónde.',
      conModelo: 'el hepatocito', casos: 'El modelo se pone en el estado de cada paso. Lo nuevo de la ficha del paciente sale en rojo.',
      abrirPaciente: 'Volver al hepatocito del paciente',
    },
    preguntaDePaso: paso => ({ estado: paso.estado, ajustes: paso.ajustes }),
    alTerminarCaso: () => { d.ver(true); d.tapar(false); },
    abrirPaciente: C0 => d.abrir(C0.id === 'hpv-hilario' ? 'hilario' : 'casimira'),
  });
}
