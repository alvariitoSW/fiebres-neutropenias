// Solo el juez del móvil sobre el shock vivo. Uso: node movil-shock-vivo.mjs <url-base>   (p. ej. http://127.0.0.1:8831/)
import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
import { juzgarMovil } from '../../../jueces-movil.mjs';
const nav = await chromium.launch(); let n = 0;
await juzgarMovil({ nav, base: process.argv[2], ok: (t) => { n++; }, mal: (t, d) => console.log('❌', t, d ? JSON.stringify(d).slice(0, 300) : ''), fichas: [], modelos: ['shock-vivo'] });
console.log('ok:', n); await nav.close();
