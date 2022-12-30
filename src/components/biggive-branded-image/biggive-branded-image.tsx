import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-branded-image',
  styleUrl: 'biggive-branded-image.scss',
  shadow: true,
})
export class BiggiveBrandedImage {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;
  /**
   * Full URL of a image.
   */
  @Prop() imageUrl: string = '';

  /**
   * Full URL of the logo.
   */
  @Prop() logoUrl: string = '';

  /**
   * Slug
   */
  @Prop() slug: string = null;

  /**
   * Charity name
   */
  @Prop() charityName: string = null;

  /**
   * Charity location
   */
  @Prop() charityLocation: string = null;

  /**
   * Link to the charity's website
   */
  @Prop() charityUrl: string = null;

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        {this.slug !== null ? <div class="slug">{this.slug}</div> : null}
        {this.imageUrl !== undefined && this.imageUrl !== null ? (
          <div class="image-wrap">
            <img src={this.imageUrl} />
          </div>
        ) : null}
        {this.logoUrl !== undefined && this.logoUrl !== null ? <div class="logo-wrap" style={{ 'background-image': "url('" + this.logoUrl + "')" }}></div> : null}

        {this.charityName !== undefined && this.charityName !== null ? (
          <a id="charityName" href={this.charityUrl} target="_blank">
            {this.charityName}
          </a>
        ) : null}
        {this.charityLocation !== undefined && this.charityLocation !== null ? <div class="charity-info">{this.charityLocation}</div> : null}
      </div>
    );
  }
}
