import type { Components, JSX } from "../types/components";

interface SampleComponent extends Components.SampleComponent, HTMLElement {}
export const SampleComponent: {
  prototype: SampleComponent;
  new (): SampleComponent;
};
/**
 * Used to define this component and all nested components recursively.
 */
export const defineCustomElement: () => void;
