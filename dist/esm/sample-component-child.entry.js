import { r as registerInstance, h } from './index-d0f05bcc.js';

const sampleComponentChildCss = ":host{display:block}.call-to-action a{border:1px solid #000000;padding:5px 10px;color:#000000;text-decoration:none;display:inline-block}.call-to-action a:hover{color:#FFFFFF;background-color:#000000}";

const SampleComponentChild = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.url = "";
    this.text = "";
  }
  render() {
    return (h("div", { class: "call-to-action" }, h("a", { href: this.url }, this.text)));
  }
};
SampleComponentChild.style = sampleComponentChildCss;

export { SampleComponentChild as sample_component_child };
