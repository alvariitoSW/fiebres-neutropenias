// P4d · 10 capturas de la imagen del ecógrafo con el dibujo nuevo (?dibujo=2) + 1 con el de hoy (antes/después), y sus cifras.
// uso: node capturas-realismo.mjs   → autonomo/bloques/mv-eco/capturas-realismo/<clave>.png y cifras.md
import { createServer } from 'node:http';
import { readFile, writeFile } from 'node:fs/promises';
import { join, extname, dirname } from 'node:path';
import { fileURLToPath } from 'node:url';
const RAIZ = join(dirname(fileURLToPath(import.meta.url)), '..', '..', '..', '..');
const OUT = join(RAIZ, 'autonomo/bloques/mv-eco/capturas-realismo');
const TIPOS = { '.html': 'text/html', '.mjs': 'text/javascript', '.js': 'text/javascript', '.css': 'text/css', '.jpg': 'image/jpeg', '.png': 'image/png' };
let pw; for (const r of ['playwright', '/opt/node22/lib/node_modules/playwright/index.mjs']) { try { pw = await import(r); break; } catch {} }
const srv = createServer(async (req, res) => { try { const r = join(RAIZ, decodeURIComponent(new URL(req.url, 'http://x').pathname)); if (!r.startsWith(RAIZ)) throw 0;
  res.writeHead(200, { 'content-type': TIPOS[extname(r)] || 'application/octet-stream' }); res.end(await readFile(r)); } catch { res.writeHead(404); res.end(); } });
await new Promise(r => srv.listen(0, '127.0.0.1', r));
const base = `http://127.0.0.1:${srv.address().port}/js/modules/eco/laboratorio.html`;
const nav = await pw.chromium.launch({ args: ['--use-gl=swiftshader', '--enable-unsafe-swiftshader'] });
// clave, escenario, g (null = sin mando), vista, dibujo
const LISTA0 = [
  ['normal-a4c', 'normal', null, 'a4c', 2], ['normal-psax', 'normal', null, 'psaxPm', 2], ['normal-plax', 'normal', null, 'plax', 2],
  ['hp-a4c', 'hpcronica', 1, 'a4c', 2], ['hp-psax', 'hpcronica', 1, 'psaxPm', 2],
  ['tep-a4c', 'tep', 1, 'a4c', 2], ['tep-psax', 'tep', 1, 'psaxPm', 2],
  ['dilatada-a4c', 'dilatada', 1, 'a4c', 2], ['derrame-sc4c', 'derrame', 1, 'sc4c', 2], ['hipertrofia-plax', 'hipertrofia', 1, 'plax', 2],
  ['hp-a4c-dibujo-hoy', 'hpcronica', 1, 'a4c', 1],
];
const SOLO = process.env.SOLO?.split(','); const LISTA = SOLO ? LISTA0.filter(x => SOLO.includes(x[0])) : LISTA0;
let md = '# Cifras de la app en cada captura (telediástole = fase A, contracción auricular; g = mando de gravedad)\n\n';
const errores = [];
for (const [clave, esc, g, vista, dib] of LISTA) {
  const pg = await nav.newPage({ viewport: { width: 390, height: 844 }, deviceScaleFactor: 2, hasTouch: true, isMobile: true });
  pg.on('pageerror', e => errores.push(`${clave}: ${e.message}`)); pg.on('console', m => m.type() === 'error' && errores.push(`${clave}: ${m.text()}`));
  await pg.goto(`${base}?depuracion=1${dib === 2 ? '&dibujo=2' : ''}`); await pg.waitForTimeout(1500);
  await pg.waitForFunction(() => window.__ultimoDibujo?.eco, null, { timeout: 60000 });
  if (esc !== 'normal') {
    await pg.click(`[data-c="${esc}"]`);
    if (g != null) { await pg.evaluate((g) => { const r = document.querySelector('#cv-grav'); r.value = g * 100; r.dispatchEvent(new Event('input')); r.dispatchEvent(new Event('change')); }, g); }
  }
  await pg.waitForTimeout(1500);
  await pg.evaluate((v) => window.__eco.vista(v), vista);
  // pausa en telediástole: ir a la fase A del último latido (botón de la barra del ciclo) y esperar a que se pinte
  await pg.waitForSelector('#cv-ciclo button[data-fase="A"]', { timeout: 60000 });
  await pg.click('#cv-ciclo button[data-fase="A"]'); await pg.waitForTimeout(1500);
  await pg.evaluate(() => new Promise(r => requestAnimationFrame(() => requestAnimationFrame(r))));
  const lienzo = pg.locator('#cv-eco'); await lienzo.scrollIntoViewIfNeeded();
  await lienzo.screenshot({ path: join(OUT, `${clave}.png`) });
  const c = await pg.evaluate(() => { const t = (id) => document.getElementById(id)?.textContent.trim(); const u = window.__motor.ultimo || {}; const f = (x, d = 0) => typeof x === 'number' ? +x.toFixed(d) : x;
    return { fase: t('cv-eco-fase'), titulo: t('cv-eco-titulo'), grav: t('cv-grav-txt'), 'Último latido': t('cv-l-lat'), VI: t('cv-l-vi'), VD: t('cv-l-vd'), Aorta: t('cv-l-ao'), 'Aurículas': t('cv-l-au'),
      motor: `FC ${f(u.fc)} · PAM ${f(u.pam)} · PA ${f(u.pas)}/${f(u.pad)} · GC ${f(u.gc, 2)} · PVC ${f(u.pvc, 1)}`, pantalla: window.__ultimoDibujo?.modo }; });
  md += `## ${clave} (${esc}${g != null ? ', g=' + g : ''}, ${vista}, dibujo ${dib})\n` + Object.entries(c).map(([k, v]) => `- ${k}: ${v}`).join('\n') + '\n\n';
  console.log(clave, c.fase);
  await pg.close();
}
md += `## Errores de consola\n${errores.length ? errores.map(e => '- ' + e).join('\n') : 'ninguno'}\n`;
await writeFile(join(OUT, 'cifras.md'), md);
await nav.close(); srv.close(); console.log('errores:', errores);
