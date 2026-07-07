# Angular Pivot Table Integration

Angular can use AeroPivot as a native Web Component when `CUSTOM_ELEMENTS_SCHEMA` is enabled. Use `ViewChild` to pass fields, data, and configuration into the native `<pivot-table>` element.

Docs: https://kasmav.com/aeropivot/docs/guides#angular

## Setup

Copy the AeroPivot SDK files into your Angular app:

```txt
src/aeropivot/pivot-table.es.js
src/aeropivot/pivot-themes.css
src/aeropivot/assets/pivot.worker.js
```

Register the stylesheet in `angular.json` and import the module in your app entry:

```ts
import "./aeropivot/pivot-table.es.js";
```

## Schema Setup

```ts
import { CUSTOM_ELEMENTS_SCHEMA, NgModule } from "@angular/core";

@NgModule({
  schemas: [CUSTOM_ELEMENTS_SCHEMA]
})
export class AppModule {}
```

## Component Pattern

```ts
import { AfterViewInit, Component, ElementRef, ViewChild } from "@angular/core";

type PivotElement = HTMLElement & {
  clearData: () => void;
  appendColumnarData: (columns: Record<string, string[] | Float64Array>) => void;
  completeStreaming: () => void;
  fields: unknown[];
  config: unknown;
  panelPosition?: "left" | "right";
  showPanel?: boolean;
};

@Component({
  selector: "app-report",
  template: `
    <pivot-table
      #pivot
      class="pivot-theme-light"
      worker-path="/aeropivot/assets/pivot.worker.js"
      (pivot-save)="onSave($event)">
    </pivot-table>
  `,
  styles: [`
    pivot-table {
      display: block;
      height: 640px;
      width: 100%;
    }
  `]
})
export class ReportComponent implements AfterViewInit {
  @ViewChild("pivot", { static: true }) pivotRef!: ElementRef<PivotElement>;

  ngAfterViewInit() {
    const pivot = this.pivotRef.nativeElement;

    const setup = () => {
      pivot.setAttribute("license-key", "YOUR_LICENSE_KEY_HERE");
      pivot.panelPosition = "left";
      pivot.showPanel = true;

      const rows = [
        { Region: "East", Segment: "Consumer", Sales: 8427.45 },
        { Region: "West", Segment: "Corporate", Sales: 12540.2 }
      ];

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
  }

  onSave(event: Event) {
    console.log("Save config", (event as CustomEvent).detail);
  }
}
```

## Practical Notes

- Use `ViewChild` for fields, config, and data ingestion.
- Use Angular template event bindings for `CustomEvent` listeners.
- Keep very large datasets out of Angular change detection by passing them directly to the native element.

