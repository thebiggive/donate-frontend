import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-image',
  styleUrl: 'biggive-image.scss',
  shadow: true,
})
export class BiggiveImage {
  /**
   * Space above component
   */
  @Prop() spaceAbove: number = 0;

  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  /**
   * Full URL of a image.
   */
  @Prop() imageUrl: string = '';

  /**
   * Image alt text tag.
   */
  @Prop() imageAltText: string = '';

  /**
   * Image width
   */
  @Prop() width: number = 0;

  /**
   * Image width
   */
  @Prop() height: number = 0;

  /**
   * Size unit
   */
  @Prop() sizeUnit: string = 'px';

  getWidth(): string {
    var width = 'auto';
    if (this.width > 0) {
      width = this.width + this.sizeUnit;
    }
    return width;
  }

  getHeight(): string {
    var height = 'auto';
    if (this.height > 0) {
      height = this.height + this.sizeUnit;
    }
    return height;
  }

  render() {
    return (
      <div class={'container space-above-' + this.spaceAbove + ' space-below-' + this.spaceBelow} style={{ width: this.getWidth(), height: this.getHeight() }}>
        <div class="image-wrap">
          <img src={this.imageUrl} style={{ width: this.getWidth(), height: this.getHeight() }} alt={this.imageAltText} />
        </div>
      </div>
    );
  }
}
