// Genera autonomo/bloques/b3/frases-m.md: cada frase nueva de la Mayéutica del pulmón con su cita (REGLAS §1.11).
import { writeFileSync } from 'node:fs';
const M = await import(new URL('../../../../js/data/pulmon-vivo-mayeutica.js', import.meta.url));
const t = (x) => String(x).replace(/<[^>]+>/g, '').replace(/\s+/g, ' ').trim();
const pag = (c) => `${M.FICHAS[c.f][4]}, ${/[-,]/.test(String(c.p)) ? 'pp.' : 'p.'} ${c.p} (${c.sitio})`;
const todas = [...M.PREGUNTAS, ...M.CASOS.flatMap((c) => c.pasos.map((p) => p.pregunta))];
let md = '# Frases nuevas de la Mayéutica del pulmón (M)\nCada frase de mecanismo o conducta escrita por el constructor, con la página que la apoya. «Sin cita propia» = ilustrativo o fisiología general, anotado en la pregunta.\n';
let con = 0, sin = 0; const sinLista = [];
for (const q of todas) {
  const fu = [...new Set([].concat(q.fuente || [], (q.frases || []).map((f) => f.fuente)).filter(Boolean).map(pag))];
  md += `\n## ${q.id} · ${q.corto}\nFuentes de la pregunta: ${fu.join('; ')}\n`;
  const item = (tipo, txt, cita) => { md += `- ${tipo}: ${t(txt)} → ${cita || '**SIN CITA PROPIA**'}\n`; cita ? con++ : (sin++, sinLista.push(q.id + ' ' + tipo)); };
  item('enunciado', q.enunciado, q.org ? `${q.org}` : null);
  for (const o of q.opciones || []) { const m = String(o.porque || o.t).match(/\(([^()]*, pp?\. [^()]*)\)\s*<\/span>/); item(o.ok ? 'correcta' : 'distractor', o.ok ? o.t : o.porque, o.ok ? fu[0] : m && m[1]); }
  for (const f of q.frases || []) item(f.mal ? 'frase falsa y su corrección' : 'frase cierta', f.mal ? f.c : f.t, f.fuente ? pag(f.fuente) : null);
  for (const [i, pt] of (q.puntos || []).entries()) item('punto', pt, q.fuente[i] ? pag(q.fuente[i]) : null);
  if (q.explicacion) item('explicación', q.explicacion, fu[0]);
}
md += `\n---\nCon cita: ${con} · sin cita propia: ${sin}${sinLista.length ? ' (' + sinLista.join(', ') + ')' : ''}\n`;
writeFileSync(new URL('../frases-m.md', import.meta.url), md); console.log(con, sin, sinLista.join(' | '));
