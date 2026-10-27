// La Mayéutica del corazón eléctrico: el motor común (core/mayeutica-motor.js) con los enganches de este modelo.
// Datos: js/data/ritmo-vivo-preguntas.js. Primero predices (cifras y gráficas tapadas), luego el modelo lo confirma.
import { crearMayeuticaModelo, rutaDe, atributosFicha } from '../../../core/mayeutica-motor.js';
import { PREGUNTAS as P0, CASOS as CASOS0 } from '../../../data/ritmo-vivo-preguntas.js';
import { cita, REDUCIR } from './ayudas.js';

// Del formato de los datos al del motor: puntos como texto y frases con su corrección y su cita.
const adaptar = q => ({ ...q,
  puntosC: q.puntos ? q.puntos.map(p => p.c) : undefined, puntos: q.puntos ? q.puntos.map(p => p.t) : undefined,
  frases: q.frases ? q.frases.map(f => ({ t: f.t, mal: f.mal, c: `<span class="hl-verde">${f.buena || ''}</span> ${f.cita ? cita(f.cita) : ''}`, cita: f.cita })) : undefined });
const PREGUNTAS = P0.map(adaptar);
const CASOS = CASOS0.map(c => ({ ...c, pasos: c.pasos.map(p => ({ ...p, pregunta: adaptar(p.pregunta) })) }));

// d: { ponerEstado, taparTodo, accion, S, medirDock, setModo }
export function crearMayeutica(d) {
  const preparar = q => {
    if (q.tipo === 'aviso' || !q.estado) return;
    if (d.S.medir) d.S.medir = null;
    d.ponerEstado(q.estado, q.wpwFa ? { wpwFa: true } : q.fcFA ? { fcFA: q.fcFA, llenadoMalo: !!q.llenadoMalo } : {});
    d.taparTodo(true, q.estado === 'wpw' && !q.wpwFa && q.grupo !== 'caso');
  };
  const destapar = q => { d.taparTodo(false); };   // al contestar se ven las cifras; también en el caso (el monitor no se queda en «?»)
  const citas = q => [q.fuente, q.fuente2, q.fuente3, ...(q.puntosC || []), ...(q.frases || []).map(f => f.cita)].filter(Boolean).filter((c, i, a) => a.findIndex(x => x.id === c.id && x.sitio === c.sitio) === i).map(cita).join('');
  const subir = () => scrollTo({ top: 0, behavior: REDUCIR ? 'auto' : 'smooth' });
  return crearMayeuticaModelo({
    p: 'rtv', cont: () => document.getElementById('rtv-preg'), clave: 'ritmo-vivo-mayeutica-v1', preguntas: PREGUNTAS, casos: CASOS,
    subir, reiniciar: () => { d.taparTodo(false); d.ponerEstado('sinusal'); d.medirDock(); },
    volverPor: 'El corazón eléctrico',
    pregunta: {
      alEmpezar: q => { preparar(q); d.medirDock(); },
      verEnTexto: q => { const h = citas(q); return h ? `<p class="rtv-fuente-p">${h}</p>` : ''; },
      alCerrar: q => destapar(q),
      tocar: {
        mandoHTML: t => `<p class="rtv-para"><b>${t.txt}</b></p><button type="button" class="rtv-b" data-mando="ade6">Adenosina 6 mg</button>`,
        alMostrar: () => {},
        comprobar: () => !!d.S.adeno,
        confirma: q => q.tocar.confirma,
        ponerBueno: () => { if (!d.S.adeno) d.accion('ade6'); },
        alComprobar: q => destapar(q),
        accion: () => { d.accion('ade6'); subir(); },
      },
    },
    textos: {
      ruta: (nG, nE) => `<span><b>1. Guía socrática</b> (${nG}): predices lo que verás en el monitor y luego el corazón lo confirma.</span>
        <span><b>2. Examen, nivel MIR</b> (${nE}): conductas y umbrales de Marino, cada opción falsa con lo que le pasaría al paciente.</span>
        <span><b>3.</b> Otra vez lo que fallaste, solo eso.</span><span><b>4.</b> El caso de Teodoro: la FA de una lobectomía, que evoluciona.</span>`,
      empezar: 'Empezar la guía socrática', seguir: 'Seguir',
      pie: 'Las cifras y las gráficas del modelo están tapadas hasta que contestas: primero predices, luego compruebas. El paciente del caso se inventa; la medicina sale de las fichas de Marino (caps. 19-21), y cada pregunta dice dónde.',
      conModelo: 'el corazón', casos: 'El corazón se pone en el ritmo de cada paso antes de la pregunta. Lo nuevo de la ficha del paciente sale en rojo.',
      abrirPaciente: 'Abrir el corazón de Teodoro (FA con estenosis mitral)',
    },
    preguntaDePaso: () => ({}),
    abrirPaciente: () => { d.setModo('explorar'); d.ponerEstado('fa', { fcFA: 104, llenadoMalo: true }); d.medirDock(); },
  });
}
export { rutaDe, atributosFicha };
