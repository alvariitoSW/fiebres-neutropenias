# Voces de los vídeos del Consejo: texto → WAV mono 22050 Hz, con pronunciación y sonido cuidados.
#   decir(texto, voz, salida, sala=False)
# voz = dict(motor='kokoro'|'piper', modelo, hablante, tono, velocidad)
import os, re, subprocess, tempfile, wave
import numpy as np
from num2words import num2words

AQUI = os.path.dirname(os.path.abspath(__file__))
VOCES = os.path.join(AQUI, 'voces')
MESES = ['enero', 'febrero', 'marzo', 'abril', 'mayo', 'junio', 'julio', 'agosto', 'septiembre', 'octubre',
         'noviembre', 'diciembre']
# Siglas y palabras que los motores leen mal
DICC = [(r'\bPR\b', 'pe erre'), (r'\bPDF\b', 'pe de efe'), (r'\bECG\b', 'electro'), (r'\bHUD\b', 'jud'),
        (r'\bUCI\b', 'uci'), (r'\bR1\b', 'erre uno'), (r'\bapp\b', 'ap'), (r'\btokens\b', 'tóquens'), (r'\btoken\b', 'tóquen'),
        (r'\bwebs\b', 'güebs'), (r'\bpapers\b', 'péipers'), (r'\btuits\b', 'tuíts'), (r'\bMIR\b', 'mir'), (r'\bTEP\b', 'tep'), (r'\bIA\b', 'i a'), (r'(\d)\s?M\b', r'\1 millones')]


def n(x):
    return num2words(int(x), lang='es')


def normaliza(t):
    t = t.replace('«', '').replace('»', '').replace('…', '...')
    for a, b in DICC:
        t = re.sub(a, b, t)
    t = re.sub(r'#\s?(\d+)', lambda m: n(m.group(1)), t)
    t = re.sub(r'\b(\d{1,2})/(\d{1,2})\b', lambda m: f'{n(m.group(1))} de {MESES[int(m.group(2)) - 1]}', t)
    t = re.sub(r'\b(\d{1,2}):00\b', lambda m: f'{n(m.group(1))} horas', t)
    t = re.sub(r'\b(\d+),(\d+)\b', lambda m: f'{n(m.group(1))} coma {n(m.group(2))}', t)
    t = re.sub(r'\b(\d+)-(\d+)\b', r'\1 a \2', t)
    t = re.sub(r'(\d+)\s?%', lambda m: f'{n(m.group(1))} por ciento', t)
    t = re.sub(r'\b(\d+)([A-Z])\b', lambda m: f'{n(m.group(1))} {m.group(2)}', t)
    t = re.sub(r'\b\d+\b', lambda m: n(m.group(0)), t)
    t = re.sub(r'\buno (millones)', r'un \1', t)
    return re.sub(r'\s+', ' ', t).strip()


_kok = None


def _kokoro(texto, v, out):
    global _kok
    if _kok is None:
        from kokoro_onnx import Kokoro
        _kok = Kokoro(os.path.join(VOCES, 'kokoro/model.onnx'), os.path.join(VOCES, 'kokoro/voices.npz'))
    a, sr = _kok.create(texto, voice=v['modelo'], speed=v.get('velocidad', 1.0), lang='es')
    with wave.open(out, 'wb') as f:
        f.setnchannels(1); f.setsampwidth(2); f.setframerate(sr)
        f.writeframes((np.clip(a, -1, 1) * 32000).astype(np.int16).tobytes())


def _piper(texto, v, out):
    subprocess.run(['python3', '-m', 'piper', '-m', os.path.join(VOCES, v['modelo'] + '.onnx'),
                    '-s', str(v.get('hablante', 0)), '--length-scale', str(1 / v.get('velocidad', 1.0)),
                    '--noise-scale', '0.6', '--noise-w-scale', '0.7', '--sentence-silence', '0.3', '-f', out],
                   input=texto.encode(), check=True, capture_output=True)


# Cadena de sonido: quita graves y siseos, da presencia, comprime suave y deja el volumen igual en todos.
# sala=True añade una reverberación corta, como el micrófono de una sala de prensa.
def _pulir(ent, out, tono, sala):
    sr = wave.open(ent).getframerate()
    f = []
    if tono != 1:
        f.append(f'asetrate={int(sr * tono)},aresample={sr},atempo={1 / tono:.4f}')
    f += ['highpass=f=80', 'lowpass=f=10500', 'equalizer=f=250:t=q:w=1:g=-2', 'equalizer=f=3200:t=q:w=1.2:g=2.5',
          'deesser=i=0.4', 'acompressor=threshold=-20dB:ratio=2.5:attack=8:release=120:makeup=2']
    if sala:
        f.append('aecho=0.9:0.6:22|37:0.12|0.07')
    f.append('loudnorm=I=-17:TP=-1.5:LRA=7')
    subprocess.run(['ffmpeg', '-loglevel', 'error', '-y', '-i', ent, '-af', ','.join(f), '-ac', '1', '-ar', '22050',
                    out], check=True)


def decir(texto, v, out, sala=False):
    with tempfile.TemporaryDirectory() as d:
        crudo = os.path.join(d, 'a.wav')
        (_kokoro if v['motor'] == 'kokoro' else _piper)(normaliza(texto), v, crudo)
        _pulir(crudo, out, v.get('tono', 1.0), sala)
