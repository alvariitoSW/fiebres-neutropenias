#!/usr/bin/env python3
"""cc: deterministic helper for the claim-check skill.

Claude judges (query, verdicts, passages); this tool stores the evidence table, fetches the
source text itself, checks every passage verbatim, renders the artifacts and exports.
"""
import argparse
import copy
import io
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from cc_lib import pubmed, rows, sheets, table as T  # noqa: E402

ERRORS = (T.TableError, rows.RowError, pubmed.FetchError)


class _Resp(io.BytesIO):
    def __enter__(self):
        return self

    def __exit__(self, *a):
        return False


def _urlopen():
    """Real network, or a fixture file / simulated outage when CC_FAKE_EFETCH is set (tests)."""
    fake = os.environ.get("CC_FAKE_EFETCH")
    if not fake:
        return pubmed.urllib.request.urlopen

    def opener(url, timeout=None):
        if fake == "offline":
            raise pubmed.urllib.error.URLError("simulated offline")
        with open(fake, "rb") as f:
            return _Resp(f.read())
    return opener


def _read_json(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        raise rows.RowError(f"cannot read JSON file {path}: {e}")


def cmd_new(a):
    if os.path.exists(a.table):
        raise T.TableError(f"{a.table} already exists; refusing to overwrite it")
    T.save(T.new_table(a.title), a.table)
    print(f"Created {a.table}.")


def cmd_fetch(a, t):
    opener = _urlopen()
    try:
        records = pubmed.fetch_pubmed(a.pmids.split(","), urlopen=opener)
    except pubmed.FetchError as e:
        raise pubmed.FetchError(f"{e}. Ask the user to export these PMIDs from PubMed as a .nbib "
                                "file and run `import-nbib`.")
    for r in records:
        text = None
        if r.get("pmcid"):
            try:
                text = (r["title"] or "") + " " + (r["abstract"] or "") + "\n" + \
                    pubmed.fetch_pmc(r["pmcid"], urlopen=opener)
            except pubmed.FetchError as e:
                print(f"  {r['pmid']}: full text not used ({e})")
        key = rows.add_source(t, r, "fetched", text)
        print(f"Stored {key}{' with PMC full text' if text else ' (title + abstract)'}.")
    missing = set(p.strip() for p in a.pmids.split(",")) - {r["pmid"] for r in records}
    if missing:
        print("Not returned by PubMed: " + ", ".join(sorted(missing)))
    return True


def cmd_import_nbib(a, t):
    try:
        with open(a.file, encoding="utf-8", errors="replace") as f:
            records = pubmed.parse_nbib(f.read())
    except OSError as e:
        raise T.TableError(f"{a.file}: cannot open file ({e.strerror})")
    if not records:
        raise T.TableError(f"{a.file}: no PubMed records found (export in PubMed format)")
    for r in records:
        rows.add_source(t, r, "uploaded")
    print(f"Stored {len(records)} record(s) from {os.path.basename(a.file)}.")
    return True


def cmd_add_transcribed(a, t):
    records = _read_json(a.file)
    for r in records:
        if not (r.get("pmid") or r.get("doi")):
            raise rows.RowError("each transcribed record needs a pmid or doi")
        rows.add_source(t, r, rows.TRANSCRIBED)
    print(f"Stored {len(records)} record(s) as transcribed (unchecked); the user must verify them.")
    return True


def cmd_triage(a, t):
    items = _read_json(a.file)
    rows.validate_triage(t, items)
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(sheets.triage_sheet(_read_json(a.claim_file), items, t["sources"]))
    print(f"Wrote {a.out}. Show it as an interactive artifact.")


def _pdf_text(path):
    if not path.lower().endswith(".pdf"):
        with open(path, encoding="utf-8", errors="replace") as f:
            return f.read()
    try:
        import pypdf
    except ImportError:
        raise T.TableError("pypdf is not installed; run: pip install pypdf")
    try:
        reader = pypdf.PdfReader(path)
        return "\n".join(f"PAGE {i}: " + (page.extract_text() or "")
                         for i, page in enumerate(reader.pages, 1))
    except Exception as e:
        raise T.TableError(f"{os.path.basename(path)}: cannot read PDF ({e})")


def cmd_import_pdf(a, t):
    try:
        text = _pdf_text(a.file)
    except OSError as e:
        raise T.TableError(f"{a.file}: cannot open file ({e.strerror})")
    rows.add_fulltext(t, a.key, text, "uploaded (pdf)")
    print(f"Added full text to {a.key} ({len(text):,} characters).")
    return True


def cmd_candidates(a, t):
    cands = _read_json(a.file)
    rows.add_candidates(copy.deepcopy(t), _read_json(a.claim_file), cands, [])  # validation only
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(sheets.candidate_sheet(_read_json(a.claim_file), cands, t["sources"]))
    print(f"Wrote {a.out}. Show it as an interactive artifact.")


def cmd_add(a, t):
    chosen = _read_json(a.chosen)
    chosen = chosen.get("chosen", []) if isinstance(chosen, dict) else chosen
    res = rows.add_candidates(t, _read_json(a.claim_file), _read_json(a.file), chosen)
    print(f"{res['claim_id']}: added {res['added']} row(s); {res['seen']} kept in 'Seen, not added'.")
    return True


def cmd_not_found(a, t):
    cid = rows.add_not_found(t, _read_json(a.claim_file))
    print(f"{cid}: recorded as not found.")
    return True


def cmd_table_sheet(a, t):
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(sheets.table_sheet(t))
    print(f"Wrote {a.out}. Show it as an interactive artifact.")


def cmd_apply_edits(a, t):
    n = rows.apply_edits(t, _read_json(a.file))
    print(f"Applied edits to {n} row(s).")
    return True


def cmd_revalidate(a, t):
    bad = rows.revalidate(t)
    print("All passages match their source." if not bad else
          "Passages no longer found in the source text: " + ", ".join(bad))


def _cited(t, verified_only):
    return [r for r in t["rows"] if r["verdict"] != "not found" and (r["pmid"] or r["doi"])
            and (r["verified"] or not verified_only)]


def cmd_references(a, t):
    seen = []
    for r in _cited(t, a.verified_only):
        if r["reference"] not in seen:
            seen.append(r["reference"])
    print("\n".join(f"{i}. {ref}" for i, ref in enumerate(seen, 1)) or "No references yet.")


def cmd_identifiers(a, t):
    ids = []
    for r in _cited(t, a.verified_only):
        ident = r["doi"] or r["pmid"]
        if ident not in ids:
            ids.append(ident)
    if a.out:
        with open(a.out, "w", encoding="utf-8") as f:
            f.write(sheets.identifiers_sheet(ids))
        print(f"Wrote {a.out} with {len(ids)} identifier(s).")
    else:
        print("\n".join(ids))


COMMANDS = {
    "fetch": cmd_fetch,
    "import-nbib": cmd_import_nbib,
    "add-transcribed": cmd_add_transcribed,
    "triage": cmd_triage,
    "import-pdf": cmd_import_pdf,
    "candidates": cmd_candidates,
    "add": cmd_add,
    "not-found": cmd_not_found,
    "table-sheet": cmd_table_sheet,
    "apply-edits": cmd_apply_edits,
    "revalidate": cmd_revalidate,
    "references": cmd_references,
    "identifiers": cmd_identifiers,
}


def build_parser():
    ap = argparse.ArgumentParser(prog="cc.py", description=__doc__)
    ap.add_argument("--table", required=True, help="the manuscript's .xlsx")
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("new"); s.add_argument("--title", required=True)
    s = sub.add_parser("fetch"); s.add_argument("--pmids", required=True)
    s = sub.add_parser("import-nbib"); s.add_argument("file")
    s = sub.add_parser("add-transcribed"); s.add_argument("--file", required=True)
    s = sub.add_parser("triage"); s.add_argument("--claim-file", required=True)
    s.add_argument("--file", required=True); s.add_argument("--out", required=True)
    s = sub.add_parser("import-pdf"); s.add_argument("--key", required=True); s.add_argument("file")
    s = sub.add_parser("candidates"); s.add_argument("--claim-file", required=True)
    s.add_argument("--file", required=True); s.add_argument("--out", required=True)
    s = sub.add_parser("add"); s.add_argument("--claim-file", required=True)
    s.add_argument("--file", required=True); s.add_argument("--chosen", required=True)
    s = sub.add_parser("not-found"); s.add_argument("--claim-file", required=True)
    s = sub.add_parser("table-sheet"); s.add_argument("--out", required=True)
    s = sub.add_parser("apply-edits"); s.add_argument("--file", required=True)
    sub.add_parser("revalidate")
    s = sub.add_parser("references"); s.add_argument("--verified-only", action="store_true")
    s = sub.add_parser("identifiers"); s.add_argument("--verified-only", action="store_true")
    s.add_argument("--out")
    return ap


def main(argv=None):
    a = build_parser().parse_args(argv)
    try:
        if a.cmd == "new":
            cmd_new(a)
            return 0
        t = T.load(a.table)
        if COMMANDS[a.cmd](a, t):
            T.save(t, a.table)
    except ERRORS as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
