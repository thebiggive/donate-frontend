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

  /**
   * Label
   */
  @Prop() label: string;

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        {this.label != null ? <div class="label">{this.label}</div> : null}
        <div class="sleeve">
          <slot></slot>
        </div>
      </div>
    );
  }
}
