#!/usr/bin/env bash
# Prepara un contenedor nuevo para hacer los vídeos del Consejo: motores de voz y modelos (≈570 MB, no se suben).
#   bash autonomo/consejo/video/instalar.sh
# Licencias: Piper, MIT (cada voz con su MODEL_CARD); Kokoro, Apache 2.0.
set -e
AQUI="$(cd "$(dirname "$0")" && pwd)"
V="$AQUI/voces"
mkdir -p "$V/kokoro"

# 1. Motores. num2words depende de docopt, que no compila con el setuptools de Debian: se copia a mano.
if ! python3 -c "import docopt" 2>/dev/null; then
  T=$(mktemp -d); pip download -q docopt==0.6.2 --no-deps -d "$T"; tar xzf "$T"/docopt-0.6.2.tar.gz -C "$T"
  cp "$T"/docopt-0.6.2/docopt.py "$(python3 -c 'import site;print(site.getsitepackages()[0])')/"
fi
pip install -q --no-deps num2words
pip install -q kokoro-onnx piper-tts
python3 -c "import piper, kokoro_onnx, num2words"

# 2. Voces de Piper (todas de España; la mexicana solo para el personaje de Exteriores)
H=https://huggingface.co/rhasspy/piper-voices/resolve/main
for v in es_ES-davefx-medium es_ES-sharvard-medium es_MX-ald-medium; do
  L=${v%%-*}; n=$(echo "$v" | cut -d- -f2); q=$(echo "$v" | cut -d- -f3)
  for ext in onnx onnx.json; do
    [ -s "$V/$v.$ext" ] || curl -sSfL --retry 3 -o "$V/$v.$ext" "$H/${L%%_*}/$L/$n/$q/$v.$ext"
  done
done

# 3. Kokoro (solo tiene voces latinoamericanas: no se usa para nadie que hable español de España)
K=https://huggingface.co/onnx-community/Kokoro-82M-v1.0-ONNX/resolve/main
[ -s "$V/kokoro/model.onnx" ] || curl -sSfL --retry 3 -o "$V/kokoro/model.onnx" "$K/onnx/model.onnx"
for v in ef_dora em_alex em_santa; do
  [ -s "$V/kokoro/$v.bin" ] || curl -sSfL --retry 3 -o "$V/kokoro/$v.bin" "$K/voices/$v.bin"
done
python3 - "$V/kokoro" <<'EOF'
import sys, numpy as np, os
d = sys.argv[1]
np.savez(os.path.join(d, 'voices.npz'),
         **{v: np.fromfile(os.path.join(d, v + '.bin'), dtype=np.float32).reshape(-1, 1, 256)
            for v in ['ef_dora', 'em_alex', 'em_santa']})
EOF
echo "Listo: motores y voces instalados en $V"
