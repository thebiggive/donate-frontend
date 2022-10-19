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
  @Prop() colourScheme: string = null;

  render() {
    return (
      <div
        class={
          'container space-below-' + this.spaceBelow + ' background-color-' + this.colourScheme + ' style-top-' + this.sectionStyleTop + ' style-bottom-' + this.sectionStyleBottom
        }
      >
        <div class="sleeve">
          <slot></slot>
        </div>
      </div>
    );
  }
}
