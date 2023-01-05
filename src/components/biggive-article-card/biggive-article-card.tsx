import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-article-card',
  styleUrl: 'biggive-article-card.scss',
  shadow: true,
})
export class BiggiveArticleCard {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;
  /**
   * Card background colour
   */
  @Prop() backgroundColour: string = 'white';
  /**
   * Card background colour hover
   */
  @Prop() backgroundColourHover: string = 'tertiary';
  /**
   * Text colour
   */
  @Prop() textColour: string = 'black';
  /**
   * Slug
   */
  @Prop() slug: string;
  /**
   * Date
   */
  @Prop() date: string;
  /**
   * Main title
   */
  @Prop() mainTitle: string;
  /**
   * Image URL
   */
  @Prop() imageUrl: string;
  /**
   * Image Alt Text
   */
  @Prop() imageAltText: string;
  /**
   * Image Label
   */
  @Prop() imageLabel: string;
  /**
   * Button label
   */
  @Prop() buttonLabel: string;

  /**
   * Button URL
   */
  @Prop() buttonUrl: string;

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class={'sleeve background-colour-' + this.backgroundColour + ' background-colour-hover-' + this.backgroundColourHover + ' text-colour-' + this.textColour}>
          <div class="content-wrap">
            {this.slug != '' ? <div class="slug text-colour-primary">{this.slug}</div> : null}
            {this.date != '' ? <div class="date">{this.date}</div> : null}
            <h3 class="title">
              <a href={this.buttonUrl}>{this.mainTitle}</a>
            </h3>
            {this.imageUrl != '' ? (
              <div class="image-group">
                <div class="image-wrap" style={{ 'background-image': "url('" + this.imageUrl + "')" }}>
                  <img src={this.imageUrl} alt={this.imageAltText} title={this.imageAltText} />
                </div>
                <div class="image-label">{this.imageLabel}</div>
              </div>
            ) : null}

            {this.buttonLabel != null && this.buttonUrl != null ? (
              <div class="button-wrap align-right">
                <biggive-button colour-scheme={'clear-primary'} url={this.buttonUrl} label={this.buttonLabel}></biggive-button>
              </div>
            ) : null}
          </div>
        </div>
      </div>
    );
  }
}
