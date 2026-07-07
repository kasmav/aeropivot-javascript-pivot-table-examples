# Run A Local Browser Pivot Benchmark

Use this checklist when measuring AeroPivot local mode with a large CSV, JSON, Arrow, or Parquet dataset.

## 1. Prepare Environment

Record:

- browser and version
- operating system
- CPU
- RAM
- whether the browser has other heavy tabs open
- whether hardware acceleration is enabled

## 2. Prepare Dataset

Generate a synthetic CSV:

```bash
node generate-dataset.mjs --rows 10000000 --out sales-10m.csv
```

Or use your own production-shaped extract. If you use real production-shaped data, avoid committing it to GitHub.

Record:

- file size
- row count
- field count
- string field cardinality
- numeric measure count
- selected pivot rows
- selected pivot columns
- selected measures

## 3. Measure Separately

Use separate timers for:

1. source file read or fetch
2. parsing
3. conversion into column arrays and TypedArrays
4. `pivot.appendColumnarData(...)`
5. `pivot.completeStreaming()`
6. recalculation after changing rows, columns, values, or filters

## 4. Report Recalculation After Ingestion

After the dataset is resident in memory:

- change a row field
- change a column field
- add or remove a value field
- apply a low-cardinality filter
- measure each recalculation separately

## 5. Publish Caveats

Always include:

- browser memory can be the limiting factor
- high-cardinality string fields change behavior
- wide datasets differ from narrow datasets
- local mode is for browser-owned extracts
- server mode is better when source data should remain backend-owned

