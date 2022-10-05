import { Component, Prop, h } from '@stencil/core';

@Component({
  tag: 'biggive-progress-bar',
  styleUrl: 'biggive-progress-bar.scss',
  shadow: true,
})
export class BiggiveProgressBar {
  /**
   * Colour Scheme
   */
  @Prop() colourScheme: string = 'primary';

  /**
   * Text
   */
  @Prop() counter: number = 100;

  private getPercentage(): number {
    return Math.round(this.counter);
  }

  private getClasses(): string {
    return 'progress-bar progress-bar-' + this.colourScheme;
  }

  render() {
    return (
      <div class={this.getClasses()}>
        <div class="slider">
          <div class="progress" style={{ width: this.getPercentage() + '%' }}></div>
        </div>
        <div class="counter">{this.getPercentage()}%</div>
      </div>
    );
  }
}
