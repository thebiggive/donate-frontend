import { Component, Prop, h } from '@stencil/core';
import { brandColour } from '../../globals/brand-colour';
import { spacingOption } from '../../globals/spacing-option';

@Component({
  tag: 'biggive-basic-card',
  styleUrl: 'biggive-basic-card.scss',
  shadow: true,
})
export class BiggiveBasicCard {
  @Prop() spaceBelow: spacingOption = 0;

  @Prop() backgroundColour: brandColour = 'primary';

  @Prop() backgroundImageUrl: string = '';

  @Prop() cardColour: brandColour = 'white';

  @Prop() textColour: brandColour = 'black';

  @Prop() mainImageUrl: string;

  @Prop() mainImageAltText: string;

  @Prop() mainTitle: string;

  @Prop() subtitle: string;

  @Prop() teaser: string;

  @Prop() icon: boolean = true;

  @Prop() iconColour: brandColour = 'primary';

  @Prop() buttonAlign: string = 'center';

  @Prop() buttonStyle: string = 'standard';

  @Prop() buttonLabel: string;

  @Prop() buttonUrl: string;

  @Prop() buttonColourScheme: string = 'clear-primary';

  @Prop() clipBottomLeftCorner: boolean = true;

  @Prop() clipTopRightCorner: boolean = true;

  @Prop() headingLevel: 1 | 2 | 3 | 4 | 5 | 6 = 3;

  @Prop() addAnimation: boolean = false;

  render() {
    const HeadingTag = `h${this.headingLevel}`;

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
          this.clipTopRightCorner +
          ' add-animation-' +
          this.addAnimation
        }
        style={{ 'background-image': "url('" + this.backgroundImageUrl + "')" }}
      >
        <a href={this.buttonUrl}>
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
              {this.mainImageUrl != '' ? (
                <div class="main-image-container">
                  <div class="image-wrap">
                    <img src={this.mainImageUrl} alt={this.mainImageAltText} title={this.mainImageAltText} />
                  </div>
                </div>
              ) : null}
              <HeadingTag class="title">{this.mainTitle}</HeadingTag>
              <div class="subtitle">{this.subtitle}</div>
              <div class="teaser">{this.teaser}</div>
              {this.buttonLabel != null && this.buttonUrl != null && this.buttonUrl != '' ? (
                <div class={'button-wrap align-' + this.buttonAlign}>
                  <biggive-button colour-scheme={this.buttonColourScheme} label={this.buttonLabel}></biggive-button>
                </div>
              ) : null}
            </div>
          </div>
        </a>
      </div>
    );
  }
}
