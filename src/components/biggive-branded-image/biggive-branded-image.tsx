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

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="slug">{this.slug}</div>
        {this.imageUrl !== undefined ? (
          <div class="image-wrap">
            <img src={this.imageUrl} />
          </div>
        ) : null}
        {this.logoUrl.length > 0 ? <div class="logo-wrap" style={{ 'background-image': "url('" + this.logoUrl + "')" }}></div> : null}

        {this.charityName !== undefined ? (
          <a id="charityName" href="">
            {this.charityName}
          </a>
        ) : null}

        {this.charityLocation !== undefined ? <div id="charityLocation">{this.charityLocation}</div> : null}
      </div>
    );
  }
}
