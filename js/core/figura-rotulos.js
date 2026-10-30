// Rótulos sobre una figura (Rx, TC): capa encima de la imagen, sin tocarla.
// Uso: montarRotulos(raiz, datos). Cada `.article-figure[data-rotulos="clave"]` de `raiz` recibe un interruptor
// «Ver rótulos» (apagado al abrir; sin guardar nada) y, al encenderlo, puntos, líneas y etiquetas.
// Las líneas van en un SVG (no admite clics); el texto es HTML posicionado en % para no deformarse.
// La imagen no se mueve: el lightbox sigue abriendo al tocarla. Datos: js/data/merino-neumo-rotulos.js
const NS = 'http://www.w3.org/2000/svg';

export function montarRotulos(raiz, datos) {
    raiz.querySelectorAll('.article-figure[data-rotulos]').forEach(fig => {
        const d = datos[fig.dataset.rotulos];
        const img = fig.querySelector('img');
        if (!d || !img || fig.querySelector('.fig-rot-caja')) return;

        const caja = document.createElement('div');
        caja.className = 'fig-rot-caja';
        img.replaceWith(caja);
        caja.appendChild(img);

        const capa = document.createElement('div');
        capa.className = 'fig-rot-capa';
        capa.hidden = true;
        const svg = document.createElementNS(NS, 'svg');
        svg.setAttribute('viewBox', '0 0 100 100');
        svg.setAttribute('preserveAspectRatio', 'none');
        svg.setAttribute('aria-hidden', 'true');
        capa.appendChild(svg);
        d.rotulos.forEach(r => {
            const l = document.createElementNS(NS, 'line');
            l.setAttribute('x1', r.punto[0]); l.setAttribute('y1', r.punto[1]);
            l.setAttribute('x2', r.et.x); l.setAttribute('y2', r.et.y);
            l.setAttribute('vector-effect', 'non-scaling-stroke');
            svg.appendChild(l);
            const p = document.createElement('span');
            p.className = 'fig-rot-punto';
            p.style.left = r.punto[0] + '%'; p.style.top = r.punto[1] + '%';
            const t = document.createElement('span');
            t.className = 'fig-rot-txt';
            t.textContent = r.texto;
            t.style.top = r.et.y + '%';
            if (r.et.lado === 'r') t.style.right = (100 - r.et.x) + '%'; else t.style.left = r.et.x + '%';
            if (r.ancho) t.style.maxWidth = r.ancho + '%';
            capa.append(p, t);
        });
        caja.appendChild(capa);

        const barra = document.createElement('div');
        barra.className = 'fig-rot-barra';
        const btn = document.createElement('button');
        btn.type = 'button';
        btn.className = 'fig-rot-btn';
        btn.setAttribute('aria-pressed', 'false');
        btn.textContent = 'Ver rótulos';
        const src = document.createElement('div');
        src.className = 'fig-rot-fuente';
        src.hidden = true;
        const lista = d.rotulos.map(r => `<li><strong>${r.texto}</strong>: ${r.nota} <a class="biblio-link" href="${d.pdf}#page=${r.pag}" target="_blank" rel="noopener">pág. ${r.pag}</a></li>`).join('');
        src.innerHTML = `<p>Los rótulos se ven en la figura pequeña; la imagen ampliada va sin ellos.</p><ul>${lista}</ul>`;
        btn.addEventListener('click', () => {
            const on = capa.hidden;
            capa.hidden = !on; src.hidden = !on;
            btn.setAttribute('aria-pressed', String(on));
            btn.textContent = on ? 'Ocultar rótulos' : 'Ver rótulos';
        });
        barra.appendChild(btn);
        const pie = fig.querySelector('.article-figure-caption');
        fig.insertBefore(barra, pie);
        fig.insertBefore(src, pie);
    });
}
