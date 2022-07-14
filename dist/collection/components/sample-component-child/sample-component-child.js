import { Component, Prop, h } from '@stencil/core';
export class SampleComponentChild {
  constructor() {
    this.url = "";
    this.text = "";
  }
  render() {
    return (h("div", { class: "call-to-action" },
      h("a", { href: this.url }, this.text)));
  }
  static get is() { return "sample-component-child"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["sample-component-child.css"]
  }; }
  static get styleUrls() { return {
    "$": ["sample-component-child.css"]
  }; }
  static get properties() { return {
    "url": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "url",
      "reflect": false,
      "defaultValue": "\"\""
    },
    "text": {
      "type": "string",
      "mutable": true,
      "complexType": {
        "original": "string",
        "resolved": "string",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "text",
      "reflect": false,
      "defaultValue": "\"\""
    }
  }; }
}
