import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const b = await chromium.launch(); const p = await b.newPage({ viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true, deviceScaleFactor: 2 });
const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type()==='error' && err.push(m.text()));
await p.goto('http://localhost:8731/'); await p.waitForTimeout(2500);
const abrir = async (tab, sel) => { await p.evaluate((tab) => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'marinoAbdomen', panel: 'panel-marino-abd-tabs', tab }); document.body.append(t); t.click(); t.remove(); }, tab); await p.waitForTimeout(500);
  return p.evaluate((sel) => { const x = document.querySelector(sel); if (!x) return 'NO'; const par = x.closest('p,li,div'); const txt = (par?.textContent||'').slice(0,90); x.click(); return x.textContent.trim().slice(0,70) + ' || párrafo: ' + txt; }, sel); };
const H = [['ma-encefalopatia-hepatica','edema'],['ma-encefalopatia-hepatica','casimira'],['ma-varices','alta:tips'],['ma-fallo-hepatico-agudo','casimira']];
for (const [tab, est] of H) { const t = await abrir(tab, `[data-hepatocito-vivo="${est}"]`); await p.waitForTimeout(1500);
  const r = await p.evaluate(() => { const a = document.querySelector('#hpv-svg .astro')?.getBoundingClientRect(), f = document.getElementById('hpv-frase').getBoundingClientRect(), m = document.querySelector('#hpv-raiz .monitor, #hpv-mon, [id^=hpv-mon]')?.getBoundingClientRect(); return { yscroll: Math.round(scrollY), astroTop: Math.round(a.top), astroBot: Math.round(a.bottom), frase: Math.round(f.top), frasetxt: document.getElementById('hpv-frase').textContent.slice(0,140), topes: window.__hpv && JSON.stringify(window.__hpv.leer().a) }; });
  console.log('HPV', est, '|', t, '\n   ', JSON.stringify(r)); }
await p.screenshot({ path: process.argv[2] + '/hpv-fha.png' });
const T = [['ma-fiebre','fiebre:2'],['ma-calor','golpe:4'],['ma-hipertermia','hm:3'],['ma-snm','snm:3'],['ma-ss','ss:3'],['ma-hipo','hipo:3']];
const tabs = await p.evaluate(() => [...document.querySelectorAll('[data-termostato-vivo]')].map(x => x.dataset.termostatoVivo + '@' + (x.closest('.tab-content')?.id||'?') + '#' + (x.closest('[id]')?.id||'')));
console.log('botones tmv:', tabs.join(' ; '));
for (const s of tabs) { const [est, rest] = s.split('@'); const tab = rest.split('#')[0]; const t = await abrir(tab, `[data-termostato-vivo="${est}"]`); await p.waitForTimeout(1200);
  const r = await p.evaluate(() => ({ pc: document.getElementById('tmv-pc-t')?.textContent, frase: document.getElementById('tmv-frase').textContent.slice(0,120), sellos: document.querySelectorAll('#tmv-raiz .tope-sello:not([hidden])').length, svgBot: Math.round(document.querySelector('#tmv-raiz svg').getBoundingClientRect().bottom), dock: Math.round(document.getElementById('tmv-dock').getBoundingClientRect().top), mon: document.querySelector('#tmv-raiz [id*=mon]')?.closest('div')?.textContent.replace(/\s+/g,' ').slice(0,140) }));
  console.log('TMV', est, '|', t, '\n   ', JSON.stringify(r)); }
console.log('errores', err);
await b.close();
