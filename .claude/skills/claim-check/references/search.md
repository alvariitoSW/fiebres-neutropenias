# Turning a claim into a PubMed search

1. **Split the claim into 2–3 concepts.** "Exercise training reduces hospitalisation in HFpEF" → *exercise training* AND *HFpEF* (the outcome usually stays out of the query: it is badly indexed; you check it when reading).
2. **Each concept = MeSH OR free text.** `("Exercise Therapy"[Mesh] OR "exercise training"[tiab] OR "cardiac rehabilitation"[tiab])`.
3. **Narrow by design when the claim needs it:** `randomized controlled trial[pt]`, `meta-analysis[pt]`, `systematic review[pt]`. For mechanistic claims, do not filter by design.
4. **With the PubMed connector:** run the query with a small `max_results`, show the user the `total_count` and the `query_translation` (how PubMed mapped each term). Too many hits (>300): add a concept or a design filter. Too few (<5): drop a concept, add synonyms. The connector does not accept `*` truncation — write the variants out (`randomized OR randomised`).
5. **Sort:** default relevance; use `pub_date` when the claim is about recent evidence.
6. **Read up to 20 abstracts** (more on request). Prefer, in order: RCTs and meta-analyses of RCTs, large cohorts, then smaller studies; guidelines and reviews only to locate primary studies.
7. **Record** the final query string and the date in the claim's `search` field.

Without the connector: give the user the query, ask them to run it on pubmed.ncbi.nlm.nih.gov, select the relevant results, and export them (Save → Format: PubMed) as a .nbib file to upload.
