// Apuesta, «encuentra el error» y caso. Las respuestas viven aquí, no en el HTML. Cada opción falsa dice qué le pasaría al paciente.
export const APUESTA = {
  preset: 'damian', ion: 'k', antes: 'Damián, 52 años, alcohólico desnutrido, ya con nutrición. K⁺ 3,5 mEq/L, Mg²⁺ 1,2 mEq/L, fosfato 1,8 mg/dL.',
  pregunta: '¿Qué hace el K⁺ del suero si le das glucosa con insulina («Realimentar»)?', pag: 21,
  ops: [
    { t: 'Baja, aunque el potasio total no cambia: la insulina lo mete en la célula.', ok: true, por: 'El suero cae y el total no se mueve (E p. 21). El K⁺ queda en 3,0 y el fosfato en 0,9 (cifras ilustrativas de una dosis; en el libro el fosfato cae en días de nutrición parenteral, p. 49): por eso se vigila.' },
    { t: 'Sube, porque la glucosa arrastra potasio al plasma y deja de hacer falta reponerlo; la hipopotasemia se corrige sola en horas.', ok: false, por: 'Le dejarías sin reponer con el K⁺ bajando a 3,0: riesgo de arritmia y debilidad.' },
    { t: 'No cambia: la insulina solo mueve la glucosa.', ok: false, por: 'El K⁺ cae medio punto sin que lo esperes: Damián llega a 3,0 sin vigilancia.' }],
  orden: [1, 0, 2], tras: (a) => a.hacer('real'),
};
export const ERROR = {
  preset: 'normal', ion: 'ca', estado: { alb: 2.0 }, pag: 43,
  antes: 'Albúmina 2,0 g/dL. Ca total 7,4 mg/dL. El Ca iónico está tapado: primero juzga cada frase.',
  frases: [
    { t: 'Ca total 7,4 con albúmina 2,0: hipocalcemia grave, hay que dar calcio.', error: true, por: 'Falso: con poca albúmina baja el total y el iónico sigue en 4,6 (E p. 43). Dar calcio aquí no corrige nada y solo arriesga (E p. 46).' },
    { t: 'Corrijo el total con la fórmula de la albúmina y con eso decido.', error: true, por: 'Falso: ninguno de los factores de corrección es fiable; hay que medir el iónico con electrodo (E p. 43).' },
    { t: 'Para decidir mido el Ca iónico con electrodo, sin gas en la muestra y sin tubo con citrato.', error: false, por: 'Cierto (E p. 43): el iónico es la fracción activa.' }],
};
export const CASO = {
  preset: 'valentin', ion: 'ca', pag: 44, titulo: 'Valentín, 45 años · politrauma, 10 concentrados en 3 h',
  pasos: [
    { enun: 'PA 98/60, pH 7,22, albúmina 3,0. El laboratorio da Ca total 8,4 mg/dL («casi normal»). ¿En qué te fías?', antes: { oculto: true }, orden: [1, 0, 2], pag: 44,
      ops: [{ t: 'Pido un Ca iónico: el total mide las tres fracciones y el citrato quela calcio sin bajarlo.', ok: true, por: 'El iónico sale en 0,82 mmol/L (3,3 mg/dL): el citrato lo ha quelado (E p. 44).' },
        { t: 'Corrijo el total por la albúmina con la fórmula y, si sale normal, no hago nada.', ok: false, por: 'Lo normal de la fórmula tapa un iónico en 0,82 mmol/L; seguirías transfundiendo sin calcio (E p. 43).' },
        { t: 'Doy bicarbonato para el pH y vuelvo a pedir el total.', ok: false, por: 'El bicarbonato forma complejos con el calcio y baja aún más el iónico (E p. 44).' }] },
    { enun: 'Ca iónico 0,82 mmol/L. El libro reserva el calcio IV a la reacción adversa grave o al síntoma, y avisa de que se asocia a fallo multiorgánico (E p. 45-46). Supón que la hipotensión se atribuye al calcio bajo y decides tratar: ¿cuánto y cuál?', orden: [0, 2, 1], pag: 45,
      ops: [{ t: '22 mL de gluconato al 10 % (200 mg elementales) y luego 1-2 mg/kg/h.', ok: true, por: 'Es el bolo recomendado y la perfusión de la ficha (E p. 45): el iónico sube.', haz: (a) => a.hacer('ca', { mg: 200 }) },
        { t: '10 mL de cloruro cálcico: es más potente y lo arregla de golpe.', ok: false, por: 'Son 270 mg de golpe, por encima del bolo recomendado de 200; el cloruro se reserva al colapso (E p. 27, 45).' },
        { t: '100 mL de gluconato de golpe para ir sobrados.', ok: false, por: '900 mg en bolo: sello de bolo excesivo (tope ilustrativo); el calcio IV puede dañar la célula (E p. 46).' }] },
    { enun: 'Siguen sangrando: 4 concentrados más (14 en total). El K⁺ del suero sube y el iónico vuelve a caer. ¿Qué haces con el calcio?', pag: 25, orden: [1, 2, 0], antes: { units: 14 },
      ops: [{ t: 'Sigo con la perfusión de 1-2 mg/kg/h y mido iónico y K⁺: el K⁺ de las bolsas se acumula si el riñón no filtra.', ok: true, por: 'Cada concentrado de 18 días trae 2-3 mEq de K⁺ y quela calcio (E p. 25, 44).' },
        { t: 'Paro el calcio: el iónico ya se corrigió hace una hora.', ok: false, por: 'Con 4 bolsas más el iónico vuelve a caer hacia 0,65 mmol/L, donde el libro sitúa la hipotensión y la ectopia (E p. 45).' },
        { t: 'Pongo bolos de 500 mg cada vez que baje.', ok: false, por: 'Cada bolo pasa de los 200 mg recomendados: sello de exceso (tope ilustrativo) y el calcio vuelve a caer a los 30 min (E p. 45-46).' }] },
  ],
};
// Pinta una lista de opciones en `caja`. `alResponder(op, i)` recibe la elegida. Devuelve nada; no deja respuestas en el HTML.
export function opciones(caja, ops, alResponder, orden0) {
  caja.textContent = '';
  const orden = orden0 || ops.map((o, i) => i);   // el orden se reparte a mano: la correcta cae en sitios distintos
  for (const i of orden) {
    const b = document.createElement('button'); b.type = 'button'; b.className = 'op'; b.textContent = ops[i].t;
    b.addEventListener('click', () => {
      if (caja.dataset.hecho) return; caja.dataset.hecho = '1';
      [...caja.children].forEach((x, j) => { x.disabled = true; x.classList.add(ops[orden[j]].ok ? 'bien' : (x === b ? 'mal' : 'neutra')); });
      const p = document.createElement('p'); p.className = 'por ' + (ops[i].ok ? 'ok' : 'no'); p.textContent = (ops[i].ok ? 'Bien. ' : 'No. ') + ops[i].por; caja.append(p);
      alResponder(ops[i], i);
    });
    caja.append(b);
  }
  delete caja.dataset.hecho;
}
// «Lo que te llevas»: una frase por punto, cada una con su página (E = Marino 2024, caps. 35-38) y su «Ver en la ficha».
export const LLEVAS = {
  apuesta: [['La insulina mete el potasio en la célula: el K⁺ del suero baja y el total no cambia.', 21], ['El fosfato también baja con la glucosa y la insulina; por debajo de 1 mg/dL es grave.', 49]],
  error: [['Con poca albúmina baja el calcio total y el iónico no se mueve.', 43], ['Ningún factor de corrección es fiable: se mide el calcio iónico.', 43]],
  caso: [['El citrato de la transfusión quela calcio: el total no lo nota y el iónico sí.', 44], ['Bolo de calcio recomendado de 200 mg y luego 1-2 mg/kg/h.', 45], ['Cada concentrado de 18 días trae 2-3 mEq de K⁺ y se acumula si el riñón no filtra.', 25]],
};
