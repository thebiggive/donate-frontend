import { Component, Prop, h } from '@stencil/core';
import { brandColour } from '../../globals/brand-colour';
import { spacingOption } from '../../globals/spacing-option';

@Component({
  tag: 'biggive-table',
  styleUrl: 'biggive-table.scss',
  shadow: false,
})
export class BiggiveTable {
  @Prop() spaceBelow: spacingOption = 0;

  @Prop() headerTextColour: brandColour = 'primary';

  @Prop() headerBackgroundColour: brandColour = 'white';

  @Prop() bodyTextColour: brandColour = 'black';

  @Prop() bodyBackgroundColour: brandColour = 'grey-light';

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
