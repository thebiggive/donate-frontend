import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';

const sampleComponentChildCss = ":host{display:block}.call-to-action a{border:1px solid #000000;padding:5px 10px;color:#000000;text-decoration:none;display:inline-block}.call-to-action a:hover{color:#FFFFFF;background-color:#000000}";

const SampleComponentChild = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.url = "";
    this.text = "";
  }
  render() {
    return (h("div", { class: "call-to-action" }, h("a", { href: this.url }, this.text)));
  }
  static get style() { return sampleComponentChildCss; }
}, [1, "sample-component-child", {
    "url": [1025],
    "text": [1025]
  }]);
function defineCustomElement() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["sample-component-child"];
  components.forEach(tagName => { switch (tagName) {
    case "sample-component-child":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SampleComponentChild);
      }
      break;
  } });
}

export { SampleComponentChild as S, defineCustomElement as d };
