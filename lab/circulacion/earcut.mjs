// Triangulación de un polígono con agujeros (recorte de orejas + puentes a los
// agujeros), escrita para la base del corazón. Algoritmo clásico (el mismo que
// la librería earcut de Mapbox), sin dependencias.
// earcut(datos [x0,y0,x1,y1,...], inicioAgujeros [i,...]) → índices de triángulos.

export function earcut(datos, agujeros = []) {
  const finExterior = agujeros.length ? agujeros[0] * 2 : datos.length;
  let exterior = lista(datos, 0, finExterior, true);
  const tris = [];
  if (!exterior || exterior.next === exterior.prev) return tris;
  if (agujeros.length) exterior = quitarAgujeros(datos, agujeros, exterior);
  recortar(exterior, tris, 0);
  return tris;
}

function lista(d, ini, fin, horario) {
  let ultimo;
  if (horario === (areaFirmada(d, ini, fin) > 0)) for (let i = ini; i < fin; i += 2) ultimo = insertar(i / 2, d[i], d[i + 1], ultimo);
  else for (let i = fin - 2; i >= ini; i -= 2) ultimo = insertar(i / 2, d[i], d[i + 1], ultimo);
  if (ultimo && iguales(ultimo, ultimo.next)) { quitar(ultimo); ultimo = ultimo.next; }
  return ultimo;
}
function areaFirmada(d, ini, fin) { let s = 0; for (let i = ini, j = fin - 2; i < fin; i += 2) { s += (d[j] - d[i]) * (d[i + 1] + d[j + 1]); j = i; } return s; }
function filtrar(ini, fin) {
  if (!ini) return ini; if (!fin) fin = ini;
  let p = ini, otra;
  do { otra = false;
    if (iguales(p, p.next) || area(p.prev, p, p.next) === 0) { quitar(p); p = fin = p.prev; if (p === p.next) break; otra = true; }
    else p = p.next;
  } while (otra || p !== fin);
  return fin;
}
function recortar(oreja, tris, pasada) {
  if (!oreja) return;
  let parar = oreja;
  while (oreja.prev !== oreja.next) {
    const prev = oreja.prev, next = oreja.next;
    if (esOreja(oreja)) {
      tris.push(prev.i, oreja.i, next.i); quitar(oreja);
      oreja = next.next; parar = next.next; continue;
    }
    oreja = next;
    if (oreja === parar) {
      if (!pasada) recortar(filtrar(oreja), tris, 1);
      else if (pasada === 1) { oreja = curarCruces(filtrar(oreja), tris); recortar(oreja, tris, 2); }
      else if (pasada === 2) partir(oreja, tris);
      break;
    }
  }
}
function esOreja(o) {
  const a = o.prev, b = o, c = o.next;
  if (area(a, b, c) >= 0) return false;
  let p = c.next;
  while (p !== a) {
    if (!(p.x === a.x && p.y === a.y) && !(p.x === c.x && p.y === c.y) &&
        dentroTriangulo(a.x, a.y, b.x, b.y, c.x, c.y, p.x, p.y) && area(p.prev, p, p.next) >= 0) return false;
    p = p.next;
  }
  return true;
}
function curarCruces(ini, tris) {
  let p = ini;
  do {
    const a = p.prev, b = p.next.next;
    if (!iguales(a, b) && cruzan(a, p, p.next, b) && localDentro(a, b) && localDentro(b, a)) {
      tris.push(a.i, p.i, b.i); quitar(p); quitar(p.next); p = ini = b;
    }
    p = p.next;
  } while (p !== ini);
  return filtrar(p);
}
function partir(ini, tris) {
  let a = ini;
  do {
    let b = a.next.next;
    while (b !== a.prev) {
      if (a.i !== b.i && diagonalValida(a, b)) {
        let c = dividir(a, b); a = filtrar(a, a.next); c = filtrar(c, c.next);
        recortar(a, tris, 0); recortar(c, tris, 0); return;
      }
      b = b.next;
    }
    a = a.next;
  } while (a !== ini);
}
function quitarAgujeros(d, agujeros, exterior) {
  const cola = [];
  for (let i = 0; i < agujeros.length; i++) {
    const ini = agujeros[i] * 2, fin = i < agujeros.length - 1 ? agujeros[i + 1] * 2 : d.length;
    const l = lista(d, ini, fin, false);
    cola.push(masIzquierda(l));
  }
  cola.sort((a, b) => a.x - b.x);
  for (const h of cola) exterior = quitarAgujero(h, exterior);
  return exterior;
}
function quitarAgujero(h, exterior) {
  const puente = buscarPuente(h, exterior);
  if (!puente) return exterior;
  const inverso = dividir(puente, h);
  filtrar(inverso, inverso.next);
  return filtrar(puente, puente.next);
}
function buscarPuente(h, exterior) {
  let p = exterior; const hx = h.x, hy = h.y; let qx = -Infinity, m;
  do {
    if (hy <= p.y && hy >= p.next.y && p.next.y !== p.y) {
      const x = p.x + (hy - p.y) * (p.next.x - p.x) / (p.next.y - p.y);
      if (x <= hx && x > qx) { qx = x; m = p.x < p.next.x ? p : p.next; if (x === hx) return m; }
    }
    p = p.next;
  } while (p !== exterior);
  if (!m) return null;
  const parar = m, mx = m.x, my = m.y; let tanMin = Infinity;
  p = m;
  do {
    if (hx >= p.x && p.x >= mx && hx !== p.x &&
        dentroTriangulo(hy < my ? hx : qx, hy, mx, my, hy < my ? qx : hx, hy, p.x, p.y)) {
      const tan = Math.abs(hy - p.y) / (hx - p.x);
      if (localDentro(p, h) && (tan < tanMin || (tan === tanMin && (p.x > m.x || (p.x === m.x && sectorContiene(m, p)))))) { m = p; tanMin = tan; }
    }
    p = p.next;
  } while (p !== parar);
  return m;
}
const sectorContiene = (m, p) => area(m.prev, m, p.prev) < 0 && area(p.next, m, m.next) < 0;
function masIzquierda(ini) { let p = ini, i = ini; do { if (p.x < i.x || (p.x === i.x && p.y < i.y)) i = p; p = p.next; } while (p !== ini); return i; }
const dentroTriangulo = (ax, ay, bx, by, cx, cy, px, py) =>
  (cx - px) * (ay - py) >= (ax - px) * (cy - py) && (ax - px) * (by - py) >= (bx - px) * (ay - py) && (bx - px) * (cy - py) >= (cx - px) * (by - py);
function diagonalValida(a, b) {
  return a.next.i !== b.i && a.prev.i !== b.i && !cruzaPoligono(a, b) &&
    ((localDentro(a, b) && localDentro(b, a) && medioDentro(a, b) && (area(a.prev, a, b.prev) || area(a, b.prev, b))) ||
     (iguales(a, b) && area(a.prev, a, a.next) > 0 && area(b.prev, b, b.next) > 0));
}
const area = (p, q, r) => (q.y - p.y) * (r.x - q.x) - (q.x - p.x) * (r.y - q.y);
const iguales = (a, b) => a.x === b.x && a.y === b.y;
function cruzan(p1, q1, p2, q2) {
  const o1 = sg(area(p1, q1, p2)), o2 = sg(area(p1, q1, q2)), o3 = sg(area(p2, q2, p1)), o4 = sg(area(p2, q2, q1));
  if (o1 !== o2 && o3 !== o4) return true;
  if (o1 === 0 && enSegmento(p1, p2, q1)) return true; if (o2 === 0 && enSegmento(p1, q2, q1)) return true;
  if (o3 === 0 && enSegmento(p2, p1, q2)) return true; if (o4 === 0 && enSegmento(p2, q1, q2)) return true;
  return false;
}
const enSegmento = (p, q, r) => q.x <= Math.max(p.x, r.x) && q.x >= Math.min(p.x, r.x) && q.y <= Math.max(p.y, r.y) && q.y >= Math.min(p.y, r.y);
const sg = (n) => n > 0 ? 1 : n < 0 ? -1 : 0;
function cruzaPoligono(a, b) {
  let p = a;
  do { if (p.i !== a.i && p.next.i !== a.i && p.i !== b.i && p.next.i !== b.i && cruzan(p, p.next, a, b)) return true; p = p.next; } while (p !== a);
  return false;
}
const localDentro = (a, b) => area(a.prev, a, a.next) < 0 ? area(a, b, a.next) >= 0 && area(a, a.prev, b) >= 0 : area(a, b, a.prev) < 0 || area(a, a.next, b) < 0;
function medioDentro(a, b) {
  let p = a, dentro = false; const px = (a.x + b.x) / 2, py = (a.y + b.y) / 2;
  do { if (((p.y > py) !== (p.next.y > py)) && p.next.y !== p.y && (px < (p.next.x - p.x) * (py - p.y) / (p.next.y - p.y) + p.x)) dentro = !dentro; p = p.next; } while (p !== a);
  return dentro;
}
function dividir(a, b) {
  const a2 = nodo(a.i, a.x, a.y), b2 = nodo(b.i, b.x, b.y), an = a.next, bp = b.prev;
  a.next = b; b.prev = a; a2.next = an; an.prev = a2; b2.next = a2; a2.prev = b2; bp.next = b2; b2.prev = bp;
  return b2;
}
function insertar(i, x, y, ultimo) {
  const p = nodo(i, x, y);
  if (!ultimo) { p.prev = p; p.next = p; } else { p.next = ultimo.next; p.prev = ultimo; ultimo.next.prev = p; ultimo.next = p; }
  return p;
}
function quitar(p) { p.next.prev = p.prev; p.prev.next = p.next; }
const nodo = (i, x, y) => ({ i, x, y, prev: null, next: null });
