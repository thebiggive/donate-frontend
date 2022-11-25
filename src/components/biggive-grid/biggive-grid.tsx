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
   * Should have `justify-content: space-between`?
   */
  @Prop() spaceBetween: boolean = false;

  render() {
    return (
      <div class={'grid column-count-' + this.columnCount + ' space-below-' + this.spaceBelow + (this.spaceBetween ? ' space-between' : null)}>
        <slot></slot>
      </div>
    );
  }
}
