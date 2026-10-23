"""Parse database exports (PubMed nbib, RIS, CSV) into plain record dicts."""
import csv
import io
import os
import re

RIS_TAGS = {
    "title": ("TI", "T1"),
    "abstract": ("AB", "N2"),
    "authors": ("AU", "A1"),
    "year": ("PY", "Y1", "DA"),
    "journal": ("JO", "JF", "T2"),
    "doi": ("DO",),
}
# RIS "AN" is an accession number; it is a PMID only for these databases.
PMID_AN_DBS = {"pubmed", "medline", "central", "cochrane"}

CSV_ALIASES = {
    "title": ("title",),
    "abstract": ("abstract",),
    "authors": ("authors", "author"),
    "year": ("year", "publication year"),
    "doi": ("doi",),
    "pmid": ("pmid", "pubmed id"),
    "journal": ("journal", "source", "source title"),
    "pub_types": ("publication type", "publication types", "document type"),
}


class ParseError(Exception):
    pass


def parse_file(path: str, db: str) -> list[dict]:
    name = os.path.basename(path)
    text = _read_text(path)
    stripped = text.lstrip()
    if re.match(r"PMID- ", stripped):
        records = _parse_nbib(text)
    elif re.match(r"TY  -", stripped):
        records = _parse_ris(text, db)
    else:
        records = _parse_csv(text, name)
    if not records:
        raise ParseError(f"{name}: no records found")
    for i, r in enumerate(records, 1):
        if not r["title"]:
            raise ParseError(f"{name}: record {i} has no title")
        r["source_file"] = name
        r["db"] = db
    return records


def _read_text(path):
    try:
        with open(path, "rb") as f:
            raw = f.read()
    except OSError as e:
        raise ParseError(f"{os.path.basename(path)}: cannot open file ({e.strerror})")
    try:
        return raw.decode("utf-8-sig")
    except UnicodeDecodeError:
        return raw.decode("latin-1")


def _record(**kw):
    r = {"title": "", "abstract": None, "authors": [], "year": None,
         "journal": None, "doi": None, "pmid": None, "pub_types": []}
    r.update(kw)
    return r


def _clean_doi(value):
    if not value:
        return None
    value = re.sub(r"^(https?://)?(dx\.)?doi\.org/", "", value.strip(), flags=re.I)
    value = value.split()[0] if value else ""
    return value.lower() or None


def _year(value):
    m = re.search(r"(1[89]|20)\d\d", value or "")
    return int(m.group(0)) if m else None


def _tagged_lines(text, tag_re, loose=False):
    """Yield (tag, value) pairs, joining continuation lines.

    nbib continuations are indented; RIS exports (loose=True) often wrap without indent.
    """
    current = None
    for line in text.splitlines():
        m = tag_re.match(line)
        if m:
            if current:
                yield current
            current = [m.group(1), m.group(2).strip()]
        elif current and line.strip() and (loose or line.startswith("      ")):
            current[1] += " " + line.strip()
        elif not line.strip():
            if current:
                yield current
            current = None
            yield ("", "")
    if current:
        yield current


def _parse_nbib(text):
    records, fields = [], {}

    def flush():
        if fields:
            doi = next((v[:-6] for v in fields.get("LID", []) + fields.get("AID", [])
                        if v.endswith(" [doi]")), None)
            records.append(_record(
                title=" ".join(fields.get("TI", [])),
                abstract=" ".join(fields.get("AB", [])) or None,
                authors=fields.get("FAU") or fields.get("AU", []),
                year=_year(" ".join(fields.get("DP", []))),
                journal=(fields.get("JT") or [None])[0],
                doi=_clean_doi(doi),
                pmid=(fields.get("PMID") or [None])[0],
                pub_types=fields.get("PT", []),
            ))

    for tag, value in _tagged_lines(text, re.compile(r"^([A-Z]{2,4})\s*- (.*)$")):
        if tag == "PMID" and fields:
            flush()
            fields = {}
        if tag:
            fields.setdefault(tag, []).append(value)
    flush()
    return records


def _parse_ris(text, db):
    records, fields = [], {}
    for tag, value in _tagged_lines(text, re.compile(r"^([A-Z][A-Z0-9])  - ?(.*)$"), loose=True):
        if tag == "ER":
            records.append(_ris_record(fields, db))
            fields = {}
        elif tag:
            fields.setdefault(tag, []).append(value)
    if fields.get("TI") or fields.get("T1"):
        records.append(_ris_record(fields, db))
    return records


def _ris_record(fields, db):
    def first(key):
        for tag in RIS_TAGS[key]:
            if fields.get(tag):
                return fields[tag][0]
        return None

    authors = next((fields[t] for t in RIS_TAGS["authors"] if fields.get(t)), [])
    an = (fields.get("AN") or [None])[0]
    pmid = an if an and an.isdigit() and db.lower() in PMID_AN_DBS else None
    return _record(
        title=first("title") or "",
        abstract=first("abstract"),
        authors=list(authors),
        year=_year(first("year")),
        journal=first("journal"),
        doi=_clean_doi(first("doi")),
        pmid=pmid,
    )


def _parse_csv(text, name):
    try:
        first_line = text.split("\n", 1)[0]
        delimiter = ";" if first_line.count(";") > first_line.count(",") else ","
        rows = list(csv.DictReader(io.StringIO(text), delimiter=delimiter))
    except csv.Error as e:
        raise ParseError(f"{name}: not a valid CSV ({e})")
    if not rows:
        raise ParseError(f"{name}: no records found")
    header = {h.strip().lower(): h for h in rows[0].keys() if h}
    cols = {k: next((header[a] for a in aliases if a in header), None)
            for k, aliases in CSV_ALIASES.items()}
    if not cols["title"]:
        raise ParseError(
            f"{name}: unrecognized format (expected PubMed .nbib, RIS, or CSV with a 'Title' column)")
    records = []
    for row in rows:
        def get(key):
            col = cols[key]
            value = (row.get(col) or "").strip() if col else ""
            return value or None
        authors = [a.strip() for a in re.split(r";", get("authors") or "") if a.strip()]
        records.append(_record(
            title=get("title") or "",
            abstract=get("abstract"),
            authors=authors,
            year=_year(get("year")),
            journal=get("journal"),
            doi=_clean_doi(get("doi")),
            pmid=get("pmid"),
            pub_types=[t.strip() for t in (get("pub_types") or "").split(";") if t.strip()],
        ))
    return records
