import type { Components, JSX } from "../types/components";

interface BiggiveGrid extends Components.BiggiveGrid, HTMLElement {}
export const BiggiveGrid: {
  prototype: BiggiveGrid;
  new (): BiggiveGrid;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
