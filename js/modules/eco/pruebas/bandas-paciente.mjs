// Bandas del juez J1 «Doppler de paciente posible» (bandas firmadas por el director el 28/10/2026).
// Datos puros: por forma y punto, cada comprobación = { medida, min, max, fuente, diagnostico?, nota? }.
//   · Solo las celdas con cifra de libro y página exigen. Lo inferido o de fisiología general va con
//     `diagnostico: true`: se imprime, no falla.
//   · «Hueco» (buscado en los 4 PDF y sin cifra): solo el mínimo E>0, A>0, S>0, D>0.
//   · VD/VI en volumen no se juzga (las fuentes dan diámetro o área, no volumen). Edad: unión 20-60 años.
// Medidas (de medirForma): E, A (cm/s) · ea · dt (ms) · eSep, eLat, eAvg (cm/s) · eE (E/e′ medio) · S, D, Ar (cm/s) ·
// sd · bombaAI (% del llenado) · tapse (mm) · pcp, paps (mmHg) · feVd (%) · tapsePaps (mm/mmHg) · pvc (mmHg).
// Fuentes: Nagueh 2025 (ASE, función diastólica), Lang 2015 (ASE, cuantificación de cámaras), Mukherjee 2025
// (ASE, corazón derecho e HP), ESC/ERS 2022 (HP). Páginas impresas.
const N = (p) => `Nagueh 2025 p.${p}`, L = (p) => `Lang 2015 p.${p}`, M = (p) => `Mukherjee 2025 p.${p}`, ESC = (p) => `ESC/ERS 2022 p.${p}`;
const INF = Infinity;
const c = (medida, min, max, fuente, extra = {}) => ({ medida, min, max, fuente, ...extra });
const diag = (medida, min, max, fuente, nota) => c(medida, min, max, fuente, { diagnostico: true, nota });

// Mínimos de hueco (todas las formas y puntos)
const HUECO = [c('E', 0, INF, 'mínimo de hueco (E>0)', { min_excl: true }), c('A', 0, INF, 'mínimo de hueco (A>0)', { min_excl: true }),
  c('S', 0, INF, 'mínimo de hueco (S>0)', { min_excl: true }), c('D', 0, INF, 'mínimo de hueco (D>0)', { min_excl: true })];

// Comunes del libro (letras de bandas.md)
const a = () => c('ea', 0.69, 2.73, N(551) + ' (15)');
const b = () => c('eE', 4.0, 11.5, N(551) + ' (15)');
const e_ = () => [c('eSep', 6, INF, N(553) + ' (17) T6'), c('eLat', 7, INF, N(553) + ' (17) T6'), c('eAvg', 6.5, INF, N(553) + ' (17) T6')];
const eBaja = () => [c('eSep', 0, 6, N(554) + ' (18)'), c('eLat', 0, 7, N(554) + ' (18)'), c('eAvg', 0, 6.5, N(554) + ' (18)')];
const tapse = () => c('tapse', 17, INF, L(23) + ' (23); ' + M(145) + ' (5)');
const bomba = () => c('bombaAI', 15, 30, L(24) + ' (24)');
const ar = () => diag('Ar', 0, 35, N(549) + ' (13), ' + N(555) + ' (19)', 'inferido de «Ar >35 = LVEDP alta»');
const g = () => [c('E', 47, 111, N(551) + ' (15)'), c('A', 24, 82, N(551) + ' (15)')];
const dt200 = () => diag('dt', 200, INF, 'hueco: DT de la relajación alterada sin cifra en los PDF de docs/ (Nagueh 2025 solo da <140 ms restrictivo, p.547 (11)); la guía ASE/EAE 2009 (Nagueh, PMID 19187853) no se pudo abrir', 'solo diagnóstico, no falla: no es banda de libro hasta abrir una fuente con la cifra');
const dt140 = () => diag('dt', 140, INF, N(547) + ' (11)', 'inferido: <140 ms = signo restrictivo');

const NORMAL = [a(), b(), ...e_(), dt140(), ar(), tapse(), bomba(), ...g()];

export const BANDAS = {
  normal: NORMAL,
  vasoplejia: [c('eE', 0, 14, N(554) + ' (18)'), ...e_(), ar(), diag('tapse', 17, INF, 'fisiología general', 'trivial'),
    diag('ea', 0, INF, N(547) + ' (11), ' + N(557) + ' (21) T7', 'fusión E-A por taquicardia: sin tope inferior')],
  dilatada: [c('ea', 2, INF, N(554) + ' (18)'), c('eE', 14, INF, N(554) + ' (18)'), ...eBaja(), c('dt', 0, 140, N(547) + ' (11)', { max_excl: true }),
    c('sd', 0, 1, N(549) + ' (13) T4', { max_excl: true }), diag('sd', 0, 0.67, N(554) + ' (18)', 'discrepancia 3: ≤0,67'), c('tapse', 0, INF, 'mínimo de hueco (TAPSE>0)', { min_excl: true })],
  'hemorragia:0': NORMAL, 'fallo:0': NORMAL, 'derrame:0': NORMAL, 'tep:0': NORMAL, 'hpcronica:0': NORMAL,
  'hemorragia:def': [diag('eE', 0, 11.5, N(551), 'inferido: E baja con e′ normal'), ...e_(), ar(), c('tapse', 0, INF, 'mínimo de hueco (TAPSE>0)', { min_excl: true })],
  'hemorragia:1': [diag('eE', 0, 11.5, N(551), 'inferido'), ...e_(), ar(), c('tapse', 0, INF, 'mínimo de hueco (TAPSE>0)', { min_excl: true })],
  'fallo:def': [c('ea', 0.8, INF, N(554) + ' (18)'), c('eE', 14, INF, N(554) + ' (18)'), ...eBaja(), c('sd', 0, 1, N(549) + ' (13)'),
    c('tapse', 0, INF, 'mínimo de hueco (TAPSE>0)', { min_excl: true })],
  'fallo:1': [c('eE', 14, INF, N(557) + ' (21)'), ...eBaja(), c('sd', 0, 0.67, N(557) + ' (21), ' + N(554) + ' (18)'),
    diag('ea', 2, INF, N(557) + ' (21) T7', '≥2 o fusión'), c('tapse', 0, INF, 'mínimo de hueco (TAPSE>0)', { min_excl: true })],
  'derrame:def': [a(), b(), ...e_(), ar(), diag('bombaAI', 15, 30, L(24), 'hueco para derrame'), c('tapse', 0, INF, 'mínimo de hueco (TAPSE>0)', { min_excl: true })],
  'derrame:1': [diag('eE', 0, 11.5, N(551), 'inferido'), ...e_(), ar(), c('tapse', 0, INF, 'mínimo de hueco (TAPSE>0)', { min_excl: true })],
  'tep:def': [diag('eE', 0, 14, N(554), 'inferido'), ...e_(), ar(), c('tapse', 0, 17, L(23) + ' (23); ' + M(145) + ' (5); ' + ESC(3644) + ' dice <18')],
  'tep:1': [diag('eE', 0, 14, N(554), 'inferido'), ...e_(), ar(), c('tapse', 0, 17, L(23) + ' (23); ' + M(145) + ' (5); ' + ESC(3644) + ' dice <18')],
  'hpcronica:def': [a(), c('eE', 0, 8, N(548) + ' (12); ' + M(173) + ' (33) T8'), ...e_(), ar(), c('tapse', 0, 17, L(23) + ' (23); ' + M(145) + ' (5)'),
    c('paps', 35, INF, M(145) + ' (5)'), diag('bombaAI', 15, 30, L(24), 'hueco en HP')],
  'hpcronica:1': [diag('ea', 0, 0.8, N(557) + ' (21) T7', '«favorece precapilar»'), c('eE', 0, 8, N(548) + ' (12); ' + M(173) + ' (33) T8'), ...e_(), ar(),
    c('tapse', 0, 10, M(145) + ' (5) grave'), c('tapsePaps', 0, 0.19, ESC(3657) + ' (40)'), c('paps', 70, INF, M(145) + ' (5)'),
    c('feVd', 0, 32, M(145) + ' (5) FEVD 3D <32 %'), diag('pvc', 15, INF, M(145) + ' (5)', 'RAP ≥15 (estimada, no es la PVC media)')],
  // Hipertrofia: tabla del profesor (plan-hipertrofia.md), cortes de Nagueh 2025 p.554 (18), PCP>15 en p.550 (14)
  'hipertrofia:0': [c('ea', 0, 0.8, N(554) + ' (18)'), ...eBaja(), c('eE', 0, 14, N(554) + ' (18)'), dt140(), dt200(), c('pcp', 0, 15, N(550) + ' (14)'), c('paps', 0, 35, N(554) + ' (18)')],
  'hipertrofia:def': [c('ea', 0, 0.8, N(554) + ' (18)'), ...eBaja(), c('eE', 0, 14, N(554) + ' (18)'), dt140(), dt200(), c('pcp', 0, 15, N(550) + ' (14)'), c('paps', 0, 35, N(554) + ' (18)'),
    diag('ea', 0, 0.75, N(554), 'claramente invertido (ilustrativo)')],
  'hipertrofia:1': [c('ea', 0.8, 2, N(554) + ' (18)'), ...eBaja(), c('eE', 14, INF, N(554) + ' (18)'), dt140(), c('pcp', 15, INF, N(550) + ' (14)'),
    diag('paps', 35, INF, N(554), '«IT ≥2,8 o PAPs ≥35»: basta una')],
};
export const HUECO_MINIMOS = HUECO;
export const UNIDADES = { E: 'cm/s', A: 'cm/s', ea: '', dt: 'ms', eSep: 'cm/s', eLat: 'cm/s', eAvg: 'cm/s', eE: '', S: 'cm/s', D: 'cm/s', Ar: 'cm/s', sd: '', bombaAI: '%', tapse: 'mm', pcp: 'mmHg', paps: 'mmHg', feVd: '%', tapsePaps: 'mm/mmHg', pvc: 'mmHg' };
