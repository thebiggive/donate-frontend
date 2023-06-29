import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-page-section',
  styleUrl: 'biggive-page-section.scss',
  shadow: true,
})
export class BiggivePageSection {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  /**
   * Section style top
   */
  @Prop() sectionStyleTop: string = 'straight';

  /**
   * Section style bottom
   */
  @Prop() sectionStyleBottom: string = 'straight';

  /**
   * Colour scheme
   */
  @Prop() colourScheme: string;

  /**
   * Width
   */
  @Prop() maxWidth: number = 100;

  /**
   * Bleeds the primary brand colour to the left and right edge of the viewport, even if used within a containing block element.
   */
  @Prop() primaryFullBleed: boolean = false;

  render() {
    return (
      <div
        class={
          'container max-width-' +
          this.maxWidth +
          ' space-below-' +
          this.spaceBelow +
          ' background-color-' +
          this.colourScheme +
          ' style-top-' +
          this.sectionStyleTop +
          ' style-bottom-' +
          this.sectionStyleBottom +
          (this.primaryFullBleed ? ' full-bleed' : '')
        }
      >
        <div class="sleeve">
          <slot></slot>
        </div>
      </div>
    );
  }
}
