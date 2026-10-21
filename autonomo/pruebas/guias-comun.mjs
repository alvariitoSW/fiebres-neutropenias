// La explicación guiada en las pruebas de los modelos vivos del bloque 1 (río y mar, catéter, muralla, telar e
// inmersión): la misma comprobación para todos, copiada de la del vaso (vaso-vivo.mjs, apartado 8). No es una prueba
// de jueces por sí sola: la llama la prueba de cada modelo, al final de cada pasada.
// Recorre enteras las explicaciones de `recorrer` (cada paso señala en el dibujo, lleva su «Ver en la ficha» a un
// párrafo que existe y su PDF, sin nombres internos ni desborde; el último lista las fuentes del estado; «Terminar»
// devuelve los mandos), comprueba la forma de todas (3-5 pasos, cada paso con su cita) y que cada cita de todas las
// explicaciones va a un párrafo que existe, y que «Ver en la ficha» abre la ficha en su párrafo.
export async function probarGuias({ p, ok, pre, view, attr, GUIAS, recorrer, foto, desborde, REDUCIDO }) {
  const espera = ms => p.waitForTimeout(REDUCIDO ? Math.min(ms, 250) : ms);
  const abrir = k => p.evaluate(([view, attr, k]) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view, [attr]: k }); document.body.append(t); t.click(); t.remove(); }, [view, attr, k]);
  const G = () => p.evaluate(pre => window[`__${pre}Guias`](), pre);
  // La forma de todas: 3-5 pasos y cada paso con su cita (ficha, página y PDF)
  const malos = Object.entries(GUIAS).filter(([, ps]) => ps.length < 3 || ps.length > 5 || ps.some(pa => ![].concat(pa.cita || []).length || [].concat(pa.cita).some(c => !c.ficha || !c.id || !c.pag || !c.pdf)));
  ok(!malos.length, `las ${Object.keys(GUIAS).length} explicaciones tienen 3-5 pasos y cada paso su cita ${malos.map(m => m[0]).join(', ')}`);
  for (const k of recorrer) {
    await abrir(k); await espera(600);
    await p.evaluate(pre => document.getElementById(pre + '-guia-abrir').click(), pre); await espera(450);
    const g = (await G()).guia;
    ok(g && g.clave === k && g.n === GUIAS[k].length, `«Explícame» abre la explicación de «${k}» (${g && g.n} pasos)`);
    ok(await p.evaluate(pre => document.getElementById(pre + '-dock-explorar').hidden && !document.getElementById(pre + '-dock-guia').hidden, pre), `${k}: la explicación ocupa el sitio de los mandos`);
    for (let i = 0; i < GUIAS[k].length; i++) {
      await espera(600);
      const paso = GUIAS[k][i];
      const v = await p.evaluate(pre => ({ n: window[`__${pre}Guias`]().guia?.paso,
        senal: document.querySelectorAll(`#${pre}-raiz g.guia-capa rect, #${pre}-raiz .guia-marco, #${pre}-g-anillo circle, #${pre}-raiz .${pre}-mira`).length
          + (document.getElementById(pre + '-anillo') && !document.getElementById(pre + '-anillo').hidden ? 1 : 0),
        citas: [...document.querySelectorAll(`#${pre}-dock-guia .guia-citas .cita-ir`)].map(c => ({ tabOk: !!document.getElementById(c.dataset.tab), res: c.dataset.resaltar || null, resOk: !!c.dataset.resaltar && !!document.querySelector(c.dataset.resaltar) })),
        pdf: [...document.querySelectorAll(`#${pre}-dock-guia .guia-citas .cita-pdf`)].map(a => a.getAttribute('href')),
        txt: document.querySelector(`#${pre}-dock-guia .guia`)?.textContent || '' }), pre);
      const quiere = paso.resalta || paso.mirar;
      ok(v.n === i && (!quiere || v.senal > 0) && v.citas.length === [].concat(paso.cita).length && v.citas.every(c => c.tabOk && c.resOk) && v.pdf.length === v.citas.length,
        `${k}, paso ${i + 1}: señala en el dibujo (${v.senal}), ${v.citas.length} «Ver en la ficha» al párrafo y su PDF (${v.pdf.join(' ')})`);
      if (/\b(mar|mr|mc|mh)-[a-z0-9-]+|maqueta|§|REGLAS/.test(v.txt)) ok(false, `${k}, paso ${i + 1}: nombre interno a la vista`);
      if (await desborde() > 0) ok(false, `desborde en ${k}, paso ${i + 1}`);
      if (i === 1 && foto) await foto(`guia-${k}`);
      if (i < GUIAS[k].length - 1) await p.evaluate(pre => document.querySelector(`#${pre}-dock-guia [data-guia="1"]`).click(), pre);
    }
    ok(await p.evaluate(pre => !!document.querySelector(`#${pre}-dock-guia .guia-fuentes .cita-ir`), pre), `${k}: el último paso lista las fuentes del estado`);
    await p.evaluate(pre => document.querySelector(`#${pre}-dock-guia [data-guia="salir"]`).click(), pre); await espera(250);
    ok(await p.evaluate(pre => !window[`__${pre}Guias`]().guia && !document.getElementById(pre + '-dock-explorar').hidden && !document.querySelectorAll(`#${pre}-raiz g.guia-capa`).length, pre),
      `${k}: «Terminar» devuelve los mandos y quita los anillos`);
  }
  // Cada cita de todas las explicaciones va a un párrafo que existe, con su PDF
  const citas = (await G()).citas;
  const sinParrafo = citas.filter(c => !c.exacta || !c.ficha_existe || !c.pdf);
  ok(citas.length > 0 && !sinParrafo.length, `las ${citas.length} citas de las explicaciones van a un párrafo que existe, con su PDF ${sinParrafo.slice(0, 4).map(c => c.estado + '·' + c.id).join(' ')}`);
  // «Ver en la ficha» desde la explicación abre la ficha en su párrafo; y el modelo vuelve a abrir
  await abrir(recorrer[0]); await espera(500);
  await p.evaluate(pre => document.getElementById(pre + '-guia-abrir').click(), pre); await espera(400);
  const destino = await p.evaluate(pre => { const bt = document.querySelector(`#${pre}-dock-guia .cita-ir`); bt.click(); return { tab: bt.dataset.tab, res: bt.dataset.resaltar }; }, pre);
  await p.waitForTimeout(900);
  ok(await p.evaluate(d => { const e = document.getElementById(d.tab); return e.classList.contains('active') && !!e.offsetParent && !!document.querySelector(d.res); }, destino), `«Ver en la ficha» abre la ficha «${destino.tab}» en ${destino.res}`);
  await abrir(recorrer[0]); await espera(400);
}
