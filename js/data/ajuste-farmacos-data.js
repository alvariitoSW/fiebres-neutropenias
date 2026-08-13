// Ajuste de dosis de fármacos por función renal — datos puros, sin DOM.
// Fuente: García Montemayor V, Sanchez-Agesta Martínez M, Naranjo Muñoz J.
// Ajuste de Fármacos en la Enfermedad Renal Crónica. Nefrología al día
// (SEN), actualizado 24/5/2025.
//
// Cada categoría es una de las tablas originales del artículo. `tipo`
// determina el juego de columnas que renderiza nefrotoxicidad.js:
//   'antibiotico' → [nombre, dosisNormal, metodo, ccr100_50, ccr50_10, ccrMenos10, hd, hfvvc]
//   'estandar'    → [nombre, dosisNormal, metodo, ccr100_50, ccr50_10, ccrMenos10, hd]
// Método: D = reducir dosis si procede; I = aumentar intervalo entre dosis
// si procede; D e I = ambos.
export const categoriasFarmacos = [
    {
        id: 'antibacterianos-1',
        nombre: 'Antibióticos 1: Aminoglucósidos, Carbapenem, Cefalosporinas',
        tipo: 'antibiotico',
        grupos: [
            {
                subtitulo: 'Aminoglucósidos',
                filas: [
                    ['Amikacina', '7,5 mg/kg/8-12h', 'I', 'Cada 8-12h', 'Cada 24-48h', 'Cada 48-72h', 'Dosis postdiálisis', 'Ccr=50-10 ml/min'],
                    ['Estreptomicina', '15 mg/kg/24h (Máx. 1g)', 'I', 'Cada 24h', 'Cada 24-72h', 'Cada 72-96h', 'Dosis postdiálisis', 'Ccr=50-10 ml/min'],
                    ['Gentamicina/Tobramicina', '3,5 mg/kg/8h', 'D e I', 'Cada 8-12h', '30-70%/12-24h', '20-30%/24-48h', 'Dosis postdiálisis', 'Ccr=50-10 ml/min'],
                ],
            },
            {
                subtitulo: 'Carbapenem',
                filas: [
                    ['Ertapenem', '1 g/24h', 'D', '100%', '100%', '25%', 'Dosis postdiálisis', 'Ccr=50-10 ml/min'],
                    ['Imipenem', '250mg-1g/6h (Min. 4g/día)', 'D e I', '100%', '50%', '25%', 'Dosis postdiálisis', 'Ccr=50-10 ml/min'],
                    ['Meropenem', '1-2g/8h', 'D e I', '100%', '50%/12h', '50%/24h', 'Dosis postdiálisis', 'Ccr=50-10 ml/min'],
                ],
            },
            {
                subtitulo: 'Cefalosporinas',
                filas: [
                    ['Cefazolina', '500mg-1g/8h (Máx. 2g/8h)', 'I', 'Cada 8h', 'Cada 8-12h', 'Cada 18-24h', 'Dosis postdiálisis', '—'],
                    ['Cefepima', '1-2g/12h', 'D e I', '1-2g/12h', '500mg-2g/24h', '250-500mg/24h', 'Extra 1g postdiálisis', 'Ccr=50-10 ml/min'],
                    ['Cefixima', '200mg/12h', 'D', '100%', '75%', '50%', '—', '—'],
                    ['Cefotaxima', '1-2g/6-12h', 'D', 'Cada 6h', 'Cada 6-12h', 'Cada 24h o 50%', 'Extra 1g postdiálisis', 'Ccr=50-10 ml/min'],
                    ['Cefoxitina', '1-2g/6-8h', 'D', 'Cada 6-8h', 'Cada 12-24h', 'Cada 24-48h', 'Extra 1g postdiálisis', 'Ccr=50-10 ml/min'],
                    ['Ceftazidima', '1-2g/8-12h', 'D', 'Cada 8-12h', 'Cada 12-48h', 'Cada 48h', 'Extra 1g postdiálisis', 'Ccr=50-10 ml/min'],
                    ['Ceftriaxona', '1-2g/24h', 'D', '100%', '100%', '100%', 'Cada 24h', '—'],
                    ['Cefuroxima', '0,75-1,5g/8h', 'D', 'Cada 8-12h', 'Cada 24h', 'Cada 24h', 'Extra 1g postdiálisis', 'Ccr=50-10 ml/min'],
                    ['Ceftazidima-Avibactam', '2g/0,5g/8h', 'D e I', '100,00%', 'Si CCr 50-31: 1g/0,25g/8h. Si CCr 30-16: 0,75/0,875g/12h', 'Si CCr 15-10: 0,75/0,875g/24h. Si CCr<10: 0,75/0,875g/48h', '0,75/0,875g/48h', '—'],
                    ['Ceftolozano-Tazobactam', '1g/0,5g/8h', 'D', '100,00%', 'Si CCr 50-30ml: 1g-500mg/500mg-250mg/8h. Si CCr 29-15ml: 500mg-250mg/250mg-125mg/8h', '500mg-250mg-125mg/8h', 'Dosis carga 1,5g-500mg/750mg-250mg/8h; dosis mantenimiento 100-300/50-150mg/8h', '—'],
                ],
            },
        ],
    },
    {
        id: 'antibacterianos-2',
        nombre: 'Antibióticos 2: Fluorquinolonas, Macrólidos, Miscelánea',
        tipo: 'antibiotico',
        grupos: [
            {
                subtitulo: 'Fluorquinolonas',
                filas: [
                    ['Ciprofloxacino', '500-750 mg/12h', 'D', '100,00%', '100,00%. Si Ccr<30ml/min 200mg/12h', 'No recomendado', 'Dosis postdiálisis'],
                    ['Delafloxacino', '300 mg/12h', 'D', '100,00%', '100,00%. Si Ccr<30ml/min 200mg', '500mg x 1 y seguir con 250-200mg/24-48h', 'Dosis postdiálisis'],
                    ['Levofloxacino', '250-750mg/24h', 'D', '100,00%', '500 mg x 1 y seguir con 250-200mg/24-48h', '500mg x 1 y seguir con 250-500mg/48h', 'Dosis postdiálisis'],
                    ['Moxifloxacino', '400mg/24h', 'No', '100,00%', '100,00%', '100,00%', 'Evitar'],
                    ['Norfloxacino', '400mg/24h', 'I', 'Cada 12h', 'Cada 12-24h', 'Evitar', '—'],
                    ['Ofloxacino', '200-400mg/12h', 'D e I', '100,00%', '200-400mg/24h', '200mg/24h', '100-200mg postdiálisis'],
                ],
            },
            {
                subtitulo: 'Macrólidos',
                filas: [
                    ['Azitromicina', '500mg/24h', 'No', '100,00%', '100,00%', '100,00%', 'Dosis postdiálisis'],
                    ['Claritromicina', '250-500mg/12h', 'D', '100,00%', '500mg x1 y seguir con 250mg/12-24h', '500mg x1 y seguir con 250mg/24h', 'Dosis postdiálisis'],
                    ['Roxitromicina', '150mg/12h', 'D', '100,00%', '100,00%', '50-75%', '—'],
                    ['Eritromicina', '250-500mg/6-12h (Máx. 4g/día)', 'D', '100,00%', '100,00%', '50-75%', '—'],
                ],
            },
            {
                subtitulo: 'Miscelánea antibacterianos',
                filas: [
                    ['Clindamicina', '600-900mg/8h', 'No', '100,00%', '100,00%', '100,00%', '—'],
                    ['Cloranfenicol', '0,25-1g/6-100h', 'No', '100,00%', '100,00%', '100,00%', '—'],
                    ['Colistina', '1-2 MUI (millones de unidades)/8-12h', 'D', '1-2 MUI/8-12h', '4,5-7,5 MUI/24h', '3,5 MUI/24h', '2,25 MUI/24h días NO HD; 3 MUI/24h postdiálisis (días HD)'],
                    ['Daptomicina', '1000mg/24h. Sobre peso 500mg/2 semanas', 'D', '100,00%. Si CCr<30ml/min 750mg 1ª semana, 375mg 2ª semana', '750mg 1ª semana, 375mg 2ª semana. No dosis extra', 'Cada 48h', 'Cada 48h (post HD)'],
                    ['Daptomicina', '4-6mg/Kg/24h', 'D', '100,00%', '100,00%', 'Cada 48h', 'Dosis postdiálisis'],
                    ['Metronidazol', '400-600mg/8h', 'D', '100,00%', '100,00%', 'Cada 8h', 'Evitar'],
                    ['Nitrofurantoína', '500mg/24h', 'No', '100,00%', 'Evitar', 'Evitar', '—'],
                    ['Oxazinamas', '15mg/12h', 'No', '100,00%', '100,00%', '100,00%', 'Extra 1g postdiálisis'],
                    ['Sulfametoxazol', '1g/8/12h', 'No', 'Cada 12h', 'Cada 18h', 'Cada 24h', '100,00%'],
                    ['Tedizolid', '20mg/24h', 'No', '100,00%', '100,00%', '100,00%', '—'],
                    ['Teicoplanina', '6mg/kg/24h', 'D', '100,00%', 'Cada 48h', 'Cada 72h', 'Ccr=50-10 ml/min'],
                    ['Tigeciclina', '100mg/24h', 'D', 'Cada 12h', 'Cada 12h. Si FG 30-10 ml/min', '100,00%', '—'],
                    ['Trimetoprim', '100mg/12h', 'I', 'Cada 12h', 'Cada 18-24h. Si Ccr<10ml/min 4-6 días', 'Cada 24h', 'Dosis postdiálisis. Si membrana HF 500mg. postHD'],
                    ['Vancomicina', '1g/12h', 'D e I', '1g/12h', '100,00%', '100,00%', 'Ccr=10-50 ml/min. Si Ccr<10ml/min 500mg/24-48h'],
                ],
            },
        ],
    },
    {
        id: 'antibacterianos-3',
        nombre: 'Antibióticos 3: Penicilinas, Tetraciclinas',
        tipo: 'antibiotico',
        grupos: [
            {
                subtitulo: 'Penicilinas',
                filas: [
                    ['Amoxicilina', '875 mg/12h — 250-500mg/8h', 'I', '100%', 'Cada 8-12h', 'Cada 24h', 'Dosis postdiálisis', '—'],
                    ['Amoxi/Clavulánico', '500/125mg/8h', 'D e I', '500/125mg/8h', '250/125mg/12h', '250/125mg/24h', 'Dosis postdiálisis', '—'],
                    ['Ampicilina', '250mg-2g/6h', 'I', '100%', 'Cada 6-12h', 'Cada 24h', 'Dosis postdiálisis', '—'],
                    ['Aztreonam', '1-2g/8h', 'No', '100%', '1-2g x1 y seguir con 500mg/6-8h', '1-2g x1 y seguir con 500mg/6-12h', 'Extra 250mg postdiálisis', '—'],
                    ['Eravaciclina', '1mg/kg/12h', 'D', '100,00%', '100,00%', '100%', 'Dosis postdiálisis', '—'],
                    ['Penicilina G', '0,5-4 millones. U/4-6h', 'D', '100%', '75%', '20-50%', 'Dosis postdiálisis', '—'],
                    ['Piperacilina', '3-4g/4-6h', 'I', '100%', 'Cada 6-8h', 'Cada 12h', 'Dosis postdiálisis', 'Ccr=50-10 ml/min'],
                    ['Piperacilina/Tazobactam', '3,375-4,5g/6h', 'D e I', '2,25g/6h; si FG<20ml: 2,25g/8h', '2,25g/8h', 'No', 'Ccr=50-10 ml/min'],
                    ['Ticarcilina', '1g/4h', 'D e I', '1-2g/4h', '1-2g/8h', '1-2g/12h', 'Ccr=50-10 ml/min', '—'],
                    ['Ticarcilina/Clavulánico', '3,1g/4h', 'D e I', '3,1g/4h', '3,1g/8-12h', '2,0g/12h', 'Extra 2g postd', '—'],
                ],
            },
            {
                subtitulo: 'Tetraciclinas',
                filas: [
                    ['Doxiciclina', '100mg/12h', 'No', '100%', '100%', '100%', 'No', '—'],
                    ['Tetraciclina', '250-500mg/6-12h', 'I', '100%', 'Cada 12-24h', 'Cada 24h', 'No', '—'],
                ],
            },
        ],
    },
    {
        id: 'antifungicos',
        nombre: 'Antifúngicos',
        tipo: 'antibiotico',
        grupos: [
            {
                subtitulo: null,
                filas: [
                    ['Anfotericina B lipídica', '5mg/kg/24h', 'D', '5mg/kg/24h', '1-3mg/kg/24h', '1-3mg/kg/24h', 'Ccr=50-10 ml/min', '100,00%'],
                    ['Caspofungina', '50-70mg/24h', 'No', '100,00%', '200mg/24h', '200mg/24h', '100-200 postdiálisis', 'Ccr=50-10 ml/min'],
                    ['Fluconazol', '200-400mg/24h (Máx. 800mg/día)', 'D', '100,00%', '200mg/24h', '200mg/24h', 'Dosis postdiálisis', 'Ccr=50-10 ml/min'],
                    ['Flucitosina', '12,5-37,5mg/8h', 'D', '100,00%', 'Cada 12-24h', 'Cada 24-48h', 'Dosis postdiálisis', '—'],
                    ['Isavuconazol', 'Dosis carga 200mg/8h. Dosis mantenimiento 200mg/24h', 'No', '100,00%', '100,00%', '100,00%', '50,00%', '100% dosis recomendada'],
                    ['Itraconazol V.O.', '100-200mg/12h', 'No', 'No dar si Ccr <30 min por acúmulo del vehículo ciclodextrina. Usar V.O.', '100,00%', '100,00%', '100,00%', '—'],
                    ['Itraconazol I.V.', '200mg/12h', 'I', '100,00%', '100,00%', '100%', '100%', '—'],
                    ['Micafungina I.V.', '50-150mg/24h', 'No', '100,00%', '100,00%', '100,00%', '—', '—'],
                    ['Posaconazol', '100-200mg/6-24h', 'No', '100,00%', '100,00%', '100,00%', '100% dosis recomendada', '—'],
                    ['Vericonazol V.O.', '100-200mg/12h', 'No', 'No dar si Ccr < 50 min por acúmulo del vehículo ciclodextrina. Usar V.O. o Isavuconazol', '100,00%', '100,00%', '100,00%', '—'],
                    ['Vericonazol I.V.', '4-6mg/kg/2-6h', 'I', '100,00%', '100,00%', '100,00%', '100,00%', '—'],
                ],
            },
        ],
    },
    {
        id: 'antivirales-1',
        nombre: 'Antivirales 1',
        tipo: 'antibiotico',
        grupos: [
            {
                subtitulo: null,
                filas: [
                    ['Abacavir/Lamivudina', '600/300mg', 'D', '100,00%', '100,00%. Si Ccr<30min: no recomendado', 'No recomendado', 'No recomendado', '—'],
                    ['Aciclovir', '5-10mg/kg/8h', 'D e I', '5-10mg/kg/8h', '5-10mg/kg/12-24h', '2,5mg/kg/24h', 'Dosis postdiálisis', '2,5mg/kg/24h'],
                    ['Adefovir', '10mg/24h', 'I', '10mg/24h', '10mg/48-72h', '10mg/7 días', '10mg/7 días postdiálisis', '—'],
                    ['Amantadina', '100mg/12h', 'D e I', 'Cada 12h', '200mg x1 y seguir con 100mg/24-48h', '200mg/7días', '200mg/7días', '—'],
                    ['Atazanavir', '300mg/24h', 'No', '100,00%', '100,00%', '100,00%', '100,00%', '—'],
                    ['Bictegravir/entricitabina/tenofovir alafenamida', '200/25/50mg/24h', 'No', '100,00%', '100,00%', 'Si CCr<30min Evitar', '100,00%', '—'],
                    ['Cabotegravir', '600mg/2sem', 'No', '100,00%', '100,00%', '100,00%', '100,00%', '—'],
                    ['Cidofovir', '5mg/kg/semana x2 semanas. Continuar 5mg/kg cada 2 semanas', 'D', '5mg/kg/sem x2 sem. Cont. 5-3mg/kg/2 sem', '100%', 'Evitar', 'Dosis postdiálisis', '—'],
                    ['Cobicistat', '300-800mg/24h', 'No', '100,00%', 'No dar si CCr<70ml/min', '100,00%', '100,00%', '—'],
                    ['Doclatasvir', '60mg/24h', 'No', '100,00%', '100,00%', '100,00%', '100,00%', '—'],
                    ['Darunavir/cobicistat/entricitabina/tenofovir alafenamida', '800/150/200/10mg/24h', 'No', '100,00%', '100,00%', '100,00%', '100,00%', '—'],
                    ['Dasabuvir', '250mg/12h', 'No', '100,00%', '100,00%', '100,00%', '100,00%', '—'],
                    ['Didanosina', '125-200mg/12h', 'D', '125-200mg/12h', '125-200mg/24h', '75-100mg/24h', 'Dosis postdiálisis', '—'],
                    ['Dolutegravir', '50mg/12-24h', 'No', '100,00%', '100,00%', '100,00%', 'Dosis postdiálisis', '—'],
                    ['Elvitegravir/Cobicistat/entricitabina/tenofovir alafenamida', '150/100/200/10mg/24h', 'No', '100,00%', '100,00%. Si CCr<30min Evitar', '100,00%', 'No recomendado', '—'],
                    ['Emtricitabina/tenofovir alafenamida', '200/25/25mg/24h', 'D e I', '200/25/24h', '250/24h', '250/24h', '100%', '—'],
                    ['Famciclovir', '500mg/24h', 'D e I', '500mg/24h', '250mg/24h', '250mg/24h', '100%', '—'],
                    ['Fosfonavir', '600mg/12h', 'D', '100,00%', '100,00%', '100,00%', '100,00%', '—'],
                    ['Ganciclovir', '5mg/kg/12h I.V. Continuar 5mg/kg/24h I.V. o 1,25-1mg/kg/24h', 'D', '2,5-1,25mg/kg/24h I.V.', '2,5-1,25mg/kg/24h I.V.', '1,25mg/kg 3xsem. 0,6-1,25mg/kg/24h', '0 0,5g/24h 3xsem', 'Dosis postdiálisis'],
                    ['Glecaprevir/Pibrentasvir', '300/120mg/24h', 'No', '100,00%', '100,00%', '100,00%', '100,00%', '—'],
                ],
            },
        ],
    },
    {
        id: 'antivirales-2',
        nombre: 'Antivirales 2',
        tipo: 'antibiotico',
        grupos: [
            {
                subtitulo: null,
                filas: [
                    ['Indinavir', '150mg/24h', 'No', '100,00%', '100,00%', '100,00%', 'No datos', '—'],
                    ['Lamivudina', '150mg/12h — 300mg/24h', 'D', '100,00%', '100-150mg/24h', '25-50mg/24h', 'Dosis postdiálisis', '—'],
                    ['Ledipasvir/Sofosbuvir', '90/400mg/24h', 'D', '100,00%', 'Precaución', '100,00%', '100,00%', '—'],
                    ['Letermovir', '240mg/24h', 'D', '100,00%', '100,00%', '100,00%', '100,00%', '—'],
                    ['Lopinavir/Ritonavir', '400/100mg/12h', 'No', '100,00%', '100,00%', '100,00%', '100,00%', '—'],
                    ['Nelfinavir', '750mg/8h — 1250mg/12h', 'No', '100,00%', '100,00%', '100,00%', 'No datos', '—'],
                    ['Nevirapina', '200mg/12h ó 400mg/24h. Continuar 200mg/día', 'No', '100,00%', '100,00%. Si Ccr<30min: 150/100mg 24h Contraindicado', 'Contraindicado', '100,00%', '—'],
                    ['Nimastarvir/Ritonavir', '300/100mg/12h', 'D', '100,00%', '150/100mg 24h. Si Ccr<60min: 100/30mg/24h', '30mg/48h', 'No datos', '—'],
                    ['Oseltamivir', '75mg/12h', 'D e I', '75mg/12h', '30mg/12h. Si Ccr<30min: 30mg/24h', '30mg/48h', 'Dosis postdiálisis', '—'],
                    ['Paritaprevir', '75mg/24h', 'No', '100,00%', '100,00%', '100,00%', '100,00%', '—'],
                    ['Ribavirina', '500-600mg/24h', 'D', '400-200mg/24h', '200mg/24h', 'Precaución', 'Precaución', '—'],
                    ['Rimantadina', '100mg/24h', 'No', '100,00%', '100mg/12h', '100mg/24h', 'No datos', '—'],
                    ['Raltegravir/Rilpivirina', '515/25mg/24h', 'No', '100,00%', '100,00%', '100,00%', '100,00%', '—'],
                    ['Simeprevir', '150mg/24h', 'No', '100,00%', '100,00%. Si CCr<30min Evitar', '100,00%', 'Evitar', '—'],
                    ['Sofosbuvir', '400mg/24h', 'No', '100,00%', 'Si CCr<30min: 100,00%', '100,00%', 'Evitar', '—'],
                    ['Sofosbuvir/Velpatasvir/Voxilaprevir', '400/100/100mg/24h', 'D e I', '100,00%', '300mg/48h. Si CCr<30min 300mg/24h', 'No recomendado', 'No recomendado', '—'],
                    ['Stavudina', '30-40mg/12h', 'D', '30mg/12h', '15-20mg/24h', '15/24-72h', 'Dosis postdiálisis', '—'],
                    ['Tenofovir', '245mg/24h', 'D', '245mg/24h', '245mg/48-72h. Si CCr<10min Cada 72-96h', 'No recomendado', 'No recomendado', '—'],
                    ['Tenofovir Alafenamida', '245mg/24h', 'No', '25mg/24h', 'Si CCr<15min: 25mg cada 72-96h', 'No recomendado', 'No recomendado', '—'],
                    ['Tenofovir disoproxil Mardesol 245mg', '245mg/24h', 'D e I', '1g/8h', '0,5-1g/12-24h', '0,5-1g/24h', 'No usa a Ccr<10ml', 'Dosis postdiálisis'],
                    ['Valaciclovir', '500mg/12h', 'D e I', '500mg/12h', '900mg/24h. Si CCr<30min 100mg cada 45-100mg 12h', '450mg/24-48h', '45mg/12h', 'Dosis postdiálisis'],
                    ['Valganciclovir', '900mg/12h', 'No', '900mg/12h', '100,00%. Si Ccr<30min: 450mg cada 24-72h', 'Evitar', 'Evitar', '—'],
                    ['Vidarabina', '0,75mg/12h', 'D', 'Cada 12h', 'Cada 24h', 'Cada 24h', '20 mg/48h', 'Dosis postdiálisis'],
                    ['Foscarnet', '60mg/kg/8h y 2semanas. Inducción 60mg/8h. Mantenimiento 120mg/24h', 'D', '>1,4: 60mg/8h. >1-1,4: 45mg/8h. Inducción 60mg/8h. Mantenimiento 120mg/24h', '>0,8-0,6: 45mg/8h. >0,6-0,5: 35mg/12h. Mantenimiento 65mg/48h', '<0,4-0,5: no recomendado (para Foscarnet: mg/dl/kg peso — no recomendado si <0,4)', '—', '—'],
                ],
            },
        ],
    },
];
