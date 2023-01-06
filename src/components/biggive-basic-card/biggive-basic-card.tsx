import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-basic-card',
  styleUrl: 'biggive-basic-card.scss',
  shadow: true,
})
export class BiggiveBasicCard {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  /**
   * Background colour.
   */
  @Prop() backgroundColour: string = 'primary';

  /**
   * Full URL of the background image.
   */
  @Prop() backgroundImageUrl: string = '';
  /**
   * Card colour
   */
  @Prop() cardColour: string = 'white';
  /**
   * Text colour
   */
  @Prop() textColour: string = 'black';
  /**
   * Main title
   */
  @Prop() mainTitle: string;

  /**
   * Subtitle title
   */
  @Prop() subtitle: string;

  /**
   * Teaser
   */
  @Prop() teaser: string;
  /**
   * Icon
   */
  @Prop() icon: boolean = true;
  /**
   * Icon colour
   */
  @Prop() iconColour: string = 'primary';

  /**
   * Button label
   */
  @Prop() buttonLabel: string;

  /**
   * Button URL
   */
  @Prop() buttonUrl: string;

  /**
   * Button Colour Scheme
   */
  @Prop() buttonColourScheme: string = 'clear-primary';

  /**
   * Clip bottom left corner
   */
  @Prop() clipBottomLeftCorner: boolean = true;

  /**
   * Clip top right corner
   */
  @Prop() clipTopRightCorner: boolean = true;

  render() {
    return (
      <div
        class={
          'container space-below-' +
          this.spaceBelow +
          ' background-colour-' +
          this.backgroundColour +
          ' clip-bottom-left-corner-' +
          this.clipBottomLeftCorner +
          ' clip-top-right-corner-' +
          this.clipTopRightCorner
        }
        style={{ 'background-image': "url('" + this.backgroundImageUrl + "')" }}
      >
        <div class={'sleeve background-colour-' + this.cardColour + ' text-colour-' + this.textColour}>
          <div class="content-wrap">
            {this.icon == true ? (
              <div class="icon">
                <svg width="53" height="39" viewBox="0 0 53 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path d="M38.7009 13.6572L52.3535 38.6959H25.0386L38.7009 13.6572Z" class="fill-black" />
                  <path d="M20.4789 36.4199L6.36785e-06 5.89713e-05L40.9724 6.61352e-05L20.4789 36.4199Z" class={'fill-' + this.iconColour} />
                </svg>
              </div>
            ) : null}
            <h3 class="title">{this.mainTitle}</h3>
            <div class="subtitle">{this.subtitle}</div>
            <div class="teaser">{this.teaser}</div>
            {this.buttonLabel != null && this.buttonUrl != null && this.buttonUrl != '' ? (
              <div class="button-wrap">
                <biggive-button colour-scheme={this.buttonColourScheme} url={this.buttonUrl} label={this.buttonLabel}></biggive-button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
