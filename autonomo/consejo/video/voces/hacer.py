import sys,os,wave,numpy as np
sys.path.insert(0,os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from voz import decir; from reparto import REPARTO
D=os.path.dirname(os.path.abspath(__file__))
L=[('tra','El portavoz, ministro de Transportes','Buenas tardes, estimados ciudadanos y ciudadanas. Comparezco ante ustedes para comunicarles los acuerdos del Consejo de Ministros.'),
 ('hac','El ministro de Hacienda','Llevamos el 61 % de la semana, y yo vigilo que no haya gasto superfluo. Si se agota, todo se para hasta el lunes a las 14:00.'),
 ('edu','La ministra de Educación','Con un 8,75 aprobábamos, y con un 9,5 enseñamos. El gobernador quiere ser pionero en estudiar con modelos vivos.'),
 ('cie','La ministra de Ciencia','Estudio los simuladores ajenos, sin copiar su código. El gobernador validó mi ley entera de un plumazo. Gracias, gobernador.'),
 ('int','El ministro del Interior','Dirijo las obras con siete agentes. El gobernador dice «aplica todo», y confía. Mi única pesadilla es la PR #51.'),
 ('jus','La ministra de Justicia','Mis jueces miden cada ficha, y nadie me salta. La primera ley la escribió él: «nunca inventes».'),
 ('ext','El ministro de Exteriores','Vigilo webs, tuits y papers. El gobernador tiene buen ojo, y ya me dejó claro que los PDF los busco yo.'),
 ('p1','Un periodista','¿No es una temeridad seguir con vía libre de gasto hasta el 22?'),
 ('p2','Una periodista','¿Y qué opina el gobernador de todo esto?')]
SR=22050; partes=[]
def lee(p): w=wave.open(p); return np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32)
sil=lambda s:np.zeros(int(s*SR),np.float32)
decir('Muestrario de voces del Consejo de Ministros. Primero, el portavoz antes del cambio, y después con su voz nueva.',REPARTO['mod'],f'{D}/i.wav'); partes+=[lee(f'{D}/i.wav'),sil(.6)]
partes+=[lee(os.path.join(D,'..','rueda','audio','c00.wav')),sil(.9)]
for i,(k,quien,frase) in enumerate(L):
    decir(quien+'.',REPARTO['mod'],f'{D}/n{i}.wav'); decir(frase,REPARTO[k],f'{D}/f{i}.wav',sala=k in('p1','p2'))
    partes+=[lee(f'{D}/n{i}.wav'),sil(.35),lee(f'{D}/f{i}.wav'),sil(.9)]
a=np.concatenate(partes)
with wave.open(f'{D}/muestrario.wav','wb') as f: f.setnchannels(1);f.setsampwidth(2);f.setframerate(SR);f.writeframes(np.clip(a,-32767,32767).astype(np.int16).tobytes())
print(round(len(a)/SR,1),'s')
