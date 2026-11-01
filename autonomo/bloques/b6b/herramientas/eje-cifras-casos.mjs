// Imprime lo que el modelo del eje enseña (leer) en cada apuesta y en cada paso de los casos, para cotejar con el texto.
import { nuevo, leer } from '../../../../js/modules/libros/eje-vivo/modelo.js';
import { APUESTAS, CASOS } from '../../../../js/data/eje-vivo-pruebas.js';
const f = (L, s) => `PA ${L.pas}/${L.pad} PAM ${L.pam} FC ${L.fc} T ${L.t} Na ${L.na} lac ${L.lact} NA ${s.na} vol ${s.vol} dia ${s.dia}`;
for (const A of APUESTAS) { const s = nuevo(A.p); console.log('apuesta', A.p, f(leer(s), s)); const s2 = { ...s, ...A.fin }; console.log('  tras', f(leer(s2), s2)); }
for (const C of CASOS) C.pasos.forEach((p, i) => { const s = { ...nuevo(C.pac), ...p.e }; console.log(C.pac, i + 1, f(leer(s), s)); });
