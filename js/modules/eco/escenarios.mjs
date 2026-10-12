// Escenarios de prueba del motor. Los usan la página (botones «Pruebas del barorreflejo») y las pruebas
// automáticas, que comprueban que cada uno reproduce el patrón de su tipo de shock en la fuente.
// Cada escenario parte del estado normal estable y cambia lo mínimo para provocar su tipo de shock.
// Las magnitudes del cambio son ilustrativas; lo que se exige es la DIRECCIÓN del patrón.
export const ESCENARIOS = {
  normal: { nombre: 'Normal', aplicar: () => {} },
  hemorragia: {
    nombre: 'Hemorragia de 1 L', tipo: 'hipovolemico',
    aplicar: (m) => { m.s.vven -= 1000; },
  },
  fallo: {
    nombre: 'Fallo del VI', tipo: 'cardiogenico',
    aplicar: (m) => { m.p.vi.ees = 0.9; },
  },
  derrame: {
    nombre: 'Derrame pericárdico', tipo: 'obstructivo',
    aplicar: (m) => { m.p.liquidoPeri = 260; },
  },
  vasoplejia: {
    nombre: 'Vasoplejía', tipo: 'vasodilatador',
    // Resistencias al 40 % y venodilatación (más volumen venoso "sin tensión", que deja de volver al
    // corazón): Marik, cap. 14, pág. 4 — el shock vasodilatador es una vasodilatación difusa «de arterias y venas»
    aplicar: (m) => { m.p.rSis *= 0.4; m.p.vuVen *= 1.5; },
  },
};

// Patrón de cada tipo de shock frente al estado normal.
// PVC, GC y RVS: Merino Cardiología, Tabla 14.1 (Marik, Handbook of Evidence-Based Critical Care, cap. 14),
// docs/marik-2024-shock-caps14-17.pdf, pág. 3 (en el libro, «Low/High»: aquí ↓/↑). PCP: Fisiopatología UCI · Cardiología, Ficha 10 (El Libro Azul,
// cap. 10, Figura 2), docs/libro-azul-seccion-i-cardiovascular-parte2.pdf, pág. 33; no se exige en el
// vasodilatador porque esa figura da «N/↑» y la Tabla 14.1 no la recoge.
// '↑' sube, '↓' baja, 'N/↑' no baja.
export const PATRONES = {
  hipovolemico: { pvc: '↓', gc: '↓', rvs: '↑', pcp: '↓' },
  cardiogenico: { pvc: '↑', gc: '↓', rvs: '↑', pcp: '↑' },
  obstructivo: { pvc: '↑', gc: '↓', rvs: '↑', pcp: '↑' },
  vasodilatador: { pvc: '↓', gc: 'N/↑', rvs: '↓' },
};
export const FUENTE_PATRONES = 'Merino Cardiología, Tabla 14.1 (PVC, GC, RVS) y Fisiopatología UCI · Cardiología, Ficha 10, Figura 2 (PCP)';

// Umbral para dar un cambio por real: presiones, 0,5 mmHg; flujos y resistencias, 5 %
export function direccion(var_, normal, actual) {
  const umbral = (var_ === 'pvc' || var_ === 'pcp') ? 0.5 : 0.05 * Math.abs(normal);
  if (actual > normal + umbral) return '↑';
  if (actual < normal - umbral) return '↓';
  return 'N';
}
export const cumple = (esperado, obtenido) => esperado === 'N/↑' ? obtenido !== '↓' : esperado === obtenido;
