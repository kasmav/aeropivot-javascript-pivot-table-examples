# Benchmark Methodology

The purpose of this benchmark kit is to make large JavaScript pivot table testing more transparent.

## Why Ingestion And Recalculation Are Separate

Initial ingestion includes reading, parsing, column conversion, indexing, and the first aggregation. Recalculation after ingestion measures how quickly the pivot table reacts once the data is already resident in browser memory.

Both numbers matter, but they answer different questions:

- ingestion tells you how long the first load takes
- recalculation tells you how interactive analysis feels after load

## Why Cardinality Matters

Pivot performance depends on grouping shape. Low-cardinality dimensions such as region, category, segment, month, and status usually aggregate differently from unique IDs, URLs, emails, timestamps, and free-form strings.

Always report cardinality for fields used in rows, columns, and filters.

## Why TypedArrays Matter

Numeric measures can use `Float64Array`, `Float32Array`, `Int32Array`, and related typed arrays. This can reduce overhead compared with long-lived arrays of row objects.

## Local Mode Boundary

Local mode is useful for browser-owned extracts, customer uploads, internal analytics files, and interactive exploration where the source data can safely live in the browser.

Use server mode when:

- the source dataset is too large for browser memory
- data governance requires backend ownership
- access control and tenant boundaries matter
- users should receive aggregate result windows instead of raw source data

Server mode docs: https://kasmav.com/aeropivot/docs/server-mode

