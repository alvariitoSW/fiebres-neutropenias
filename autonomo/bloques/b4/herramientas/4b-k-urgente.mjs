// Barrido de extremos del estado k-urgente del filtro vivo (REGLAS §4.16). Uso: node autonomo/bloques/b4/herramientas/4b-k-urgente.mjs
// Importa el modelo real (filtro-vivo-k.js). Sale con 1 si algo es negativo, baja de 3,5 o sube con el tiempo.
import { kEsperado, K_SUELO } from '../../../../js/modules/nefrologia/filtro-vivo-k.js';
let mal = 0;
for (const modo of ['hd', 'hf', 'hib']) for (const k0 of [5.5, 7, 8.5]) {
    const f = [0, 1, 2, 3, 4].map(h => kEsperado(k0, h, modo));
    const ok = f.every((v, i) => v >= K_SUELO && v >= 0 && (i === 0 || v <= f[i - 1])) && f[0] === k0;
    if (!ok) mal++;
    console.log(`${modo.padEnd(3)} K0 ${String(k0).padEnd(3)} → ${f.join(' / ')} ${ok ? 'ok' : 'MAL'}`);
}
process.exit(mal ? 1 : 0);
