# React Pivot Table Example

Runnable React + Vite example for the [AeroPivot JavaScript pivot table web component](https://kasmav.com/aeropivot).

## Setup

1. Download the AeroPivot trial:

   https://kasmav.com/aeropivot/download

2. Copy the SDK files into:

   ```txt
   public/aeropivot/pivot-table.es.js
   public/aeropivot/pivot-themes.css
   public/aeropivot/assets/pivot.worker.js
   ```

3. Add your trial or production key in `src/App.tsx`:

   ```ts
   pivot.setAttribute("license-key", "YOUR_LICENSE_KEY_HERE");
   ```

4. Run:

   ```bash
   npm install
   npm run dev
   ```

## Why React Uses Refs

React can render the `<pivot-table>` custom element, but large structures such as columns, TypedArrays, and pivot configuration should be passed through the native element reference. React synthetic events also do not catch every Web Component `CustomEvent`, so this example attaches native event listeners in `useEffect`.

Docs: https://kasmav.com/aeropivot/docs/guides#react

