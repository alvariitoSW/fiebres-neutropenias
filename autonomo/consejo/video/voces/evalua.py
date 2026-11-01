import sys,os,re,json,wave,numpy as np
sys.path.insert(0,os.path.dirname(os.path.dirname(os.path.abspath(__file__))))
from voz import decir, normaliza
from faster_whisper import WhisperModel
C={'piper-davefx':dict(motor='piper',modelo='es_ES-davefx-medium'),
   'piper-sharvard-h':dict(motor='piper',modelo='es_ES-sharvard-medium',hablante=0),
   'piper-sharvard-m':dict(motor='piper',modelo='es_ES-sharvard-medium',hablante=1),
   'piper-daniela':dict(motor='piper',modelo='es_AR-daniela-high'),
   'piper-claude':dict(motor='piper',modelo='es_MX-claude-high'),
   'piper-ald':dict(motor='piper',modelo='es_MX-ald-medium'),
   'kokoro-dora':dict(motor='kokoro',modelo='ef_dora'),
   'kokoro-alex':dict(motor='kokoro',modelo='em_alex'),
   'kokoro-santa':dict(motor='kokoro',modelo='em_santa')}
F=['Buenas tardes, estimados ciudadanos y ciudadanas. Comparezco ante ustedes para comunicarles los acuerdos del Consejo de Ministros.',
   'En absoluto. Llevamos el 61 % de la semana, y Hacienda vigila que no haya gasto superfluo. Si se agota, todo se para hasta el lunes a las 14:00.',
   'Porque con un 8,75 aprobábamos, y con un 9,5 enseñamos. El gobernador quiere ser pionero en estudiar con modelos vivos.',
   'Siguiente paso: fusionar la PR #51. Lo que espera de ti, gobernador: la captura de Uso, el sábado por la noche.']
def limpia(t): t=normaliza(t).lower(); t=re.sub(r'[^a-záéíóúüñ ]',' ',t); return t.split()
def wer(r,h):
    d=np.arange(len(h)+1)
    for i,x in enumerate(r,1):
        p=d.copy(); d[0]=i
        for j,y in enumerate(h,1): d[j]=min(p[j]+1,d[j-1]+1,p[j-1]+(x!=y))
    return d[-1]/len(r)
def f0(path):
    w=wave.open(path);sr=w.getframerate();a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(float);fr=int(.04*sr);o=[]
    for i in range(0,len(a)-fr,fr//2):
        x=a[i:i+fr]-a[i:i+fr].mean()
        if np.sqrt((x**2).mean())<800: continue
        c=np.correlate(x,x,'full')[fr-1:];lo,hi=int(sr/350),int(sr/70);k=lo+np.argmax(c[lo:hi])
        if c[k]>.3*c[0]: o.append(sr/k)
    return float(np.median(o))
m=WhisperModel('small',device='cpu',compute_type='int8')
res={}
for k,v in C.items():
    ws=[];dur=0
    for i,f in enumerate(F):
        p=f'prueba/{k}-{i}.wav'; decir(f,v,p)
        import subprocess; au=np.frombuffer(subprocess.run(['ffmpeg','-loglevel','error','-i',p,'-f','s16le','-ac','1','-ar','16000','-'],capture_output=True).stdout,np.int16).astype(np.float32)/32768
        segs,_=m.transcribe(au,language='es',beam_size=5); h=' '.join(s.text for s in segs)
        ws.append(wer(limpia(f),limpia(h))); w=wave.open(p); dur+=w.getnframes()/w.getframerate()
        if i==3: print(k,'→',h.strip())
    palabras=sum(len(limpia(f)) for f in F)
    res[k]=dict(wer=round(float(np.mean(ws))*100,1),f0=round(f0(f'prueba/{k}-0.wav')),ppm=round(palabras/dur*60))
    print(k,res[k],flush=True)
json.dump(res,open('prueba/resultados.json','w'),indent=1)
