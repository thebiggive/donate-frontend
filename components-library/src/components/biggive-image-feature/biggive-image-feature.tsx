import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-image-feature',
  styleUrl: 'biggive-image-feature.scss',
  shadow: true,
})
export class BiggiveImageFeature {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;
  /**
   * Default text colour
   */
  @Prop() defaultTextColour: string = 'primary';

  /**
   * Full URL of a image.
   */
  @Prop() imageUrl: string = '';

  /**
   * Image alt text tag.
   */
  @Prop() imageAltText: string = '';

  /**
   * Slug
   */
  @Prop() slug: string;

  /**
   * Slug colour
   */
  @Prop() slugColour: string = '';

  /**
   * Video title
   */
  @Prop() mainTitle: string;

  /**
   * Slug colour
   */
  @Prop() mainTitleColour: string = '';

  /**
   * Introductory teaser text
   */
  @Prop() teaser: string;

  /**
   * Teaser colour
   */
  @Prop() teaserColour: string = '';

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
      <div class={'container text-colour-' + this.defaultTextColour + ' space-below-' + this.spaceBelow}>
        <div class="sleeve">
          <div class="content-wrap">
            <div class={'slug text-colour-' + this.slugColour}>{this.slug}</div>
            <h2 class={'title text-colour-' + this.mainTitleColour}>{this.mainTitle}</h2>
            <div class={'teaser text-colour-' + this.teaserColour}>{this.teaser}</div>
            {this.buttonLabel != null && this.buttonUrl != null ? (
              <biggive-button colour-scheme={this.buttonColourScheme} url={this.buttonUrl} label={this.buttonLabel}></biggive-button>
            ) : null}
          </div>
          <div class="graphic-wrap">
            {this.imageUrl !== null && this.imageUrl !== undefined ? (
              <div class="image-wrap">
                <img src={this.imageUrl} alt={this.imageAltText} />
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
