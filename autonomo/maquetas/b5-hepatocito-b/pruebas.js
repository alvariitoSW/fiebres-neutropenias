// Apuesta, «encuentra el error» y caso (Casimira, 4 pasos). Las respuestas viven aquí, no en el HTML. Cada opción falsa dice qué le pasaría a la paciente.
// Páginas = PDF B (Marino 2024, cap. 39).
export const APUESTA = {
  preset: 'sano', pag: 6,
  antes: 'Un hígado sano, con la producción intestinal de NH₃ en lo normal. Muere el 70 % de los hepatocitos (quedan 30 %); el colon sigue produciendo lo mismo.',
  pregunta: '¿Por qué sube el amonio arterial: por más producción o por menos depuración?',
  ops: [
    { t: 'Por más producción: sin el hígado, las bacterias del colon fabrican más amonio de lo normal.', ok: false, por: 'Si frenas solo la producción con lactulosa y no cuentas con el carril apagado, el amonio sigue subiendo y llega al astrocito.' },
    { t: 'Por menos depuración: el colon produce lo mismo y el carril de la urea deja pasar NH₃.', ok: true, por: 'El hígado es el que aclara el amonio convirtiéndolo en urea; si ese mecanismo falla, el amonio sube de forma progresiva (p. 6). El modelo marca unos 113 µmol/L (cifra ilustrativa) con la misma producción.' },
    { t: 'No sube: el músculo y el riñón lo compensan.', ok: false, por: 'Músculo y riñón producen en menor grado, no depuran: la paciente acumularía amonio hasta pasar de 100 µmol/L.' }],
  orden: [0, 1, 2], tras: (a) => a.poner({ func: 30 }),
};
export const ERROR = {
  preset: 'casimira', pag: 7,
  antes: 'Texto de la guardia para una paciente con encefalopatía hepática. Juzga cada frase antes de ver qué hace la lactulosa en el colon.',
  frases: [
    { t: 'Objetivo de lactulosa: 2-3 deposiciones blandas al día; si aparece diarrea, se reduce o se para.', error: false, por: 'Cierto (p. 7): la diarrea osmótica obliga a reducir o parar.' },
    { t: 'Las bacterias lácticas convierten la lactulosa en ácidos grasos de cadena corta, la luz se alcaliniza y desaparecen los productores de amonio.', error: true, por: 'Falso: la luz se acidifica, y ese ácido es lo que elimina los microbios productores de amonio (p. 7). Con una luz alcalina el amonio seguiría subiendo.' },
    { t: 'La CVVH se plantea con oliguria persistente, amonio >150 µmol/L o edema cerebral, sea cual sea la creatinina.', error: false, por: 'Cierto (p. 8): el criterio no depende de la creatinina.' }],
};
export const CASO = {
  preset: 'casimira', titulo: 'Casimira, 44 años · paracetamol en tres productos',
  pasos: [
    { enun: 'Hora 36 de la ingesta: ALT 5.800 U/L, bilirrubina 2,1 mg/dL, INR 3,4, paracetamol indetectable. Aún sin encefalopatía. ¿Pones NAC?', estado: { func: 65, vit: { pa: '118/72', fc: '84' } }, pag: 3, orden: [1, 0, 2],
      ops: [{ t: 'Espero a repetir el paracetamol: si sigue indetectable, no hay nada que antidotar y la NAC no tiene sentido.', ok: false, por: 'El paracetamol es indetectable en el 50 % de estos fallos; perderías horas de NAC (p. 3).' },
        { t: 'Sí, NAC ya: más eficaz en las primeras 10 h, pero vale a cualquier hora.', ok: true, por: 'Regla del libro (p. 3).' },
        { t: 'Solo si han pasado menos de 10 h desde la ingesta; después ya no cambia el pronóstico.', ok: false, por: 'Ella lleva 36 h: la dejarías sin tratamiento aunque aún le sirve (p. 3).' }] },
    { enun: 'Día 2: desorientada en el tiempo (West Haven 2), creatinina 1,1 mg/dL y amonio arterial 165 µmol/L. Enciende en el dock el mando que corresponde.', estado: { func: 20, vit: { pa: '110/68', fc: '92' } }, pag: 8, mando: 'cvvh',
      ok: 'Bien: CVVH con amonio >150, sea cual sea la creatinina; en el fallo agudo es superior a la lactulosa y la rifaximina, y cuanto antes mejor (p. 8).' },
    { enun: 'Día 3: diuresis 0,3 mL/kg/h, PA 82/45, albúmina 2,6 g/dL. ¿Qué fluido y qué vasopresor?', estado: { func: 15, cvvh: 1, vit: { pa: '82/45', fc: '112' } }, pag: 5, orden: [2, 0, 1],
      ops: [{ t: 'Ringer lactato en bolos para reponer volumen y noradrenalina si la PA no sube.', ok: false, por: 'El Ringer lactato baja el sodio y favorece el edema cerebral: no es el fluido de ella (p. 5).' },
        { t: 'Albúmina al 5 % y noradrenalina; nada de Ringer lactato.', ok: true, por: 'La albúmina al 5 % deja el 70 % en el espacio intravascular y no baja el sodio (p. 5).' },
        { t: 'Furosemida para sacar la oliguria y luego volumen.', ok: false, por: 'Vacías más el espacio intravascular con 82/45: la hipotensión empeora (fisiología general).' }] },
    { enun: 'Día 4: estupor, desorientada en lugar y tiempo (West Haven 3). La TC muestra surcos borrados, como la Fig. 39.2. ¿Qué haces?', estado: { func: 8, cvvh: 1, vit: { pa: '104/60', fc: '66' } }, pag: 8, orden: [1, 2, 0],
      ops: [{ t: 'Consulto ya con trasplante: es el tratamiento definitivo (mortalidad del 80 al 33 %).', ok: true, por: 'Hay que avisar al equipo de trasplante ante toda encefalopatía progresiva (p. 8).' },
        { t: 'Subo la lactulosa hasta 5-6 deposiciones al día para bajar el amonio más deprisa que con la CVVH.', ok: false, por: 'Deshidratas a una paciente hipotensa y no tratas la causa; el sello de hipovolemia salta a las 6 deposiciones (p. 7).' },
        { t: 'Mantengo la CVVH 48 h más y reevalúo antes de llamar a nadie.', ok: false, por: 'Con encefalopatía progresiva, esperar es perder la ventana: el trasplante es el tratamiento definitivo (p. 8).' }] },
  ],
};
export const LLEVAS = {
  apuesta: [['Si falla el hígado, el amonio sube por menos depuración: el carril de la urea se apaga.', 6], ['El astrocito convierte el amonio en glutamina, que arrastra agua.', 6]],
  error: [['La lactulosa acidifica la luz y elimina los productores de amonio; objetivo 2-3 deposiciones blandas.', 7], ['CVVH: oliguria, amonio >150 o edema, sea cual sea la creatinina.', 8]],
  caso: [['>150 µmol/L = CVVH ya, aunque la creatinina sea normal.', 8], ['Albúmina al 5 % y no Ringer lactato en el fallo hepático agudo.', 5], ['Encefalopatía progresiva: avisar a trasplante.', 8]],
};
export function opciones(caja, ops, alResponder, orden0) {
  caja.textContent = ''; const orden = orden0 || ops.map((o, i) => i);
  for (const i of orden) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.textContent = ops[i].t;
    b.addEventListener('click', () => {
      if (caja.dataset.hecho) return; caja.dataset.hecho = '1';
      [...caja.children].forEach((x, j) => { x.disabled = true; x.classList.add(ops[orden[j]].ok ? 'bien' : (x === b ? 'mal' : 'neutra')); });
      const p = document.createElement('p'); p.className = 'por ' + (ops[i].ok ? 'ok' : 'no'); p.textContent = (ops[i].ok ? 'Bien. ' : 'No. ') + ops[i].por; caja.append(p); alResponder(ops[i], i);
    });
    caja.append(b);
  }
  delete caja.dataset.hecho;
}
