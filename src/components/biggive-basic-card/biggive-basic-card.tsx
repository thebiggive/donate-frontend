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
   * Full URL of the background image.
   */
  @Prop() backgroundColour: string = 'white';

  /**
   * Full URL of the background image.
   */
  @Prop() backgroundImageUrl: string = '';

  /**
   * Main title
   */
  @Prop() mainTitle: string = null;

  /**
   * Subtitle title
   */
  @Prop() subtitle: string = null;

  /**
   * Icon colour
   */
  @Prop() iconColour: string = 'primary';

  /**
   * Button label
   */
  @Prop() buttonLabel: string = null;

  /**
   * Button URL
   */
  @Prop() buttonUrl: string = null;

  /**
   * Button Colour Scheme
   */
  @Prop() buttonColourScheme: string = 'clear-primary';

  render() {
    return (
      <div
        class={'container space-below-' + this.spaceBelow + ' background-colour-' + this.backgroundColour}
        style={{ 'background-image': "url('" + this.backgroundImageUrl + "')" }}
      >
        <div class="sleeve">
          <div class="content-wrap">
            <div class="icon">
              <svg width="53" height="39" viewBox="0 0 53 39" fill="none" xmlns="http://www.w3.org/2000/svg">
                <path d="M38.7009 13.6572L52.3535 38.6959H25.0386L38.7009 13.6572Z" class="fill-black" />
                <path d="M20.4789 36.4199L6.36785e-06 5.89713e-05L40.9724 6.61352e-05L20.4789 36.4199Z" class={'fill-' + this.iconColour} />
              </svg>
            </div>
            <h3 class="title">{this.mainTitle}</h3>
            <div class="subtitle">{this.subtitle}</div>
            {this.buttonLabel != null && this.buttonUrl != null ? (
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
