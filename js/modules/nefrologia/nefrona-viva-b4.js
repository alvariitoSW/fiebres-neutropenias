// Nefrona viva · rabdomiólisis (Marino cap. 34, PDF p. 52). Código aparte para no
// engordar nefrona-viva.js; el motor llama a estas funciones desde ganchos de una línea.
let volumenOn = false;

// Qué datos de FRA usa el motor: con el volumen puesto, los de `fraVolumen`.
export function fraDe(s, farm) {
    if (s.id === 'prerrenal' && farm === 'furosemida') return fraPrerrenalFuro(s.fra);
    return s.id === 'rabdo' && volumenOn && s.fraVolumen ? s.fraVolumen : s.fra;
}

// Prerrenal con furosemida (Marino cap. 34, Tabla 34.4 y excepciones, PDF p. 53-54): el diurético
// sube la EFNa (>1 %) y el Na⁺ urinario aunque haya hipoperfusión; la EF de urea no se altera.
// El 2 % es un punto ilustrativo por encima del 1 %; el resto del reparto es el de la prerrenal.
function fraPrerrenalFuro(f) {
    return { ...f, fena: 0.02, diuretico: true, tabla: { ...f.tabla,
        naOrina: '<10 mmol/l; el diurético puede subirlo (>40 mEq/l)', fena: '>1% por el diurético: engaña',
        feurea: '<35%: la EFU no la altera el diurético, dice hipoperfusión' } };
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
    if (!f.volumenOn) { etiqueta(c, 'mioglobina en la luz', 104, 330, rojo, 'left'); return; }
    c.fillStyle = '#7a5230';
    for (const [x, y] of [[92, 405], [96, 425], [90, 445]]) { c.beginPath(); c.moveTo(x, y - 5); c.lineTo(x + 5, y); c.lineTo(x, y + 5); c.lineTo(x - 5, y); c.closePath(); c.fill(); }
    etiqueta(c, 'mioglobina arrastrada', 104, 410, verde, 'left');
}

export function avisosRabdo(estado) {
    if (estado.sit === 'prerrenal' && estado.farm === 'furosemida') return ['El diurético sube la excreción de sodio aunque falte perfusión: la EFNa puede ser >1% y el sodio en orina alto (Marino cap. 34, p. 53-54). La EF de urea no se altera con diuréticos y sigue <35%: es la que dice hipoperfusión (p. 54). La Tabla 34.4 imprime EFNa >12% en la lesión tubular; el texto dice >2% (errata de la fuente).'];
    if (estado.sit !== 'rabdo') return [];
    const av = ['La mioglobina que libera el músculo lesionado puede dañar las células epiteliales del túbulo, quizá por el hierro del hemo (Marino cap. 34, p. 52). Alcalinizar la orina a pH >6,5 con bicarbonato puede inhibir la formación de cilindros en los túbulos, aunque es difícil de lograr (p. 52).',
        'La mioglobinuria es un componente crítico del diagnóstico (tira de sangre positiva sin hematíes en el sedimento); la CK se correlaciona más con la lesión muscular (p. 52). Los índices urinarios aquí son ilustrativos: la EFNa puede ser falsamente baja con mioglobinuria (p. 54).'];
    av.push(volumenOn
        ? 'Con salino 10-20 mL/kg y diuresis de al menos 1 mL/kg/h (el libro imprime «1 mg/kg/hr»: errata, p. 52) el flujo tubular arrastra la mioglobina. Si la oliguria persiste unas horas, se abandona la estrategia para no sobrecargar (p. 52).'
        : 'Sin volumen, la poca orina deja la mioglobina quieta en la luz. Manitol o furosemida van en contra de la reanimación con volumen (p. 52).');
    return av;
}
