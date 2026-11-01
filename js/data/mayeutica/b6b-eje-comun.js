// Piezas comunes del Estudiar (Texto | Estudiar) del grupo 6H · El eje que calla (Marino, cap. 51): fuentes y constructores de preguntas.
// Datos puros. Formato: el de js/data/mayeutica/b1-fluidos.js (y b6b-higado.js, que es el modelo). La pinta js/core/mayeutica.js.

export const NE = 'docs/marino-2024-nutricion-endocrino-caps48-51.pdf';   // el cap. 51 es PDF pág. 47-58; las págs. de aquí son las del PDF
export const pdf = (p, t = `PDF pág. ${p}`) => `<a class="biblio-link" href="${NE}#page=${p}" target="_blank" rel="noopener">${t}</a>`;
export const web = (t, u) => `<a class="biblio-link" href="${u}" target="_blank" rel="noopener">${t}</a>`;
export const YOUNES = web('Younes 2017', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC5682381');
export const HUANG = web('Huang-Bianco 2008', 'https://pmc.ncbi.nlm.nih.gov/articles/PMC3133953');
export const LAZUL = web('Libro Azul, cap. 45, p. 4-6', 'docs/libro-azul-seccion-vi-endocrino.pdf#page=4');
// El eje vivo: data-eje-vivo="<paciente>[:paso]". La clave `ejeVivo` aún no está en MODELOS de js/core/mayeutica.js: el botón
// «Compruébalo» ya funciona; el paso «Juega» lo listará cuando esa línea exista (lo anota el informe).
export const V = (pac, paso = 0, texto) => ({ especialidad: 'libros', view: 'ejeVivo', ejeVivo: paso ? `${pac}:${paso}` : pac, ...(texto ? { texto } : {}) });
// Test: `ok` es la buena, `malas` son [texto, qué le habría pasado al paciente]; `pos` la coloca (la app las baraja).
export const T = (id, corto, fuente, enunciado, ok, malas, explicacion, pos = 0, extra = {}) => {
  const o = malas.map(([t, porque]) => ({ t, porque })); o.splice(pos, 0, { t: ok, ok: true });
  return { id, corto, tipo: 'test', fuente, enunciado, opciones: o, explicacion, ...extra };
};
export const D = (id, corto, fuente, enunciado, puntos, explicacion, extra = {}) => ({ id, corto, tipo: 'destapa', fuente, enunciado, cuantas: puntos.length === 2 ? 'son dos cosas' : 'son tres cosas', puntos, explicacion, ...extra });
export const E = (id, corto, fuente, enunciado, frases, explicacion, extra = {}) => ({ id, corto, tipo: 'error', fuente, enunciado, frases, explicacion, ...extra });
export const mal = (t, c) => ({ t, mal: true, c });
export const ILUS = 'ilustrativo: cifra del caso, no de la ficha';
