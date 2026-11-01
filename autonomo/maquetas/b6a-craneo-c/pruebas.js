// Apuesta, «encuentra el error» y caso. Las respuestas viven aquí, no en el HTML. Cada opción falsa dice qué le pasaría al paciente.
export const APUESTA = {
  preset: 'sin', ion: 0, titulo: 'Apuesta antes de tocar', pag: '36',
  antes: 'Hermenegildo, 58 años, ictus de la cerebral media sin trombólisis. PA 200/110. El R2 quiere dar labetalol.',
  pregunta: '¿Qué le pasa a la penumbra si bajas la PA?',
  ops: [
    { t: 'Se salva: bajar la PA a menos de 140/90 protege el tejido sano.', ok: false, por: 'Le quitarías presión a una penumbra cuyo flujo sigue a la PA (autorregulación rota): se apagan anillos y el pronóstico no mejora (p. 36).' },
    { t: 'Pierde flujo y no se gana nada: sin trombólisis solo se baja la PA por encima de 220/120.', ok: true, por: 'Con 200/110 no toca bajarla. Pulsa «Bajar PA» y verás apagarse la penumbra de fuera hacia dentro (p. 36).' },
    { t: 'Se salva si la dejas por debajo de 180/105, que es la cifra que se aplica a todos los ictus agudos.', ok: false, por: 'Esa cifra es para después de la trombólisis o la trombectomía. Aquí le restarías flujo a la penumbra sin beneficio (p. 36).' }],
  orden: [0, 1, 2], tras: (a) => { a.hacer('baja'); a.hacer('baja'); },
};
export const ERROR = {
  preset: 'err', ion: 0, titulo: 'Encuentra el error (hay 0, 1 o 2)', pag: '35',
  antes: 'Hermenegildo, tPA hace 6 h. PA 186/108, SaO₂ 97 % sin O₂, glucosa 210. El R1 escribe la orden: juzga cada línea.',
  frases: [
    { t: 'PA 186/108 → nicardipina a 5 mg/h, para dejarla por debajo de 180/105.', error: false, por: 'Cierto: tras la trombólisis, PA <180/105 durante 24 h; nicardipina empieza a 5 mg/h (Tabla 47.2, p. 36).' },
    { t: 'SaO₂ 97 % → O₂ a 2 L para mantenerla.', error: true, por: 'Error: el O₂ solo se da si la SaO₂ es <90 %; por encima de 94 % hay peor resultado y el O₂ encoge los vasos (p. 34-35).' },
    { t: 'Glucosa 210 → insulina, con objetivo de 140-180 mg/dL.', error: false, por: 'Cierto: se trata por encima de 180 y sin sueros glucosados (p. 37).' },
    { t: 'Aspirina 325 mg ahora, que son las primeras 6 horas.', error: true, por: 'Error: tras la trombólisis la aspirina empieza el día 2, no el día 1 (p. 38).' },
    { t: 'Compresión neumática intermitente para la trombosis.', error: false, por: 'Cierto: es lo que se usa las primeras 24 h tras el tPA (p. 38).' }],
};
export const CASO = {
  preset: 'herme', ion: 0, titulo: 'Hermenegildo, 58 años · ictus con tPA', pag: '36',
  pasos: [
    { enun: 'En UCI: PA 188/110, SaO₂ 93 % sin O₂, glucosa 215. Le pusieron tPA hace dos horas. ¿Qué haces con la PA?', orden: [1, 0, 2], pag: '36',
      ops: [{ t: 'Nada: solo se baja por encima de 220/120.', ok: false, por: 'Esa regla es para quien no recibió trombólisis; con 188/110 tras el tPA el riesgo de hemorragia es de 6,4-8,8 % (p. 36, 39).' },
        { t: 'Labetalol 10 mg en bolo: el objetivo es <180/105 durante 24 h.', ok: true, por: 'Tabla 47.2. Se queda en 174/102: el sello verde lo marca (p. 36).', haz: (a) => a.hacer('baja') },
        { t: 'Nitroprusiato en perfusión, que baja la PA más rápido que el labetalol y el bolo.', ok: false, por: 'Marino lo evita en el ictus: sube la PIC y roba presión de perfusión a la penumbra (p. 36).', haz: (a) => a.hacer('nitro') }] },
    { enun: 'Sigue con SaO₂ 93 % respirando aire. ¿Y el oxígeno?', orden: [0, 1, 2], pag: '35',
      ops: [{ t: 'Gafas a 2 L para llevarla a 98 %.', ok: false, por: 'Pasas de 94 %: peor resultado neurológico y vasos cerebrales más estrechos (p. 34-35).', haz: (a) => a.hacer('fio', { v: 30 }) },
        { t: 'Mascarilla al 60 % hasta que la SaO₂ sea de 100 %, mejor sobrar.', ok: false, por: 'Hiperoxia: el flujo cerebral cae y la SaO₂ por encima de 94 % se asocia a peor evolución (p. 34-35).', haz: (a) => a.hacer('fio', { v: 60 }) },
        { t: 'Ninguno: el O₂ es solo para SaO₂ <90 %.', ok: true, por: 'Con 93 % no hay indicación; el autor apunta a 90-92 % (p. 35).' }] },
    { enun: 'La glucosa sigue en 215 mg/dL. ¿Qué pautas?', orden: [0, 1, 2], pag: '37:mn-isq-glucemia',
      ops: [{ t: 'Un suero glucosado de mantenimiento para no pasar hipoglucemia.', ok: false, por: 'Marino aconseja evitar los glucosados: sube aún más la glucemia del cerebro isquémico (p. 37).', haz: (a) => a.hacer('glu') },
        { t: 'Insulina hasta 140-180 mg/dL.', ok: true, por: 'Pasa a 175 mg/dL: dentro del objetivo (p. 37).', haz: (a) => a.hacer('ins') },
        { t: 'Insulina intensiva hasta 80-110 mg/dL, el control más estricto posible.', ok: false, por: 'Marino avisa: la hiperglucemia es transitoria y el control estricto arriesga hipoglucemia (p. 37).' }] },
    { enun: 'A la hora 5, empeoramiento brusco. La TC muestra una hemorragia (Fig. 47.2). ¿Cuál de los factores de riesgo estaba a la vista?', orden: [1, 2, 0], pag: '39',
      ops: [{ t: 'La PA de 188/110 que tenía al ingreso, por encima de 180/105.', ok: true, por: 'Hemorragia tras tPA 6,4-8,8 %: edad, PA >180/105 y un infarto de más de un tercio del hemisferio (p. 39).' },
        { t: 'La dosis de insulina que se le puso para bajar la glucosa de 215.', ok: false, por: 'No es un factor descrito; el riesgo está en la edad, la PA y la extensión del infarto (p. 39).' },
        { t: 'No haberle puesto oxígeno cuando tenía una SaO₂ de 93 %.', ok: false, por: 'Falta de O₂ no causa la hemorragia; con SaO₂ ≥90 % no estaba indicado (p. 35, 39).' }] },
    { enun: 'A las 36 h tiene fiebre de 38,4 °C. ¿Qué haces?', orden: [0, 1, 2], pag: '37:mn-isq-fiebre',
      ops: [{ t: 'Buscar una infección y bajar la fiebre.', ok: true, por: 'La fiebre empeora la recuperación y la mortalidad; en el ictus suele haber infección (p. 37).', haz: (a) => a.hacer('temp', { v: 38.4 }) },
        { t: 'Esperar: la fiebre de las primeras 72 h es siempre de origen necrótico.', ok: false, por: 'Marino: sugiere origen no infeccioso, pero la mayoría de estudios encuentran infección; hay que buscarla (p. 37).', haz: (a) => a.hacer('temp', { v: 38.4 }) },
        { t: 'Hipotermia sistemática a 33 °C para proteger la penumbra.', ok: false, por: 'El manejo dirigido de la temperatura no mejora la evolución del ictus (p. 37).', haz: (a) => a.hacer('temp', { v: 38.4 }) }] },
  ],
};
export const LLEVAS = {
  apuesta: [['Sin trombólisis solo se baja la PA por encima de 220/120, y sin pasar del 15 % en 24 h.', '36'], ['Con la autorregulación rota, el flujo de la penumbra sigue a la presión.', '36']],
  error: [['El O₂ solo se da con SaO₂ <90 %; por encima de 94 % es peor.', '35'], ['Tras el tPA la aspirina empieza el día 2.', '38']],
  caso: [['Tras la trombólisis la PA debe estar por debajo de 180/105 durante 24 h.', '36'], ['Hemorragia tras tPA: 6,4-8,8 %, con la PA >180/105 entre sus factores.', '39'], ['Glucosa 140-180, sin glucosados; la fiebre se busca y se baja.', '37:mn-isq-glucemia']],
};
// Pinta una lista de opciones en `caja`. El orden se reparte a mano: la correcta cae en sitios distintos.
export function opciones(caja, ops, alResponder, orden0) {
  caja.textContent = ''; const orden = orden0 || ops.map((o, i) => i); delete caja.dataset.hecho;
  for (const i of orden) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.textContent = ops[i].t;
    b.addEventListener('click', () => {
      if (caja.dataset.hecho) return; caja.dataset.hecho = '1';
      [...caja.querySelectorAll('.op')].forEach((x, j) => { x.disabled = true; x.classList.add(ops[orden[j]].ok ? 'bien' : (x === b ? 'mal' : 'neutra')); });
      const p = document.createElement('p'); p.className = 'por ' + (ops[i].ok ? 'ok' : 'no'); p.textContent = (ops[i].ok ? 'Bien. ' : 'No. ') + ops[i].por; caja.append(p);
      alResponder(ops[i], i);
    });
    caja.append(b);
  }
}
