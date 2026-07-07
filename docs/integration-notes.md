# AeroPivot Integration Notes

AeroPivot is a native Web Component. That means the same `<pivot-table>` element can be used from React, Vue, Angular, Svelte, plain JavaScript, and server-rendered applications.

## Core Integration Rule

Use HTML attributes for small primitive settings. Use DOM properties and methods for large runtime structures.

Good:

```js
pivot.fields = fields;
pivot.appendColumnarData(columns);
pivot.config = config;
pivot.completeStreaming();
```

Avoid serializing large data or config objects into HTML attributes.

## Required SDK Assets

Each browser integration needs:

```txt
pivot-table.es.js
pivot-themes.css
assets/pivot.worker.js
```

The `worker-path` attribute must point to the hosted worker file:

```html
<pivot-table worker-path="/aeropivot/assets/pivot.worker.js"></pivot-table>
```

## React

React should use a ref:

```tsx
const pivotRef = useRef<PivotElement | null>(null);
```

Attach native event listeners in `useEffect` for custom events such as `pivot-save`, then remove the listeners in cleanup.

## Vue

Vue can use template refs and normal event bindings:

```vue
<pivot-table ref="pivotRef" @pivot-save="onSave" />
```

## Angular

Angular needs `CUSTOM_ELEMENTS_SCHEMA` and a `ViewChild` reference:

```ts
@ViewChild("pivot", { static: true }) pivotRef!: ElementRef<PivotElement>;
```

## Data Shape

For large browser-local data, prefer columnar arrays:

```js
pivot.appendColumnarData({
  Region: rows.map((row) => row.Region),
  Sales: new Float64Array(rows.map((row) => row.Sales))
});
```

Columnar data avoids retaining millions of row objects and repeated object keys.

## Local Mode vs Server Mode

Use local mode when:

- the user has a bounded extract
- data fits practical browser memory
- interaction speed matters after ingestion
- the user can safely load the source data into the browser

Use server mode when:

- source data is governed
- data should stay backend-owned
- cardinality or file size exceeds practical browser memory
- multi-user access control and tenant boundaries matter

Server mode docs: https://kasmav.com/aeropivot/docs/server-mode

