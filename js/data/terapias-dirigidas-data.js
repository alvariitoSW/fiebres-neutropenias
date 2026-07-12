// Tabla 4 de Azoulay et al. Blood Reviews 2025;74:101306 — efectos secundarios
// típicos de las terapias dirigidas usadas en neoplasias hematológicas.
export const terapiasDirigidasData = {
    cd20: {
        clase: 'Anti-CD20',
        ejemplo: 'Rituximab',
        defecto: 'Aplasia B limitada y a largo plazo. Neutropenia precoz y tardía.',
        clinica: 'Infecciones bacterianas (respiratorias: Haemophilus, neumococo). Infecciones virales.',
        recomendacion: 'Cribado de hepatitis B y tratar si HBsAg(+), monitorizar carga viral. Monitorizar inmunoglobulinas y sustituir si bajas. Monitorizar respuesta vacunal y reforzar.'
    },
    bcl2: {
        clase: 'Inhibidor de BCL-2',
        ejemplo: 'Venetoclax',
        defecto: 'Neutropenia.',
        clinica: 'Infecciones bacterianas grado 3-4 en el 20% de los casos.',
        recomendacion: 'Vigilar infecciones, más frecuentes en combinación con otros inmunosupresores. Reducir dosis un 75% si se combina con azoles (interacción por CYP3A4).'
    },
    bcrabl: {
        clase: 'Inhibidor BCR-ABL',
        ejemplo: 'Imatinib, Ponatinib',
        defecto: 'Débil.',
        clinica: 'Pocas infecciones bacterianas y virales.',
        recomendacion: 'Ninguna recomendación específica.'
    },
    biespecifico: {
        clase: 'Anticuerpo biespecífico',
        ejemplo: 'Blinatumomab',
        defecto: 'Aplasia B a largo plazo. Hipogammaglobulinemia. Neutropenia.',
        clinica: 'Infecciones &gt;grado 2 (25%). Infecciones de vía central. Sin experiencia en pacientes con hepatitis B, C o VIH.',
        recomendacion: 'Monitorizar y sustituir inmunoglobulinas. Vigilar la vía central. Test de hepatitis B/C y VIH.'
    },
    btk: {
        clase: 'Inhibidor BTK',
        ejemplo: 'Ibrutinib',
        defecto: 'Función de células B y T alterada. Inmunidad innata alterada.',
        clinica: 'Infecciones bacterianas (p. ej. neumonía), reactivación de VHB, infecciones fúngicas.',
        recomendacion: 'Cribado de hepatitis B, tratamiento y monitorización. Interacción con azoles (CYP3A4). Profilaxis antifúngica si neutropenia prolongada o tratamiento con esteroides.'
    },
    cart: {
        clase: 'Células CAR-T',
        ejemplo: 'Axicabtagén ciloleucel',
        defecto: 'Aplasia B. Neutropenia prolongada en el 25% de los casos.',
        clinica: 'Infecciones bacterianas, virales y fúngicas frecuentes (mortalidad no relacionada con recaída por infección: 60-80%).',
        recomendacion: 'Monitorizar y sustituir inmunoglobulinas. Profilaxis antibacteriana y antifúngica en pacientes de alto riesgo según protocolo local.'
    },
    ici: {
        clase: 'Inhibidor de checkpoint inmunitario',
        ejemplo: 'Pembrolizumab',
        defecto: 'Desconocido.',
        clinica: 'Infecciones, sobre todo cuando aparecen eventos adversos inmunorrelacionados (irAE) tratados con esteroides.',
        recomendacion: 'Monitorizar y considerar profilaxis (p. ej. frente a Pneumocystis) si los irAE se tratan con esteroides &gt;4 semanas.'
    },
    jakstat: {
        clase: 'Inhibidor JAK-STAT',
        ejemplo: 'Ruxolitinib',
        defecto: '—',
        clinica: 'Aumento discreto de infecciones bacterianas, virales y fúngicas.',
        recomendacion: 'Considerar profilaxis frente a Pneumocystis si CD4 &lt;200 o tratamiento con esteroides. Monitorización y tratamiento de hepatitis B. Cribado de infecciones oportunistas y de leucoencefalopatía multifocal progresiva.'
    }
};

export const terapiasDirigidasOrden = ['cd20', 'bcl2', 'bcrabl', 'biespecifico', 'btk', 'cart', 'ici', 'jakstat'];
