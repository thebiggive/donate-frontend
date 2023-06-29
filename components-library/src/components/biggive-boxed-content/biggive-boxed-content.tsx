import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-boxed-content',
  styleUrl: 'biggive-boxed-content.scss',
  shadow: true,
})
export class BiggiveBoxedContent {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;
  /**
   * Vertical padding
   */
  @Prop() verticalPadding: number = 3;
  /**
   * Horizontal padding
   */
  @Prop() horizontalPadding: number = 3;
  /**
   * Background colour
   */
  @Prop() backgroundColour: string = 'white';
  /**
   * Shadow
   */
  @Prop() shadow: boolean = true;

  render() {
    return (
      <div
        class={
          'container background-colour-' +
          this.backgroundColour +
          ' space-below-' +
          this.spaceBelow +
          ' horizontal-padding-' +
          this.horizontalPadding +
          ' vertical-padding-' +
          this.verticalPadding +
          ' shadow-' +
          this.shadow
        }
      >
        <slot></slot>
      </div>
    );
  }
}
