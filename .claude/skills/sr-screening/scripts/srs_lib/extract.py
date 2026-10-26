"""Data extraction: every value needs page + verbatim quote, or an explicit status."""

DEFAULT_FIELDS = [
    "study_design", "country", "n_per_arm", "population", "intervention",
    "comparator", "outcomes", "follow_up", "effect_estimate_ci",
]
STATUSES = ("not_reported", "manual_extraction_required")


class ExtractError(Exception):
    pass


def _check(field, v):
    if not isinstance(v, dict):
        return f"{field}: must be an object"
    if "status" in v:
        return None if v["status"] in STATUSES else f"{field}: status must be one of {STATUSES}"
    for key in ("value", "page", "quote"):
        if not str(v.get(key) or "").strip():
            return f"{field}: {key} is required (or use status not_reported / manual_extraction_required)"
    return None


def record_extraction(project: dict, record_id: str, values: dict) -> None:
    from srs_lib import state
    r = project["records"].get(record_id)
    if r is None or r["stage"] != "included":
        raise ExtractError(f"{record_id}: only included records can be extracted")
    errors = [f"{f}: missing" for f in project["extraction_fields"] if f not in values]
    errors += [e for e in (_check(f, values[f]) for f in project["extraction_fields"]
                           if f in values) if e]
    if errors:
        raise ExtractError(f"{record_id}: extraction rejected, nothing saved:\n" + "\n".join(errors))
    project["extraction"] = [e for e in project["extraction"] if e["record_id"] != record_id]
    project["extraction"].append({"record_id": record_id,
                                  "values": {f: values[f] for f in project["extraction_fields"]}})
    state.log(project, "extract", {"id": record_id})
