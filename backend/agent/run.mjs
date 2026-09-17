// Driver no interactivo del Claude Agent SDK, invocado por
// .github/workflows/integrate-content.yml. Corre el mismo motor que usa
// Claude Code, con acceso a Bash/ficheros, para integrar contenido nuevo
// en el repo siguiendo las convenciones de CLAUDE.md (ver system-prompt.md
// para las reglas específicas de este pipeline no interactivo).
//
// NOTA para la primera ejecución real: este fichero se escribió siguiendo
// la documentación pública del Agent SDK (code.claude.com/docs/en/agent-sdk),
// pero nunca se ha ejecutado de verdad todavía (necesita ANTHROPIC_API_KEY
// y un runner de GitHub Actions real). Si el primer `workflow_dispatch` de
// prueba falla con un error de opciones/tipos del SDK, es casi seguro un
// desajuste de nombres de campo — corrígelo aquí contra el error real, no
// contra lo que dice este comentario.

import { readFile, writeFile, mkdir } from 'node:fs/promises';
import { existsSync } from 'node:fs';
import path from 'node:path';
import { query } from '@anthropic-ai/claude-agent-sdk';

const REPO_ROOT = process.env.REPO_ROOT || process.cwd();
const SOURCE_PDF_PATH = process.env.SOURCE_PDF_PATH || '';
const SOURCE_URL = process.env.SOURCE_URL || '';
const USER_NOTES = process.env.USER_NOTES || '(sin notas del usuario)';
const MODEL = process.env.AGENT_MODEL || 'claude-sonnet-5';
const MAX_TURNS = parseInt(process.env.AGENT_MAX_TURNS || '', 10) || 80;
const MAX_BUDGET_USD = parseFloat(process.env.AGENT_MAX_BUDGET_USD || '') || 8;

const SUMMARY_PATH = path.join(REPO_ROOT, '.github', 'PR_SUMMARY.generated.md');
const TITLE_PATH = path.join(REPO_ROOT, '.github', 'PR_TITLE.generated.txt');

async function writeFallbackSummary(reason, extra = '') {
    await mkdir(path.dirname(SUMMARY_PATH), { recursive: true });
    const body = [
        '## Qué se añadió',
        '(el agente no llegó a escribir su propio resumen)',
        '',
        '## Motivo',
        reason,
        extra ? `\n\`\`\`\n${extra}\n\`\`\`` : '',
    ].join('\n');
    await writeFile(SUMMARY_PATH, body, 'utf-8');
    await writeFile(TITLE_PATH, 'Integración automática — revisar logs', 'utf-8');
}

if (!SOURCE_PDF_PATH && !SOURCE_URL) {
    console.error('Falta SOURCE_PDF_PATH o SOURCE_URL.');
    process.exit(1);
}

if (!process.env.ANTHROPIC_API_KEY) {
    console.error('Falta ANTHROPIC_API_KEY (secreto del repo de GitHub Actions).');
    process.exit(1);
}

const systemPromptPath = path.join(path.dirname(new URL(import.meta.url).pathname), 'system-prompt.md');
const pipelineInstructions = await readFile(systemPromptPath, 'utf-8');

const sourceDescription = SOURCE_PDF_PATH
    ? `Un PDF ya subido al repo en: ${SOURCE_PDF_PATH}`
    : `Un link a la fuente: ${SOURCE_URL}`;

const taskPrompt = `
${sourceDescription}

Notas del usuario sobre esta fuente:
${USER_NOTES}

Empieza leyendo CLAUDE.md completo (herramienta Read), y sigue el resto de
instrucciones que ya tienes en tu prompt de sistema.
`.trim();

console.log('=== Integración automática de contenido ===');
console.log('cwd:', REPO_ROOT);
console.log('model:', MODEL, '| maxTurns:', MAX_TURNS, '| maxBudgetUsd:', MAX_BUDGET_USD);
console.log('fuente:', sourceDescription);
console.log('===========================================\n');

let finalText = '';
let toolCallCount = 0;

try {
    const stream = query({
        prompt: taskPrompt,
        options: {
            cwd: REPO_ROOT,
            model: MODEL,
            maxTurns: MAX_TURNS,
            maxBudgetUsd: MAX_BUDGET_USD,
            systemPrompt: pipelineInstructions,
            permissionMode: 'bypassPermissions',
            allowDangerouslySkipPermissions: true,
            allowedTools: ['Bash', 'Read', 'Write', 'Edit', 'Glob', 'Grep'],
        },
    });

    for await (const message of stream) {
        // Log ligero para poder depurar el *run* desde los logs de Actions
        // sin volcar contenido de fichero completo a la consola.
        if (message?.type === 'tool_use' || message?.type === 'tool_result') {
            toolCallCount += 1;
            const label = message.name || message.tool_use_id || '';
            console.log(`[${message.type}] ${label}`);
        } else if (message?.type === 'message' && message.role === 'assistant' && Array.isArray(message.content)) {
            for (const block of message.content) {
                if (block?.type === 'text' && block.text) {
                    finalText += block.text + '\n';
                }
            }
        } else if (message?.type) {
            console.log(`[${message.type}]`);
        }
    }

    console.log(`\n=== Fin de la ejecución del agente (${toolCallCount} llamadas a herramientas) ===`);

    if (!existsSync(SUMMARY_PATH)) {
        console.warn('El agente no escribió .github/PR_SUMMARY.generated.md — generando uno de emergencia a partir de su última respuesta.');
        await writeFallbackSummary(
            'El agente terminó su ejecución sin seguir la instrucción de escribir el resumen. Se adjunta su último texto visible para que puedas revisar qué hizo.',
            finalText.slice(-4000),
        );
    }
} catch (err) {
    console.error('Error ejecutando el agente:', err);
    await writeFallbackSummary(
        `La ejecución del agente lanzó un error antes de terminar: ${err?.message || String(err)}`,
        finalText.slice(-4000),
    );
    process.exit(1);
}
