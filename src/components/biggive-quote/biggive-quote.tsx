import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-quote',
  styleUrl: 'biggive-quote.scss',
  shadow: true,
})
export class BiggiveQuote {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;
  /**
   * Default text colour
   */
  @Prop() defaultTextColour: string = 'black';
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
      <div class={'container text-colour-' + this.defaultTextColour + ' space-below-' + this.spaceBelow}>
        <div class="quote">{this.quote}</div>
        <div class="attribution">{this.attribution}</div>
      </div>
    );
  }
}
