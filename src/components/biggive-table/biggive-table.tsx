import { Component, Prop, h } from '@stencil/core';
import { ColourPaletteService } from '../../util/colour-palette';

@Component({
  tag: 'biggive-table',
  styleUrl: 'biggive-table.scss',
  shadow: false,
})
export class BiggiveTable {

 

  @Prop() spaceBelow: number = 0;

  @Prop() headerTextColour: String = 'primary';

  @Prop() headerBackgroundColour: String = 'white';

  @Prop() bodyTextColour: String = 'black';

  @Prop() bodyBackgroundColour: String = 'grey-light';

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
