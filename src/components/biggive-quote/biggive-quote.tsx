import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-quote',
  styleUrl: 'biggive-quote.css',
  shadow: true,
})
export class BiggiveQuote {
  /**
   * Colour Scheme
   */
  @Prop() colourScheme: string = 'primary';

  /**
   * Quote text
   */
  @Prop() quote: string = '';

  /**
   * Attribution text
   */
  @Prop() attribution: string = '';

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
