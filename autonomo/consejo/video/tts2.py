# Voces neuronales (Piper) en español. say(texto, voz, hablante, tono, lentitud, salida.wav) → WAV mono 22050 Hz
import subprocess, os, wave, tempfile, numpy as np
VOCES=os.path.join(os.path.dirname(os.path.abspath(__file__)),'voces')
def say(texto, voz, hablante, tono, lentitud, out):
    with tempfile.TemporaryDirectory() as d:
        crudo=os.path.join(d,'a.wav')
        subprocess.run(['python3','-m','piper','-m',os.path.join(VOCES,voz+'.onnx'),'-s',str(hablante),
            '--length-scale',str(lentitud),'--sentence-silence','0.25','-f',crudo],input=texto.encode(),check=True,capture_output=True)
        sr=wave.open(crudo).getframerate()
        filtro=f'asetrate={int(sr*tono)},aresample=22050,atempo={1/tono:.4f}' if tono!=1 else 'aresample=22050'
        subprocess.run(['ffmpeg','-loglevel','error','-y','-i',crudo,'-af',filtro,'-ac','1','-ar','22050',out],check=True)
    w=wave.open(out);a=np.frombuffer(w.readframes(w.getnframes()),np.int16).astype(np.float32);w.close()
    a=a*(24000/max(1,np.percentile(np.abs(a),99.9)))
    with wave.open(out,'wb') as f: f.setnchannels(1);f.setsampwidth(2);f.setframerate(22050);f.writeframes(np.clip(a,-32767,32767).astype(np.int16).tobytes())
