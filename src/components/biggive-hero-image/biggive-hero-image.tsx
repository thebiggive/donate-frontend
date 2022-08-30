/* eslint-disable prettier/prettier */
import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-hero-image',
  styleUrl: 'biggive-hero-image.scss',
  shadow: true,
})
export class BiggiveHeroImage {
  /**
   * Header slug
   */
  @Prop() slug: string = null;

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

  render() {
    return (
      <div class="container">
        <div class="sleeve">
          <div class="content-wrap">
            <div class="slug">{this.slug}</div>
            <h1 class="title">{this.mainTitle}</h1>
            <div class="teaser">{this.teaser}</div>
          </div>
          <div class="image-wrap">
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
