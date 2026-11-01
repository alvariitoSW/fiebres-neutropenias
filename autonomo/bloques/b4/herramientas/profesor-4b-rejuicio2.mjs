// Rejuicio del profesor · b4: el estado «furosemida-glucosado» del río y mar (¿enseña la orina?) y los casos nuevos de
// Rubén (mr-fra-criterios) y Álvaro (mr-fra-causas), contestando (el paso 2 a propósito mal). Resumen en texto y ≤6
// capturas. Uso: node autonomo/bloques/b4/herramientas/profesor-4b-rejuicio2.mjs <url-base> <carpeta-capturas>
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { MAYEUTICA_RINON_1 } = await import(new URL('../../../../js/data/mayeutica/b4-rinon-1.js', import.meta.url));
const [BASE = 'http://localhost:8765/', CAP = '/tmp/cap/'] = process.argv.slice(2);
const NAV = { especialidad: 'libros', view: 'marinoRenal', panel: 'panel-marino-renal-tabs' };
const strip = s => String(s || '').replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const b = await chromium.launch();
const ctx = await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, deviceScaleFactor: 2 });
const p = await ctx.newPage(); const errores = [];
p.on('console', m => m.type() === 'error' && !/favicon/.test(m.text()) && errores.push(m.text())); p.on('pageerror', e => errores.push('PAGE ' + e.message));
await p.goto(BASE + 'index.html'); await p.waitForFunction(() => document.getElementById('mar-cristaloides')?.querySelector(':scope > .vista-estudiar'), null, { timeout: 20000 });
const pulsar = async sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) return false; e.click(); return true; }, sel);
const desb = () => p.evaluate(() => document.documentElement.scrollWidth - window.innerWidth);
const foto = async (n, sel) => { if (sel) await p.evaluate(s => document.querySelector(s)?.scrollIntoView({ block: 'start' }), sel); await p.waitForTimeout(350); await p.screenshot({ path: `${CAP}${n}.png` }); };
const abrir = tab => p.evaluate(([t, nav]) => { const b = document.createElement('button'); Object.assign(b.dataset, { ...nav, tab: t }); document.body.append(b); b.click(); b.remove(); }, [tab, NAV]);
// ---- 1. río y mar: furosemida-glucosado ----
await p.evaluate(() => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'aguaViva', aguaViva: 'furosemida-glucosado' }); document.body.append(t); t.click(); t.remove(); });
await p.waitForFunction(() => window.__agvPruebas, null, { timeout: 8000 }); await p.waitForTimeout(1200);
const agv = () => p.evaluate(() => { const t = window.__agvPruebas(); const chip = document.querySelector('#agv-chips-estado [aria-pressed="true"], .agv-chip-f[aria-pressed="true"]'); const chips = [...document.querySelectorAll('.agv-chip-f[aria-pressed="true"], #agv-chips-estado [aria-pressed="true"]')].map(c => { const r = c.getBoundingClientRect(); const fila = c.parentElement.getBoundingClientRect(); return { t: c.textContent.replace(/\s+/g, ' ').trim().slice(0, 40), visible: r.left >= fila.left - 1 && r.right <= fila.right + 1 && r.width > 0 }; }); return { estado: JSON.stringify(t.estado).slice(0, 300), lectura: document.getElementById('agv-lectura')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 260), frase: document.getElementById('agv-frase')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 260), chips, sello: document.getElementById('agv-sello')?.hidden }; });
console.log('AGV inicio', JSON.stringify(await agv()), 'desb', await desb());
await foto('1-agv-furo-inicio');
await pulsar('#agv-guia-abrir'); await p.waitForTimeout(500);
for (let i = 0; i < 5; i++) {
  const g = await p.evaluate(() => { const t = window.__agvGuias?.(); return { paso: t?.guia?.paso, txt: document.querySelector('#agv-dock-guia .guia')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 150), senal: document.querySelectorAll('#agv-raiz g.guia-capa rect, #agv-raiz .guia-marco, #agv-g-anillo circle').length + (document.getElementById('agv-anillo') && !document.getElementById('agv-anillo').hidden ? 1 : 0), ver: document.querySelectorAll('#agv-dock-guia .cita-ir').length }; });
  console.log('AGV guía', JSON.stringify(g), JSON.stringify(await agv()).slice(0, 400));
  if (i === 1) await foto('2-agv-furo-guia-orina');
  if (i === 2) await foto('3-agv-furo-glucosado');
  if (!(await pulsar('#agv-dock-guia [data-guia="1"]'))) break; await p.waitForTimeout(500);
}
// ---- 2 y 3. casos de Rubén y Álvaro ----
const contestar = async (Z, q, mal) => {
  const antesModelo = await p.evaluate(z => !!document.querySelector(z + ' .may-modelo'), Z);
  if (q.tipo === 'test') {
    await pulsar(`${Z} [data-accion="ops"]`); await p.waitForTimeout(80);
    const ops = await p.evaluate(z => [...document.querySelectorAll(z + ' [data-op]')].map(e => ({ k: e.dataset.op, t: e.textContent.trim() })), Z);
    const buena = strip(q.opciones.find(o => o.ok).t);
    const elegir = ops.find(o => mal ? !o.t.includes(buena.slice(0, 40)) : o.t.includes(buena.slice(0, 40))) || ops[0];
    await pulsar(`${Z} [data-op="${elegir.k}"]`);
  } else if (q.tipo === 'destapa') {
    if (await p.evaluate(z => !!document.querySelector(z + ' [data-accion="destapa"]'), Z)) await pulsar(`${Z} [data-accion="destapa"]`);
    await p.evaluate(([z, m]) => document.querySelectorAll(z + ' .may-pts input').forEach((c, i) => { c.checked = !m || i === 0; }), [Z, mal]);
    await pulsar(`${Z} [data-accion="puntos"]`);
  } else if (q.tipo === 'error') {
    const malas = q.frases.map((f, j) => f.mal ? j : -1).filter(j => j >= 0);
    for (const i of (mal ? [0] : malas)) await pulsar(`${Z} [data-fr="${i}"]`);
    await pulsar(`${Z} [data-accion="corregir"]`);
    for (const i of malas) await pulsar(`${Z} [data-ver="${i}"]`);
  }
  await p.waitForTimeout(120);
  const r = await p.evaluate(z => { const res = document.querySelector(z + ' .may-res'); if (!res) return null; return { txt: res.textContent.replace(/\s+/g, ' ').trim().slice(0, 110), sig: !!res.querySelector('[data-accion="sig"]'), modelo: [...res.querySelectorAll('.may-modelo')].map(e => e.textContent.trim()), ver: res.querySelectorAll('.may-ir').length }; }, Z);
  return { ...r, antesModelo, desb: await desb() };
};
const FOTOS = { 'mr-fra-criterios': { paso: 5, foto: '4-ruben-error', fin: '5-ruben-lleva' }, 'mr-fra-causas': { paso: 4, foto: '6-alvaro-gradiente' } };
for (const ficha of ['mr-fra-criterios', 'mr-fra-causas']) {
  const d = MAYEUTICA_RINON_1[ficha], F = FOTOS[ficha];
  await abrir(ficha); await p.waitForTimeout(400);
  await pulsar(`#${ficha} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(400);
  const PASO = paso => `#${ficha} .est-paso[data-paso="${paso}"]`; const ZC = PASO('caso') + ' .may-zona';
  await pulsar(`#${ficha} .est-ir[data-ir-paso="caso"]`); await p.waitForTimeout(200);
  const intro = await p.evaluate(z => document.querySelector(z)?.textContent.replace(/\s+/g, ' ').trim().slice(0, 160), ZC);
  await pulsar(`${ZC} [data-caso="0"]`); await p.waitForTimeout(200);
  const C = d.casos[0]; const pasos = [], fallos = [];
  for (let i = 0; i < C.pasos.length; i++) {
    const q = C.pasos[i].pregunta;
    const antes = await p.evaluate(z => { const z0 = document.querySelector(z); return { paciente: [...z0.querySelectorAll('.may-paciente dt, .may-paciente dd')].map(e => e.textContent.trim()).join('|').slice(0, 220), rojo: z0.querySelectorAll('.may-paciente .nuevo, .may-paciente .may-nuevo, .may-paciente [class*="nuevo"]').length, calc: [...z0.querySelectorAll('.may-calc, [data-calc], .may-calculadora, button')].filter(b => /calcul|abre|Tabla 34|EFNa|PPA|Fórmulas/i.test(b.textContent)).map(b => b.textContent.trim().slice(0, 60)), momento: z0.querySelector('.may-momento, .may-dia, h4')?.textContent.trim().slice(0, 60) }; }, ZC);
    const r = await contestar(ZC, q, i === 1);
    if (!r) { fallos.push(`paso ${i + 1}: sin resultado`); break; }
    if (r.antesModelo) fallos.push(`${q.id}: botón del modelo antes de contestar`);
    if (q.modelo && !r.modelo.length) fallos.push(`${q.id}: sin «Compruébalo»`);
    if (!r.ver) fallos.push(`${q.id}: sin «Ver en la ficha»`);
    if (C.pasos[i].calculadora && !antes.calc.length) fallos.push(`${q.id}: sin botón de calculadora`);
    if (F.paso === i + 1) await foto(F.foto, ZC);
    pasos.push({ n: i + 1, tipo: q.tipo, momento: antes.momento, nuevoRojo: antes.rojo, calc: antes.calc, modelo: r.modelo, ver: r.ver, res: r.txt.slice(0, 70), desb: r.desb });
    if (i < C.pasos.length - 1) { await pulsar(`${ZC} [data-accion="sig"]`); await p.waitForTimeout(120); }
  }
  await pulsar(`${ZC} [data-accion="sig"]`); await p.waitForTimeout(200);
  const fin = await p.evaluate(z => { const l = document.querySelector(z + ' .may-lleva'); return { lleva: l ? [...l.querySelectorAll('li')].map(x => x.textContent.trim().slice(0, 60)) : [], vuelta: [...document.querySelectorAll(z + ' .may-fin button, ' + z + ' [data-may-texto], ' + z + ' .may-modelo')].map(b => b.textContent.trim().slice(0, 50)).join(' | ').slice(0, 240) }; }, ZC);
  if (F.fin) await foto(F.fin, ZC + ' .may-lleva');
  console.log('\nCASO', ficha, C.titulo, '| intro:', intro); for (const x of pasos) console.log('  ', JSON.stringify(x)); console.log('  fin', JSON.stringify(fin)); console.log('  fallos', fallos);
}
console.log('\nerrores consola', errores.length ? errores.slice(0, 4) : 0);
await b.close();
