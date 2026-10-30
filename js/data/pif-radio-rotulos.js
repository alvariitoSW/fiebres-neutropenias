// Rótulos de la figura 47.3 de Marino (TC de cráneo con hematoma intracerebral), en la ficha «TC de cráneo».
// Mismo formato que merino-neumo-rotulos.js. Solo lo que dice el pie de la figura (PDF, pág. 43).
const NEURO = 'docs/marino-2024-neurologia-caps45-47.pdf';

export const ROTULOS_PIF_RADIO = {
    'fig-47-3': {
        pdf: NEURO,
        rotulos: [
            { texto: 'Hematoma hiperdenso', punto: [36, 52], et: { x: 3, y: 90, lado: 'l' }, pag: 43, nota: 'pie de la figura 47.3: hematoma intracerebral hiperdenso que ocupa la mitad del hemisferio derecho' },
            { texto: 'Sangre en ventrículos', punto: [54, 36], et: { x: 97, y: 12, lado: 'r' }, pag: 43, nota: 'pie de la figura 47.3: la hemorragia se extiende a los ventrículos (riesgo de hidrocefalia obstructiva)' },
        ],
    },
};
