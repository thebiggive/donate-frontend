import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'biggive-header',
  styleUrl: 'biggive-header.css',
  shadow: true,
})
export class BiggiveHeader {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
