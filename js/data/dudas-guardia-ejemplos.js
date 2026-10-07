// Dudas de guardia — 3 entradas de ejemplo, datos puros sin DOM.
// Sirven para mostrar cómo se ve una entrada real antes de que lleguen
// las primeras dudas de verdad del usuario (ver dudas-guardia.js) — nunca
// se editan ni se eliminan desde la UI, a diferencia de las dudas que el
// propio usuario añade con el formulario, que sí viven en localStorage.
export const dudasEjemplo = [
    {
        id: 'ejemplo-1',
        tema: 'Electrolitos',
        pregunta: '¿Por qué no se pueden pasar más de 3 mEq/h de K⁺ por vía periférica, aunque el paciente lo necesite rápido?',
        respuesta: 'El límite no es por la cantidad total de K⁺, es por la concentración e irritación venosa: a ese ritmo por vía periférica se produce flebitis química y dolor real, y el margen de seguridad frente a arritmia es menor si el bolo llega muy concentrado a una vena pequeña. Por vía central sí se admite hasta 20 mEq/h (salvo K<2, donde el propio protocolo permite más) precisamente porque la dilución en un vaso de mayor calibre lo hace más seguro.',
        fuente: 'Manual UMI — Ficha II, reposición de K⁺',
        fecha: '2026-10-01',
        ejemplo: true,
    },
    {
        id: 'ejemplo-2',
        tema: 'Shock séptico',
        pregunta: 'En el cóctel de Marik (vitamina C + tiamina + hidrocortisona), ¿importa el orden en que se pasan los 3 fármacos?',
        respuesta: 'No hay un orden obligatorio entre ellos, pero conviene dar la tiamina antes o junto con la vitamina C — la vitamina C en dosis alta puede favorecer la formación de oxalato, y la tiamina participa en su metabolismo, así que separarlos innecesariamente no aporta nada. Lo que sí importa es la duración: 4 días para vitamina C/tiamina, 7 para la hidrocortisona — no se acortan aunque el paciente mejore antes.',
        fuente: 'Manual UMI — Ficha IV, shock séptico',
        fecha: '2026-10-01',
        ejemplo: true,
    },
    {
        id: 'ejemplo-3',
        tema: 'Cirugía cardiaca',
        pregunta: 'En sangrado post-cirugía cardiaca, ¿hay que esperar el fibrinógeno de laboratorio antes de pedir crioprecipitado, o me fío ya del TEG?',
        respuesta: 'El algoritmo guiado por TEG está pensado justo para no esperar — la amplitud máxima del tromboelastograma ya da la rama de decisión (<45 → desmopresina; si además el fibrinógeno de laboratorio confirma <150 mg/dl → crioprecipitado) sin esperar los 45-60 minutos típicos de un fibrinógeno convencional, tiempo que en un sangrado activo no siempre se tiene. El analítico sirve para confirmar después, no para bloquear la decisión en el momento agudo.',
        fuente: 'Manual UMI — Ficha XII, cirugía cardiaca',
        fecha: '2026-10-01',
        ejemplo: true,
    },
];
