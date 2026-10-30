// Prueba (node, sin navegador) de las reglas puras del repaso espaciado de js/core/mayeutica-motor.js.
import assert from 'node:assert/strict';
const store = {};
globalThis.localStorage = { getItem: k => store[k] ?? null, setItem: (k, v) => { store[k] = v; }, removeItem: k => { delete store[k]; } };
globalThis.window = globalThis.window || {}; globalThis.matchMedia = () => ({ matches: false });
const M = await import('../../js/core/mayeutica-motor.js');
const { hoyLocal, diasEntre, intervalo, toca, firme, chipDiasAtras, lineaVuelve, elegirDiasAtras, crearGuardado, sumarDias } = M;
const a = (aciertos, fallos, ultimo, extra = {}) => ({ aciertos, fallos, ultimo, repasar: false, ...extra });

// Día local, no UTC: 23:30 local sigue siendo el mismo día aunque en UTC sea el siguiente.
assert.equal(hoyLocal(new Date(2026, 9, 30, 23, 30)), '2026-10-30');
assert.equal(hoyLocal(new Date(2026, 9, 31, 0, 5)), '2026-10-31');
assert.equal(diasEntre('2026-10-28', '2026-10-30'), 2);
assert.equal(diasEntre('2026-03-28', '2026-03-30'), 2);   // cambio de hora
assert.equal(sumarDias('2026-10-31', 1), '2026-11-01');

// Intervalos
assert.equal(intervalo(a(0, 1, 'x', { repasar: true })), 1);
assert.equal(intervalo(a(1, 0)), 3); assert.equal(intervalo(a(1, 1)), 3);
assert.equal(intervalo(a(2, 0)), 7); assert.equal(intervalo(a(3, 0)), 14); assert.equal(intervalo(a(9, 0)), 14);

// Toca
assert.ok(toca(a(1, 0, '2026-10-27'), '2026-10-30'));
assert.ok(!toca(a(1, 0, '2026-10-28'), '2026-10-30'));
assert.ok(!toca(a(0, 1, '2026-10-30', { repasar: true }), '2026-10-30'));   // contestada hoy
assert.ok(toca(a(0, 1, '2026-10-29', { repasar: true }), '2026-10-30'));
assert.ok(!toca({ aciertos: 1, fallos: 0, resultado: 'on' }, '2030-01-01'));   // sin fecha, nunca
assert.ok(!toca(undefined, '2026-10-30'));

// Firme
assert.ok(!firme({ dias: 1 })); assert.ok(firme({ dias: 2 })); assert.ok(!firme(undefined));

// Textos
assert.equal(chipDiasAtras(a(0, 1, '2026-10-28', { repasar: true }), '2026-10-30'), 'Fallada hace 2 días');
assert.equal(chipDiasAtras(a(2, 0, '2026-10-22'), '2026-10-30'), 'Acertada hace 8 días · tocaba a los 7');
assert.equal(lineaVuelve(a(0, 1, 'x', { repasar: true })), 'Vuelve mañana: fallada');
assert.equal(lineaVuelve(a(1, 0, 'x')), 'Vuelve en 3 días: la acertaste una vez');
assert.equal(lineaVuelve(a(2, 0, 'x')), 'Vuelve en 7 días: la acertaste dos veces');
assert.equal(lineaVuelve(a(3, 0, 'x')), 'Vuelve en 14 días: la acertaste tres veces o más');

// Elegir: falladas antes, más antigua primero, sin hermanas seguidas, máx 5, sin fecha nunca
const H = '2026-10-30';
const it = (id, ficha, x) => ({ q: { id }, ficha, a: x });
const lista = [
  it('a1', 'A', a(1, 0, '2026-10-20')), it('b1', 'B', a(0, 1, '2026-10-28', { repasar: true })),
  it('b2', 'B', a(0, 1, '2026-10-25', { repasar: true })), it('c1', 'C', a(1, 0, '2026-10-26')),
  it('d1', 'D', { aciertos: 1, fallos: 0 }), it('e1', 'A', a(1, 0, '2026-10-29')),
  it('f1', 'F', a(1, 0, '2026-10-10')), it('g1', 'G', a(1, 0, '2026-10-15')), it('h1', 'H', a(1, 0, '2026-10-16')),
];
const r = elegirDiasAtras(lista, { hoy: H, max: 5 });
assert.ok(r.length <= 5 && r.length === 5);
assert.equal(r[0].q.id, 'b2');                        // fallada más antigua
for (let i = 1; i < r.length; i++) assert.notEqual(r[i].ficha, r[i - 1].ficha);
assert.ok(!r.some(x => x.q.id === 'd1' || x.q.id === 'e1'));
assert.equal(r[1].q.id === 'b1', false);              // b1 es hermana de b2: no va seguida
const corta = elegirDiasAtras([it('x1', 'X', a(0, 1, '2026-10-20', { repasar: true })), it('x2', 'X', a(0, 1, '2026-10-21', { repasar: true }))], { hoy: H });
assert.equal(corta.length, 1);                        // si no se puede, se queda corta
assert.equal(elegirDiasAtras([it('s', 'S', { aciertos: 0, fallos: 1, repasar: true })], { hoy: H }).length, 0);

// Guardado: ultimo = hoy local, dias solo +1 por día, registro viejo se lee igual
store.k = JSON.stringify({ viejo: { aciertos: 1, fallos: 0, resultado: 'on' } });
const g = crearGuardado('k'), hoy = hoyLocal();
g.guardar('n', true); g.guardar('n', true); g.guardar('n', false, { fallo: { faltan: [] } });
let n = g.leer().n;
assert.equal(n.ultimo, hoy); assert.equal(n.dias, 1); assert.equal(n.diaOk, hoy); assert.equal(n.aciertos, 2);
n.diaOk = '2026-01-01'; n.dias = 1; store.k = JSON.stringify({ ...g.leer(), n });
g.guardar('n', true);
assert.equal(g.leer().n.dias, 2); assert.equal(g.leer().n.diaOk, hoy);
assert.equal(g.leer().viejo.ultimo, undefined);
// Progreso.firmes
const P = new M.Progreso('k', [{ id: 'n', grupo: 'guia' }, { id: 'viejo', grupo: 'examen' }, { id: 'x' }]);
assert.deepEqual(P.firmes(), { n: 1, total: 3, manana: 0 });
console.log('mayeutica-memoria: todo en verde');
