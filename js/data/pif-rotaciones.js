// Datos puros del PIF (Plan Individualizado de Formación) de Medicina
// Intensiva, HUGCDN — ver "De dónde sale el nombre 'PIF'" en CLAUDE.md
// para el contexto completo. Un array de rotaciones por año de residencia
// (R1-R5); hoy solo R1 tiene datos reales, extraídos del documento
// PFI-UMI-R1-01 (Rev. 1, junio 2016). R2-R5 quedan como arrays vacíos
// hasta que llegue su propio documento — `pif-manifiesto.js` los
// renderiza igual (estado "Sin expediente"), sin tocar ni el componente
// ni el switcher.
//
// `construido: true` = ya existe contenido real en la app para esa
// rotación; actualízalo a mano el día que se construya (como el resto de
// la app, nada se calcula solo). `destino.botonId`, solo en las
// construidas, es el `id` real del botón de especialidad ya existente
// (#btn-hematologia/#btn-nefrologia) — el propio manifiesto RENDERIZA el
// botón "Abrir…" con ese mismo id, así que hereda gratis el listener que
// `home/index.js` ya engancha sobre ese id (nunca un segundo botón
// duplicado ni un forward de clic).

export const rotacionesPif = {
    R1: [
        {
            id: 'hemato', nombre: 'Hematología', periodo: 'Julio 2026',
            inicio: '2026-07-01', fin: '2026-07-31',
            construido: true,
            objetivos: [
                'Manejo de citopenias (neutropenia febril)',
                'Reconocimiento temprano del paciente hematológico crítico',
                'Transfusión de hemoderivados',
                'Síndromes urgentes: CID, PTT, lisis tumoral',
                'Introducción a trasplante de progenitores',
                'Contacto inicial con CAR-T, SLC/CRS, ICANS',
            ],
            destino: { botonId: 'btn-hematologia' },
        },
        {
            id: 'nefro', nombre: 'Nefrología', periodo: 'Agosto 2026',
            inicio: '2026-08-01', fin: '2026-08-31',
            construido: true,
            objetivos: [
                'Fisiopatología renal',
                'Hipertensión arterial',
                'Fracaso renal agudo y enfermedad renal crónica',
                'Equilibrio hidroelectrolítico y ácido-base',
                'Nefrotoxicidad',
                'Terapias de reemplazo renal',
            ],
            destino: { botonId: 'btn-nefrologia' },
        },
        {
            id: 'radio-torax', nombre: 'Radiología — sección de tórax', periodo: 'Septiembre 2026',
            inicio: '2026-09-01', fin: '2026-09-30',
            construido: false,
            objetivos: [
                'Semiología de la Rx de tórax',
                'Patrones radiológicos',
                'Técnicas UMI: IOT, VVC, SNG, drenajes',
                'Complicaciones de las técnicas UMI',
                'Ecografía torácica',
                'Introducción a TC/TCAR',
            ],
        },
        {
            id: 'neuro-radio', nombre: 'Neuro-Radiología', periodo: 'Octubre 2026',
            inicio: '2026-10-01', fin: '2026-10-31',
            construido: false,
            objetivos: [
                'Técnicas de neuroimagen',
                'ACV isquémico vs. hemorrágico',
                'HTIC, hematoma epidural/subdural',
                'Hipoxia cerebral, catéteres intracraneales',
                'HSA por imagen',
            ],
        },
        {
            id: 'cardio-pif', nombre: 'Cardiología (rotación PIF)', periodo: 'Nov–Dic 2026',
            inicio: '2026-11-01', fin: '2026-12-31',
            construido: false,
            objetivos: [
                'Historia clínica cardiológica',
                'Insuficiencia cardíaca aguda',
                'EKG y arritmias',
                'Síndrome coronario agudo',
                'Endocarditis, pericarditis, miocarditis',
                'Ecocardiografía y cateterismo básicos',
            ],
            nota: 'Ya hay guías de manejo más amplias en Fisiopatología UCI → Cardiología (ESC 2026 / Merino) — no sustituyen este objetivo de rotación, que es más básico.',
        },
        {
            id: 'medint', nombre: 'Medicina Interna', periodo: 'Ene–Feb 2027',
            inicio: '2027-01-01', fin: '2027-02-28',
            construido: false,
            objetivos: [
                'Historia clínica y exploración completas',
                'Hipótesis de trabajo y plan terapéutico',
                'Signos de gravedad y reanimación inicial del paciente séptico en planta',
            ],
        },
        {
            id: 'infecciosas', nombre: 'U. Infecciosas', periodo: 'Marzo 2027',
            inicio: '2027-03-01', fin: '2027-03-31',
            construido: false,
            objetivos: [
                'Mismos objetivos base de historia clínica y exploración',
                'Enfoque del paciente séptico (solapado con Medicina Interna)',
            ],
        },
        {
            id: 'neurologia', nombre: 'Neurología', periodo: 'Abril 2027',
            inicio: '2027-04-01', fin: '2027-04-30',
            construido: false,
            objetivos: [
                'Historia y exploración neurológica',
                'Código ictus',
                'Punción lumbar',
                'Deterioro del nivel de consciencia',
                'Miastenia gravis, Guillain-Barré',
                'Meningitis, crisis comiciales',
            ],
        },
        {
            id: 'neumo-pif', nombre: 'Neumología (rotación PIF)', periodo: 'May–Jun 2027',
            inicio: '2027-05-01', fin: '2027-06-30',
            construido: false,
            objetivos: [
                'Insuficiencia respiratoria aguda',
                'Neumonía comunitaria y nosocomial',
                'Fisiopatología del intercambio gaseoso',
                'TEP no complicado',
                'Pruebas funcionales respiratorias, VMNI básica',
            ],
            nota: 'Ya hay Merino Neumología construido (EP, asma/EPOC, SDRA, VM, destete) — no sustituye este objetivo de rotación.',
        },
    ],
    R2: [],
    R3: [],
    R4: [],
    R5: [],
};
