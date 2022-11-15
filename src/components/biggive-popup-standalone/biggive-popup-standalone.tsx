import { Component, h } from '@stencil/core';

@Component({
  tag: 'biggive-popup-standalone',
  styleUrl: 'biggive-popup-standalone.scss',
  shadow: true,
})
export class BiggivePopupStandalone {
  render() {
    return (
      <div class="popup">
        <div class="sleeve">
          <div class="header">
            <div class="close"></div>
          </div>
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    );
  }
}
