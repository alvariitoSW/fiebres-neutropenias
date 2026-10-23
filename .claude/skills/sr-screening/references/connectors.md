# Optional connectors (use only if the user has them enabled)

Connectors return results into the conversation, not into files. **Never transcribe bulk search results from a connector into the project**: with hundreds of records, transcription errors and invented abstracts become likely, and usage doubles. Bulk records always come from the user's database exports.

## PubMed
- **Refine the query (step 2):** run the draft string with `max_results` small; show the user `total_count` and `query_translation` (how PubMed mapped each term). Adjust together, then the user runs and exports the final string on the PubMed site. Note: the connector does not accept the `*` truncation wildcard — test the string without it or with explicit variants; the user's final export on the website may use `*`.
- **Full texts (steps 7–9):** for included records with a PMID, check for a PubMed Central version (`find_related_articles` with `link_type: pubmed_pmc`, or the `pmc` id in metadata) and read it with `get_full_text_article`. Ask the user to upload PDFs only for the rest. PMC text has no page numbers: in extraction, put the section in `page` (e.g. `"PMC: Results, Table 2"`). Supplementary material may be missing — mark `manual_extraction_required` when needed.
- **Missed studies check (after full-text screening):** run `find_related_articles` on the included PMIDs; list candidates not already in the project for the user. Any the user wants to add must come in as a new PubMed export/import (so they are counted in PRISMA as "other methods").
- **Metadata check:** confirm DOI/year/journal of included studies with `get_article_metadata`.

## ClinicalTrials.gov
- **Registry search (recommended by Cochrane):** after the database search, search the registry with the PICO terms; show registered trials (completed, terminated, with or without results) that match. Trials without a publication are reported in PRISMA under "other sources"; tell the user they may contact investigators.
- **Extraction support:** for included trials, compare the registered primary outcome with the published one and flag discrepancies (outcome switching) to the user.
- Registry data are not peer-reviewed publications; label any value taken from a registry as such (`page`: `"ClinicalTrials.gov NCTxxxxxxxx, Results section"`).

## medRxiv / bioRxiv
- Optional grey-literature search for very recent evidence. Always label preprints as **not peer-reviewed**, and ask the user whether their protocol includes preprints before screening any.

Always cite the source (PubMed, ClinicalTrials.gov, medRxiv) and the identifier for anything taken from a connector.
