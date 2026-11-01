// Cada ministro, una persona: piel, pelo, peinado, traje y complementos
const P={
 gob:{piel:'#e0b58f',pelo:'#3b2a1c',peinado:'corto',traje:'#ece3cc',camisa:'#8fb3c9',bata:true,lbl:'Gobernador (tú)'},
 tra:{piel:'#d9a47c',pelo:'#9a9a9a',peinado:'calvo',barba:'#9a9a9a',gafas:true,traje:'#2f4a6b',corbata:'#d4af37',nom:'Ministro de Transportes',tag:'/bitacora · preside',lbl:'Transportes',ang:90},
 int:{piel:'#c68b62',pelo:'#1e1612',peinado:'raya',traje:'#3d3d45',corbata:'#b85c3e',nom:'Ministro del Interior',tag:'/plan-socialista',lbl:'Interior',ang:134},
 hac:{piel:'#e8c19d',pelo:'#5a3a22',peinado:'entradas',bigote:'#5a3a22',gafas:true,traje:'#253a2a',corbata:'#90a06a',nom:'Ministro de Hacienda',tag:'/ahorro',lbl:'Hacienda',ang:178},
 edu:{piel:'#f0cba8',pelo:'#7a3b1e',peinado:'melena',traje:'#6b2f4c',collar:'#d4af37',mujer:true,nom:'Ministra de Educación',tag:'/mayeutica',lbl:'Educación',ang:220},
 jus:{piel:'#8d5a3b',pelo:'#141010',peinado:'mono',gafas:true,traje:'#1c1c22',collar:'#ece3cc',mujer:true,nom:'Ministra de Justicia',tag:'jueces + auditor ciego',lbl:'Justicia',ang:-40},
 cie:{piel:'#e5b892',pelo:'#c99a4a',peinado:'coleta',traje:'#2d4f5a',collar:'#9c5476',mujer:true,nom:'Ministra de Ciencia',tag:'/ingenieria-reversa',lbl:'Ciencia',ang:46},
 ext:{piel:'#b97d55',pelo:'#2a1d14',peinado:'rizos',barba:'#2a1d14',traje:'#4a3a28',corbata:'#3d6b8f',nom:'Ministro de Exteriores',tag:'/radar',lbl:'Exteriores',ang:2},
};
function persona(p,boca,parpado,id){
 const ry=1.2+11*boca, ojo=parpado?0.6:5.5;
 let atras='',delante='';
 const h=p.pelo;
 if(p.peinado==='melena')atras=`<path d="M52 92 Q50 30 100 32 Q150 30 148 92 L156 170 Q130 160 128 120 L72 120 Q70 160 44 170 Z" fill="${h}"/>`;
 if(p.peinado==='coleta')atras=`<ellipse cx="148" cy="80" rx="16" ry="28" fill="${h}"/>`;
 if(p.peinado==='mono')atras=`<circle cx="100" cy="34" r="20" fill="${h}"/>`;
 if(p.peinado==='rizos')atras=`<g fill="${h}">${[56,70,85,100,115,130,144].map((x,i)=>`<circle cx="${x}" cy="${52-(i%2)*6-(i>1&&i<5?6:0)}" r="16"/>`).join('')}<circle cx="54" cy="72" r="12"/><circle cx="146" cy="72" r="12"/></g>`;
 if(p.peinado==='corto')delante=`<path d="M58 84 Q56 40 100 40 Q144 40 142 84 Q130 58 100 58 Q72 58 58 84 Z" fill="${h}"/>`;
 if(p.peinado==='raya')delante=`<path d="M58 86 Q54 38 104 40 Q146 42 142 86 Q138 62 118 56 Q90 64 70 62 Q62 70 58 86 Z" fill="${h}"/>`;
 if(p.peinado==='entradas')delante=`<path d="M58 88 Q58 56 74 52 L76 70 Q66 76 58 88 Z M142 88 Q142 56 126 52 L124 70 Q134 76 142 88 Z" fill="${h}"/>`;
 if(p.peinado==='calvo')delante=`<path d="M58 92 Q58 72 66 66 L66 88 Z M142 92 Q142 72 134 66 L134 88 Z" fill="${h}"/>`;
 if(p.peinado==='melena')delante=`<path d="M58 90 Q56 40 100 40 Q146 40 142 90 Q134 60 110 56 Q84 62 58 90 Z" fill="${h}"/>`;
 if(p.peinado==='mono'||p.peinado==='coleta')delante=`<path d="M58 88 Q56 42 100 42 Q144 42 142 88 Q128 60 100 60 Q72 60 58 88 Z" fill="${h}"/>`;
 const cuello=p.bata?`<path d="M30 230 Q32 168 100 160 Q168 168 170 230 Z" fill="${p.traje}"/><path d="M84 158 L100 196 L116 158 Z" fill="${p.camisa}"/>
   <path d="M66 172 Q60 205 82 214 M134 172 Q140 205 118 214" stroke="#3d3d45" stroke-width="4" fill="none"/><circle cx="100" cy="216" r="7" fill="#9a9a9a"/><path d="M82 214 Q100 226 100 216 M118 214 Q100 226 100 216" stroke="#3d3d45" stroke-width="3" fill="none"/>`
  :`<path d="M26 230 Q28 166 100 158 Q172 166 174 230 Z" fill="${p.traje}"/>
   <path d="M82 158 L100 ${p.mujer?186:200} L118 158 Z" fill="${p.mujer?p.piel:'#f2ece0'}"/>
   ${p.corbata?`<path d="M96 168 L104 168 L108 210 L100 220 L92 210 Z" fill="${p.corbata}"/><path d="M94 160 L106 160 L104 170 L96 170 Z" fill="${p.corbata}"/>`:''}
   ${p.collar?`<path d="M84 162 Q100 190 116 162" stroke="${p.collar}" stroke-width="3" fill="none"/><circle cx="100" cy="182" r="4" fill="${p.collar}"/>`:''}
   <path d="M82 158 L72 200 L92 176 Z M118 158 L128 200 L108 176 Z" fill="rgba(0,0,0,.25)"/>`;
 return `<svg viewBox="0 0 200 220">${atras}${cuello}
  <rect x="88" y="128" width="24" height="34" rx="8" fill="${p.piel}" style="filter:brightness(.88)"/>
  <ellipse cx="57" cy="100" rx="7" ry="11" fill="${p.piel}"/><ellipse cx="143" cy="100" rx="7" ry="11" fill="${p.piel}"/>
  <ellipse cx="100" cy="94" rx="43" ry="52" fill="${p.piel}"/>
  ${p.barba?`<path d="M58 100 Q60 150 100 150 Q140 150 142 100 Q136 128 118 130 Q100 122 82 130 Q64 128 58 100 Z" fill="${p.barba}"/>`:''}
  ${delante}
  <path d="M74 80 Q84 74 94 80 M106 80 Q116 74 126 80" stroke="${p.pelo==='#9a9a9a'?'#6e6e6e':p.pelo}" stroke-width="3.5" fill="none" stroke-linecap="round"/>
  <ellipse cx="84" cy="94" rx="5" ry="${ojo}" fill="#1a1410"/><ellipse cx="116" cy="94" rx="5" ry="${ojo}" fill="#1a1410"/>
  ${p.gafas?`<g stroke="#1a1410" stroke-width="2.5" fill="rgba(255,255,255,.08)"><rect x="70" y="84" width="27" height="20" rx="7"/><rect x="103" y="84" width="27" height="20" rx="7"/><path d="M97 92 L103 92"/></g>`:''}
  <path d="M100 98 Q96 112 102 114" stroke="rgba(0,0,0,.3)" stroke-width="2.5" fill="none" stroke-linecap="round"/>
  ${p.mujer?`<ellipse cx="74" cy="114" rx="7" ry="4" fill="#d9776b" opacity=".35"/><ellipse cx="126" cy="114" rx="7" ry="4" fill="#d9776b" opacity=".35"/>`:''}
  ${p.bigote?`<path d="M84 122 Q100 114 116 122 Q100 120 84 122 Z" fill="${p.bigote}" stroke="${p.bigote}" stroke-width="4"/>`:''}
  <ellipse cx="100" cy="129" rx="${10+2*boca}" ry="${ry}" fill="#5a1f1a"/>
  ${boca>0.25?`<rect x="${92-boca}" y="${129-ry}" width="${16+2*boca}" height="3" fill="#f2ece0"/>`:''}
 </svg>`;
}
