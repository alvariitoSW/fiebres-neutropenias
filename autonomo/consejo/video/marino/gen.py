import json, wave, sys, numpy as np
sys.path.insert(0,'..'); from tts import say
FPS=25; SR=22050
V={'tra':('es+m1',178,45,55),'hac':('es+m7',175,25,40),'edu':('es+f2',180,65,60)}
G=[
 ('tra','Estado del plan Marino cien por cien, a treinta de octubre. Son ciento cincuenta y cinco fichas en ocho bloques. Veintinueve ya están en la app, y otras veintiséis, construidas a falta de fusionar.',0.8),
 ('tra','Los bloques uno y dos están hechos. El corazón del bloque tres ya pasó al profesor y al auditor, y espera en la PR cincuenta y uno. El pulmón con respirador y el bloque cuatro arrancan en cuanto entre.',0.8),
 ('tra','Calendario: desde el dos de noviembre, el bloque cinco y la eco. Desde el nueve, los bloques seis A y seis B. Fecha firme: el trece de noviembre.',0.8),
 ('hac','Hacienda. A Marino le quedan entre doscientos trece y doscientos ochenta y un millones. Hasta el trece caben unos quinientos cincuenta. Es posible, no seguro. Vigilo el límite semanal cada día.',0.8),
 ('edu','Educación. El corazón sacó entre ocho coma ocho y ocho coma nueve con el profesor, y cero fallos graves con el auditor. Y los bloques seis A y seis B nunca saldrán sin su modelo vivo.',0.8),
 ('tra','Siguiente paso: fusionar la PR cincuenta y uno. Lo que espera de ti, gobernador: la captura de Uso, el sábado por la noche. Quedan catorce días.',1.8),
]
t=1.2; clips=[]
for i,(k,tx,p) in enumerate(G):
    f=f'audio/c{i}.wav'; say(tx,*V[k],f)
    w=wave.open(f); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)
    clips.append(dict(k=k,tx=tx,t0=round(t,3),d=round(len(a)/SR,3),a=a)); t+=len(a)/SR+p
T=t; mix=np.zeros(int(T*SR)+1,np.float32)
for c in clips:
    s=int(c['t0']*SR); mix[s:s+len(c['a'])]+=c['a']; n=int(np.ceil(c['d']*FPS))
    c['env']=[min(1,round(float(np.sqrt(np.mean(c['a'][int(j/FPS*SR):int((j+1)/FPS*SR)]**2)))/4000,2)) for j in range(n)]; del c['a']
with wave.open('audio/mezcla.wav','wb') as f: f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes(np.clip(mix*0.9,-32767,32767).astype(np.int16).tobytes())
open('timeline.js','w').write('window.TL='+json.dumps(dict(total=round(T,2),clips=clips),ensure_ascii=False)+';')
print(round(T,1),[c['d'] for c in clips])
