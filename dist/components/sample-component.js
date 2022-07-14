import { proxyCustomElement, HTMLElement, h } from '@stencil/core/internal/client';
import { d as defineCustomElement$2 } from './sample-component-child2.js';

const sampleComponentCss = ":host{display:block}.container{border:1px solid #F1F1F1;padding:30px}.container h3.title{margin:0;padding:0}.container .meta{margin-bottom:15px}";

const SampleComponent$1 = /*@__PURE__*/ proxyCustomElement(class extends HTMLElement {
  constructor() {
    super();
    this.__registerHost();
    this.__attachShadow();
    this.title = "";
    this.meta = "";
    this.callToActionUrl = "";
    this.callToActionText = "";
  }
  render() {
    return (h("div", { class: "container" }, h("h3", { class: "title" }, this.title), h("div", { class: "meta" }, this.meta), h("sample-component-child", { url: this.callToActionUrl, text: this.callToActionText })));
  }
  static get style() { return sampleComponentCss; }
}, [1, "sample-component", {
    "title": [1025],
    "meta": [1025],
    "callToActionUrl": [1025, "call-to-action-url"],
    "callToActionText": [1025, "call-to-action-text"]
  }]);
function defineCustomElement$1() {
  if (typeof customElements === "undefined") {
    return;
  }
  const components = ["sample-component", "sample-component-child"];
  components.forEach(tagName => { switch (tagName) {
    case "sample-component":
      if (!customElements.get(tagName)) {
        customElements.define(tagName, SampleComponent$1);
      }
      break;
    case "sample-component-child":
      if (!customElements.get(tagName)) {
        defineCustomElement$2();
      }
      break;
  } });
}

const SampleComponent = SampleComponent$1;
const defineCustomElement = defineCustomElement$1;

export { SampleComponent, defineCustomElement };
