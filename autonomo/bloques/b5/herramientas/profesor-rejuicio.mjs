// Rejuicio del profesor (b5): sello del HPV, Apuesta y caso plegado; TMV hm:3, Juega con sello e ibuprofeno. Uso: node ... <dir> [puerto]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const D = process.argv[2], PORT = process.argv[3] || 8731;
const b = await chromium.launch(); const err = [];
const nueva = async (w) => { const p = await b.newPage({ viewport: { width: w, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
  p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type()==='error' && err.push(m.text())); await p.goto(`http://localhost:${PORT}/`); await p.waitForTimeout(2500); return p; };
const abrir = (p, tab, attr, est) => p.evaluate(([tab, attr, est]) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab }); document.body.append(t); t.click(); t.remove();
  return new Promise(r => setTimeout(() => { const x = document.querySelector(`[${attr}="${est}"]`); if (!x) return r('NO ' + est); x.click(); r('ok ' + est); }, 500)); }, [tab, attr, est]);
const R = (e) => e ? [Math.round(e.top), Math.round(e.bottom)] : null;
const p = await nueva(390);
// HPV sello
console.log(await abrir(p, 'ma-encefalopatia-hepatica', 'data-hepatocito-vivo', 'edema')); await p.waitForTimeout(1500);
console.log('HPV edema', JSON.stringify(await p.evaluate(() => { const g = id => document.getElementById(id)?.getBoundingClientRect(); return { mon: R2(g('hpv-monitor')), esc: R2(g('hpv-escena')), sello: R2(g('hpv-sello-zona')), selloTxt: document.getElementById('hpv-sello-zona').textContent.replace(/\s+/g,' ').slice(0,160), astro: R2(document.querySelector('#hpv-svg .astro')?.getBoundingClientRect()), frase: R2(g('hpv-frase')), dock: Math.round(document.getElementById('hpv-dock').offsetHeight) }; function R2(e){return e?[Math.round(e.top),Math.round(e.bottom)]:null} })));
await p.screenshot({ path: D + '/1-hpv-sello.png' });
// Apuesta
await p.click('#hpv-modo-apuesta'); await p.waitForTimeout(600);
console.log('APUESTA', await p.evaluate(() => document.getElementById('hpv-prueba').textContent.replace(/\s+/g,' ').slice(0,500)));
await p.evaluate(() => document.getElementById('hpv-prueba').scrollIntoView({block:'start'})); await p.waitForTimeout(300); await p.screenshot({ path: D + '/2-hpv-apuesta.png' });
// Caso
await p.click('#hpv-modo-caso'); await p.waitForTimeout(600);
for (let k = 0; k < 8; k++) {
  const r = await p.evaluate((k) => { const c = [...document.querySelectorAll('#hpv-prueba .paso:not(.plegado)')].pop(); if (!c) return 'sin paso';
    const ops = [...c.querySelectorAll('button.op:not([disabled])')]; const enun = c.querySelector('.enun')?.textContent.slice(0,90);
    if (ops.length) { const mala = ops.find(o => /Ringer/i.test(o.textContent)); (k === 1 && mala ? mala : ops[0]).click(); return 'resp ' + enun; }
    const sig = [...c.querySelectorAll('button')].find(x => /Siguiente/.test(x.textContent)); if (sig) { sig.click(); return 'sig'; } return 'espera/fin ' + enun; }, k);
  await p.waitForTimeout(900);
  const m = await p.evaluate(() => { const c = [...document.querySelectorAll('#hpv-prueba .paso:not(.plegado)')].pop(); const sig = c && [...c.querySelectorAll('button')].find(x => /Siguiente|indicaciones/.test(x.textContent)); const d = document.getElementById('hpv-dock').getBoundingClientRect().top;
    return { sigTop: sig ? Math.round(sig.getBoundingClientRect().top) : null, dockTop: Math.round(d), plegados: [...document.querySelectorAll('#hpv-prueba .paso.plegado')].map(x=>x.textContent).join(' | '), mon: Math.round(document.getElementById('hpv-monitor').getBoundingClientRect().top), frase: document.getElementById('hpv-frase').textContent.slice(0,110), astro: document.getElementById('hpv-mon-astro')?.textContent }; });
  console.log('CASO', k, r, JSON.stringify(m));
  if (k === 0) await p.screenshot({ path: D + '/3b-hpv-tras-responder.png' }); if (k === 1) await p.screenshot({ path: D + '/3-hpv-caso.png' });
  if (/espera\/fin|sin paso/.test(r)) break; }
// TMV hm:3
console.log(await abrir(p, 'ma-hipertermia', 'data-termostato-vivo', 'hm:3')); await p.waitForTimeout(1500);
const tm = () => p.evaluate(() => { const g = id => document.getElementById(id); const f = document.querySelector('#tmv-svg .foco')?.getBoundingClientRect(); const ca = [...document.querySelectorAll('#tmv-svg text')].find(t => /Ca²⁺/.test(t.textContent))?.getBoundingClientRect();
  return { dockH: g('tmv-dock').offsetHeight, dockTop: Math.round(g('tmv-dock').getBoundingClientRect().top), foco: f && [Math.round(f.top), Math.round(f.bottom)], ca: ca && [Math.round(ca.top), Math.round(ca.bottom)], frase: g('tmv-frase').textContent.slice(0,150), sello: g('tmv-sello-zona').textContent.replace(/\s+/g,' ').slice(0,200), avisos: g('tmv-avisos-zona').textContent.replace(/\s+/g,' ').slice(0,300), mon: g('tmv-monitor').textContent.replace(/\s+/g,' ').slice(0,160) }; });
console.log('TMV hm:3', JSON.stringify(await tm())); await p.screenshot({ path: D + '/4-tmv-hm3.png' });
// Juega a tope
await p.selectOption('#tmv-m-est', 'juega'); await p.waitForTimeout(500); await p.selectOption('#tmv-j-calor', '3'); await p.evaluate(() => { const x = document.getElementById('tmv-j-pir'); if (x) { x.value = x.max || x.options?.[x.options.length-1]?.value; x.dispatchEvent(new Event('change')); x.dispatchEvent(new Event('input')); } });
for (let i = 0; i < 14; i++) { const ok = await p.evaluate(() => { const h = document.getElementById('tmv-j-hora'); if (h.disabled) return false; h.click(); return true; }); await p.waitForTimeout(150); if (!ok) { console.log('hora tope en', i); break; } }
console.log('TMV juega tope', JSON.stringify(await tm())); await p.screenshot({ path: D + '/5-tmv-juega.png' });
await p.click('#tmv-j-ibu'); await p.waitForTimeout(300); console.log('IBU1', JSON.stringify(await tm()));
await p.click('#tmv-j-ibu'); await p.waitForTimeout(300); console.log('IBU2', JSON.stringify(await tm())); await p.screenshot({ path: D + '/6-tmv-ibu.png' });
// TRR a 360
const q = await nueva(360); await abrir(q, 'ma-fallo-hepatico-agudo', 'data-hepatocito-vivo', 'casimira'); await q.waitForTimeout(1200); await q.click('#hpv-modo-caso');
for (let k = 0; k < 10; k++) { await q.evaluate(() => { const c = [...document.querySelectorAll('#hpv-prueba .paso:not(.plegado)')].pop(); if (!c) return; const o = c.querySelector('button.op:not([disabled])'); if (o) return o.click(); const s = [...c.querySelectorAll('button')].find(x => /Siguiente/.test(x.textContent)); if (s) s.click(); }); await q.waitForTimeout(500); }
console.log('TRR360', JSON.stringify(await q.evaluate(() => { const f = document.getElementById('hpv-b-filtro'); if (!f) return 'sin botón (¿paso con mando?)'; const r = f.getBoundingClientRect(); return { txt: f.textContent, w: Math.round(r.width), h: Math.round(r.height), sw: document.documentElement.scrollWidth }; })));
console.log('errores', err); await b.close();
