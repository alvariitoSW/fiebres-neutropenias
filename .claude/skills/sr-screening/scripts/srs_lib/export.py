"""Outputs: PRISMA 2020 counts, extraction table, included RIS, full decision log."""
import csv
import os


def _approved(record, stage):
    for d in record["decisions"]:
        if d["stage"] == stage and d["status"] == "approved":
            return d
    return None


def _exclusion_reason(d):
    if d["proposal"] == "exclude" and d.get("failed_criterion"):
        return d["failed_criterion"]
    return "other: " + (d.get("note") or d.get("reason") or "")


def prisma_counts(project: dict) -> dict:
    per_db = {}
    for imp in project["imports"]:
        per_db[imp["db"]] = per_db.get(imp["db"], 0) + imp["records"]
    records = list(project["records"].values())
    unique = [r for r in records if not r["duplicate_of"]]
    excluded_ta = ft_assessed = 0
    ft_reasons = {}
    for r in unique:
        ta = _approved(r, "ta")
        if ta and ta["human_decision"] == "exclude":
            excluded_ta += 1
        elif ta:
            ft_assessed += 1
        ft = _approved(r, "ft")
        if ft and ft["human_decision"] == "exclude":
            reason = _exclusion_reason(ft)
            ft_reasons[reason] = ft_reasons.get(reason, 0) + 1
    return {
        "identified_per_db": per_db,
        "duplicates_removed": len(records) - len(unique),
        "screened": len(unique),
        "excluded_ta": excluded_ta,
        "ft_assessed": ft_assessed,
        "excluded_ft_by_reason": ft_reasons,
        "included": sum(r["stage"] == "included" for r in unique),
        "pending": sum(r["stage"] in ("ta", "ft") for r in unique),
    }


def _first_author(r):
    return r["authors"][0] if r["authors"] else ""


def _extraction_rows(project):
    fields = project["extraction_fields"]
    header = ["id", "first_author", "year", "title"]
    for f in fields:
        header += [f, f + "_page", f + "_quote"]
    rows = []
    for e in project["extraction"]:
        r = project["records"][e["record_id"]]
        row = [r["id"], _first_author(r), r["year"] or "", r["title"]]
        for f in fields:
            v = e["values"][f]
            if "status" in v:
                row += [v["status"], "", ""]
            else:
                row += [v["value"], v["page"], v["quote"]]
        rows.append(row)
    return header, rows


def _write_csv(path, header, rows):
    with open(path, "w", newline="", encoding="utf-8") as f:
        w = csv.writer(f)
        w.writerow(header)
        w.writerows(rows)


def _write_xlsx(path, header, rows):
    try:
        import openpyxl
    except ImportError:
        return False
    wb = openpyxl.Workbook()
    ws = wb.active
    ws.title = "extraction"
    ws.append(header)
    for row in rows:
        ws.append(row)
    wb.save(path)
    return True


def _write_ris(path, records):
    lines = []
    for r in records:
        lines.append("TY  - JOUR")
        lines.append("TI  - " + r["title"])
        lines += ["AU  - " + a for a in r["authors"]]
        if r["year"]:
            lines.append(f"PY  - {r['year']}")
        if r["journal"]:
            lines.append("JO  - " + r["journal"])
        if r["abstract"]:
            lines.append("AB  - " + r["abstract"])
        if r["doi"]:
            lines.append("DO  - " + r["doi"])
        if r["pmid"]:
            lines.append("AN  - " + r["pmid"])
        lines += ["ER  - ", ""]
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines))


def _write_log(path, project):
    header = ["id", "title", "stage", "proposal", "failed_criterion", "reason",
              "confidence_self_rated", "engine", "status", "human_decision", "note", "criteria"]
    rows = []
    for rid in sorted(project["records"]):
        r = project["records"][rid]
        for d in r["decisions"]:
            criteria = "; ".join(f"{k}={v}" for k, v in d["criteria"].items())
            rows.append([rid, r["title"], d["stage"], d["proposal"], d.get("failed_criterion") or "",
                         d["reason"], d["confidence"], d["engine"], d["status"],
                         d.get("human_decision") or "", d.get("note") or "", criteria])
    _write_csv(path, header, rows)


def _write_prisma(path, c):
    lines = ["# PRISMA 2020 flow counts", ""]
    if c["pending"]:
        lines += [f"**WARNING: {c['pending']} records are still undecided. "
                  "These counts are not final.**", ""]
    lines += ["| Step | n |", "|---|---|"]
    for db, n in c["identified_per_db"].items():
        lines.append(f"| Records identified: {db} | {n} |")
    lines += [
        f"| Duplicates removed | {c['duplicates_removed']} |",
        f"| Records screened (title/abstract) | {c['screened']} |",
        f"| Records excluded (title/abstract) | {c['excluded_ta']} |",
        f"| Full-text reports assessed | {c['ft_assessed']} |",
    ]
    for reason, n in c["excluded_ft_by_reason"].items():
        lines.append(f"| Full-text excluded: {reason} | {n} |")
    lines.append(f"| Studies included | {c['included']} |")
    lines += ["", "Model confidence in the decision log is self-rated by the AI, not a calibrated probability."]
    with open(path, "w", encoding="utf-8") as f:
        f.write("\n".join(lines) + "\n")


def export_all(project: dict, out_dir: str) -> list[str]:
    os.makedirs(out_dir, exist_ok=True)
    written = []
    header, rows = _extraction_rows(project)
    path = os.path.join(out_dir, "extraction.csv")
    _write_csv(path, header, rows)
    written.append(path)
    path = os.path.join(out_dir, "extraction.xlsx")
    if _write_xlsx(path, header, rows):
        written.append(path)
    path = os.path.join(out_dir, "included.ris")
    _write_ris(path, [r for r in project["records"].values() if r["stage"] == "included"])
    written.append(path)
    path = os.path.join(out_dir, "decision_log.csv")
    _write_log(path, project)
    written.append(path)
    path = os.path.join(out_dir, "prisma.md")
    _write_prisma(path, prisma_counts(project))
    written.append(path)
    return written
