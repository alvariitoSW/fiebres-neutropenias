// Tabla de letras SCAI de la función pura (sin navegador). Uso: node autonomo/pruebas/scai-puro.mjs
import { estadioScai } from '../../js/modules/libros/shock-vivo/scai.mjs';
const T = [
  ['sin tratar, lactato 1,0, PAM 85', { pam: 85 }, {}, { lact: 1 }, 'A'],
  ['sin tratar, lactato 1,4, PAM 58', { pam: 58 }, {}, { lact: 1.4 }, 'B'],
  ['sin tratar, lactato 5,4', { pam: 64 }, {}, { lact: 5.4 }, 'C'],
  ['dobutamina, lactato 3,4 baja (5 h)', { pam: 75 }, { dobuta: true }, { lact: 3.4, horas: 5, baja: true }, 'C'],
  ['dobutamina, lactato 3 sin bajar (5 h)', { pam: 75 }, { dobuta: true }, { lact: 3, horas: 5, baja: false }, 'D'],
  ['dobutamina, lactato 1,0 (respondido)', { pam: 85 }, { dobuta: true }, { lact: 1 }, 'C'],
  ['NA + dobuta + ECMO recién puestos, lactato 5,4', { pam: 70 }, { na: 5, dobuta: true, soporte: 'ecmo' }, { lact: 5.4, horas: 0, baja: false }, 'D'],
  ['NA + dobuta + ECMO, 5 h, lactato persiste', { pam: 70 }, { na: 5, dobuta: true, soporte: 'ecmo' }, { lact: 5.4, horas: 5, baja: false }, 'E'],
  ['NA + dobuta + ECMO, 5 h, lactato baja', { pam: 70 }, { na: 5, dobuta: true, soporte: 'ecmo' }, { lact: 4, horas: 5, baja: true }, 'C'],
  ['parada', { pam: 0 }, {}, { lact: 8 }, 'E', true],
];
let mal = 0;
for (const [t, R, a, lab, esp, par] of T) { const r = estadioScai(R, a, lab, par); const ok = r.letra === esp; if (!ok) mal++; console.log(ok ? 'OK ' : 'MAL', t, '→', r.letra, '·', r.nombre); }
const c = estadioScai({ pam: 85 }, { dobuta: true }, { lact: 1 }); if (/Clásico/.test(c.nombre)) { mal++; console.log('MAL: «Clásico» en C tras responder'); }
process.exit(mal ? 1 : 0);
