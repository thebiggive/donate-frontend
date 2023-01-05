/* eslint-disable prettier/prettier */
import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-hero-image',
  styleUrl: 'biggive-hero-image.scss',
  shadow: true,
})
export class BiggiveHeroImage {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  /**
   * Colour Scheme
   */
   @Prop() colourScheme: string = 'primary';

  /**
   * Header slug
   */
   @Prop() slug: string;

  /**
   * Header slug colour
   */
   @Prop() slugColour: string;

  /**
   * Full URL of a logo image.
   */
   @Prop() logo: string = '';

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
   @Prop() mainTitleColour: string;
  /**
   * Introductory teaser text
   */
  @Prop() teaser: string;
  /**
   * Teaser colour
   */
   @Prop() teaserColour: string;
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
  @Prop() buttonColourScheme: string = 'primary';


  render() {
    return (
      <div class={'container colour-scheme-' + this.colourScheme + ' space-below-' + this.spaceBelow}>
        <div class="sleeve">
          <div class="content-wrap">
            {this.logo !== undefined && this.logo !== null ? (
              <div class="logo image-wrap">
                <img src={this.logo} alt={this.logoAltText} title={this.logoAltText}/>
              </div>
            ) : <div class="logo-space"></div>}
            <div class={'slug text-colour-'+this.slugColour}>{this.slug}</div>
            <h1 class={'main-title text-colour-'+this.mainTitleColour}>{this.mainTitle}</h1>
            <div class={'teaser text-colour-'+this.teaserColour}>{this.teaser}</div>
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
