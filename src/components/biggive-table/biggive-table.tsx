import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-table',
  styleUrl: 'biggive-table.scss',
  shadow: false,
})
export class BiggiveTable {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  /**
   * Header text colour
   */
  @Prop() headerTextColour: string = 'primary';

  /**
   * Header background colour
   */
  @Prop() headerBackgroundColour: string = 'white';

  /**
   * Body text colour
   */
  @Prop() bodyTextColour: string = 'black';

  /**
   * Body background colour
   */
  @Prop() bodyBackgroundColour: string = 'grey-light';

  render() {
    return (
      <div
        class={
          'container header-text-colour-' +
          this.headerTextColour +
          ' header-background-colour-' +
          this.headerBackgroundColour +
          ' body-text-colour-' +
          this.bodyTextColour +
          ' body-background-colour-' +
          this.bodyBackgroundColour +
          ' space-below-' +
          this.spaceBelow
        }
      >
        <slot></slot>
      </div>
    );
  }
}
