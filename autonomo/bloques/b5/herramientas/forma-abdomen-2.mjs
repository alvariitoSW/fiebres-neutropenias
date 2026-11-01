import { juzgarFormaPreguntas } from '../../../jueces-forma.mjs';
await juzgarFormaPreguntas({ RAIZ: process.cwd(), ok: m => console.log('✅', m), mal: m => console.log('❌', m) });
