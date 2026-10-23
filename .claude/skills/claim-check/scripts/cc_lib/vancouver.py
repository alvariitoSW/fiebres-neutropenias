"""Vancouver (ICMJE/NLM) reference strings built from PubMed metadata."""


def _end(text: str) -> str:
    text = (text or "").strip()
    return text if not text or text[-1] in ".?!" else text + "."


def vancouver(meta: dict) -> str:
    authors = list(meta.get("authors") or [])
    names = ", ".join(authors[:6]) + (", et al." if len(authors) > 6 else "")
    parts = [_end(names)] if names else []
    parts.append(_end(meta.get("title")))
    if meta.get("journal_abbrev"):
        parts.append(_end(meta["journal_abbrev"]))
    source = str(meta.get("year") or "")
    if meta.get("volume"):
        source += f";{meta['volume']}"
        if meta.get("issue"):
            source += f"({meta['issue']})"
        if meta.get("pages"):
            source += f":{meta['pages']}"
    if source:
        parts.append(source + ".")
    if meta.get("doi"):
        parts.append(f"doi:{meta['doi']}")
    return " ".join(p for p in parts if p)
