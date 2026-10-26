#!/usr/bin/env python3
"""srs: deterministic helper for the sr-screening skill.

Claude makes every judgment; this tool only stores, validates and exports.
Run `python srs.py <command> --help` for details.
"""
import argparse
import hashlib
import json
import os
import sys

sys.path.insert(0, os.path.dirname(os.path.abspath(__file__)))

from srs_lib import state  # noqa: E402
from srs_lib.dedup import import_records  # noqa: E402
from srs_lib.export import export_all, prisma_counts  # noqa: E402
from srs_lib.extract import ExtractError, record_extraction  # noqa: E402
from srs_lib.parse import ParseError, parse_file  # noqa: E402
from srs_lib.sheet import calibration_sheet, review_sheet  # noqa: E402
from srs_lib.screen import (ScreenError, apply_calibration, apply_review, validate_facts, approve, calibration, next_batch,  # noqa: E402
                            pending_review, record_decisions)

ERRORS = (state.StateError, ParseError, ScreenError, ExtractError)


def _read_json(path):
    try:
        with open(path, encoding="utf-8") as f:
            return json.load(f)
    except (OSError, json.JSONDecodeError) as e:
        raise state.StateError(f"cannot read JSON file {path}: {e}")


def cmd_init(a):
    if os.path.exists(a.project):
        raise state.StateError(f"{a.project} already exists; refusing to overwrite it")
    state.save(state.new_project(_read_json(a.protocol)), a.project)
    print(f"Created {a.project}.")


def cmd_import(a, p):
    with open(a.file, "rb") as f:
        digest = hashlib.sha256(f.read()).hexdigest()
    records = parse_file(a.file, a.db)
    res = import_records(p, records, os.path.basename(a.file), a.db, content_hash=digest)
    if res["already_imported"]:
        print(f"{a.file} was already imported; nothing changed.")
    else:
        print(f"{a.db}: {len(records)} records read, {res['added']} new, "
              f"{res['duplicates']} duplicate(s) removed.")
    return True


def cmd_status(a, p):
    c = prisma_counts(p)
    stages = {}
    for r in p["records"].values():
        stages[r["stage"]] = stages.get(r["stage"], 0) + 1
    print(json.dumps({"prisma": c, "records_by_stage": stages, "calibration": p["calibration"]},
                     indent=1))


def cmd_next_batch(a, p):
    print(json.dumps(next_batch(p, a.stage, a.size), indent=1, ensure_ascii=False))


def cmd_record(a, p):
    decisions = _read_json(a.file)
    record_decisions(p, a.stage, decisions)
    print(f"Recorded {len(decisions)} proposal(s). Nothing is excluded until you approve.")
    return True


def cmd_review(a, p):
    rev = pending_review(p, a.stage)
    for criterion, items in rev["exclude"].items():
        print(f"\nPROPOSED EXCLUSIONS - failed criterion: {criterion} ({len(items)})")
        for i in items:
            print(f"  {i['id']} [{i['confidence_self_rated']}] {i['title']}\n      reason: {i['reason']}")
    print(f"\nUNCERTAIN - you must decide each one ({len(rev['uncertain'])})")
    for i in rev["uncertain"]:
        print(f"  {i['id']} {i['title']}\n      reason: {i['reason']}")
    print(f"\nPROPOSED INCLUSIONS ({len(rev['include'])})")
    for i in rev["include"]:
        print(f"  {i['id']} [{i['confidence_self_rated']}] {i['title']}")
    print("\nConfidence is self-rated by the AI, not a calibrated probability.")


def cmd_approve(a, p):
    ids = "all-exclude" if a.all_exclude else "all-include" if a.all_include else \
        [x.strip() for x in a.ids.split(",") if x.strip()]
    n = approve(p, a.stage, ids, getattr(a, "as"), a.note)
    print(f"Approved {n} record(s) as {getattr(a, 'as')}.")
    return True


def cmd_calibration_sheet(a, p):
    batch = next_batch(p, "ta", a.size)
    facts = None
    if a.facts:
        facts = _read_json(a.facts)
        validate_facts(p, facts)
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(calibration_sheet(batch, p["protocol"].get("outcomes") or [], facts, _design_label(p)))
    print(f"Wrote {a.out} with {len(batch)} records. Show it to the user; do not screen these yourself first.")


def _design_label(p):
    designs = " ".join(p["protocol"].get("study_designs") or []).lower()
    return "RCT" if "random" in designs else "Design"


def cmd_review_sheet(a, p):
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(review_sheet(pending_review(p, a.stage), a.stage, design_label=_design_label(p)))
    print(f"Wrote {a.out}. Show it to the user as an interactive artifact.")


def cmd_apply_review(a, p):
    n = apply_review(p, a.stage, _read_json(a.file))
    print(f"Applied {n} decision(s).")
    return True


def cmd_apply_calibration(a, p):
    res = apply_calibration(p, _read_json(a.file))
    print(f"Applied {res['applied']} decision(s) where you and the AI agreed.")
    print("Disagreements to review: " + (", ".join(res["disagreements"]) or "none"))
    return True


def cmd_divergence_sheet(a, p):
    human = {k: str(v).strip().lower() for k, v in _read_json(a.file).items()}
    rev = pending_review(p, "ta")
    keep = lambda items: [i for i in items if i["id"] in human]  # noqa: E731
    rev = {"exclude": {k: keep(v) for k, v in rev["exclude"].items() if keep(v)},
           "uncertain": keep(rev["uncertain"]), "include": keep(rev["include"])}
    with open(a.out, "w", encoding="utf-8") as f:
        f.write(review_sheet(rev, "ta", preset=human, title="Where you and the AI disagree",
                             design_label=_design_label(p)))
    print(f"Wrote {a.out}. Show it as an interactive artifact; then apply-review --stage ta.")


def cmd_calibrate(a, p):
    print(json.dumps(calibration(p, _read_json(a.file)), indent=1))
    return True


def cmd_extract(a, p):
    record_extraction(p, a.id, _read_json(a.file))
    print(f"Saved extraction for {a.id}.")
    return True


def cmd_export(a, p):
    for path in export_all(p, a.out):
        print(path)


COMMANDS = {
    "import": cmd_import,
    "status": cmd_status,
    "next-batch": cmd_next_batch,
    "record": cmd_record,
    "review": cmd_review,
    "approve": cmd_approve,
    "calibration-sheet": cmd_calibration_sheet,
    "review-sheet": cmd_review_sheet,
    "apply-review": cmd_apply_review,
    "apply-calibration": cmd_apply_calibration,
    "divergence-sheet": cmd_divergence_sheet,
    "calibrate": cmd_calibrate,
    "extract": cmd_extract,
    "export": cmd_export,
}


def build_parser():
    ap = argparse.ArgumentParser(prog="srs.py", description=__doc__)
    ap.add_argument("--project", default="project.json")
    sub = ap.add_subparsers(dest="cmd", required=True)
    s = sub.add_parser("init"); s.add_argument("--protocol", required=True)
    s = sub.add_parser("import"); s.add_argument("file"); s.add_argument("--db", required=True)
    sub.add_parser("status")
    s = sub.add_parser("next-batch"); s.add_argument("--stage", choices=["ta", "ft"], required=True)
    s.add_argument("--size", type=int, default=50)
    s = sub.add_parser("record"); s.add_argument("--stage", choices=["ta", "ft"], required=True)
    s.add_argument("--file", required=True)
    s = sub.add_parser("review"); s.add_argument("--stage", choices=["ta", "ft"], required=True)
    s = sub.add_parser("approve"); s.add_argument("--stage", choices=["ta", "ft"], required=True)
    g = s.add_mutually_exclusive_group(required=True)
    g.add_argument("--ids"); g.add_argument("--all-exclude", action="store_true")
    g.add_argument("--all-include", action="store_true")
    s.add_argument("--as", choices=["include", "exclude"], required=True)
    s.add_argument("--note")
    s = sub.add_parser("review-sheet"); s.add_argument("--stage", choices=["ta", "ft"], required=True)
    s.add_argument("--out", required=True)
    s = sub.add_parser("apply-review"); s.add_argument("--stage", choices=["ta", "ft"], required=True)
    s.add_argument("--file", required=True)
    s = sub.add_parser("calibration-sheet"); s.add_argument("--size", type=int, default=40)
    s.add_argument("--facts")
    s.add_argument("--out", required=True)
    s = sub.add_parser("calibrate"); s.add_argument("--file", required=True)
    s = sub.add_parser("apply-calibration"); s.add_argument("--file", required=True)
    s = sub.add_parser("divergence-sheet"); s.add_argument("--file", required=True)
    s.add_argument("--out", required=True)
    s = sub.add_parser("extract"); s.add_argument("--id", required=True); s.add_argument("--file", required=True)
    s = sub.add_parser("export"); s.add_argument("--out", required=True)
    return ap


def main(argv=None):
    a = build_parser().parse_args(argv)
    try:
        if a.cmd == "init":
            cmd_init(a)
            return 0
        p = state.load(a.project)
        changed = COMMANDS[a.cmd](a, p)
        if changed:
            state.save(p, a.project)
    except ERRORS as e:
        print(f"ERROR: {e}", file=sys.stderr)
        return 1
    return 0


if __name__ == "__main__":
    sys.exit(main())
