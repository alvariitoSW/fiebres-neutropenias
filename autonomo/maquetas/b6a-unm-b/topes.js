// Topes (REGLAS §1.14): cada uno con su regla, su página y su consecuencia visible. c clave · n nivel · off mandos que apaga.
import { U, NOMBRE } from './datos.js';
import { NEO } from './bloqueo-motor.js';
export function topes(s, L) {
  const t = [], mg = s.est === 'miastenia', blq = s.est === 'bloqueo';
  const poner = (c, n, titulo, texto, pag, off = [], tono = '') => t.push({ c, n, titulo, texto, pag, origen: 'ficha', off, tono });
  if (s.neo >= NEO.max) poner('neo70', 'sello', 'Nunca más de 70 µg/kg', `Parasimpaticomimético: la FC cae a ${L.fc} y las secreciones suben; por encima no revierte más.`, '31:mn-bnm-neostigmina', ['#b-neo']);
  if (s.neo * s.peso / 1000 > U.neoMg) poner('neo5', 'aviso', 'Máximo 5 mg', `Con ${s.peso} kg, ${s.neo} µg/kg son ${(s.neo * s.peso / 1000).toFixed(1).replace('.', ',')} mg (máximo de la FDA, nota de la ficha).`, '31:mn-bnm-neostigmina');
  if (blq && s.k >= U.k && !s.rel) poner('succiK', 'aviso', 'K⁺ alto: succinilcolina no', `K⁺ ${String(s.k).replace('.', ',')}: la succinilcolina suma otros 0,5 mEq/L. Usa rocuronio.`, '30:mn-bnm-contra');
  if (blq && s.rel === 'succi' && s.k >= U.k) poner('succik', 'sello', 'Succinilcolina contraindicada', `K⁺ ${String(s.k).replace('.', ',')}: subió otros 0,5 mEq/L y puede parar el corazón. Usa rocuronio.`, '30:mn-bnm-contra', ['#b-succi']);
  if (blq && s.rel === 'roc' && !s.via && !s.sug && s.min >= 3 && L.tof < 4) poner('rocaire', 'sello', 'Dura una hora sin vía aérea', 'El rocuronio no se acaba solo: sugammadex 16 mg/kg lo revierte en 2-3 min.', '31:mn-bnm-sugammadex', ['#b-roc', '#b-cis']);
  if (blq && s.sug > 0 && (s.rel === 'succi' || s.rel === 'cis')) poner('sugmal', 'sello', 'Sugammadex solo con aminoesteroides', `No actúa sobre la ${NOMBRE[s.rel]}: el bloqueo sigue y el paciente no respira.`, '31:mn-bnm-sugammadex', ['[data-sug]']);
  if (blq && L.tof === 0 && s.perf >= 3) poner('tof0', 'sello', 'Bloqueo excesivo', 'TOF 0/4: el objetivo es 1-2 respuestas; con 0 no se sabe si está dormido ni se puede retirar.', '30:mn-bnm-monitor', ['#b-perf-mas']);
  if (blq && s.perf > 0 && s.dia >= 2) poner('par48', 'aviso', 'Más de 48 h paralizado', 'Despierto y paralizado sin EEG: miopatía, neumonía hipostática, TEV y úlceras.', '31:mn-bnm-ruego');
  if (s.dSin >= 2 && !s.via) poner('parada', 'sello', 'Parada respiratoria: no esperar al extremo', `Llevas ${s.dSin} días con criterio de intubación y sin vía aérea: CV ${Math.round(L.cv)} mL y PIM ${-L.f}. Intuba ya.`, '25:mn-mg-intubacion', ['#b-dia']);
  if ((s.est === 'gbs' || mg) && L.intub) poner('intub', 'sello', 'Pensar en intubar', `CV ${Math.round(L.cv)} mL (${L.cvkg.toFixed(1).replace('.', ',')} mL/kg) y PIM ${-L.f}. BiPAP solo si mejora en días.`, mg ? '25:mn-mg-intubacion' : '27:mn-gbs-tratamiento');
  if (mg && s.piri && !s.piriOk) poner('piri', 'sello', 'Piridostigmina no en el fracaso respiratorio', 'Las secreciones empeoran la vía aérea: ya hay que intubar.', '26:mn-mg-piridostigmina', ['#b-piri']);
  if (s.ses > U.ses) poner('ses', 'aviso', 'Son 5 sesiones en 7-10 días', 'Más de 5 sesiones de plasmaféresis no aparecen en el esquema de Marino.', '26:mn-mg-crisis', ['#b-pla']);
  if ((s.igiv != null) && s.dia - s.igiv < 4 && (s.est === 'gbs' || mg)) poner('igiv', 'aviso', 'La IgIV tarda 4-5 días', 'Hasta entonces la fuerza no sube; por eso la plasmaféresis puede ir antes.', '26:mn-mg-crisis');
  if (s.est === 'pnc' || s.est === 'mcc') poner('sintto', 'aviso', 'No hay tratamiento', 'La mitad recupera en meses; el mando de tratamiento se apaga.', '28:mn-pnc-manejo', ['#b-igiv', '#b-pla', '#b-piri']);
  if (s.est === 'mcc' && s.cort && (s.rel || s.perf)) poner('mccrap', 'aviso', 'La miosina se pierde más deprisa', 'Relajante, corticoides y sepsis la agravan (magnitud ilustrativa).', '28:mn-pnc-mcc');
  if (mg && s.farm) poner('farm', 'sello', 'Empeora la miastenia', `${{ gent: 'Gentamicina', mg: 'Magnesio', cort: 'Corticoide a dosis alta' }[s.farm]} dificulta la transmisión (Tabla 46.5): la fuerza cae.`, '24:mn-tabla-46-5', ['[data-farm]']);
  if (s.hielo > U.hielo) poner('hielo2', 'aviso', 'Más de 2 min no añade efecto', 'El test dura 2 minutos con el ojo cerrado.', '24:mn-mg-hielo');
  return t;
}
