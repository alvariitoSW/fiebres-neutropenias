"""Project state: one JSON file holding protocol, records, decisions and log."""
import json
import os
import tempfile
from datetime import datetime, timezone

SCHEMA_VERSION = 1
REQUIRED_PROTOCOL_KEYS = [
    "population", "intervention", "comparator", "outcomes",
    "study_designs", "inclusion", "exclusion",
]


class StateError(Exception):
    pass


def new_project(protocol: dict) -> dict:
    missing = [k for k in REQUIRED_PROTOCOL_KEYS if not protocol.get(k)]
    if missing:
        raise StateError("protocol is missing: " + ", ".join(missing))
    from srs_lib.extract import DEFAULT_FIELDS
    return {
        "schema_version": SCHEMA_VERSION,
        "protocol": protocol,
        "imports": [],
        "records": {},
        "calibration": None,
        "extraction_fields": list(protocol.get("extraction_fields") or DEFAULT_FIELDS),
        "extraction": [],
        "log": [],
    }


def load(path: str) -> dict:
    try:
        with open(path, encoding="utf-8") as f:
            project = json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        raise StateError(f"cannot read project file {path}: {e}")
    version = project.get("schema_version")
    if version != SCHEMA_VERSION:
        raise StateError(
            f"project file {path} has schema_version {version}; this skill expects {SCHEMA_VERSION}")
    return project


def save(project: dict, path: str) -> None:
    directory = os.path.dirname(os.path.abspath(path))
    fd, tmp = tempfile.mkstemp(dir=directory, suffix=".tmp")
    try:
        with os.fdopen(fd, "w", encoding="utf-8") as f:
            json.dump(project, f, ensure_ascii=False, indent=1)
            f.flush()
            os.fsync(f.fileno())
        os.replace(tmp, path)
    except BaseException:
        if os.path.exists(tmp):
            os.remove(tmp)
        raise


def log(project: dict, action: str, detail: dict) -> None:
    project["log"].append({
        "time": datetime.now(timezone.utc).isoformat(timespec="seconds"),
        "action": action,
        "detail": detail,
    })
