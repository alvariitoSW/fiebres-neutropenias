// Explicación guiada por paciente: 3-5 pasos que señalan una zona del dibujo. t texto · z zonas · p 'página:ficha' (o null) · o origen · haz [acción, opciones] · btn.
export const GUIAS = {
  tori: ['Toribio · shock séptico', [
    { t: 'La cadena: el hipotálamo suelta CRH, la hipófisis ACTH y la suprarrenal cortisol. El cortisol vuelve por el cable y frena a las dos primeras estaciones.', z: ['hipo', 'hipof', 'gland', 'cable'], p: '47:mu-sr-eje', o: 'ficha p. 47; el cable de retroalimentación: Libro Azul p. 4-6' },
    { t: 'En el shock séptico las citocinas bloquean tres puntos: el hipotálamo, la acción de la ACTH y la respuesta del órgano (Fig. 51.1). El bloqueo alto es el más frecuente: hasta el 75 % de los casos en sepsis grave.', z: ['hipo', 'gland'], p: '50:mu-sr-incidencia', o: 'ficha' },
    { t: 'Con hipotensión que no responde al volumen ni a dosis moderadas de vasopresor, no esperes el cortisol: prueba hidrocortisona 100 mg cada 8 horas.', z: ['mapa'], p: '51:mu-sr-practica', o: 'ficha', haz: ['hc'], btn: 'Hidrocortisona 100/8 h' },
    { t: 'Se retira cuando ya no hace falta el vasopresor y el lactato se normalizó, bajando la dosis durante al menos unos días.', z: ['gland'], p: '51:mu-sr-retirada', o: 'ficha', haz: ['dia', { v: 3 }], btn: 'Pasan 3 días' }]],
  bibi: ['Bibiana · prednisona un año', [
    { t: 'El corticoide de fuera hace el trabajo del cortisol y frena por el cable al hipotálamo y a la hipófisis (la Fig. 51.1 marca los esteroides exógenos sobre el hipotálamo).', z: ['cable', 'hipo'], p: '49:mar-img-51-1', o: 'ficha; el cable: Libro Azul y Younes 2017' },
    { t: 'Sin ACTH la suprarrenal se atrofia: con 14 días o más de corticoide, el dibujo la encoge.', z: ['gland'], p: null, o: 'Younes 2017 (otra fuente, pediátrica)' },
    { t: 'Cortisol 22 µg/dL: entre 10 y 35 no decide. Se pasa la prueba de ACTH: 250 µg y cortisol a los 60 minutos.', z: ['mapa'], p: '51:mu-sr-practica', o: 'ficha', haz: ['acth'], btn: 'Prueba de ACTH' },
    { t: 'Un aumento menor de 9 µg/dL indica supresión. Ojo: un aumento de 9 o más no habría descartado la secundaria.', z: ['mapa'], p: '50:mu-sr-acth', o: 'ficha' }]],
  sinf: ['Sinforoso · tirotoxicosis apática', [
    { t: 'La hipófisis manda TSH; la tiroides secreta T4, la hormona principal, y los tejidos la convierten en T3, la activa.', z: ['hipof', 'gland', 'tijera'], p: '52:mu-ti-t4t3', o: 'ficha p. 52; TRH → TSH: Libro Azul p. 5-6' },
    { t: 'En la enfermedad primaria la TSH cambia al revés de la hormona: T4 libre alta y TSH casi indetectable (<0,01).', z: ['mapa'], p: '53:mu-ti-dx', o: 'ficha' },
    { t: 'En el anciano, el hipertiroidismo puede dar letargo en vez de agitación; letargo y fibrilación auricular son la presentación típica. Una TSH normal lo descarta.', z: ['mapa'], p: '53:mu-ti-clinica', o: 'ficha' },
    { t: 'Antitiroideo (metimazol 10-20 mg al día) y propranolol oral 10-40 mg, 3-4 veces al día.', z: ['gland'], p: '55:mu-tabla-51-4', o: 'ficha, Tablas 51.3-51.4', haz: ['at', { v: 'mmi' }], btn: 'Metimazol' }]],
  lucr: ['Lucrecia · tormenta tiroidea', [
    { t: 'Graves con infección: temperatura sobre 40 °C, delirio y taquicardia grave. El freno no basta y la glándula va sola.', z: ['gland', 'mapa'], p: '53:mu-ti-tormenta', o: 'ficha' },
    { t: 'En la tormenta se prefiere propiltiouracilo: carga de 500-1.000 mg y 250 mg cada 4 horas. Frena la síntesis y la conversión T4 → T3.', z: ['gland', 'tijera'], p: '55:mu-tabla-51-4', o: 'ficha', haz: ['at', { v: 'ptu' }], btn: 'PTU' },
    { t: 'El yodo se añade al antitiroideo: 5 gotas de solución de Lugol cada 6 horas. Si lo pulsas antes del antitiroideo, sale el sello.', z: ['gland'], p: '55:mu-ti-yodo', o: 'ficha', haz: ['yodo'], btn: 'Yodo' },
    { t: 'La tormenta acelera el metabolismo del cortisol: hidrocortisona 300 mg y luego 100 mg cada 8 horas.', z: ['cable'], p: '55:mu-ti-tormenta-extra', o: 'ficha', haz: ['hc'], btn: 'Hidrocortisona' },
    { t: 'Todos los betabloqueantes están contraindicados en una crisis asmática; con asma leve se usa metoprolol. Pulsa propranolol y mira.', z: ['mapa'], p: '54:mu-tabla-51-3', o: 'ficha', haz: ['prop'], btn: 'Propranolol oral' }]],
  poli: ['Policarpo · amiodarona', [
    { t: 'La amiodarona bloquea la conversión de T4 a T3: la tijera se queda sin cortar y la T4 libre sube.', z: ['tijera'], p: '54:mu-ti-hipertiroxinemia', o: 'ficha' },
    { t: 'Con T4 libre alta y TSH normal, la glándula no está enferma (hipertiroxinemia eutiroidea): no se trata.', z: ['mapa', 'hipof'], p: '54:mu-ti-hipertiroxinemia', o: 'ficha, Tabla 51.2' },
    { t: 'La heparina da el mismo patrón por otra vía: libera ácidos grasos que desplazan la T4 de sus proteínas.', z: ['mapa'], p: '54:mu-ti-hipertiroxinemia', o: 'ficha', haz: ['farm', { v: 'hep' }], btn: 'Heparina' }]],
  obdu: ['Obdulia · coma mixedematoso', [
    { t: 'La glándula está apagada: T4 libre baja y TSH alta, porque la hipófisis ya no recibe el freno del cable.', z: ['gland', 'mapa'], p: '56:mu-hipo-dx', o: 'ficha p. 56; el cable: Libro Azul' },
    { t: 'La forma más grave: conciencia deprimida, hipotermia, hiponatremia e inestabilidad cardiovascular. El nombre es engañoso: no hay coma ni mixedema.', z: ['gland'], p: '56:mu-hipo-coma', o: 'ficha' },
    { t: 'Antes de la hormona, hidrocortisona 100 mg cada 8 horas: suele haber insuficiencia suprarrenal.', z: ['cable'], p: '57:mu-hipo-coma-tto', o: 'ficha', haz: ['hc'], btn: 'Hidrocortisona' },
    { t: 'Levotiroxina en bolo intravenoso lento de 200-400 µg; si la conversión a T3 está deprimida, se añade liotironina.', z: ['tijera', 'gland'], p: '57:mu-hipo-coma-tto', o: 'ficha', haz: ['levo'], btn: 'Levotiroxina IV' }]],
  fulg: ['Fulgencio · eutiroideo enfermo', [
    { t: 'En la enfermedad aguda la T3 libre baja: la conversión de T4 a T3 en los tejidos falla. Con más gravedad baja también la T4.', z: ['tijera'], p: '56:mu-hipo-eutiroideo', o: 'ficha' },
    { t: 'La TSH normal dice que no es la tiroides: es el patrón del eutiroideo enfermo, en el 30-50 % de los pacientes de UCI.', z: ['mapa'], p: '56:mu-hipo-eutiroideo', o: 'ficha, Tabla 51.2' },
    { t: 'No se trata: no están hipotiroideos desde el punto de vista clínico.', z: ['gland'], p: '57:mu-hipo-eutiroideo-tto', o: 'ficha' },
    { t: 'La causa se discute: la desyodasa D3 reactivada inactiva T4 y T3 (T3 inversa) frente a una D1 baja. Se muestran las dos ideas.', z: ['tijera'], p: null, o: 'Huang-Bianco 2008 (las fuentes discrepan)' }]],
};
export function crearGuia({ caja, hacer, cita, setFoco }) {
  let g = null, i = 0;
  const cerrar = () => { caja.hidden = true; g = null; setFoco([]); };
  function paso(k) {
    i = Math.max(0, Math.min(g[1].length - 1, k)); const p = g[1][i]; caja.hidden = false; setFoco(p.z);
    caja.innerHTML = `<h3>${g[0]} · paso ${i + 1} de ${g[1].length}</h3><p class="enun">${p.t} <span class="org">${p.o}</span> ${p.p ? cita(p.p) : ''}</p><div class="fila-g">${p.haz ? `<button type="button" class="b prim" data-g="haz">Hazlo: ${p.btn}</button>` : ''}<button type="button" data-g="ant" ${i ? '' : 'disabled'}>‹ Anterior</button><button type="button" data-g="sig">${i < g[1].length - 1 ? 'Siguiente ›' : 'Terminar'}</button></div>`;
  }
  caja.addEventListener('click', (ev) => {
    const b = ev.target.closest('[data-g]'); if (!b || !g) return; const a = b.dataset.g, p = g[1][i];
    if (a === 'ant') paso(i - 1); else if (a === 'sig') { if (i < g[1].length - 1) paso(i + 1); else cerrar(); }
    else if (a === 'haz') { hacer(p.haz[0], p.haz[1] || {}); setFoco(p.z); }
  });
  return { abrir: (c) => { if (!GUIAS[c]) return cerrar(); g = GUIAS[c]; paso(0); }, cerrar };
}
