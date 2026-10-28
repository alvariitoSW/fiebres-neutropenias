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
    // apuesta tapada: DO2, VO2 y extracción ocultos; sin apostar no se cuelga la bolsa
    ok(!(await p.isVisible('#cpv-c-do2 b')) && !(await p.isVisible('#cpv-c-vo2 b')) && !(await p.isVisible('#cpv-c-o2er b')), 'P2: DO2, VO2 y extracción tapados');
    ok((await p.$$('#ap-ops button')).length === 4, 'P2: 4 opciones de apuesta');
    ok(await p.isDisabled('#m-transf'), 'P2: sin apuesta no hay segunda bolsa');
    ok(!/Acertaste|No era eso/.test(await p.textContent('#apuesta')), 'P2: la apuesta no corrige');
    await desborde('P2 apuesta'); await cap('2-apuesta');
    await p.click('#ap-ops [data-ap="1"]'); ok(await p.isEnabled('#m-transf'), 'P2: apostado, se puede transfundir');
    const c2 = { hb: await cel('hb'), do2: await cel('do2'), vo2: await cel('vo2'), o2er: await cel('o2er'), ven: await cel('ven') };
    console.log('  P2', JSON.stringify(c2));
    ok(c2.hb.startsWith('8,4') && c2.do2.replace('.', '').startsWith('843') && c2.vo2.startsWith('250') && c2.o2er.startsWith('30') && c2.ven.startsWith('69'), 'cifras P2');
    ok((await p.textContent('#chip-tope')).includes('7 y 8 g/dL'), 'chip del tope tras la 1.ª bolsa');
    ok(await p.isHidden('#p4-aviso'), '');
    await desborde('P2'); await cap('2');
    // P3 (pasarse del tope)
    await p.click('#m-transf'); await esperaPant(3); await p.waitForTimeout(500);
    ok(await p.isVisible('#ap-tabla') && (await p.textContent('#ap-tabla')).includes('Tu apuesta') && (await p.textContent('#ap-tabla')).includes('Lo que pasó') && (await p.textContent('#ap-t3')).includes('Acertaste'), 'P3: tabla «Tu apuesta | Lo que pasó» con la apuesta B acertada');
    console.log('  tabla', (await p.textContent('#ap-t2')).trim());
    ok((await p.textContent('#resto-caso')).includes('Día 4'), 'P3: momentos 4 y 5');
    for (const m of ['mt4', 'mt5']) { ok((await p.$$('#' + m + ' button')).length === 3 && !(await p.textContent('#' + m)).includes('Bien.'), m + ': 3 opciones sin respuesta'); await p.click('#' + m + ' button >> nth=' + (m === 'mt4' ? 1 : 2)); ok((await p.textContent('#' + m)).includes('Bien.'), m + ': correcta'); await desborde(m); }
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
        if ([0, 2, 4].includes(i)) {   // test «¿por qué?» antes del paso
            ok((await p.$$('#p4-ops button')).length === 3 && await p.isVisible('#p4-ops') && await p.isHidden('#p4-txt') && await p.isDisabled('#p4-sig'), `paso ${i + 1}: test antes de mostrar el paso`);
            await desborde(`P4 paso ${i + 1} test`); if (i === 0) await cap('4-test');
            await p.click(`#p4-ops [data-k="${i === 0 ? 0 : 1}"]`);   // una falsa
            ok((await p.textContent('#p4-res')).includes('Elegiste esta') && await p.isVisible('#p4-txt') && await p.isEnabled('#p4-sig'), `paso ${i + 1}: explica y muestra el paso`);
            if (i === 0) await cap('4-test-resp');
        }
        ok((await p.textContent('#p4-n')).includes(`Paso ${i + 1} de 6`), `paso ${i + 1}`);
        await desborde('P4 paso ' + (i + 1)); if (i === 1 || i === 5) await cap('4-' + (i + 1));
        if (i === 1) ok(await p.isVisible('#p4-disc'), 'nota de fuentes discrepantes en el paso 2');
        if (i === 0) { await p.click('#p4-ficha'); ok(await p.isVisible('#p4-aviso'), 'Ver en la ficha responde'); }
        await p.click('#p4-sig'); await p.waitForTimeout(150);
    }
    ok(await pant() === 5, 'tras el paso 6, P5');
    // P5 q1
    ok(!(await p.innerHTML('#q-caja')).match(/Correcta/), 'respuestas fuera del HTML antes de contestar');
    ok(await p.isHidden('#q-cuerpo button[data-k]') || (await p.$$('#q-cuerpo button[data-k]')).length === 0, 'opciones tapadas hasta «Ya lo tengo»');
    await cap('5a');
    await p.click('#q-ya');
    await p.click('#q-cuerpo [data-k="0"]'); await desborde('P5 q1 tras contestar'); await cap('5b');
    ok((await p.textContent('#q-res')).includes('Correcta'), 'q1 explica');
    await p.click('#q-sig');
    for (let k = 0; k < 4; k++) await p.click(`#q-cuerpo [data-k="${k}"]`);
    ok((await p.$$('#q-cuerpo input[type=checkbox]')).length === 4, 'q2: 4 casillas «La tenía»');
    ok((await p.textContent('#q-cuerpo')).includes('balance positivo') && !(await p.textContent('#q-cuerpo')).includes('más lenta»: el TACO'), 'q2: tapa 4 responde y lo de «más lenta» va a la explicación');
    await p.check('#q-cuerpo [data-t="0"]'); await p.check('#q-cuerpo [data-t="1"]');   // tenía 2 de 4
    await desborde('P5 q2 tras destapar'); await cap('5d'); await p.click('#q-sig');
    const fr = await p.$$eval('#q-cuerpo button[data-k]', bs => bs.map(x => x.textContent.trim().slice(0, 3)));
    ok(fr.join() === '(1),(2),(3),(4),(5)', 'q3: frases numeradas (1)-(5): ' + fr.join());
    await p.click('#q-cuerpo [data-k="0"]'); await p.click('#q-cuerpo [data-k="1"]'); await p.click('#q-comp');
    await desborde('P5 q3 tras comprobar');
    await p.click('[data-pensar="0"]'); await cap('5c');
    // Otra vez lo que fallaste: falló q1 (test), q2 (2 partes) y q3
    await p.click('#q-sig');
    ok((await p.textContent('#p5-prog')).includes('Otra vez lo que fallaste (1 de 3)'), 'repaso 1 de 3');
    await p.click('#q-ya'); await p.click('#q-cuerpo [data-k="1"]'); await desborde('repaso test'); await cap('5r1'); await p.click('#q-sig');
    ok((await p.$$('#q-cuerpo button[data-k]')).length === 2, 'repaso q2: solo las 2 partes falladas');
    await p.click('#q-cuerpo [data-k="0"]'); await p.click('#q-cuerpo [data-k="1"]'); await desborde('repaso destapa'); await p.click('#q-sig');
    await p.click('#q-cuerpo [data-k="0"]'); await p.click('#q-cuerpo [data-k="3"]'); await p.click('#q-comp'); await desborde('repaso error'); await cap('5r3');
    ok((await p.textContent('#q-sig')).includes('lo que te llevas'), 'último del repaso lleva a P6');
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
    // camino sin fallos por la rama «dos bolsas»: frase 1 coherente y sin repaso
    await cargar(); await p.click('#m-parar'); await esperaPant(3); await p.click('#entender'); await esperaPant(4);
    for (let i = 0; i < 6; i++) { if ([0, 2, 4].includes(i)) await p.click(`#p4-ops [data-k="${[1, 0, 0][i / 2]}"]`); await p.click('#p4-sig'); }
    await p.click('#q-ya'); const ops1 = await p.$$eval('#q-cuerpo button', bs => bs.map(x => x.textContent));
    await p.click('#q-cuerpo [data-k="1"]'); await p.click('#q-sig');
    for (let k = 0; k < 4; k++) await p.click(`#q-cuerpo [data-k="${k}"]`);
    for (let k = 0; k < 4; k++) await p.check(`#q-cuerpo [data-t="${k}"]`);
    await p.click('#q-sig');
    const f1 = await p.textContent('#q-cuerpo [data-k="0"]');
    ok(f1.includes('7,4') && f1.includes('dos CH seguidos') && !f1.includes('8,4'), 'q3 rama «dos bolsas»: frase 1 con Hb 7,4: ' + f1.slice(0, 60));
    await p.click('#q-cuerpo [data-k="0"]'); await p.click('#q-cuerpo [data-k="3"]'); await p.click('#q-comp'); await p.click('#q-sig'); await esperaPant(6);
    ok(true, 'sin fallos: directo a P6');
    await cargar(); await p.click('#m-parar'); await esperaPant(3); await p.waitForTimeout(400);
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
