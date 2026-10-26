"""PubMed/PMC access: parse MEDLINE (.nbib) text and fetch records by id."""
import re
import urllib.error
import urllib.request
import xml.etree.ElementTree as ET

EUTILS = "https://eutils.ncbi.nlm.nih.gov/entrez/eutils/efetch.fcgi"
TIMEOUT = 20


class FetchError(Exception):
    pass


def _fields(block):
    fields, current = {}, None
    for line in block.splitlines():
        m = re.match(r"^([A-Z]{2,4})\s*- (.*)$", line)
        if m:
            current = m.group(1)
            fields.setdefault(current, []).append(m.group(2).strip())
        elif current and line.startswith("      "):
            fields[current][-1] += " " + line.strip()
    return fields


def _first(fields, tag):
    return (fields.get(tag) or [None])[0]


def parse_nbib(text: str) -> list[dict]:
    records = []
    for block in re.split(r"\n\s*\n(?=PMID- )", text.strip()):
        f = _fields(block)
        if not f.get("PMID"):
            continue
        doi = next((v[:-6] for v in f.get("LID", []) + f.get("AID", []) if v.endswith(" [doi]")), None)
        year = re.search(r"\d{4}", _first(f, "DP") or "")
        records.append({
            "pmid": _first(f, "PMID"),
            "pmcid": _first(f, "PMC"),
            "doi": doi,
            "title": _first(f, "TI") or "",
            "abstract": " ".join(f.get("AB", [])) or None,
            "authors": f.get("AU", []) + f.get("CN", []),
            "journal_abbrev": _first(f, "TA"),
            "year": int(year.group(0)) if year else None,
            "volume": _first(f, "VI"),
            "issue": _first(f, "IP"),
            "pages": _first(f, "PG"),
            "pub_types": f.get("PT", []),
        })
    return records


def _get(url, urlopen):
    try:
        with urlopen(url, timeout=TIMEOUT) as resp:
            return resp.read()
    except (urllib.error.URLError, TimeoutError, OSError) as e:
        raise FetchError(f"no network access to PubMed from this environment ({e})")


def fetch_pubmed(pmids: list[str], urlopen=urllib.request.urlopen) -> list[dict]:
    ids = [p.strip() for p in pmids if p.strip()]
    bad = [p for p in ids if not p.isdigit()]
    if bad or not ids:
        raise FetchError("PMIDs must be digits only: " + ", ".join(bad or ["(none given)"]))
    ids = ",".join(ids)
    raw = _get(f"{EUTILS}?db=pubmed&id={ids}&rettype=medline&retmode=text", urlopen)
    return parse_nbib(raw.decode("utf-8", "replace"))


def _text(el):
    return " ".join("".join(el.itertext()).split())


def fetch_pmc(pmcid: str, urlopen=urllib.request.urlopen) -> str:
    """Full text of an open-access PMC article as plain text with 'SECTION TITLE:' labels."""
    number = (pmcid or "").strip().upper().replace("PMC", "")
    if not number.isdigit():
        raise FetchError(f"invalid PMC id: {pmcid}")
    raw = _get(f"{EUTILS}?db=pmc&id={number}&rettype=xml", urlopen)
    try:
        root = ET.fromstring(raw)
    except ET.ParseError:
        raise FetchError(f"{pmcid}: PubMed Central returned an unreadable response")
    if root.find(".//error") is not None or root.find(".//body") is None:
        raise FetchError(f"{pmcid}: full text not available in PubMed Central")
    parts = []
    abstract = root.find(".//abstract")
    if abstract is not None:
        parts.append("ABSTRACT: " + _text(abstract))
    for sec in root.find(".//body").iter("sec"):
        title = sec.find("title")
        paras = [_text(p) for p in sec.findall("p")]
        if paras:
            label = _text(title).upper() if title is not None else "SECTION"
            parts.append(f"{label}: " + " ".join(paras))
    return "\n".join(parts)
