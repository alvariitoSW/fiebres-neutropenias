// Juicio del profesor · b4 4D: recorre el Estudiar de las 8 fichas de los iones (guía, examen, repaso y caso) contestando
// (la primera de cada zona a propósito mal) y los 6 estados nuevos de los iones vivos; devuelve un resumen en texto y
// ≤10 capturas. Uso: node autonomo/bloques/b4/herramientas/profesor-4d.mjs <url-base> <carpeta-capturas>
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { MAYEUTICA_B4 } = await import(new URL('../../../../js/data/mayeutica/b4.js', import.meta.url));
const { ESTADOS } = await import(new URL('../../../../js/data/iones-vivos-data.js', import.meta.url));
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
const FOTOS = { 'mr-hipopotasemia': { resumen: '01-hipok-estudiar', guia: ['ion-k-g2', '02-hipok-g2-mal'], caso: '03-hipok-caso-vacio' },
  'mr-magnesio-reposicion': { pasoFoto: [4, '04-rufino-giro'], fin: '05-rufino-lleva' },
  'mr-calcio-hipoca': { pasoAntes: [2, '06-valentin-error-c2'] } };
let maxDesb = 0;
const contestar = async (Z, q, mal) => {
  // Devuelve un resumen del resultado de la pregunta q en la zona Z (mal = fallarla a propósito)
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
    const marcar = mal ? [0] : malas;
    for (const i of marcar) await pulsar(`${Z} [data-fr="${i}"]`);
    await pulsar(`${Z} [data-accion="corregir"]`);
    for (const i of malas) await pulsar(`${Z} [data-ver="${i}"]`);
  }
  await p.waitForTimeout(120);
  const r = await p.evaluate(z => { const res = document.querySelector(z + ' .may-res'); if (!res) return null; return { txt: res.textContent.replace(/\s+/g, ' ').trim().slice(0, 90), sig: !!res.querySelector('[data-accion="sig"]'), modelo: [...res.querySelectorAll('.may-modelo')].map(e => e.textContent.trim()), ver: res.querySelectorAll('.may-ir').length }; }, Z);
  const d = await desb(); maxDesb = Math.max(maxDesb, d);
  return { ...r, antesModelo, desb: d };
};
const zonaTexto = Z => p.evaluate(z => document.querySelector(z)?.textContent.replace(/\s+/g, ' ').trim() || '', Z);
const preguntaEnZona = async (Z, lista) => { const t = await zonaTexto(Z); return lista.find(q => t.includes(strip(q.enunciado).slice(0, 60))); };
const recorrer = async (ficha, Z, lista, nombre, fotoQ) => {
  const vistas = []; let n = 0, fallos = [];
  while (n < 60) {
    const q = await preguntaEnZona(Z, lista); if (!q) break;
    const mal = vistas.length === 0 || (vistas.length === 1 && lista.length > 3);
    const r = await contestar(Z, q, mal && !vistas.includes(q.id)); n++;
    if (!r) { fallos.push(`${q.id}: sin resultado`); break; }
    if (r.antesModelo) fallos.push(`${q.id}: botón del modelo antes de contestar`);
    if ((q.modelo || q.modeloVivo) && !r.modelo.length) fallos.push(`${q.id}: sin botón «Compruébalo» tras contestar`);
    if (!r.ver) fallos.push(`${q.id}: sin «Ver en la ficha»`);
    if (fotoQ && fotoQ[0] === q.id) await foto(fotoQ[1], Z + ' .may-res');
    vistas.push(q.id);
    if (!r.sig) break; await pulsar(`${Z} [data-accion="sig"]`); await p.waitForTimeout(100);
  }
  return { n, unicas: new Set(vistas).size, fallos, fin: (await zonaTexto(Z)).slice(0, 80) };
};
const out = [];
for (const [ficha, d] of Object.entries(MAYEUTICA_B4)) {
  const F = FOTOS[ficha] || {};
  try {
    await abrir(ficha); await p.waitForTimeout(400);
    await pulsar(`#${ficha} > .vista-toggle [data-vista="estudiar"]`); await p.waitForTimeout(400);
    const cab = await p.evaluate(f => { const t = document.getElementById(f); return { entrada: t.querySelector('.est-cabeza')?.textContent.replace(/\s+/g, ' ').trim().slice(0, 160), resumen: [...t.querySelectorAll('.est-ir b')].map(b => b.textContent).join('|'), prof: t.querySelector('.may-profundizar summary')?.textContent.trim() }; }, ficha);
    if (F.resumen) await foto(F.resumen, `#${ficha} .est-cabeza`);
    const PASO = paso => `#${ficha} .est-paso[data-paso="${paso}"]`;
    await pulsar(`#${ficha} .est-ir[data-ir-paso="juega"]`); await p.waitForTimeout(150);
    const juega = await p.evaluate(z => [...document.querySelectorAll(z + ' .est-juega')].map(b => b.textContent.replace(/\s+/g, ' ').trim().slice(0, 70)), PASO('juega'));
    await pulsar(`#${ficha} .est-ir[data-ir-paso="piensa"]`); await p.waitForTimeout(150);
    const ZG = PASO('piensa') + ' .may-zona', ZE = PASO('examen') + ' .may-zona', ZC = PASO('caso') + ' .may-zona';
    await pulsar(`${ZG} [data-ir="seguir"]`); await p.waitForTimeout(100);
    const guia = await recorrer(ficha, ZG, d.guia, 'guía', F.guia);
    await pulsar(`#${ficha} .est-ir[data-ir-paso="examen"]`); await p.waitForTimeout(150);
    await pulsar(`${ZE} [data-ir="seguir"]`); await p.waitForTimeout(100);
    const examen = await recorrer(ficha, ZE, [...d.examen, ...d.guia], 'examen');
    // repaso: lo fallado vuelve; contestar bien hasta vaciar
    let repaso = 0; for (let i = 0; i < 12; i++) { const q = await preguntaEnZona(ZE, [...d.examen, ...d.guia]); if (!q) break; const r = await contestar(ZE, q, false); repaso++; if (!r?.sig) break; await pulsar(`${ZE} [data-accion="sig"]`); await p.waitForTimeout(80); }
    await pulsar(`#${ficha} .est-ir[data-ir-paso="caso"]`); await p.waitForTimeout(150);
    let caso = { txt: (await zonaTexto(ZC)).slice(0, 140) };
    if (F.caso) await foto(F.caso, PASO('caso'));
    if (d.casos.length) {
      await pulsar(`${ZC} [data-caso="0"]`); await p.waitForTimeout(150);
      const C = d.casos[0]; const pasos = []; const fallos = [];
      for (let i = 0; i < C.pasos.length; i++) {
        const q = C.pasos[i].pregunta; const datos = await p.evaluate(z => [...document.querySelectorAll(z + ' .may-paciente dd')].map(e => e.textContent.trim()).join(' · ').slice(0, 120), ZC);
        if (F.pasoAntes && F.pasoAntes[0] === i + 1) await foto(F.pasoAntes[1], ZC);
        const r = await contestar(ZC, q, i === 1);
        if (!r) { fallos.push(`paso ${i + 1}: sin resultado`); break; }
        if ((q.modelo || q.modeloVivo) && !r.modelo.length) fallos.push(`${q.id}: sin «Compruébalo»`);
        if (!r.ver) fallos.push(`${q.id}: sin «Ver en la ficha»`);
        if (F.pasoFoto && F.pasoFoto[0] === i + 1) await foto(F.pasoFoto[1], ZC + ' .may-res');
        pasos.push(`${i + 1}:${q.tipo}${r.modelo.length ? '+M' : ''}`);
        if (i < C.pasos.length - 1) { await pulsar(`${ZC} [data-accion="sig"]`); await p.waitForTimeout(100); }
      }
      await pulsar(`${ZC} [data-accion="sig"]`); await p.waitForTimeout(150);
      const fin = await p.evaluate(z => { const l = document.querySelector(z + ' .may-lleva'); return { lleva: l ? l.querySelectorAll('li').length : 0, vuelta: [...document.querySelectorAll(z + ' .may-fin button, ' + z + ' [data-may-texto], ' + z + ' .may-modelo')].map(b => b.textContent.trim().slice(0, 50)).join(' | ').slice(0, 220) }; }, ZC);
      if (F.fin) await foto(F.fin, ZC + ' .may-lleva');
      caso = { titulo: C.titulo, pasos: pasos.join(' '), ...fin, fallos };
    }
    // Para profundizar
    await p.evaluate(f => { const d = document.querySelector(`#${f} .may-profundizar`); if (d) d.open = true; }, ficha); await p.waitForTimeout(150);
    const prof = await p.evaluate(f => [...document.querySelectorAll(`#${f} .may-prof-lista > *`)].length, ficha);
    out.push({ ficha, cab, juega, guia, examen, repaso, caso, prof, desb: maxDesb });
  } catch (e) { out.push({ ficha, error: e.message.slice(0, 200) }); }
}
for (const o of out) console.log(JSON.stringify(o, null, 0));
// ---- los 6 estados de los iones vivos ----
console.log('\n== Estados de los iones vivos ==');
const CAPE = { 'mg-bajo': '07-iv-mg-bajo', transfusion: '08-iv-transfusion', hipermg: '09-iv-hipermg', 'alcalosis-resp': '10-iv-alcalosis-resp' };
for (const clave of Object.keys(ESTADOS)) {
  await p.evaluate(c => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'ionesVivos', ionesVivos: c }); document.body.append(t); t.click(); t.remove(); }, clave);
  await p.waitForFunction(() => window.__iones, null, { timeout: 8000 }); await p.waitForTimeout(500);
  const r = await p.evaluate(() => { const I = window.__iones, l = I.leer(); const fr = document.querySelector('#iov-frase, .iov-frase, [id*="frase"]'); return { k: +l.k.toFixed(2), mg: +l.mg.toFixed(2), ca: +l.caIonMmol?.toFixed(2), po4: +l.po4.toFixed(2), topes: I.topes().map(t => t.clave + ':' + t.nivel).join(' '), frase: fr?.textContent.replace(/\s+/g, ' ').trim().slice(0, 160), guia: !document.getElementById('iov-guia')?.hidden, pa: document.getElementById('iov-mon-pa')?.textContent, fc: document.getElementById('iov-mon-fc')?.textContent, volver: !![...document.querySelectorAll('button')].find(b => /VOLVER/.test(b.textContent) && b.offsetParent) }; });
  console.log(clave, JSON.stringify(r), 'desb', await desb());
  if (CAPE[clave]) await foto(CAPE[clave]);
}
console.log('\nerrores de consola:', errores.length, errores.slice(0, 5));
await b.close();
