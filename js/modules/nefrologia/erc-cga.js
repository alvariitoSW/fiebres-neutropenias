// FGe (CKD-EPI 2021) y categorías CGA de KDIGO 2024: compartido por la
// calculadora de la ficha 1 de ERC (erc.js) y su mapa de calor de la vista
// Visual (visual-erc.js).

// Ecuación CKD-EPI de creatinina 2021 (sin coeficiente de raza), la
// recomendada por KDIGO 2024 como primera aproximación en adultos:
// eGFR = 142 x min(Scr/k,1)^a x max(Scr/k,1)^-1.200 x 0.9938^edad x 1.012 [mujer]
export function ckdEpi2021(creatinina, edad, sexo) {
    const k = sexo === 'mujer' ? 0.7 : 0.9;
    const a = sexo === 'mujer' ? -0.241 : -0.302;
    const ratio = creatinina / k;
    const fge = 142
        * Math.pow(Math.min(ratio, 1), a)
        * Math.pow(Math.max(ratio, 1), -1.200)
        * Math.pow(0.9938, edad)
        * (sexo === 'mujer' ? 1.012 : 1);
    return fge;
}

export function categoriaG(fge) {
    if (fge >= 90) return 'G1';
    if (fge >= 60) return 'G2';
    if (fge >= 45) return 'G3a';
    if (fge >= 30) return 'G3b';
    if (fge >= 15) return 'G4';
    return 'G5';
}

export function categoriaA(acr) {
    if (acr < 30) return 'A1';
    if (acr <= 300) return 'A2';
    return 'A3';
}

// Nivel de riesgo 1-4 (verde/amarillo/naranja/rojo) según el "mapa de
// calor" G x A estándar de KDIGO 2012/2024.
export const MAPA_RIESGO = {
    G1: { A1: 1, A2: 2, A3: 3 },
    G2: { A1: 1, A2: 2, A3: 3 },
    G3a: { A1: 2, A2: 3, A3: 4 },
    G3b: { A1: 3, A2: 4, A3: 4 },
    G4: { A1: 4, A2: 4, A3: 4 },
    G5: { A1: 4, A2: 4, A3: 4 },
};

export const RIESGO_TEXTO = {
    1: 'riesgo bajo (verde)',
    2: 'riesgo moderadamente aumentado (amarillo)',
    3: 'riesgo alto (naranja)',
    4: 'riesgo muy alto (rojo)',
};
