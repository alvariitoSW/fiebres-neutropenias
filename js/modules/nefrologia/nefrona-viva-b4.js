// Nefrona viva · rabdomiólisis (Marino cap. 34, PDF p. 51-52). Código aparte para no
// engordar nefrona-viva.js; el motor llama a estas funciones desde ganchos de una línea.
let volumenOn = false;

// Qué datos de FRA usa el motor: con el volumen puesto, los de `fraVolumen`.
export function fraDe(s) {
    return s.id === 'rabdo' && volumenOn && s.fraVolumen ? s.fraVolumen : s.fra;
}

// Botón único (se crea una vez y se repinta): suero salino con diuresis objetivo.
export function montarVolumen(raiz, estado, actualizar) {
    const antes = raiz.querySelector('#nv-avisos');
    if (!antes || raiz.querySelector('#nv-rabdo-volumen')) return;
    const b = document.createElement('button');
    b.type = 'button'; b.id = 'nv-rabdo-volumen'; b.className = 'visual-mini'; b.hidden = true;
    b.addEventListener('click', () => { volumenOn = !volumenOn; actualizar(); });
    antes.before(b);
}

// Se llama en cada actualización: muestra/oculta el botón y lo repinta.
export function repintarVolumen(raiz, estado) {
    if (estado.sit !== 'rabdo') volumenOn = false;
    const b = raiz.querySelector('#nv-rabdo-volumen');
    if (!b) return;
    b.hidden = estado.sit !== 'rabdo';
    b.classList.toggle('on', volumenOn);
    b.setAttribute('aria-pressed', volumenOn);
    b.textContent = volumenOn ? '💧 Salino 10-20 mL/kg: puesto (quitar)' : '💧 Poner salino 10-20 mL/kg';
}

// Dibujo de la luz del colector: forma + rótulo (nunca solo color).
export function dibujarRabdo(c, f, etiqueta, rojo, verde) {
    if (!f.rabdo) return;
    if (!f.volumenOn) { etiqueta(c, 'cilindros de mioglobina', 104, 330, rojo, 'left'); return; }
    c.fillStyle = '#7a5230';
    for (const [x, y] of [[92, 405], [96, 425], [90, 445]]) { c.beginPath(); c.moveTo(x, y - 3); c.lineTo(x + 3, y); c.lineTo(x, y + 3); c.lineTo(x - 3, y); c.closePath(); c.fill(); }
    etiqueta(c, 'mioglobina arrastrada', 104, 410, verde, 'left');
}

export function avisosRabdo(estado) {
    if (estado.sit !== 'rabdo') return [];
    const av = ['La mioglobina filtrada lesiona el epitelio del túbulo proximal (quizá por el hierro del hemo) y se aglomera en cilindros que obstruyen la luz (Marino cap. 34, p. 51; formación de cilindros, p. 52).',
        'La CK sola no predice el riesgo renal: se correlaciona más con la lesión muscular. La mioglobinuria sí: tira de sangre positiva sin hematíes en el sedimento (p. 52).'];
    av.push(volumenOn
        ? 'Con salino 10-20 mL/kg y diuresis de al menos 1 mL/kg/h el flujo tubular arrastra la mioglobina. Si la oliguria persiste unas horas, se abandona la estrategia para no sobrecargar (p. 52).'
        : 'Sin volumen, la poca orina deja la mioglobina quieta en la luz. Manitol o furosemida van en contra de la reanimación con volumen (p. 52).');
    return av;
}
