// P1: capturas del corazón y del neumotórax a media presión (390 y 360) + barrido en la app. Uso: node p1-captura.mjs <url> <carpeta>
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const [BASE, OUT] = [process.argv[2], process.argv[3]];
const b = await chromium.launch(); const res = [];
for (const w of [390, 360]) {
  const p = await (await b.newContext({ viewport: { width: w, height: 844 }, reducedMotion: w === 360 ? 'reduce' : 'no-preference' })).newPage();
  p.on('pageerror', e => console.log('ERR', e.message));
  await p.goto(BASE, { waitUntil: 'networkidle' });
  const abrir = k => p.evaluate(k => { const t = document.createElement('button'); Object.assign(t.dataset, { especialidad: 'libros', view: 'pulmonVivo', pulmonVivo: k }); document.body.append(t); t.click(); t.remove(); }, k);
  await abrir('cpap-eap'); await p.waitForTimeout(2500);
  if (w === 390) await (await p.$('#pul-corazon')).screenshot({ path: OUT + '/corazon-' + w + '.png' });
  await abrir('neumotorax-tension'); await p.waitForTimeout(1500);
  const lee = () => p.evaluate(() => ({ p: document.querySelector('[data-fila="neumo-p"] .v').textContent, pam: document.querySelector('[data-fila="cor-pam"] .v').textContent, gc: document.querySelector('[data-fila="cor-gc"] .v').textContent, vs: document.querySelector('[data-fila="cor-vs"] .v').textContent, spo2: document.querySelector('[data-fila="neumo-spo2"] .v').textContent, msg: document.querySelector('[data-nx="msg"]').textContent, desb: document.documentElement.scrollWidth - innerWidth }));
  const fila = [];
  for (let i = 0; i < 6; i++) { await p.click('[data-nx="pasar"]'); await p.waitForTimeout(700); fila.push(await lee()); }
  if (w === 390) await (await p.$('#pul-neumo')).screenshot({ path: OUT + '/neumotorax-medio-' + w + '.png' });
  res.push({ w, fila });
  for (let i = 0; i < 12 && !(await p.$('[data-nx="pasar"]:disabled')); i++) { await p.click('[data-nx="pasar"]'); await p.waitForTimeout(500); }
  fila.push(await lee());
  await abrir(process.argv[4] || 'fuga-cuff').catch(() => {}); await p.waitForTimeout(800);
  console.log(w, JSON.stringify(fila.map(f => [f.p, f.pam, f.gc, f.vs, f.spo2, f.desb])));
  console.log(w, 'msg', fila.map(f => f.msg).join(' | '));
  console.log(w, 'tras salir', JSON.stringify(await lee()));
}
await b.close();
