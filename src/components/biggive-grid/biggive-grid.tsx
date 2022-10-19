import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-grid',
  styleUrl: 'biggive-grid.scss',
  shadow: true,
})
export class BiggiveGrid {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 4;

  /**
   * Number of columns in grid
   */
  @Prop() columnCount: number = 3;

  /**
   * Gap between columns, based on spacer CSS variable
   */
  @Prop() columnGap: number = 3;

  render() {
    return (
      <div class={'grid column-count-' + this.columnCount + ' column-gap-' + this.columnGap + ' space-below-' + this.spaceBelow}>
        <slot></slot>
      </div>
    );
  }
}
