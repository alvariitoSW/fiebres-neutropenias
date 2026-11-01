import json, wave, sys, numpy as np
sys.path.insert(0,'..'); from voz import decir; from reparto import REPARTO
FPS=25; SR=22050; rng=np.random.default_rng(7)
LLEGA=9.6  # segundos de entrada (pasillo + sala)
G=[ # (quién, plano, hablado, subtítulo, pausa)
 ('tra','atril','Buenas noches, ciudadanos y ciudadanas. Comparezco para informarles del estado del Plan Marino.',None,0.5),
 ('tra','atril','De las ciento cincuenta y cinco fichas del libro, cincuenta y cinco ya están en la app. Otras noventa y cinco, más o menos, están construidas y esperan para entrar. Faltan unas cinco.','De las 155 fichas del libro, 55 ya están en la app. Otras 95, más o menos, están construidas y esperan para entrar. Faltan unas 5.',0.5),
 ('tra','general','Ahora mismo trabajan seis equipos. Juntan los bloques cuatro, cinco, seis a y seis b, terminan las últimas fichas de nutrición y tóxicos, y pulen el corazón. Atenderé sus preguntas.','Ahora mismo trabajan 6 equipos. Juntan los bloques 4, 5, 6a y 6b, terminan las últimas fichas de nutrición y tóxicos, y pulen el corazón. Atenderé sus preguntas.',0.4),
 ('p1','p1','¿Por qué no entran ya esas noventa y cinco fichas?','¿Por qué no entran ya esas 95 fichas?',0.3),
 ('tra','atril','Porque falta una decisión del gobernador. La nota de corte del profesor subió a nueve y medio, pero sus instrucciones aún aprueban con ocho. Hasta que él decida, no abrimos más pe erres.','Porque falta una decisión del gobernador. La nota de corte del profesor subió a 9,5, pero sus instrucciones aún aprueban con 8. Hasta que él decida, no abrimos más PR.',0.3),
 ('p2','p2','¿Y qué tiene que decidir exactamente?',None,0.3),
 ('tra','atril','Dos cosas. Primera: si repetimos el Consejo con un modelo más grande, si además lo dejamos como regla, o si lo dejamos como está. Segunda: si lo aprobado con ocho coma setenta y cinco se examina otra vez a nueve y medio, o cuenta como ya juzgado.','Dos cosas. Primera: si repetimos el Consejo con un modelo más grande, si además lo dejamos como regla, o si lo dejamos como está. Segunda: si lo aprobado con 8,75 se examina otra vez a 9,5, o cuenta como ya juzgado.',0.3),
 ('p1','p1','¿Le piden algo más al gobernador?',None,0.3),
 ('tra','atril','Tres cosas pequeñas. El visto bueno a las maquetas de los bloques cinco y seis: si no dice nada, se quedan como están. La captura de Uso cada mañana. Y mirar la portada nueva de Marino.','Tres cosas pequeñas. El visto bueno a las maquetas de los bloques 5 y 6: si no dice nada, se quedan como están. La captura de Uso cada mañana. Y mirar la portada nueva de Marino.',0.3),
 ('p2','p2','¿Se mantiene la fecha?',None,0.3),
 ('tra','atril','Se mantiene: trece de noviembre. Queda cerrar el bloque tres, con sus paradas en el móvil, y cerrar los bloques cuatro, cinco y seis. Muchas gracias.','Se mantiene: 13 de noviembre. Queda cerrar el bloque 3, con sus paradas en el móvil, y cerrar los bloques 4, 5 y 6. Muchas gracias.',2.8),
]
t=LLEGA; clips=[]
for i,(k,plano,tx,sub,p) in enumerate(G):
    f=f'audio/c{i:02d}.wav'; decir(tx,REPARTO[k],f,sala=True)
    w=wave.open(f); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)
    clips.append(dict(k=k,plano=plano,sub=sub or tx,t0=round(t,3),d=round(len(a)/SR,3),a=a)); t+=len(a)/SR+p
T=t; mix=np.zeros(int(T*SR)+SR,np.float32)
for c in clips:
    s=int(c['t0']*SR); mix[s:s+len(c['a'])]+=c['a']; n=int(np.ceil(c['d']*FPS))
    c['env']=[min(1,round(float(np.sqrt(np.mean(c['a'][int(j/FPS*SR):int((j+1)/FPS*SR)]**2)))/4000,2)) for j in range(n)]; del c['a']
# efectos: pasos, obturadores de cámara y murmullo de sala
def ruido(n): return rng.standard_normal(n).astype(np.float32)
def paso(t0,vol):
    n=int(0.09*SR); x=ruido(n); x=np.convolve(x,np.ones(40)/40,'same')*np.exp(-np.linspace(0,7,n)); s=int(t0*SR); mix[s:s+n]+=x*vol
def foto(t0,vol):
    for dt in (0,0.045):
        n=int(0.03*SR); x=ruido(n)*np.exp(-np.linspace(0,5,n)); s=int((t0+dt)*SR); mix[s:s+n]+=x*vol
pasos=[x*0.52+0.2 for x in range(int(8.6/0.52))]
for i,p in enumerate(pasos): paso(p,9000 if p<3.4 else 5000)
for p in sorted(rng.uniform(7.8,LLEGA+1.5,26)): foto(float(p),rng.uniform(2500,6000))
for p in rng.uniform(clips[-1]['t0']+clips[-1]['d'],T-0.5,10): foto(float(p),rng.uniform(2500,5000))
amb=np.convolve(ruido(len(mix)),np.ones(200)/200,'same')*900; mix+=amb
mix=mix[:int(T*SR)]
with wave.open('audio/mezcla.wav','wb') as f: f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes(np.clip(mix*0.9,-32767,32767).astype(np.int16).tobytes())
open('timeline.js','w').write('window.TL='+json.dumps(dict(total=round(T,2),llega=LLEGA,pasos=pasos,clips=clips),ensure_ascii=False)+';')
print(round(T,1))
