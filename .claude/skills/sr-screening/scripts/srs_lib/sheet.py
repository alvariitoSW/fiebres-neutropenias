"""Blind calibration sheet: a self-contained HTML checklist the user fills in.

It shows only bibliographic data, never the model's proposals, and produces the
JSON that `srs.py calibrate` expects.
"""
import json
import re
from html import escape

RANDOM_RE = r"randomi[sz]\w*|random allocation|randomly (?:assigned|allocated)"

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
.meets{background:#2e7d32}.fails{background:#c62828}.unclear{background:#b26a00}.yes{background:#2e7d32}.no{background:#c62828}.unknown{background:#757575}
mark{background:#ffe58a;color:#000}
textarea{width:100%;min-height:70px;font:12px monospace;background:var(--card);color:var(--fg);border:1px solid var(--line)}
</style>"""

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


TEMPLATE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Calibration sheet</title>
__STYLE__</head><body>
<h1>Calibration: screen these records yourself</h1>
<p class="note">Tick <b>Include</b> for every record you would keep for full-text review under your criteria.
Unticked records count as <b>exclude</b>. The AI's opinion is deliberately hidden so the comparison is fair.
When done, press <b>Copy my answers</b> and paste the result into the chat.</p>
__RECORDS__
<div class="bar"><button id="copy">Copy my answers</button><span id="count" class="note"></span></div>
<textarea id="out" readonly></textarea>
<script>
__COPY_JS__
const IDS = __IDS__;
function answers(){const o={};for(const id of IDS){const b=document.querySelector('input[data-id="'+id+'"]');o[id]=b.checked?"include":"exclude";}return o;}
function refresh(){const a=answers();const n=Object.values(a).filter(v=>v==="include").length;
document.getElementById("count").textContent=n+" of "+IDS.length+" marked include";
document.getElementById("out").value=JSON.stringify(a);}
document.querySelectorAll('input.inc').forEach(b=>b.addEventListener("change",refresh));
document.getElementById("copy").addEventListener("click",()=>{refresh();copyOut();});
refresh();
</script></body></html>
"""


def _highlight(text: str, terms: list[str]) -> str:
    """Escape text and wrap randomization words and protocol terms in <mark>. No AI involved."""
    patterns = [RANDOM_RE] + [re.escape(t) for t in terms if t and t.strip()]
    rx = re.compile("(" + "|".join(patterns) + ")", re.I)
    return "".join(f"<mark>{escape(part)}</mark>" if i % 2 else escape(part)
                   for i, part in enumerate(rx.split(text)))


def _record_html(r: dict, terms=(), fact=None, design_label="Design") -> str:
    meta = " · ".join(escape(str(x)) for x in (r["id"], r.get("year"), r.get("journal")) if x)
    text = r.get("abstract") or ""
    if fact is not None:
        meta += " " + _design_badge(design_label, r.get("pub_types"), fact.get("design_match"))
        meta += _match_badge("Outcomes", fact.get("outcome_match"), " (AI)")
        body = _mark_quotes(text, fact.get("evidence") or [])
    else:
        body = _highlight(text, list(terms))
    abstract = (f"<details{' open' if fact and fact.get("evidence") else ''}><summary>Abstract</summary><p>{body}</p></details>"
                if text else '<div class="meta">No abstract available</div>')
    return (f'<div class="rec"><label><input class="inc" type="checkbox" data-id="{escape(r["id"])}">'
            f'<span><b>{escape(r["title"])}</b><div class="meta">{meta}</div></span></label>'
            f"{abstract}</div>")


def calibration_sheet(batch: list[dict], terms=(), facts: dict | None = None,
                      design_label: str = "Design") -> str:
    records = "\n".join(
        _record_html(r, terms, facts.get(r["id"], {}) if facts is not None else None, design_label)
        for r in batch)
    ids = json.dumps([r["id"] for r in batch])
    return TEMPLATE.replace("__COPY_JS__", COPY_JS).replace("__STYLE__", STYLE).replace("__RECORDS__", records).replace("__IDS__", ids)


REVIEW_TEMPLATE = """<!doctype html>
<html lang="en"><head><meta charset="utf-8">
<meta name="viewport" content="width=device-width, initial-scale=1">
<title>Screening review</title>
__STYLE__
<style>.opts{display:flex;gap:16px;margin-top:6px}.opts label{display:inline-flex;gap:6px}
.reason{margin-top:4px}.need{border:2px solid #d33}h2{font-size:1.05rem;margin-top:1.4em}
.note-in{width:100%;margin-top:6px;display:none}</style></head><body>
<h1>__TITLE__ (__STAGE__)</h1>
<p class="note">Each record is pre-set to what the AI proposed. Change anything you disagree with.
<b>Uncertain</b> records have no default: you must decide each one. Excluding a record the AI wanted
to keep needs a short note. Confidence is <b>self-rated</b> by the AI, not a probability.
When done, press <b>Copy my decisions</b> and paste the result into the chat.</p>
__SECTIONS__
<div class="bar"><button id="copy">Copy my decisions</button><span id="count" class="note"></span></div>
<textarea id="out" readonly></textarea>
<script>
__COPY_JS__
const RECS = __RECS__;
function collect(){const o={};let missing=0;
for(const r of RECS){const c=document.querySelector('input[name="'+r.id+'"]:checked');
const box=document.getElementById("rec-"+r.id);const note=document.getElementById("note-"+r.id);
const needNote=c&&c.value==="exclude"&&r.proposal!=="exclude";note.style.display=needNote?"block":"none";
if(!c||(needNote&&!note.value.trim())){missing++;box.classList.add("need");continue;}
box.classList.remove("need");o[r.id]={decision:c.value};if(needNote)o[r.id].note=note.value.trim();}
document.getElementById("count").textContent=missing?missing+" record(s) still need your decision or a note":"All "+RECS.length+" decided";
document.getElementById("out").value=JSON.stringify(o);return o;}
document.querySelectorAll("input,textarea.note-in").forEach(e=>e.addEventListener("input",collect));
document.querySelectorAll(".all").forEach(b=>b.addEventListener("click",()=>{
document.querySelectorAll('[data-group="'+b.dataset.group+'"] input[value="'+b.dataset.value+'"]').forEach(i=>i.checked=true);collect();}));
document.getElementById("copy").addEventListener("click",()=>{collect();copyOut();});
collect();
</script></body></html>
"""


def _match_badge(label, value, suffix=""):
    cls, sign = {True: ("yes", "\u2713"), False: ("no", "\u2717")}.get(value, ("unknown", "?"))
    return f'<span class="badge {cls}">{escape(label)} {sign}{escape(suffix)}</span>'


def _design_badge(label, pub_types, ai_value):
    """RCT from NLM human indexing when available; otherwise the AI's reading, labelled as such."""
    if label == "RCT" and pub_types:
        if any("randomized controlled trial" in t.lower() for t in pub_types):
            return _match_badge(label, True, " \u00b7 NLM")
        main = next((t for t in pub_types if t.lower() != "journal article"), pub_types[0])
        return _match_badge(label, False, f" \u00b7 NLM: {main}")
    return _match_badge(label, ai_value, " (AI)")


def _mark_quotes(text, quotes):
    """Escape text and highlight only the AI's verbatim evidence quotes."""
    if not quotes:
        return escape(text)
    rx = re.compile("(" + "|".join(r"\s+".join(map(re.escape, q.split())) for q in quotes) + ")", re.I)
    return "".join(f"<mark>{escape(part)}</mark>" if i % 2 else escape(part)
                   for i, part in enumerate(rx.split(text)))


def _review_item(item, proposal, group, preset=None, design_label="Design"):
    rid = escape(item["id"])
    chosen = preset.get(item["id"], proposal) if preset else proposal
    opts = "".join(
        f'<label><input type="radio" name="{rid}" value="{v}"{" checked" if chosen == v else ""}> {v.capitalize()}</label>'
        for v in ("include", "exclude"))
    badges = (_design_badge(design_label, item.get("pub_types"), item.get("design_match"))
              + _match_badge("Outcomes", item.get("outcome_match"), " (AI)"))
    evidence = item.get("evidence") or []
    abstract = (f"<details{' open' if evidence else ''}><summary>Abstract</summary>"
                f"<p>{_mark_quotes(item['abstract'], evidence)}</p></details>"
                if item.get("abstract") else "")
    return (f'<div class="rec" id="rec-{rid}" data-group="{group}"><b>{escape(item["title"])}</b>'
            f'<div class="meta">{rid} · AI: {proposal} · confidence {escape(item["confidence_self_rated"])} (self-rated)</div>'
            f'<div>{badges}</div><div class="reason">Reason: {escape(item["reason"])}</div>{abstract}'
            f'<div class="opts">{opts}</div>'
            f'<textarea class="note-in" id="note-{rid}" placeholder="Why exclude? (required)"></textarea></div>')


def review_sheet(review: dict, stage: str, preset: dict | None = None,
                 title: str = "Review the AI's proposals", design_label: str = "Design") -> str:
    sections, recs, g = [], [], 0
    groups = [(f"Proposed exclusions: {crit}", "exclude", items) for crit, items in review["exclude"].items()]
    groups += [("Uncertain: you decide each one", "uncertain", review["uncertain"]),
               ("Proposed inclusions", "include", review["include"])]
    for heading, proposal, items in groups:
        if not items:
            continue
        g += 1
        bulk = "" if proposal == "uncertain" else (
            f' <button class="all" data-group="g{g}" data-value="{proposal}">Set all to {proposal}</button>')
        sections.append(f"<h2>{escape(heading)} ({len(items)}){bulk}</h2>")
        sections += [_review_item(i, proposal, f"g{g}", preset, design_label) for i in items]
        recs += [{"id": i["id"], "proposal": proposal} for i in items]
    stage_name = {"ta": "title/abstract", "ft": "full text"}.get(stage, stage)
    return (REVIEW_TEMPLATE.replace("__COPY_JS__", COPY_JS).replace("__STYLE__", STYLE).replace("__STAGE__", stage_name).replace("__TITLE__", escape(title))
            .replace("__SECTIONS__", "\n".join(sections)).replace("__RECS__", json.dumps(recs)))
