import { Component, Host, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-section',
  styleUrl: 'biggive-section.scss',
  shadow: true,
})
export class BiggiveSection {
  /**
   * Section style
   */
  @Prop() sectionStyle: string = '';

  /**
   * Colour scheme
   */
  @Prop() colourScheme: string = 'primary';

  render() {
    return (
      <Host>
        <div class="container">
          <slot></slot>
        </div>
      </Host>
    );
  }
}
