// «Placa portátil de UCI» (PIF Radiología): cuaderno de campo y tres tarjetas Sí/No.
// Cada criterio sale literal de una ficha ya hecha de la app (Marino, The ICU Book, 5.ª ed.) y lleva su página.
import { initCorkboard } from '../../core/corkboard.js';
import { initSiNoWizard } from '../../core/wizard.js';

const PDF = {
    tubo: 'docs/marino-2024-respiratory-management-caps27-30.pdf',
    via: 'docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf',
    sonda: 'docs/marino-2024-nutricion-endocrino-caps48-51.pdf',
};
const cita = (pdf, pag, txt) => `<br><small style="font-weight:400;">${txt} <a class="biblio-link" href="${PDF[pdf]}#page=${pag}" target="_blank" rel="noopener">pág. ${pag}</a></small>`;
const ver = (esp, view, panel, tab, res, rot) =>
    `<br><button type="button" class="especialidad-link" style="margin-top:8px;" data-especialidad="${esp}" data-view="${view}" data-panel="${panel}" data-tab="${tab}"${res ? ` data-resaltar="${res}"` : ''}>🔗 Ver en el texto: ${rot} →</button>`;

const T_TUBO = c => c + ver('neumologia', 'merinoNeumologia', 'panel-merino-neumo-tabs', 'neumo-vias-artificiales', '#neumo-et-altura', 'Vías artificiales (Merino Neumología)');
const T_VIA = (c, res) => c + ver('libros', 'marinoFundamentos', 'panel-marino-fund-tabs', 'mar-cvc-complicaciones', res, 'Tras el catéter central (Marino, cap. 2)');
const T_SONDA = (c, res) => c + ver('libros', 'marinoNutricion', 'panel-marino-nutri-tabs', 'mu-pauta-enteral', res, 'Alimentación enteral (Marino, cap. 49)');

export const PASOS_TUBO = {
    inicio: { pregunta: '¿Localizas la carina en la placa (si no se ve, en el espacio T4-T5)?',
        si: 't2',
        no: { estado: 'tfg-estado-warn', final: T_TUBO('Si la bifurcación o carina no es visible, puede localizarse al nivel del espacio T4-T5 en una radiografía portátil. Sin ese punto de referencia no puedes valorar la punta.' + cita('tubo', 18, 'Marino, cap. 28.')) } },
    t2: { pregunta: '¿La punta está por debajo de la carina, o ves el tubo en el bronquio principal derecho o atelectasia del pulmón izquierdo no ventilado?',
        si: { estado: 'tfg-estado-danger', final: T_TUBO('Migración: cuando los tubos se mueven hacia los pulmones, a menudo terminan en el bronquio principal derecho, que sigue un curso más recto desde la tráquea.' + cita('tubo', 18, 'Marino, cap. 28 (la figura 28.2 está en la pág. 19).')) },
        no: 't3' },
    t3: { pregunta: 'Con la cabeza en posición neutra, ¿la punta está de 3 a 5 cm por encima de la bifurcación traqueal, o a medio camino entre la bifurcación y las cuerdas vocales?',
        si: 't4',
        no: { estado: 'tfg-estado-warn', final: T_TUBO('No cumple la posición correcta de la ficha. Recuerda que la flexión o extensión de la cabeza y el cuello desplaza 2 cm la punta.' + cita('tubo', 18, 'Marino, cap. 28.')) } },
    t4: { pregunta: '¿La punta del tubo está a no más de 21 cm de los dientes en una mujer, o de 23 cm en un hombre?',
        si: { estado: 'tfg-estado-ok', final: T_TUBO('Posición correcta y dentro del margen que reduce el riesgo de migración.' + cita('tubo', 19, 'Marino, cap. 28.')) },
        no: { estado: 'tfg-estado-warn', final: T_TUBO('El riesgo de migración del tubo se reduce manteniendo la punta a no más de 21 cm de los dientes en mujeres y 23 cm en hombres.' + cita('tubo', 19, 'Marino, cap. 28.')) } },
};

export const PASOS_VIA = {
    inicio: { pregunta: '¿Tienes una radiografía de tórax hecha tras canalizar la vía?',
        si: 'v2',
        no: 've1' },
    ve1: { pregunta: 'Sin placa, con un catéter subclavio: ¿has mirado con eco las dos yugulares para descartar que haya subido hacia la cabeza? (Si es yugular, contesta Sí y pasa a las burbujas.)',
        si: 've2',
        no: { estado: 'tfg-estado-warn', final: T_VIA('Con un catéter subclavio, la ficha propone mirar las dos yugulares para descartar que haya subido hacia la cabeza; se puede hacer durante el procedimiento y recolocarlo ya.' + cita('via', 36, 'Marino, cap. 2 (la ecografía continúa en la pág. 37).'), '#mar-punta-eco') } },
    ve2: { pregunta: 'Con eco subcostal, tras inyectar rápido 10 mL de suero por la luz distal, ¿aparecen microburbujas en la aurícula en menos de 2 segundos?',
        si: { estado: 'tfg-estado-ok', final: T_VIA('Las burbujas en menos de 2 segundos indican que la punta está en la cava superior.' + cita('via', 37, 'Marino, cap. 2.'), '#mar-punta-eco') },
        no: { estado: 'tfg-estado-warn', final: T_VIA('La ficha solo da este criterio: burbujas en la aurícula confirman que el catéter está en el sistema venoso, y en menos de 2 segundos, que la punta está en la cava superior.' + cita('via', 37, 'Marino, cap. 2.'), '#mar-punta-eco') } },
    v2: { pregunta: '¿El catéter baja recto por el mediastino?',
        si: 'v3',
        no: { estado: 'tfg-estado-danger', final: T_VIA('No sigue el trayecto recto por el mediastino del catéter bien colocado (fig. 2.6). Aparte: la malposición se describe en el 15-18% de las canulaciones, sobre todo con la subclavia.' + cita('via', 36, 'Marino, cap. 2.'), '#mar-punta-rx') } },
    v3: { pregunta: '¿La punta queda a la altura de la carina o algo por encima?',
        si: { estado: 'tfg-estado-ok', final: T_VIA('Posición adecuada: la carina está justo encima de la unión entre la cava superior y la aurícula derecha. El objetivo es la punta en la cava superior, 1-2 cm por encima de la aurícula derecha.' + cita('via', 36, 'Marino, cap. 2.'), '#mar-punta-rx') },
        no: { estado: 'tfg-estado-danger', final: T_VIA('Fuera del objetivo: la cava superior, con la punta 1-2 cm por encima de la aurícula derecha.' + cita('via', 36, 'Marino, cap. 2.'), '#mar-punta-objetivo') } },
};

export const PASOS_SONDA = {
    inicio: { pregunta: '¿Tienes ya una radiografía portátil de tórax hecha después de colocar la sonda?',
        si: 's2',
        no: { estado: 'tfg-estado-danger', final: T_SONDA('Hace falta una radiografía portátil tras cada inserción, y no se empieza a alimentar hasta verificar la posición. El «soplido» al insuflar aire y auscultar el epigastrio no basta: un chorro de aire en el pulmón también se oye en el epigastrio.' + cita('sonda', 27, 'Marino, cap. 49 (la advertencia sobre empezar la nutrición, en la pág. 28).'), '#mu-sonda-whoosh') } },
    s2: { pregunta: '¿La sonda baja recta por el mediastino y biseca el ángulo de la bifurcación traqueal?',
        si: 's3',
        no: { estado: 'tfg-estado-danger', final: T_SONDA('Si se desvía a la derecha a la altura de la bifurcación, sigue el bronquio principal derecho: está en el pulmón. Una sonda fina con fiador puede llegar lejos y causar neumotórax.' + cita('sonda', 28, 'Marino, cap. 49 (continúa en la pág. 29).'), '#mu-sonda-mal') } },
    s3: { pregunta: '¿La punta está por debajo de la cúpula del hemidiafragma izquierdo?',
        si: { estado: 'tfg-estado-ok', final: T_SONDA('Estómago probable. La posición óptima es unos 10 cm por debajo de la cúpula, lejos de la unión gastroesofágica.' + cita('sonda', 27, 'Marino, cap. 49.'), '#mu-sonda-rx') },
        no: { estado: 'tfg-estado-warn', final: T_SONDA('La ficha da la colocación en el estómago como probable si la punta está por debajo de la cúpula del hemidiafragma izquierdo.' + cita('sonda', 27, 'Marino, cap. 49.'), '#mu-sonda-rx') } },
};

export function init() {
    initCorkboard('pif-radio-corkboard', 'panel-pif-radio-tabs');
    initSiNoWizard('radio-tubo', PASOS_TUBO);
    initSiNoWizard('radio-via', PASOS_VIA);
    initSiNoWizard('radio-sonda', PASOS_SONDA);
}
