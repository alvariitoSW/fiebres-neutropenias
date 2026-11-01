// Monta el MP4: pinta cada fotograma de la escena HTML (window.render(t), window.TOTAL) a 25 fps con Playwright
// y lo junta con la mezcla de voces (audio/mezcla.wav de la misma carpeta).
//   node render.js <carpeta> <escena.html> <salida.mp4>
// p. ej.: node render.js rueda rueda.html rueda/rueda-de-prensa.mp4
const { chromium } = require('playwright');
const { spawn } = require('child_process');
const path = require('path');

(async () => {
  const [dirArg, html, outArg] = process.argv.slice(2);
  if (!dirArg || !html || !outArg) { console.error('Uso: node render.js <carpeta> <escena.html> <salida.mp4>'); process.exit(1); }
  const dir = path.resolve(dirArg), out = path.resolve(outArg);
  const b = await chromium.launch();
  const p = await b.newPage({ viewport: { width: 720, height: 1280 } });
  const errores = [];
  p.on('pageerror', e => errores.push(String(e)));
  await p.goto('file://' + path.join(dir, html));
  await p.waitForTimeout(500);
  const T = await p.evaluate(() => window.TOTAL);
  const N = Math.ceil(T * 25);
  const ff = spawn('ffmpeg', ['-loglevel', 'error', '-y', '-f', 'image2pipe', '-framerate', '25', '-c:v', 'mjpeg', '-i', '-',
    '-i', path.join(dir, 'audio/mezcla.wav'), '-c:v', 'libx264', '-pix_fmt', 'yuv420p', '-crf', '23', '-preset', 'veryfast',
    '-c:a', 'aac', '-b:a', '128k', '-shortest', '-movflags', '+faststart', out], { stdio: ['pipe', 'inherit', 'inherit'] });
  for (let i = 0; i < N; i++) {
    await p.evaluate(t => window.render(t), i / 25);
    const buf = await p.screenshot({ type: 'jpeg', quality: 88 });
    if (!ff.stdin.write(buf)) await new Promise(r => ff.stdin.once('drain', r));
    if (i % 250 === 0) console.log(i, '/', N);
  }
  ff.stdin.end();
  await new Promise(r => ff.on('close', r));
  await b.close();
  console.log('Hecho:', out, '· errores de la escena:', errores.length, errores.slice(0, 3));
})();
