import { Component, Prop, h } from '@stencil/core';
import { faQuoteLeft } from '@fortawesome/pro-solid-svg-icons';

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

  icon = faQuoteLeft;
  iconSize = 50;

  render() {
    return (
      <div class={'container text-colour-' + this.defaultTextColour + ' space-below-' + this.spaceBelow}>
        <svg width={this.iconSize} height={this.iconSize} xmlns="http://www.w3.org/2000/svg" class="fill-primary" viewBox={'0 0 ' + this.icon.icon[0] + ' ' + this.icon.icon[1]}>
          <path d={this.icon.icon[4].toString()} />
        </svg>

        <div class="quote">"{this.quote}"</div>
        <br></br>
        <br></br>
        <div class="attribution"> - {this.attribution}</div>
      </div>
    );
  }
}
