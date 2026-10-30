// Rótulos de las figuras de Merino Neumología (Marino, The ICU Book, 5.ª ed.).
// Datos puros. Coordenadas en % de la imagen (x desde la izquierda, y desde arriba).
//   punto: [x, y]          sitio real en la imagen (anillo)
//   et: {x, y, lado}       etiqueta; lado 'l' = su borde izquierdo está en x, 'r' = su borde derecho está en x
//   ancho: máximo en % del ancho de la imagen (opcional)
//   pag: página del PDF donde la fuente nombra esa estructura; nota: de dónde sale.
const CAP22 = 'docs/marino-2024-respiratory-management-caps22-26.pdf';
const CAP27 = 'docs/marino-2024-respiratory-management-caps27-30.pdf';

export const ROTULOS_MERINO_NEUMO = {
    'fig-22-1': {
        pdf: CAP22,
        rotulos: [
            { texto: 'Arteria pulmonar', punto: [53, 40], et: { x: 58, y: 20, lado: 'l' }, pag: 5, nota: 'pie de la figura 22.1: PA = arteria pulmonar' },
            { texto: 'Aorta', punto: [56, 58], et: { x: 60, y: 87, lado: 'l' }, pag: 5, nota: 'pie de la figura 22.1: AO = aorta' },
            { texto: 'Defecto de repleción', punto: [63, 46.5], et: { x: 72, y: 60, lado: 'l' }, pag: 5, nota: 'pie de la figura 22.1: defecto de repleción en la arteria pulmonar principal izquierda' },
        ],
    },
    'fig-24-2': {
        pdf: CAP22,
        rotulos: [
            { texto: 'Infiltrados difusos', punto: [30, 30], et: { x: 38, y: 20, lado: 'l' }, pag: 38, nota: 'pie de la figura 24.2, panel superior: infiltrados finamente granulares distribuidos de forma uniforme' },
            { texto: 'Infiltrados inferiores', punto: [24, 76], et: { x: 32, y: 66, lado: 'l' }, pag: 38, nota: 'pie de la figura 24.2, panel inferior: infiltrados confinados a los campos pulmonares inferiores' },
            { texto: 'Hemidiafragma izquierdo borrado', punto: [78, 88], et: { x: 70, y: 95, lado: 'r' }, pag: 38, nota: 'pie de la figura 24.2: obliteración del hemidiafragma izquierdo que sugiere un derrame pleural' },
        ],
    },
    'fig-24-3': {
        pdf: CAP22,
        rotulos: [
            { texto: 'Consolidación posterior', punto: [27, 33], et: { x: 8, y: 43, lado: 'l' }, ancho: 40, pag: 36, nota: 'texto del capítulo, panel superior: consolidación densa en las regiones pulmonares posteriores' },
            { texto: 'Neumomediastino', punto: [73, 63.5], et: { x: 60, y: 53, lado: 'r' }, pag: 38, nota: 'pie de la figura 24.3, panel inferior: neumomediastino indicado por la flecha' },
        ],
    },
    'fig-28-1': {
        pdf: CAP27,
        rotulos: [
            { texto: 'Punta del tubo', punto: [50.7, 31.3], et: { x: 47, y: 31.3, lado: 'r' }, pag: 18, nota: 'pie de la figura 28.1: punta del tubo endotraqueal' },
            { texto: 'Carina', punto: [50.7, 48.8], et: { x: 47, y: 48.8, lado: 'r' }, pag: 18, nota: 'pie de la figura 28.1: bifurcación traqueal (carina)' },
        ],
    },
    'fig-28-5': {
        pdf: CAP27,
        rotulos: [
            { texto: 'Neumotórax anterior', punto: [70, 64.7], et: { x: 64, y: 53, lado: 'r' }, ancho: 40, pag: 27, nota: 'pie de la figura 28.5: neumotórax anterior en la TC (asterisco)' },
        ],
    },
    'fig-29-3': {
        pdf: CAP27,
        rotulos: [
            { texto: 'Marcas apiñadas', punto: [14, 45.6], et: { x: 5, y: 62, lado: 'l' }, ancho: 24, pag: 41, nota: 'pie de la figura 29.3: marcas pulmonares apiñadas en la base derecha (imagen supina tras la espiración). El texto (pág. 40) las atribuye al hemidiafragma elevado y al volumen pulmonar bajo' },
        ],
    },
};
