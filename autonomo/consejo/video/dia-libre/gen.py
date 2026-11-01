import json, wave, sys, numpy as np
sys.path.insert(0,'..'); from voz import decir; from reparto import REPARTO, Pi
REPARTO['ext']=Pi('es_ES-davefx-medium',tono=1.06,velocidad=1.03)  # voz de España (regla del usuario)
FPS=25; SR=22050; rng=np.random.default_rng(7)
LLEGA=9.6  # segundos de entrada (pasillo + sala)
G=[ # (quién, plano, hablado, subtítulo, pausa)
 ('tra','atril','Buenas noches. Se abre el Consejo de Ministros del uno de noviembre: el día libre de Marino. Cada ministro rendirá cuentas.','Buenas noches. Se abre el Consejo de Ministros del 1 de noviembre: el día libre de Marino. Cada ministro rendirá cuentas.',0.5),
 ('int','atril','Ministro del Interior. Hoy han trabajado hasta veinticuatro equipos a la vez. De las ciento cincuenta y cinco fichas de Marino, ciento cuarenta y nueve ya tienen su Estudiar construido. Faltan seis: el eje hormonal y los tóxicos.','Ministro del Interior. Hoy han trabajado hasta 24 equipos a la vez. De las 155 fichas de Marino, 149 ya tienen su Estudiar construido. Faltan 6: el eje hormonal y los tóxicos.',0.4),
 ('hac','atril','Ministro de Hacienda. Hemos gastado más del noventa por ciento de la semana. El lunes a las dos se reinicia. Hasta entonces, no se abre nada nuevo.','Ministro de Hacienda. Hemos gastado más del 90 % de la semana. El lunes a las 14:00 se reinicia. Hasta entonces, no se abre nada nuevo.',0.4),
 ('edu','atril','Ministra de Educación. Cinco modelos vivos nuevos: hígado, termostato, cráneo, placa motora y eje hormonal, casi todos con nueve y medio. La nota de corte ya es nueve y medio, y todo se pule hasta ahí antes de entrar.','Ministra de Educación. 5 modelos vivos nuevos: hígado, termostato, cráneo, placa motora y eje hormonal, casi todos con 9,5. La nota de corte ya es 9,5, y todo se pule hasta ahí antes de entrar.',0.4),
 ('jus','atril','Ministra de Justicia. Cinco pe erres esperan: el pulmón y los bloques cuatro, cinco, seis a y seis b. Entrarán en main por votos del Consejo, con los jueces en verde y el profesor en nueve y medio.','Ministra de Justicia. 5 PR esperan: el pulmón y los bloques 4, 5, 6a y 6b. Entrarán en main por votos del Consejo, con los jueces en verde y el profesor en 9,5.',0.4),
 ('cie','atril','Ministra de Ciencia. Estudiamos el superagente de DeepSeek y un catálogo de inteligencia artificial. Nada entra en la app, pero traen ideas para molestarle menos.','Ministra de Ciencia. Estudiamos el superagente de DeepSeek y un catálogo de inteligencia artificial. Nada entra en la app, pero traen ideas para molestarle menos.',0.4),
 ('ext','atril','Ministro de Exteriores. Siguen pendientes cinco tuits que equis no deja leer, y el pe de efe de Semiología.','Ministro de Exteriores. Siguen pendientes 5 tuits que X no deja leer, y el PDF de Semiología.',0.4),
 ('p1','p1','¿Qué tiene que decidir el gobernador?',None,0.3),
 ('tra','atril','Tres cosas. Si frena las dos mejoras de los jueces. Qué hace con las ideas del superagente: todas, algunas o ninguna. Y mirar los bloques en la vista previa del móvil.',None,0.3),
 ('p2','p2','¿Y el veredicto del Consejo?',None,0.3),
 ('tra','atril','Veredicto: el lunes, tras el reinicio, primero se pulen las cinco pe erres a nueve y medio y se fusionan. Después, las seis fichas que faltan. Meta: Marino al cien por cien antes del trece de noviembre. Se levanta la sesión.','Veredicto: el lunes, tras el reinicio, primero se pulen las 5 PR a 9,5 y se fusionan. Después, las 6 fichas que faltan. Meta: Marino al 100 % antes del 13 de noviembre. Se levanta la sesión.',2.6),
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
