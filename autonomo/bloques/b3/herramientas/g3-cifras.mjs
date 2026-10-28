const S = await import('/home/user/fiebres-neutropenias/js/modules/libros/shock-vivo/soporte.mjs');
function cifras(rec, tocar){ const c=S.crearCabecera(rec); if(tocar) tocar(c); c.correr(40); const L=c.lectura,u=L.u;
 const r=x=>typeof x==='number'?+x.toFixed(2):x;
 return JSON.stringify({pas:r(u.pas),pad:r(u.pad_),pam:r(u.pam),fc:r(u.fc),ic:r(L.icTotal),pcp:r(L.pcp),pvc:r(u.pvc),papd:r(u.papd),fevi:r(u.fe*100),qMitReg:r(c.m.s.qMitReg)}); }
console.log('esc cardio g.75 :', cifras({esc:'cardio',g:.75,hb:14}));
console.log('a fallo g.75    :', cifras({esc:'fallo',g:.75,hb:14}));
console.log('a2 fallo .75 viDiast.7 volem-1150:', cifras({esc:'fallo',g:.75,viDiast:.7,volemia:-1150,hb:14}));
console.log('b eroa .8      :', cifras({esc:'fallo',g:.75,eroaMitral:.8,hb:14}));
console.log('b2 + aurelio   :', cifras({esc:'fallo',g:.75,viDiast:.7,volemia:-1150,eroaMitral:.8,hb:14}));
console.log('normal         :', cifras({esc:'fallo',g:0,hb:14}));
for (const e of [0.3,0.2,0.12]) console.log('c VD ees',e,':', cifras({esc:'fallo',g:0,hb:14}, c=>{c.m.p.vd.ees=e;}));
for (const e of [0.2,0.12]) console.log('c2 VD ees',e,'+vol:', cifras({esc:'fallo',g:0,hb:14,volemia:600}, c=>{c.m.p.vd.ees=e;}));
console.log('c3 VD .15 + isq?', cifras({esc:'fallo',g:0,hb:14}, c=>{c.m.p.vd.ees=0.15; c.m.p.mioVd=0.3;}));
console.log('----');
for (const [e,v,x] of [[0.08,1500,0],[0.05,1500,0],[0.08,1500,1]]) console.log('VD',e,'vol',v,'rVd/rPul x',x, cifras({esc:'fallo',g:0,hb:14,volemia:v}, c=>{c.m.p.vd.ees=e; if(x){c.m.p.rPul*=2;}}));
console.log('vd.ees .1 + vi .4 g.2', cifras({esc:'fallo',g:.2,hb:14,volemia:800}, c=>{c.m.p.vd.ees=0.1;}));
