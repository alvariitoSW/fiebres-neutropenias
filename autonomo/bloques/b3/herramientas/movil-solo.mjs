// Solo el juez Móvil de un modelo (para reproducir un fallo sin pasar toda la suite). Uso: node movil-solo.mjs <puerto> <modelo> [ancho]
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { juzgarMovil } from '../../../jueces-movil.mjs';
const [puerto, modelo = 'shock-vivo', ancho] = process.argv.slice(2);
const nav = await chromium.launch();
await juzgarMovil({ nav, base: `http://localhost:${puerto}/index.html`, ok: (m) => console.log('OK', m), mal: (m) => console.log('MAL', m), modelos: [modelo], anchos: ancho ? [+ancho] : [390, 360] });
await nav.close();
