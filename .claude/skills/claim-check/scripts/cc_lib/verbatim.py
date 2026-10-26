"""Verbatim checks: a passage must be literally in the source and not from its background."""
import re

CONTEXT_SECTIONS = {"BACKGROUND", "INTRODUCTION", "CONTEXT", "RATIONALE", "AIMS AND BACKGROUND"}
SECTION_RE = re.compile(r"\b([A-Z][A-Z /-]{2,40}[A-Z]):")


def squash(text: str) -> str:
    return " ".join((text or "").split()).lower()


def section_of(source: str, passage: str) -> str | None:
    """Label of the section (structured abstract or full text) containing the passage."""
    pos = squash(source).find(squash(passage))
    if pos < 0:
        return None
    flat = " ".join(source.split())
    labels = [(m.start(), m.group(1).strip()) for m in SECTION_RE.finditer(flat)]
    before = [label for start, label in labels if start <= pos]
    return before[-1] if before else None


def find_problem(source: str, passage: str) -> str | None:
    if not (passage or "").strip():
        return "passage is empty"
    if squash(passage) not in squash(source):
        return "passage not found verbatim in the source text"
    if section_of(source, passage) in CONTEXT_SECTIONS:
        return ("passage comes from the BACKGROUND/INTRODUCTION, which describes prior knowledge, "
                "not this study's findings; quote the methods/results/conclusions instead")
    return None
