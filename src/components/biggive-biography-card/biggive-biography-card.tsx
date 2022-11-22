import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-biography-card',
  styleUrl: 'biggive-biography-card.scss',
  shadow: true,
})
export class BiggiveBiographyCard {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  /**
   * Full URL of the main image.
   */
  @Prop() imageUrl: string = '';

  /**
   * Job title
   */
  @Prop() fullName: string = '';

  /**
   * Job title
   */
  @Prop() jobTitle: string = '';

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        {this.imageUrl != '' ? (
          <div class="image-wrap" style={{ 'background-image': "url('" + this.imageUrl + "')" }}>
            <img src={this.imageUrl} alt={this.fullName} title={this.fullName} />
          </div>
        ) : null}
        <h3 class="full-name">{this.fullName}</h3>
        <div class="job-title">{this.jobTitle}</div>
      </div>
    );
  }
}
