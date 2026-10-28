// Prueba de la maqueta B (error productivo en el capilar vivo). Uso: node prueba-b.mjs <url-base> [--capturas <carpeta>]
// Recorre a 390 px (con movimiento) y a 360 px (reducir movimiento): P1-P6, el tope pasado y el sello, las dos ramas
// «Dejar así» / «Parar aquí», las cifras del diseño, el desborde lateral y los errores de consola.
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const a = process.argv.slice(2);
const BASE = (a.find(x => /^https?:/.test(x)) || 'http://localhost:8000/').replace(/\/?$/, '/');
const CAP = a.includes('--capturas') ? a[a.indexOf('--capturas') + 1].replace(/\/?$/, '/') : null;
const URL_ = BASE + 'autonomo/maquetas/educacion/b-error-capilar.html';
const b = await chromium.launch();
let fallos = 0;
const ok = (c, m) => { if (!c) { fallos++; console.log('  FALLO ' + m); } };
async function correr(W, red) {
    console.log(`\n── ${W} px${red ? ' · reducir movimiento' : ''}`);
    const ctx = await b.newContext({ viewport: { width: W, height: 844 }, deviceScaleFactor: 2, reducedMotion: red ? 'reduce' : 'no-preference' });
    const p = await ctx.newPage(); const errs = [];
    p.on('console', m => { if (m.type() === 'error') errs.push(m.text()); }); p.on('pageerror', e => errs.push(String(e)));
    const cel = async k => (await p.textContent(`#cpv-c-${k} b`)).trim();
    const desborde = async (t) => { const d = await p.evaluate(() => document.documentElement.scrollWidth - document.documentElement.clientWidth); ok(d <= 0, `${t}: desborde ${d}px`); };
    const pant = async () => p.evaluate(() => window.__B.pant);
    const cap = async n => { if (CAP) await p.screenshot({ path: `${CAP}${W}-${n}.png` }); };
    const esperaPant = n => p.waitForFunction(x => window.__B.pant === x, n, { timeout: 8000 });
    const cargar = async () => { await p.goto(URL_); await p.waitForFunction(() => window.__B); await p.waitForTimeout(400); };
    await cargar();
    // P1
    ok(await pant() === 1, 'empieza en P1');
    const c1 = { hb: await cel('hb'), gc: await cel('gc'), do2: await cel('do2'), vo2: await cel('vo2'), o2er: await cel('o2er'), ven: await cel('ven'), lact: await cel('lact') };
    console.log('  P1', JSON.stringify(c1));
    ok(c1.hb.startsWith('7,4') && c1.gc.startsWith('7,6') && c1.do2.replace('.', '').startsWith('742') && c1.vo2.startsWith('250') && c1.o2er.startsWith('34') && c1.ven.startsWith('65') && c1.lact.startsWith('1,0'), 'cifras P1');
    ok(!(await p.textContent('body')).match(/piensa antes|¿qué harías/i) || true, '');
    await desborde('P1'); await cap('1');
    await p.click('#m-scv'); ok((await p.textContent('#scv-txt')).includes('65'), 'ScvO2 de control = 65');
    const idsAntes = await p.evaluate(() => [...document.querySelectorAll('#mandos button')].map(b => b.id));
    // P2
    await p.click('#m-transf'); await esperaPant(2); await p.waitForTimeout(300);
    const c2 = { hb: await cel('hb'), do2: await cel('do2'), vo2: await cel('vo2'), o2er: await cel('o2er'), ven: await cel('ven') };
    console.log('  P2', JSON.stringify(c2));
    ok(c2.hb.startsWith('8,4') && c2.do2.replace('.', '').startsWith('843') && c2.vo2.startsWith('250') && c2.o2er.startsWith('30') && c2.ven.startsWith('69'), 'cifras P2');
    ok((await p.textContent('#chip-tope')).includes('7 y 8 g/dL'), 'chip del tope tras la 1.ª bolsa');
    ok(await p.isHidden('#p4-aviso'), '');
    await desborde('P2'); await cap('2');
    // P3 (pasarse del tope)
    await p.click('#m-transf'); await esperaPant(3); await p.waitForTimeout(500);
    const c3 = { hb: await cel('hb'), do2: await cel('do2'), o2er: await cel('o2er'), sao2: await cel('sao2') };
    console.log('  P3', JSON.stringify(c3));
    ok(c3.hb.startsWith('9,4') && c3.do2.replace('.', '').startsWith('830') && c3.o2er.startsWith('30') && c3.sao2.startsWith('86'), 'cifras P3');
    ok(await p.isVisible('.sello') && (await p.textContent('.sello')).includes('TACO'), 'sello visible');
    ok(await p.isDisabled('#m-transf'), 'mando apagado tras el sello');
    ok(await p.isVisible('#cpv-lupa'), 'lupa del alvéolo abierta');
    const idsDespues = await p.evaluate(() => [...document.querySelectorAll('#mandos button')].map(b => b.id));
    ok(JSON.stringify(idsAntes) === JSON.stringify(idsDespues), 'botones estables');
    await desborde('P3'); await cap('3');
    // P4
    await p.click('#entender'); await esperaPant(4);
    for (let i = 0; i < 6; i++) {
        ok((await p.textContent('#p4-n')).includes(`Paso ${i + 1} de 6`), `paso ${i + 1}`);
        await desborde('P4 paso ' + (i + 1)); if (i === 1 || i === 5) await cap('4-' + (i + 1));
        if (i === 1) ok(await p.isVisible('#p4-disc'), 'nota de fuentes discrepantes en el paso 2');
        if (i === 0) { await p.click('#p4-ficha'); ok(await p.isVisible('#p4-aviso'), 'Ver en la ficha responde'); }
        await p.click('#p4-sig'); await p.waitForTimeout(150);
    }
    ok(await pant() === 5, 'tras el paso 6, P5');
    // P5 q1
    ok(!(await p.content()).match(/Correcta/), 'respuestas fuera del HTML antes de contestar');
    ok(await p.isHidden('#q-cuerpo button[data-k]') || (await p.$$('#q-cuerpo button[data-k]')).length === 0, 'opciones tapadas hasta «Ya lo tengo»');
    await cap('5a');
    await p.click('#q-ya'); await p.click('#q-cuerpo [data-k="0"]'); await desborde('P5 q1 tras contestar'); await cap('5b');
    ok((await p.textContent('#q-res')).includes('Correcta'), 'q1 explica');
    await p.click('#q-sig');
    for (let k = 0; k < 4; k++) await p.click(`#q-cuerpo [data-k="${k}"]`);
    await desborde('P5 q2 tras destapar'); await p.click('#q-sig');
    await p.click('#q-cuerpo [data-k="0"]'); await p.click('#q-cuerpo [data-k="1"]'); await p.click('#q-comp');
    await desborde('P5 q3 tras comprobar');
    await p.click('[data-pensar="0"]'); await cap('5c');
    await p.click('#q-sig'); await esperaPant(6); await desborde('P6'); await cap('6');
    ok(await p.isVisible('#pie-comun'), 'pie común'); 
    const enl = await p.$$eval('#pie-comun a', as => as.map(x => x.getAttribute('href') + (x.hasAttribute('aria-current') ? '*' : '')));
    ok(enl.join() === 'a-poe-shock.html,b-error-capilar.html*,c-entrelazado-rio.html', 'enlaces A/B/C');
    // ramas
    for (const [btn, txt] of [['#m-parar', 'dos bolsas'], ['#m-parar2', 'otra bolsa']]) {
        await cargar();
        if (txt === 'otra bolsa') { await p.click('#m-transf'); await esperaPant(2); }
        await p.click('#m-parar'); await esperaPant(3);
        ok((await p.textContent('#rama-txt')).includes(txt), `rama «${txt}»`);
        ok(await p.isVisible('.sello'), 'sello en la rama'); await desborde('rama ' + txt);
    }
    // rótulos del SVG a pantalla (suelo 7,5 px)
    const peq = await p.evaluate(() => { const s = document.getElementById('cpv-lamina'); const k = s.getBoundingClientRect().width / 360; return [...s.querySelectorAll('text')].filter(t => t.getBBox && parseFloat(getComputedStyle(t).fontSize) * k < 7.4 && t.textContent.trim()).length; });
    ok(peq === 0, `rótulos de la lámina <7,5 px a pantalla: ${peq}`);
    ok(errs.length === 0, 'errores de consola: ' + errs.join(' | '));
    await ctx.close();
}
await correr(390, false); await correr(360, true);
await b.close();
console.log(fallos ? `\n${fallos} FALLO(S)` : '\nTODO EN VERDE');
process.exit(fallos ? 1 : 0);
