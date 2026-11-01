import json, wave, sys, numpy as np
sys.path.insert(0,'..'); from tts import say
FPS=25; SR=22050; rng=np.random.default_rng(7)
V={'tra':('es+m1',174,45,55),'p1':('es+m5',180,50,60),'p2':('es+f1',182,60,60)}
LLEGA=9.6  # segundos de entrada (pasillo + sala)
G=[ # (quién, plano, hablado, subtítulo, pausa)
 ('tra','atril','Buenas tardes, estimados ciudadanos y ciudadanas. Comparezco ante ustedes y ante los medios de comunicación para comunicarles los acuerdos del Consejo de Ministros.',None,0.5),
 ('tra','atril','Primero: el corazón y el pulmón con respirador ya están en la app. Segundo: hoy es día libre de Marino, con más de una docena de carriles trabajando a la vez. Y tercero: la nota de corte del profesor sube a nueve y medio.','Primero: el corazón y el pulmón con respirador ya están en la app. Segundo: hoy es día libre de Marino, con más de una docena de carriles trabajando a la vez. Y tercero: la nota de corte del profesor sube a 9,5.',0.5),
 ('tra','general','Mantenemos la fecha: trece de noviembre. Y ahora, sí, atenderé sus preguntas.','Mantenemos la fecha: 13 de noviembre. Y ahora, sí, atenderé sus preguntas.',0.4),
 ('p1','p1','¿No es una temeridad seguir con vía libre de gasto hasta el veintidós?','¿No es una temeridad seguir con vía libre de gasto hasta el 22?',0.3),
 ('tra','atril','En absoluto. Llevamos el sesenta y uno por ciento de la semana, y Hacienda vigila que no haya gasto superfluo. Si se agota, todo se para hasta el lunes a las dos.','En absoluto. Llevamos el 61 % de la semana, y Hacienda vigila que no haya gasto superfluo. Si se agota, todo se para hasta el lunes a las 14:00.',0.3),
 ('p2','p2','¿Y qué opina el gobernador de todo esto?',None,0.3),
 ('tra','atril','El gobernador lo dijo claro: veinticuatro horas de uso libre, como si queremos abrir veinticinco carriles. No pensamos desperdiciarlas. Muchas gracias.','El gobernador lo dijo claro: «24 horas de uso libre, como si queremos abrir 25 carriles». No pensamos desperdiciarlas. Muchas gracias.',2.8),
]
t=LLEGA; clips=[]
for i,(k,plano,tx,sub,p) in enumerate(G):
    f=f'audio/c{i:02d}.wav'; say(tx,*V[k],f)
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
