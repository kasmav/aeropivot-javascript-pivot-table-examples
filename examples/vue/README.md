# Vue Pivot Table Integration

Vue 3 can use AeroPivot as a native custom element. Use a template ref to access the underlying `<pivot-table>` element and pass large data/configuration through DOM properties and methods.

Docs: https://kasmav.com/aeropivot/docs/guides#vue

## Setup

Copy the AeroPivot SDK files into your Vue app:

```txt
public/aeropivot/pivot-table.es.js
public/aeropivot/pivot-themes.css
public/aeropivot/assets/pivot.worker.js
```

Load the CSS and module in your app entry:

```ts
import "./aeropivot/pivot-table.es.js";
import "./aeropivot/pivot-themes.css";
```

## Component Pattern

```vue
<template>
  <pivot-table
    ref="pivotRef"
    class="pivot-theme-light"
    worker-path="/aeropivot/assets/pivot.worker.js"
    @pivot-save="onSave"
  />
</template>

<script setup lang="ts">
import { onMounted, ref } from "vue";

type PivotElement = HTMLElement & {
  clearData: () => void;
  appendColumnarData: (columns: Record<string, string[] | Float64Array>) => void;
  completeStreaming: () => void;
  fields: unknown[];
  config: unknown;
  panelPosition?: "left" | "right";
  showPanel?: boolean;
};

const pivotRef = ref<PivotElement | null>(null);

const rows = [
  { Region: "East", Segment: "Consumer", Sales: 8427.45 },
  { Region: "West", Segment: "Corporate", Sales: 12540.2 }
];

function onSave(event: CustomEvent) {
  console.log("Save config", event.detail);
}

onMounted(() => {
  const pivot = pivotRef.value;
  if (!pivot) return;

  const setup = () => {
    pivot.setAttribute("license-key", "YOUR_LICENSE_KEY_HERE");
    pivot.panelPosition = "left";
    pivot.showPanel = true;

    pivot.clearData();
    pivot.fields = [
      { id: "Region", name: "Region", type: "string" },
      { id: "Segment", name: "Segment", type: "string" },
      { id: "Sales", name: "Sales", type: "number" }
    ];

    pivot.appendColumnarData({
      Region: rows.map((row) => row.Region),
      Segment: rows.map((row) => row.Segment),
      Sales: new Float64Array(rows.map((row) => row.Sales))
    });

    pivot.config = {
      mode: "local",
      rows: [{ id: "Region", name: "Region", type: "string" }],
      columns: [{ id: "Segment", name: "Segment", type: "string" }],
      values: [{ id: "Sales", name: "Sales", type: "number", summary: "Sum" }]
    };

    pivot.completeStreaming();
  };

  if (customElements.get("pivot-table")) setup();
  else customElements.whenDefined("pivot-table").then(setup);
});
</script>
```

## Practical Notes

- Use template event bindings like `@pivot-save` for normal Vue event cleanup.
- Use refs for data and config assignment.
- Use columnar arrays or TypedArrays for large local-mode data.
- Use DuckDB server mode when the dataset should stay backend-owned.

