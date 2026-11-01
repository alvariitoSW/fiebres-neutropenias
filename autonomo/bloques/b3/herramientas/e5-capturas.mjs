// Capturas de Estudiar (fichas 10 y 11) a 390 px: primera pantalla, una pregunta contestada y el final del caso. Uso: node e5-capturas.mjs http://localhost:PUERTO/ /carpeta/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), OUT = process.argv[3].replace(/\/?$/, '/');
const { MAYEUTICA_VNI: V } = await import(new URL('../../../../js/data/mayeutica/b3d-vni.js', import.meta.url));
const { barajar } = await import(new URL('../../../../js/core/mayeutica-motor.js', import.meta.url));
const b = await chromium.launch(); const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })).newPage();
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const NAV = { especialidad: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs' };
const abrir = tab => p.evaluate(([t, nav]) => { const x = document.createElement('button'); Object.assign(x.dataset, { ...nav, tab: t }); document.body.append(x); x.click(); x.remove(); }, [tab, NAV]);
const pulsar = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.scrollIntoView({ block: 'center' }); e.click(); }, sel);
for (const f of ['neumo-vni-metodos', 'neumo-vni-uso']) {
  const d = V[f]; await abrir(f); await p.waitForTimeout(600);
  await pulsar(`#${f} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(600);
  await p.evaluate(() => window.scrollTo(0, 0)); await p.evaluate(f => document.getElementById(f).scrollIntoView(), f); await p.waitForTimeout(300);
  await p.screenshot({ path: `${OUT}${f}-1-primera.png` });
  await pulsar(`#${f} .est-ir[data-ir-paso="piensa"]`); await p.waitForTimeout(300);
  const Z = `#${f} .est-paso[data-paso="piensa"] .may-zona`;
  if (await p.evaluate(z => !!document.querySelector(z + ' [data-ir="seguir"]'), Z)) await pulsar(`${Z} [data-ir="seguir"]`);
  const q = d.guia.find(x => x.tipo === 'test');
  await pulsar(`${Z} [data-accion="ops"]`); await pulsar(`${Z} [data-op="${barajar(q.opciones, q.id).findIndex(o => !o.ok)}"]`); await p.waitForTimeout(300);
  await p.screenshot({ path: `${OUT}${f}-2-pregunta-fallada.png` });
  await pulsar(`#${f} .est-ir[data-ir-paso="caso"]`); await p.waitForTimeout(300);
  const ZC = `#${f} .est-paso[data-paso="caso"] .may-zona`;
  await pulsar(`${ZC} [data-caso="0"]`); await p.waitForTimeout(300);
  const caso = d.casos[0];
  for (const [j, paso] of caso.pasos.entries()) {
    const q = paso.pregunta;
    if (q.tipo === 'test') { await pulsar(`${ZC} [data-accion="ops"]`); await pulsar(`${ZC} [data-op="${barajar(q.opciones, q.id).findIndex(o => o.ok)}"]`); }
    else if (q.tipo === 'destapa') { await pulsar(`${ZC} [data-accion="destapa"]`); await p.evaluate(z => document.querySelectorAll(z + ' .may-pts input').forEach(c => { c.checked = true; }), ZC); await pulsar(`${ZC} [data-accion="puntos"]`); }
    else { for (const [i, fr] of q.frases.entries()) if (fr.mal) await pulsar(`${ZC} [data-fr="${i}"]`); await pulsar(`${ZC} [data-accion="corregir"]`); }
    await p.waitForTimeout(250);
    if (j === 2) await p.screenshot({ path: `${OUT}${f}-3-caso-paso3.png` });
    await pulsar(`${ZC} [data-accion="sig"]`); await p.waitForTimeout(200);
  }
  await p.screenshot({ path: `${OUT}${f}-4-caso-final.png` });
}
await b.close();
