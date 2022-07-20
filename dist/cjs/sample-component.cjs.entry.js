'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-4fc1f774.js');

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

exports.sample_component = SampleComponent;
