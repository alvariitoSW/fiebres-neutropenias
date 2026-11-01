// Barrido de extremos de cpap-eap (CPAP, Pmus, PS). Uso: node cpap-barrido.mjs http://localhost:PUERTO/
// (derivado de profesor-g2-cifras.mjs; cifras leídas del monitor de la app a 390 px)
// Profesor G2: cifras del monitor del pulmón vivo en los estados que abren los «Compruébalo» de las fichas 10-11 y 3
// (cpap-eap con CPAP 0/5/10, psv-disparo, vpp-corazon-normal con PEEP 4/12/20). Uso: node profesor-g2-cifras.mjs http://localhost:PUERTO/
import { chromium, devices } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const BASE = process.argv[2].replace(/\/?$/, '/');
const b = await chromium.launch();
const p = await (await b.newContext({ ...devices['iPhone 12'], viewport: { width: 390, height: 844 }, hasTouch: true, isMobile: true })).newPage();
const err = []; p.on('pageerror', e => err.push(e.message));
await p.goto(BASE, { waitUntil: 'networkidle' }); await p.waitForTimeout(800);
const abrir = estado => p.evaluate(e => { const x = document.createElement('button'); x.dataset.especialidad = 'libros'; x.dataset.view = 'pulmonVivo'; x.dataset.pulmonVivo = e; document.body.append(x); x.click(); x.remove(); }, estado);
const leer = () => p.evaluate(() => { window.__pulPruebas?.().llenar?.(); const f = {}; for (const e of document.querySelectorAll('.pul-raiz [data-fila]')) f[e.dataset.fila] = (e.querySelector('.v, .g')?.textContent.trim() || ''); const m = {}; for (const i of document.querySelectorAll('#pul-dock-panel input[type=range]')) m[i.dataset.m] = i.value; return { frase: document.getElementById('pul-frase-txt')?.textContent.trim().slice(0, 120), f: `pico ${f.pico} · PEEPtot ${f.peeptot} · Pmedia ${f.pmedia} · FR ${f.fr} · Vt ${f.vt} · VM ${f.vm} · I:E ${f.ie} · flujo fin ${f.flujofin} · VS ${f['cor-vs']} · GC ${f['cor-gc']} · PAM ${f['cor-pam']} · Ppl ${f['cor-pm']}`, mandos: Object.entries(m).map(([k, v]) => k + '=' + v).join(' ') }; });
const mando = async (k, v) => { await p.evaluate(() => { if (!document.querySelector('#pul-dock-panel input[data-m]')) [...document.querySelectorAll('button, summary, [role=button]')].find(b => /MANDOS/.test(b.textContent) && b.offsetParent)?.click(); }); await p.waitForTimeout(400); await p.evaluate(([k, v]) => { const i = document.querySelector(`#pul-dock-panel input[data-m="${k}"]`); if (!i) throw new Error('no hay mando ' + k); i.value = v; i.dispatchEvent(new Event('input', { bubbles: true })); i.dispatchEvent(new Event('change', { bubbles: true })); }, [k, v]); await p.waitForTimeout(4500); };
for (const [estado, pasos] of [['cpap-eap', [['peep', 0], ['peep', 5], ['peep', 10], ['pmus', 0], ['pmus', 5.5], ['pmus', 11], ['pmus', 15], ['pmus', 5.5], ['ps', 0], ['ps', 5], ['ps', 10], ['ps', 20]]]]) {
  await abrir(estado); await p.waitForTimeout(2500);
  const r0 = await leer(); console.log(`\n== ${estado} == mandos: ${r0.mandos}\n  inicio: ${r0.f}`);
  for (const [k, v] of pasos) { try { await mando(k, v); const r = await leer(); console.log(`  ${k}=${v}: ${r.f}`); } catch (e) { console.log(`  ${k}=${v}: ${e.message.slice(0, 80)}`); } }
}
console.log('\nerrores:', JSON.stringify(err.slice(0, 3)));
await b.close();
