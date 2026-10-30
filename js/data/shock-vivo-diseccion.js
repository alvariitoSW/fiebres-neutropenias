// Joaquín a las 08:25 (b3-paso4 g5, pieza 5d): la cabecera de la disección aórtica en el shock vivo. Sin DOM.
// Fuente: Marino, The ICU Book 5.ª ed., cap. 20 (docs/marino-2024-cardiac-disorders-caps18-21.pdf): betabloqueo p. 46-47, disección p. 50-52,
// Tabla 20.5 en p. 51-52. Las cifras del monitor son del motor (soporte.mjs, RECETA_DISECCION y diseccion-farmacos.mjs): ilustrativas;
// la dirección de cada fármaco, de la ficha. El estado se define aquí y no en shock-vivo-data.js (que ya roza las 700 líneas).
import { RECETA_DISECCION } from '../modules/libros/shock-vivo/soporte.mjs';

const F = 'mc-diseccion-aortica';
export const CITAS_DISEC = {
  fisio: { f: F, id: 'mc-diseccion-fisio', sitio: 'Fisiopatología', p: 50 },
  tabla: { f: F, id: 'mc-tabla-20-5', sitio: 'Tabla 20.5', p: '51-52' },
  manejo: { f: F, id: 'mc-diseccion-manejo', sitio: 'Manejo: la cizalla', p: 51 },
  objetivos: { f: F, id: 'mc-diseccion-objetivos', sitio: 'Objetivos: PA, dolor y cirugía', p: 52 },
  claves: { f: F, id: 'mc-diseccion-claves', sitio: 'Tres claves', p: 50 },
};
export const OBJETIVO_PAS = [118, 122];      // «PAS de 120» (p. 52), con 2 mmHg de margen a cada lado: ilustrativo
export const FC_BAJA = 75;                   // «FC baja» del objetivo: la ficha no da cifra (sí «la bajada no debe ir con taquicardia»): ilustrativo
export const FC_BRADI = 50, PAS_TOLERADA = 90;   // bradicardia: ilustrativo; PAS «hasta 90 suele tolerarse» (p. 52)

export const PACIENTE_DISECCION = { k: 'joaquin-0', nombre: 'Joaquín a las 08:25', chip: 'disección', tipo: 'diseccion', peso: 84, edad: 56, sexo: 'varón', hb: 13.5, fr: 20, t: 36.8, obj: 'marino-14-5',
  rec: RECETA_DISECCION, ficha: F, linea: '56 años, 84 kg · dolor torácico intenso y PA alta · una hora antes de su taponamiento (disección tipo A)' };

const c1 = (x) => (+x).toFixed(1).replace('.', ',');
export const sinBetabloqueo = (a) => !(a.esmolol > 0) && !(a.labetalol > 0);
export const conVaso = (a) => a.nicardipino > 0 || a.nitroprusiato > 0;
export const enObjetivo = (R) => R.pas >= OBJETIVO_PAS[0] && R.pas <= OBJETIVO_PAS[1] && R.fc < FC_BAJA;

export const ESTADO_DISECCION = { tit: 'Disección aórtica: bajar la PA sin cizalla',
  frase: (R, X) => {
    const a = X.ajuste;
    if (R.pas < PAS_TOLERADA) return `PAS ${R.pas}: por debajo de lo que se tolera. Baja la dosis.`;
    if (conVaso(a) && sinBetabloqueo(a)) return `PA ${R.pas}/${R.pad} pero FC ${R.fc} e IC ${c1(R.ic)}: el vasodilatador solo sube el pulso y el gasto, y eso aumenta la cizalla. Añade un betabloqueante.`;
    if (enObjetivo(R)) return `PAS ${R.pas} con FC ${R.fc}: es el objetivo. La PA baja sin taquicardia ni más gasto (IC ${c1(R.ic)}).`;
    if (a.esmolol > 0 || a.labetalol > 0) return `PA ${R.pas}/${R.pad}, FC ${R.fc}, IC ${c1(R.ic)}: el betabloqueo frena el pulso y el gasto. ${R.pas > OBJETIVO_PAS[1] ? `La PAS aún está por encima de 120: añade un vasodilatador, ya protegido por el betabloqueo.` : `La PAS está por debajo de 120; hasta 90 se tolera.`}`;
    return `PA ${R.pas}/${R.pad} y FC ${R.fc}: la pared de la aorta sufre con cada latido. Empieza por el betabloqueo (esmolol).`;
  },
  org: 'ficha · cap. 20, p. 50-52 · las cifras del monitor: modelo (ilustrativo)',
  guia: [
    { t: 'Joaquín llega con la PA alta y dolor intenso. En la disección tipo A, la sangre abre una luz falsa en la pared de la aorta (p. 50).', s: ['[data-fila="pa"]'], c: CITAS_DISEC.fisio },
    { t: (R) => `La regla: la PA baja (${R.pas}/${R.pad} ahora) pero sin taquicardia ni más gasto cardíaco (FC ${R.fc}, IC ${c1(R.ic)}), porque ambos aumentan la cizalla que propaga la disección.`, s: ['[data-fila="fc"]', '[data-fila="ic"]'], c: CITAS_DISEC.manejo },
    { t: 'Por eso el primero es un betabloqueante, y el esmolol por titularse deprisa. El nicardipino o el nitroprusiato solo valen combinados con él.', s: ['#shv-dock-panel'], c: CITAS_DISEC.tabla },
    { t: (R) => `Objetivo: PAS de 120, aunque hasta 90 suele tolerarse. Ahora ${R.pas}. Con el dolor tratado con opioides desde el principio, el simpático no vuelve a subir FC, gasto y PA.`, s: ['[data-fila="pa"]'], c: CITAS_DISEC.objetivos },
  ] };
