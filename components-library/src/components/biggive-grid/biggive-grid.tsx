import { Component, Prop, h } from '@stencil/core';
import { spacingOption } from '../../globals/spacing-option';

@Component({
  tag: 'biggive-grid',
  styleUrl: 'biggive-grid.scss',
  shadow: true,
})
export class BiggiveGrid {
  @Prop() spaceBelow: number = 4;

  @Prop() columnCount: number = 3;

  /**
   * Deprecated - should use columGap Instead
   */
  @Prop() spaceBetween: boolean = false;

  @Prop() columnGap: spacingOption = 0;

  render() {
    return (
      <div class={'grid column-count-' + this.columnCount + ' space-below-' + this.spaceBelow + ' column-gap-' + this.columnGap + (this.spaceBetween ? ' space-between' : '')}>
        <slot></slot>
      </div>
    );
  }
}
