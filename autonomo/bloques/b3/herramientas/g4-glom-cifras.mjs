// Prueba del glomérulo vivo (congestión): dos estados + tope + enlace data-glomerulo="congestion".
// Uso: node autonomo/bloques/b3/herramientas/g4-glom-cifras.mjs <url-base> [carpeta-capturas]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = (process.argv[2] || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAP = process.argv[3];
const b = await chromium.launch();
let mal = 0;
const ok = (c, t) => { console.log(`${c ? '✅' : '❌'} ${t}`); if (!c) mal++; };
for (const ancho of [390, 360]) {
  const p = await (await b.newContext({ viewport: { width: ancho, height: 844 }, deviceScaleFactor: 2 })).newPage();
  const err = []; p.on('pageerror', e => err.push(e.message)); p.on('console', m => m.type() === 'error' && !/favicon/.test(m.text()) && err.push(m.text()));
  await p.goto(BASE); await p.waitForTimeout(2500);
  // enlace cruzado como el de la ficha 13
  await p.evaluate(() => { const x = document.createElement('button'); x.id = 'enlace-prueba'; x.dataset.especialidad = 'nefrologia'; x.dataset.view = 'nefrona'; x.dataset.panel = 'panel-fisio-tabs'; x.dataset.tab = 'fisio-regulacion'; x.dataset.glomerulo = 'congestion'; x.className = 'especialidad-link'; document.body.appendChild(x); x.click(); });
  await p.waitForTimeout(1500);
  const leer = () => p.evaluate(() => { const c = document.querySelector('#fisio-regulacion .gl-medidores'); return { m: [...c.querySelectorAll('.nv-medidor-valor')].map(e => e.textContent.trim()), pam: document.querySelector('#fisio-regulacion .gl-pam').value, av: document.querySelector('#fisio-regulacion .gl-avisos').textContent, on: document.querySelector('#fisio-regulacion [data-gl=congestion]').getAttribute('aria-pressed') }; });
  let s = await leer(); console.log(ancho, JSON.stringify(s));
  ok(s.on === 'true' && s.pam === '80', `${ancho}: el enlace pone congestión y PAM 80`);
  ok(/48/.test(s.m[0]) && /3,2|3,3/.test(s.m[1]) && /4[01] ml/.test(s.m[2]), `${ancho}: capilar 48, neta ≈3, TFG ≈41`);
  ok(/PAM 80 − PVC 20 = 60/.test(s.av), `${ancho}: frase viva con perfusión 60`);
  if (CAP) await p.locator('#fisio-regulacion .gl-escenario').screenshot({ path: `${CAP}/glom-${ancho}.png` });
  await p.evaluate(() => document.querySelector('#fisio-regulacion [data-gl=congestion]').click()); await p.waitForTimeout(200);
  s = await leer(); ok(/55/.test(s.m[0]) && /10,0/.test(s.m[1]) && /125/.test(s.m[2]), `${ancho}: sin congestión (PAM 80) 55 / 10 / 125`);
  // extremos: PAM 40..220 con congestión: cifras no negativas ni absurdas
  for (const pam of [40, 80, 220]) {
    await p.evaluate(v => { const r = document.querySelector('#fisio-regulacion .gl-pam'); r.value = v; r.dispatchEvent(new Event('input')); if (document.querySelector('#fisio-regulacion [data-gl=congestion]').getAttribute('aria-pressed') !== 'true') document.querySelector('#fisio-regulacion [data-gl=congestion]').click(); }, pam);
    s = await leer(); const tfg = parseFloat(s.m[2].replace(/[^\d]/g, '')); console.log('  PAM', pam, s.m.join(' | '));
    ok(tfg >= 0 && tfg <= 170, `${ancho}: PAM ${pam} + congestión, TFG ${tfg} posible`);
  }
  const d = await p.evaluate(() => document.documentElement.scrollWidth - innerWidth);
  ok(d <= 0, `${ancho}: sin desborde (${d})`); ok(!err.length, `${ancho}: sin errores ${err.join(';')}`);
}
await b.close(); process.exit(mal ? 1 : 0);
