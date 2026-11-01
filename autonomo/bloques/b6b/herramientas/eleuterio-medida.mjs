// Mide el preset de Eleuterio en el modelo: hepatocitos, West Haven, sellos. Uso: node eleuterio-medida.mjs
import { PRESETS } from '../../../../js/data/hepatocito-vivo-data.js';
import { funcDe, westHaven, topesTx, amonio } from '../../../../js/modules/libros/hepatocito-vivo/modelo.js';
const s = { ...PRESETS.eleuterio.s };
console.log('func(modelo)=', funcDe(s), 'func preset=', s.func, 'WH=', westHaven(s), 'par=', s.par, 'h=', s.h, 'dosis=', s.dosis);
console.log(topesTx(s).map((t) => t.c + ':' + t.titulo));
