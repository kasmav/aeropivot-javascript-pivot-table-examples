# Performance Methodology

This guide explains how to measure JavaScript pivot table performance in a way that is useful for real product decisions.

## Measure Separate Phases

Do not report one blended time. Separate:

1. source file download or read time
2. CSV/JSON/Arrow/Parquet parsing time
3. AeroPivot ingestion time
4. first pivot calculation time
5. later recalculation time after data is resident in memory
6. rendering and interaction responsiveness

## Report Environment Details

Always include:

- browser name and version
- operating system
- CPU
- RAM
- file size
- row count
- field count
- selected row fields
- selected column fields
- selected measures
- field cardinality
- filters
- whether data was local mode or server mode

## Cardinality Matters

Row count alone does not describe pivot difficulty.

A 10 million row sales dataset with low-cardinality fields such as region, segment, category, and month can be fast after ingestion. A 10 million row event dataset with high-cardinality user IDs, session IDs, URLs, or timestamps can behave very differently.

## Recommended Result Template

| Metric | Value |
| --- | --- |
| Browser | Chrome |
| OS | Windows |
| RAM | 24 GB |
| Source size | 2.8 GB CSV |
| Rows | 10,000,000 |
| Fields | 33 |
| Ingestion | about 2 minutes |
| Recalculation after ingestion | 2-4 seconds |
| Notes | Depends on field cardinality, measures, filters, and browser memory pressure. |

## Fair Comparisons

When comparing pivot table components:

- use the same source data
- use the same browser and machine
- use the same pivot layout
- include the same filters
- separate ingestion from recalculation
- disclose any server-side pre-aggregation
- disclose whether source data was converted before the test

