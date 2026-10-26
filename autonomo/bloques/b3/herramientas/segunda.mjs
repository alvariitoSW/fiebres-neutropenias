// Segunda vuelta: receptor (claves reales de los deslizadores + Mayéutica entera), pulmón (mandos con espera larga, escena sola, alarma), 360 px en las cuatro.
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = 'http://127.0.0.1:8795/autonomo/maquetas/', CAP = '/tmp/plan-socialista/b3/capturas-v3/';
const fallos = [], errores = []; const ok = (c, m) => { if (!c) fallos.push(m); };
const browser = await chromium.launch();
const nuevo = async (w, h) => { const ctx = await browser.newContext({ ...devices['iPhone 12'], viewport: { width: w, height: h }, deviceScaleFactor: 2, hasTouch: true, isMobile: true }); const page = await ctx.newPage(); page.on('console', (m) => { if (m.type() === 'error') errores.push(m.text()); }); page.on('pageerror', (e) => errores.push('pageerror: ' + e.message)); return page; };
const desb = async (page, t) => { const d = await page.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `desborde ${d} px en ${t}`); };
// ---- receptor
let page = await nuevo(390, 844);
await page.goto(BASE + 'b3-receptor.html', { waitUntil: 'networkidle' }); await page.waitForTimeout(1200);
const R = () => page.evaluate(() => { const r = window.__receptor.R; return { pam: Math.round(r.pam), fc: Math.round(r.fc), ic: +r.ic.toFixed(1), irvs: +r.irvs.toFixed(1), lact: +(r.lact ?? 0).toFixed(1), pas: Math.round(r.pas), pad: Math.round(r.pad), frase: document.querySelector('.frase-txt, #frase-txt')?.textContent?.replace(/\s+/g, ' ').slice(0, 200) }; });
const dosis = async (k, v, espera = 4000) => { const r = await page.evaluate(([k, v]) => { const i = document.querySelector(`input[data-dosis="${k}"]`); if (!i) return 'NO SLIDER ' + k + ' (hay: ' + [...document.querySelectorAll('input[data-dosis]')].map((x) => x.dataset.dosis + ' ' + x.min + '-' + x.max + ' paso ' + x.step).join(', ') + ')'; i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); return 'ok'; }, [k, v]); if (r !== 'ok') console.log(r); await page.waitForTimeout(espera); };
await page.evaluate(() => window.__receptor.ponerEstado('dopamina')); await page.waitForTimeout(500);
for (const v of [2, 5, 10, 15, 20]) { await dosis('dopamina', v); const r = await R(); console.log(`dopamina ${v}: PAM ${r.pam} FC ${r.fc} IC ${r.ic} IRVS ${r.irvs} · ${r.frase.slice(0, 120)}`); }
await page.evaluate(() => window.__receptor.ponerEstado('dobutamina')); await page.waitForTimeout(4000); let r0 = await R(); console.log('dobutamina base', JSON.stringify(r0).slice(0, 90));
for (const v of [5, 10, 20]) { await dosis('dobutamina', v); const r = await R(); console.log(`dobutamina ${v}: PAM ${r.pam} FC ${r.fc} IC ${r.ic} IRVS ${r.irvs}`); if (v === 20) ok(r.irvs < r0.irvs - 1, `dobutamina 20: IRVS ${r0.irvs} → ${r.irvs}`); }
await page.evaluate(() => window.__receptor.ponerEstado('milrinona')); await page.waitForTimeout(4000); let r = await R(); console.log(`milrinona: PAM ${r.pam} FC ${r.fc} IC ${r.ic} IRVS ${r.irvs} · ${r.frase.slice(0, 140)}`);
await page.evaluate(() => window.__receptor.ponerEstado('betabloqueo')); await page.waitForTimeout(4000); r = await R(); console.log('Begoña base:', JSON.stringify(r).slice(0, 120));
console.log('Begoña mandos:', await page.evaluate(() => [...document.querySelectorAll('#dock button, #dock input')].filter((e) => e.offsetParent).map((b) => (b.dataset.dosis || b.dataset.acc || b.dataset.f || b.id || '') + ':' + (b.textContent || b.value).trim().slice(0, 22)).join(' | ')));
for (const v of [5, 10, 20]) { await dosis('adrenalina', v); r = await R(); console.log(`Begoña adrenalina ${v}: PAM ${r.pam} FC ${r.fc} IC ${r.ic} IRVS ${r.irvs} lact ${r.lact} · ${r.frase.slice(0, 120)}`); }
await page.screenshot({ path: CAP + 'receptor/03b-begona-adre10-390.png' });
// glucagón si hay botón
const glu = await page.evaluate(() => { const b = [...document.querySelectorAll('#dock button')].find((x) => /glucag/i.test(x.textContent)); if (b) { b.click(); return b.textContent.trim().slice(0, 30); } return null; }); if (glu) { await page.waitForTimeout(5000); r = await R(); console.log(`Begoña + ${glu}: PAM ${r.pam} FC ${r.fc} IC ${r.ic} lact ${r.lact} · ${r.frase.slice(0, 120)}`); }
await page.evaluate(() => window.__receptor.ponerEstado('na-vasopresina')); await page.waitForTimeout(4000); r = await R(); console.log(`na-vasopresina: PAM ${r.pam} FC ${r.fc} IC ${r.ic} IRVS ${r.irvs}`);
// Mayéutica entera (como rec.js del constructor)
await page.locator('#modo-preguntas').tap(); await page.waitForTimeout(700);
const $c = async (sel) => { const e = await page.$('#preg ' + sel); if (e) { await e.click(); await page.waitForTimeout(350); return true; } return false; };
const vistos = []; let destapa = 0, errs = 0;
for (let i = 0; i < 60; i++) {
  const head = await page.evaluate(() => document.querySelector('#preg').innerText.slice(0, 60).replace(/\n+/g, ' | ')); vistos.push(head.slice(0, 22));
  if (/Lo que te llevas/.test(head)) { await page.screenshot({ path: CAP + 'receptor/08-may-final-390.png' }); break; }
  await desb(page, 'rec may ' + i);
  if (i === 1) await page.screenshot({ path: CAP + 'receptor/06-may-q2-390.png' });
  if (await $c('[data-mm="ops"]')) { await $c(`[data-op="${i % 3 === 0 ? 0 : 1}"]`); }
  else if (await $c('[data-mm="destapar"]')) { destapa++; await $c('[data-tenia="0"]'); await $c('[data-mm="destapado"]'); }
  else if (await $c('[data-fr="0"]')) { errs++; await $c('[data-mm="corregir"]'); for (const e of await page.$$('#preg [data-buena]')) await e.click(); }
  else if (await $c('[data-mm="sig"]')) continue;
  if (i === 1) await page.screenshot({ path: CAP + 'receptor/06-may-q2r-390.png' });
  if (i === 12) await page.screenshot({ path: CAP + 'receptor/07-may-q13r-390.png' });
  const txt = await page.evaluate(() => document.getElementById('preg').innerText); ok(!/undefined|NaN/.test(txt), `receptor may ${i}: undefined`);
  await desb(page, 'rec may resp ' + i);
  if (await $c('[data-mm="tocar"]')) await page.waitForTimeout(4500);
  if (!(await $c('[data-mm="sig"]'))) { console.log('receptor: sin siguiente en', i); await page.screenshot({ path: CAP + 'receptor/atasco-390.png' }); break; }
}
console.log('receptor may:', vistos.join(' / '), '· destapa', destapa, 'errores-formato', errs);
await page.close();
// ---- pulmón: mandos con espera larga
page = await nuevo(390, 844);
await page.goto(BASE + 'b3-pulmon.html', { waitUntil: 'networkidle' }); await page.waitForTimeout(2000);
const cifras = () => page.evaluate(() => { const g = (k) => document.querySelector(`[data-fila="${k}"]`)?.textContent.replace(/\s+/g, ' ').trim(); return ['pico', 'flujofin', 'vt', 'meseta', 'peeptot', 'cstat', 'vm', 'ie'].map(g).join(' | ') + ' || ' + (document.getElementById('consola').hidden ? '' : document.getElementById('consola').textContent.trim().slice(0, 120)); });
const mando = async (k, v) => { await page.evaluate(([k, v]) => { const i = document.querySelector(`input[data-m="${k}"]`); if (!i) return; i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); }, [k, v]); await page.waitForTimeout(9000); };
const tap = async (sel) => { const el = page.locator(sel).first(); await el.scrollIntoViewIfNeeded(); await el.tap(); await page.waitForTimeout(200); };
await page.evaluate(() => document.getElementById('escena').scrollIntoView()); await page.waitForTimeout(500); await page.locator('#escena').screenshot({ path: CAP + 'pulmon/30-escena-normal-390.png' });
await tap('[data-pest="resp"]');
for (const [k, v] of [['vt', 800], ['flujo', 30], ['flujo', 100], ['fr', 35], ['peep', 20]]) { await mando(k, v); console.log(`mando ${k}=${v}: ${await cifras()}`); }
await tap('[data-estado="normal-vcv"]'); await page.waitForTimeout(500); await tap('[data-pest="pulmon"]');
for (const [k, v] of [['c', 15], ['r', 40]]) { await mando(k, v); console.log(`mando ${k}=${v}: ${await cifras()}`); }
await page.screenshot({ path: CAP + 'pulmon/31-c15-r40-390.png' });
await tap('[data-estado="normal-pcv"]'); await page.waitForTimeout(500); await tap('[data-pest="resp"]'); await mando('pinsp', 30); console.log(`PCV pinsp=30: ${await cifras()}`); await page.screenshot({ path: CAP + 'pulmon/32-pcv30-390.png' });
await tap('[data-estado="sdra-rigido"]'); await page.waitForTimeout(500); await tap('[data-pest="man"]'); await tap('[data-m="oclusion"]'); await page.waitForTimeout(9000); console.log(`sdra + oclusión: ${await cifras()}`);
await page.evaluate(() => document.getElementById('escena').scrollIntoView()); await page.waitForTimeout(400); await page.locator('#escena').screenshot({ path: CAP + 'pulmon/33-escena-sdra-390.png' });
await tap('[data-estado="eulalia-conectada"]'); await page.waitForTimeout(6000); await page.evaluate(() => document.getElementById('escena').scrollIntoView()); await page.waitForTimeout(400); await page.locator('#escena').screenshot({ path: CAP + 'pulmon/34-escena-eulalia-390.png' });
await tap('[data-pest="man"]'); await tap('[data-m="oclusion"]'); await page.waitForTimeout(9000); await page.evaluate(() => scrollTo(0, 0)); await page.waitForTimeout(300); await page.screenshot({ path: CAP + 'pulmon/35-eulalia-oclusion-390.png' }); console.log(`eulalia + oclusión: ${await cifras()}`);
await page.close();
// ---- 360 px: las cuatro, inicio + un estado + Mayéutica primera
for (const m of ['b3-shock', 'b3-ritmo', 'b3-receptor', 'b3-pulmon']) {
  page = await nuevo(360, 780); await page.goto(BASE + m + '.html', { waitUntil: 'networkidle' }); await page.waitForTimeout(1500); await desb(page, m + ' 360 inicio');
  await page.screenshot({ path: `${CAP}${m.slice(3)}/360-inicio.png` });
  const orgs = await page.evaluate(() => [...document.querySelectorAll('.org')].filter((e) => e.offsetParent).map((e) => [e.textContent.trim().slice(0, 40), Math.round(e.getBoundingClientRect().height)]).filter((o) => o[1] > 24)); if (orgs.length) console.log(m, '360 .org en dos líneas:', JSON.stringify(orgs.slice(0, 4)));
  const mm = await page.$('#modo-may, #modo-preguntas'); if (mm) { await mm.tap(); await page.waitForTimeout(700); await desb(page, m + ' 360 may'); await page.screenshot({ path: `${CAP}${m.slice(3)}/360-may.png` }); }
  console.log(m, '360: dock', await page.evaluate(() => document.getElementById('dock')?.offsetHeight), 'alto', await page.evaluate(() => document.documentElement.scrollHeight));
  await page.close();
}
await browser.close();
console.log('\nERRORES', errores.length, errores.slice(0, 4)); console.log('FALLOS', fallos.length); for (const f of fallos) console.log(' ✗', f);
