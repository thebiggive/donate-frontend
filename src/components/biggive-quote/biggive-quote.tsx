import { Component, Prop, h } from '@stencil/core';
import { brandColour } from '../../globals/brand-colour';
import { spacingOption } from '../../globals/spacing-option';

@Component({
  tag: 'biggive-quote',
  styleUrl: 'biggive-quote.scss',
  shadow: true,
})
export class BiggiveQuote {
  @Prop() spaceBelow: spacingOption = 0;

  @Prop() defaultTextColour: brandColour = 'black';

  @Prop() quote: string = '';

  @Prop() attribution: string = '';

  @Prop() quoteIconColour: brandColour = 'primary';

  render() {
    return (
      <div class={'container text-colour-' + this.defaultTextColour + ' quote-icon-colour-' + this.quoteIconColour + ' space-below-' + this.spaceBelow}>
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
