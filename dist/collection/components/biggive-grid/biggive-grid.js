import { Component, h } from '@stencil/core';
export class BiggiveGrid {
  render() {
    return (h("div", { class: "grid" },
      h("slot", null)));
  }
  static get is() { return "biggive-grid"; }
  static get encapsulation() { return "shadow"; }
  static get originalStyleUrls() { return {
    "$": ["biggive-grid.css"]
  }; }
  static get styleUrls() { return {
    "$": ["biggive-grid.css"]
  }; }
}
