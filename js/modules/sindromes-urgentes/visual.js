// Vista Visual de Síndromes Urgentes (CID, PTT, SLT): recetas para
// core/visual-kit.js. Cada nodo apunta a un elemento real del texto de la
// ficha; las barras de puntuación escriben en las calculadoras existentes
// (cid.js, ptt.js, slt.js) y copian su resultado.
import { montarVisual } from '../../core/visual-kit.js';
import { cidOvertDicItems, cidSicItems } from '../../data/sindromes-urgentes-data.js';

const dimeroPts = o => cidOvertDicItems.dimeroD.find(d => d.value === o.value)?.puntos ?? 0;
// El fibrinógeno puntúa por debajo de 100 mg/dL (misma regla que calcOvertDic).
const tramosFibrinogeno = [
    { label: '≥100', min: 100, max: Infinity, pts: 0 },
    { label: '<100', min: 0, max: 99.999, pts: 1 }
];

export function init() {
    montarVisual('sind-cid', {
        guia: 'La ficha en cuatro imágenes. Toca cualquier recuadro para leer su texto original.',
        paneles: [
            { tipo: 'escalera', titulo: 'De pre-CID a CID franca', nota: 'Terminología de la ficha, de la fase más precoz a la más grave.',
              nodos: ['Pre-CID', 'Coagulopatía', 'CID en fase precoz', 'CID franca'] },
            { tipo: 'puntos', titulo: 'Overt DIC 2025 · corte ≥5', resultado: ['#cid-overt-resultado'], items: [
                { control: '#cid-overt-plaquetas', etiqueta: 'Plaquetas', unidad: '×10⁹/L', tramos: cidOvertDicItems.plaquetas.map(t => ({ ...t, pts: t.puntos })) },
                { control: '#cid-overt-dimero', etiqueta: 'Dímero-D', pts: dimeroPts },
                { control: '#cid-overt-pt', etiqueta: 'Prolongación del TP', unidad: 's', tramos: cidOvertDicItems.ptProlongado.map(t => ({ ...t, pts: t.puntos })) },
                { control: '#cid-overt-fibrinogeno', etiqueta: 'Fibrinógeno', unidad: 'mg/dL', tramos: tramosFibrinogeno }
            ] },
            { tipo: 'puntos', titulo: 'SIC · corte ≥4 (y plaquetas + INR >2)', resultado: ['#cid-sic-resultado'], items: [
                { control: '#cid-sic-plaquetas', etiqueta: 'Plaquetas', unidad: '×10⁹/L', tramos: cidSicItems.plaquetas.map(t => ({ ...t, pts: t.puntos })) },
                { control: '#cid-sic-inr', etiqueta: 'INR', tramos: cidSicItems.inr.map(t => ({ ...t, pts: t.puntos })) },
                { control: '#cid-sic-sofa-resp', etiqueta: 'SOFA respiratorio' },
                { control: '#cid-sic-sofa-cv', etiqueta: 'SOFA cardiovascular' },
                { control: '#cid-sic-sofa-hep', etiqueta: 'SOFA hepático' },
                { control: '#cid-sic-sofa-renal', etiqueta: 'SOFA renal' }
            ] },
            { tipo: 'racimos', titulo: 'Qué aporta cada prueba de laboratorio', grupos: [
                { titulo: 'Utilidad y limitaciones', color: 'purpura', nodos: ['Recuento plaquetario', 'PDF y dímero-D', 'TP y TTPa', 'Fibrinógeno', 'Frotis de sangre periférica', 'Perfiles hemostáticos globales'] }
            ] },
            { tipo: 'racimos', titulo: 'Tratamiento (BCSH 2009)', grupos: [
                { titulo: 'Siempre', color: 'verde', nodos: ['Enfermedad de base'] },
                { titulo: 'Según el cuadro', color: 'amarillo', nodos: ['Plasma y plaquetas.', 'Anticoagulantes.', 'Concentrados de factores anticoagulantes.', 'Antifibrinolíticos.'] },
                { titulo: 'Ya no se usa', color: 'rojo', nodos: ['Nota histórica'] }
            ] }
        ]
    });

    montarVisual('sind-ptt', {
        guia: 'Primero la sospecha (scores), después el tratamiento urgente y lo que viene luego.',
        paneles: [
            { tipo: 'comparar', titulo: 'Dos PTT', columnas: [
                { titulo: 'Inmune (PTTi)', color: 'dorado', nodos: [{ fuente: '#ptt-tipos-lista .compare-box.blue', etiqueta: 'Autoanticuerpos anti-ADAMTS-13' }] },
                { titulo: 'Congénita (PTTc)', color: 'amarillo', nodos: [{ fuente: '#ptt-tipos-lista .compare-box.yellow', etiqueta: 'Mutaciones bialélicas de ADAMTS13' }] }
            ] },
            { tipo: 'puntos', titulo: 'French score', resultado: ['#ptt-french-resultado'], items: [{ checks: '.ptt-french-check' }] },
            { tipo: 'puntos', titulo: 'PLASMIC score', resultado: ['#ptt-plasmic-resultado'], items: [{ checks: '.ptt-plasmic-check' }] },
            { tipo: 'flujo', titulo: 'Tratamiento del episodio agudo', nota: 'Base urgente arriba; debajo, lo que la guía sugiere añadir en la PTTi.', nodos: [
                [{ fuente: 'Recambio plasmático (TPE) urgente', etiqueta: 'Recambio plasmático urgente', color: 'rojo' }, { fuente: 'Corticoides.', color: 'rojo' }],
                [{ fuente: 'Se sugiere el uso de caplacizumab', etiqueta: 'Caplacizumab', color: 'amarillo' }, { fuente: 'Se sugiere añadir rituximab', etiqueta: 'Rituximab', color: 'amarillo' }],
                [{ fuente: 'Riesgo hemorrágico', color: 'purpura' }]
            ] },
            { tipo: 'racimos', titulo: 'Soporte durante el ingreso', grupos: [
                { titulo: 'Cuidados', color: 'dorado', nodos: ['Monitorización.', 'Acceso venoso central.', 'Transfusión de plaquetas.', 'Profilaxis de tromboembolismo venoso.'] }
            ] },
            { tipo: 'comparar', titulo: 'Después del episodio', columnas: [
                { titulo: 'Desencadenantes de recaída', color: 'rojo', nodos: ['Infecciones', 'Embarazo', 'Traumatismo mayor', 'Anticonceptivos orales', 'Cocaína', 'Fármacos:', 'Pancreatitis'] },
                { titulo: 'Complicaciones a largo plazo', color: 'amarillo', nodos: ['Trastornos del estado de ánimo', 'Síntomas neurocognitivos', 'Hipertensión arterial de novo'] }
            ] }
        ]
    });

    montarVisual('sind-slt', {
        guia: 'Diagnóstico, riesgo, prevención y tratamiento del SLT en una pantalla.',
        paneles: [
            { tipo: 'puntos', titulo: 'Cairo-Bishop: laboratorio (≥2 de 4) y clínico (≥1)', resultado: ['#slt-cairobishop-resultado'], items: [
                { checks: '.slt-lab-check' }, { checks: '.slt-clinical-check' }
            ] },
            { tipo: 'selector', titulo: 'Riesgo por enfermedad y tratamiento', control: '#slt-riesgo-select', forma: 'chips', color: 'dorado', resultado: ['#slt-riesgo-resultado'] },
            { tipo: 'racimos', titulo: 'Profilaxis', grupos: [
                { titulo: 'Para todos según riesgo', color: 'verde', nodos: [
                    { fuente: 'Hidratación. Objetivo', etiqueta: 'Hidratación' }, 'Debulking de la enfermedad.', 'Educación del paciente.', 'Evitar fármacos nefrotóxicos.', { fuente: 'Monitorización. Análisis', etiqueta: 'Monitorización' }] }
            ] },
            { tipo: 'comparar', titulo: 'Fármacos uricosúricos', columnas: [
                { titulo: 'Xantina oxidasa', color: 'amarillo', nodos: ['Alopurinol', 'Febuxostat'] },
                { titulo: 'Urato oxidasa', color: 'rojo', nodos: ['Rasburicasa'] }
            ] },
            { tipo: 'flujo', titulo: 'SLT establecido', nodos: [
                { fuente: 'Hidratación. Adultos', etiqueta: 'Hidratación', color: 'dorado' },
                [{ fuente: 'Alteraciones electrolíticas.', color: 'amarillo' }, { fuente: 'Hiperuricemia.', color: 'amarillo' }],
                { fuente: 'Monitorización clínica y analítica.', color: 'dorado' },
                { fuente: 'Las indicaciones son las mismas', etiqueta: 'Indicaciones de TRR', color: 'rojo' }
            ] }
        ]
    });
}
