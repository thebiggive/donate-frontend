import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const biggiveGridCss = ":host{display:block}.grid{display:-webkit-box;display:-moz-box;display:-webkit-flex;display:flex;-webkit-flex-flow:row wrap;flex-flow:row wrap;-webkit-justify-content:space-between;justify-content:space-between}";

const BiggiveGrid$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
  }
  render() {
    return (h("div", { class: "grid" }, h("slot", null)));
  }
  static get style() { return biggiveGridCss; }
}, [1, "biggive-grid"]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["biggive-grid"];
  components.forEach(tagName => { switch (tagName) {
    case "biggive-grid":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, BiggiveGrid$1);
      }
      break;
  } });
}

const BiggiveGrid = BiggiveGrid$1;
const defineCustomElement = defineCustomElement$1;

export { BiggiveGrid, defineCustomElement };
