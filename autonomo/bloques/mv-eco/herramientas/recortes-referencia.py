# Recorta de cada PDF de docs/ la figura de referencia (pdftoppm -r 110 + recorte en fracciones de la página). uso: python3 -I recortes-referencia.py
import subprocess, tempfile, os
from PIL import Image
R = 'autonomo/bloques/mv-eco/capturas-realismo/'
# clave: (pdf, página del PDF, (x0,y0,x1,y1) en fracción de la página)
REFS = {
 'hp-a4c': ('esc-ers-2022-hipertension-pulmonar-parte1', 27, (0.03, 0.04, 0.97, 0.50)),
 'hp-psax': ('esc-ers-2022-hipertension-pulmonar-parte1', 27, (0.03, 0.04, 0.97, 0.50)),
 'tep-a4c': ('esc-ers-2022-hipertension-pulmonar-parte1', 27, (0.03, 0.04, 0.97, 0.50)),
 'tep-psax': ('esc-ers-2022-hipertension-pulmonar-parte1', 27, (0.03, 0.04, 0.97, 0.50)),
 'normal-a4c': ('lang-2015-cuantificacion-camaras-ase', 12, (0.03, 0.03, 0.97, 0.60)),
 'normal-psax': ('mukherjee-2025-corazon-derecho-hp-ase', 6, (0.03, 0.12, 0.97, 0.52)),
 'normal-plax': ('mukherjee-2025-corazon-derecho-hp-ase', 6, (0.03, 0.12, 0.97, 0.52)),
 'dilatada-a4c': ('mitchell-2019-ett-completa-ase', 8, (0.03, 0.03, 0.55, 0.30)),
 'derrame-sc4c': ('esc-ers-2022-hipertension-pulmonar-parte1', 27, (0.03, 0.04, 0.97, 0.50)),
 'hipertrofia-plax': ('lang-2015-cuantificacion-camaras-ase', 17, (0.50, 0.03, 0.98, 0.34)),
 'hp-a4c-dibujo-hoy': ('mukherjee-2025-corazon-derecho-hp-ase', 32, (0.03, 0.55, 0.97, 0.92)),
}
cache = {}
for k, (pdf, p, (a, b, c, d)) in REFS.items():
    if (pdf, p) not in cache:
        base = tempfile.mktemp(); subprocess.run(['pdftoppm', '-r', '110', '-f', str(p), '-l', str(p), '-png', f'docs/{pdf}.pdf', base], check=True)
        f = [x for x in os.listdir(os.path.dirname(base)) if x.startswith(os.path.basename(base))][0]; cache[(pdf, p)] = Image.open(os.path.join(os.path.dirname(base), f)).convert('RGB')
    im = cache[(pdf, p)]; W, H = im.size
    im.crop((int(a * W), int(b * H), int(c * W), int(d * H))).save(R + f'ref-{k}.png')
print('ok')
