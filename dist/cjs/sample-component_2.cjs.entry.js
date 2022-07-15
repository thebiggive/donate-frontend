'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-a4722dd6.js');

const sampleComponentCss = ":host{display:block}.container{border:1px solid #F1F1F1;padding:30px}.container h3.title{margin:0;padding:0}.container .meta{margin-bottom:15px}";

const SampleComponent = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.label = "";
    this.meta = "";
    this.callToActionUrl = "";
    this.callToActionText = "";
  }
  render() {
    return (index.h("div", { class: "container" }, index.h("h3", { class: "label" }, this.label), index.h("div", { class: "meta" }, this.meta), index.h("sample-component-child", { url: this.callToActionUrl, text: this.callToActionText })));
  }
};
SampleComponent.style = sampleComponentCss;

const sampleComponentChildCss = ":host{display:block}.call-to-action a{border:1px solid #000000;padding:5px 10px;color:#000000;text-decoration:none;display:inline-block}.call-to-action a:hover{color:#FFFFFF;background-color:#000000}";

const SampleComponentChild = class {
  constructor(hostRef) {
    index.registerInstance(this, hostRef);
    this.url = "";
    this.text = "";
  }
  render() {
    return (index.h("div", { class: "call-to-action" }, index.h("a", { href: this.url }, this.text)));
  }
};
SampleComponentChild.style = sampleComponentChildCss;

exports.sample_component = SampleComponent;
exports.sample_component_child = SampleComponentChild;
