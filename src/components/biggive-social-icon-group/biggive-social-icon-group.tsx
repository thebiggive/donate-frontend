import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-social-icon-group',
  styleUrl: 'biggive-social-icon-group.scss',
  shadow: true,
})
export class BiggiveSocialIconGroup {
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
