import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-page-columns',
  styleUrl: 'biggive-page-columns.scss',
  shadow: true,
})
export class BiggivePageColumns {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="columns">
          <div class="column-primary">
            <slot name="column-primary"></slot>
          </div>
          <div class="column-secondary">
            <slot name="column-secondary"></slot>
          </div>
        </div>
      </div>
    );
  }
}
