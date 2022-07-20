'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-4fc1f774.js');

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

exports.sample_component_child = SampleComponentChild;
