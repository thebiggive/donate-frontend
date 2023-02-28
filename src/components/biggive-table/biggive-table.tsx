import { Component, Prop, h } from '@stencil/core';
//import { ColourPaletteService } from '../../util/colour-palette';

@Component({
  tag: 'biggive-table',
  styleUrl: 'biggive-table.scss',
  shadow: false,
})
export class BiggiveTable {
  //allColours = ColourPaletteService['allColours'];

  @Prop() spaceBelow: number = 0;

  @Prop() headerTextColour:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'brand-1'
    | 'brand-2'
    | 'brand-3'
    | 'brand-4'
    | 'brand-5'
    | 'brand-6'
    | 'black'
    | 'white'
    | 'grey-light'
    | 'grey-dark' = 'primary';

  @Prop() headerBackgroundColour:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'brand-1'
    | 'brand-2'
    | 'brand-3'
    | 'brand-4'
    | 'brand-5'
    | 'brand-6'
    | 'black'
    | 'white'
    | 'grey-light'
    | 'grey-dark' = 'white';

  @Prop() bodyTextColour:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'brand-1'
    | 'brand-2'
    | 'brand-3'
    | 'brand-4'
    | 'brand-5'
    | 'brand-6'
    | 'black'
    | 'white'
    | 'grey-light'
    | 'grey-dark' = 'black';

  @Prop() bodyBackgroundColour:
    | 'primary'
    | 'secondary'
    | 'tertiary'
    | 'brand-1'
    | 'brand-2'
    | 'brand-3'
    | 'brand-4'
    | 'brand-5'
    | 'brand-6'
    | 'black'
    | 'white'
    | 'grey-light'
    | 'grey-dark' = 'grey-light';

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
