// Filtro vivo · estado «K⁺ urgente»: cuánto baja el potasio sérico con cada técnica de TRR.
// Datos puros (sin DOM) + el trozo de pantalla del mando, para que lo use filtro-vivo.js y la prueba de extremos.
//
// De la fuente (Marino, The ICU Book 5.ª ed.):
//  · Hemodiálisis: «1 mEq/L menos de K⁺ sérico tras 1 h y 2 mEq/L menos tras 3 h» (Cap. 36, electrolitos, PDF p. 28-29).
//  · Una sesión dura unas 4 h (Cap. 34, PDF p. 57).
//  · Hemofiltración: la depuración de solutos pequeños es mucho más lenta que en la HD, «no es adecuada para
//    la hiperpotasemia que amenaza la vida» (Cap. 34, PDF p. 57-58). La fuente NO da cifra: el ritmo continuo y el de
//    la híbrida son ilustrativos.
//  · Calcio IV: tratamiento de elección contra la cardiotoxicidad; indicado con K⁺ > 6,5 mEq/L con o sin cambios del
//    ECG (Cap. 36, tabla 36.3, PDF p. 26-27); su efecto dura 30-60 min.
// Todo lo demás (suelo de 3,5 mEq/L, ritmo tras la 3.ª hora, rango 5,5-8,5 del mando) es ilustrativo.

export const K_MIN = 5.5, K_MAX = 8.5, H_MAX = 4;
export const K_SUELO = 3.5;           // límite bajo de la normalidad: ilustrativo; no se baja de aquí
export const K_CALCIO = 6.5;          // Cap. 36, tabla 36.3 (PDF p. 26-27)
const RITMO_CONT = 0.2;               // mEq/L por hora, ilustrativo (la fuente no da cifra)
const FACTOR_HIB = 0.5;               // la híbrida, a medio camino de la HD: ilustrativo

// Descenso acumulado del K⁺ (mEq/L) de la HD tras h horas: 1 en la 1.ª h y 2 a las 3 h (fuente); después, el mismo ritmo (ilustrativo).
const descensoHD = h => h <= 1 ? h : 1 + (h - 1) * 0.5;
export function descenso(modo, h) {
    if (modo === 'hd') return descensoHD(h);
    if (modo === 'hib') return descensoHD(h) * FACTOR_HIB;
    return RITMO_CONT * h;
}
// K⁺ sérico esperado: nunca por debajo del suelo ni por encima del de partida.
export function kEsperado(k0, h, modo) { return Math.max(Math.min(k0, K_SUELO), Math.round((k0 - descenso(modo, h)) * 10) / 10); }
// Hora a la que se llega al suelo (para apagar el reloj): 4 h como máximo.
export function horaTope(k0, modo) {
    for (let h = 0; h <= H_MAX + 1e-9; h += 0.1) if (kEsperado(k0, h, modo) <= K_SUELO) return Math.round(h * 10) / 10;
    return H_MAX;
}
export const fuenteModo = modo => modo === 'hd' ? 'ficha' : 'ilustrativo';

export const HTML_K = (e) => `
    <div class="tfg-slider-row"><label>K⁺ de partida</label><input type="range" data-fv-rango="k0" min="${K_MIN}" max="${K_MAX}" step="0.1" value="${e.k0}"><span data-fv-out="k0">${e.k0} mEq/L</span></div>
    <div class="tfg-slider-row"><label>Horas de tratamiento</label><input type="range" data-fv-rango="horas" min="0" max="${H_MAX}" step="0.5" value="${e.horas}"><span data-fv-out="horas">${e.horas} h</span></div>
    <div class="nv-chips gl-mandos"><button type="button" class="visual-mini" data-fv="calcio" data-valor="no" aria-pressed="false">Sin calcio IV</button><button type="button" class="visual-mini" data-fv="calcio" data-valor="si" aria-pressed="false">Calcio IV puesto</button></div>`;

// Lecturas y avisos del estado; `enlace` es la función de «Texto ↓» del filtro.
export function lecturasK(e, nombreModo) {
    const k = kEsperado(e.k0, e.horas, e.modo), ficha = e.modo === 'hd';
    const lento = e.modo === 'hf';
    const valor = lento ? `${k.toString().replace('.', ',')} mEq/L · más lenta (la fuente no da cifra)` : `${k.toString().replace('.', ',')} mEq/L`;
    const nota = e.modo === 'hd' ? 'HD: −1 mEq/L en la 1.ª hora y −2 a las 3 h (Marino, electrolitos, p. 28-29)'
        : lento ? 'La hemofiltración aclara los solutos pequeños mucho más despacio (Marino, ácido-base y renal, p. 57-58); el trazo es ilustrativo'
            : 'Entre la HD y la continua; el ritmo es ilustrativo';
    const items = [[`K⁺ sérico esperado a las ${e.horas} h`, valor, ficha, k > K_CALCIO ? 'malo' : '', nota]];
    const av = [];
    if (e.k0 > K_CALCIO && e.calcio === 'no') av.push(['danger', `K⁺ ${String(e.k0).replace('.', ',')} mEq/L sin calcio: primero estabiliza la membrana con calcio IV (gluconato al 10 %, 10 ml en 3 min); la diálisis tarda y el calcio actúa en minutos (Marino, electrolitos, p. 26-27).`]);
    if (e.k0 > K_CALCIO && e.calcio === 'si') av.push(['warn', 'El calcio no baja el potasio y su efecto dura 30-60 min: la eliminación (diálisis) no puede esperar (Marino, electrolitos, p. 27).']);
    if (lento) av.push(['warn', 'La hemofiltración aclara despacio los solutos pequeños: no es adecuada para la hiperpotasemia que amenaza la vida (Marino, ácido-base y renal, p. 57-58). Con K⁺ alto, hemodiálisis.']);
    if (e.modo === 'hd' && e.horas >= 1) av.push(['ok', 'Hemodiálisis: ≈1 mEq/L menos en la 1.ª hora y ≈2 mEq/L menos a las 3 h; bastan unas horas para vaciar una carga de K⁺ que amenaza la vida (Marino, electrolitos, p. 28-29; ácido-base y renal, p. 57).']);
    const tope = horaTope(e.k0, e.modo);
    if (e.horas >= tope && tope < H_MAX + 1e-9 && kEsperado(e.k0, e.horas, e.modo) <= K_SUELO) av.push(['danger', `Tope del reloj: el K⁺ llega a ${String(K_SUELO).replace('.', ',')} mEq/L (límite bajo de la normalidad, ilustrativo). Seguir bajaría a hipopotasemia: se controla el K⁺ a mitad de sesión.`]);
    if (e.k0 >= K_MAX - 1e-9) av.push(['danger', 'Tope del mando (8,5 mEq/L, ilustrativo): riesgo inminente de arritmia letal; el calcio no espera a la diálisis.']);
    return { items, av };
}
