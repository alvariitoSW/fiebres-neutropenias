// Prueba del profesor (fase 3): camino de FALLO en A, B y C a 390 px. Uso: PUERTO=<p> node prueba-fallos.mjs [carpeta-capturas]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const P = process.env.PUERTO || 8000, BASE = `http://localhost:${P}/autonomo/maquetas/educacion/`;
const CAP = process.argv[2] || null;
const b = await chromium.launch();
const nueva = async () => { const p = await (await b.newContext({ viewport: { width: 390, height: 844 }, reducedMotion: 'reduce', deviceScaleFactor: 1 })).newPage(); const e = []; p.on('pageerror', x => e.push(String(x))); p.on('console', m => m.type() === 'error' && e.push(m.text())); p.__e = e; return p; };
const foto = async (p, n, full) => CAP && p.screenshot({ path: `${CAP}/${n}.png`, fullPage: !!full });
const vis = (p, sel) => p.locator(sel).filter({ visible: true });
// ---------- A: falla A1 (elige a), A3 (elige c), A8 marca la 1
{ const p = await nueva(); await p.goto(BASE + 'a-poe-shock.html'); await p.waitForSelector('#pant .q');
  const pos = await p.evaluate(() => { const q = document.querySelector('#pant .q').getBoundingClientRect(); return { qTop: Math.round(q.top + scrollY), alto: innerHeight }; });
  console.log('A P1: la pregunta empieza en y =', pos.qTop, 'px (pantalla', pos.alto, ')'); await foto(p, 'a-p1');
  const clic = async re => { await p.locator('button:visible', { hasText: re }).first().click(); await p.waitForTimeout(80); };
  const apuesta = async n => { await clic(/Ya lo tengo/); await p.locator('#pant .q').last().locator('.op').nth(n).click(); await p.waitForTimeout(80); };
  await apuesta(0); await clic(/Subir la sepsis/); await p.waitForTimeout(300);
  const t = await p.evaluate(() => document.querySelector('#pant').innerText);
  console.log('A P2 tras fallar A1 · orden:', ['Shock séptico', 'Tu apuesta decía', 'Si hubieras apostado', 'Tabla 14.1', 'Ver en la ficha'].map(s => `${s}@${t.indexOf(s)}`).join(' '));
  await foto(p, 'a-p2-fallo', true);
  await p.locator('.porque-btn:visible').first().click(); await p.waitForTimeout(100);
  const t2 = await p.evaluate(() => document.querySelector('#pant').innerText);
  console.log('A P2 tras abrir Por qué · orden:', ['Tu apuesta decía', 'Con tu plan', 'Si hubieras apostado', 'Tabla 14.1', 'Ver en la ficha'].map(s => `${s}@${t2.indexOf(s)}`).join(' '));
  console.log('A P2 ¿tabla Tu apuesta | Lo que pasó?:', /Tu apuesta/.test(await p.evaluate(() => [...document.querySelectorAll('#pant table')].map(t => t.innerText).join(' '))));
  await clic(/Ahora explica: ¿por qué el gasto/); await apuesta(0); await clic(/Seguir: otra herida/);
  const velo = await p.evaluate(() => document.querySelector('#mon').innerText.replace(/\s/g, '').slice(0, 80)); console.log('A P3 monitor velado:', velo);
  console.log('A P3 apuesta visible sin scroll:', await p.evaluate(() => document.querySelector('#pant .q .btn').getBoundingClientRect().top < innerHeight));
  await apuesta(2); await clic(/Mirar el monitor de Mateo/);
  const t3 = await p.evaluate(() => document.querySelector('#pant').innerText); console.log('A P3 fallo:', /Tu apuesta decía \(c\)/.test(t3));
  console.log('A errores:', p.__e.length); }
// ---------- B: transfunde dos veces (el error), luego falla Q1 (A) y en error marca solo frases buenas
{ const p = await nueva(); await p.goto(BASE + 'b-error-capilar.html'); await p.waitForFunction(() => window.__B); await p.waitForTimeout(400);
  const y = await p.evaluate(() => { const r = document.querySelector('#m-transf').getBoundingClientRect(); return Math.round(r.top + scrollY); });
  console.log('B P1: el mando «Transfundir» está en y =', y);
  await p.click('#m-transf'); await p.waitForFunction(() => window.__B.pant === 2);
  const pistas = await p.evaluate(() => document.querySelector('#pantallas').innerText.match(/umbral[^\n]{0,80}/gi)); console.log('B P2 pistas visibles:', JSON.stringify(pistas));
  await p.click('#ap-ops [data-ap="0"]'); await p.click('#m-transf'); await p.waitForFunction(() => window.__B.pant === 3);
  const o = await p.evaluate(() => { const t = document.body.innerText; return ['TACO', 'llenado el pulmón', 'Pasó. Ahora, por qué', 'umbral es 7'].map(s => `${s}@${t.indexOf(s)}`).join(' '); });
  console.log('B P3 orden (consecuencia antes que enseñanza):', o);
  await p.click('#entender'); let tests4 = 0; for (let i = 0; i < 6; i++) { if (await p.isVisible('#p4-ops')) { tests4++; await p.click('#p4-ops [data-k="0"]'); } await p.click('#p4-sig'); await p.waitForTimeout(100); }
  console.log('B P4: pasos con test antes de mostrarse =', tests4);
  await p.click('#q-ya'); await p.click('#q-cuerpo button[data-k="0"]');
  const r = await p.evaluate(() => document.querySelector('#q-res').innerText.slice(0, 300)); console.log('B Q1 fallada:', r.replace(/\n/g, ' | '));
  await foto(p, 'b-q1-fallo', true);
  await p.click('#q-sig'); const dest = await p.evaluate(() => [...document.querySelectorAll('#q-cuerpo input[type=checkbox]')].length); console.log('B destapa: casillas para marcar lo que tenías =', dest);
  for (let k = 0; k < 4; k++) await p.click(`#q-cuerpo button[data-k="${k}"]`); await p.click('#q-sig');
  await p.click('#q-cuerpo button[data-k="1"]'); await p.click('#q-comp');
  console.log('B error marcando una buena:', (await p.evaluate(() => document.querySelector('#q-res').innerText)).replace(/\n/g, ' | ').slice(0, 260));
  const tb = await p.evaluate(() => document.body.innerText);
  console.log('B ¿hay repaso de lo fallado?:', /otra vez|repaso/i.test(tb), '· momentos del caso:', (tb.match(/Día \d|Hora \d|h \d|\d{1,2}:\d{2}/g) || []).slice(0, 8).join(', '));
  await foto(p, 'b-error-fallo', true);
  console.log('B errores:', p.__e.length); }
// ---------- C: falla las preguntas del repaso 2 y 3 y la P1 y P3 del caso
{ const p = await nueva(); await p.goto(BASE + 'c-entrelazado-rio.html'); await p.waitForTimeout(800);
  const preg = () => p.locator('.c-preg').last();
  const sig = async re => { await vis(p, '.c-b.c-prim').filter({ hasText: re }).first().click(); await p.waitForTimeout(150); };
  await preg().locator('.c-frase').nth(0).click(); await sig(/Comprobar/);
  console.log('C R1 (marca una buena):', (await preg().locator('.c-veredicto').innerText()), '·', await preg().locator('.c-vuelve').innerText());
  await sig(/Siguiente pregunta/);
  if (await vis(p, '.c-b.c-prim').filter({ hasText: /Ya lo pensé/ }).count()) await sig(/Ya lo pensé/);
  await preg().locator('.c-op').nth(1).click();
  console.log('C R2 fallada:', await preg().locator('.c-vuelve').innerText()); await foto(p, 'c-r2-fallo');
  console.log('C chip R2:', await preg().locator('.c-chip').innerText().catch(() => '—'));
  await sig(/Siguiente pregunta/); if (await vis(p, '.c-b.c-prim').filter({ hasText: /Ya lo pensé/ }).count()) await sig(/Ya lo pensé/);
  await preg().locator('.c-op').nth(0).click(); console.log('C R3 fallada:', await preg().locator('.c-vuelve').innerText());
  await sig(/Siguiente pregunta/); await sig(/Ya lo pensé/); await sig(/Listo/); console.log('C R4 sin marcar nada:', await preg().locator('.c-vuelve').innerText());
  await sig(/Siguiente pregunta/); if (await vis(p, '.c-b.c-prim').filter({ hasText: /Ya lo pensé/ }).count()) await sig(/Ya lo pensé/);
  await preg().locator('.c-op').nth(0).click(); await sig(/Terminar el repaso/);
  const tabla = await p.evaluate(() => [...document.querySelectorAll('table')].map(t => t.innerText.replace(/\t/g, ' / ').replace(/\n/g, ' | ')).join(' || ').slice(0, 500)); console.log('C tabla repaso tras fallar:', tabla);
  await sig(/Ir a Teresa/); if (await vis(p, '.c-b.c-prim').filter({ hasText: /Ya lo pensé/ }).count()) await sig(/Ya lo pensé/);
  await preg().locator('.c-op').nth(0).click(); await p.waitForTimeout(200);
  console.log('C caso P1 fallada:', (await preg().innerText()).replace(/\n/g, ' | ').slice(0, 400)); await foto(p, 'c-caso-fallo');
  console.log('C errores:', p.__e.length); }
await b.close();
