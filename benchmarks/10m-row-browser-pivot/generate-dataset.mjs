import { createWriteStream } from "node:fs";
import { once } from "node:events";

const args = new Map();
for (let i = 2; i < process.argv.length; i += 2) {
  args.set(process.argv[i], process.argv[i + 1]);
}

const rowCount = Number(args.get("--rows") ?? 100_000);
const outFile = args.get("--out") ?? `sales-${rowCount}.csv`;

if (!Number.isInteger(rowCount) || rowCount <= 0) {
  throw new Error("--rows must be a positive integer");
}

const regions = ["East", "West", "South", "Central"];
const segments = ["Consumer", "Corporate", "Home Office"];
const categories = ["Furniture", "Office Supplies", "Technology"];
const subCategories = [
  "Bookcases",
  "Chairs",
  "Tables",
  "Storage",
  "Binders",
  "Paper",
  "Phones",
  "Accessories",
  "Machines"
];
const years = [2023, 2024, 2025, 2026];
const months = ["Jan", "Feb", "Mar", "Apr", "May", "Jun", "Jul", "Aug", "Sep", "Oct", "Nov", "Dec"];

const stream = createWriteStream(outFile, { encoding: "utf8" });

stream.write([
  "OrderId",
  "Region",
  "Segment",
  "Category",
  "SubCategory",
  "Year",
  "Month",
  "Sales",
  "Quantity",
  "Discount",
  "Profit"
].join(",") + "\n");

function saleFor(i) {
  return ((i % 1000) * 1.37 + 25).toFixed(2);
}

function quantityFor(i) {
  return (i % 25) + 1;
}

function discountFor(i) {
  return ((i % 5) * 0.05).toFixed(2);
}

function profitFor(i) {
  const sales = Number(saleFor(i));
  const quantity = quantityFor(i);
  const discount = Number(discountFor(i));
  return (sales * (0.08 + (quantity % 7) * 0.01) * (1 - discount)).toFixed(2);
}

for (let i = 0; i < rowCount; i += 1) {
  const line = [
    `ORD-${String(i + 1).padStart(9, "0")}`,
    regions[i % regions.length],
    segments[i % segments.length],
    categories[i % categories.length],
    subCategories[i % subCategories.length],
    years[i % years.length],
    months[i % months.length],
    saleFor(i),
    quantityFor(i),
    discountFor(i),
    profitFor(i)
  ].join(",") + "\n";

  if (!stream.write(line)) {
    await once(stream, "drain");
  }

  if ((i + 1) % 1_000_000 === 0) {
    console.log(`Generated ${i + 1} rows`);
  }
}

stream.end();
await once(stream, "finish");

console.log(`Wrote ${rowCount} rows to ${outFile}`);

