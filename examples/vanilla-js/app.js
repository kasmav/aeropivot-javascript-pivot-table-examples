const pivot = document.getElementById("pivot");

const rows = [
  { Region: "East", Segment: "Consumer", Category: "Furniture", Sales: 8427.45, Quantity: 12 },
  { Region: "West", Segment: "Corporate", Category: "Technology", Sales: 12540.2, Quantity: 18 },
  { Region: "South", Segment: "Consumer", Category: "Office Supplies", Sales: 4380.9, Quantity: 7 },
  { Region: "East", Segment: "Home Office", Category: "Technology", Sales: 9780.1, Quantity: 9 },
  { Region: "West", Segment: "Consumer", Category: "Furniture", Sales: 6120.55, Quantity: 11 },
  { Region: "South", Segment: "Corporate", Category: "Office Supplies", Sales: 7330.0, Quantity: 14 }
];

function setupPivot() {
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
}

if (customElements.get("pivot-table")) {
  setupPivot();
} else {
  customElements.whenDefined("pivot-table").then(setupPivot);
}

