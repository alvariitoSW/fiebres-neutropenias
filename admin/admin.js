// Panel /admin — sube un PDF o un link al Cloudflare Worker que dispara
// el pipeline de integración automática. Ver backend/README.md.
//
// IMPORTANTE: sustituye WORKER_URL por la URL real de tu Worker desplegado
// (algo como https://hud-clinico-uci-admin.<tu-subdominio>.workers.dev)
// antes de usar este panel — no hay forma de conocerla hasta que se
// despliega con `wrangler deploy`.
const WORKER_URL = 'https://hud-clinico-uci-admin.workers.dev/api/submit';

const form = document.getElementById('upload-form');
const tabBtns = document.querySelectorAll('.tab-btn');
const panels = { pdf: document.getElementById('panel-pdf'), link: document.getElementById('panel-link') };
const statusEl = document.getElementById('status');
const submitBtn = document.getElementById('submit-btn');

let activeTab = 'pdf';
tabBtns.forEach(btn => {
    btn.addEventListener('click', () => {
        activeTab = btn.dataset.tab;
        tabBtns.forEach(b => b.classList.toggle('active', b === btn));
        panels.pdf.hidden = activeTab !== 'pdf';
        panels.link.hidden = activeTab !== 'link';
    });
});

function showStatus(kind, html) {
    statusEl.className = `status ${kind}`;
    statusEl.innerHTML = html;
}

form.addEventListener('submit', async (e) => {
    e.preventDefault();
    statusEl.className = 'status';

    const passcode = document.getElementById('passcode').value;
    const notes = document.getElementById('notes').value;
    const file = document.getElementById('file').files[0];
    const link = document.getElementById('link').value.trim();

    if (activeTab === 'pdf' && !file) {
        showStatus('err', 'Elige un PDF, o cambia a la pestaña "Link".');
        return;
    }
    if (activeTab === 'link' && !link) {
        showStatus('err', 'Pega un link, o cambia a la pestaña "PDF".');
        return;
    }

    const body = new FormData();
    body.set('passcode', passcode);
    body.set('notes', notes);
    if (activeTab === 'pdf') body.set('file', file);
    if (activeTab === 'link') body.set('link', link);

    submitBtn.disabled = true;
    submitBtn.textContent = 'Enviando…';
    try {
        const res = await fetch(WORKER_URL, { method: 'POST', body });
        const data = await res.json();
        if (!res.ok) {
            showStatus('err', data.error || `Error ${res.status}`);
            return;
        }
        showStatus('ok', `
            Enviado. Rama: <code>${data.branch}</code><br>
            Sigue el progreso en
            <a href="${data.actionsUrl}" target="_blank" rel="noopener">GitHub Actions</a>
            — cuando termine, aparecerá una Pull Request en borrador para tu revisión.
        `);
        form.reset();
        panels.pdf.hidden = false;
        panels.link.hidden = true;
        activeTab = 'pdf';
        tabBtns.forEach(b => b.classList.toggle('active', b.dataset.tab === 'pdf'));
    } catch (err) {
        showStatus('err', `No se pudo contactar con el servicio: ${err.message}`);
    } finally {
        submitBtn.disabled = false;
        submitBtn.textContent = 'Enviar a integración';
    }
});
