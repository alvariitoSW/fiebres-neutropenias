// Cloudflare Worker: puerta de entrada protegida por contraseña del panel
// /admin. Su único trabajo es (1) validar la contraseña, (2) si hay un PDF,
// crear una rama nueva y subirlo al repo vía la API de GitHub, y (3)
// disparar el workflow .github/workflows/integrate-content.yml, que es
// donde ocurre el trabajo real (Claude Agent SDK + Bash + Playwright).
//
// Este Worker NUNCA llama a la API de Claude ni comitea a main — ver
// backend/README.md para la arquitectura completa.

export interface Env {
    GITHUB_OWNER: string;
    GITHUB_REPO: string;
    WORKFLOW_FILE: string;
    ADMIN_PASSCODE: string;
    GITHUB_TOKEN: string;
}

const CORS_HEADERS = {
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'POST, OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type',
};

function json(data: unknown, status = 200): Response {
    return new Response(JSON.stringify(data), {
        status,
        headers: { 'Content-Type': 'application/json', ...CORS_HEADERS },
    });
}

function safeEquals(a: string, b: string): boolean {
    // Comparación en tiempo aproximadamente constante — suficiente para una
    // contraseña compartida de un panel personal, no un sistema de login.
    if (a.length !== b.length) return false;
    let diff = 0;
    for (let i = 0; i < a.length; i++) diff |= a.charCodeAt(i) ^ b.charCodeAt(i);
    return diff === 0;
}

function bufferToBase64(buffer: ArrayBuffer): string {
    const bytes = new Uint8Array(buffer);
    let binary = '';
    const chunkSize = 0x8000; // evitar desbordar la pila con String.fromCharCode(...bytes) en PDFs grandes
    for (let i = 0; i < bytes.length; i += chunkSize) {
        binary += String.fromCharCode(...bytes.subarray(i, i + chunkSize));
    }
    return btoa(binary);
}

async function githubApi(env: Env, method: string, path: string, body?: unknown): Promise<any> {
    const res = await fetch(`https://api.github.com${path}`, {
        method,
        headers: {
            Authorization: `Bearer ${env.GITHUB_TOKEN}`,
            Accept: 'application/vnd.github+json',
            'X-GitHub-Api-Version': '2022-11-28',
            'User-Agent': 'hud-clinico-uci-admin-worker',
            ...(body ? { 'Content-Type': 'application/json' } : {}),
        },
        body: body ? JSON.stringify(body) : undefined,
    });
    if (!res.ok) {
        const text = await res.text().catch(() => '');
        throw new Error(`GitHub API ${method} ${path} -> ${res.status}: ${text}`);
    }
    if (res.status === 204) return null;
    return res.json();
}

function sanitizeFilename(name: string): string {
    return name.replace(/[^a-zA-Z0-9._-]/g, '_').slice(0, 120) || 'archivo.pdf';
}

export default {
    async fetch(request: Request, env: Env): Promise<Response> {
        if (request.method === 'OPTIONS') {
            return new Response(null, { headers: CORS_HEADERS });
        }

        const url = new URL(request.url);
        if (request.method !== 'POST' || url.pathname !== '/api/submit') {
            return json({ error: 'not found' }, 404);
        }

        let form: FormData;
        try {
            form = await request.formData();
        } catch {
            return json({ error: 'Se esperaba multipart/form-data.' }, 400);
        }

        const passcode = String(form.get('passcode') || '');
        if (!env.ADMIN_PASSCODE || !safeEquals(passcode, env.ADMIN_PASSCODE)) {
            return json({ error: 'Contraseña incorrecta.' }, 401);
        }

        const notes = String(form.get('notes') || '');
        const link = String(form.get('link') || '').trim();
        const file = form.get('file');
        const hasFile = file instanceof File && file.size > 0;

        if (!hasFile && !link) {
            return json({ error: 'Sube un PDF o pega un link.' }, 400);
        }

        try {
            const branch = `content/incoming-${Date.now()}`;

            // 1. Rama nueva desde main
            const mainRef = await githubApi(env, 'GET', `/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/git/ref/heads/main`);
            await githubApi(env, 'POST', `/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/git/refs`, {
                ref: `refs/heads/${branch}`,
                sha: mainRef.object.sha,
            });

            // 2. Si hay PDF, subirlo a docs/incoming/ en esa rama
            let sourcePdfPath = '';
            if (hasFile) {
                const f = file as File;
                const filename = sanitizeFilename(f.name || 'archivo.pdf');
                sourcePdfPath = `docs/incoming/${Date.now()}-${filename}`;
                const contentB64 = bufferToBase64(await f.arrayBuffer());
                await githubApi(env, 'PUT', `/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/contents/${sourcePdfPath}`, {
                    message: `Sube fuente para integración automática: ${filename}`,
                    content: contentB64,
                    branch,
                });
            }

            // 3. Disparar el workflow en esa rama
            await githubApi(
                env,
                'POST',
                `/repos/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/actions/workflows/${env.WORKFLOW_FILE}/dispatches`,
                {
                    ref: branch,
                    inputs: {
                        source_pdf_path: sourcePdfPath,
                        source_url: hasFile ? '' : link,
                        notes,
                        branch,
                    },
                },
            );

            return json({
                ok: true,
                branch,
                actionsUrl: `https://github.com/${env.GITHUB_OWNER}/${env.GITHUB_REPO}/actions/workflows/${env.WORKFLOW_FILE}`,
            });
        } catch (err: any) {
            return json({ error: `Fallo al disparar la integración: ${err?.message || String(err)}` }, 502);
        }
    },
};
