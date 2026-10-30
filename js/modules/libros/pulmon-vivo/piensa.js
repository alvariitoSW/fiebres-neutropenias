// «Piensa antes» (REGLAS §8): antes de la explicación guiada de un estado, el residente apuesta. Primero el enunciado, luego las
// tres opciones; al contestar salen su explicación, lo que le pasaría al paciente con la opción que eligió y la fuente.
// montarPiensa(host, E, { org, cita, alSeguir, alCerrar, medir }) pinta en host (el dock de la guía) y llama a alSeguir() al terminar.
export function montarPiensa(host, E, { org, cita, alSeguir, alCerrar, medir }) {
  const Q = E.piensa;
  host.innerHTML = `<div class="guia"><div class="guia-cab"><span class="guia-n">Piensa antes</span><span class="guia-tit">${E.tit}</span><button type="button" class="guia-x" id="pul-pq-x" aria-label="Cerrar">×</button></div>
    <p class="guia-txt">${Q.q}</p>
    <div class="pq-ops" id="pul-pq-ops" hidden></div>
    <div class="pq-exp" id="pul-pq-exp" hidden></div>
    <div class="guia-nav pq-nav"><button type="button" class="guia-b prim" id="pul-pq-ver">Ya lo tengo: ver opciones</button><button type="button" class="guia-b prim" id="pul-pq-seguir" hidden>Seguir con la guía</button></div></div>`;
  const $ = (id) => host.querySelector('#pul-pq-' + id), ops = $('ops'), exp = $('exp');
  $('x').onclick = alCerrar;
  $('ver').onclick = () => {
    ops.hidden = false; $('ver').hidden = true;
    ops.innerHTML = Q.ops.map((o, i) => `<button type="button" class="pq-op" data-i="${i}">${o.t}</button>`).join('');
    medir();
  };
  ops.onclick = (ev) => {
    const b = ev.target.closest('.pq-op'); if (!b || ops.dataset.hecho) return; ops.dataset.hecho = '1';
    const o = Q.ops[+b.dataset.i];
    [...ops.children].forEach((x, i) => { if (Q.ops[i].ok) x.classList.add('bien'); else if (x === b) x.classList.add('mal'); x.setAttribute('aria-disabled', 'true'); });
    exp.hidden = false;
    exp.innerHTML = `<p><b>${o.ok ? 'Correcto.' : 'No.'}</b> ${o.e}</p>${o.ok ? '' : `<p><b>Lo correcto:</b> ${Q.ops.find((x) => x.ok).e}</p>`}<p>${Q.exp} ${org('ilustrativo (presiones) · ficha (mecanismo)')}</p>${cita(o.c)}`;
    $('seguir').hidden = false; medir();
  };
  $('seguir').onclick = alSeguir;
  medir();
}
