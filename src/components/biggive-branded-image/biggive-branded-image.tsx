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
   * Full URL of a image.
   */
  @Prop() logoUrl: string = '';

  /**
   * Slug
   */
  @Prop() slug: string = null;

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="slug">{this.slug}</div>
        {this.imageUrl.length > 0 ? (
          <div class="image-wrap">
            <img src={this.imageUrl} />
          </div>
        ) : null}
        {this.logoUrl.length > 0 ? <div class="logo-wrap" style={{ 'background-image': "url('" + this.logoUrl + "')" }}></div> : null}
      </div>
    );
  }
}
