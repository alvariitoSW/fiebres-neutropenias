// Juez del renglón «fórmula → tus números → resultado» (tarea formula-juez, B-042; CLAUDE.md §7.10). Lo llama
// autonomo/jueces.mjs con --formula, --forma o --modelo de uno de estos modelos (a 390 px).
// En cada modelo que pinta renglones con pintarFormula (js/core/formula.js) mueve los mandos (mínimo, medio y máximo;
// primera y última opción; casillas y botones de encendido en sus dos posiciones) y, tras cada cambio, lee los
// renglones pintados (.fml-n: los números; .fml-s b: el resultado), rehace la cuenta con los números tal como se ven
// y falla si no da el resultado mostrado al mismo redondeo (los decimales del resultado). También falla si en todo el
// recorrido no se pintó ningún renglón (el juez no habría comprobado nada).
//   node autonomo/pruebas/formula-juez-trampa.mjs     prueba trampa: un resultado alterado a mano tiene que dar ❌
import { MODELOS } from './jueces-forma.mjs';

/* ---------- La cuenta (Node; sin DOM) ---------- */
// Número escrito a la española: «1.234» son miles, «9,4» lleva decimales, «−» es el signo menos.
const aNumero = s => s.replace(/−/g, '-').replace(/(\d)\.(?=\d{3}(?!\d))/g, '$1').replace(/,/g, '.');
const decimales = s => { const m = /,(\d+)\s*$/.exec(s.trim()); return m ? m[1].length : 0; };

// Expresión aritmética con + − × ÷ / y paréntesis, sin eval. Devuelve NaN si no se entiende.
function evaluar(txt) {
    const t = txt.match(/\d+(?:\.\d+)?|[-+*/()]/g) || [];
    let i = 0;
    const prim = () => {
        const x = t[i++];
        if (x === '(') { const v = suma(); i++; return v; }
        if (x === '-') return -prim();
        return x != null && /\d/.test(x) ? parseFloat(x) : NaN;
    };
    const prod = () => { let v = prim(); while (t[i] === '*' || t[i] === '/') { const o = t[i++], w = prim(); v = o === '*' ? v * w : v / w; } return v; };
    const suma = () => { let v = prod(); while (t[i] === '+' || t[i] === '-') { const o = t[i++], w = prod(); v = o === '+' ? v + w : v - w; } return v; };
    const v = suma();
    return i === t.length ? v : NaN;
}

// Deja solo la cuenta: quita las aclaraciones entre paréntesis («(Ø 2,0 cm)», «(negativa: no filtra)») y las
// unidades y palabras, y cambia × ÷ por * /.
const limpiar = s => aNumero(s.replace(/\([^)]*\)/g, ' ')).replace(/×/g, '*').replace(/÷/g, '/').replace(/[^\d.+\-*/()]/g, ' ');

const redondea = (v, d) => (Math.round(v * 10 ** d + 1e-9) / 10 ** d);

// Comprueba un renglón ya pintado. Devuelve null si cuadra, o el motivo del fallo.
//   numeros: el texto de .fml-n sin la flecha; resultado: el texto de .fml-s b.
// Si los números traen un paso intermedio («55 − 15 − 30 = −3,2 (negativa: no filtra)»), la cuenta tiene que dar ese
// paso; y el resultado, ese mismo paso o 0 si el paso es negativo y el renglón lo dice («negativa»).
export function comprobarRenglon({ numeros, resultado }) {
    const [izq, ...der] = numeros.split('=');
    const cuenta = evaluar(limpiar(izq));
    if (!Number.isFinite(cuenta)) return `no se puede rehacer la cuenta «${numeros}»`;
    const res = parseFloat(aNumero(resultado).replace(/[^\d.-]/g, ''));
    if (!Number.isFinite(res)) return `resultado ilegible «${resultado}»`;
    let objetivo = cuenta;
    if (der.length) {
        const textoPaso = der.join('=').replace(/\([^)]*\)/g, '').trim();
        const paso = parseFloat(aNumero(textoPaso).replace(/[^\d.-]/g, ''));
        const dp = decimales(textoPaso);
        if (!Number.isFinite(paso) || redondea(cuenta, dp) !== paso) return `«${izq.trim()}» da ${redondea(cuenta, dp)}, no ${textoPaso}`;
        if (paso < 0 && /negativ/i.test(numeros) && res === 0) return null;
        objetivo = paso;
    }
    const d = decimales(resultado);
    return redondea(objetivo, d) === res ? null : `«${numeros}» da ${String(redondea(objetivo, d)).replace('.', ',')}, no ${resultado}`;
}

/* ---------- Los modelos ---------- */
// abrir(pag): deja el modelo a la vista y devuelve el selector de su raíz (los mandos y los renglones se buscan dentro).
const enlace = (pag, datos) => pag.evaluate(d => { const b = document.createElement('button'); for (const [x, v] of Object.entries(d)) b.dataset[x] = v; document.body.appendChild(b); b.click(); b.remove(); }, datos);
const libros = clave => ({
    estados: MODELOS[clave].estados,
    abrir: async (pag, estado) => {
        const M = MODELOS[clave];
        await enlace(pag, { ...M.enlace, [M.clave]: estado }); await pag.waitForTimeout(900);
        await pag.evaluate(s => { const b = document.querySelector(s); if (b && b.getAttribute('aria-selected') !== 'true') b.click(); }, M.modo.explorar);
        await pag.waitForTimeout(400);
        return M.raiz;
    },
});
// Fichas con la vista Visual: el modelo va dentro de la pestaña de la ficha (data-en-visual la abre en Visual).
const ficha = (view, panel, tabs) => ({
    estados: tabs,
    abrir: async (pag, tab) => {
        await enlace(pag, { especialidad: 'nefrologia', view, panel, tab, enVisual: '' }); await pag.waitForTimeout(1200);
        await pag.evaluate(t => document.querySelector(`#${t} .vista-toggle button[data-vista="visual"]`)?.click(), tab);
        await pag.waitForTimeout(500);
        return `#${tab}`;
    },
});
export const MODELOS_FORMULA = {
    'capilar-vivo': libros('capilar-vivo'),
    'agua-viva': libros('agua-viva'),
    glomerulo: ficha('erc', 'panel-erc-tabs', ['erc-pa-raas', 'erc-nefroproteccion']),
    filtro: ficha('trr', 'panel-trr-tabs', ['trr-dosis']),
    // El Doppler del laboratorio de eco: muestra en el TSVI (da el ITV y el gasto cardíaco) en cada escenario
    'eco-doppler': {
        pagina: 'js/modules/eco/laboratorio.html',
        estados: ['inicial'],
        abrir: async pag => {
            await pag.evaluate(() => document.querySelector('[data-modo="D"]')?.click()); await pag.waitForTimeout(300);
            await pag.evaluate(() => document.querySelector('[data-muestra="tsvi"]')?.click()); await pag.waitForTimeout(3000);
            return 'body';
        },
        espera: 2500,
    },
};

/* ---------- En la página (cada función es autónoma: se serializa tal cual) ---------- */
function leerRenglones(raiz) {
    const R = document.querySelector(raiz); if (!R) return null;
    const vis = e => e.getClientRects().length > 0 && !e.closest('[hidden]');
    return [...R.querySelectorAll('.fml-r')].filter(vis).map(r => ({
        titulo: r.querySelector('.fml-t')?.textContent.trim() || '',
        numeros: (r.querySelector('.fml-n')?.textContent || '').replace('→', '').trim(),
        resultado: (r.querySelector('.fml-s b')?.textContent || '').trim(),
    }));
}
// Marca (data-jf) y lista los mandos visibles del modelo; los botones solo si son de encendido (aria-pressed).
function listarMandos(raiz) {
    const R = document.querySelector(raiz); if (!R) return [];
    const vis = e => e.getClientRects().length > 0 && !e.closest('[hidden]') && getComputedStyle(e).visibility !== 'hidden';
    R.querySelectorAll('[data-jf]').forEach(e => e.removeAttribute('data-jf'));
    return [...R.querySelectorAll('input[type=range], input[type=number], select, input[type=checkbox], button[aria-pressed]')]
        .filter(e => vis(e) && !e.disabled).map((e, i) => {
            e.setAttribute('data-jf', String(i));
            return { i, tipo: e.tagName === 'SELECT' ? 'select' : e.tagName === 'BUTTON' ? 'boton' : e.type === 'checkbox' ? 'casilla' : 'rango',
                t: (e.getAttribute('aria-label') || e.textContent.replace(/\s+/g, ' ').trim() || e.id || e.name || e.tagName).slice(0, 26) };
        });
}
// Lleva un mando a una posición: 0 mínimo / primera, 1 medio, 2 máximo / última, 3 volver a como estaba.
function moverMando([raiz, i, paso]) {
    const e = document.querySelector(`${raiz} [data-jf="${i}"]`); if (!e) return null;
    const ev = () => ['input', 'change'].forEach(x => e.dispatchEvent(new Event(x, { bubbles: true })));
    window.__jf = window.__jf || {};
    if (e.tagName === 'BUTTON') { e.click(); return paso === 0 ? 'pulsado' : 'otra vez'; }
    if (e.type === 'checkbox') { if (paso === 0) window.__jf[i] = e.checked; e.checked = paso === 3 ? window.__jf[i] : paso === 0; ev(); return e.checked ? 'marcada' : 'desmarcada'; }
    if (e.tagName === 'SELECT') { if (paso === 0) window.__jf[i] = e.selectedIndex; const n = e.options.length; e.selectedIndex = paso === 3 ? window.__jf[i] : paso === 0 ? 0 : paso === 1 ? Math.floor(n / 2) : n - 1; ev(); return `opción ${e.selectedIndex + 1}/${n}`; }
    if (paso === 0) window.__jf[i] = e.value;
    const mn = +e.min || 0, mx = e.max === '' ? mn + 100 : +e.max, st = +e.step || 1;
    e.value = paso === 3 ? window.__jf[i] : String(paso === 0 ? mn : paso === 2 ? mx : mn + Math.round((mx - mn) / 2 / st) * st); ev();
    return `= ${e.value}`;
}

/* ---------- En Node ---------- */
export async function juzgarFormula({ nav, base, ok, mal, modelos = [], todo = false, antes = null, ancho = 390 }) {
    const claves = [...new Set([...modelos.filter(k => MODELOS_FORMULA[k]), ...(todo ? Object.keys(MODELOS_FORMULA) : [])])];
    if (!claves.length) return;
    const ctx = await nav.newContext({ viewport: { width: ancho, height: 844 }, hasTouch: true, isMobile: true, reducedMotion: 'reduce' });
    for (const k of claves) {
        const M = MODELOS_FORMULA[k], pag = await ctx.newPage();
        await pag.goto(base + (M.pagina || '')); await pag.waitForTimeout(1500);
        if (antes) await antes(pag);
        const fallos = new Map(), vistos = new Set(); let leidos = 0;
        const revisar = async (raiz, donde) => {
            await pag.waitForTimeout(M.espera || 200);
            for (const r of (await pag.evaluate(leerRenglones, raiz)) || []) {
                const firma = `${r.titulo}|${r.numeros}|${r.resultado}`; if (vistos.has(firma)) continue;
                vistos.add(firma); leidos++;
                const motivo = comprobarRenglon(r);
                if (motivo && !fallos.has(firma)) fallos.set(firma, `${r.titulo}: ${motivo} [${donde}]`);
            }
        };
        for (const estado of M.estados) {
            const raiz = await M.abrir(pag, estado);
            if (!(await pag.evaluate(r => !!document.querySelector(r), raiz))) { fallos.set('abrir' + estado, `no se abre «${estado}»`); continue; }
            await revisar(raiz, `${estado} · al abrir`);
            const mandos = await pag.evaluate(listarMandos, raiz);
            for (const m of mandos) {
                const pasos = m.tipo === 'rango' || m.tipo === 'select' ? [0, 1, 2, 3] : m.tipo === 'casilla' ? [0, 1, 3] : [0, 1];
                for (const p of pasos) {
                    const etq = await pag.evaluate(moverMando, [raiz, m.i, p]); if (etq == null) break;
                    await revisar(raiz, `${estado} · ${m.tipo} «${m.t}» ${etq}`);
                }
            }
        }
        if (!leidos) fallos.set('nada', 'no se pintó ningún renglón «fórmula → números → resultado» en todo el recorrido');
        fallos.size ? mal(`Fórmula ${ancho}px · ${k}: ${fallos.size} renglón(es) que no cuadran\n   ${[...fallos.values()].map(f => '❌ ' + f).join('\n   ')}`)
            : ok(`Fórmula ${ancho}px · ${k}: ${leidos} renglones distintos rehechos a mano: todos dan el resultado que enseñan`);
        await pag.close();
    }
    await ctx.close();
}
