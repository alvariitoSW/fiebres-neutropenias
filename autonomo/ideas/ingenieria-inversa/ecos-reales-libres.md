# rea-eco · imágenes/vídeos de eco reales de uso libre

## LIMITACIÓN IMPORTANTE (leer primero)
- WebFetch falla con "getaddrinfo ENOTFOUND" en TODOS los dominios probados: commons.wikimedia.org, en.wikipedia.org,
  europepmc.org, www.msdmanuals.com. Bash/curl: CONNECT 403 (proxy) o código 000 en commons.wikimedia.org,
  en.wikipedia.org, upload.wikimedia.org, ncbi.nlm.nih.gov, ebi.ac.uk, openi.nlm.nih.gov, radiopaedia.org,
  zenodo.org, wikidata.org.
- Solo funcionó WebSearch. Ninguna página de archivo se pudo ABRIR: URL y licencia salen de los resultados de búsqueda
  (la URL sale literal; la licencia es el resumen del buscador). Todo debe confirmarse abriendo la página de Commons
  (sección "Licensing") antes de usar. Nada descargado; ninguna captura.
- No pude confirmar si cada "still" es foto de eco real o ilustración/esquema; marcado "?" donde dudo.

## Tabla por vista (URL base: https://commons.wikimedia.org/wiki/File:<nombre>)
| Vista | Mejor candidata | Alternativas | Notas |
|---|---|---|---|
| PLAX | `Heart_left_parasternal_long_axis.jpg` (Lynch/Jaffe, Yale, 2006, normal, CC BY 2.5) ? eco real o dibujo | `LeftParasternalLongAxis.gif` (Yale 1999, CC BY 2.5, gif animado ?); `Echo_heart_parasternal_long_axis_(CardioNetworks_ECHOpedia).jpg` (CC BY-SA 3.0 según página, que cita también CC BY 2.5: ambigua); `Heart_normal_lpla_echo_view.svg` (esquema, CC BY 2.5) | Sin vídeo normal libre encontrado |
| PSAX (aórtico, mitral, papilares) | `Heart_normal_short_axis_echo_(CardioNetworks_ECHOpedia).png` (Lynch, 2006; CC BY-SA 3.0 con mención a CC BY 2.5) | ninguna con nivel indicado | No confirmado a qué nivel (Ao/mitral/papilares) corresponde. Hueco por niveles |
| A4C | `A4C_normal_(CardioNetworks_ECHOpedia).webm` (vídeo 1 s, 624x480) licencia NO confirmada | `Echocardiogram_4chambers.jpg` (dominio público, 2005, foto real); `Echoapicalfourchamber.jpg` (esquema CC BY-SA 4.0); `Ultrasound_of_human_heart_apical_4-cahmber_view.gif` (CC BY-SA 3.0, animado); `Apical_4_chamber_view.png` (Yale 1999, CC BY 2.5) | La foto en dominio público es la única con licencia clara; falta confirmar que es eco real y normal |
| A2C | `A2Cnormal_(CardioNetworks_ECGpedia).avi.webm` (vídeo) licencia NO confirmada | `Apical2Chamber.png` (Yale 1999, CC BY 2.5); `Heart_apical_2chamber.jpg` (Lynch 2006, CC BY 2.5) | Ver riesgo ECGpedia abajo |
| A3C | `A3Cnormal_(CardioNetworks_ECGpedia).avi.webm` (vídeo) licencia NO confirmada | — | Misma duda |
| Subcostal 4C | Sin candidata libre normal. Solo patología: clip "Pericardial effusion, swinging heart E00667/E00670 (CardioNetworks ECHOpedia).webm" (subcostal/PLAX) | — | Licencia sin confirmar |
| VCI subcostal | `Inferior_vena_cava_ultrasound.gif` (normal, con VD visible; CC BY-SA 4.0 según buscador) | — | No pude ver autor |
| ETE medioesofágico 4C | `Heart_tee_four_chamber_view.jpg` (Lynch/Jaffe, 2006, CC BY 2.5) ? | `Echocardiogram_4chambers.jpg` (dominio público; no es ETE confirmado); `Transesophageal_echo.jpg` (NHLBI, dominio público; es foto de sonda, no imagen eco) | |

## Dónde mirar a continuación (cuando haya acceso a Commons)
- Categoría: https://commons.wikimedia.org/wiki/Category:Echocardiography (salió en resultados; no abierta)
- Clips patológicos PLAX/PSAX en `... (CardioNetworks ECHOpedia).webm`: Prolaps of PMVL E00588, ARVD E00316, Pulmonary valve
  stenosis E00691, Abnormal pulmonary vein drainage E00576, Cyst adjacent to left atrium E00376 (útiles como contraste patológico).
- Vídeo con licencia de revista: `Hypertrophic-cardiomyopathy-with-midventricular-obstruction-and-apical-aneurysm-formation-in-a-1476-7120-7-26-S1.ogv` (A2C patológico, de Cardiovascular Ultrasound; licencia no vista, probable CC BY).
- Artículos PMC open access con vídeo normal: PMC3232574 (apicales normales, Images Paediatr Cardiol 2007) y PMC3232563 (paraesternales normales): licencia NO vista; esta revista era de acceso abierto pero hay que comprobar si es CC BY o solo "free".
- PMC7188448 (Cureus 2020, doi 10.7759/cureus.7482), fig. 4: PLAX+PSAX+A4C normales en una sola figura. Cureus suele ser CC BY, pero NO confirmado.

## No usables / dudosas
- Radiopaedia (images.radiopaedia.org/licence): "modified CC BY-NC-SA 3.0" (no comercial). No usable salvo decisión del usuario.
- ECGpedia/ECHOpedia (sitios originales, echopedia.org y en.ecgpedia.org): su licencia propia es CC BY-NC-SA (según SciCrunch y las páginas de archivo de ecgpedia). RIESGO: los vídeos CardioNetworks pueden llevar CC BY-NC-SA en origen aunque Commons ponga CC BY-SA 3.0 en algunos esquemas. Usar solo si la página de Commons del archivo concreto dice CC BY-SA/CC BY.
- Sonosite, MSD Manuals, Glasgow EdShare (edshare.gla.ac.uk/875), Wiley, thepocusatlas.com, techmed.sk, 123sonography: propietarios o sin licencia clara. No usables.
- CAMUS y EchoNet: prohibidos (no buscados).

## Cómo citar (plantilla; completar con autor y licencia de la página de Commons)
- Lynch/Yale: «Patrick J. Lynch (ilustrador) y C. Carl Jaffe, MD (cardiólogo), Yale University School of Medicine, 2006/1999, vía Wikimedia Commons, CC BY 2.5» + enlace a https://creativecommons.org/licenses/by/2.5/ . CC BY 2.5 exige conservar esos créditos.
- CardioNetworks: «CardioNetworks ECHOpedia, vía Wikimedia Commons, CC BY-SA 3.0» + enlace https://creativecommons.org/licenses/by-sa/3.0/ ; SA obliga a compartir derivados con la misma licencia.
- CC BY-SA 4.0 (IVC gif, esquemas): autor tal como figure en Commons + https://creativecommons.org/licenses/by-sa/4.0/ .
- Dominio público: indicar nombre del archivo y "dominio público (Commons)".
- Regla CLAUDE.md §7.7: solo fotos y registros reales de eco; los esquemas/dibujos de Lynch quedan fuera si se confirma que son dibujos.

## Conclusión
Con las herramientas disponibles no se pudo verificar ninguna licencia abriendo el origen. Cobertura probable: A4C, A2C, A3C, PLAX, VCI y ETE tienen candidata; PSAX por niveles y subcostal 4C normal, hueco. Hace falta una pasada con acceso a Commons (o que el usuario desbloquee commons.wikimedia.org / upload.wikimedia.org) para confirmar.
