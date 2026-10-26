"""Evidence rows: every passage is checked verbatim against source text the AI did not type."""
from cc_lib import table as T
from cc_lib.vancouver import vancouver
from cc_lib.verbatim import find_problem

# "relevant" is for open questions (no direction to support or contradict)
VERDICTS = ("supports", "contradicts", "partial", "relevant", "not found")
CANDIDATE_VERDICTS = VERDICTS[:4]
SEEN_VERDICTS = ("contradicts", "partial")
TRANSCRIBED = "transcribed (unchecked)"
EDITABLE = {"section", "claim", "verdict", "finding", "passage", "passage_location", "design_n",
            "source_type", "verified", "notes"}


class RowError(Exception):
    pass


def add_source(table: dict, record: dict, status: str, text: str | None = None) -> str:
    """Store a PubMed record (and optionally PMC full text) as the source for passage checks."""
    key = f"PMID:{record['pmid']}" if record.get("pmid") else f"DOI:{record['doi']}"
    if text is None:
        text = " ".join(x for x in (record.get("title"), record.get("abstract")) if x)
    meta = {k: record.get(k) for k in ("title", "authors", "journal_abbrev", "year", "volume",
                                        "issue", "pages", "doi", "pmid", "pmcid", "pub_types")}
    old = table["sources"].get(key)
    if old and text and old["text"] and text not in old["text"]:
        text = old["text"] + "\n" + text  # keep the abstract when full text is added
    table["sources"][key] = {"key": key, "pmid": record.get("pmid"), "pmcid": record.get("pmcid"),
                             "doi": record.get("doi"), "status": status, "meta": meta,
                             "text": text or ""}
    return key


def validate_triage(table: dict, items: list[dict]) -> None:
    """Triage items: stored source + a non-empty AI summary (shown labelled as such)."""
    if not isinstance(items, list):
        raise RowError("triage file must be a JSON list")
    errors = []
    for i, it in enumerate(items):
        key = it.get("key") if isinstance(it, dict) else None
        if key not in table["sources"]:
            errors.append(f"item {i}: source {key} not stored; fetch or import it first")
        elif not (it.get("summary") or "").strip():
            errors.append(f"item {i} ({key}): summary is required")
    if errors:
        raise RowError("triage rejected:\n" + "\n".join(errors))


def add_fulltext(table: dict, key: str, text: str, status: str) -> None:
    """Append full text (e.g. from an uploaded PDF) to a stored source."""
    src = table["sources"].get(key)
    if src is None:
        raise RowError(f"source {key} not stored; fetch or import its PubMed record first")
    if not (text or "").strip():
        raise RowError(f"{key}: no text could be extracted (scanned PDF?); quote from the abstract "
                       "or ask the user for another copy")
    src["text"] = (src["text"] + "\n" + text).strip()
    if src["status"] != TRANSCRIBED:
        src["status"] = status


def _check_candidate(table, i, c):
    src = table["sources"].get(c.get("key"))
    if src is None:
        return f"candidate {i}: source {c.get('key')} not stored; fetch or import it first"
    if c.get("verdict") not in CANDIDATE_VERDICTS:
        return f"candidate {i}: verdict must be one of {CANDIDATE_VERDICTS}"
    if not (src.get("pmid") or src.get("doi")):
        return f"candidate {i}: source has neither PMID nor DOI"
    if not (c.get("passage") or "").strip():
        return f"candidate {i}: a verbatim passage is required"
    if src["status"] != TRANSCRIBED:
        problem = find_problem(src["text"], c["passage"])
        if problem:
            return f"candidate {i} ({c['key']}): {problem}"
    return None


def _row(table, claim, claim_id, c, row_id):
    src = table["sources"][c["key"]]
    row = {k: "" for k in T.ROW_KEYS}
    row.update({
        "row_id": row_id, "claim_id": claim_id, "section": claim.get("section") or "",
        "claim": claim.get("claim") or "", "verdict": c["verdict"], "finding": c.get("finding") or "",
        "passage": c["passage"].strip(), "passage_location": c.get("passage_location") or "",
        "design_n": c.get("design_n") or "", "source_type": c.get("source_type") or "",
        "reference": vancouver(src["meta"]), "pmid": src.get("pmid") or "",
        "doi": src.get("doi") or "", "search": claim.get("search") or "",
        "source_status": src["status"],
    })
    return row


def add_candidates(table: dict, claim: dict, candidates: list[dict], chosen: list[int]) -> dict:
    """Add chosen candidates (by index) as rows; record unchosen contradicting/partial ones as seen."""
    errors = [e for e in (_check_candidate(table, i, c) for i, c in enumerate(candidates)) if e]
    bad_idx = [i for i in chosen if not isinstance(i, int) or not 0 <= i < len(candidates)]
    errors += [f"chosen index {i} does not exist" for i in bad_idx]
    if errors:
        raise RowError("nothing saved:\n" + "\n".join(errors))
    claim_id = claim.get("claim_id") or T.next_claim_id(table)
    added = seen = 0
    for i, c in enumerate(candidates):
        if i in chosen:
            table["rows"].append(_row(table, claim, claim_id, c, T.next_row_id(table)))
            added += 1
        elif c["verdict"] in SEEN_VERDICTS:
            table["seen"].append(_row(table, claim, claim_id, c, T.next_seen_id(table)))
            seen += 1
    return {"claim_id": claim_id, "added": added, "seen": seen}


def add_not_found(table: dict, claim: dict) -> str:
    claim_id = claim.get("claim_id") or T.next_claim_id(table)
    row = {k: "" for k in T.ROW_KEYS}
    row.update({"row_id": T.next_row_id(table), "claim_id": claim_id,
                "section": claim.get("section") or "", "claim": claim.get("claim") or "",
                "verdict": "not found", "search": claim.get("search") or ""})
    table["rows"].append(row)
    return claim_id


def _source_for(table, row):
    return table["sources"].get(f"PMID:{row['pmid']}") if row.get("pmid") else \
        table["sources"].get(f"DOI:{row['doi']}")


def apply_edits(table: dict, edits: dict) -> int:
    """Apply the user's edits ({row_id: {column: value}}). All-or-nothing."""
    if not isinstance(edits, dict):
        raise RowError('edits must be a JSON object like {"R001": {"verified": "yes"}}')
    by_id = {r["row_id"]: r for r in table["rows"]}
    errors = []
    for rid, changes in edits.items():
        row = by_id.get(rid)
        if row is None:
            errors.append(f"{rid}: no such row")
            continue
        if not isinstance(changes, dict):
            errors.append(f"{rid}: changes must be an object")
            continue
        bad_cols = [c for c in changes if c not in EDITABLE]
        if bad_cols:
            errors += [f"{rid}: column '{c}' cannot be edited here" for c in bad_cols]
            continue
        final = {**row, **{k: "" if v is None else str(v) for k, v in changes.items()}}
        if final["verdict"] not in VERDICTS:
            errors.append(f"{rid}: verdict must be one of {VERDICTS}")
        elif final["verdict"] == "not found":
            if row["verdict"] != "not found":
                errors.append(f"{rid}: a cited row cannot become 'not found'; delete it in Excel "
                              "or record a separate not-found search")
        else:
            error = _cited_row_problem(table, rid, final)
            if error:
                errors.append(error)
    if errors:
        raise RowError("edits rejected, nothing saved:\n" + "\n".join(errors))
    for rid, changes in edits.items():
        by_id[rid].update({k: "" if v is None else str(v) for k, v in changes.items()})
    return len(edits)


def _cited_row_problem(table, rid, row):
    if not (row.get("pmid") or row.get("doi")):
        return f"{rid}: a {row['verdict']} row needs a PMID or DOI"
    if not row.get("passage", "").strip():
        return f"{rid}: a {row['verdict']} row needs a verbatim passage"
    src = _source_for(table, row)
    if src is None:
        return f"{rid}: no stored source text for this PMID/DOI; run fetch or import-nbib first"
    if src["status"] != TRANSCRIBED:
        problem = find_problem(src["text"], row["passage"])
        if problem:
            return f"{rid}: {problem}"
    return None


def revalidate(table: dict) -> list[str]:
    """Rows whose passage is no longer verbatim in the stored source (e.g. edited in Excel)."""
    bad = []
    for row in table["rows"]:
        if row["verdict"] == "not found" or not row["passage"]:
            continue
        src = _source_for(table, row)
        if src is None or (src["status"] != TRANSCRIBED and find_problem(src["text"], row["passage"])):
            bad.append(row["row_id"])
    return bad
