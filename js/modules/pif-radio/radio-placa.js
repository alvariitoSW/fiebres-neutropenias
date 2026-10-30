// «Placa portátil de UCI» (PIF Radiología): cuaderno de campo y tres tarjetas Sí/No.
// Cada criterio sale literal de una ficha ya hecha de la app (Marino, The ICU Book, 5.ª ed.) y lleva su página.
import { initCorkboard } from '../../core/corkboard.js';
import { initSiNoWizard } from '../../core/wizard.js';
import { montarRotulos } from '../../core/figura-rotulos.js';
import { ROTULOS_PIF_RADIO } from '../../data/pif-radio-rotulos.js';

const PDF = {
    tubo: 'docs/marino-2024-respiratory-management-caps27-30.pdf',
    via: 'docs/marino-2024-acceso-vascular-practicas-caps1-4.pdf',
    sonda: 'docs/marino-2024-nutricion-endocrino-caps48-51.pdf',
    neuro: 'docs/marino-2024-neurologia-caps45-47.pdf',
    azul: 'docs/libro-azul-seccion-viii-neurologia-parte1.pdf',
    umi: 'docs/hugcdn-umi-manual-guardia-parte2.pdf',
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

const ne = c => c.replace(/\. /, '.</strong><span style="font-weight:400"> ') + '</span><strong>';
const T_UMI = (c, res, rot) => ne(c) + ver('sobrevivirUmi', 'manualUmi', 'panel-manual-umi-tabs', 'umi-marshall', res, rot || 'Clasificación de Marshall (Manual UMI)');
const T_UMI_TCE = c => (c.includes('font-weight:400') ? c : ne(c)) + ver('sobrevivirUmi', 'manualUmi', 'panel-manual-umi-tabs', 'umi-tce-manejo', '', 'Manejo del TCE (Manual UMI)');
const T_NEURO = (c, tab, res, rot) => ne(c) + ver('libros', 'marinoNeuro', 'panel-marino-neuro-tabs', tab, res, rot);

export const PASOS_CRANEO = {
    inicio: { pregunta: '¿Ves sangre, es decir, una zona hiperdensa (más blanca que el parénquima) en la TC sin contraste?',
        si: 'c2',
        no: 'c5' },
    c2: { pregunta: '¿Hay desviación de la línea media (más de 5 mm) o una lesión de masa que la empuja?',
        si: { estado: 'tfg-estado-danger', final: T_UMI_TCE(T_UMI('Efecto de masa. Marino muestra una hemorragia intracerebral masiva con desviación de la línea media tras trombólisis, y pide neurocirugía. En el TCE, la línea media desviada más de 5 mm y los hematomas de más de 15 cc son factores de mal pronóstico. En la clasificación de Marshall, el swelling unilateral con línea media desviada es el tipo IV (HTIC en el 100% según el manual) y la lesión de más de 25 cc sin evacuar, masa no evacuada (84,6%). El manual imprime 20 mm en el tipo IV; esta app usa más de 5 mm (nota en la ficha).' + cita('umi', 42, 'Manual UMI, pág. 94 del manual; factores pronósticos en el PDF pág. 27 (pág. 79 del manual) y Marino, cap. 47, <a class="biblio-link" href="' + PDF.neuro + '#page=40" target="_blank" rel="noopener">pág. 40</a>.'), '#umi-marshall-nota')) },
        no: 'c3' },
    c3: { pregunta: '¿Las cisternas basales están comprimidas o ausentes?',
        si: { estado: 'tfg-estado-danger', final: T_UMI_TCE(T_UMI('Swelling: es el tipo III de Marshall (swelling bilateral, ausencia de cisternas de la base; HTIC en el 63,2%). La ausencia de cisternas basales figura entre los factores de mal pronóstico del TCE. El Libro Azul recoge la compresión de las cisternas como signo del edema difuso, y que con GCS de 8 o menos y TC anormal (hematoma, contusión, edema) la monitorización de la PIC es beneficiosa.' + cita('umi', 42, 'Manual UMI, pág. 94 del manual') + ' · <small>Libro Azul, <a class="biblio-link" href="' + PDF.azul + '#page=51" target="_blank" rel="noopener">pág. 51</a> (cisternas comprimidas en el edema difuso) y <a class="biblio-link" href="' + PDF.azul + '#page=52" target="_blank" rel="noopener">pág. 52</a></small>', '#umi-marshall-tabla')) },
        no: 'c4' },
    c4: { pregunta: '¿La sangre está en el espacio subaracnoideo (rodea la base del cerebro) en lugar de dentro del parénquima?',
        si: { estado: 'tfg-estado-danger', final: T_NEURO('Hemorragia subaracnoidea: la sangre en el espacio subaracnoideo, tras la rotura de un aneurisma sacular. La sangre bloquea el flujo del LCR y puede causar hidrocefalia obstructiva e hipertensión intracraneal. Hasta asegurar el aneurisma, la fuente propone una TAS de 140 mm Hg o menos con labetalol, y cerrarlo (con neurocirugía o radiología intervencionista): los resultados mejoran si se hace en los primeros 3 días.' + cita('neuro', 47, 'Marino, cap. 47 (el espacio subaracnoideo, en la pág. 45).'), 'mn-hsa', '#mn-hsa-inmediato', 'Hemorragia subaracnoidea (Marino, cap. 47)') },
        no: { estado: 'tfg-estado-warn', final: T_NEURO('Hematoma sin efecto de masa: hiperdenso dentro del parénquima. En la fuente (fig. 47.3), el hematoma intracerebral es hiperdenso y se abre a los ventrículos, con riesgo de hidrocefalia obstructiva. Aun sin desviar la línea media, la primera preocupación es frenar su crecimiento: revertir los antitrombóticos, TAS por debajo de 140 mm Hg y neurocirugía si es grande, crece o hay sangre intraventricular.' + cita('neuro', 42, 'Marino, cap. 47 (reversión, págs. 42-44; tensión y neurocirugía, pág. 45; figura 47.3, pág. 43). Las fuentes de la app no distinguen aquí el hematoma epidural del subdural.'), 'mn-hic', '#mar-img-47-3', 'Hemorragia intracerebral (Marino, cap. 47)') } },
    c5: { pregunta: 'Sin sangre: ¿ves una zona hipodensa focal (más oscura que el parénquima)?',
        si: { estado: 'tfg-estado-warn', final: T_NEURO('Hipodensidad focal, compatible con el edema de un infarto. La TC detecta el edema focal como una señal hipodensa anormal, y el infarto es un ejemplo de edema focal (Libro Azul). En el ictus isquémico, cuanto mayor es el área isquémica, más edema, y es el edema, junto a la hemorragia, lo que más pesa en el mal pronóstico. Si el paciente empeora por el edema, Marino da suero hipertónico; no recomienda monitorizar la PIC.' + cita('azul', 51, 'Libro Azul, sección VIII.') + ' · <small><a class="biblio-link" href="' + PDF.neuro + '#page=40" target="_blank" rel="noopener">Marino, cap. 47, pág. 40</a></small>', 'mn-ictus-complicaciones', '#mn-isq-edema', 'Edema cerebral tras el ictus (Marino, cap. 47)') },
        no: { estado: 'tfg-estado-neutro', final: T_UMI_TCE('TC sin sangre ni hipodensidad focal: es lo que ves, no un diagnóstico. En el TCE, el Libro Azul recoge que con GCS de 8 o menos y TC normal la monitorización de la PIC es beneficiosa si hay más de 40 años, TAS por debajo de 90 mm Hg o daño focal. Si el edema es difuso, pierde la diferencia entre sustancia blanca y gris y se comprimen las cisternas. Qué hacer con una TC normal en las primeras horas de un ictus no lo dice ninguna de las fuentes de la app, y aquí no se afirma.' + cita('azul', 51, 'Libro Azul, sección VIII (monitorización con TC normal, pág. 52).')) } },
};

export function init() {
    initCorkboard('pif-radio-corkboard', 'panel-pif-radio-tabs');
    initSiNoWizard('radio-tubo', PASOS_TUBO);
    initSiNoWizard('radio-via', PASOS_VIA);
    initSiNoWizard('radio-sonda', PASOS_SONDA);
    initSiNoWizard('radio-craneo', PASOS_CRANEO);
    montarRotulos(document.getElementById('pif-radio-placa-view'), ROTULOS_PIF_RADIO);
}
