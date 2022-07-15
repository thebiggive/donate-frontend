import { r as registerInstance, h } from './index-1aa2facf.js';

const sampleComponentCss = ":host{display:block}.container{border:1px solid #F1F1F1;padding:30px}.container h3.title{margin:0;padding:0}.container .meta{margin-bottom:15px}";

const SampleComponent = class {
  constructor(hostRef) {
    registerInstance(this, hostRef);
    this.label = "";
    this.meta = "";
    this.callToActionUrl = "";
    this.callToActionText = "";
  }
  render() {
    return (h("div", { class: "container" }, h("h3", { class: "label" }, this.title), h("div", { class: "meta" }, this.meta), h("sample-component-child", { url: this.callToActionUrl, text: this.callToActionText })));
  }
};
SampleComponent.style = sampleComponentCss;

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

export { SampleComponent as sample_component, SampleComponentChild as sample_component_child };
