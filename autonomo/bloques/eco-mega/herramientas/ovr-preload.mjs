// Precarga para barridos: ECO_OVR='{"ai.ees":0.5,"rVp":0.02}' cambia BASE antes de las pruebas
import { BASE } from '../../../../js/modules/eco/motor.mjs';
for (const [k, v] of Object.entries(JSON.parse(process.env.ECO_OVR || '{}'))) { const r = k.split('.'); let o = BASE; while (r.length > 1) o = o[r.shift()]; o[r[0]] = v; }
