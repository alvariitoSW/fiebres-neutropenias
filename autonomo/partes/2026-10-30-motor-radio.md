# 2026-10-30 · motor-radio (B-051a, primer trozo)

**Resultado:** hecha · informe publicado (sin PR: no toca la app; precedente `radio-informe`, Consejo 12.ª): https://claude.ai/artifact/ExU2yBLHa3QQyPL3ABoHpp
**Vueltas:** 2 · **Jueces:** pruebas ✓ (62 estados; 5.000 casos) · móvil ✓ (390/360, 0 errores) · auditoría ✓ (2 graves corregidos)

## Qué se hizo
Tres maquetas de una Rx de tórax portátil dibujada por la app sobre una pieza común (`autonomo/maquetas/radio-rx/`):
A «capas y mandos» (9 mandos), B «corte + rayo» (por qué el supino engaña) y C «lee esta placa generada» (A-E tocando
la zona y «encuentra el error»). Informe con topes con fuente de cada mando, recomendación y coste del motor por trozos
(≈22 M). Revisión del encargo (Explore): 3 graves resueltos en el plan sin preguntar (publicar y probar, cifras de tubo/vía/sonda, auditor a 25 pasos).

## Qué no se pudo hacer o leer
Nada sin leer. La cifra «la placa no ve hasta el 50 %» venía citada a M27 pág. 26 en el plan; es de Marino cap. 2,
pág. 34 (comprobado). La S 96 % / E 99 % del CO₂ espirado para la sonda no se encontró en NU pág. 29: no se usa.

## Para el usuario
- Elegir maqueta (recomendación del profesor: B con los mandos de A; C como Mayéutica) y si sigue el motor (trozo 2: ≈6 M).
- «Vía en la yugular contralateral» del encargo: Marino dice yugular del mismo lado (AV pág. 37); el mando usa Marino.
- Las maquetas usan las figs. 49.2 y 49.3 (sonda), que en `fusiones-30-10` quedaron fuera por crédito a terceros: decides tú si se quedan al llevarlo a la app.

## Visto de paso (no tocado)
- `radio-torax.html` (PR #62) cita bien la cifra del 50 % a AV pág. 34; el error estaba solo en el plan.
- Menores del profesor: `radio-rx-c.html` l.14 conserva `max-height:34vh` inline; el mapa letra→zona de C es fijo (rutina al 3.er caso).

## Propuestas sobre las reglas
- Cuando el profesor da cifras «ya localizadas» en el plan, el constructor las recoteja contra el PDF antes de usarlas (cazó 2 este día). Ya lo hace la lista del constructor; sin regla nueva.

## Vueltas
| Pieza | Vuelta | Nota mínima | Modelo | Pasos | Equiv. | Qué falló |
|---|---|---|---|---|---|---|
| Pieza común + A | 1 | 8,3 | opus | 50 | 0,90 M | pulmón colapsado lateral, veladura supina con borde |
| B y C | 1 | B 9,0 · C 8,1 | sonnet | 22 | 0,55 M | C: rótulo de postura delataba la E, sin zona tocable ni cúpulas |
| Arreglos pieza común + A | 2 | A 8,8 | sonnet | 25 | 0,30 M | — |
| Arreglos C | 2 | C 8,8 | sonnet | 16 | 0,26 M | — |

## Gasto
Total **3,7 M** (presupuesto 4,0 M, −7,5 %). Por papel: constructor sonnet 1,1 M (30 %) · constructor opus 0,90 M (24 %) ·
director 0,90 M (24 %) · profesor fable 0,51 M (14 %) · auditor 0,19 M · Explore 0,11 M. Los 3 que más: constructor opus
pieza común (0,90), director (0,90), constructor B y C (0,55). El director se pasó (0,9 frente a 0,5): montar y comprobar
el paquete del informe; la próxima vez, un script de empaquetado en `autonomo/maquetas/radio-rx/` reutilizable.

## Cuentas
Presupuesto 4,0 M (Hacienda: sin verificador ni revisor, B y C en un encargo, director 0,5) · gastado 3,7 M · desvío −7,5 %.
Tarea fuera de bloque (B-051a, ≈3-4 M aprobado).
