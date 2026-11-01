import * as S from '../../../../js/modules/libros/shock-vivo/soporte.mjs';
const cab = S.crearCabecera({ esc: 'normal', hb: 14 });
for (const pl of [0, 3, 6, 9, 10.5, 12, 13.5, 20, 40]) { cab.ajustar({ cpap: 8, pleura: pl }); cab.correr(30); const L = cab.lectura; console.log(pl, JSON.stringify({ pam: L.u.pam, vs: L.u.vs, gc: L.gcTotal, fc: L.u.fc, keys: pl === 0 ? Object.keys(L.u) : undefined })); }
