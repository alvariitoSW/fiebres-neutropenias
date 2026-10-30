// node --test autonomo/pruebas/raiz-aortica-z.test.mjs
import test from 'node:test';
import assert from 'node:assert/strict';
import { readFileSync } from 'node:fs';
import { zLang, avisoLang, zDevereux, esperadoDevereux, avisosDevereux, gradoDevereux } from '../../js/modules/eco/raiz-aortica.js';
import { NIVELES_RAIZ } from '../../js/data/raiz-aortica-data.js';
const cerca = (a, b, t = 1e-9) => assert.ok(Math.abs(a - b) < t, `${a} != ${b}`);

test('Lang: senos hombre 4,0 cm → z 2,0 ((4,0−3,4)/0,3)', () => cerca(zLang('senos', 'H', 4.0), 2.0, 1e-9));
test('Lang: anillo mujer 2,7 cm → z 2,0 ((2,7−2,3)/0,2)', () => cerca(zLang('anillo', 'M', 2.7), 2.0, 1e-9));
test('Lang indexado: senos mujer 1,4 cm/m² → z −2,0 ((1,4−1,8)/0,2)', () => cerca(zLang('senos', 'M', 1.4, true), -2.0, 1e-9));
test('Lang: ascendente hombre media → z 0', () => assert.equal(zLang('asc', 'H', 3.0), 0));
test('campos vacíos o inválidos no son 0', () => {
    assert.equal(zLang('senos', 'H', ''), null); assert.equal(zLang('senos', 'H', null), null);
    assert.equal(zLang('senos', '', 3.4), null); assert.equal(zLang('xx', 'H', 3.4), null);
    assert.equal(zLang('senos', 'H', 0), null); assert.equal(zLang('senos', 'H', 'abc'), null);
});
test('fuera de rango avisa', () => { assert.ok(avisoLang(12)); assert.ok(avisoLang(0.1)); assert.equal(avisoLang(3.4), null); assert.equal(avisoLang(''), null); assert.ok(avisoLang(9, true)); });
// A mano: hombre, 40 años, SC 1,9: 2,423 + 0,009·40 + 0,461·1,9 − 0,267·1 = 2,423 + 0,36 + 0,8759 − 0,267 = 3,3919 cm
test('Devereux esperado a mano', () => cerca(esperadoDevereux(40, 1.9, 'H'), 3.3919, 1e-9));
// z con 3,5 cm: (3,5 − 3,3919)/0,261 = 0,4142
test('Devereux z hombre 40 a 1,9 m² 3,5 cm', () => cerca(zDevereux(3.5, 40, 1.9, 'H'), 0.1081 / 0.261, 1e-9));
// A mano: mujer, 30 años, SC 1,6: 2,423 + 0,27 + 0,7376 − 0,534 = 2,8966; z de 3,6 = 0,7034/0,261 = 2,695
test('Devereux z mujer 30 a 1,6 m² 3,6 cm', () => cerca(zDevereux(3.6, 30, 1.6, 'M'), 0.7034 / 0.261, 1e-9));
test('Devereux: vacío, <15 años y fuera de validación', () => {
    assert.equal(zDevereux('', 40, 1.9, 'H'), null); assert.equal(zDevereux(3.5, '', 1.9, 'H'), null);
    assert.equal(zDevereux(3.5, 14, 1.9, 'H'), null); assert.equal(zDevereux(3.5, 40, 1.9, ''), null);
    assert.ok(avisosDevereux(4.8, 40, 1.9).length); assert.ok(avisosDevereux(3.5, 12, 1.9).length); assert.equal(avisosDevereux(3.5, 40, 1.9).length, 0);
});
test('grado de Devereux compara la z sin redondear', () => {
    assert.equal(gradoDevereux(1.97), 'leve'); assert.equal(gradoDevereux(1.95), null); assert.equal(gradoDevereux(1.96), null); assert.equal(gradoDevereux(3.0), 'leve'); assert.equal(gradoDevereux(3.04), 'moderada'); assert.equal(gradoDevereux(4.01), 'grave');
    assert.equal(gradoDevereux(3.5), 'moderada'); assert.equal(gradoDevereux(4.5), 'grave');
});
test('la tabla del HTML coincide con los datos de la Tabla 14', () => {
    const html = readFileSync(new URL('../../js/modules/eco/eco.html', import.meta.url), 'utf8');
    const t = html.match(/id="eco-med-tabla-14"[\s\S]*?<\/table>/)[0];
    const c = (x) => x.toFixed(1).replace('.', ',');
    for (const n of NIVELES_RAIZ) {
        const fila = t.match(new RegExp(`<tr data-nivel="${n.id}">[\\s\\S]*?</tr>`))[0];
        const esperado = [n.abs.H, n.abs.M, n.idx.H, n.idx.M].map(([m, d]) => `${c(m)} ± ${c(d)}`);
        const celdas = [...fila.matchAll(/<td>(?:<strong>)?([^<]*)(?:<\/strong>)?<\/td>/g)].map(m => m[1]);
        assert.deepEqual(celdas.slice(1), esperado, n.id);
    }
});
