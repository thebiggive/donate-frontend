import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'biggive-dropdown',
  styleUrl: 'biggive-dropdown.css',
  shadow: true,
})
export class BiggiveDropdown {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
