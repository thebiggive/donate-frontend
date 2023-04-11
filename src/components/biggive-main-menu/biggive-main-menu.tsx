import { Component, Element, h, Host, Method, Prop } from '@stencil/core';
import { makeURL } from '../../util/helper-methods';

@Component({
  tag: 'biggive-main-menu',
  styleUrl: 'biggive-main-menu.scss',
  shadow: true,
})
export class BiggiveMainMenu {
  @Element() host: HTMLBiggiveMainMenuElement;

  // URL prefixes vary by environment, and components library is not best placed to know what they are, so we
  // take them as props
  @Prop() blogUrlPrefix: string | undefined;

  /**
   * E.g. "https://donate.thebiggive.org.uk" for production (currently)
   */
  @Prop() donateUrlPrefix: string | undefined;

  @Prop() experienceUrlPrefix: string | undefined;

  /**
   * Whether the current user is logged in (i.e. is assumed to have a valid JWT). They get links to some
   * extra content if they are.
   */
  @Prop() isLoggedIn = false;

  @Prop() logoUrl: string = '/';

  /**
   * If true, content passed in via slots will be ignored, and this will just render a hard-coded menu
   * that's the same everywhere. When BG2-2286 is done this will be permantly true and the prop will be deleted.
   */
  @Prop() usePresetMenuContent = false;

  openMobileMenu = () => {
    const mobileMenu = this.host.shadowRoot!.querySelector<HTMLElement>('.nav-links');
    mobileMenu!.style.left = '0';
  };

  closeMobileMenu = () => {
    const mobileMenu = this.host.shadowRoot!.querySelector<HTMLElement>('.nav-links');
    mobileMenu!.style.left = '-100%';
  };

  @Method()
  async closeMobileMenuFromOutside() {
    const mobileMenu = this.host.shadowRoot!.querySelector<HTMLElement>('.nav-links');
    mobileMenu!.style.left = '-100%';
  }

  appendPrimaryNavigationLinks() {
    // get the slotted 'nav-primary' node
    const node = this.host.querySelector(`[slot="nav-primary"]`);

    if (node !== null) {
      // Slot the menu
      this.host.shadowRoot!.querySelector('#nav-primary')!.appendChild(node);
    }
  }
  noNav(event: Event) {
    event.preventDefault();
  }

  /**
   * Slots the 'nav-secondary' slot into the top right corner of the blue nav bar.
   * Also slots the 'nav-secondary' into the normal menu items when in mobile mode.
   * This is because the blue bar disappears in mobile mode, so we need the items
   * init to still be seen, hence they're auto-added to the menu.
   */
  appendNavSecondaryLinks() {
    // get the slotted 'nav-secondary' node
    const node = this.host.querySelector(`[slot="nav-secondary"]`);

    if (node !== null) {
      // add to blue bar
      this.host.shadowRoot!.querySelector('.nav-secondary')!.appendChild(node);

      // we must make a deep clone of the node above, because each node is only
      // injectable / slottable into one place, but we need to slot into two places.
      const nodeClone = node.cloneNode(true) as HTMLElement;

      // add to main menu links, but only viewable in mobile mode. The css class
      // hides them in desktop!
      nodeClone.querySelectorAll('li').forEach(child => {
        child.classList.add('mobile-only');
        this.host!.shadowRoot!.querySelector('.links')!.appendChild(child);
      });
    }
  }

  setHeaderSize() {
    // Some resize edge cases lead Firefox, and maybe others, to go haywire and get a host offset
    // height of millions of pixels, presumably due to a layout logic loop. So for as long as we use
    // this body padding workaround, we need a safe maximum value, currently 130px, beyond which
    // we will never further displace the main content.
    document.body.style.paddingTop = Math.min(130, this.host.offsetHeight).toString() + 'px';
  }

  componentDidRender() {
    this.host.classList.add('fixed');
    window.addEventListener('resize', () => {
      this.setHeaderSize();
    });
    this.setHeaderSize();

    const subMenuElements = this.host.shadowRoot!.querySelectorAll<HTMLElement>('.sub-menu');
    if (subMenuElements.length === 0) {
      console.error('Missing subMenuElements');
    }

    subMenuElements.forEach(subMenuElement => {
      // the subMenuLink is a sibling element to the actual sub-menu
      const subMenuLink = subMenuElement.parentElement?.querySelector('a');

      subMenuLink!.onclick = () => {
        const subMenuArrow = subMenuLink!.querySelector('.sub-menu-arrow');
        subMenuArrow!.classList.toggle('transform-90');
        subMenuElement.classList.toggle('display-sub-menu');
      };
    });

    const subSubMenuElements = this.host.shadowRoot!.querySelectorAll<HTMLElement>('.sub-sub-menu');

    if (subSubMenuElements.length === 0) {
      console.error('Missing subSubMenuElements');
    }

    subSubMenuElements.forEach(subSubMenuElement => {
      // the subSubMenuLink is a sibling element to the actual sub-sub-menu
      const subSubMenuLink = subSubMenuElement!.parentElement!.querySelector('a');

      subSubMenuLink!.onclick = () => {
        const subMenuArrow = subSubMenuLink!.querySelector('.sub-sub-menu-arrow');
        subMenuArrow!.classList.toggle('transform-90');
        subSubMenuElement.classList.toggle('display-sub-menu');
      };
    });

    if (!this.usePresetMenuContent) {
      this.appendPrimaryNavigationLinks();
      this.appendNavSecondaryLinks();
    }
  }

  render() {
    const slotBasedMenu = () => (
      <Host>
        <div class="row row-top">
          <div class="social-icon-wrap">
            <slot name="social-icons"></slot>
          </div>
          <div class="nav-secondary"></div>
        </div>
        <nav role="navigation" aria-label="Main Menu">
          <div class="navbar">
            <div class="logo">
              <a href={this.logoUrl} aria-label="Home">
                <svg version="1.1" x="0px" y="0px" viewBox="0 0 140.9 30">
                  <path d="M51.9,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3C53.6,0,55,1.4,55,3S53.6,6.1,51.9,6.1z M49.3,23.8h5V7.7h-5V23.8z M68.5,7.7v1 c-0.8-0.7-2.3-1.4-4.1-1.4c-4.5,0-8.2,3.2-8.2,7.9c0,4.7,3.7,7.9,8.2,7.9c1.8,0,3.4-0.5,4.1-1.4v0.9c0,2.1-1.9,3.1-4.4,3.1 c-2.2,0-4-0.5-5.8-1.4V29c2.1,0.7,4.4,1,6,1c5,0,9.2-2,9.2-7.3v-15L68.5,7.7L68.5,7.7z M68.5,17.2c-0.7,1-1.9,1.4-3.2,1.4 c-2.1,0-3.8-1.2-3.8-3.4c0-2.2,1.7-3.4,3.8-3.4c1.3,0,2.5,0.6,3.2,1.5V17.2z M88.1,24.2c4,0,6.4-0.7,8.5-2V10h-11v4.7h5.8v4.1 c-0.8,0.2-1.8,0.4-3.2,0.4c-4.9,0-7.3-3.2-7.3-6.8c0-3.7,2.8-6.8,8-6.8c2.2,0,4.3,0.6,5.8,1.4V1.7c-1.5-0.6-3.4-1.1-6.1-1.1 c-7.6,0-13,5.3-13,11.8C75.5,19.1,80.4,24.2,88.1,24.2z M101.4,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3c1.8,0,3.2,1.4,3.2,3 S103.1,6.1,101.4,6.1z M98.8,23.8h5V7.7h-5V23.8z M115.1,15l-4.3-7.2H105l10.1,16.4l10.1-16.4h-5.8L115.1,15z M129.3,16.9h11.6 c0.1-7-4.2-9.5-8.4-9.5c-4.5,0-8.5,2.6-8.6,8.4c0,5.6,4.1,8.4,9.1,8.4c2.2,0,4.4-0.3,6.4-1.3v-4.4c-2.5,1.4-4.1,1.4-5.6,1.4 C131.7,19.8,129.5,19.2,129.3,16.9z M132.5,11.1c1.5,0,2.8,0.7,3,2.7h-6.2C129.6,11.9,131,11.1,132.5,11.1z M43.5,11.4 c1.2-1,1.8-2.4,1.8-4c0-3.1-3-6.3-7.3-6.3h-8v22.8h10.4c4.1,0,7.2-3,7.2-6.8C47.5,14.8,46.5,12.3,43.5,11.4z M35.2,5.7h2.4 C39,5.7,40,6.8,40,8c0,1.2-1,2.2-2.5,2.2h-2.4V5.7z M39.9,19.2h-4.7v-4.6h4.7c1.4,0,2.5,1,2.5,2.3C42.4,18.1,41.3,19.2,39.9,19.2z" />
                  <path d="M13.5,1l13.5,23H0L13.5,1z" />
                </svg>
              </a>
            </div>
            <biggive-misc-icon class="bx bx-menu" background-colour="white" icon-colour="black" icon="MenuOpen" onClick={this.openMobileMenu}></biggive-misc-icon>
            <div class="nav-links">
              <div class="sidebar-logo">
                <a href={this.logoUrl} aria-label="Home">
                  <svg version="1.1" x="0px" y="0px" viewBox="0 0 140.9 30" id="mobileLogo">
                    <path d="M51.9,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3C53.6,0,55,1.4,55,3S53.6,6.1,51.9,6.1z M49.3,23.8h5V7.7h-5V23.8z M68.5,7.7v1 c-0.8-0.7-2.3-1.4-4.1-1.4c-4.5,0-8.2,3.2-8.2,7.9c0,4.7,3.7,7.9,8.2,7.9c1.8,0,3.4-0.5,4.1-1.4v0.9c0,2.1-1.9,3.1-4.4,3.1 c-2.2,0-4-0.5-5.8-1.4V29c2.1,0.7,4.4,1,6,1c5,0,9.2-2,9.2-7.3v-15L68.5,7.7L68.5,7.7z M68.5,17.2c-0.7,1-1.9,1.4-3.2,1.4 c-2.1,0-3.8-1.2-3.8-3.4c0-2.2,1.7-3.4,3.8-3.4c1.3,0,2.5,0.6,3.2,1.5V17.2z M88.1,24.2c4,0,6.4-0.7,8.5-2V10h-11v4.7h5.8v4.1 c-0.8,0.2-1.8,0.4-3.2,0.4c-4.9,0-7.3-3.2-7.3-6.8c0-3.7,2.8-6.8,8-6.8c2.2,0,4.3,0.6,5.8,1.4V1.7c-1.5-0.6-3.4-1.1-6.1-1.1 c-7.6,0-13,5.3-13,11.8C75.5,19.1,80.4,24.2,88.1,24.2z M101.4,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3c1.8,0,3.2,1.4,3.2,3 S103.1,6.1,101.4,6.1z M98.8,23.8h5V7.7h-5V23.8z M115.1,15l-4.3-7.2H105l10.1,16.4l10.1-16.4h-5.8L115.1,15z M129.3,16.9h11.6 c0.1-7-4.2-9.5-8.4-9.5c-4.5,0-8.5,2.6-8.6,8.4c0,5.6,4.1,8.4,9.1,8.4c2.2,0,4.4-0.3,6.4-1.3v-4.4c-2.5,1.4-4.1,1.4-5.6,1.4 C131.7,19.8,129.5,19.2,129.3,16.9z M132.5,11.1c1.5,0,2.8,0.7,3,2.7h-6.2C129.6,11.9,131,11.1,132.5,11.1z M43.5,11.4 c1.2-1,1.8-2.4,1.8-4c0-3.1-3-6.3-7.3-6.3h-8v22.8h10.4c4.1,0,7.2-3,7.2-6.8C47.5,14.8,46.5,12.3,43.5,11.4z M35.2,5.7h2.4 C39,5.7,40,6.8,40,8c0,1.2-1,2.2-2.5,2.2h-2.4V5.7z M39.9,19.2h-4.7v-4.6h4.7c1.4,0,2.5,1,2.5,2.3C42.4,18.1,41.3,19.2,39.9,19.2z" />
                    <path d="M13.5,1l13.5,23H0L13.5,1z" />
                  </svg>
                </a>
                <biggive-misc-icon class="bx bx-x" background-colour="transparent" icon-colour="black" icon="MenuClose" onClick={this.closeMobileMenu}></biggive-misc-icon>
              </div>
              <div id="nav-primary"></div>
              <div class="mobile-social-icon-wrap mobile-only">
                <slot name="mobile-social-icons"></slot>
              </div>
            </div>
          </div>
        </nav>
      </Host>
    );

    const presetContentMenu = () => {
      const secondaryNavLinks = (
        <ul>
          {this.isLoggedIn && (
            <li>
              <a href={makeURL('Donate', this.donateUrlPrefix, 'my-account')}>My Account</a>
            </li>
          )}
          <li>
            <a href={makeURL('Experience', this.experienceUrlPrefix, 's/contact-us')}>Contact Us</a>
          </li>
          <li>
            <a href={makeURL('Experience', this.experienceUrlPrefix, 'charities/s/login')}>Charity Login</a>
          </li>
        </ul>
      );

      return (
        <Host>
          <div class="row row-top">
            <div class="social-icon-wrap">
              <biggive-social-icon service="Facebook" url="https://www.facebook.com/BigGive.org" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
              <biggive-social-icon service="Twitter" url="https://twitter.com/BigGive" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
              <biggive-social-icon service="LinkedIn" url="https://uk.linkedin.com/company/big-give" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
              <biggive-social-icon
                service="YouTube"
                url="https://www.youtube.com/channel/UC9_wH1aaTuZurJ-F9R8GDcA"
                background-colour="tertiary"
                icon-colour="black"
              ></biggive-social-icon>
              <biggive-social-icon service="Instagram" url="https://www.instagram.com/biggiveorg" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
            </div>
            <div class="nav-secondary">{secondaryNavLinks}</div>
          </div>
          <nav role="navigation" aria-label="Main Menu">
            <div class="navbar">
              <div class="logo">
                <a href={this.donateUrlPrefix} aria-label="Home">
                  <svg version="1.1" x="0px" y="0px" viewBox="0 0 140.9 30">
                    <path d="M51.9,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3C53.6,0,55,1.4,55,3S53.6,6.1,51.9,6.1z M49.3,23.8h5V7.7h-5V23.8z M68.5,7.7v1 c-0.8-0.7-2.3-1.4-4.1-1.4c-4.5,0-8.2,3.2-8.2,7.9c0,4.7,3.7,7.9,8.2,7.9c1.8,0,3.4-0.5,4.1-1.4v0.9c0,2.1-1.9,3.1-4.4,3.1 c-2.2,0-4-0.5-5.8-1.4V29c2.1,0.7,4.4,1,6,1c5,0,9.2-2,9.2-7.3v-15L68.5,7.7L68.5,7.7z M68.5,17.2c-0.7,1-1.9,1.4-3.2,1.4 c-2.1,0-3.8-1.2-3.8-3.4c0-2.2,1.7-3.4,3.8-3.4c1.3,0,2.5,0.6,3.2,1.5V17.2z M88.1,24.2c4,0,6.4-0.7,8.5-2V10h-11v4.7h5.8v4.1 c-0.8,0.2-1.8,0.4-3.2,0.4c-4.9,0-7.3-3.2-7.3-6.8c0-3.7,2.8-6.8,8-6.8c2.2,0,4.3,0.6,5.8,1.4V1.7c-1.5-0.6-3.4-1.1-6.1-1.1 c-7.6,0-13,5.3-13,11.8C75.5,19.1,80.4,24.2,88.1,24.2z M101.4,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3c1.8,0,3.2,1.4,3.2,3 S103.1,6.1,101.4,6.1z M98.8,23.8h5V7.7h-5V23.8z M115.1,15l-4.3-7.2H105l10.1,16.4l10.1-16.4h-5.8L115.1,15z M129.3,16.9h11.6 c0.1-7-4.2-9.5-8.4-9.5c-4.5,0-8.5,2.6-8.6,8.4c0,5.6,4.1,8.4,9.1,8.4c2.2,0,4.4-0.3,6.4-1.3v-4.4c-2.5,1.4-4.1,1.4-5.6,1.4 C131.7,19.8,129.5,19.2,129.3,16.9z M132.5,11.1c1.5,0,2.8,0.7,3,2.7h-6.2C129.6,11.9,131,11.1,132.5,11.1z M43.5,11.4 c1.2-1,1.8-2.4,1.8-4c0-3.1-3-6.3-7.3-6.3h-8v22.8h10.4c4.1,0,7.2-3,7.2-6.8C47.5,14.8,46.5,12.3,43.5,11.4z M35.2,5.7h2.4 C39,5.7,40,6.8,40,8c0,1.2-1,2.2-2.5,2.2h-2.4V5.7z M39.9,19.2h-4.7v-4.6h4.7c1.4,0,2.5,1,2.5,2.3C42.4,18.1,41.3,19.2,39.9,19.2z" />
                    <path d="M13.5,1l13.5,23H0L13.5,1z" />
                  </svg>
                </a>
              </div>
              <biggive-misc-icon class="bx bx-menu" background-colour="white" icon-colour="black" icon="MenuOpen" onClick={this.openMobileMenu}></biggive-misc-icon>
              <div class="nav-links">
                <div class="sidebar-logo">
                  <a href={this.donateUrlPrefix} aria-label="Home">
                    <svg version="1.1" x="0px" y="0px" viewBox="0 0 140.9 30" id="mobileLogo">
                      <path d="M51.9,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3C53.6,0,55,1.4,55,3S53.6,6.1,51.9,6.1z M49.3,23.8h5V7.7h-5V23.8z M68.5,7.7v1 c-0.8-0.7-2.3-1.4-4.1-1.4c-4.5,0-8.2,3.2-8.2,7.9c0,4.7,3.7,7.9,8.2,7.9c1.8,0,3.4-0.5,4.1-1.4v0.9c0,2.1-1.9,3.1-4.4,3.1 c-2.2,0-4-0.5-5.8-1.4V29c2.1,0.7,4.4,1,6,1c5,0,9.2-2,9.2-7.3v-15L68.5,7.7L68.5,7.7z M68.5,17.2c-0.7,1-1.9,1.4-3.2,1.4 c-2.1,0-3.8-1.2-3.8-3.4c0-2.2,1.7-3.4,3.8-3.4c1.3,0,2.5,0.6,3.2,1.5V17.2z M88.1,24.2c4,0,6.4-0.7,8.5-2V10h-11v4.7h5.8v4.1 c-0.8,0.2-1.8,0.4-3.2,0.4c-4.9,0-7.3-3.2-7.3-6.8c0-3.7,2.8-6.8,8-6.8c2.2,0,4.3,0.6,5.8,1.4V1.7c-1.5-0.6-3.4-1.1-6.1-1.1 c-7.6,0-13,5.3-13,11.8C75.5,19.1,80.4,24.2,88.1,24.2z M101.4,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3c1.8,0,3.2,1.4,3.2,3 S103.1,6.1,101.4,6.1z M98.8,23.8h5V7.7h-5V23.8z M115.1,15l-4.3-7.2H105l10.1,16.4l10.1-16.4h-5.8L115.1,15z M129.3,16.9h11.6 c0.1-7-4.2-9.5-8.4-9.5c-4.5,0-8.5,2.6-8.6,8.4c0,5.6,4.1,8.4,9.1,8.4c2.2,0,4.4-0.3,6.4-1.3v-4.4c-2.5,1.4-4.1,1.4-5.6,1.4 C131.7,19.8,129.5,19.2,129.3,16.9z M132.5,11.1c1.5,0,2.8,0.7,3,2.7h-6.2C129.6,11.9,131,11.1,132.5,11.1z M43.5,11.4 c1.2-1,1.8-2.4,1.8-4c0-3.1-3-6.3-7.3-6.3h-8v22.8h10.4c4.1,0,7.2-3,7.2-6.8C47.5,14.8,46.5,12.3,43.5,11.4z M35.2,5.7h2.4 C39,5.7,40,6.8,40,8c0,1.2-1,2.2-2.5,2.2h-2.4V5.7z M39.9,19.2h-4.7v-4.6h4.7c1.4,0,2.5,1,2.5,2.3C42.4,18.1,41.3,19.2,39.9,19.2z" />
                      <path d="M13.5,1l13.5,23H0L13.5,1z" />
                    </svg>
                  </a>
                  <biggive-misc-icon class="bx bx-x" background-colour="transparent" icon-colour="black" icon="MenuClose" onClick={this.closeMobileMenu}></biggive-misc-icon>
                </div>
                <div id="nav-primary">
                  <ul class="links" slot="nav-primary">
                    <li>
                      <a href={makeURL('Donate', this.donateUrlPrefix, 'explore')}>Explore Campaigns</a>
                    </li>
                    <li>
                      <a href={makeURL('Blog', this.blogUrlPrefix, 'charities')}>For Charities</a>
                    </li>
                    <li>
                      <a href={makeURL('Blog', this.blogUrlPrefix, 'funders')}>For Funders</a>
                    </li>
                    <li>
                      <a onClick={this.noNav}>
                        Match Funding
                        <biggive-misc-icon class="bx bxs-chevron-down sub-menu-arrow arrow" background-colour="white" icon-colour="black" icon="CaretRight"></biggive-misc-icon>
                      </a>
                      <ul class="sub-menu">
                        <li>
                          <a href={makeURL('Blog', this.blogUrlPrefix, 'match-funding-explained')}>Match Funding Explained</a>
                        </li>
                        <li>
                          <a href={makeURL('Blog', this.blogUrlPrefix, 'impact')}>Match Funding Impact</a>
                        </li>
                        <li class="more">
                          <a onClick={this.noNav}>
                            Match Funding Opportunities
                            {/* IMPORTANT: notice this one has a class sub-sub-menu, not sub-menu  */}
                            <biggive-misc-icon
                              class="bx bxs-chevron-down sub-sub-menu-arrow arrow"
                              background-colour="white"
                              icon-colour="black"
                              icon="CaretRight"
                            ></biggive-misc-icon>
                          </a>
                          <ul class="sub-sub-menu">
                            <li>
                              <a href={makeURL('Blog', this.blogUrlPrefix, 'christmas-challenge')} class="icon-christmas">
                                Christmas Challenge
                              </a>
                            </li>
                            <li>
                              <a href={makeURL('Blog', this.blogUrlPrefix, 'champions-for-children')} class="icon-children">
                                Champions for Children
                              </a>
                            </li>
                            <li>
                              <a href={makeURL('Blog', this.blogUrlPrefix, 'green-match-fund')} class="icon-green-match">
                                Green Match Fund
                              </a>
                            </li>
                            <li>
                              <a href={makeURL('Blog', this.blogUrlPrefix, 'women-girls-match-fund')} class="icon-women-girls">
                                Women &amp; Girls Match Fund
                              </a>
                            </li>
                            <li>
                              <a href={makeURL('Blog', this.blogUrlPrefix, 'kind2mind/')} class="icon-mental-health">
                                Kind²Mind
                              </a>
                            </li>
                            <li>
                              <a href={makeURL('Blog', this.blogUrlPrefix, 'anchor-match-fund/')} class="icon-anchor-match">
                                Anchor Match Fund
                              </a>
                            </li>
                            <li>
                              <a href={makeURL('Blog', this.blogUrlPrefix, 'emergency-campaigns/')} class="icon-emergency">
                                Emergency Match Fund
                              </a>
                            </li>
                          </ul>
                        </li>
                        <li>
                          <a href={makeURL('Blog', this.blogUrlPrefix, 'run-your-own-campaign/)')}>Run your match funding campaign</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a onClick={this.noNav}>
                        About Us
                        <biggive-misc-icon class="bx bxs-chevron-down sub-menu-arrow arrow" background-colour="white" icon-colour="black" icon="CaretRight"></biggive-misc-icon>
                      </a>
                      <ul class="sub-menu">
                        <li>
                          <a href={makeURL('Blog', this.blogUrlPrefix, 'our-people')}>Our People</a>
                        </li>
                        <li>
                          <a href={makeURL('Blog', this.blogUrlPrefix, 'our-story')}>Our Story</a>
                        </li>
                        <li>
                          <a href={makeURL('Blog', this.blogUrlPrefix, 'our-community')}>Our Community</a>
                        </li>
                        <li>
                          <a href={makeURL('Blog', this.blogUrlPrefix, 'our-fees')}>Our Fees</a>
                        </li>
                        <li>
                          <a href={makeURL('Blog', this.blogUrlPrefix, 'faqs')}>FAQs</a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a onClick={this.noNav}>
                        Resources
                        <biggive-misc-icon class="bx bxs-chevron-down sub-menu-arrow arrow" background-colour="white" icon-colour="black" icon="CaretRight"></biggive-misc-icon>
                      </a>
                      <ul class="sub-menu">
                        <li>
                          <a href={makeURL('Blog', this.blogUrlPrefix, 'case-studies')}>Case Studies</a>
                        </li>
                        <li>
                          <a href={makeURL('Blog', this.blogUrlPrefix, 'blog')}>Blog</a>
                        </li>
                        <li>
                          <a href={makeURL('Blog', this.blogUrlPrefix, 'reports-insights')}>Reports &amp; Insights</a>
                        </li>
                        <li>
                          <a href={makeURL('Blog', this.blogUrlPrefix, 'press')}>Press</a>
                        </li>
                      </ul>
                    </li>
                  </ul>
                  <div class="mobile-only">{secondaryNavLinks}</div>
                </div>
                <div class="mobile-social-icon-wrap mobile-only">
                  <biggive-social-icon service="Facebook" url="https://www.facebook.com/BigGive.org" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
                  <biggive-social-icon service="Twitter" url="https://twitter.com/BigGive" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
                  <biggive-social-icon service="LinkedIn" url="https://uk.linkedin.com/company/big-give" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
                  <biggive-social-icon
                    service="YouTube"
                    url="https://www.youtube.com/channel/UC9_wH1aaTuZurJ-F9R8GDcA"
                    background-colour="tertiary"
                    icon-colour="black"
                  ></biggive-social-icon>
                  <biggive-social-icon service="Instagram" url="https://www.instagram.com/biggiveorg" background-colour="tertiary" icon-colour="black"></biggive-social-icon>
                </div>
              </div>
            </div>
          </nav>
        </Host>
      );
    };

    return this.usePresetMenuContent ? presetContentMenu() : slotBasedMenu();
  }
}
