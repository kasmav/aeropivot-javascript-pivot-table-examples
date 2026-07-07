import type React from "react";

type PivotTableAttributes = React.DetailedHTMLProps<
  React.HTMLAttributes<HTMLElement> & {
    "worker-path"?: string;
    "license-key"?: string;
    "full-page"?: boolean;
  },
  HTMLElement
>;

declare module "react" {
  namespace JSX {
    interface IntrinsicElements {
      "pivot-table": PivotTableAttributes;
    }
  }
}

