import { Component, Host, h } from '@stencil/core';

@Component({
  tag: 'biggive-form-field-select',
  styleUrl: 'biggive-form-field-select.css',
  shadow: true,
})
export class BiggiveFormFieldSelect {

  render() {
    return (
      <Host>
        <slot></slot>
      </Host>
    );
  }

}
