import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-grid',
  styleUrl: 'biggive-grid.scss',
  shadow: true,
})
export class BiggiveGrid {
  /**
   * Column count
   */
  @Prop() columnCount: number = 3;

  /**
   * Column gap
   */
  @Prop() columnGap: number = 3;

  private getClasses() {
    return 'grid column-count-' + this.columnCount + ' column-gap-' + this.columnGap;
  }

  render() {
    return (
      <div class={this.getClasses()} data-column-count={this.columnCount} data-column-gap={this.columnGap}>
        <slot name="items"></slot>
      </div>
    );
  }
}
