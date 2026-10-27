import { chromium } from '/opt/node22/lib/node_modules/playwright/index.mjs';
const { barajar } = await import('/home/user/fiebres-neutropenias/js/core/mayeutica-motor.js');
const { CASOS } = await import('/home/user/fiebres-neutropenias/js/data/shock-vivo-mayeutica.js');
const BASE='http://localhost:8872/', DIR=process.argv[2], Z='#shv-zona-may';
const b=await chromium.launch(); const p=await (await b.newContext({viewport:{width:390,height:844},deviceScaleFactor:2})).newPage();
await p.goto(BASE,{waitUntil:'networkidle'});
const abrir=k=>p.evaluate(k=>{const t=document.createElement('button');Object.assign(t.dataset,{especialidad:'libros',view:'shockVivo',shockVivo:k});document.body.append(t);t.click();t.remove();},k);
const clic=s=>p.evaluate(s=>{const e=document.querySelector(s); if(!e) throw new Error('no '+s); e.click();},s);
const txt=s=>p.evaluate(s=>document.querySelector(s)?.innerText.replace(/\s+/g,' ').trim(),s);
const est=()=>p.evaluate(()=>{const c=window.__shvPruebas(); return {pac:c.est.pac.k, ap:c.est.aparato, h:c.est.horas, cab:document.querySelector('#shv-monitor .mon-tit, #shv-mon-tit')?.textContent?.trim()||document.querySelector('#shv-monitor')?.innerText.split('\n')[0]};});
await abrir('hemo'); await p.waitForTimeout(1200); await clic('#shv-modo-may'); await p.waitForTimeout(500);
console.log('inicio may:', (await txt(Z))?.slice(0,400));
await clic(`${Z} [data-ir="casos"]`); await p.waitForTimeout(300); await clic(`${Z} [data-caso="0"]`); await p.waitForTimeout(700);
const pasos=CASOS[0].pasos;
for (let k=0;k<pasos.length;k++){
  const q=pasos[k].pregunta; console.log(`paso ${k+1} [${q.tipo}]`, JSON.stringify(await est()), '| velo:', await p.evaluate(()=>!!document.querySelector('#shv-velo-mon:not([hidden])')));
  if(q.tipo==='test'){ await clic(`${Z} [data-accion="ops"]`); await p.waitForTimeout(150); const o=barajar(q.opciones,q.id); await clic(`${Z} [data-op="${o.findIndex(x=>x.ok)}"]`); }
  else if(q.tipo==='destapa'){ await clic(`${Z} [data-accion="destapa"]`); await p.waitForTimeout(150); await p.evaluate(Z=>document.querySelectorAll(Z+' input[data-p]').forEach(x=>x.checked=true),Z); await clic(`${Z} [data-accion="puntos"]`); }
  else { if(k===4){ await p.evaluate(Z=>document.querySelector(Z+' .shv-pregunta, '+Z).scrollIntoView(),Z); await p.waitForTimeout(300); await p.screenshot({path:DIR+'x-caso5-error.png'}); console.log('C5 texto:', (await txt(Z))?.slice(0,900)); }
    const malas=q.frases.map((x,i)=>x.mal?i:-1).filter(i=>i>=0); for(const i of malas) await clic(`${Z} [data-fr="${i}"]`); await clic(`${Z} [data-accion="corregir"]`); await p.waitForTimeout(200); for(const i of malas) await clic(`${Z} [data-ver="${i}"]`); }
  await p.waitForTimeout(300);
  if(q.comprobar){ await clic(`${Z} [data-comprueba]`); await p.waitForTimeout(600); if(k===6) console.log('C7 comprueba:', (await txt(Z+' dl.antes-despues'))?.slice(0,300), '| sellos:', await p.evaluate(()=>[...document.querySelectorAll('#shv-raiz [class*="tope-sello"]')].filter(e=>e.getClientRects().length).map(e=>e.textContent.replace(/\s+/g,' ').slice(0,50)))); }
  await clic(`${Z} [data-accion="sig"]`); await p.waitForTimeout(400);
}
console.log('FINAL:', JSON.stringify(await est()), '| volver:', await p.evaluate(Z=>[...document.querySelectorAll(Z+' button')].map(b=>b.textContent.trim()).filter(t=>/abrir|ficha|volver/i.test(t)).join(' | '),Z));
await b.close();
