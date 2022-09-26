import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'biggive-quote',
  styleUrl: 'biggive-quote.css',
  shadow: true,
})
export class BiggiveQuote {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
