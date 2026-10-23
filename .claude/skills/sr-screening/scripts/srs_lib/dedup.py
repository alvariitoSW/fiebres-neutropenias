"""Import parsed records into the project, flagging duplicates."""
import re

from srs_lib import state


def _norm_title(title):
    return " ".join(re.sub(r"[^a-z0-9 ]", " ", (title or "").lower()).split())


def _surname(authors):
    if not authors:
        return ""
    first = authors[0].strip()
    name = first.split(",")[0] if "," in first else first.split(" ")[0]
    return name.strip().lower()


def _keys(r):
    keys = []
    if r.get("doi"):
        keys.append("doi:" + r["doi"])
    if r.get("pmid"):
        keys.append("pmid:" + r["pmid"])
    year, surname = r.get("year"), _surname(r.get("authors"))
    # Without year or author a title alone ("Erratum", "Reply") is too weak to merge on.
    if year or surname:
        keys.append(f"tya:{_norm_title(r['title'])}|{year}|{surname}")
    return keys


def import_records(project: dict, records: list[dict], source_file: str, db: str,
                   content_hash: str | None = None) -> dict:
    if content_hash and any(i.get("sha256") == content_hash for i in project["imports"]):
        return {"added": 0, "duplicates": 0, "already_imported": True}

    index = {}
    for rid, r in project["records"].items():
        if not r["duplicate_of"]:
            for k in _keys(r):
                index.setdefault(k, rid)

    added = dups = 0
    for r in records:
        rid = f"R{len(project['records']) + 1:04d}"
        original = next((index[k] for k in _keys(r) if k in index), None)
        record = dict(r, id=rid, duplicate_of=original,
                      stage="duplicate" if original else "ta", decisions=[])
        project["records"][rid] = record
        if original:
            dups += 1
        else:
            added += 1
            for k in _keys(record):
                index.setdefault(k, rid)

    project["imports"].append({"file": source_file, "db": db, "sha256": content_hash,
                               "records": len(records), "added": added, "duplicates": dups})
    state.log(project, "import", {"file": source_file, "db": db, "added": added, "duplicates": dups})
    return {"added": added, "duplicates": dups, "already_imported": False}
