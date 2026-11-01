// Rejuicio final b3-pulmon-estudio (profesor): lo que los programas G2-G5 no miran.
// (1) Mira de la ficha 10 (neumo-vni-metodos): el botón a `psv-disparo` y adónde lleva.
// (2) Neumotórax a tensión: 5 pulsaciones de «deja pasar respiraciones» → aire pleural, PAM, sellos y frase viva.
// (3) Tras visitar sbt-fracaso, abrir fuga-cuff: ¿queda la línea «FR/Vt …»?
// Uso: node rejuicio-final-capturas.mjs http://localhost:PUERTO/ /carpeta/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/'), OUT = process.argv[3].replace(/\/?$/, '/');
const NAV = { especialidad: 'neumologia', view: 'merinoNeumologia', panel: 'panel-merino-neumo-tabs' };
const br = await chromium.launch(); const p = await br.newPage({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 } });
const errores = []; p.on('pageerror', e => errores.push(e.message)); p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const abrir = tab => p.evaluate(([t, nav]) => { const x = document.createElement('button'); Object.assign(x.dataset, { ...nav, tab: t }); document.body.append(x); x.click(); x.remove(); }, [tab, NAV]);
const abrirModelo = k => p.evaluate(k => { const x = document.createElement('button'); Object.assign(x.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: k }); document.body.append(x); x.click(); x.remove(); }, k);
const pulsar = sel => p.evaluate(s => { const e = document.querySelector(s); if (!e) throw new Error('no hay ' + s); e.scrollIntoView({ block: 'center' }); e.click(); }, sel);
const foto = async (n, sel) => { const el = sel ? await p.$(sel) : null; if (el) { await el.scrollIntoViewIfNeeded(); await p.waitForTimeout(250); } await p.screenshot({ path: `${OUT}${n}.png` }); };
const leer = () => p.evaluate(() => { window.__pulPruebas?.().llenar?.(); const f = {}; for (const e of document.querySelectorAll('.pul-raiz [data-fila], #pul-neumo [data-fila]')) f[e.dataset.fila] = (e.querySelector('.v, .g')?.textContent.trim() || e.textContent.trim().slice(0, 16)); const sellos = [...document.querySelectorAll('.pul-raiz .tope-sello:not([hidden]), .pul-sello, [class*="sello"]:not([hidden])')].filter(e => e.offsetParent).map(e => e.textContent.trim().slice(0, 90)); const frase = document.querySelector('#pul-frase, .pul-frase, [data-pul="frase"]')?.textContent.trim().slice(0, 160); const info = document.querySelector('.pul-raiz .pul-info, [data-pul="info"]')?.textContent.trim().slice(0, 120); const nx = document.querySelector('#pul-neumo [data-nx="msg"]')?.textContent.trim().slice(0, 120); return { f, sellos, frase, info, nx, desb: document.documentElement.scrollWidth - innerWidth }; });

// (1) Ficha 10: Mira con el botón a psv-disparo
await abrir('neumo-vni-metodos'); await p.waitForTimeout(600);
await pulsar('#neumo-vni-metodos > .vista-toggle [data-vista="estudiar"]'); await p.waitForTimeout(700);
const b = await p.evaluate(() => { const s = document.querySelector('#neumo-vni-metodos .est-paso[data-paso="mira"]'); const b = s?.querySelector('[data-pulmon-vivo="psv-disparo"]'); if (!b) return null; const pan = b.closest('.vk-panel')?.querySelector('.vk-panel-titulo')?.textContent.trim(); return { texto: b.textContent.trim(), panel: pan, visible: !!b.offsetParent }; });
console.log('Mira 10 · botón PSV:', JSON.stringify(b));
await foto('mira-10-psv', '#neumo-vni-metodos .est-paso[data-paso="mira"] [data-pulmon-vivo="psv-disparo"]');
if (b) { await pulsar('#neumo-vni-metodos .est-paso[data-paso="mira"] [data-pulmon-vivo="psv-disparo"]'); await p.waitForTimeout(1200); const m = await leer(); console.log('  abre:', await p.evaluate(() => document.querySelector('#pul-leyenda [aria-pressed="true"]')?.textContent.trim()), '· frase:', m.frase, '· sellos:', m.sellos.join('|') || '—'); await foto('modelo-10-psv', '.pul-raiz svg'); }

// (2) Neumotórax: 5 pulsaciones
await abrirModelo('neumotorax-tension'); await p.waitForTimeout(1200);
for (let i = 1; i <= +(process.env.PASAR || 6); i++) {
  const ok = await p.evaluate(() => { const b = document.querySelector('#pul-neumo [data-nx="pasar"]'); if (!b || b.disabled) return false; b.click(); return true; }); await p.waitForTimeout(700);
  const m = await leer();
  console.log(`pasar ×${i} (${ok}): aire ${m.f['neumo-p']} · pico ${m.f.pico} · meseta ${m.f.meseta} · SpO₂ ${m.f['neumo-spo2']} · PAM ${m.f['cor-pam']} · GC ${m.f['cor-gc']} · sellos: ${m.sellos.join(' | ') || '—'} · frase: ${m.frase?.slice(0, 110)} · nx: ${m.nx || '—'} · desb ${m.desb}`);
  if (i === 5) await foto('neumotorax-5-respiraciones', '.pul-raiz svg');
}
// (3) fuga-cuff tras sbt-fracaso: ¿queda «FR/Vt»?
await abrirModelo('sbt-fracaso'); await p.waitForTimeout(1000); let m = await leer(); console.log('sbt-fracaso · info:', m.info, '· FR/Vt en texto:', /FR\/Vt/.test(await p.evaluate(() => document.querySelector('.pul-raiz')?.innerText || '')));
await abrirModelo('fuga-cuff'); await p.waitForTimeout(1000); m = await leer(); console.log('fuga-cuff tras sbt-fracaso · info:', m.info || '—', '· FR/Vt en texto:', /FR\/Vt/.test(await p.evaluate(() => document.querySelector('.pul-raiz')?.innerText || '')), '· PAM visible:', await p.evaluate(() => { const e = document.querySelector('[data-fila="cor-pam"]'); return e ? !!e.offsetParent : null; }), '· neumo-p visible:', await p.evaluate(() => { const e = document.querySelector('[data-fila="neumo-p"]'); return e ? !!e.offsetParent : null; }));
console.log('errores de consola:', errores.length ? errores : 'ninguno');
await br.close();
