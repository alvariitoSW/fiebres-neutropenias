#!/bin/bash
# uso: fila-normal.sh 'json' → una línea con lo clave del normal
cd /home/user/fiebres-neutropenias; D=autonomo/bloques/eco-mega/herramientas
export ECO_OVR="$1"
a=$(node --import ./$D/ovr-preload.mjs $D/sonda-au.mjs | head -1 | sed 's/pAD [^ ]* //;s/VDsis.*//;s/GC [^ ]* //;s/PAM [^ ]* //')
b=$(node --import ./$D/ovr-preload.mjs $D/calibra-tabla.mjs | grep -E "^normal" | awk -F'|' '{print $3 $5 $6 $8}')
c=$(node --import ./$D/ovr-preload.mjs $D/calibra-tabla.mjs | grep -E "^dilatada" | awk -F'|' '{print $3 $5}')
echo "$1 :: $a ::$b :: dil$c"
