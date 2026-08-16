// Datos puros para los selectores interactivos de las fichas "Regulación del
// agua corporal", "Hiponatremia", "Hipernatremia", "Regulación del potasio
// corporal", "Hipopotasemia" e "Hiperpotasemia" del cuaderno de campo de
// Fisiopatología renal. Fuentes: Martín Navarro JA et al. Trastornos del
// Agua. Disnatremias. Nefrología al día (SEN), 4/8/2025; de Sequera Ortíz P
// et al. Trastornos del potasio. Nefrología al día (SEN), 14/6/2024.

export const hiponatremiaPorVolemia = {
    hipovolemica: {
        etiqueta: 'Hiponatremia hipovolémica',
        texto: 'VEC contraído. Causas: diuréticos (73% solo tiazidas), vómitos/aspiración nasogástrica, síndrome pierde sal renal, pérdidas cutáneas, pérdidas digestivas, tercer espacio.',
        detalle: '[Na]orina y [Cl]orina &lt;20 mEq/l si el origen es extrarrenal (vómitos, diarrea, cutáneas); &gt;20 mEq/l si el origen es renal (diuréticos, nefropatía pierde sal, bicarbonaturia, cetonuria, diuresis osmótica, síndrome cerebral pierde sal).',
        tratamiento: 'Restaurar la volemia con suero salino isotónico al 0,9%.',
    },
    euvolemica: {
        etiqueta: 'Hiponatremia euvolémica',
        texto: 'VEC normal. Causa más frecuente: SIADH (buscar fármacos, causa neurológica, pulmonar...). También: hipotiroidismo, insuficiencia suprarrenal/hipocortisolismo, reset osmostat, polidipsia.',
        detalle: 'Osmolalidad urinaria &gt;100 mOsm/kg con [Na+K]orina &gt; [Na]plasma → respuesta de ADH inapropiada para la hipoosmolalidad sérica.',
        tratamiento: 'Restricción hídrica (de todos los líquidos, no solo del agua) + dieta con sal e hiperproteica. Refractarios: urea oral, diuréticos de asa + ClNa, o tolvaptán en SIADH.',
    },
    hipervolemica: {
        etiqueta: 'Hiponatremia hipervolémica',
        texto: 'VEC aumentado con edemas. Causas: insuficiencia cardíaca, cirrosis, síndrome nefrótico, insuficiencia renal.',
        detalle: 'Aumenta el sodio corporal total, pero aumenta más el agua corporal total — el VEC eficaz percibido está bajo pese a la sobrecarga real, lo que mantiene estimulada la ADH.',
        tratamiento: 'Restricción de agua por debajo de las pérdidas insensibles + diuresis. Valorar diurético de asa, espironolactona o IECA. En cirróticos, la albúmina IV se ha asociado a mejoría; el suero hipertónico se reserva para casos graves o sintomáticos.',
    },
};

export const hipernatremiaDiagnosticoDiferencial = {
    dic: {
        etiqueta: 'Diabetes insípida central (DIC)',
        texto: 'Fallo de secreción de ADH (tumores, neurocirugía, TCE, granulomatosas, infecciones, idiopática).',
        detalle: 'Test de deprivación hídrica: Osmo con deprivación &lt;300 mOsm/kg (completa) o 300-800 (parcial); ADH tras deprivación no detectable o &lt;1,5 pg/ml; tras ADH exógena, la Osmo aumenta de forma notable (&gt;10%). Copeptina basal &lt;21,4 pmol/l y, tras estimulación, ≤4,9 pmol/l.',
        tratamiento: 'Desmopresina (oral, nasal o parenteral) — vigilar riesgo de hiponatremia dilucional si el paciente sigue con alta ingesta de agua.',
    },
    din: {
        etiqueta: 'Diabetes insípida nefrogénica (DIN)',
        texto: 'Fallo de respuesta renal a la ADH (litio, hipercalcemia, hipopotasemia, ERC, poliquistosis renal, congénita ligada a X).',
        detalle: 'Test de deprivación hídrica: Osmo con deprivación 300-500 mOsm/kg; ADH tras deprivación &gt;5 pg/ml (alta, pero ineficaz); tras ADH exógena, la Osmo apenas cambia. Copeptina basal ≥21,4 pmol/l diagnostica DIN directamente (E 100%, S 93%), sin necesitar test de estimulación.',
        tratamiento: 'La desmopresina es ineficaz. Base del tratamiento: tiazidas + dieta baja en sodio y proteínas. En DIN por litio, el amiloride bloquea la entrada de litio a la célula.',
    },
    polidipsia: {
        etiqueta: 'Polidipsia primaria',
        texto: 'Capacidad renal de excreción de agua normal, pero superada por una ingesta excesiva (&gt;10-15 l/día) — psiquiátrica o por hábito.',
        detalle: 'Test de deprivación hídrica: Osmo con deprivación &gt;500 mOsm/kg; ADH tras deprivación &lt;5 pg/ml; tras ADH exógena, poco o ningún cambio. Copeptina tras estimulación &gt;4,9 pmol/l (E 93%, S 100%).',
        tratamiento: 'Manejo psiquiátrico/conductual de la ingesta. No indicada la desmopresina ni las tiazidas.',
    },
};

export const factoresDistribucionPotasio = {
    insulina: {
        etiqueta: 'Insulina',
        texto: 'Estimula rápidamente la entrada de K⁺ a la célula activando la Na⁺/K⁺-ATPasa.',
        direccion: 'entrada',
        detalle: 'Una sobrecarga de glucosa en un paciente con reserva insulínica intacta promueve liberación de insulina e hipopotasemia — la base de usar "insulina + glucosa" como tratamiento urgente de la hiperpotasemia. Una elevación del K⁺ también estimula, a su vez, la liberación de insulina.',
    },
    catecolaminas: {
        etiqueta: 'Catecolaminas β-adrenérgicas',
        texto: 'La estimulación β2 (salbutamol, epinefrina) activa la adenilciclasa → ↑AMPc → estimula la Na⁺/K⁺-ATPasa → entrada de K⁺.',
        direccion: 'entrada',
        detalle: 'Favorece hipopotasemia en situaciones de estrés (p. ej. liberación de epinefrina en isquemia coronaria). De forma inversa, los agonistas α-adrenérgicos (fenilefrina) inhiben la entrada de K⁺ a la célula.',
    },
    alcalosis: {
        etiqueta: 'Alcalosis metabólica',
        texto: 'El aumento del bicarbonato sérico provoca salida de H⁺ del interior celular como tampón, y entra K⁺ para mantener la electroneutralidad.',
        direccion: 'entrada',
        detalle: 'Esta entrada de K⁺ ocurre incluso cuando el pH plasmático todavía no está en rango alcalótico.',
    },
    acidosis: {
        etiqueta: 'Acidosis metabólica (inorgánica)',
        texto: 'Los H⁺ del medio extracelular entran a la célula y sale K⁺ de forma pasiva para mantener la electroneutralidad.',
        direccion: 'salida',
        detalle: 'Este efecto es mucho menos marcado en las acidosis con anión gap aumentado (láctica, cetoacidosis) porque esos aniones orgánicos se cotransportan de forma electroneutra al interior celular junto con el H⁺, sin necesitar intercambio por K⁺.',
    },
    aldosterona: {
        etiqueta: 'Aldosterona',
        texto: 'Aumenta la excreción renal de K⁺ y, además, favorece algo de entrada de K⁺ a la célula (estimula la Na⁺/K⁺-ATPasa).',
        direccion: 'entrada + salida renal',
        detalle: 'Su efecto dominante es sobre la eliminación renal (vía ENaC/ROMK en el túbulo distal y colector), no sobre la distribución transcelular — por eso su hiperactividad (hiperaldosteronismo) causa hipopotasemia por pérdida renal, no por redistribución.',
    },
    hiperosmolalidad: {
        etiqueta: 'Hiperosmolalidad extracelular',
        texto: 'La hiperglucemia grave o la administración de manitol sacan agua del espacio intracelular al extracelular por gradiente osmótico.',
        direccion: 'salida',
        detalle: 'Esa salida de agua arrastra K⁺ de forma pasiva hacia el líquido extracelular — un mecanismo conocido como "arrastre por solvente".',
    },
};

export const sindromesHipopotasemicos = {
    bartter: { etiqueta: 'Síndrome de Bartter', herencia: 'Autosómica recesiva', inicio: 'Niños (90% neonatal)', ta: 'Normal o ↓', aldosterona: '↑', otras: 'Hipercalciuria' },
    gitelman: { etiqueta: 'Síndrome de Gitelman', herencia: 'Autosómica recesiva', inicio: 'Adultos', ta: '↓', aldosterona: '↑', otras: 'Hipocalciuria, hipomagnesemia' },
    liddle: { etiqueta: 'Síndrome de Liddle', herencia: 'Autosómica dominante', inicio: 'Niños', ta: '↑', aldosterona: 'Suprimida', otras: 'No responde a espironolactona; sí a triamtereno' },
    diureticos: { etiqueta: 'Ingesta de diuréticos', herencia: 'No hereditario', inicio: 'Adultos', ta: 'Normal o ↓', aldosterona: '↑', otras: 'Diuréticos detectables en orina' },
    regaliz: { etiqueta: 'Ingesta de regaliz', herencia: 'No hereditario', inicio: 'Adultos o niños', ta: '↑', aldosterona: 'Suprimida', otras: 'El ácido glicirrínico potencia el efecto mineralocorticoide del cortisol endógeno' },
};

export const mecanismosHiperpotasemia = {
    pseudo: {
        etiqueta: 'Pseudohiperpotasemia',
        texto: 'Elevación falsa del K⁺ medido, sin hiperpotasemia real.',
        detalle: 'Muestra hemolizada, leucocitosis &gt;200.000/mm³ o trombocitosis &gt;500.000/mm³ (liberan K⁺ intracelular durante la coagulación), torniquete excesivamente apretado con contracción muscular de la extremidad.',
    },
    aporte: {
        etiqueta: 'Aporte excesivo de potasio',
        texto: 'Ingesta oral o intravenosa de K⁺.',
        detalle: 'Rara vez causa hiperpotasemia por sí sola — solo es relevante cuando coexiste una alteración de la excreción renal (insuficiencia renal, hipoaldosteronismo).',
    },
    eliminacion: {
        etiqueta: 'Disminución de la eliminación renal',
        texto: 'IRA/ERC, enfermedad de Addison, hiperplasia adrenal congénita, hipoaldosteronismo hiporreninémico (ATR tipo IV), disfunción tubular distal.',
        detalle: 'Fármacos: IECA/ARA2/inhibidores de renina/heparina (↓liberación o síntesis de aldosterona); espironolactona/eplerenona/triamtereno/amiloride/trimetoprim (bloquean la secreción tubular de K⁺). La IR solo causa hiperpotasemia por sí sola cuando el FG cae por debajo de 10-15 ml/min, salvo en el hipoaldosteronismo hiporreninémico, donde aparece con grados menores de insuficiencia renal.',
    },
    redistribucion: {
        etiqueta: 'Paso de potasio al líquido extracelular',
        texto: 'Acidosis, lisis celular, déficit de insulina + hiperglucemia grave, parálisis periódica hiperpotasémica.',
        detalle: 'Lisis celular: traumatismos extensos, quemaduras, lisis tumoral, rabdomiólisis, hemólisis. Fármacos: β-bloqueantes, intoxicación digitálica, succinilcolina, agonistas adrenérgicos, arginina, soluciones hipertónicas.',
    },
};
