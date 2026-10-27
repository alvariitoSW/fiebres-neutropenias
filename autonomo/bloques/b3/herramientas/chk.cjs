const { chromium } = require('playwright');
(async()=>{const b=await chromium.launch();
for (const w of [390,360]) for (const m of ['b3-shock','b3-ritmo','b3-receptor','b3-pulmon']){
 const p=await b.newPage({viewport:{width:w,height:844},hasTouch:true,isMobile:true});const errs=[];
 p.on('pageerror',e=>errs.push(e.message));p.on('console',c=>{if(c.type()==='error')errs.push(c.text())});
 await p.goto(`http://localhost:${process.env.PUERTO||8790}/autonomo/maquetas/${m}.html`);await p.waitForTimeout(2500);
 const d=await p.evaluate(()=>document.documentElement.scrollWidth-innerWidth);
 console.log(w,m,'desborde',d,'errores',errs.length,errs.slice(0,2).join(' | '));await p.close();}
await b.close();})();
