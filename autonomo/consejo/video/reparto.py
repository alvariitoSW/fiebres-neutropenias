# Qué voz tiene cada personaje (elegido el 01/11 tras puntuar 9 voces con un transcriptor automático).
K=lambda m,**k:dict(motor='kokoro',modelo=m,**k)
Pi=lambda m,**k:dict(motor='piper',modelo=m,**k)
REPARTO={
 'tra':K('em_alex'),                                   # portavoz: la voz más clara
 'hac':K('em_santa',tono=0.97,velocidad=0.95),         # grave y pausado
 'edu':K('ef_dora'),
 'cie':K('ef_dora',tono=1.07,velocidad=1.05),          # misma base que Educación, más aguda y viva
 'int':Pi('es_ES-sharvard-medium',hablante=0),
 'jus':Pi('es_ES-sharvard-medium',hablante=1,tono=0.95,velocidad=0.95),
 'ext':Pi('es_MX-ald-medium'),                         # acento mexicano
 'mod':Pi('es_ES-sharvard-medium',hablante=1,tono=1.04),
 'p1':Pi('es_ES-davefx-medium'),
 'p2':Pi('es_ES-sharvard-medium',hablante=1,tono=1.08,velocidad=1.05),
 'p3':Pi('es_MX-ald-medium',tono=0.94),
}
