import { Component, Prop, h } from '@stencil/core';
export class BiggiveCampaignCardTest {
  constructor() {
    this.cols = 3;
    this.banner = null;
    this.daysRemaining = null;
    this.target = null;
    this.organisationName = null;
    this.campaignTitle = null;
    this.campaignType = null;
    this.categoryIcons = null;
    this.beneficiaryIcons = null;
    this.matchFundsRemaining = null;
    this.totalFundsRaised = null;
    this.callToActionUrl = null;
    this.callToActionLabel = null;
  }
  getCategoryIcons() {
    var classes = this.categoryIcons.split('|');
    for (var prop in classes) {
      classes[prop] = 'fa fa-' + classes[prop];
    }
    return classes;
  }
  getBeneficiaryIcons() {
    var classes = this.beneficiaryIcons.split('|');
    for (var prop in classes) {
      classes[prop] = 'fa fa-' + classes[prop];
    }
    return classes;
  }
  formatCurrency(num) {
    if (!isNaN(num)) {
      return parseInt(num).toLocaleString();
    }
    return num;
  }
  render() {
    return (h("div", { class: "container" },
      h("div", { class: "sleeve" },
        h("div", { class: "campaign-type" },
          h("span", null, this.campaignType)),
        this.banner
          ? h("div", { class: "image-wrap banner", style: { 'background-image': 'url(' + this.banner + ')' } },
            h("img", { src: this.banner, class: "banner" }))
          : null,
        h("div", { class: "content" },
          h("div", { class: "meta-wrap style-1" },
            h("div", { class: "meta-item" },
              h("span", { class: "label" }, "Days Remaining:"),
              " ",
              h("span", { class: "text" }, this.daysRemaining)),
            h("div", { class: "meta-item" },
              h("span", { class: "label" }, "Target:"),
              " ",
              h("span", { class: "text" },
                "\u00A3",
                this.formatCurrency(this.target)))),
          h("header", null,
            h("div", { class: "slug" }, this.organisationName),
            h("h3", null, this.campaignTitle)),
          h("div", { class: "meta-wrap style-2" },
            h("div", { class: "meta-item" },
              h("span", { class: "label" }, "Categories"),
              h("span", { class: "text" }, this.getCategoryIcons().map((categoryIcon) => h("i", { class: categoryIcon })))),
            h("div", { class: "meta-item" },
              h("span", { class: "label" }, "Helping"),
              h("span", { class: "text" }, this.getBeneficiaryIcons().map((categoryIcon) => h("i", { class: categoryIcon }))))),
          h("div", { class: "meta-wrap style-3" },
            h("div", { class: "meta-item" },
              h("span", { class: "label" },
                "Match",
                h("br", null),
                "Funds Remaining"),
              h("span", { class: "text" },
                "\u00A3",
                this.formatCurrency(this.matchFundsRemaining))),
            h("div", { class: "meta-item" },
              h("span", { class: "label" },
                "Total",
                h("br", null),
                "Funds Received"),
              h("span", { class: "text" },
                "\u00A3",
                this.formatCurrency(this.totalFundsRaised)))),
          h("div", { class: "button-wrap" },
            h("a", { href: this.callToActionUrl, class: "call-to-action" }, this.callToActionLabel))))));
  }
  static get is() { return "biggive-campaign-card-test"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["biggive-campaign-card-test.css", "../../assets/fonts/fontawesome/css/all.css"]
  }; }
  static get styleUrls() { return {
    "$": ["biggive-campaign-card-test.css", "../../assets/fonts/fontawesome/css/all.css"]
  }; }
  static get properties() { return {
    "cols": {
      "type": "number",
      "mutable": true,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "cols",
      "reflect": false,
      "defaultValue": "3"
    },
    "banner": {
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
      "attribute": "banner",
      "reflect": false,
      "defaultValue": "null"
    },
    "daysRemaining": {
      "type": "number",
      "mutable": true,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "days-remaining",
      "reflect": false,
      "defaultValue": "null"
    },
    "target": {
      "type": "number",
      "mutable": true,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "target",
      "reflect": false,
      "defaultValue": "null"
    },
    "organisationName": {
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
      "attribute": "organisation-name",
      "reflect": false,
      "defaultValue": "null"
    },
    "campaignTitle": {
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
      "attribute": "campaign-title",
      "reflect": false,
      "defaultValue": "null"
    },
    "campaignType": {
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
      "attribute": "campaign-type",
      "reflect": false,
      "defaultValue": "null"
    },
    "categoryIcons": {
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
      "attribute": "category-icons",
      "reflect": false,
      "defaultValue": "null"
    },
    "beneficiaryIcons": {
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
      "attribute": "beneficiary-icons",
      "reflect": false,
      "defaultValue": "null"
    },
    "matchFundsRemaining": {
      "type": "number",
      "mutable": true,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "match-funds-remaining",
      "reflect": false,
      "defaultValue": "null"
    },
    "totalFundsRaised": {
      "type": "number",
      "mutable": true,
      "complexType": {
        "original": "number",
        "resolved": "number",
        "references": {}
      },
      "required": false,
      "optional": false,
      "docs": {
        "tags": [],
        "text": ""
      },
      "attribute": "total-funds-raised",
      "reflect": false,
      "defaultValue": "null"
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
      "defaultValue": "null"
    },
    "callToActionLabel": {
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
      "attribute": "call-to-action-label",
      "reflect": false,
      "defaultValue": "null"
    }
  }; }
}
