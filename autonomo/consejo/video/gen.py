import json, wave, numpy as np
from voz import decir; from reparto import REPARTO
FPS=25
G=[ # (quién, texto, pausa después)
 ('tra','Se abre la sesión. Soy el ministro de Transportes: llevo la bitácora y el calendario. El gobernador pide mucho y rápido, y lo lee todo en el móvil. Me obliga a ser breve.',0.7),
 ('int','Ministro del Interior. Dirijo las obras con siete agentes. El gobernador dice «aplica todo», y confía. Mi única pesadilla es la PR cincuenta y uno.',0.7),
 ('hac','Ministro de Hacienda. Cuento cada token. El gobernador me delegó el presupuesto… y luego desempató a favor de Educación. Lo acepto. Más o menos.',0.7),
 ('edu','Ministra de Educación. Solo pregunto una cosa: ¿sirve para estudiar? Nuestro gobernador es R1 y estudia de verdad con esto. Gran gobernador.',0.7),
 ('jus','Ministra de Justicia. Mis jueces miden cada ficha, y nadie me salta. La primera ley la escribió él: «nunca inventes». También se la aplico a él.',0.7),
 ('cie','Ministra de Ciencia. Estudio los simuladores ajenos, sin copiar su código. El gobernador validó mi ley entera de un plumazo. Gracias, gobernador.',0.7),
 ('ext','Ministro de Exteriores. Vigilo webs, tuits y papers. El gobernador tiene buen ojo… y ya me dejó claro que los PDF los busco yo.',0.9),
 ('tra','¿Confía el Consejo en su gobernador?',0.4),
]+[(k,'Sí.',0.15) for k in ['int','hac','edu','jus','cie','ext','tra']]+[
 ('tra','Aprobado por unanimidad. Se levanta la sesión.',1.8)]
t=2.6; clips=[]; SR=22050
for i,(k,tx,pausa) in enumerate(G):
    f=f'audio/c{i:02d}.wav'; decir(tx.replace('«','').replace('»',''),REPARTO[k],f)
    w=wave.open(f); a=np.frombuffer(w.readframes(w.getnframes()),dtype=np.int16).astype(np.float32)
    d=len(a)/SR; clips.append(dict(k=k,tx=tx,t0=round(t,3),d=round(d,3),a=a)); t+=d+pausa
T=t+1.0; mix=np.zeros(int(T*SR)+1,np.float32)
for c in clips:
    s=int(c['t0']*SR); mix[s:s+len(c['a'])]+=c['a']
    n=int(np.ceil(c['d']*FPS)); env=[]
    for j in range(n):
        seg=c['a'][int(j/FPS*SR):int((j+1)/FPS*SR)]
        env.append(round(float(np.sqrt(np.mean(seg**2)) if len(seg) else 0)/4000,2))
    c['env']=[min(1,e) for e in env]; del c['a']
mix=np.clip(mix*0.9,-32767,32767).astype(np.int16)
with wave.open('audio/mezcla.wav','wb') as f: f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes(mix.tobytes())
json.dump(dict(total=round(T,2),clips=clips),open('timeline.json','w'),ensure_ascii=False)
print('total',round(T,1),[ (c['k'],c['d']) for c in clips[:7]])
