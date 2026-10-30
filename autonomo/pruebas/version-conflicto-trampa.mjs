// Prueba trampa de la regla del 30/10/2026: autonomo/version.mjs falla si queda una marca de conflicto de git.
// Escribe a propósito un archivo con marcas, comprueba que comprobar() lo caza y lo borra.
//   node autonomo/pruebas/version-conflicto-trampa.mjs      sale con 0 si la trampa se caza
import { writeFileSync, rmSync } from 'node:fs';
import { resolve, dirname } from 'node:path';
import { comprobar } from '../version.mjs';

const TRAMPA = resolve(dirname(new URL(import.meta.url).pathname), 'zz-trampa-conflicto.md');
let cazada = false;
try {
    writeFileSync(TRAMPA, 'antes\n<<<<<<< HEAD\nuna\n=======\notra\n>>>>>>> origin/main\n');
    cazada = comprobar().fallos.some(f => f.includes('marcas de conflicto') && f.includes('zz-trampa-conflicto.md'));
} finally {
    rmSync(TRAMPA, { force: true });
}
const limpio = !comprobar().fallos.some(f => f.includes('marcas de conflicto'));
console.log(`${cazada ? '✅' : '❌'} con marcas: version.mjs falla\n${limpio ? '✅' : '❌'} sin marcas: no da ese fallo`);
process.exit(cazada && limpio ? 0 : 1);
