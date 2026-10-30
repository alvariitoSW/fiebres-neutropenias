// La Mayéutica de la maqueta: una apuesta (primero predices, luego el modelo comprueba), un «encuentra el error» sobre la
// escena y un caso de 4 pasos con Damián. Las respuestas no están escritas en el HTML: salen de datos.js al pulsar.
import { APUESTA, ERROR, CASO, cita } from './datos.js';
const ESC = s => String(s).replace(/[&<>]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;' }[c]));
const ROT = [0, 1, 3, 3, 0];   // posición de la correcta: 1, 2, 3, 0, 1 (ninguna en más de la mitad)
export function montarMayeutica(h) {
  const { M } = h, cont = document.getElementById('vista-preg'), dock = document.getElementById('dock-estudio');
  let fase = 0, paso = 0, aciertos = 0, total = 0;
  dock.innerHTML = '<div id="m-txt" style="font:.76rem/1.35 var(--sans)"></div><div class="fila"><button type="button" class="btn" id="m-expl" disabled>Ver la explicación</button><button type="button" class="btn" id="m-sig" disabled>Siguiente ›</button></div>';
  const mSig = dock.querySelector('#m-sig'), mExpl = dock.querySelector('#m-expl');
  mExpl.onclick = () => cont.querySelector('#res')?.scrollIntoView({ block: 'center', behavior: 'smooth' });
  const habilitar = on => { mSig.disabled = !on; mExpl.disabled = !on; };
  const marca = txt => { dock.querySelector('#m-txt').innerHTML = `<b>Mayéutica · ${txt}</b> · aciertos ${aciertos} de ${total}`; };
  const citas = l => (l || []).map(c => cita(c)).join(' · ');
  function pregunta(q, rot, alResponder) {
    const ops = q.ops.map((o, i) => ({ ...o, i })), n = ops.length, vis = ops.map((o, i) => ops[(i - rot + n) % n]);
    cont.innerHTML = `<div class="bloque"><b>${ESC(q.tit || 'Apuesta')}</b><p>${ESC(q.enun)}</p><div id="ops">${vis.map((o, i) => `<button type="button" class="opcion" data-i="${i}">${ESC(o.t)}</button>`).join('')}</div><div id="res"></div></div>`;
    cont.querySelectorAll('.opcion').forEach(b => b.addEventListener('click', () => {
      if (cont.dataset.cerrado === q.enun) return; cont.dataset.cerrado = q.enun;
      const o = vis[+b.dataset.i]; total++; if (o.ok) aciertos++;
      cont.querySelectorAll('.opcion').forEach((x, i) => { x.disabled = true; x.classList.toggle('ok', !!vis[i].ok); if (x === b && !o.ok) x.classList.add('mal'); if (x === b) x.classList.add('marcada'); });
      const r = alResponder(o);
      cont.querySelector('#res').innerHTML = `<p class="expl">${o.ok ? '<b>Correcto.</b> ' : `<b>Si eliges esta:</b> ${ESC(o.porque)}<br>`}${ESC(q.expl)} ${citas(q.c)}</p>${r ? `<p class="expl" id="resultado">${ESC(r)}</p>` : ''}`;
      mSig.textContent = fase === 2 && paso === CASO.pasos.length - 1 ? 'Terminar' : 'Siguiente ›'; mSig.onclick = siguiente; habilitar(true); marca(texto()); document.getElementById('tarjeta').scrollIntoView({ block: 'start', behavior: 'smooth' });
    }));
  }
  const texto = () => fase === 0 ? 'apuesta' : fase === 1 ? 'encuentra el error' : `caso de Damián, paso ${paso + 1} de ${CASO.pasos.length}`;
  function empezar() { habilitar(false); fase = 0; paso = 0; aciertos = 0; total = 0; delete cont.dataset.cerrado; apuesta(); }
  function siguiente() { habilitar(false); scrollTo({ top: 0 }); delete cont.dataset.cerrado; if (fase === 0) { fase = 1; error(); } else if (fase === 1) { fase = 2; paso = 0; caso(); } else if (paso < CASO.pasos.length - 1) { paso++; caso(); } else fin(); }
  function resumen(antes, s) { const a = antes, b = h.lee(s), p = []; for (const [c, n, d] of [['k', 'K⁺', 1], ['mg', 'Mg²⁺', 1], ['ca', 'Ca ión', 2], ['p', 'fosfato', 1]]) if (Math.abs(a[c] - b[c]) >= 0.5 * 10 ** -d) p.push(`${n} ${a[c].toFixed(d).replace('.', ',')} → ${b[c].toFixed(d).replace('.', ',')}`); return p.join(' · '); }
  function apuesta() {
    h.set(M.PACIENTES.damian.s(), 'Damián', true); h.decir('Apuesta', ''); h.destapar = h.destapar; document.getElementById('frase').textContent = 'Predice antes de mirar: las cifras están tapadas.'; marca(texto());
    pregunta(APUESTA, ROT[0], () => {
      const s = h.getS(), a = h.lee(s); M.realimentar(s); h.destapar(); const r = h.lee(s);
      document.getElementById('frase').textContent = `Realimentar a Damián: K⁺ ${a.k.toFixed(1).replace('.', ',')} → ${r.k.toFixed(1).replace('.', ',')} mEq/L; el punto cae de la curva (Fig. 36.2) sin que cambie el total.`;
      return `El modelo: ${resumen(a, s)}.`;
    });
  }
  function error() {
    const s = M.PACIENTES.damian.s(); s.alb = 1.5; h.set(s, 'Damián', false); document.getElementById('frase').textContent = 'Mira la Fig. 38.1 y la Fig. 36.2 y marca las frases con error.'; marca(texto());
    cont.innerHTML = `<div class="bloque"><b>Encuentra el error</b><p>${ESC(ERROR.enun)}</p><div id="ops">${ERROR.fr.map((f, i) => `<button type="button" class="opcion" data-i="${i}" aria-pressed="false">${ESC(f.t)}</button>`).join('')}</div><button type="button" class="btn" id="comprobar">Comprobar</button><div id="res"></div></div>`;
    cont.querySelectorAll('.opcion').forEach(b => b.addEventListener('click', () => { if (b.disabled) return; const on = b.getAttribute('aria-pressed') !== 'true'; b.setAttribute('aria-pressed', String(on)); b.classList.toggle('marcada', on); }));
    cont.querySelector('#comprobar').onclick = () => {
      let bien = 0; const li = [];
      cont.querySelectorAll('.opcion').forEach((b, i) => { b.disabled = true; const f = ERROR.fr[i], m = b.getAttribute('aria-pressed') === 'true'; const ok = m === f.err; if (ok) bien++; b.classList.add(ok ? 'ok' : 'mal'); li.push(`<li>${ok ? '✔' : '✘'} ${f.err ? '<b>Tiene error.</b>' : '<b>Es correcta.</b>'} ${ESC(f.porque)} ${cita(f.c)}</li>`); });
      total++; if (bien === ERROR.fr.length) aciertos++;
      cont.querySelector('#comprobar').hidden = true;
      cont.querySelector('#res').innerHTML = `<ul class="lista expl">${li.join('')}</ul>`; mSig.textContent = 'Siguiente ›'; mSig.onclick = siguiente; habilitar(true); marca(texto()); document.getElementById('tarjeta').scrollIntoView({ block: 'start', behavior: 'smooth' });
    };
  }
  function caso() {
    const q = CASO.pasos[paso]; let s = h.getS();
    if (paso === 0) { s = M.PACIENTES.damian.s(); s.p0 = 0.9; h.set(s, 'Damián', false); }
    if (paso === 1) { s.p0 = 0.7; h.set(s, 'Damián', false); }
    if (paso === 2) { s.mgPico = 0.45; h.set(s, 'Damián', false); }
    document.getElementById('frase').textContent = `Día ${[3, 4, 4, 6][paso]}: Damián, 52 años. Mira las cifras y decide.`; marca(texto());
    pregunta(q, ROT[paso + 1], () => {
      const s = h.getS(), a = h.lee(s); let extra = '';
      if (q.aplica === 'repone') { M.setClk(s, 20, 'periferica'); M.mgso4(s, 6); M.pasar(s, 3); M.setClk(s, 0, 'periferica'); }
      else if (q.aplica === 'fosfato') { M.fosfatoK(s, 40); M.pasar(s, 1); }
      else if (q.aplica === 'espera') { M.pasar(s, 2); extra = ' Dos horas después, el pico de la perfusión se ha ido.'; }
      else extra = ' En este paso el modelo no cambia nada: la prueba se lee en la orina de 24 h.';
      h.set(s, 'Damián', false); const r = resumen(a, s);
      document.getElementById('frase').textContent = `Con la conducta correcta: ${r || 'las cifras no cambian'}.${extra}`;
      return `El modelo (conducta correcta): ${r || 'sin cambios'}.${extra}`;
    });
  }
  function fin() { cont.innerHTML = `<div class="bloque"><b>Lo que te llevas</b><ul><li>El K⁺ del suero no es el potasio del cuerpo: la insulina lo mueve a la célula sin gastarlo.</li><li>Con el Mg²⁺ bajo, el K⁺ no sube: se repone el magnesio.</li><li>El fosfato por debajo de 1 mg/dL es grave y la glucosa lo baja.</li><li>El Mg²⁺ sérico se normaliza antes que los depósitos.</li></ul><button type="button" class="btn" id="otra">Repetir</button></div>`; cont.querySelector('#otra').onclick = empezar; habilitar(false); marca('final'); }
  return { empezar };
}
