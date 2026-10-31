// Capturas y resumen en texto de los estados lentos del corazón eléctrico (b3-bradi), para el profesor.
// Uso: node autonomo/bloques/b3/herramientas/bradi-capturas.mjs [carpeta-de-capturas] [puerto]
// Arranca su propio `python3 -m http.server` en un puerto libre y lo cierra por su PID.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { spawn } from 'node:child_process';
import net from 'node:net';
import path from 'node:path';

const RAIZ = path.resolve(new URL('../../../..', import.meta.url).pathname);
const DIR = (process.argv[2] || '/tmp/plan-socialista/b3-bradi/').replace(/\/?$/, '/');
const puertoLibre = () => new Promise(r => { const s = net.createServer(); s.listen(0, () => { const p = s.address().port; s.close(() => r(p)); }); });
const PUERTO = Number(process.argv[3]) || await puertoLibre();
const srv = spawn('python3', ['-m', 'http.server', String(PUERTO)], { cwd: RAIZ, stdio: 'ignore' });
await new Promise(r => setTimeout(r, 700));
console.log('servidor PID', srv.pid, 'puerto', PUERTO);

const ESTADOS = [['bradi', {}, 'Bradicardia sinusal', true], ['bav1', {}, 'BAV 1.º', true], ['bav2', { mobitz: 'I' }, 'Mobitz I', true], ['bav2', { mobitz: 'II' }, 'Mobitz II 3:2', true],
  ['bav2', { mobitz: '2:1' }, 'Bloqueo 2:1', false], ['bav3', { escape: 'nodal' }, 'BAV3 nodal', false], ['bav3', { escape: 'vent' }, 'BAV3 ventricular', false], ['marcapasos', {}, 'Marcapasos', false]];
try {
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  const errores = []; p.on('pageerror', e => errores.push(String(e))); p.on('console', m => { if (m.type() === 'error') errores.push(m.text()); });
  const R = (f, ...a) => p.evaluate(([f, a]) => { const r = window.__ritmo; const v = typeof r[f] === 'function' ? r[f](...a) : r[f]; return v === undefined ? null : v; }, [f, a]);
  await p.goto(`http://localhost:${PUERTO}/index.html`); await p.waitForFunction(() => document.getElementById('rtv-raiz'));
  await p.click('#btn-libros'); await p.click('#btn-libro-marino'); await p.click('#lib-pest-vivos'); await p.click('#rtv-menu-libros'); await p.waitForTimeout(900);
  for (const [k, ex, nom, foto] of ESTADOS) {
    await R('ponerEstado', k, ex); await p.waitForTimeout(300);
    await R('avanzarHasta', (await R('simT')) + 12); await p.waitForTimeout(400);
    const info = await p.evaluate(() => {
      const t = s => (document.querySelector(s)?.innerText || '').replace(/\s+/g, ' ').trim();
      const cifras = [...document.querySelectorAll('#rtv-mon-cifras .cifra')].map(c => c.innerText.replace(/\s+/g, ' ').trim());
      const frase = t('#rtv-frase') || t('.rtv-frase');
      const citas = [...document.querySelectorAll('#rtv-raiz .cita')].filter(c => c.offsetParent).map(c => ({ ficha: c.querySelector('.cita-ir')?.dataset.resaltar, tab: c.querySelector('.cita-ir')?.dataset.tab, pdf: c.querySelector('.cita-pdf')?.getAttribute('href') }));
      const chips = [...document.querySelectorAll('#rtv-frase .origen, #rtv-frase button, #rtv-frase a, #rtv-frase [class*=orig]')].map(x => x.tagName + ':' + x.innerText.replace(/\s+/g, ' ').trim());
      const ancho = document.documentElement.scrollWidth - window.innerWidth;
      const pac = t('#rtv-paciente') || t('.rtv-paciente') || t('[class*=ficha-pac]');
      return { cifras, frase, citas, chips, ancho, pac };
    });
    // la guía «Explícame este estado»: pasos, texto y resalte
    await p.evaluate(() => document.getElementById('rtv-explicame').click()); await p.waitForTimeout(400);
    const pasos = [];
    for (let i = 0; i < 5; i++) {
      const g = await p.evaluate(() => { const g = document.querySelector('#rtv-dock-guia'); if (!g) return null; return { txt: (g.querySelector('.guia-txt')?.innerText || '').replace(/\s+/g, ' ').trim(), anillo: document.querySelectorAll('.guia-anillo, .guia-marco').length, citas: g.querySelectorAll('.cita-ir').length, sig: !!document.getElementById('rtv-guia-sig') && !document.getElementById('rtv-guia-sig').disabled }; });
      if (!g || !g.txt || (pasos.length && g.txt === pasos[pasos.length - 1].txt)) break;
      pasos.push(g); if (!g.sig) break;
      await p.evaluate(() => document.getElementById('rtv-guia-sig')?.click()); await p.waitForTimeout(200);
    }
    await p.evaluate(() => document.getElementById('rtv-guia-x')?.click()); await p.waitForTimeout(200);
    console.log(`\n=== ${nom} (${k} ${JSON.stringify(ex)}) · desborde ${info.ancho}px`);
    console.log('monitor:', info.cifras.join(' | '));
    console.log('paciente:', info.pac.slice(0, 160));
    console.log('frase:', info.frase);
    console.log('chips frase:', info.chips.join(' · '));
    console.log('citas visibles (Ver en la ficha / PDF):', info.citas.map(c => `${c.tab}${c.ficha} → ${c.pdf}`).join(' ; ') || 'ninguna');
    pasos.forEach((g, i) => console.log(`guía ${i + 1}: [anillos ${g.anillo}, citas ${g.citas}] ${g.txt}`));
    if (foto) { await p.screenshot({ path: `${DIR}prof-${k}${ex.mobitz ? '-mobitz' + ex.mobitz : ''}.png` }); console.log('captura:', `${DIR}prof-${k}${ex.mobitz ? '-mobitz' + ex.mobitz : ''}.png`); }
  }
  console.log('\nerrores de consola:', errores.length ? errores.join('\n') : 'ninguno');
  await b.close();
} finally { process.kill(srv.pid); }
