import { r as registerInstance, h } from './index-d0f05bcc.js';

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
    return (h("div", { class: "container" }, h("h3", { class: "label" }, this.label), h("div", { class: "meta" }, this.meta), h("sample-component-child", { url: this.callToActionUrl, text: this.callToActionText })));
  }
};
SampleComponent.style = sampleComponentCss;

export { SampleComponent as sample_component };
