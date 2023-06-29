/* eslint-disable prettier/prettier */
import { Component, Prop, h } from '@stencil/core';
import { brandColour } from '../../globals/brand-colour';
import { spacingOption } from '../../globals/spacing-option';


@Component({
  tag: 'biggive-hero-image',
  styleUrl: 'biggive-hero-image.scss',
  shadow: true,
})
export class BiggiveHeroImage {
  /**
   * Space below component
   */
  @Prop() spaceBelow: spacingOption = 0;

  /**
   * Colour Scheme
   */
   @Prop() colourScheme: brandColour = 'primary';

  /**
   * Header slug
   */
   @Prop() slug: string;

  /**
   * Header slug colour
   */
   @Prop() slugColour: brandColour;

  /**
   * Full URL of a logo image.
   */
   @Prop() logo: string = '';

   /**
   * Logo container height selection. Numbers are not measurements.
   */
   @Prop() logoHeight: 1|2|3|4|5|6|7|8|9|10 = 3;

  /**
   * Logo alt text
   */
    @Prop() logoAltText: string = '';

  /**
   * Full URL of a main hero image.
   */
    @Prop() mainImage: string|null = null;

  /**
   * Horizontal alignment of image
   */
    @Prop() mainImageAlignHorizontal: string = 'center';

      /**
   * Vertical alignment of image
   */
    @Prop() mainImageAlignVertical: string = 'center';

  /**
   * Hero image title, typically the page.
   */
  @Prop() mainTitle: string;
  /**
   * Main title colour
   */
   @Prop() mainTitleColour?: brandColour;
  /**
   * Introductory teaser text
   */
  @Prop() teaser: string;
  /**
   * Teaser colour
   */
   @Prop() teaserColour?: brandColour;
  /**
   * Button Url
   */
   @Prop() buttonUrl: string;

  /**
   * Button Label
   */
   @Prop() buttonLabel: string;

  /**
   * Button Colour Scheme
   */
  @Prop() buttonColourScheme: brandColour = 'primary';


  render() {
    const mainTitleClasses = 'main-title ' + (typeof this.mainTitleColour === 'string' && this.mainTitleColour.length > 0 ? `text-colour-${this.mainTitleColour}` : '');
    const teaserClasses = 'teaser ' + (typeof this.teaserColour === 'string' && this.teaserColour.length > 0 ? `text-colour-${this.teaserColour}` : '');

    return (
      <div class={'container colour-scheme-' + this.colourScheme + ' space-below-' + this.spaceBelow}>
        <div class="sleeve">
          <div class="content-wrap">
            {this.logo !== undefined && this.logo !== null ? (
              <div class={'logo image-wrap logo-height-'+this.logoHeight}>
                <img src={this.logo} alt={this.logoAltText} title={this.logoAltText}/>
              </div>
            ) : <div class={'logo-space logo-height-'+this.logoHeight}></div>}
            <div class={'slug text-colour-'+this.slugColour}>{this.slug}</div>
            <h1 class={mainTitleClasses}>{this.mainTitle}</h1>
            <div class={teaserClasses}>{this.teaser}</div>
            {this.buttonLabel != null && this.buttonUrl != null
              ? <biggive-button colour-scheme={this.buttonColourScheme} url={this.buttonUrl} label={this.buttonLabel}></biggive-button>
              : null
            }
          </div>
          <div class="graphic-wrap">
            {this.mainImage !== null ? (
              <div class="image-wrap" role="presentation" style={{ 'background-image': 'url(' + this.mainImage + ')', 'background-position': this.mainImageAlignHorizontal + ' ' + this.mainImageAlignVertical }}>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
