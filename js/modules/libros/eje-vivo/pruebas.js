// Eje hormonal vivo · los modos Apuesta, Error y Caso: una apuesta antes de ver la PA, «encuentra el error» (con «No hay ningún error»)
// y un caso que evoluciona con giro. Los datos, en js/data/eje-vivo-pruebas.js. El modelo se mueve solo con ir() de la página.
import { APUESTAS, ERRORES, CASOS } from '../../../data/eje-vivo-pruebas.js';
import { PRES, cita } from '../../../data/eje-vivo-data.js';
export function montarPruebas({ $, ir }) {
  const caja = $('prueba');
  const opsHtml = (ops, extra = '') => `<div class="ops">${ops.map((o, i) => `<button type="button" class="b op" data-i="${i}">${o[0]}</button>`).join('')}${extra}</div><div class="resp"></div>`;
  const otra = (que, n) => (n > 1 ? `<button type="button" class="b prim" data-otro="${que}">${que === 'apuesta' ? 'Otra apuesta' : que === 'caso' ? 'Otro caso' : 'Otra nota'}</button>` : '');
  function paso(i) {
    const C = CASOS[+caja.dataset.k], p = C.pasos[i];
    caja.dataset.paso = i; caja.dataset.fin = '';
    ir({ pac: C.pac, set: p.e, vista: p.vista, lup: C.lup, oculto: false, guia: false, frase: p.fr });
    caja.innerHTML = `<h3>Caso · ${C.titulo} · paso ${i + 1} de ${C.pasos.length}</h3><p class="enun">${p.enun}</p>${opsHtml(p.ops)}`;
  }
  function entrar(m, k = 0) {
    caja.hidden = false; caja.dataset.modo = m; caja.dataset.fin = ''; caja.dataset.found = 0; caja.innerHTML = '';
    if (m === 'apuesta') { const n = k % APUESTAS.length, A = APUESTAS[n], P = PRES[A.p]; caja.dataset.k = n;
      ir({ pac: A.p, lup: P.lup, vista: A.vista, oculto: true, guia: false, frase: [`${P.n}, ${P.e} años · ${P.caso}. Decide antes de ver la PA.`, 'caso inventado · constantes: ilustrativo'] });
      caja.innerHTML = `<h3>Apuesta</h3><p class="enun">${A.enun}</p>${opsHtml(A.ops)}`; }
    if (m === 'error') { const n = k % ERRORES.length, E = ERRORES[n], P = PRES[E.p]; caja.dataset.k = n;
      ir({ pac: E.p, lup: E.lup, vista: 'eje', oculto: false, guia: false, frase: [`Nota de ${P.n}, ${P.e} años: toca la frase con el error.`, 'caso inventado · constantes: ilustrativo'] });
      caja.innerHTML = `<h3>Encuentra el error</h3><p class="enun">${E.enun}</p>${opsHtml(E.fr, '<button type="button" class="b op neutra" data-nada="1">No hay ningún error</button>')}`; }
    if (m === 'caso') { caja.dataset.k = k % CASOS.length; paso(0); }
  }
  caja.addEventListener('click', (ev) => {
    const sig = ev.target.closest('[data-sig]'); if (sig) return paso(+sig.dataset.sig);
    const otro = ev.target.closest('[data-otro]'); if (otro) return entrar(otro.dataset.otro, +caja.dataset.k + 1);
    const b = ev.target.closest('.op'); if (!b || b.disabled) return;
    const m = caja.dataset.modo, i = +b.dataset.i, r = caja.querySelector('.resp');
    const dar = (o, ok, acum) => { b.classList.add(ok ? 'bien' : 'mal'); const h = `<p class="por ${ok ? 'ok' : 'no'}">${ok ? '✔ ' : '✖ '}${o[2]} ${cita(o[3], o[4])}</p>`; if (acum) r.insertAdjacentHTML('beforeend', h); else r.innerHTML = h; };
    const cerrar = () => { caja.querySelectorAll('.op').forEach((x) => (x.disabled = true)); caja.dataset.fin = '1'; };
    if (m === 'apuesta') { const A = APUESTAS[+caja.dataset.k], o = A.ops[i]; dar(o, o[1]); cerrar(); ir({ oculto: false, set: o[1] ? A.fin : {}, anima: o[1] }); r.insertAdjacentHTML('beforeend', otra('apuesta', APUESTAS.length)); }
    else if (m === 'error') {
      const E = ERRORES[+caja.dataset.k], n = E.fr.filter((x) => x[1]).length;
      if (b.dataset.nada) { r.insertAdjacentHTML('beforeend', `<p class="por no">✖ Hay ${n} error${n > 1 ? 'es' : ''}: relee las frases con cifras y con el orden de los fármacos.</p>`); return; }
      const o = E.fr[i]; dar(o, o[1], true); b.disabled = true; if (o[1]) caja.dataset.found = +caja.dataset.found + 1;
      if (+caja.dataset.found >= n) { cerrar(); r.insertAdjacentHTML('beforeend', otra('error', ERRORES.length)); }
    } else if (m === 'caso') {
      const C = CASOS[+caja.dataset.k], k = +caja.dataset.paso, o = C.pasos[k].ops[i]; dar(o, o[1]); cerrar(); ir({ set: o[5] || {} });
      if (k < C.pasos.length - 1) r.insertAdjacentHTML('beforeend', `<button type="button" class="b prim" data-sig="${k + 1}">Siguiente paso</button>`);
      else r.insertAdjacentHTML('beforeend', `<div class="llevas"><b>Lo que te llevas</b><ul>${C.llevas.map((x) => `<li>${x[0]} ${cita(x[1], x[2])}</li>`).join('')}</ul></div>${otra('caso', CASOS.length)}`);
    }
  });
  return { entrar, salir: () => { caja.hidden = true; caja.innerHTML = ''; caja.dataset.fin = ''; } };
}
