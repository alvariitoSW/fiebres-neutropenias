// Datos de «El paciente de la cama 4». Fuente: Marino 2024, cap. 39 (docs/marino-2024-abdomen-temperatura-caps39-44.pdf, p. = página del PDF).
export const PDF = '../../docs/marino-2024-abdomen-temperatura-caps39-44.pdf';
// Página → párrafo exacto de la ficha (js/modules/libros/marino-abdomen.html)
export const FICHA = { 3: 'ma-fha-paracetamol', 5: 'ma-fha-hemodinamica', 6: 'ma-eh-nh3', 7: 'ma-eh-lactulosa', 8: 'ma-eh-cvvh', 9: 'ma-var-endoscopia', 10: 'ma-var-tips' };
export const FICHA_EXTRA = { '6t': 'ma-tabla-39-2', '7a': 'ma-eh-amonio', '7r': 'ma-eh-rifaximina', '9t': 'ma-tabla-39-3' };
export const IDEA = ['El amonio nace en el intestino; el hígado lo convierte en urea y, si no puede, llega al astrocito: glutamina, agua y encefalopatía. Se lee en la cara (West Haven).', '6'];
export const PRESETS = {
  hilario: { nombre: 'Hilario · cirrótico', s: { func: 52, dep: 0, rif: 0, cvvh: false, tips: false, alb: 2.4, oligu: false, sys: 85, dia: 50, fc0: 118 }, txt: 'Hilario, 58 años, cirrótico alcohólico con hematemesis: PA 85/50, FC 118, albúmina 2,4 g/dL.' },
  sano: { nombre: 'Hígado sano', s: { func: 100, dep: 0, rif: 0, cvvh: false, tips: false, alb: 4, oligu: false, sys: 120, dia: 75, fc0: 72 }, txt: 'Sin enfermedad hepática: el amonio normal (<60 µmol/L, p. 7) lo convierte el hígado en urea.' },
  fulminante: { nombre: 'Fallo agudo', s: { func: 20, dep: 0, rif: 0, cvvh: false, tips: false, alb: 2.8, oligu: true, sys: 100, dia: 55, fc0: 105 }, txt: 'Paciente ilustrativo con fallo hepático agudo y oliguria: las tres puertas de la CVVH se miran en el mando.' },
};
export const FUENTES = [['Fisiopatología: amonio, astrocito, glutamina', 6], ['Criterios de West Haven (Tabla 39.2)', 7], ['Amonio arterial >150 µmol/L (normal <60)', 7], ['Lactulosa, rifaximina', 7], ['CVVH: tres puertas', 8], ['Albúmina 5 % y Ringer lactato', 5], ['Hemorragia por varices (Tabla 39.3)', 9], ['TIPS', 10]];
export const NOTAS = [
  ['fuente no lo dice', 'Marino no da la cifra de amonio que produce cada grado de West Haven ni cuánto baja la CVVH: los números del monitor entre 40 y 300 µmol/L son <b>ilustrativos</b>; la fuente solo marca 60 (normal) y 150 (riesgo de edema), p. 7. La relación amonio-encefalopatía existe «en muchos casos, pero no en todos» (p. 7).'],
  ['fuentes discrepan', 'Ceftriaxona: la Tabla 39.3 dice 1 g/día y el texto de la misma página, 2 g/día (p. 9). Se muestran las dos.'],
  ['fuente no lo dice', 'La cara y el temblor (asterixis) del dibujo son <b>ilustrativos</b>: la fuente describe el grado con palabras (Tabla 39.2) y nombra el temblor en «aleteo» (p. 6), no su dibujo. La lactulosa por encima de 3 deposiciones y la hipovolemia a 6-7 son fisiología general; la fuente dice solo «reducir o parar si hay diarrea» (p. 7).'],
  ['opinión del autor', 'El volumen de 500 mL por toque y el aumento de PA por bolo son ilustrativos; lo que sí es de la ficha: la albúmina 5 % deja ~70 % en el vaso (p. 5) y el objetivo es una PAM de 65 mmHg (p. 9).'],
];
export const PROFUNDIZAR = ['Peritonitis bacteriana espontánea y síndrome hepatorrenal: la ascitis de la lupa Abdomen lleva a esas fichas (p. 10-13), aún sin modelo vivo.', 'Fallo hepático agudo por paracetamol y NAC (p. 3): vía cerrada del hepatocito, se abre en Tóxicos.', 'Trasplante hepático (p. 8): lo decide el especialista; aquí solo se avisa de consultarlo.'];
export const CRECERA = ['Las vías cerradas del hepatocito (paracetamol, cetonas, lactato, alcoholes) se abrirán en otras fichas.', 'El filtro vivo se enlazará desde la CVVH con el amonio ya cargado.'];
export const fichaDe = (c) => { const k = String(c); return FICHA_EXTRA[k] || FICHA[parseInt(k, 10)] || FICHA[6]; };
