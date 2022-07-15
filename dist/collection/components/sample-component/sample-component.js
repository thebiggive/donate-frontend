import { Component, Prop, h } from '@stencil/core';
export class SampleComponent {
  constructor() {
    this.label = "";
    this.meta = "";
    this.callToActionUrl = "";
    this.callToActionText = "";
  }
  render() {
    return (h("div", { class: "container" },
      h("h3", { class: "label" }, this.title),
      h("div", { class: "meta" }, this.meta),
      h("sample-component-child", { url: this.callToActionUrl, text: this.callToActionText })));
  }
  static get is() { return "sample-component"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["sample-component.css"]
  }; }
  static get styleUrls() { return {
    "$": ["sample-component.css"]
  }; }
  static get properties() { return {
    "label": {
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
      "attribute": "label",
      "reflect": false,
      "defaultValue": "\"\""
    },
    "meta": {
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
      "attribute": "meta",
      "reflect": false,
      "defaultValue": "\"\""
    },
    "callToActionUrl": {
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
      "attribute": "call-to-action-url",
      "reflect": false,
      "defaultValue": "\"\""
    },
    "callToActionText": {
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
      "attribute": "call-to-action-text",
      "reflect": false,
      "defaultValue": "\"\""
    }
  }; }
}
