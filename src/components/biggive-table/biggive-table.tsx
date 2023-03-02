import { Component, Prop, h } from '@stencil/core';
import { brandColours } from '../../globals/brand-colours';

@Component({
  tag: 'biggive-table',
  styleUrl: 'biggive-table.scss',
  shadow: false,
})
export class BiggiveTable {
  @Prop() spaceBelow: number = 0;

  @Prop() headerTextColour: brandColours = 'primary';

  @Prop() headerBackgroundColour: brandColours = 'white';

  @Prop() bodyTextColour: brandColours = 'black';

  @Prop() bodyBackgroundColour: brandColours = 'grey-light';

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
