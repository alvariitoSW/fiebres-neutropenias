"""The per-manuscript evidence table, stored as an .xlsx the user owns.

Sheets: "Evidence" (main), "Seen, not added" (contradicting/partial candidates the user
did not add), hidden "_sources" (source text for re-checking passages) and hidden "_meta".
"""
import json
import os

try:
    import openpyxl
    from openpyxl.styles import Alignment, Font
except ImportError:  # pragma: no cover - reported by the CLI
    openpyxl = None

SCHEMA = "claim-check/1"
CHUNK = 30000  # Excel cells hold at most 32,767 characters

COLUMNS = [
    ("row_id", "Row"), ("claim_id", "ID"), ("section", "Section"), ("claim", "Claim"),
    ("verdict", "Verdict"), ("finding", "Finding"), ("passage", "Verbatim passage"),
    ("passage_location", "Passage location"), ("design_n", "Design / N"),
    ("source_type", "Source"), ("reference", "Reference"), ("pmid", "PMID"), ("doi", "DOI"),
    ("search", "Search"), ("verified", "Verified"), ("notes", "Notes"),
    ("source_status", "Source status"),
]
ROW_KEYS = [k for k, _ in COLUMNS]
HEADER_TO_KEY = {h: k for k, h in COLUMNS}


OWN_SHEETS = ("Evidence", "Seen, not added", "_sources", "_meta")


class TableError(Exception):
    pass


def _require_openpyxl():
    if openpyxl is None:
        raise TableError("openpyxl is not installed; run: pip install openpyxl")


def new_table(title: str) -> dict:
    return {"title": title, "rows": [], "seen": [], "sources": {}}


def _write_rows(ws, rows):
    extra = []
    for r in rows:
        extra += [h for h in r.get("_extra", {}) if h not in extra]
    ws.append([h for _, h in COLUMNS] + extra)
    for cell in ws[1]:
        cell.font = Font(bold=True)
    for r in rows:
        ws.append([r.get(k, "") or "" for k in ROW_KEYS] + [r.get("_extra", {}).get(h) for h in extra])
    ws.freeze_panes = "A2"
    widths = {"claim": 40, "finding": 40, "passage": 60, "reference": 50, "notes": 30}
    for i, (k, _) in enumerate(COLUMNS, start=1):
        ws.column_dimensions[openpyxl.utils.get_column_letter(i)].width = widths.get(k, 14)
    for row in ws.iter_rows(min_row=2):
        for cell in row:
            cell.alignment = Alignment(wrap_text=True, vertical="top")


def save(table: dict, path: str) -> None:
    _require_openpyxl()
    try:
        wb = openpyxl.load_workbook(path) if os.path.exists(path) else openpyxl.Workbook()
    except Exception:
        wb = openpyxl.Workbook()
    keep_order = [n for n in wb.sheetnames if n not in OWN_SHEETS]
    for name in OWN_SHEETS:
        if name in wb.sheetnames:
            del wb[name]
    if not keep_order and wb.sheetnames:  # fresh workbook: drop its default sheet
        del wb[wb.sheetnames[0]]
    _write_rows(wb.create_sheet("Evidence", 0), table["rows"])
    _write_rows(wb.create_sheet("Seen, not added", 1), table["seen"])
    src = wb.create_sheet("_sources")
    src.append(["key", "chunk", "pmid", "pmcid", "doi", "status", "meta", "text"])
    for key, s in table["sources"].items():
        text = s["text"] or ""
        chunks = [text[i:i + CHUNK] for i in range(0, len(text), CHUNK)] or [""]
        for n, chunk in enumerate(chunks):
            src.append([key, n, s.get("pmid"), s.get("pmcid"), s.get("doi"), s.get("status"),
                        json.dumps(s.get("meta") or {}, ensure_ascii=False) if n == 0 else "", chunk])
    src.sheet_state = "hidden"
    meta = wb.create_sheet("_meta")
    meta.append(["schema", SCHEMA])
    meta.append(["title", table["title"]])
    meta.sheet_state = "hidden"
    wb.active = 0
    try:
        wb.save(path)
    except OSError as e:
        raise TableError(f"cannot save {path} ({e.strerror}); close it in Excel and try again")


def _read_rows(ws):
    rows_iter = ws.iter_rows(values_only=True)
    header = next(rows_iter, None) or ()
    keys = [HEADER_TO_KEY.get(h) for h in header]
    rows = []
    for values in rows_iter:
        if not any(v not in (None, "") for v in values):
            continue
        row = {k: "" for k in ROW_KEYS}
        extra = {}
        for h, k, v in zip(header, keys, values):
            if k:
                row[k] = "" if v is None else str(v)
            elif h:
                extra[str(h)] = v
        if extra:
            row["_extra"] = extra
        rows.append(row)
    return rows


def load(path: str) -> dict:
    _require_openpyxl()
    try:
        wb = openpyxl.load_workbook(path)
    except Exception as e:
        raise TableError(f"cannot open {path}: {e}")
    meta = dict(wb["_meta"].iter_rows(values_only=True)) if "_meta" in wb.sheetnames else {}
    if meta.get("schema") != SCHEMA:
        raise TableError(f"{path} is not a claim-check table; start a new one with `new`")
    missing = [n for n in OWN_SHEETS if n not in wb.sheetnames]
    if missing:
        raise TableError(f"{path}: sheet(s) {', '.join(missing)} were renamed or deleted; "
                         "restore the names or use an earlier copy")
    try:
        return _load_sheets(wb, meta)
    except (ValueError, TypeError) as e:
        raise TableError(f"{path}: hidden sheet _sources is damaged ({e})")


def _load_sheets(wb, meta):
    sources = {}
    for key, chunk, pmid, pmcid, doi, status, meta_json, text in \
            wb["_sources"].iter_rows(min_row=2, values_only=True):
        if chunk == 0 or key not in sources:
            sources[key] = {"key": key, "pmid": pmid, "pmcid": pmcid, "doi": doi, "status": status,
                            "meta": json.loads(meta_json) if meta_json else {}, "text": text or ""}
        else:
            sources[key]["text"] += text or ""
    return {"title": meta.get("title") or "", "rows": _read_rows(wb["Evidence"]),
            "seen": _read_rows(wb["Seen, not added"]), "sources": sources}


def _next(ids, prefix, width):
    nums = [int(i[len(prefix):]) for i in ids if i and i.startswith(prefix) and i[len(prefix):].isdigit()]
    return f"{prefix}{(max(nums) + 1 if nums else 1):0{width}d}"


def next_claim_id(table: dict) -> str:
    return _next([r["claim_id"] for r in table["rows"] + table["seen"]], "C", 2)


def next_row_id(table: dict) -> str:
    return _next([r["row_id"] for r in table["rows"]], "R", 3)


def next_seen_id(table: dict) -> str:
    return _next([r["row_id"] for r in table["seen"]], "S", 3)
