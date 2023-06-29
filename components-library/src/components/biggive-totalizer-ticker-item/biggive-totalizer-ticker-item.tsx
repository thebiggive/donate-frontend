import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-totalizer-ticker-item',
  styleUrl: 'biggive-totalizer-ticker-item.scss',
  shadow: true,
})
export class BiggiveTotalizerTickerItem {
  /**
   * Figure
   */
  @Prop() figure: string;

  /**
   * Figure
   */
  @Prop() label: string;

  render() {
    return (
      <div class="ticker-item">
        <strong>{this.figure}</strong> {this.label}
      </div>
    );
  }
}
