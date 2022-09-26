import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'biggive-footer',
  styleUrl: 'biggive-footer.css',
  shadow: true,
})
export class BiggiveFooter {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
