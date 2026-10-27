// F3b: mide la AI del motor normal (40 s) con ajustes. Uso: node f3b-grid.mjs '[{"rVp":0.02,"ai":{"ees":0.3}}]'
import { crearMotor } from '../../../../js/modules/eco/motor.mjs';
export function med(aj){ const m=crearMotor(aj); m.correr(40); const o=m.onda, A=o.filter(x=>x.fase==='A'); const dt=o[1].t-o[0].t;
 const iAm=A.reduce((a,x,i)=>x.qVp<A[a].qVp?i:a,0);
 const S=Math.max(...A.slice(iAm).map(x=>x.qVp),...o.filter(x=>'BCDE'.includes(x.fase)).map(x=>x.qVp)), D=Math.max(...o.filter(x=>'FG'.includes(x.fase)).map(x=>x.qVp)), Ar=-Math.min(0,...A.map(x=>x.qVp));
 const bomba=A.reduce((a,x)=>a+Math.max(0,x.qMit)*dt,0), llen=o.reduce((a,x)=>a+Math.max(0,x.qMit)*dt,0);
 const E=Math.max(...o.filter(x=>'FG'.includes(x.fase)).map(x=>x.qMit)), Aq=Math.max(...A.map(x=>x.qMit));
 const pai=o.map(x=>x.pai), vai=o.map(x=>x.vai);
 return {bp:100*bomba/llen,EA:E/Aq,SD:S/D,S,D,Ar,vmin:Math.min(...vai),vmax:Math.max(...vai),gc:m.ultimo.gc,papd:m.ultimo.papd,pas:m.ultimo.pas,pvc:m.ultimo.pvc,pmax:Math.max(...pai),pmin:Math.min(...pai),pm:pai.reduce((a,b)=>a+b)/pai.length};}
const R=v=>JSON.stringify(v,(k,x)=>typeof x==='number'?+x.toFixed(2):x);
if (process.argv[2]) for (const aj of JSON.parse(process.argv[2])) console.log(R(aj),R(med(aj)));
