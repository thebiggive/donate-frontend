import { Component, Element, h, Method, Prop } from '@stencil/core';

@Component({
  tag: 'biggive-header',
  styleUrl: 'biggive-header.scss',
  shadow: true,
})
export class BiggiveHeader {
  @Element() host: HTMLBiggiveHeaderElement;

  /**
   * Space below component
   */
  @Prop() spaceBelow: number = 0;

  /**
   * Logo hyperlink URL
   */
  @Prop() logoUrl: string = '/';

  @Method()
  async closeMenuFromOutside() {
    this.host.shadowRoot.querySelector('.nav-primary').setAttribute('data-visible', 'false');
    this.host.shadowRoot.querySelector('.nav-toggle').classList.remove('active');
    this.host.shadowRoot.querySelector('.row-top').setAttribute('data-visible', 'false');
  }

  private toggleNav = (event: any) => {
    var nav = this.host.shadowRoot.querySelector('.nav-primary');
    var navFooter = this.host.shadowRoot.querySelector('.row-top');
    if (nav.getAttribute('data-visible') == 'true') {
      event.target.classList.remove('active');
      nav.setAttribute('data-visible', 'false');
      navFooter.setAttribute('data-visible', 'false');
    } else {
      event.target.classList.add('active');
      nav.setAttribute('data-visible', 'true');
      navFooter.setAttribute('data-visible', 'true');
    }
  };

  appendMenu(menuName: string) {
    var node = this.host.querySelector(`[slot="${menuName}"]`);
    if (node !== null) {
      this.host.shadowRoot.querySelector(`nav.${menuName}`).appendChild(node);
    }
  }

  componentDidRender() {
    this.appendMenu('nav-primary');
    this.appendMenu('nav-secondary');
  }

  render() {
    return (
      <header class={'header space-below' + this.spaceBelow}>
        <div class="row row-top">
          <div class="social-icon-wrap">
            <slot name="social-icons"></slot>
          </div>
          <nav class="nav nav-secondary"></nav>
        </div>
        <div class="row row-bottom">
          <div class="logo-wrap">
            <a href={this.logoUrl} aria-label="Home">
              <svg version="1.1" x="0px" y="0px" viewBox="0 0 140.9 30">
                <path d="M51.9,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3C53.6,0,55,1.4,55,3S53.6,6.1,51.9,6.1z M49.3,23.8h5V7.7h-5V23.8z M68.5,7.7v1 c-0.8-0.7-2.3-1.4-4.1-1.4c-4.5,0-8.2,3.2-8.2,7.9c0,4.7,3.7,7.9,8.2,7.9c1.8,0,3.4-0.5,4.1-1.4v0.9c0,2.1-1.9,3.1-4.4,3.1 c-2.2,0-4-0.5-5.8-1.4V29c2.1,0.7,4.4,1,6,1c5,0,9.2-2,9.2-7.3v-15L68.5,7.7L68.5,7.7z M68.5,17.2c-0.7,1-1.9,1.4-3.2,1.4 c-2.1,0-3.8-1.2-3.8-3.4c0-2.2,1.7-3.4,3.8-3.4c1.3,0,2.5,0.6,3.2,1.5V17.2z M88.1,24.2c4,0,6.4-0.7,8.5-2V10h-11v4.7h5.8v4.1 c-0.8,0.2-1.8,0.4-3.2,0.4c-4.9,0-7.3-3.2-7.3-6.8c0-3.7,2.8-6.8,8-6.8c2.2,0,4.3,0.6,5.8,1.4V1.7c-1.5-0.6-3.4-1.1-6.1-1.1 c-7.6,0-13,5.3-13,11.8C75.5,19.1,80.4,24.2,88.1,24.2z M101.4,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3c1.8,0,3.2,1.4,3.2,3 S103.1,6.1,101.4,6.1z M98.8,23.8h5V7.7h-5V23.8z M115.1,15l-4.3-7.2H105l10.1,16.4l10.1-16.4h-5.8L115.1,15z M129.3,16.9h11.6 c0.1-7-4.2-9.5-8.4-9.5c-4.5,0-8.5,2.6-8.6,8.4c0,5.6,4.1,8.4,9.1,8.4c2.2,0,4.4-0.3,6.4-1.3v-4.4c-2.5,1.4-4.1,1.4-5.6,1.4 C131.7,19.8,129.5,19.2,129.3,16.9z M132.5,11.1c1.5,0,2.8,0.7,3,2.7h-6.2C129.6,11.9,131,11.1,132.5,11.1z M43.5,11.4 c1.2-1,1.8-2.4,1.8-4c0-3.1-3-6.3-7.3-6.3h-8v22.8h10.4c4.1,0,7.2-3,7.2-6.8C47.5,14.8,46.5,12.3,43.5,11.4z M35.2,5.7h2.4 C39,5.7,40,6.8,40,8c0,1.2-1,2.2-2.5,2.2h-2.4V5.7z M39.9,19.2h-4.7v-4.6h4.7c1.4,0,2.5,1,2.5,2.3C42.4,18.1,41.3,19.2,39.9,19.2z" />
                <path d="M13.5,1l13.5,23H0L13.5,1z" />
              </svg>
            </a>
          </div>
          <div class="nav-toggle" onClick={this.toggleNav}></div>
          <nav class="nav nav-primary" data-visible="false"></nav>
        </div>
      </header>
    );
  }
}
