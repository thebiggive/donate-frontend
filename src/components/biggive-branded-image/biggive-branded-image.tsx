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

  /**
   * The name of the champion funder
   */
  @Prop() championName: string = null;

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
          <a id="charityName" href={this.charityUrl} target="_blank">
            {this.charityName}
          </a>
        ) : null}
        {this.charityLocation !== undefined ? <div class="charity-info">{this.charityLocation}</div> : null}
        {this.championName !== undefined ? <div class="charity-info">Championed by: {this.championName}</div> : null}
      </div>
    );
  }
}
