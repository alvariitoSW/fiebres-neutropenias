# Building and running the search

## Building blocks
1. Split the question into concepts — usually P and I (sometimes design). Do not search for outcomes; they are poorly reported in abstracts.
2. For each concept combine **controlled vocabulary** (MeSH in PubMed, Emtree in Embase) with **free-text synonyms** in title/abstract.
3. Join synonyms within a concept with `OR`; join concepts with `AND`.
4. Add a validated study-design filter if appropriate (e.g. Cochrane Highly Sensitive Search Strategy for RCTs).
5. Avoid `NOT` unless you are sure; it silently drops relevant records.

## Syntax per database
| | PubMed | Embase.com | Cochrane CENTRAL |
|---|---|---|---|
| Controlled term | `"Myocardial Infarction"[Mesh]` | `'myocardial infarction'/exp` | `[mh "Myocardial Infarction"]` |
| Title/abstract | `stemi[tiab]` | `stemi:ti,ab` | `stemi:ti,ab` |
| Truncation | `revasculari*[tiab]` | `revasculari*:ti,ab` | `revasculari*:ti,ab` |
| Phrase | `"culprit only"[tiab]` | `'culprit only':ti,ab` | `"culprit only":ti,ab` |
| Proximity | `"complete revascularization"[tiab:~3]` | `complete NEAR/3 revasculari*` | `complete NEAR/3 revasculari*` |

## Running and exporting
Record the **date** each search was run and the **exact string** used (PRISMA-S).
- **PubMed:** paste the string, Search → Save → Selection: All results → Format: **PubMed** → Create file (.nbib). Up to 10,000 records per export.
- **Embase.com:** paste in Advanced search → select all results → Export → **RIS** format, include abstracts.
- **Cochrane Library:** Advanced search → Search manager → run → select Trials (CENTRAL) → Export selected → **RIS**, include abstract.
- **Others (Scopus, Web of Science, LILACS):** export as RIS or CSV with title, authors, year, DOI and abstract.

Upload all files. Duplicates across databases are removed automatically and counted for PRISMA.
