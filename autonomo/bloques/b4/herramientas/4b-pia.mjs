// Barrido del estado `pia` del glomérulo vivo: carga la función modelo() real del archivo (sin DOM).
import fs from 'node:fs';
const src = fs.readFileSync(new URL('../../../../js/modules/nefrologia/glomerulo-vivo.js', import.meta.url), 'utf8');
const ini = src.indexOf('function modelo(e)'), fin = src.indexOf('function camino');
const PVC_CONGESTION = +/PVC_CONGESTION = (\d+)/.exec(src)[1];
const clamp = (v, a, b) => Math.min(b, Math.max(a, v));
const modelo = new Function('clamp', 'PVC_CONGESTION', src.slice(ini, fin) + '; return modelo;')(clamp, PVC_CONGESTION);
const base = { ieca: false, isglt2: false, deplecion: false, aine: false, estenosis: false, obstruccion: false, obstruccionMantenida: false, albuminuria: false, congestion: false };
console.log('PAM PIA | PPA(PAM-PIA) grad(PAM-2PIA) | TFG ml/min (125 normal)');
let mal = 0;
for (const pam of [60, 80, 100]) {
    let prev = Infinity;
    for (const pia of [0, 7, 12, 20, 30, 40]) {
        const M = modelo({ ...base, pam, pia });
        const ppa = pam - pia, grad = pam - 2 * pia;
        console.log(`${String(pam).padStart(3)} ${String(pia).padStart(3)} | ${String(ppa).padStart(4)} ${String(grad).padStart(4)} | ${M.tfg.toFixed(0).padStart(4)}`);
        if (M.tfg > prev + 1e-9) { mal++; console.log('  !! sube con la PIA'); }
        prev = M.tfg;
    }
    const a = modelo({ ...base, pam, pia: 0 }), b = modelo({ ...base, pam });
    if (a.tfg !== b.tfg) { mal++; console.log('  !! PIA 0 distinta de hoy'); }
}
// el doble de peso: subir la PIA 10 resta más TFG que bajar la PAM 10 (PAM 100)
const t = (pam, pia) => modelo({ ...base, pam, pia }).tfg;
console.log('PAM100: PIA 0->10 =', (t(100, 0) - t(100, 10)).toFixed(0), '| PAM 100->90 =', (t(100, 0) - t(90, 0)).toFixed(0));
console.log(mal ? 'FALLA' : 'OK: monótono y PIA 0 = hoy');
process.exit(mal ? 1 : 0);
