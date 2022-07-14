import type { Components, JSX } from "../types/components";

interface SampleComponentChild extends Components.SampleComponentChild, HTMLElement {}
export const SampleComponentChild: {
  prototype: SampleComponentChild;
  new (): SampleComponentChild;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
