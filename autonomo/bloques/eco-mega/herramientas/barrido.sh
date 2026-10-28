#!/bin/bash
# uso: barrido.sh nombre 'json'  → fallos de la suite rápida y J1/J2 con ese ajuste de BASE
cd /home/user/fiebres-neutropenias; D=autonomo/bloques/eco-mega/herramientas; O=/tmp/plan-socialista/eco-calibra-a/barrido/$1
export ECO_OVR="$2"
node --import ./$D/ovr-preload.mjs $D/sonda-au.mjs > $O.txt
node --import ./$D/ovr-preload.mjs --test js/modules/eco/pruebas/{motor,escenarios,enfermedad,paciente-posible,doppler,atlas,taponamiento,geometria}.test.mjs 2>&1 | grep -E "^not ok" | grep -v "# TODO" | cut -c1-200 >> $O.txt
node --import ./$D/ovr-preload.mjs $D/calibra-tabla.mjs | grep -E "^(normal|dilatada|tep:def|derrame:def|hpcronica:1)" | cut -c1-250 >> $O.txt
