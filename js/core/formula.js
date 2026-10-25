// Renglón «fórmula → tus números → resultado» para los modelos vivos. Solo DIBUJA: no calcula nada; el modelo
// pasa la fórmula, los términos ya sustituidos y el resultado que él mismo calculó (con el mismo redondeo que enseña).
//   pintarFormula(contenedor, [{ titulo: 'CaO₂', formula: '1,34 × Hb × SaO₂ + 0,003 × PaO₂',
//       numeros: '1,34 × 7,0 × 0,971 + 0,003 × 90', resultado: '9,4', unidad: 'mL/dL', origen: 'ficha · mar-cao2-9' }, …])
//   · prefijos (opcional): prefijos de id de ficha que no están en la lista de citas.js (p. ej. ['trr']).
//   · origen: 'ficha · <id de la ficha>' (se convierte en enlace «Ver en el texto»), 'fisiología general' o 'ilustrativo'.
//   · lista vacía o null: vacía el contenedor (p. ej. mientras la cifra está tapada con «?»).
//   · Se puede llamar en cada cambio de mando: si nada cambió, no toca el DOM.
import { origenEnlazado } from './citas.js';
import { escapeHtml } from './ui.js';

const renglon = r => {
    const ilu = !/^ficha/.test(r.origen || '');
    const org = r.origen ? `<span class="fml-org${ilu ? ' fml-ilu' : ''}">${origenEnlazado(r.origen, { clase: 'fml-ir', corta: true, ...(r.prefijos ? { prefijos: r.prefijos } : {}) })}</span>` : '';
    return `<div class="fml-r"><span class="fml-t">${escapeHtml(r.titulo)}</span>`
        + `<span class="fml-f">${escapeHtml(r.formula)}</span>`
        + `<span class="fml-n"><i aria-hidden="true">→</i> ${escapeHtml(r.numeros)}</span>`
        + `<span class="fml-s"><i aria-hidden="true">→</i> <b>${escapeHtml(r.resultado)}</b>${r.unidad ? ` <small>${escapeHtml(r.unidad)}</small>` : ''}</span>${org}</div>`;
};

export function pintarFormula(contenedor, renglones) {
    if (!contenedor) return;
    const lista = (Array.isArray(renglones) ? renglones : renglones ? [renglones] : []).filter(Boolean);
    const html = lista.map(renglon).join('');
    if (contenedor._fml === html) return;
    contenedor._fml = html;
    contenedor.innerHTML = html;
    contenedor.hidden = !lista.length;
}
