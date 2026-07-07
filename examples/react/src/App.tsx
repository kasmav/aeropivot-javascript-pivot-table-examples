import { useEffect, useRef, useState } from "react";

type PivotElement = HTMLElement & {
  clearData: () => void;
  appendColumnarData: (columns: Record<string, string[] | Float64Array>) => void;
  completeStreaming: () => void;
  fields: Array<{ id: string; name: string; type: "string" | "number" }>;
  config: unknown;
  panelPosition?: "left" | "right";
  showPanel?: boolean;
};

const rows = [
  { Region: "East", Segment: "Consumer", Category: "Furniture", Sales: 8427.45, Quantity: 12 },
  { Region: "West", Segment: "Corporate", Category: "Technology", Sales: 12540.2, Quantity: 18 },
  { Region: "South", Segment: "Consumer", Category: "Office Supplies", Sales: 4380.9, Quantity: 7 },
  { Region: "East", Segment: "Home Office", Category: "Technology", Sales: 9780.1, Quantity: 9 },
  { Region: "West", Segment: "Consumer", Category: "Furniture", Sales: 6120.55, Quantity: 11 },
  { Region: "South", Segment: "Corporate", Category: "Office Supplies", Sales: 7330.0, Quantity: 14 }
];

function loadStylesheet(href: string) {
  if (document.querySelector(`link[href="${href}"]`)) return;

  const link = document.createElement("link");
  link.rel = "stylesheet";
  link.href = href;
  document.head.appendChild(link);
}

function loadAeroPivotModule(src: string) {
  if (customElements.get("pivot-table")) {
    return Promise.resolve();
  }

  const existing = document.querySelector<HTMLScriptElement>(`script[src="${src}"]`);
  if (existing) {
    return customElements.whenDefined("pivot-table");
  }

  return new Promise<void>((resolve, reject) => {
    const script = document.createElement("script");
    script.type = "module";
    script.src = src;
    script.onload = () => customElements.whenDefined("pivot-table").then(() => resolve());
    script.onerror = () => reject(new Error(`Unable to load ${src}`));
    document.head.appendChild(script);
  });
}

export default function App() {
  const pivotRef = useRef<PivotElement | null>(null);
  const [assetError, setAssetError] = useState<string | null>(null);

  useEffect(() => {
    const pivot = pivotRef.current;
    if (!pivot) return;
    let disposed = false;

    const setup = () => {
      if (disposed) return;

      pivot.setAttribute("license-key", "YOUR_LICENSE_KEY_HERE");
      pivot.panelPosition = "left";
      pivot.showPanel = true;

      pivot.clearData();
      pivot.fields = [
        { id: "Region", name: "Region", type: "string" },
        { id: "Segment", name: "Segment", type: "string" },
        { id: "Category", name: "Category", type: "string" },
        { id: "Sales", name: "Sales", type: "number" },
        { id: "Quantity", name: "Quantity", type: "number" }
      ];

      pivot.appendColumnarData({
        Region: rows.map((row) => row.Region),
        Segment: rows.map((row) => row.Segment),
        Category: rows.map((row) => row.Category),
        Sales: new Float64Array(rows.map((row) => row.Sales)),
        Quantity: new Float64Array(rows.map((row) => row.Quantity))
      });

      pivot.config = {
        mode: "local",
        rows: [{ id: "Region", name: "Region", type: "string" }],
        columns: [{ id: "Segment", name: "Segment", type: "string" }],
        values: [{ id: "Sales", name: "Sales", type: "number", summary: "Sum" }],
        filters: [],
        sorting: [{ id: "Region", desc: false }]
      };

      pivot.completeStreaming();
    };

    const handleSave = (event: Event) => {
      console.log("Save pivot config", (event as CustomEvent).detail);
    };

    pivot.addEventListener("pivot-save", handleSave);

    loadStylesheet("/aeropivot/pivot-themes.css");
    loadAeroPivotModule("/aeropivot/pivot-table.es.js")
      .then(setup)
      .catch(() => {
        if (!disposed) {
          setAssetError(
            "AeroPivot SDK files were not found. Copy pivot-table.es.js, pivot-themes.css, and assets/pivot.worker.js into public/aeropivot."
          );
        }
      });

    return () => {
      disposed = true;
      pivot.removeEventListener("pivot-save", handleSave);
    };
  }, []);

  return (
    <main className="page">
      <header>
        <p className="eyebrow">AeroPivot React Example</p>
        <h1>React Pivot Table Web Component</h1>
        <p>
          This example loads a small columnar dataset into AeroPivot local mode. Use the same pattern for larger CSV, JSON,
          Arrow, or Parquet workflows.
        </p>
      </header>

      <section className="pivotShell">
        {assetError && <div className="assetNotice">{assetError}</div>}
        <pivot-table
          ref={pivotRef}
          className="pivot-theme-light"
          worker-path="/aeropivot/assets/pivot.worker.js"
        />
      </section>
    </main>
  );
}

