// Los topes del eje: cada uno con su origen y su consecuencia clínica. Devuelve la lista de los que están activos para este estado.
// c = clave · n = nivel · pag = 'página:id de la ficha' · off = botones que se apagan.
export const TODOS = ['cortBajo', 'cortAlto', 'cortInd', 'deltaBajo', 'deltaAlto', 'estresMax', 'estres2', 'eje', 'dias365', 'retirar', 'tsh0', 'amio', 'tormenta', 'mixed', 'yodo', 'levo', 'prop', 'imposible'];
export function topes(s, L) {
  const l = [], p = (c, n, titulo, texto, pag, origen, off = [], tono = '') => l.push({ c, n, titulo, texto, pag, origen, off, tono });
  if (s.gl === 'adr') {
    if (L.cort < 10) p('cortBajo', 'sello', 'Supresión suprarrenal', `Cortisol aleatorio ${Math.round(L.cort)} µg/dL (<10): la mejor señal de supresión. Con hipotensión que no responde al volumen, se trata.`, '50:mu-sr-criterios', 'ficha · p. 50');
    else if (L.cort >= 35) p('cortAlto', 'sello', 'Función adecuada', `Cortisol aleatorio ${Math.round(L.cort)} µg/dL (≥35): la suprarrenal responde bien al estrés.`, '51:mu-sr-practica', 'ficha · p. 51', [], 'ok');
    else p('cortInd', 'aviso', 'Indeterminado', `Cortisol ${Math.round(L.cort)} µg/dL (entre 10 y 35): no decide. Pasa la prueba de ACTH (250 µg, mira a los 60 min).`, '51:mu-sr-practica', 'ficha · p. 51');
    if (s.acth) { if (L.delta < 9) p('deltaBajo', 'sello', 'Δ <9 µg/dL', 'El cortisol sube menos de 9 tras el ACTH: la suprarrenal no responde. Es supresión.', '50:mu-sr-acth', 'ficha · p. 50');
      else p('deltaAlto', 'aviso', 'Δ ≥9: no descarta la secundaria', 'Una respuesta normal al ACTH no excluye el fallo hipotálamo-hipofisario; lo diagnostica la ACTH plasmática (rara en la UCI).', '51:mu-sr-practica', 'ficha · p. 51'); }
    if (s.estres >= 3) p('estresMax', 'sello', 'Tope: 350 mg/día', `El estrés máximo no da más: la glándula produce como mucho 350 mg/día (reposo, 15-25). Con ${L.pa} mmHg y FC ${L.fc}, lo siguiente es el vasopresor.`, '48:mu-sr-cortisol', 'ficha · p. 48', ['#b-estres-mas']);
    else if (s.estres === 2) p('estres2', 'aviso', 'Cerca del tope', 'A un paso del máximo de 350 mg/día de cortisol.', '48:mu-sr-cortisol', 'ficha · p. 48');
    if (s.dias >= 365) p('dias365', 'sello', 'Tope: un año', 'Tras un año con corticoide, la recuperación del eje puede tardar 6-12 meses al retirarlo. La suprarrenal está atrófica.', null, 'Younes 2017 (otra fuente, pediátrica)', ['#r-dias']);
    else if (s.dias >= 14) p('eje', 'aviso', 'Eje apagado', 'Con 14 días o más de corticoide, el freno llega del cable y la glándula se encoge; con menos de 10-14 días se recupera pronto.', null, 'Younes 2017 (otra fuente)');
    if (s.hc && !s.taper && (L.na > 0 || L.lac >= 2)) p('retirar', 'aviso', 'Aún no retires', `Sigue la hipotensión o el lactato (${String(L.lac).replace('.', ',')}) no se normaliza: espera a quitar el vasopresor y a lactato normal.`, '51:mu-sr-retirada', 'ficha · p. 51; lactato normal: fisiología general', ['#b-ret']);
  } else {
    if (L.tsh < 0.01) p('tsh0', 'aviso', 'TSH casi indetectable', 'TSH <0,01: casi siempre hipertiroidismo primario; una TSH normal lo descarta.', '53:mu-ti-dx', 'ficha · p. 53');
    if (s.farm === 'amio' && L.fila === 'hiperx') p('amio', 'aviso', 'Hipertiroxinemia eutiroidea', 'T4 libre alta con TSH normal por amiodarona: no se trata.', '54:mu-ti-hipertiroxinemia', 'ficha · p. 54');
    if (L.tormenta) p('tormenta', 'sello', 'Tormenta tiroidea', `T ${String(L.t).replace('.', ',')} °C y FC ${L.fc}: hiperpirexia y taquicardia grave; mortalidad de hasta el 25 % aun con tratamiento.`, '53:mu-ti-tormenta', 'ficha · p. 53');
    if (L.mixed) p('mixed', 'sello', 'Coma mixedematoso', `T ${String(L.t).replace('.', ',')} °C, Na⁺ ${L.na_s}, FC ${L.fc}: mortalidad de hasta el 60 %. Hidrocortisona antes de la hormona.`, '56:mu-hipo-coma', 'ficha · p. 56-57');
    if (s.intYodo && !s.at) p('yodo', 'sello', 'Siempre con un antitiroideo', 'El yodo solo, sin antitiroideo, no frena la glándula. Pon antes PTU o metimazol.', '55:mu-ti-yodo', 'ficha · p. 55', ['#b-yodo']);
    if (s.intLevo && !s.hc && L.mixed) p('levo', 'sello', 'Primero la hidrocortisona', 'El coma mixedematoso suele acompañarse de insuficiencia suprarrenal: la hidrocortisona va antes de la levotiroxina.', '57:mu-hipo-coma-tto', 'ficha · p. 57', ['#b-levo']);
    if (s.intProp && s.asma) p('prop', 'sello', 'Betabloqueante contraindicado', 'Con una crisis asmática, ningún betabloqueante: broncoespasmo. Con asma leve, metoprolol (p. 54).', '54:mu-tabla-51-3', 'ficha · Tabla 51.3, p. 54', ['#b-prop']);
  }
  return l;
}
