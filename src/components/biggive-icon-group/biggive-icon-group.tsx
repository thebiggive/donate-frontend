import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-icon-group',
  styleUrl: 'biggive-icon-group.scss',
  shadow: true,
})
export class BiggiveIconGroup {
  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <slot></slot>
      </div>
    );
  }
}
