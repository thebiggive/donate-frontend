import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'biggive-icon',
  styleUrl: 'biggive-icon.css',
  shadow: true,
})
export class BiggiveIcon {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
