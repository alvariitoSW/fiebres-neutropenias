// Vista Visual de Libros · Marino Fundamentos (The ICU Book, caps. 1-11):
// recetas para core/visual-kit.js. Cada nodo apunta a una línea real de la
// ficha (casi siempre por su id), las tablas se dibujan leyendo sus celdas
// y las calculadoras y simuladores de la ficha se conectan, nunca se copian.
import { montarVisual } from '../../core/visual-kit.js';

const calc = (titulo, campos, resultado, nota) => ({ tipo: 'calculadora', titulo, campos, resultado, ...(nota ? { nota } : {}) });

// Hagen-Poiseuille: el flujo relativo con la ecuación de la propia ficha
// (Q ∝ r⁴ / L, con presión y viscosidad fijas). Es la ecuación, no una
// medida: las cifras reales de catéteres están en la Figura 1.1.
function poiseuille(cuerpo) {
    cuerpo.innerHTML = `
        <div class="form-group"><label for="mar-pois-r">Radio: <strong id="mar-pois-r-val"></strong> × el de referencia</label><input type="range" id="mar-pois-r" min="0.5" max="2" step="0.1" value="1"></div>
        <div class="form-group"><label for="mar-pois-l">Longitud: <strong id="mar-pois-l-val"></strong> × la de referencia</label><input type="range" id="mar-pois-l" min="0.5" max="6" step="0.5" value="1"></div>
        <svg viewBox="0 0 320 70" style="width:100%; display:block;" aria-hidden="true"><rect id="mar-pois-tubo" x="20" y="25" height="20" rx="4" fill="none" stroke="var(--accent-blue)" stroke-width="2"/><g id="mar-pois-gotas"></g></svg>
        <div class="tfg-estado tfg-estado-ok" id="mar-pois-res"></div>`;
    const r = cuerpo.querySelector('#mar-pois-r'), l = cuerpo.querySelector('#mar-pois-l');
    const upd = () => {
        const rv = Number(r.value), lv = Number(l.value), q = Math.pow(rv, 4) / lv;
        cuerpo.querySelector('#mar-pois-r-val').textContent = rv.toLocaleString('es-ES');
        cuerpo.querySelector('#mar-pois-l-val').textContent = lv.toLocaleString('es-ES');
        const tubo = cuerpo.querySelector('#mar-pois-tubo');
        const alto = 8 + rv * 12, largo = Math.min(280, 40 * lv + 20);
        tubo.setAttribute('height', alto); tubo.setAttribute('y', 35 - alto / 2); tubo.setAttribute('width', largo);
        const n = Math.max(1, Math.min(14, Math.round(q * 4)));
        cuerpo.querySelector('#mar-pois-gotas').innerHTML = Array.from({ length: n }, (_, i) => `<circle cx="${20 + largo + 8 + (i % 7) * 6}" cy="${28 + Math.floor(i / 7) * 10}" r="2.4" fill="var(--accent-blue)"/>`).join('');
        const pct = q * 100;
        cuerpo.querySelector('#mar-pois-res').className = `tfg-estado tfg-estado-${pct >= 100 ? 'ok' : pct >= 50 ? 'warn' : 'danger'}`;
        cuerpo.querySelector('#mar-pois-res').innerHTML = `Flujo ≈ <strong>${pct.toLocaleString('es-ES', { maximumFractionDigits: 0 })}%</strong> del de referencia (r⁴ / L). Doblar el radio lo multiplica por 16; doblar la longitud lo reduce a la mitad.`;
    };
    r.addEventListener('input', upd); l.addEventListener('input', upd);
    upd();
}

export function initVisualMarino() {
    // ---- Cap. 1 ----
    montarVisual('mar-cateteres-flujo', {
        guia: 'El catéter, no la vena, marca la velocidad: radio a la cuarta y longitud.',
        paneles: [
            { tipo: 'propio', titulo: 'La ecuación de Hagen-Poiseuille, en marcha', nota: 'Flujo relativo según la ecuación de la ficha (presión y viscosidad fijas).', render: poiseuille },
            { tipo: 'barras', titulo: 'Flujo por gravedad según el calibre (Figura 1.1)', tabla: '#mar-fig-1-1-calibre', series: [{ col: 1, nombre: 'mL/min', color: 'dorado' }] },
            { tipo: 'barras', titulo: 'Flujo según la longitud (Figura 1.1, 16 G)', tabla: '#mar-fig-1-1-longitud', series: [{ col: 1, nombre: 'mL/min', color: 'verde' }] },
            calc('Del French al milímetro (calculadora de la ficha)', ['#mar-french-input'], ['#mar-french-resultado']),
            { tipo: 'comparar', titulo: 'Dos maneras de medir el tamaño', columnas: [
                { titulo: 'Gauge', color: 'amarillo', nodos: ['Calibre (gauge)'] },
                { titulo: 'French', color: 'dorado', nodos: ['French (Fr)'] }
            ] },
            { tipo: 'racimos', titulo: 'Cómo empujar el líquido', grupos: [
                { titulo: 'Presión de infusión', color: 'purpura', nodos: ['Por gravedad', 'Bombas de infusión'] }
            ] }
        ]
    });

    montarVisual('mar-tipos-cateter', {
        guia: 'Del más corto al más largo: más duración, menos flujo.',
        paneles: [
            { tipo: 'escalera', titulo: 'De periférico a central', nodos: [
                { fuente: 'Periférico corto', color: 'verde' }, { fuente: 'Periférico largo', color: 'verde' },
                { fuente: 'Línea media', color: 'amarillo' }, { fuente: 'PICC', color: 'rojo' }, { fuente: 'Catéter venoso central', color: 'purpura' }
            ] },
            { tipo: 'barras', titulo: 'Flujo por luz de los centrales (Tabla 1.3, L/h)', tabla: '#mar-tabla-1-3', series: [{ col: 2, nombre: 'L/h', color: 'dorado' }] },
            { tipo: 'flujo', titulo: 'Técnica de Seldinger', nodos: [{ fuente: '#mar-seldinger', etiqueta: 'Aguja → guía → retirar aguja → dilatador → catéter', color: 'dorado' }] },
            { tipo: 'racimos', titulo: 'Ventajas e inconvenientes (Tabla 1.4)', tabla: '#mar-tabla-1-4', color: 'purpura' }
        ]
    });

    montarVisual('mar-eco-intraosea', {
        guia: 'Eco para no fallar la vena; intraósea cuando no hay vena.',
        paneles: [
            { tipo: 'comparar', titulo: 'Eje corto frente a eje largo', columnas: [
                { titulo: 'Para localizar', color: 'amarillo', nodos: [{ fuente: 'Eje corto', etiqueta: 'Eje corto' }] },
                { titulo: 'Para confirmar', color: 'verde', nodos: [{ fuente: 'Eje largo', etiqueta: 'Eje largo' }] }
            ] },
            { tipo: 'flujo', titulo: 'Protocolo ecoguiado', nodos: [
                { fuente: 'Protocolo recomendado', color: 'dorado' },
                [{ fuente: 'Compresibilidad', color: 'verde' }, { fuente: 'Doppler color', color: 'amarillo' }],
                { fuente: 'Confirmar la colocación', color: 'rojo' }
            ] },
            { tipo: 'flujo', titulo: 'Acceso intraóseo', nodos: [
                { fuente: '#mar-io-indicaciones', etiqueta: 'Indicaciones', color: 'verde' },
                { fuente: '#mar-io-sitio', etiqueta: 'Dónde: tibia proximal', color: 'dorado' },
                { fuente: '#mar-io-lidocaina', etiqueta: 'Lidocaína antes de infundir', color: 'amarillo' },
                [{ fuente: '#mar-io-flujo', etiqueta: 'Flujo: 25% de una periférica', color: 'rojo' }, { fuente: '#mar-io-duracion', etiqueta: 'Máximo 24 h', color: 'purpura' }]
            ] }
        ]
    });

    // ---- Cap. 2 ----
    montarVisual('mar-cvc-sitios', {
        guia: 'Tres sitios, cada uno con su riesgo propio.',
        paneles: [
            { tipo: 'comparar', titulo: 'Los tres sitios', columnas: [
                { titulo: 'Yugular interna', color: 'purpura', nodos: [{ fuente: '#mar-yugular', etiqueta: 'La más usada; mejor la derecha' }] },
                { titulo: 'Subclavia', color: 'dorado', nodos: [{ fuente: '#mar-subclavia', etiqueta: 'Estenosis 15-50% tras retirarla' }] },
                { titulo: 'Femoral', color: 'verde', nodos: [{ fuente: '#mar-femoral', etiqueta: 'Mala fama en gran parte inmerecida' }] }
            ] },
            { tipo: 'barras', titulo: 'Bacteriemia por sitio (Tabla 2.2, %)', tabla: '#mar-tabla-2-2', series: [{ col: 1, nombre: 'Yugular', color: 'purpura' }, { col: 2, nombre: 'Subclavia', color: 'dorado' }, { col: 3, nombre: 'Femoral', color: 'verde' }] },
            { tipo: 'racimos', titulo: 'El paquete de inserción (Tabla 2.1)', tabla: '#mar-tabla-2-1', color: 'verde' },
            { tipo: 'racimos', titulo: 'Indicaciones', grupos: [{ titulo: 'Cuándo', color: 'amarillo', nodos: ['#mar-cvc-indicaciones', '#mar-cvc-alternativas', 'Contraindicaciones'] }] }
        ]
    });

    montarVisual('mar-cvc-complicaciones', {
        guia: 'Aire, neumotórax y punta: qué mirar después de poner el catéter.',
        paneles: [
            { tipo: 'flujo', titulo: 'Embolia gaseosa', nodos: [
                { fuente: 'Por qué ocurre', color: 'rojo' }, { fuente: 'Prevención', color: 'verde' },
                { fuente: 'Clínica', color: 'amarillo' }, { fuente: '#mar-aire-manejo', etiqueta: 'Manejo', color: 'purpura' }
            ] },
            { tipo: 'comparar', titulo: 'Neumotórax: cómo verlo', columnas: [
                { titulo: 'Radiografía', color: 'rojo', nodos: ['Radiografía portátil'] },
                { titulo: 'Ecografía', color: 'verde', nodos: [{ fuente: 'Ecografía', tras: '#mar-neumotorax' }] }
            ] },
            { tipo: 'flujo', titulo: '¿Dónde está la punta?', nodos: [
                { fuente: 'Dónde debe estar', color: 'verde' },
                [{ fuente: 'Radiografía', tras: '#mar-punta-objetivo', color: 'dorado' }, { fuente: '#mar-punta-eco', etiqueta: 'Ecografía y burbujas', color: 'amarillo' }],
                { fuente: '¿Y si está en la aurícula?', color: 'purpura' }
            ] }
        ]
    });

    // ---- Cap. 3 ----
    montarVisual('mar-cateter-cuidados', {
        guia: 'El catéter que se queda: apósitos, oclusiones, trombosis y perforación.',
        paneles: [
            { tipo: 'comparar', titulo: 'Apósitos', columnas: [
                { titulo: 'Gasa', color: 'amarillo', nodos: ['Gasa estéril'] },
                { titulo: 'Transparente', color: 'dorado', nodos: ['Transparente de poliuretano'] },
                { titulo: 'Clorhexidina', color: 'verde', nodos: ['Esponja impregnada'] }
            ] },
            { tipo: 'flujo', titulo: 'Catéter ocluido', nodos: [
                { fuente: 'Causas', color: 'gris' }, { fuente: '#mar-alteplasa', etiqueta: 'Alteplasa 2 mg (Tabla 3.2)', color: 'verde' },
                { fuente: '#mar-tabla-3-3', etiqueta: 'Si no cede: causas no trombóticas (Tabla 3.3)', color: 'amarillo' }
            ] },
            { tipo: 'racimos', titulo: 'Disolver precipitados (Tabla 3.3)', tabla: '#mar-tabla-3-3', color: 'purpura' },
            { tipo: 'racimos', titulo: 'Trombosis y perforación', grupos: [
                { titulo: 'TVP del brazo', color: 'rojo', nodos: [{ fuente: 'TVP del miembro superior' }, { fuente: 'Diagnóstico', tras: '#mar-tvp-superior' }, { fuente: 'Manejo', tras: '#mar-tvp-superior' }] },
                { titulo: 'Perforación', color: 'purpura', nodos: ['Vena cava superior', 'Taponamiento cardíaco'] }
            ] }
        ]
    });

    montarVisual('mar-bacteriemia-cateter', {
        guia: 'De dónde viene, cómo se diagnostica y cuándo retirar el catéter.',
        paneles: [
            { tipo: 'barras', titulo: 'Los diez gérmenes (Tabla 3.5, %)', tabla: '#mar-tabla-3-5', series: [{ col: 1, nombre: '% de aislamientos', color: 'rojo' }] },
            { tipo: 'comparar', titulo: 'Diagnóstico (Tabla 3.4)', columnas: [
                { titulo: 'Cuantitativo', color: 'dorado', nodos: [{ fuente: 'css:#mar-tabla-3-4 tbody tr:nth-child(1)', etiqueta: '≥3 veces más colonias (94%)' }] },
                { titulo: 'Tiempo diferencial', color: 'verde', nodos: [{ fuente: 'css:#mar-tabla-3-4 tbody tr:nth-child(2)', etiqueta: '≥2 h antes (91%)' }] }
            ] },
            { tipo: 'flujo', titulo: '¿Retirar el catéter?', nodos: [
                { fuente: 'Mientras se espera', color: 'gris' }, { fuente: '#mar-bac-retirar', etiqueta: 'Retirar si…', color: 'rojo' },
                [{ fuente: 'Recambio sobre guía', color: 'amarillo' }, { fuente: 'Sellado antibiótico', color: 'verde' }]
            ] },
            { tipo: 'racimos', titulo: 'Antibiótico empírico (Tabla 3.6)', tabla: '#mar-tabla-3-6', color: 'purpura' },
            { tipo: 'escalera', titulo: 'Duración del tratamiento', tabla: '#mar-bac-duracion' }
        ]
    });

    // ---- Cap. 4 ----
    montarVisual('mar-microbioma', {
        guia: 'La "piel interna": microbioma, ácido gástrico y descontaminación.',
        paneles: [
            { tipo: 'flujo', titulo: 'El intestino como motor del fallo multiorgánico', nodos: [
                { fuente: '#mar-microbioma-proteccion', etiqueta: 'Cómo protege el microbioma', color: 'verde' },
                { fuente: 'Disbiosis y translocación', color: 'amarillo' },
                { fuente: 'El "motor" del fallo multiorgánico', color: 'rojo' }
            ] },
            { tipo: 'barras', titulo: 'Bacilos gramnegativos en la orofaringe (Figura 4.4, aproximado)', tabla: '#mar-fig-4-4', series: [{ col: 1, nombre: '%', color: 'rojo' }] },
            { tipo: 'barras', titulo: 'Bacteriemias por gramnegativos (Figura 4.5)', tabla: '#mar-fig-4-5', series: [{ col: 1, nombre: 'por 1.000 días', color: 'dorado' }] },
            { tipo: 'comparar', titulo: 'Descontaminar', columnas: [
                { titulo: 'Clorhexidina', color: 'rojo', nodos: ['Clorhexidina oral'] },
                { titulo: 'SOD', color: 'amarillo', nodos: ['Descontaminación oral selectiva'] },
                { titulo: 'SDD', color: 'verde', nodos: ['Descontaminación digestiva selectiva'] }
            ] },
            { tipo: 'racimos', titulo: 'Probióticos', grupos: [{ titulo: 'Probióticos', color: 'purpura', nodos: ['Probióticos'] }] }
        ]
    });

    montarVisual('mar-ulcera-estres', {
        guia: 'Pocos la necesitan: la regla de la Tabla 4.2 y los riesgos de suprimir el ácido.',
        paneles: [
            { tipo: 'escalera', titulo: 'Riesgo de sangrado significativo (Tabla 4.2)', tabla: '#mar-tabla-4-2' },
            { tipo: 'puntos', titulo: '¿Necesita profilaxis? (calculadora de la ficha)', resultado: ['#mar-ulcera-resultado'], items: [
                { checks: '.mar-ulcera-check[data-nivel="maximo"]', pts: 3 }, { checks: '.mar-ulcera-check[data-nivel="alto"]', pts: 2 },
                { checks: '.mar-ulcera-check[data-nivel="moderado"]', pts: 1 }
            ] },
            { tipo: 'comparar', titulo: 'Fármacos', columnas: [
                { titulo: 'Anti-H2', color: 'amarillo', nodos: ['Anti-H2'] },
                { titulo: 'IBP', color: 'dorado', nodos: ['Inhibidores de la bomba'] },
                { titulo: 'Sucralfato', color: 'verde', nodos: ['Sucralfato'] }
            ] },
            { tipo: 'racimos', titulo: 'Por qué no de rutina', grupos: [
                { titulo: 'Contra', color: 'rojo', nodos: ['Riesgos de suprimir el ácido', 'Figura 4.6', 'Desprescribir', 'La nutrición enteral protege'] }
            ] }
        ]
    });

    // ---- Cap. 5 ----
    montarVisual('mar-tromboprofilaxis-farmacos', {
        guia: 'Quién está en riesgo y qué dosis toca según el riñón y el peso.',
        paneles: [
            { tipo: 'barras', titulo: 'ETV sin profilaxis (Figura 5.1, aproximado, límite inferior del rango)', tabla: '#mar-fig-5-1', series: [{ col: 1, nombre: '%', color: 'rojo' }] },
            calc('¿Qué dosis le toca? (calculadora de la ficha)', ['#mar-profilaxis-farmaco', '#mar-profilaxis-clcr', '#mar-profilaxis-imc'], ['#mar-profilaxis-resultado']),
            { tipo: 'comparar', titulo: 'HNF frente a HBPM', columnas: [
                { titulo: 'HNF', color: 'amarillo', nodos: ['Heparina no fraccionada'] },
                { titulo: 'HBPM', color: 'verde', nodos: ['Heparina de bajo peso molecular'] },
                { titulo: 'Fondaparinux', color: 'purpura', nodos: ['Fondaparinux'] }
            ] },
            { tipo: 'racimos', titulo: 'Antes de anticoagular', grupos: [
                { titulo: 'Contraindicaciones', color: 'rojo', nodos: ['Contraindicaciones absolutas', 'Contraindicaciones relativas'] },
                { titulo: 'Punciones', color: 'amarillo', nodos: ['Punciones y catéteres neuroaxiales'] }
            ] }
        ]
    });

    montarVisual('mar-tromboprofilaxis-escenarios', {
        guia: 'Mecánica o farmacológica, y qué pauta para cada paciente.',
        paneles: [
            { tipo: 'escalera', titulo: 'Métodos mecánicos, de menos a más eficaz', nodos: [
                { fuente: 'Medias de compresión gradual', color: 'amarillo' },
                { fuente: 'Compresión neumática intermitente', color: 'verde' }
            ] },
            { tipo: 'racimos', titulo: 'Qué pauta para qué paciente', grupos: [
                { titulo: 'Quirúrgico', color: 'dorado', nodos: ['Cirugía general mayor', 'Cirugía bariátrica', 'Cirugía ortopédica', 'Neurocirugía y cirugía cardíaca'] },
                { titulo: 'Trauma', color: 'rojo', nodos: ['Trauma grave'] },
                { titulo: 'Médico / UCI', color: 'verde', nodos: ['Enfermedad médica aguda'] },
                { titulo: 'Situaciones especiales', color: 'purpura', nodos: ['Situaciones especiales'] }
            ] },
            { tipo: 'racimos', titulo: 'La reflexión del autor', grupos: [{ titulo: 'Inmovilidad', color: 'gris', nodos: ['#mar-inmovilidad'] }] }
        ]
    });

    // ---- Cap. 6 ----
    montarVisual('mar-analgesia', {
        guia: 'Medir el dolor y elegir el analgésico.',
        paneles: [
            { tipo: 'puntos', titulo: 'Escala conductual del dolor (calculadora de la ficha)', resultado: ['#mar-bps-resultado'], items: [
                { control: '#mar-bps-cara', etiqueta: 'Expresión facial' }, { control: '#mar-bps-brazos', etiqueta: 'Miembros superiores' },
                { control: '#mar-bps-ventilador', etiqueta: 'Adaptación al ventilador' }
            ] },
            { tipo: 'comparar', titulo: 'Los opioides', columnas: [
                { titulo: 'Morfina', color: 'amarillo', nodos: ['Morfina'] },
                { titulo: 'Fentanilo', color: 'verde', nodos: ['Fentanilo'] },
                { titulo: 'Hidromorfona', color: 'dorado', nodos: ['Hidromorfona'] }
            ] },
            { tipo: 'racimos', titulo: 'Efectos adversos', grupos: [
                { titulo: 'Opioides', color: 'rojo', nodos: ['Depresión respiratoria', 'Cardiovasculares', 'Motilidad intestinal', 'Náuseas y vómitos'] },
                { titulo: 'Evitar', color: 'purpura', nodos: ['Meperidina'] }
            ] },
            { tipo: 'racimos', titulo: 'Sin opioides (Tabla 6.3)', tabla: '#mar-tabla-6-3', color: 'verde' }
        ]
    });

    montarVisual('mar-sedacion', {
        guia: 'Sedación ligera, titulada con una escala.',
        paneles: [
            { tipo: 'escalera', titulo: 'Escala RASS (Tabla 6.4)', tabla: '#mar-tabla-6-4' },
            { tipo: 'selector', titulo: '¿Dónde está y dónde debería estar?', control: '#mar-rass-select', forma: 'escalera', resultado: ['#mar-rass-resultado'] },
            { tipo: 'comparar', titulo: 'Sedantes de despertar rápido', columnas: [
                { titulo: 'Propofol', color: 'dorado', nodos: ['#mar-propofol'] },
                { titulo: 'Dexmedetomidina', color: 'verde', nodos: ['#mar-dexmedetomidina'] }
            ] },
            { tipo: 'barras', titulo: 'Despertar tras propofol con sedación profunda (Tabla 6.7, horas)', tabla: '#mar-tabla-6-7', series: [{ col: 2, nombre: 'Sedación profunda (h)', color: 'rojo' }] },
            calc('Propofol: dosis y riesgo (calculadora de la ficha)', ['#mar-propofol-mlh', '#mar-propofol-peso', '#mar-propofol-horas'], ['#mar-propofol-resultado']),
            { tipo: 'flujo', titulo: 'Haloperidol (Tabla 6.8)', nodos: [{ fuente: '#mar-tabla-6-8', etiqueta: 'Pauta escalonada', color: 'amarillo' }, { fuente: '#mar-haloperidol-qtc', etiqueta: 'No si QTc >500 ms', color: 'rojo' }] }
        ]
    });

    // ---- Cap. 7 ----
    montarVisual('mar-oximetria', {
        guia: 'Qué mide la SpO₂, qué no ve, y la oximetría dual.',
        paneles: [
            { tipo: 'flujo', titulo: 'Cómo funciona', nodos: [
                { fuente: 'La luz que absorbe', color: 'rojo' }, { fuente: 'Pulsioximetría', color: 'dorado' }, { fuente: '#mar-spo2-formula', etiqueta: 'SpO₂ = HbO₂ / (Hb + HbO₂)', color: 'verde' }
            ] },
            { tipo: 'racimos', titulo: 'Lo que la SpO₂ no ve', grupos: [
                { titulo: 'Límites', color: 'rojo', nodos: ['Carboxi y metahemoglobina', 'Exactitud', 'Hipoxemia oculta'] },
                { titulo: 'Objetivo', color: 'verde', nodos: ['Objetivo de SpO₂'] }
            ] },
            { tipo: 'comparar', titulo: 'Saturación venosa', columnas: [
                { titulo: 'Mixta', color: 'dorado', nodos: ['Venosa mixta'] },
                { titulo: 'Central', color: 'amarillo', nodos: ['Venosa central'] }
            ] },
            calc('Oximetría dual (calculadora de la ficha)', ['#mar-dual-spo2', '#mar-dual-svo2'], ['#mar-dual-resultado'])
        ]
    });

    montarVisual('mar-capnografia', {
        guia: 'El capnograma y para qué sirve el CO₂ espirado.',
        paneles: [
            { tipo: 'flujo', titulo: 'Las 4 fases del capnograma', nodos: [
                { fuente: 'Fase I', color: 'gris' }, { fuente: 'Fase II', color: 'amarillo' }, { fuente: 'Fase III', color: 'verde' }, { fuente: 'Fase IV', color: 'dorado' }
            ] },
            { tipo: 'racimos', titulo: 'Para qué sirve', grupos: [
                { titulo: 'Usos', color: 'verde', nodos: ['Sedación para procedimientos', 'Intubación', 'Cambios del gasto cardíaco', 'Reanimación'] }
            ] },
            { tipo: 'comparar', titulo: 'PaCO₂ frente a PETCO₂ (Tabla 7.1)', columnas: [
                { titulo: 'PETCO₂ < PaCO₂', color: 'rojo', nodos: [{ fuente: 'css:#mar-tabla-7-1 > *:first-child', etiqueta: 'Más espacio muerto' }] },
                { titulo: 'PETCO₂ > PaCO₂', color: 'amarillo', nodos: [{ fuente: 'css:#mar-tabla-7-1 > *:last-child', etiqueta: 'Más CO₂ producido' }] }
            ] }
        ]
    });

    // ---- Cap. 8 ----
    montarVisual('mar-cateter-ap', {
        guia: 'Las ondas guían el avance; el enclavamiento es la aurícula izquierda… sin flujo.',
        paneles: [
            { tipo: 'flujo', titulo: 'Avance del catéter (Figura 8.2)', nodos: [
                { fuente: 'css:#mar-cap-pasos > li:nth-child(1)', etiqueta: 'Aurícula derecha', color: 'verde' },
                { fuente: 'css:#mar-cap-pasos > li:nth-child(2)', etiqueta: 'Ventrículo derecho', color: 'amarillo' },
                { fuente: 'css:#mar-cap-pasos > li:nth-child(3)', etiqueta: 'Arteria pulmonar', color: 'rojo' },
                { fuente: 'css:#mar-cap-pasos > li:nth-child(4)', etiqueta: 'Enclavamiento', color: 'purpura' }
            ] },
            { tipo: 'racimos', titulo: 'Leer el enclavamiento', grupos: [
                { titulo: 'Principio', color: 'dorado', nodos: ['El principio', 'Su forma'] },
                { titulo: 'Trampas', color: 'rojo', nodos: ['Variación respiratoria', 'PEEP', 'Variación espontánea', '#mar-enclavamiento-hidrostatica'] }
            ] }
        ]
    });

    montarVisual('mar-termodilucion', {
        guia: 'Del bolo frío a los 10 parámetros.',
        paneles: [
            { tipo: 'flujo', titulo: 'Termodilución', nodos: [
                { fuente: 'El método', color: 'dorado' }, { fuente: '¿Cuántas medidas?', color: 'verde' }, { fuente: '#mar-termo-errores', etiqueta: 'Fuentes de error', color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'Los parámetros (Tabla 8.1)', tabla: '#mar-tabla-8-1', color: 'dorado' },
            calc('Del catéter a los índices (calculadora de la ficha)', ['#mar-hemo-talla', '#mar-hemo-peso', '#mar-hemo-gc', '#mar-hemo-fc', '#mar-hemo-pam', '#mar-hemo-pvc', '#mar-hemo-pap', '#mar-hemo-pawp', '#mar-hemo-hb', '#mar-hemo-sao2', '#mar-hemo-svo2'], ['#mar-hemo-resultado'])
        ]
    });

    // ---- Cap. 9 ----
    montarVisual('mar-transporte-o2', {
        guia: 'Cuánto O₂ lleva la sangre y cuánto llega a los tejidos.',
        paneles: [
            calc('Contenido arterial de O₂ (calculadora de la ficha)', ['#mar-cao2-hb', '#mar-cao2-sao2', '#mar-cao2-pao2'], ['#mar-cao2-resultado'], 'Prueba a bajar la Hb a la mitad y luego la PaO₂ a la mitad.'),
            { tipo: 'comparar', titulo: 'Anemia frente a hipoxemia (Figura 9.2)', columnas: [
                { titulo: 'Hb a la mitad', color: 'rojo', nodos: [{ fuente: '#mar-anemia-hipoxemia', etiqueta: 'CaO₂ 20 → 10 mL/dL' }] },
                { titulo: 'PaO₂ a la mitad', color: 'amarillo', nodos: [{ fuente: '#mar-anemia-hipoxemia', etiqueta: 'CaO₂ 20 → 16 mL/dL' }] }
            ] },
            { tipo: 'flujo', titulo: 'El transporte de O₂', nodos: [
                { fuente: 'Aporte (DO₂)', color: 'verde' }, { fuente: 'Consumo (VO₂)', color: 'amarillo' }, { fuente: 'Extracción (O₂ER)', color: 'rojo' }
            ] },
            { tipo: 'racimos', titulo: 'La curva de disociación', grupos: [{ titulo: 'Curva', color: 'dorado', nodos: ['Por qué la forma de S ayuda', 'Desplazamientos'] }] }
        ]
    });

    montarVisual('mar-extraccion-lactato', {
        guia: 'Cuando la extracción llega al 50%, el consumo depende del aporte; y el lactato no es solo hipoxia.',
        paneles: [
            calc('Aporte y consumo de O₂ (simulador de la ficha)', ['#mar-dv-do2'], ['#mar-do2-vo2-sim svg', '#mar-dv-resultado']),
            calc('¿Qué dice esta saturación venosa? (calculadora de la ficha)', ['#mar-ext-sao2', '#mar-ext-svo2'], ['#mar-ext-resultado']),
            { tipo: 'barras', titulo: 'Mortalidad según el lactato (Figura 9.4)', tabla: '#mar-fig-9-4', series: [{ col: 1, nombre: 'Mortalidad %', color: 'rojo' }] },
            { tipo: 'racimos', titulo: 'Lactato sin hipoxia', grupos: [
                { titulo: 'Causas', color: 'amarillo', nodos: ['Sepsis', 'Estrés fisiológico', 'Déficit de tiamina'] },
                { titulo: 'Combustible', color: 'verde', nodos: ['El lactato como combustible'] }
            ] }
        ]
    });

    // ---- Cap. 10 ----
    montarVisual('mar-cristaloides', {
        guia: 'Adónde va lo que se infunde y por qué el salino no es "normal".',
        paneles: [
            calc('¿Adónde va lo que infundo? (simulador de la ficha)', ['#mar-fs-fluido', '#mar-fs-vol'], ['#mar-fs-barras', '#mar-fs-resultado']),
            { tipo: 'barras', titulo: 'Cloro de cada cristaloide (Tabla 10.2, mEq/L)', tabla: '#mar-tabla-10-2', series: [{ col: 2, nombre: 'Cl', color: 'rojo' }] },
            { tipo: 'comparar', titulo: 'Los cristaloides', columnas: [
                { titulo: 'Salino 0,9%', color: 'rojo', nodos: ['Salino al 0,9%'] },
                { titulo: 'Ringer lactato', color: 'amarillo', nodos: ['Ringer lactato'] },
                { titulo: 'Equilibradas', color: 'verde', nodos: ['Ringer acetato y soluciones'] }
            ] },
            { tipo: 'racimos', titulo: 'Glucosados al 5%: ya no', grupos: [{ titulo: 'Glucosado', color: 'purpura', nodos: ['Ahorro de proteínas', { fuente: 'Adónde va', tras: '#mar-glucosado-calorias' }, 'Más lactato', 'Hiperglucemia'] }] }
        ]
    });

    montarVisual('mar-coloides', {
        guia: 'Los coloides expanden más el plasma; el fluido se elige según el problema.',
        paneles: [
            { tipo: 'barras', titulo: 'Expansión del plasma por volumen infundido (Tabla 10.3, límite inferior)', tabla: '#mar-tabla-10-3', series: [{ col: 2, nombre: 'Δ plasma / volumen', color: 'dorado' }] },
            { tipo: 'comparar', titulo: 'Los coloides', columnas: [
                { titulo: 'Albúmina', color: 'verde', nodos: ['Albúmina'] },
                { titulo: 'HES', color: 'rojo', nodos: ['Hidroxietilalmidones'] },
                { titulo: 'Dextranos', color: 'amarillo', nodos: ['Dextranos'] }
            ] },
            { tipo: 'racimos', titulo: 'Un fluido para cada hipovolemia', tabla: '#mar-fluido-a-medida', color: 'purpura' }
        ]
    });

    // ---- Cap. 11 ----
    montarVisual('mar-retorno-venoso', {
        guia: 'El retorno venoso lo mueve la Pms, no la presión arterial; y la PVC lo frena.',
        paneles: [
            calc('La curva de retorno venoso (simulador de la ficha)', ['#mar-rs-pms', '#mar-rs-pad'], ['#mar-retorno-sim svg', '#mar-rs-resultado']),
            calc('¿Cuánto cristaloide para reponer el plasma? (calculadora de la ficha)', ['#mar-def-peso', '#mar-def-sexo', '#mar-def-pct'], ['#mar-def-resultado']),
            { tipo: 'flujo', titulo: 'Volemia: lo que no sirve y lo que sí', nodos: [
                [{ fuente: '#mar-pvc-volemia', etiqueta: 'La PVC: no', color: 'rojo' }, { fuente: '#mar-vci-volemia', etiqueta: 'La VCI: poco fiable', color: 'amarillo' }],
                { fuente: '#mar-constantes-volemia', etiqueta: 'Constantes: lo más sensible, el ortostatismo', color: 'verde' }
            ] },
            { tipo: 'racimos', titulo: 'Volúmenes en el shock séptico (Figura 11.3)', tabla: '#mar-fig-11-3', color: 'rojo' }
        ]
    });

    montarVisual('mar-respuesta-fluidos', {
        guia: 'Antes del bolo: ¿hay hipoperfusión y va a responder?',
        paneles: [
            calc('ScvO₂ + gap de PCO₂ (calculadora de la ficha)', ['#mar-perf-scvo2', '#mar-perf-pvco2', '#mar-perf-paco2', '#mar-perf-contexto'], ['#mar-perf-resultado']),
            { tipo: 'comparar', titulo: 'Los dos marcadores', columnas: [
                { titulo: 'ScvO₂', color: 'dorado', nodos: ['#mar-scvo2-pautas'] },
                { titulo: 'Gap de PCO₂', color: 'verde', nodos: ['#mar-gap-co2'] }
            ] },
            { tipo: 'flujo', titulo: 'Elevación pasiva de las piernas', nodos: [
                { fuente: 'css:#mar-epp-pasos > .algo-step:nth-child(1)', etiqueta: 'Semiincorporado y VS basal', color: 'gris' },
                { fuente: 'css:#mar-epp-pasos > .algo-step:nth-child(2)', etiqueta: 'Con la cama: piernas a 30-45°', color: 'amarillo' },
                { fuente: 'css:#mar-epp-pasos > .algo-step:nth-child(3)', etiqueta: 'VS ≥10% → volver y debe desaparecer', color: 'verde' },
                { fuente: '#mar-epp-dolor', etiqueta: 'Taquicardia: sospecha dolor', color: 'rojo' }
            ] },
            calc('¿Responde a fluidos? (calculadora de la ficha)', ['#mar-resp-prueba', '#mar-resp-vs0', '#mar-resp-vs1'], ['#mar-resp-resultado']),
            calc('VVS (calculadora de la ficha)', ['#mar-vvs-max', '#mar-vvs-min', '#mar-vvs-media'], ['#mar-vvs-resultado'])
        ]
    });
}
