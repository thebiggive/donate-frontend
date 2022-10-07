/* eslint-disable prettier/prettier */
import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-hero-image',
  styleUrl: 'biggive-hero-image.scss',
  shadow: true,
})
export class BiggiveHeroImage {
  /**
   * Colour Scheme
   */
   @Prop() colourScheme: string = 'primary';

  /**
   * Header slug
   */
   @Prop() slug: string = null;

  /**
   * Full URL of a logo image.
   */
   @Prop() logo: string = '';

  /**
   * Full URL of a main hero image.
   */
  @Prop() mainImage: string = '';

  /**
   * Hero image title, typically the page.
   */
  @Prop() mainTitle: string = null;

  /**
   * Introductory teaser text
   */
  @Prop() teaser: string = null;

  /**
   * Button Url
   */
   @Prop() buttonUrl: string = null;

  /**
   * Button Label
   */
   @Prop() buttonLabel: string = null;

  render() {
    return (
      <div class="container">
        <div class="sleeve">
          <div class="content-wrap">
            {this.logo.length > 0 ? (
              <div class="logo image-wrap" style={{ 'background-image': 'url(' + this.logo + ')' }}>
                <img src={this.logo} />
              </div>
            ) : null}
            <div class={'slug colour-'+this.colourScheme}>{this.slug}</div>
            <h1 class={'title colour-'+this.colourScheme}>{this.mainTitle}</h1>
            <div class="teaser">{this.teaser}</div>
            {this.buttonLabel != null && this.buttonUrl != null
              ? <biggive-button colour-scheme={this.colourScheme} url={this.buttonUrl} label={this.buttonLabel}></biggive-button>
              : null
            }
          </div>
          <div class="graphic-wrap">
            {this.mainImage.length > 0 ? (
              <div class="image-wrap" style={{ 'background-image': 'url(' + this.mainImage + ')' }}>
                <img src={this.mainImage} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
