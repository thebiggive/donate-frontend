import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-section',
  styleUrl: 'biggive-section.scss',
  shadow: true,
})
export class BiggiveSection {
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
  @Prop() colourScheme: string = 'primary';

  /**
   * Space after
   */
  @Prop() spaceAfter: number = 4;

  render() {
    return (
      <div
        class={
          'container space-after-' + this.spaceAfter + ' background-color-' + this.colourScheme + ' style-top-' + this.sectionStyleTop + ' style-bottom-' + this.sectionStyleBottom
        }
      >
        <div class="sleeve">
          <slot name="children"></slot>
        </div>
      </div>
    );
  }
}
