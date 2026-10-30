// Prueba de node puro: toda celda de la tabla arteria-ECG-pared-complicación tiene fuente y página/apartado o href.
// Uso: node autonomo/pruebas/sca-territorios.mjs
import { scaTerritorios, scaColumnas, scaNotas, damlujiRef } from '../../js/data/sca-territorios.js';
let fallos = 0;
const mal = m => { console.log('FALLO', m); fallos++; };
if (scaTerritorios.length !== 6) mal(`filas: ${scaTerritorios.length}`);
for (const t of scaTerritorios) for (const c of scaColumnas) {
    const celda = t[c.clave];
    if (!Array.isArray(celda) || !celda.length) { mal(`${t.id}/${c.clave}: celda vacía`); continue; }
    celda.forEach((it, i) => {
        const ref = `${t.id}/${c.clave}[${i}]`;
        if (!it.texto) mal(`${ref}: sin texto`);
        if (it.hueco) { if (!it.buscado) mal(`${ref}: hueco sin «buscado»`); return; }
        if (!it.fuente) mal(`${ref}: sin fuente`);
        if (!(it.pagina || it.apartado)) mal(`${ref}: sin página/apartado`);
        if (!it.href) mal(`${ref}: sin href`);
        if (/ y .*según|;.*Wagner.*López|López.*Wagner/.test(it.texto) && it.fuente !== 'López Ramírez 2012') mal(`${ref}: posible mezcla de autores`);
    });
}
if (!scaNotas.length || !damlujiRef.href) mal('faltan notas o referencia de Damluji');
console.log(fallos ? `${fallos} fallos` : 'OK: 6 filas, todas las celdas con fuente y página/apartado o hueco explícito');
process.exit(fallos ? 1 : 0);
