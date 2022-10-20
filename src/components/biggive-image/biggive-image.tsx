import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-image',
  styleUrl: 'biggive-image.scss',
  shadow: true,
})
export class BiggiveImage {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  /**
   * Full URL of a image.
   */
  @Prop() imageUrl: string = '';

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="image-wrap">
          <img src={this.imageUrl} />
        </div>
      </div>
    );
  }
}
