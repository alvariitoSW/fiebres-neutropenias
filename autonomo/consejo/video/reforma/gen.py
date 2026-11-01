import json, wave, sys, numpy as np
sys.path.insert(0,'..'); from voz import decir; from reparto import REPARTO, Pi
REPARTO['ext']=Pi('es_ES-davefx-medium',tono=1.06,velocidad=1.03)  # voz de España (regla del usuario)
FPS=25; SR=22050; rng=np.random.default_rng(7)
LLEGA=9.6  # segundos de entrada (pasillo + sala)
G=[ # (quién, plano, hablado, subtítulo, pausa)
 ('tra','atril','Buenas noches. El gobernador nos ha hecho una pregunta: ¿hace falta reformar la Constitución de la app, con lo aprendido en todas las sesiones?',None,0.5),
 ('tra','mesa','El Consejo ha leído las reglas, las actas y los partes de todas las sesiones. Siete lectores, tres propuestas y un tribunal de cuatro ministros. Cada ministro les cuenta lo que ha visto.','El Consejo ha leído las reglas, las actas y los partes de todas las sesiones. 7 lectores, 3 propuestas y un tribunal de 4 ministros. Cada ministro les cuenta lo que ha visto.',0.5),
 ('jus','atril','Ministra de Justicia. Las reglas se contradicen justo en lo que más se usa. Una dice que nadie más que el gobernador aprueba, y luego el Consejo aprueba, fusiona y sube techos. Hay dos artículos con el número quince, y nueve citas que apuntan a donde no es.','Ministra de Justicia. Las reglas se contradicen justo en lo que más se usa. Una dice que nadie más que el gobernador aprueba, y luego el Consejo aprueba, fusiona y sube techos. Hay 2 artículos con el número 15, y 9 citas que apuntan a donde no es.',0.4),
 ('int','atril','Ministro del Interior. Las reglas que más fallan ya están escritas, pero dependen de la memoria. Un juez de la Mayéutica da falsos errores desde el veintiocho de octubre. Otra frase no lo arregla: hace falta una herramienta.','Ministro del Interior. Las reglas que más fallan ya están escritas, pero dependen de la memoria. Un juez de la Mayéutica da falsos errores desde el 28 de octubre. Otra frase no lo arregla: hace falta una herramienta.',0.4),
 ('hac','atril','Ministro de Hacienda. La regla de comparecer al pasar del veinticinco por ciento se olvidó en cinco partes. Quien midió el gasto tras cada pieza cerró con solo un cinco por ciento de más. Queremos que el contador avise solo.','Ministro de Hacienda. La regla de comparecer al pasar del 25 % se olvidó en 5 partes. Quien midió el gasto tras cada pieza cerró con solo un 5 % de más. Queremos que el contador avise solo.',0.4),
 ('edu','atril','Ministra de Educación. La Constitución manda un botón, «Preguntas», que la app no tiene. Lo que ve el residente es Texto, Mayéutica y Estudiar. Escribiremos lo que se enseña de verdad, sin recortar nada de lo que enseña.','Ministra de Educación. La Constitución manda un botón, «Preguntas», que la app no tiene. Lo que ve el residente es Texto, Mayéutica y Estudiar. Escribiremos lo que se enseña de verdad, sin recortar nada.',0.4),
 ('cie','atril','Ministra de Ciencia. Hoy, la nota de corte subió a nueve y medio mientras ocho sesiones ya trabajaban con la vieja. Nadie las avisó. Cambiar una regla con sesiones en marcha necesita un procedimiento.','Ministra de Ciencia. Hoy, la nota de corte subió a 9,5 mientras 8 sesiones ya trabajaban con la vieja. Nadie las avisó. Cambiar una regla con sesiones en marcha necesita un procedimiento.',0.4),
 ('ext','atril','Ministro de Exteriores. Cada imagen o idea que venga de fuera llevará su licencia y su autor a la vista. Y, como pidió el gobernador, desde hoy hablo con voz de España.',None,0.5),
 ('p1','p1','¿Y cuál es la propuesta?',None,0.3),
 ('tra','atril','Nueve artículos. Uno: quién decide qué, en una sola tabla. Dos: el gasto en otra tabla, con fecha de fin y un aviso automático. Tres: una sola nota de corte, y un procedimiento para cambiar reglas. Cuatro: la regla que se incumple dos veces se convierte en herramienta o en juez. Cinco: lo común se arregla antes de abrir carriles en paralelo.','9 artículos. 1: quién decide qué, en una sola tabla. 2: el gasto en otra tabla, con fecha de fin y aviso automático. 3: una sola nota de corte y un procedimiento para cambiar reglas. 4: la regla que se incumple 2 veces se convierte en herramienta o juez. 5: lo común se arregla antes de abrir carriles.',0.3),
 ('tra','atril','Seis: lo que espera al gobernador caduca a las cuarenta y ocho horas con la recomendación del Consejo, salvo lo que solo él decide. Siete: la Constitución dice lo que la app enseña. Ocho: un número por regla, y lo sustituido se borra. Nueve: cada agente lee solo lo suyo.','6: lo que espera al gobernador caduca a las 48 h con la recomendación del Consejo, salvo lo que solo él decide. 7: la Constitución dice lo que la app enseña. 8: un número por regla, y lo sustituido se borra. 9: cada agente lee solo lo suyo.',0.4),
 ('p2','p2','¿Por qué no una reforma más profunda?',None,0.3),
 ('tra','atril','Porque lo esencial funciona. Las reglas clínicas, los jueces y el voto del Consejo han frenado errores de verdad. No se tocan la arquitectura, la nota de nueve y medio ni los vídeos con voces de España. Una reforma total pararía todas las sesiones en plena vía libre.','Porque lo esencial funciona. Las reglas clínicas, los jueces y el voto del Consejo han frenado errores de verdad. No se tocan la arquitectura, la nota de 9,5 ni los vídeos con voces de España. Una reforma total pararía todas las sesiones en plena vía libre.',0.4),
 ('p1','p1','¿Cuánto cuesta?',None,0.3),
 ('hac','atril','Unos seis millones de tokens, con un techo de siete coma tres. Y los ahorros se miden una semana antes y otra después. Si no bajan, se deshace.','Unos 6 M de tokens, con un techo de 7,3. Y los ahorros se miden una semana antes y otra después. Si no bajan, se deshace.',0.5),
 ('tra','mesa','Se procede a votar.',None,0.4),
]+[(k,'mesa',t,None,0.25) for k,t in [('int','A favor.'),('hac','A favor.'),('edu','A favor.'),('jus','A favor.'),('cie','A favor, con reservas en el artículo nueve.'),('ext','A favor.')]]+[
 ('tra','atril','Siete votos a favor, uno de ellos con reservas. Veredicto: reforma moderada, de limpieza. Menos papeles y más herramientas. La última palabra la tiene el gobernador, artículo a artículo, en una sola lista. Se levanta la sesión.','7 votos a favor, uno con reservas. Veredicto: reforma moderada, de limpieza. Menos papeles y más herramientas. La última palabra la tiene el gobernador, artículo a artículo, en una sola lista. Se levanta la sesión.',2.8),
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
