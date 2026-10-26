"""Interactive artifacts: candidate picker, evidence-table editor, Zotero identifiers.

Each page ends with a copy button that puts JSON (or text) on the clipboard for the chat.
"""
import json
from html import escape

from cc_lib.verbatim import squash

COPY_JS = """
function copyOut(){const t=document.getElementById("out");const b=document.getElementById("copy");
const label=b.dataset.label||(b.dataset.label=b.textContent);
const done=ok=>{b.textContent=ok?"Copied \u2713 \u2014 paste it in the chat":"Press Ctrl/Cmd+C to copy";
setTimeout(()=>{b.textContent=label;},4000);};
t.focus();t.select();t.setSelectionRange(0,t.value.length);
let ok=false;try{ok=document.execCommand("copy");}catch(e){}
if(ok){done(true);return;}
if(navigator.clipboard&&navigator.clipboard.writeText){navigator.clipboard.writeText(t.value).then(()=>done(true),()=>done(false));}
else{done(false);}}
"""

STYLE = """<style>
:root{--bg:#fff;--fg:#1a1a1a;--muted:#666;--line:#ddd;--accent:#0b6bcb;--card:#f7f7f8}
@media (prefers-color-scheme: dark){:root:not([data-theme="light"]){--bg:#1b1b1d;--fg:#eee;--muted:#aaa;--line:#333;--accent:#5aa9ff;--card:#242427}}
:root[data-theme="dark"]{--bg:#1b1b1d;--fg:#eee;--muted:#aaa;--line:#333;--accent:#5aa9ff;--card:#242427}
body{background:var(--bg);color:var(--fg);font:15px/1.5 system-ui,sans-serif;margin:0 auto;max-width:860px;padding:16px}
h1{font-size:1.3rem;margin:.2em 0}
.note{color:var(--muted)}
.rec{border:1px solid var(--line);border-radius:8px;padding:10px 12px;margin:10px 0;background:var(--card)}
.rec label{display:flex;gap:10px;align-items:flex-start;cursor:pointer}
.rec input{width:20px;height:20px;margin-top:3px;flex:none}
.meta{color:var(--muted);font-size:.85rem}
details{margin-top:6px}
.bar{position:sticky;bottom:0;background:var(--bg);border-top:1px solid var(--line);padding:10px 0;display:flex;gap:10px;align-items:center;flex-wrap:wrap}
button{background:var(--accent);color:#fff;border:0;border-radius:6px;padding:9px 14px;font-size:.95rem;cursor:pointer}
.badge{display:inline-block;font-size:.75rem;border-radius:10px;padding:1px 8px;margin:4px 4px 0 0;color:#fff}
.supports{background:#2e7d32}.contradicts{background:#c62828}.partial{background:#b26a00}.relevant{background:#1565c0}.yes{background:#2e7d32}.no{background:#c62828}.unknown{background:#757575}
mark{background:#ffe58a;color:#000}
textarea{width:100%;min-height:70px;font:12px monospace;background:var(--card);color:var(--fg);border:1px solid var(--line)}
</style>"""

PAGE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>__TITLE__</title>
__STYLE__
<style>td,th{border:1px solid var(--line);padding:6px;vertical-align:top;font-size:.85rem}
table{border-collapse:collapse;width:100%}[contenteditable]{background:var(--card);min-width:120px}
.wrap{overflow-x:auto}h2{font-size:1.05rem;margin-top:1.4em}</style></head><body>
<h1>__TITLE__</h1>
<p class="note">__INTRO__</p>
__BODY__
<div class="bar"><button id="copy">__BUTTON__</button><span id="count" class="note"></span></div>
<textarea id="out" readonly>__OUT__</textarea>
<script>
__COPY_JS__
__SCRIPT__
</script></body></html>
"""


def _page(title, intro, body, button, script, out=""):
    return (PAGE.replace("__STYLE__", STYLE).replace("__COPY_JS__", COPY_JS)
            .replace("__TITLE__", escape(title)).replace("__INTRO__", intro)
            .replace("__BODY__", body).replace("__BUTTON__", escape(button))
            .replace("__SCRIPT__", script).replace("__OUT__", escape(out)))


def _mark(text, passage):
    """Escape text and highlight only this passage (whitespace/case-insensitive)."""
    flat = " ".join(text.split())
    i = squash(flat).find(squash(passage))
    if i < 0 or not passage.strip():
        return escape(flat)
    j = i + len(squash(passage))
    return escape(flat[:i]) + "<mark>" + escape(flat[i:j]) + "</mark>" + escape(flat[j:])


def _candidate(i, c, sources):
    s = sources.get(c["key"], {})
    meta = s.get("meta") or {}
    ids = " · ".join(x for x in (f"PMID {s.get('pmid')}" if s.get("pmid") else "",
                                 f"doi {s.get('doi')}" if s.get("doi") else "") if x)
    first = (meta.get("authors") or [""])[0]
    cite = " · ".join(escape(str(x)) for x in (first, meta.get("journal_abbrev"), meta.get("year")) if x)
    return (f'<div class="rec" data-idx="{i}"><label><input class="pick" type="checkbox" value="{i}">'
            f'<span><span class="badge {escape(c["verdict"])}">{escape(c["verdict"])}</span> '
            f'<b>{escape(c.get("finding") or "")}</b>'
            f'<div class="meta">{escape(c.get("design_n") or "")} · {escape(c.get("source_type") or "")}'
            f' · {cite} · {escape(ids)} · source {escape(s.get("status") or "")}</div></span></label>'
            f'<details open><summary>{escape(meta.get("title") or "")}</summary>'
            f'<p>{_mark(s.get("text") or "", c.get("passage") or "")}</p></details></div>')


def candidate_sheet(claim: dict, candidates: list[dict], sources: dict) -> str:
    against = [(i, c) for i, c in enumerate(candidates) if c["verdict"] in ("contradicts", "partial")]
    favour = [(i, c) for i, c in enumerate(candidates) if c["verdict"] == "supports"]
    relevant = [(i, c) for i, c in enumerate(candidates) if c["verdict"] == "relevant"]
    body = f'<p><b>{"Question" if relevant else "Claim"}:</b> {escape(claim.get("claim") or "")}</p>'
    if against or favour:
        body += f"<h2>Evidence against or only partial ({len(against)})</h2>"
        body += "".join(_candidate(i, c, sources) for i, c in against) or '<p class="note">None found.</p>'
        body += f"<h2>Evidence for ({len(favour)})</h2>"
        body += "".join(_candidate(i, c, sources) for i, c in favour) or '<p class="note">None found.</p>'
    if relevant:
        body += f"<h2>Relevant evidence ({len(relevant)})</h2>"
        body += "".join(_candidate(i, c, sources) for i, c in relevant)
    script = """function refresh(){const chosen=[...document.querySelectorAll('input.pick:checked')].map(b=>+b.value);
document.getElementById("count").textContent=chosen.length+" selected";
document.getElementById("out").value=JSON.stringify({chosen:chosen});}
function collect(){refresh();}
document.querySelectorAll('input.pick').forEach(b=>b.addEventListener("change",refresh));
document.getElementById("copy").addEventListener("click",()=>{refresh();copyOut();});refresh();"""
    intro = ("Tick the articles to add to your table. Contradicting and partial evidence is listed first; "
             "the ones you leave unticked are kept in the sheet <b>Seen, not added</b>. "
             "Only the quoted passage is highlighted. Press <b>Copy my selection</b> and paste it in the chat.")
    return _page("Evidence found", intro, body, "Copy my selection", script)


def triage_sheet(claim: dict, items: list[dict], sources: dict) -> str:
    cards = []
    for it in items:
        src = sources.get(it["key"], {})
        meta = src.get("meta") or {}
        abstract = (src.get("text") or "")
        info = " · ".join(escape(str(x)) for x in (
            (meta.get("authors") or [""])[0], meta.get("journal_abbrev"), meta.get("year"),
            it.get("design_n"), f"PMID {src.get('pmid')}" if src.get("pmid") else "",
            "full text in PMC" if src.get("pmcid") else "") if x)
        cards.append(
            f'<div class="rec"><label><input class="pick" type="checkbox" value="{escape(it["key"])}">'
            f'<span><b>{escape(meta.get("title") or "")}</b><div class="meta">{info}</div>'
            f'<div class="reason"><span class="badge unknown">AI summary</span> {escape(it["summary"])}</div>'
            f'<div class="note">This one is useful</div></span></label>'
            f'<details><summary>Abstract</summary><p>{escape(abstract)}</p></details></div>')
    body = (f'<p><b>Question:</b> {escape(claim.get("claim") or "")}</p>' + "".join(cards))
    script = """function refresh(){const u=[...document.querySelectorAll('input.pick:checked')].map(b=>b.value);
document.getElementById("count").textContent=u.length+" marked useful";
document.getElementById("out").value=JSON.stringify({useful:u});}
document.querySelectorAll('input.pick').forEach(b=>b.addEventListener("change",refresh));
document.getElementById("copy").addEventListener("click",()=>{refresh();copyOut();});refresh();"""
    intro = ("Short AI summaries of what each article says about your question — check the abstract when in "
             "doubt. Tick <b>This one is useful</b> for the articles worth reading in full; Claude will then get "
             "the full text and quote the exact passages. Press <b>Copy my choice</b> and paste it in the chat.")
    return _page("Articles found", intro, body, "Copy my choice", script)


EDIT_COLS = [("finding", "Finding"), ("passage", "Verbatim passage"), ("notes", "Notes")]


def table_sheet(table: dict) -> str:
    head = ("<tr><th>Row</th><th>Claim</th><th>Verdict</th>" + "".join(f"<th>{h}</th>" for _, h in EDIT_COLS)
            + "<th>Reference</th><th>Verified</th></tr>")
    trs = []
    for r in table["rows"]:
        rid = escape(r["row_id"])
        opts = "".join(f'<option{" selected" if r["verdict"] == v else ""}>{v}</option>'
                       for v in ("supports", "contradicts", "partial", "relevant", "not found"))
        cells = "".join(f'<td contenteditable="true" data-row="{rid}" data-col="{k}">{escape(r.get(k) or "")}</td>'
                        for k, _ in EDIT_COLS)
        checked = " checked" if r.get("verified") else ""
        trs.append(f'<tr><td>{rid}<br><span class="meta">{escape(r["claim_id"])}</span></td>'
                   f'<td>{escape(r.get("claim") or "")}</td>'
                   f'<td><select data-row="{rid}" data-col="verdict">{opts}</select></td>{cells}'
                   f'<td>{escape(r.get("reference") or "")}</td>'
                   f'<td><input type="checkbox" data-row="{rid}" data-col="verified"{checked}></td></tr>')
    body = f'<div class="wrap"><table>{head}{"".join(trs)}</table></div>'
    script = """const ORIG={};
function val(e){return e.type==="checkbox"?(e.checked?"yes":""):(e.tagName==="SELECT"?e.value:e.innerText.trim());}
const els=[...document.querySelectorAll('[data-row]')];els.forEach(e=>ORIG[e.dataset.row+"|"+e.dataset.col]=val(e));
function refresh(){const o={};let n=0;els.forEach(e=>{const v=val(e);if(v!==ORIG[e.dataset.row+"|"+e.dataset.col]){
(o[e.dataset.row]=o[e.dataset.row]||{})[e.dataset.col]=v;n++;}});
document.getElementById("count").textContent=n+" change(s)";document.getElementById("out").value=JSON.stringify(o);}
els.forEach(e=>{e.addEventListener("input",refresh);e.addEventListener("change",refresh);});
document.getElementById("copy").addEventListener("click",()=>{refresh();copyOut();});refresh();"""
    intro = ("Edit Finding, Passage or Notes directly, change the verdict, and tick <b>Verified</b> after checking "
             "the article. Press <b>Copy my changes</b> and paste them in the chat; only changed cells are sent. "
             "Edited passages are re-checked against the article text.")
    return _page(f"Evidence table: {table.get('title') or ''}", intro, body, "Copy my changes", script)


def identifiers_sheet(identifiers: list[str]) -> str:
    intro = ("One identifier per line (DOI, or PMID when there is no DOI). In Zotero, click the magic-wand "
             "button <b>Add Item by Identifier</b>, paste, and press Enter.")
    script = 'document.getElementById("copy").addEventListener("click",copyOut);'
    return _page("Identifiers for Zotero", intro, "", "Copy identifiers", script, "\n".join(identifiers))
