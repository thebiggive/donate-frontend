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
        <div class="image-wrap">
          <svg width="34" height="24" viewBox="0 0 34 24" fill="none" xmlns="http://www.w3.org/2000/svg">
            <path d="M16.1245 0L13.7167 24H0L11.0901 0H16.1245ZM34 0L31.5923 24H17.8755L28.9657 0H34Z" fill="#2C089B" />
          </svg>
        </div>
        <div class="quote">“{this.quote}”</div>
        <div class="attribution"> - {this.attribution}</div>
      </div>
    );
  }
}
