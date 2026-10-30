// Cifras del paciente de la IC izquierda que se descompensa (b3-paso4 g4, pieza 4a): barrido del reloj 0-4 h (gravedad 0/25/50/75/100 %).
// Mide igual que la app (la prueba g4-app-cifras.mjs lee el monitor real). Uso: node autonomo/bloques/b3/herramientas/g4-etapas-cifras.mjs   (con --denso: cada 5 %, y comprueba que el estado no retrocede)
const S = await import('../../../../js/modules/libros/shock-vivo/soporte.mjs');
const r = (x, d = 1) => +x.toFixed(d);
const pasos = process.argv.includes('--denso') ? Array.from({ length: 21 }, (_, i) => i / 20) : [0, 0.25, 0.5, 0.75, 1];
for (const g of pasos) {
  // como la app al abrir el estado (pagina.js nuevoPaciente: asentar 30 y correr 8); --largo: 40 y 40 (el edema sigue creciendo, no hay equilibrio)
  const largo = process.argv.includes('--largo'); const c = S.crearCabecera({ ...S.RECETA_IC, g }, { asentar: largo ? 40 : 30 }); c.correr(largo ? 40 : 8);
  const L = c.lectura, u = L.u;
  console.log(`${String(Math.round(g * 100)).padStart(3)} % (h ${S.horasDeIc(g)})`, JSON.stringify({ PCP: r(u.pvp), FC: r(u.fc, 0), VS: r(u.vs, 0), IC: r(L.icTotal, 2), PAM: r(u.pam, 0), PVC: r(u.pvc), edema: r(u.vEdema, 0) }));
}
