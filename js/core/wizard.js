// Asistente paso a paso de respuestas Sí/No ("wizard") sobre un árbol de
// decisión declarativo — el mismo componente para el algoritmo de
// diuréticos de la guía ESC de IC, la titulación de furosemida, el ACLS y
// la TAM de Merino Cardiología, en vez de una copia del motor por cada uno.
//
// `pasos` es un objeto { clave: { pregunta, si, no } } con una entrada
// 'inicio'; `si`/`no` son o bien la clave del siguiente paso (string), o
// bien un resultado final { estado, final } (estado = clase
// tfg-estado-ok/warn/danger). El HTML debe tener 4 elementos con ids
// `${prefijo}-pregunta`, `${prefijo}-botones`, `${prefijo}-resultado` y
// `${prefijo}-reset` — si falta el primero, no se engancha nada.
export function initSiNoWizard(prefijo, pasos) {
    const preguntaEl = document.getElementById(`${prefijo}-pregunta`);
    const botonesEl = document.getElementById(`${prefijo}-botones`);
    const resultadoEl = document.getElementById(`${prefijo}-resultado`);
    const resetEl = document.getElementById(`${prefijo}-reset`);
    if (!preguntaEl || !botonesEl || !resultadoEl || !resetEl) return;

    function render(pasoKey) {
        const paso = pasos[pasoKey];
        preguntaEl.textContent = paso.pregunta;
        resultadoEl.style.display = 'none';
        resetEl.style.display = 'none';
        botonesEl.innerHTML = '';
        ['si', 'no'].forEach(resp => {
            const btn = document.createElement('button');
            btn.className = 'quiz-opcion';
            btn.style.flex = '1';
            btn.textContent = resp === 'si' ? 'Sí' : 'No';
            btn.addEventListener('click', () => {
                const next = paso[resp];
                if (typeof next === 'string') {
                    render(next);
                    return;
                }
                botonesEl.innerHTML = '';
                resultadoEl.style.display = 'block';
                resultadoEl.className = `result-box ${next.estado}`;
                resultadoEl.style.textAlign = 'left';
                resultadoEl.innerHTML = `<strong>${next.final}</strong>`;
                resetEl.style.display = 'inline-block';
            });
            botonesEl.appendChild(btn);
        });
    }

    render('inicio');
    resetEl.addEventListener('click', () => render('inicio'));
}
