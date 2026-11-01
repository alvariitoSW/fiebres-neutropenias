// Río y mar · la salida «orina»: una gota que sale del extremo del río, con su osmolalidad y su diuresis, y la
// prueba de vasopresina (Marino cap. 35, mr-di-dx, E p. 7). Pieza común de `di`, `sobrecorreccion` y `desmopresina`.
// Las cifras las pone el caso (estado.orina) y las calcula orinaDe() en js/data/agua-viva-data.js; aquí solo se dibuja.
// La escena le pasa lo que necesita (no importa de ella: así no hay ciclo).

// Salida del río (extremo derecho, bajo la orilla) y su rótulo; devuelve el punto para el anillo «mirar: orina».
export function puntoOrina(W, H, rioY, anchoRio) {
    const x = 0.955 * W, s = W / 360;
    return [x, rioY(x) + anchoRio + 14 * s];
}

// Cuánto se aclara el chorro: la orina muy diluida (<200) es casi agua; la concentrada, ámbar.
export function dibujarOrina(g, { o, W, H, rioY, anchoRio, texto, rgba, C, tiempo, ocultar, reducir }) {
    if (!o) return;
    const s = W / 360, x = 0.955 * W, y0 = rioY(x) + anchoRio + 4 * s, y1 = H - 62 * s;
    // chorro: el ancho sigue a la diuresis (400 mL/h ≈ 5 px), el color a la osmolalidad (diluida = clara)
    // diuresis acuosa frenada por la desmopresina (E p. 14): hilo mínimo y sin cifra; la acuosa no tiene osmolalidad en la ficha
    const ancho = o.furo ? 4 * s : Math.max(1.5, Math.min(7, (o.mlh == null ? 0 : o.mlh) / 80)) * s;
    const concentrada = o.osm != null && o.osm >= 200 || !!o.frenada;
    const col = concentrada ? C.ambar : C.texto;
    g.save();
    g.strokeStyle = rgba(col, concentrada ? 0.7 : 0.35); g.lineWidth = ancho; g.lineCap = 'round';
    g.setLineDash([7 * s, 5 * s]); g.lineDashOffset = reducir ? 0 : -tiempo * 30 * s;
    g.beginPath(); g.moveTo(x, y0); g.lineTo(x, y1); g.stroke();
    g.setLineDash([]);
    g.fillStyle = rgba(col, 0.6); g.beginPath(); g.arc(x, y1 + 3 * s, ancho * 1.1, 0, Math.PI * 2); g.fill();
    g.restore();
    if (o.furo) {   // orina con furosemida (E p. 8): Na⁺ ~80 mEq/L, menos que el plasma; sin otra cifra en la ficha
        texto(g, ocultar ? 'orina con furosemida · Na⁺ ? mEq/L' : 'orina con furosemida · Na⁺ ~80 mEq/L (< plasma)', W - 6 * s, H - 46 * s, { size: 9 * s, color: C.ambar, align: 'right', caja: true, italic: false, peso: '600' });
        texto(g, 'ficha · caudal: sin cifra', W - 6 * s, H - 32 * s, { size: 8.5 * s, color: C.dim, align: 'right', caja: true });
        return;
    }
    const cif = o.osm == null ? '' : ocultar ? '? mOsm/kg' : `${o.osm} mOsm/kg`;
    const dia = ocultar ? '? mL/h' : o.frenada ? 'frenada' : o.mlh != null ? `${o.mlh} mL/h` : '';
    const lin1 = `orina${o.tipo === 'acuosa' && !o.frenada ? ' acuosa' : ''} · ${[cif, dia].filter(Boolean).join(' · ')}`;
    texto(g, lin1, W - 6 * s, H - 46 * s, { size: 9 * s, color: concentrada ? C.ambar : C.texto, align: 'right', caja: true, italic: false, peso: '600' });
    if (o.vaso && !ocultar) texto(g, 'vasopresina: ' + o.respuesta, W - 6 * s, H - 32 * s, { size: 9 * s, color: o.subeMin ? C.verde : C.rojo, align: 'right', caja: true, italic: false });
    else texto(g, o.tipo === 'acuosa' ? (o.frenada ? 'desmopresina: sin cifra' : 'dato del caso') : o.mlh != null && o.tipo === 'central' ? 'dato del caso' : 'ilustrativo', W - 6 * s, H - 32 * s, { size: 8.5 * s, color: C.dim, align: 'right', caja: true });
}

// Filas para la lectura (Na⁺ · Posm · Hto): HTML del cuadro vivo
export function filasLecturaOrina(o, ocultar) {
    if (!o) return '';
    const q = v => ocultar ? '?' : v;
    const caso = o.tipo === 'central' || o.tipo === 'acuosa' ? 'del caso' : 'ilustr.';
    let h = o.osm == null ? '' : `<span class="agv-k">Orina</span><b>${q(o.osm)}</b><span class="agv-t">${caso}</span>`;
    if (o.frenada) h += `<span class="agv-k">mL/h</span><b>${q('frenada')}</b><span class="agv-t">sin cifra</span>`;
    else if (o.mlh != null) h += `<span class="agv-k">mL/h</span><b>${q(o.mlh)}</b><span class="agv-t">${caso}</span>`;
    if (o.vaso) h += `<span class="agv-k">+ vaso</span><b>${ocultar ? '?' : o.subeMin ? '≥' + o.osmVaso : o.osmVaso}</b><span class="agv-t">ficha</span>`;
    return h;
}
