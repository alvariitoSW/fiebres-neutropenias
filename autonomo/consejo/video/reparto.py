# Qué voz tiene cada personaje. Todos con voz de España (regla del usuario, 01/11): Kokoro solo tiene voces
# latinoamericanas y no se usa para hablar español de España. La mexicana, solo para Exteriores, a propósito.
K=lambda m,**k:dict(motor='kokoro',modelo=m,**k)
Pi=lambda m,**k:dict(motor='piper',modelo=m,**k)
REPARTO={
 'tra':Pi('es_ES-davefx-medium'),                  # portavoz: voz de España (Kokoro solo tiene voces latinoamericanas)
 'hac':Pi('es_ES-davefx-medium',tono=0.93,velocidad=0.93),      # grave y pausado
 'edu':Pi('es_ES-sharvard-medium',hablante=1,tono=1.02),
 'cie':Pi('es_ES-sharvard-medium',hablante=1,tono=1.1,velocidad=1.06),  # más aguda y viva
 'int':Pi('es_ES-sharvard-medium',hablante=0),
 'jus':Pi('es_ES-sharvard-medium',hablante=1,tono=0.95,velocidad=0.95),
 'ext':Pi('es_MX-ald-medium'),                         # acento mexicano
 'mod':Pi('es_ES-sharvard-medium',hablante=1,tono=1.04),
 'p1':Pi('es_ES-sharvard-medium',hablante=0,tono=0.96),
 'p2':Pi('es_ES-sharvard-medium',hablante=1,tono=1.08,velocidad=1.05),
 'p3':Pi('es_MX-ald-medium',tono=0.94),
}
