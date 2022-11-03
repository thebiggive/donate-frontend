import { Component, Element, Method, h } from '@stencil/core';

@Component({
  tag: 'biggive-popup',
  styleUrl: 'biggive-popup.scss',
  shadow: true,
})
export class BiggivePopup {
  @Element() el;

  @Method()
  async open() {
    this.el.shadowRoot.querySelector('.popup').setAttribute('data-visible', 'true');
  }

  private close(event) {
    if (event.target.classList.contains('popup') || event.target.classList.contains('close')) {
      this.el.shadowRoot.querySelector('.popup').setAttribute('data-visible', 'false');
    }
  }

  render() {
    return (
      <div class="popup" onClick={event => this.close(event)}>
        <div class="sleeve">
          <div class="header">
            <div class="close" onClick={event => this.close(event)}></div>
          </div>
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    );
  }
}
