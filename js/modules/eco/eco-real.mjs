// Eco real de uso libre junto a la nuestra (solo las vistas con un archivo cuya licencia se comprobó en su página de Commons).
// Autor y licencia, tal como los da la página del archivo. Nunca CAMUS ni EchoNet; nunca un dibujo.
const COMMONS = 'https://commons.wikimedia.org/wiki/File:';
export const ECO_REAL = {
  a4c: [
    { tipo: 'imagen', src: 'img/real/a4c-dominio-publico.jpg', ancho: 636, alto: 434,
      pie: 'Apical de 4 cámaras, eco real. Ventrículos amplios: no es un corazón normal de referencia.',
      autor: 'sin autor en la página del archivo', licencia: 'dominio público', licenciaUrl: '',
      original: COMMONS + 'Echocardiogram_4chambers.jpg', archivo: 'Echocardiogram 4chambers.jpg' },
    { tipo: 'video', src: ['img/real/a4c-latido.webm', 'img/real/a4c-latido.mp4'], poster: 'img/real/a4c-dominio-publico.jpg',
      pie: 'Apical de 4 cámaras en movimiento (eco real, bucle recortado y reducido).',
      autor: 'Fruehaufsteher2 (obra propia)', licencia: 'CC BY-SA 3.0', licenciaUrl: 'https://creativecommons.org/licenses/by-sa/3.0/',
      original: COMMONS + 'Ultrasound_of_human_heart_apical_4-cahmber_view.gif', archivo: 'Ultrasound of human heart apical 4-cahmber view.gif' },
  ],
  plax: [
    { tipo: 'imagen', src: 'img/real/plax-yale.png', ancho: 232, alto: 122,
      pie: 'Paraesternal eje largo, eco real. Recorte de la parte de eco de una lámina del atlas de Yale (se quitó el dibujo del corazón que la acompaña).',
      autor: 'Patrick J. Lynch (ilustrador) y C. Carl Jaffe (cardiólogo), Yale University School of Medicine', licencia: 'CC BY 2.5', licenciaUrl: 'https://creativecommons.org/licenses/by/2.5/',
      original: COMMONS + 'LeftParasternalLongAxis.gif', archivo: 'LeftParasternalLongAxis.gif' },
  ],
};
const url = (r) => new URL(r, import.meta.url).href;
const esc = (s) => String(s).replace(/[&<>"]/g, c => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;' }[c]));

export function pintarEcoReal(k) {
  const det = document.getElementById('cv-eco-real'), caja = document.getElementById('cv-eco-real-lista');
  if (!det || !caja) return;
  const lista = ECO_REAL[k] || [];
  det.hidden = !lista.length;
  caja.innerHTML = lista.map(it => {
    const medio = it.tipo === 'video'
      ? `<video style="display:block;width:100%;height:auto;background:var(--bg-main)" muted loop playsinline autoplay preload="metadata" poster="${url(it.poster)}" aria-label="${esc(it.pie)}">${it.src.map(s => `<source src="${url(s)}" type="video/${s.endsWith('webm') ? 'webm' : 'mp4'}">`).join('')}</video>`
      : `<img loading="lazy" src="${url(it.src)}" width="${it.ancho}" height="${it.alto}" alt="${esc(it.pie)}">`;
    const lic = it.licenciaUrl ? `<a style="color:var(--accent-yellow)" href="${it.licenciaUrl}" target="_blank" rel="noopener">${it.licencia}</a>` : it.licencia;
    return `<div class="cv-real-fig"><div class="article-figure">${medio}</div><div class="article-figure-caption">${esc(it.pie)}<br>Autor: ${esc(it.autor)} · Licencia: ${lic} · <a style="color:var(--accent-yellow)" href="${it.original}" target="_blank" rel="noopener">Ver original ↗</a></div></div>`;
  }).join('');
}
