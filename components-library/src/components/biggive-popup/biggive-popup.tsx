import { Component, Element, Method, h } from '@stencil/core';

@Component({
  tag: 'biggive-popup',
  styleUrl: 'biggive-popup.scss',
  shadow: true,
})
export class BiggivePopup {
  @Element() el;

  @Method()
  async openFromOutside() {
    this.el.shadowRoot.querySelector('.popup').setAttribute('data-visible', 'true');
  }

  @Method()
  async closeFromOutside() {
    this.el.shadowRoot.querySelector('.popup').setAttribute('data-visible', 'false');
  }

  private closeFromWithin = (event: any) => {
    if (event.target.classList.contains('popup') || event.target.classList.contains('close')) {
      this.el.shadowRoot.querySelector('.popup').setAttribute('data-visible', 'false');
    }
  };

  render() {
    return (
      <div class="popup" onClick={this.closeFromWithin}>
        <div class="sleeve">
          <div class="header">
            <div class="close" onClick={this.closeFromWithin}></div>
          </div>
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    );
  }
}
