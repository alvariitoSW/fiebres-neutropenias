// Ministros más realistas (01/11/2026, vídeo de la reforma constitucional): piel con volumen, ojos con iris y brillo,
// párpados, cejas con forma, nariz con sombra, labios, pelo con volumen y mechones, cuello y traje con solapas.
// Misma firma que la plantilla rueda/: persona(p, boca 0-1, parpado bool) → SVG de 200×220.
const P={
 gob:{piel:'#e0b58f',pelo:'#3b2a1c',peinado:'corto',traje:'#ece3cc',camisa:'#8fb3c9',bata:true,ojos:'#5b3a1e',lbl:'Gobernador (tú)'},
 tra:{piel:'#d9a47c',pelo:'#a7a7a7',peinado:'calvo',barba:'#9a9a9a',gafas:true,traje:'#2f4a6b',corbata:'#d4af37',ojos:'#4a6b8a',edad:1,nom:'Ministro de Transportes',tag:'/bitacora · preside',lbl:'Transportes'},
 int:{piel:'#c68b62',pelo:'#1e1612',peinado:'raya',traje:'#3d3d45',corbata:'#b85c3e',ojos:'#3b2414',nom:'Ministro del Interior',tag:'/plan-socialista',lbl:'Interior'},
 hac:{piel:'#e8c19d',pelo:'#5a3a22',peinado:'entradas',bigote:'#5a3a22',gafas:true,traje:'#253a2a',corbata:'#90a06a',ojos:'#5b3a1e',edad:1,nom:'Ministro de Hacienda',tag:'/ahorro',lbl:'Hacienda'},
 edu:{piel:'#f0cba8',pelo:'#7a3b1e',peinado:'melena',traje:'#6b2f4c',collar:'#d4af37',mujer:true,ojos:'#4f7a3a',nom:'Ministra de Educación',tag:'/mayeutica',lbl:'Educación'},
 jus:{piel:'#8d5a3b',pelo:'#141010',peinado:'mono',gafas:true,traje:'#1c1c22',collar:'#ece3cc',mujer:true,ojos:'#2a1a10',nom:'Ministra de Justicia',tag:'jueces + auditor ciego',lbl:'Justicia'},
 cie:{piel:'#e5b892',pelo:'#c99a4a',peinado:'coleta',traje:'#2d4f5a',collar:'#9c5476',mujer:true,ojos:'#3d6b8f',nom:'Ministra de Ciencia',tag:'/ingenieria-reversa',lbl:'Ciencia'},
 ext:{piel:'#b97d55',pelo:'#2a1d14',peinado:'rizos',barba:'#2a1d14',traje:'#4a3a28',corbata:'#3d6b8f',ojos:'#3b2414',nom:'Ministro de Exteriores',tag:'/radar',lbl:'Exteriores'},
};
// aclara u oscurece un color hex (k>0 aclara, k<0 oscurece)
function tono(hex,k){const n=parseInt(hex.slice(1),16);let r=n>>16,g=n>>8&255,b=n&255;
 const f=c=>Math.round(k>0?c+(255-c)*k:c*(1+k));return '#'+[f(r),f(g),f(b)].map(x=>Math.max(0,Math.min(255,x)).toString(16).padStart(2,'0')).join('')}
persona.n=0;
function persona(p,boca,parpado,mira){
 mira=mira||[0,0];
 const id='q'+(++persona.n); // id único por dibujo: si dos escenas repiten persona, el degradado no se pierde
 const piel=p.piel, sombra=tono(piel,-0.22), luz=tono(piel,0.18), h=p.pelo, hL=tono(h,0.28), hD=tono(h,-0.35);
 const defs=`<defs>
  <radialGradient id="${id}c" cx="0.45" cy="0.38" r="0.7"><stop offset="0" stop-color="${luz}"/><stop offset="0.65" stop-color="${piel}"/><stop offset="1" stop-color="${sombra}"/></radialGradient>
  <linearGradient id="${id}p" x1="0" y1="0" x2="0" y2="1"><stop offset="0" stop-color="${hL}"/><stop offset="1" stop-color="${hD}"/></linearGradient>
  <linearGradient id="${id}t" x1="0" y1="0" x2="1" y2="1"><stop offset="0" stop-color="${tono(p.traje,0.16)}"/><stop offset="1" stop-color="${tono(p.traje,-0.3)}"/></linearGradient>
  <radialGradient id="${id}i" cx="0.5" cy="0.45" r="0.6"><stop offset="0" stop-color="${tono(p.ojos||'#3b2414',0.35)}"/><stop offset="1" stop-color="${tono(p.ojos||'#3b2414',-0.3)}"/></radialGradient>
  <filter id="${id}b" x="-20%" y="-20%" width="140%" height="140%"><feGaussianBlur stdDeviation="2.2"/></filter>
 </defs>`;
 // pelo de detrás
 let atras='',delante='';
 if(p.peinado==='melena')atras=`<path d="M50 96 Q46 26 100 28 Q154 26 150 96 L160 178 Q132 168 128 122 L72 122 Q68 168 40 178 Z" fill="url(#${id}p)"/>`;
 if(p.peinado==='coleta')atras=`<path d="M138 60 Q176 70 162 128 Q156 104 144 96 Z" fill="url(#${id}p)"/>`;
 if(p.peinado==='mono')atras=`<circle cx="100" cy="30" r="21" fill="url(#${id}p)"/><path d="M86 22 Q100 14 114 22" stroke="${hL}" stroke-width="2" fill="none" opacity=".6"/>`;
 if(p.peinado==='rizos')atras=`<g fill="url(#${id}p)">${[52,66,82,100,118,134,148].map((x,i)=>`<circle cx="${x}" cy="${50-(i%2)*6-(i>1&&i<5?7:0)}" r="17"/>`).join('')}<circle cx="50" cy="74" r="13"/><circle cx="150" cy="74" r="13"/></g>`;
 const mechon=(d)=>`<path d="${d}" stroke="${hL}" stroke-width="1.6" fill="none" opacity=".55" stroke-linecap="round"/>`;
 if(p.peinado==='corto')delante=`<path d="M56 88 Q52 34 100 36 Q148 34 144 88 Q134 56 100 56 Q70 56 56 88 Z" fill="url(#${id}p)"/>${mechon('M72 50 Q90 42 110 44')}`;
 if(p.peinado==='raya')delante=`<path d="M56 90 Q50 32 104 36 Q150 38 144 90 Q140 60 118 54 Q90 64 68 60 Q60 70 56 90 Z" fill="url(#${id}p)"/>${mechon('M118 54 Q128 44 138 52')}${mechon('M70 52 Q92 44 112 46')}`;
 if(p.peinado==='entradas')delante=`<path d="M56 92 Q56 54 74 48 L76 70 Q64 76 56 92 Z M144 92 Q144 54 126 48 L124 70 Q136 76 144 92 Z" fill="url(#${id}p)"/>`;
 if(p.peinado==='calvo')delante=`<path d="M56 96 Q56 72 64 64 L66 92 Z M144 96 Q144 72 136 64 L134 92 Z" fill="url(#${id}p)"/><ellipse cx="92" cy="54" rx="18" ry="7" fill="#fff" opacity=".18"/>`;
 if(p.peinado==='melena')delante=`<path d="M56 94 Q52 34 100 36 Q150 34 144 94 Q136 58 110 54 Q82 60 56 94 Z" fill="url(#${id}p)"/>${mechon('M74 48 Q96 40 118 46')}${mechon('M60 80 Q66 60 82 54')}`;
 if(p.peinado==='mono'||p.peinado==='coleta')delante=`<path d="M56 90 Q52 38 100 38 Q148 38 144 90 Q128 58 100 58 Q72 58 56 90 Z" fill="url(#${id}p)"/>${mechon('M70 52 Q100 40 130 52')}`;
 // cuello y ropa
 const ropa=p.bata?`<path d="M24 230 Q28 166 100 158 Q172 166 176 230 Z" fill="url(#${id}t)"/><path d="M84 156 L100 196 L116 156 Z" fill="${p.camisa}"/><circle cx="100" cy="216" r="7" fill="#9a9a9a"/>`
  :`<path d="M22 230 Q24 164 100 156 Q176 164 178 230 Z" fill="url(#${id}t)"/>
   <path d="M80 158 L100 ${p.mujer?188:204} L120 158 Z" fill="${p.mujer?tono(piel,-0.05):'#f4f0e6'}"/>
   ${p.mujer?'':`<path d="M80 158 L92 176 L100 166 Z M120 158 L108 176 L100 166 Z" fill="#fbf8f1" stroke="#d8d2c4" stroke-width="1"/>`}
   ${p.corbata?`<path d="M95 170 L105 170 L110 214 L100 226 L90 214 Z" fill="${p.corbata}"/><path d="M93 162 L107 162 L105 172 L95 172 Z" fill="${tono(p.corbata,-0.2)}"/><path d="M97 176 L103 176 L106 210" stroke="${tono(p.corbata,0.25)}" stroke-width="1.5" fill="none" opacity=".6"/>`:''}
   ${p.collar?`<path d="M82 164 Q100 194 118 164" stroke="${p.collar}" stroke-width="3" fill="none"/><circle cx="100" cy="186" r="4.5" fill="${p.collar}"/><circle cx="99" cy="185" r="1.4" fill="#fff" opacity=".7"/>`:''}
   <path d="M80 158 L66 210 L94 180 Z M120 158 L134 210 L106 180 Z" fill="${tono(p.traje,-0.35)}"/>
   <path d="M80 158 L70 196" stroke="${tono(p.traje,0.3)}" stroke-width="1.2" opacity=".6"/><path d="M120 158 L130 196" stroke="${tono(p.traje,0.3)}" stroke-width="1.2" opacity=".6"/>`;
 // ojos
 const ox=mira[0]*2.5, oy=mira[1]*1.5;
 const ojo=(cx)=>parpado?`<path d="M${cx-11} 95 Q${cx} 99 ${cx+11} 95" stroke="${tono(piel,-0.45)}" stroke-width="2.5" fill="none" stroke-linecap="round"/>`
  :`<path d="M${cx-12} 95 Q${cx} 85 ${cx+12} 95 Q${cx} 102 ${cx-12} 95 Z" fill="#f7f4ee"/>
    <circle cx="${cx+ox}" cy="${94.5+oy}" r="5.4" fill="url(#${id}i)"/><circle cx="${cx+ox}" cy="${94.5+oy}" r="2.4" fill="#0d0907"/>
    <circle cx="${cx+ox+1.8}" cy="${92.6+oy}" r="1.4" fill="#fff"/>
    <path d="M${cx-12} 95 Q${cx} 84 ${cx+12} 95" stroke="${tono(piel,-0.55)}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
    <path d="M${cx-10} 89 Q${cx} 83 ${cx+10} 89" stroke="${tono(piel,-0.18)}" stroke-width="1.2" fill="none" opacity=".7"/>`;
 const cejaC=p.pelo==='#a7a7a7'?'#7d7d7d':tono(h,-0.1);
 const cejas=`<path d="M70 80 Q82 72 95 78 Q83 76 70 82 Z" fill="${cejaC}" stroke="${cejaC}" stroke-width="2.2" stroke-linejoin="round"/>
  <path d="M130 80 Q118 72 105 78 Q117 76 130 82 Z" fill="${cejaC}" stroke="${cejaC}" stroke-width="2.2" stroke-linejoin="round"/>`;
 // boca: labios y, abierta, dientes y lengua
 const ab=Math.max(0,Math.min(1,boca)), aH=1.5+12*ab, aW=11+3*ab, lab=p.mujer?tono('#c25a5a',0.05):tono(piel,-0.32);
 const bocaSVG=ab<0.08?`<path d="M88 130 Q100 134 112 130" stroke="${lab}" stroke-width="3.2" fill="none" stroke-linecap="round"/><path d="M90 133 Q100 138 110 133" stroke="${tono(piel,-0.12)}" stroke-width="2" fill="none" opacity=".5"/>`
  :`<ellipse cx="100" cy="131" rx="${aW}" ry="${aH/2+1}" fill="#3a0f0e"/>
    ${ab>0.25?`<path d="M${100-aW+3} ${131-aH/2+1} Q100 ${131-aH/2+4} ${100+aW-3} ${131-aH/2+1} L${100+aW-4} ${131-aH/2+4} Q100 ${131-aH/2+6} ${100-aW+4} ${131-aH/2+4} Z" fill="#f4efe6"/>`:''}
    <ellipse cx="100" cy="${131+aH/2-1}" rx="${aW*0.55}" ry="${Math.max(1,aH/4)}" fill="#a3423d"/>
    <path d="M${100-aW-1} 131 Q100 ${131-aH/2-3} ${100+aW+1} 131" stroke="${lab}" stroke-width="3" fill="none"/>
    <path d="M${100-aW} 132 Q100 ${131+aH/2+4} ${100+aW} 132" stroke="${lab}" stroke-width="3.4" fill="none"/>`;
 const barba=p.barba?`<path d="M56 104 Q58 156 100 158 Q142 156 144 104 Q138 132 120 136 Q100 128 80 136 Q62 132 56 104 Z" fill="url(#${id}p)"/>
   <path d="M84 122 Q100 116 116 122 Q100 120 84 122 Z" fill="${hD}" stroke="${hD}" stroke-width="3"/>`
  :(!p.mujer?`<path d="M62 110 Q66 150 100 154 Q134 150 138 110 Q130 140 100 142 Q70 140 62 110 Z" fill="${sombra}" opacity=".18"/>`:'');
 return `<svg viewBox="0 0 200 220">${defs}${atras}${ropa}
  <path d="M86 126 L86 162 Q100 172 114 162 L114 126 Z" fill="${sombra}"/>
  <path d="M86 150 Q100 162 114 150 L114 160 Q100 170 86 160 Z" fill="${tono(piel,-0.4)}" opacity=".35"/>
  <ellipse cx="55" cy="102" rx="8" ry="12" fill="${piel}"/><path d="M53 96 Q50 102 54 110" stroke="${sombra}" stroke-width="2" fill="none"/>
  <ellipse cx="145" cy="102" rx="8" ry="12" fill="${piel}"/><path d="M147 96 Q150 102 146 110" stroke="${sombra}" stroke-width="2" fill="none"/>
  <path d="M56 96 Q56 40 100 40 Q144 40 144 96 Q144 128 128 144 Q114 156 100 156 Q86 156 72 144 Q56 128 56 96 Z" fill="url(#${id}c)"/>
  <ellipse cx="74" cy="118" rx="9" ry="6" fill="${p.mujer?'#e08a7c':tono(piel,-0.08)}" opacity="${p.mujer?.32:.18}" filter="url(#${id}b)"/>
  <ellipse cx="126" cy="118" rx="9" ry="6" fill="${p.mujer?'#e08a7c':tono(piel,-0.08)}" opacity="${p.mujer?.32:.18}" filter="url(#${id}b)"/>
  ${barba}${delante}${cejas}${ojo(83)}${ojo(117)}
  ${p.edad?`<path d="M70 104 Q76 108 82 106 M118 106 Q124 108 130 104" stroke="${sombra}" stroke-width="1.2" fill="none" opacity=".6"/><path d="M84 66 Q100 62 116 66" stroke="${sombra}" stroke-width="1.1" fill="none" opacity=".5"/>`:''}
  ${p.gafas?`<g stroke="#1a1410" stroke-width="2.6" fill="rgba(255,255,255,.07)"><rect x="68" y="84" width="30" height="21" rx="8"/><rect x="102" y="84" width="30" height="21" rx="8"/><path d="M98 92 Q100 90 102 92 M68 90 L57 88 M132 90 L143 88"/></g><path d="M72 88 L80 86" stroke="#fff" stroke-width="2" opacity=".35"/><path d="M106 88 L114 86" stroke="#fff" stroke-width="2" opacity=".35"/>`:''}
  <path d="M100 96 Q97 110 94 116 Q100 120 106 116" stroke="${sombra}" stroke-width="2.4" fill="none" stroke-linecap="round"/>
  <path d="M96 96 Q93 108 92 114" stroke="${sombra}" stroke-width="4" fill="none" opacity=".25" filter="url(#${id}b)"/>
  <ellipse cx="96" cy="117" rx="2.2" ry="1.4" fill="${tono(piel,-0.45)}"/><ellipse cx="104" cy="117" rx="2.2" ry="1.4" fill="${tono(piel,-0.45)}"/>
  <ellipse cx="102" cy="104" rx="2.5" ry="5" fill="#fff" opacity=".14"/>
  ${p.bigote?`<path d="M84 124 Q92 118 100 121 Q108 118 116 124 Q108 126 100 124 Q92 126 84 124 Z" fill="${p.bigote}" stroke="${p.bigote}" stroke-width="2.5" stroke-linejoin="round"/>`:''}
  ${bocaSVG}
 </svg>`;
}
