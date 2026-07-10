# HUD Clínico UCI

Herramienta de apoyo a la decisión clínica, pensada para consultarse a pie
de cama desde el móvil. Incluye:

- **Escalas generales de UCI:** qSOFA, criterios SRIS, SOFA, Glasgow.
- **Neutropenia febril hemato-oncológica:** triaje inicial, Índice MASCC,
  arquitectura diagnóstica (microbiología, cribado fúngico, biomarcadores),
  tratamiento empírico y tratamiento dirigido con calculadora PK/PD ajustada
  a función renal.

Es una calculadora estática: no requiere login, no guarda datos de
pacientes y no depende de ningún servidor. Se despliega directamente en
GitHub Pages sirviendo `index.html`.

## Estructura del proyecto

El proyecto está organizado en módulos pequeños (uno por calculadora) en
vez de un único archivo gigante, para que sea fácil de mantener y ampliar.
Ver [`CLAUDE.md`](./CLAUDE.md) para el mapa completo de carpetas y la
convención a seguir al añadir una escala nueva.

## Desarrollo local

No hace falta instalar nada. Basta con servir la carpeta con cualquier
servidor estático, por ejemplo:

```
python3 -m http.server 8000
```

y abrir `http://localhost:8000/`.

## Origen

El proyecto nació como un Pen en CodePen y se ha ido reestructurando para
crecer de forma ordenada.
