"""Screening: the model proposes, the human approves. Nothing moves stage without approval."""
import re

from srs_lib import state

PROPOSALS = ("include", "exclude", "uncertain")
CONFIDENCE = ("high", "medium", "low")
CRITERION_VALUES = ("meets", "fails", "unclear")
NEXT_STAGE = {"ta": "ft", "ft": "included"}


class ScreenError(Exception):
    pass


def _current(record, stage):
    """The latest decision for this stage, or None."""
    for d in reversed(record["decisions"]):
        if d["stage"] == stage:
            return d
    return None


def next_batch(project: dict, stage: str, size: int = 50) -> list[dict]:
    batch = []
    for rid in sorted(project["records"]):
        r = project["records"][rid]
        if r["stage"] == stage and _current(r, stage) is None:
            batch.append({"id": rid, "title": r["title"], "abstract": r["abstract"],
                          "year": r["year"], "journal": r["journal"],
                          "pub_types": r.get("pub_types") or [],
                          "no_abstract": not r["abstract"]})
            if len(batch) == size:
                break
    return batch


def _validate(project, stage, d):
    rid = d.get("id")
    r = project["records"].get(rid)
    if r is None:
        return f"{rid}: unknown record id"
    if r["stage"] != stage:
        return f"{rid}: record is in stage '{r['stage']}', not '{stage}'"
    if d.get("proposal") not in PROPOSALS:
        return f"{rid}: proposal must be one of {PROPOSALS}"
    if d.get("confidence") not in CONFIDENCE:
        return f"{rid}: confidence must be one of {CONFIDENCE}"
    criteria = d.get("criteria")
    if not isinstance(criteria, dict) or not criteria or \
            any(v not in CRITERION_VALUES for v in criteria.values()):
        return f"{rid}: criteria must map each criterion to one of {CRITERION_VALUES}"
    if not (d.get("reason") or "").strip():
        return f"{rid}: reason is required"
    if d["proposal"] == "exclude" and not (d.get("failed_criterion") or "").strip():
        return f"{rid}: an exclusion proposal needs failed_criterion"
    return _fact_error(rid, r, d)


def _fact_error(rid, r, d):
    for flag in ("design_match", "outcome_match"):
        if d.get(flag) not in (True, False, None):
            return f"{rid}: {flag} must be true, false or null"
    evidence = d.get("evidence") or []
    if not isinstance(evidence, list) or not all(isinstance(e, str) and e.strip() for e in evidence):
        return f"{rid}: evidence must be a list of quotes"
    source = _squash((r["title"] or "") + " " + (r["abstract"] or ""))
    invented = [e for e in evidence if _squash(e) not in source]
    if invented:
        return f"{rid}: evidence not found verbatim in title/abstract: " + " | ".join(invented)
    context = [e for e in evidence if _section_of(r["abstract"] or "", e) in CONTEXT_SECTIONS]
    if context:
        return (f"{rid}: evidence comes from the BACKGROUND/INTRODUCTION of the abstract, which describes "
                "the disease, not what this study did; quote the methods/outcomes/results instead: "
                + " | ".join(context))
    return None


CONTEXT_SECTIONS = {"BACKGROUND", "INTRODUCTION", "CONTEXT", "RATIONALE", "AIMS AND BACKGROUND"}
SECTION_RE = re.compile(r"\b([A-Z][A-Z ]{2,30}[A-Z]):")


def _section_of(abstract, quote):
    """Label of the structured-abstract section containing the quote, or None."""
    pos = _squash(abstract).find(_squash(quote))
    if pos < 0:
        return None
    labels = [(m.start(), m.group(1).strip()) for m in SECTION_RE.finditer(" ".join(abstract.split()))]
    before = [label for start, label in labels if start <= pos]
    return before[-1] if before else None


def validate_facts(project: dict, facts: dict) -> None:
    """Check AI-extracted facts (design_match, outcome_match, evidence) for the calibration sheet."""
    if not isinstance(facts, dict):
        raise ScreenError('facts file must be a JSON object like {"R0001": {"design_match": true}}')
    errors = []
    for rid, f in facts.items():
        r = project["records"].get(rid)
        if r is None:
            errors.append(f"{rid}: unknown record id")
        elif not isinstance(f, dict):
            errors.append(f"{rid}: must be an object")
        else:
            e = _fact_error(rid, r, f)
            if e:
                errors.append(e)
    if errors:
        raise ScreenError("facts rejected:\n" + "\n".join(errors))


def _squash(text):
    return " ".join(text.split()).lower()


def record_decisions(project: dict, stage: str, decisions: list[dict]) -> None:
    if not isinstance(decisions, list) or not all(isinstance(d, dict) for d in decisions):
        raise ScreenError("decisions file must be a JSON list of objects, one per record")
    errors = [e for e in (_validate(project, stage, d) for d in decisions) if e]
    seen, repeated = set(), set()
    for d in decisions:
        (repeated if d.get("id") in seen else seen).add(d.get("id"))
    errors += [f"{rid}: appears more than once in this file" for rid in sorted(repeated, key=str)]
    if errors:
        raise ScreenError("decisions rejected, nothing saved:\n" + "\n".join(errors))
    for d in decisions:
        r = project["records"][d["id"]]
        r["decisions"] = [x for x in r["decisions"]
                          if not (x["stage"] == stage and x["status"] == "proposed")]
        r["decisions"].append({
            "stage": stage, "criteria": d["criteria"], "proposal": d["proposal"],
            "failed_criterion": d.get("failed_criterion"), "reason": d["reason"].strip(),
            "confidence": d["confidence"], "design_match": d.get("design_match"),
            "outcome_match": d.get("outcome_match"), "evidence": d.get("evidence") or [],
            "engine": "model", "status": "proposed",
            "human_decision": None, "note": None,
        })
    state.log(project, "record", {"stage": stage, "n": len(decisions)})


def _pending(project, stage):
    for rid in sorted(project["records"]):
        r = project["records"][rid]
        d = _current(r, stage) if r["stage"] == stage else None
        if d and d["status"] == "proposed":
            yield rid, r, d


def pending_review(project: dict, stage: str) -> dict:
    out = {"exclude": {}, "uncertain": [], "include": []}
    for rid, r, d in _pending(project, stage):
        item = {"id": rid, "title": r["title"], "reason": d["reason"],
                "confidence_self_rated": d["confidence"], "criteria": d["criteria"],
                "abstract": r["abstract"], "year": r["year"], "journal": r["journal"],
                "design_match": d.get("design_match"), "outcome_match": d.get("outcome_match"),
                "pub_types": r.get("pub_types") or [],
                "evidence": d.get("evidence") or []}
        if d["proposal"] == "exclude":
            out["exclude"].setdefault(d["failed_criterion"], []).append(item)
        else:
            out[d["proposal"]].append(item)
    return out


def approve(project: dict, stage: str, ids, human_decision: str, note: str | None = None) -> int:
    if human_decision not in ("include", "exclude"):
        raise ScreenError("human decision must be include or exclude")
    pending = {rid: (r, d) for rid, r, d in _pending(project, stage)}
    if ids in ("all-exclude", "all-include"):
        wanted = ids.split("-")[1]
        if wanted != human_decision:
            raise ScreenError(f"{ids} can only be approved as {wanted}")
        targets = [rid for rid, (_, d) in pending.items() if d["proposal"] == wanted]
    else:
        unknown = [rid for rid in ids if rid not in pending]
        if unknown:
            raise ScreenError("no pending proposal for: " + ", ".join(unknown))
        targets = list(ids)
    overrides = [rid for rid in targets if human_decision == "exclude"
                 and pending[rid][1]["proposal"] != "exclude"]
    if overrides and not (note or "").strip():
        raise ScreenError("excluding records the model did not propose to exclude needs a note "
                          "with the reason: " + ", ".join(overrides))
    for rid in targets:
        r, d = pending[rid]
        d["status"] = "approved"
        d["human_decision"] = human_decision
        d["note"] = note
        r["stage"] = NEXT_STAGE[stage] if human_decision == "include" else "excluded"
    state.log(project, "approve", {"stage": stage, "ids": targets, "as": human_decision,
                                   "note": note})
    return len(targets)


def _human_labels(human):
    if not isinstance(human, dict):
        raise ScreenError('calibration file must be a JSON object like {"R0001": "include"}')
    human = {rid: str(v).strip().lower() for rid, v in human.items()}
    bad = [rid for rid, v in human.items() if v not in ("include", "exclude")]
    if bad:
        raise ScreenError("labels must be include or exclude: " + ", ".join(sorted(bad)))
    return human


def apply_calibration(project: dict, human: dict) -> dict:
    """Apply the user's blind decisions where the AI proposed the same; return the rest."""
    human = _human_labels(human)
    pending = {rid: d for rid, _, d in _pending(project, "ta")}
    missing = [rid for rid in human if rid not in pending]
    if missing:
        raise ScreenError("no pending AI proposal for: " + ", ".join(sorted(missing)))
    agreed = [rid for rid in sorted(human) if pending[rid]["proposal"] == human[rid]]
    for rid in agreed:
        approve(project, "ta", [rid], human[rid], "blind calibration decision by the user")
    return {"applied": len(agreed),
            "disagreements": [rid for rid in sorted(human) if rid not in agreed]}


def calibration(project: dict, human: dict) -> dict:
    human = _human_labels(human)
    n = agree = human_inc = caught = 0
    missed = []
    for rid in sorted(human):
        r = project["records"].get(rid)
        d = _current(r, "ta") if r else None
        if d is None:
            raise ScreenError(f"{rid}: no model decision to compare with")
        model_inc = d["proposal"] != "exclude"
        human_says = human[rid] == "include"
        n += 1
        agree += model_inc == human_says
        if human_says:
            human_inc += 1
            if model_inc:
                caught += 1
            else:
                missed.append(rid)
    result = {"n": n, "agreement": round(agree / n, 3) if n else None,
              "sensitivity": round(caught / human_inc, 3) if human_inc else None,
              "missed_includes": missed}
    project["calibration"] = result
    state.log(project, "calibration", result)
    return result


def apply_review(project: dict, stage: str, answers: dict) -> int:
    """Apply the user's per-record decisions from the review sheet. All-or-nothing."""
    if not isinstance(answers, dict):
        raise ScreenError('review file must be a JSON object like {"R0001": {"decision": "exclude"}}')
    pending = {rid: d for rid, _, d in _pending(project, stage)}
    errors = []
    for rid, a in answers.items():
        a = a if isinstance(a, dict) else {}
        if rid not in pending:
            errors.append(f"{rid}: no pending proposal in stage {stage}")
        elif a.get("decision") not in ("include", "exclude"):
            errors.append(f"{rid}: decision must be include or exclude")
        elif a["decision"] == "exclude" and pending[rid]["proposal"] != "exclude" \
                and not (a.get("note") or "").strip():
            errors.append(f"{rid}: excluding a record the AI did not propose to exclude needs a note")
    if errors:
        raise ScreenError("review rejected, nothing saved:\n" + "\n".join(errors))
    for rid, a in answers.items():
        approve(project, stage, [rid], a["decision"], (a.get("note") or "").strip() or None)
    return len(answers)
