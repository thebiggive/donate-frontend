import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'biggive-form',
  styleUrl: 'biggive-form.css',
  shadow: true,
})
export class BiggiveForm {
  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }
}
