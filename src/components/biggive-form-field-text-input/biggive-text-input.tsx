import { Component, h, Prop } from '@stencil/core';

@Component({
  tag: 'biggive-text-input',
  styleUrl: 'biggive-text-input.scss',
  shadow: true,
})
export class BiggiveTextInput {
  @Prop() value: string;
  @Prop() prefix: string = '';
  @Prop() spaceBelow: number = 0;
  @Prop() selectStyle: 'bordered' | 'underlined' = 'bordered';

  render() {
    return (
      <div class={'dropdown space-below-' + this.spaceBelow + ' select-style-' + this.selectStyle}>
        <div class="sleeve">
          <div class="placeholder">
            <span class="" style={{ float: 'left' }}>
              {this.prefix}
            </span>
            <input value={this.value} style={{ float: 'right' }} />
            <div style={{ clear: 'both' }}></div>
          </div>
        </div>
      </div>
    );
  }
}
