# 10 Million Row Browser Pivot Benchmark

This folder contains a benchmark kit for evaluating large browser-local pivot table workloads with the [AeroPivot JavaScript pivot table web component](https://kasmav.com/aeropivot).

The public benchmark article is here:

https://kasmav.com/aeropivot/benchmarks/10-million-row-pivot-table

## What This Benchmark Measures

This benchmark separates:

- CSV generation
- browser file read or fetch time
- parsing and column conversion
- AeroPivot ingestion
- first pivot calculation
- later recalculation after data is resident in memory

That separation matters because a large CSV can take time to read and parse, while later pivot layout changes can be much faster once the data is already held by the in-memory engine.

## Benchmark Shape

The reference website benchmark documents:

| Metric | Value |
| --- | --- |
| Source size | 2.8 GB CSV |
| Rows | 10 million |
| Fields | 33 |
| Browser | Chrome |
| Machine | Windows workstation with 24 GB RAM |
| Initial ingestion | about 2 minutes |
| Pivot recalculation | 2-4 seconds after ingestion for the tested layout |

Your own numbers will vary with field cardinality, selected fields, selected measures, filters, hardware, and browser memory pressure.

## Files

| File | Purpose |
| --- | --- |
| `generate-dataset.mjs` | Creates synthetic CSV datasets for repeatable browser-local pivot testing. |
| `run-local-benchmark.md` | Step-by-step benchmark procedure. |
| `results-template.md` | Copy this file when publishing your own result. |
| `methodology.md` | Notes on fair benchmark reporting and caveats. |

## Generate A Dataset

Small smoke test:

```bash
node generate-dataset.mjs --rows 100000 --out sales-100k.csv
```

Larger test:

```bash
node generate-dataset.mjs --rows 10000000 --out sales-10m.csv
```

The generated data is synthetic and intended for benchmark reproducibility. It is not a real customer dataset.

## Important Caveat

Do not use row count alone as a performance claim. A 10M-row dataset with low-cardinality dimensions can behave very differently from a 10M-row dataset with many unique IDs, long strings, timestamps, or many simultaneous measures.

