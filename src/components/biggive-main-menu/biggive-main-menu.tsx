import { Component, Element, Host, h } from '@stencil/core';
import { faCaretRight } from '@fortawesome/pro-duotone-svg-icons';
import { faBars, faX } from '@fortawesome/pro-solid-svg-icons';

@Component({
  tag: 'biggive-main-menu',
  styleUrl: 'biggive-main-menu.scss',
  shadow: true,
})
export class BiggiveMainMenu {
  @Element() host: HTMLBiggiveHeaderElement;
  openMobileMenu = () => {
    const mobileMenu = this.host.shadowRoot.querySelector('.nav-links') as HTMLElement;
    mobileMenu.style.left = '0';
  };
  closeMobileMenu = () => {
    const mobileMenu = this.host.shadowRoot.querySelector('.nav-links') as HTMLElement;
    mobileMenu.style.left = '-100%';
  };

  /**
   * Slots the 'nav-secondary' slot into the top right corner of the blue nav bar.
   * Also slots the 'nav-secondary' into the normal menu items when in mobile mode.
   * This is because the blue bar disappears in mobile mode, so we need the items
   * init to still be seen, hence they're auto-added to the menu.
   */
  appendNavSecondaryLinks() {
    // get the slotted 'nav-secondary' node
    const node = this.host.querySelector(`[slot="nav-secondary"]`);

    // we must make a deep clone of the node above, because each node is only
    // injectable / slottable into one place, but we need to slot into two places.
    const nodeClone = node.cloneNode(true) as HTMLElement;

    if (node !== null) {
      // add to blue bar
      this.host.shadowRoot.querySelector('.nav-secondary').appendChild(node);

      // add to main menu links, but only viewable in mobile mode. The css class
      // hides them in desktop!
      nodeClone.querySelectorAll('li').forEach(child => {
        child.classList.add('mobile-only');
        this.host.shadowRoot.querySelector('.links').appendChild(child);
      });
    }
  }

  appendSocialIcons() {
    // get the slotted 'social-icons' node
    const node = this.host.querySelector(`[slot="social-icons"]`);

    // we must make a deep clone of the node above, because each node is only
    // injectable / slottable into one place, but we need to slot into two places.
    // const nodeClone = node.cloneNode(true) as HTMLElement;

    if (node !== null) {
      // add to blue bar in the top left
      // this.host.shadowRoot.querySelector('.social-icon-wrap').appendChild(node);

      // add to main menu links, but only viewable in mobile mode. The css class
      // hides them in desktop!
      node.classList.add('mobile-only');
      this.host.shadowRoot.querySelector('.links').appendChild(node);
      // nodeClone.querySelectorAll('li').forEach(child => {
      //   child.classList.add('mobile-only');
      //   this.host.shadowRoot.querySelector('.links').appendChild(child);
      // });
    }
  }

  componentDidRender() {
    // Sidebar submenu open close js code for mobile menu
    const subMenuArrows = this.host.shadowRoot.querySelectorAll('.sub-menu-arrow') as NodeListOf<HTMLElement>;
    subMenuArrows.forEach(subMenuArrow => {
      subMenuArrow.onclick = () => {
        subMenuArrow.classList.toggle('transform-90');
        // subMenu is a sibling node
        const subMenu = subMenuArrow.parentNode.querySelector('.sub-menu');
        subMenu.classList.toggle('display-sub-menu');
      };
    });

    // Sidebar sub-sub-menu open close js code for mobile menu
    const subSubMenuArrows = this.host.shadowRoot.querySelectorAll('.sub-sub-menu-arrow') as NodeListOf<HTMLElement>;
    subSubMenuArrows.forEach(subSubMenuArrow => {
      subSubMenuArrow.onclick = () => {
        subSubMenuArrow.classList.toggle('transform-90');
        // two parents up, not one like above. subSubMenu is actually a sibling to the parent node
        const subSubMenu = subSubMenuArrow.parentNode.parentNode.querySelector('.sub-sub-menu');
        subSubMenu.classList.toggle('display-sub-menu');
      };
    });

    this.appendNavSecondaryLinks();
    // this.appendSocialIcons();
  }

  render() {
    return (
      <Host>
        <div class="row row-top">
          <div class="social-icon-wrap">
            <slot name="social-icons"></slot>
          </div>
          <div class="nav-secondary"></div>
        </div>
        <nav>
          <div class="navbar">
            {/* <i class="bx bx-menu"></i> */}
            {/* <i class="bx bx-menu nav-toggle"></i> */}
            <svg
              class="bx bx-menu fill-black"
              width="20"
              height="20"
              xmlns="http://www.w3.org/2000/svg"
              viewBox={'0 0 ' + faBars.icon[0] + ' ' + faBars.icon[1]}
              onClick={this.openMobileMenu}
            >
              <path d={faBars.icon[4].toString()} />
            </svg>

            <div class="logo">
              <a href="#">
                <svg version="1.1" x="0px" y="0px" viewBox="0 0 140.9 30">
                  <path d="M51.9,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3C53.6,0,55,1.4,55,3S53.6,6.1,51.9,6.1z M49.3,23.8h5V7.7h-5V23.8z M68.5,7.7v1 c-0.8-0.7-2.3-1.4-4.1-1.4c-4.5,0-8.2,3.2-8.2,7.9c0,4.7,3.7,7.9,8.2,7.9c1.8,0,3.4-0.5,4.1-1.4v0.9c0,2.1-1.9,3.1-4.4,3.1 c-2.2,0-4-0.5-5.8-1.4V29c2.1,0.7,4.4,1,6,1c5,0,9.2-2,9.2-7.3v-15L68.5,7.7L68.5,7.7z M68.5,17.2c-0.7,1-1.9,1.4-3.2,1.4 c-2.1,0-3.8-1.2-3.8-3.4c0-2.2,1.7-3.4,3.8-3.4c1.3,0,2.5,0.6,3.2,1.5V17.2z M88.1,24.2c4,0,6.4-0.7,8.5-2V10h-11v4.7h5.8v4.1 c-0.8,0.2-1.8,0.4-3.2,0.4c-4.9,0-7.3-3.2-7.3-6.8c0-3.7,2.8-6.8,8-6.8c2.2,0,4.3,0.6,5.8,1.4V1.7c-1.5-0.6-3.4-1.1-6.1-1.1 c-7.6,0-13,5.3-13,11.8C75.5,19.1,80.4,24.2,88.1,24.2z M101.4,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3c1.8,0,3.2,1.4,3.2,3 S103.1,6.1,101.4,6.1z M98.8,23.8h5V7.7h-5V23.8z M115.1,15l-4.3-7.2H105l10.1,16.4l10.1-16.4h-5.8L115.1,15z M129.3,16.9h11.6 c0.1-7-4.2-9.5-8.4-9.5c-4.5,0-8.5,2.6-8.6,8.4c0,5.6,4.1,8.4,9.1,8.4c2.2,0,4.4-0.3,6.4-1.3v-4.4c-2.5,1.4-4.1,1.4-5.6,1.4 C131.7,19.8,129.5,19.2,129.3,16.9z M132.5,11.1c1.5,0,2.8,0.7,3,2.7h-6.2C129.6,11.9,131,11.1,132.5,11.1z M43.5,11.4 c1.2-1,1.8-2.4,1.8-4c0-3.1-3-6.3-7.3-6.3h-8v22.8h10.4c4.1,0,7.2-3,7.2-6.8C47.5,14.8,46.5,12.3,43.5,11.4z M35.2,5.7h2.4 C39,5.7,40,6.8,40,8c0,1.2-1,2.2-2.5,2.2h-2.4V5.7z M39.9,19.2h-4.7v-4.6h4.7c1.4,0,2.5,1,2.5,2.3C42.4,18.1,41.3,19.2,39.9,19.2z" />
                  <path d="M13.5,1l13.5,23H0L13.5,1z" />
                </svg>
              </a>
            </div>
            <div class="nav-links">
              <div class="sidebar-logo">
                <svg version="1.1" x="0px" y="0px" viewBox="0 0 140.9 30" id="mobileLogo">
                  <path d="M51.9,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3C53.6,0,55,1.4,55,3S53.6,6.1,51.9,6.1z M49.3,23.8h5V7.7h-5V23.8z M68.5,7.7v1 c-0.8-0.7-2.3-1.4-4.1-1.4c-4.5,0-8.2,3.2-8.2,7.9c0,4.7,3.7,7.9,8.2,7.9c1.8,0,3.4-0.5,4.1-1.4v0.9c0,2.1-1.9,3.1-4.4,3.1 c-2.2,0-4-0.5-5.8-1.4V29c2.1,0.7,4.4,1,6,1c5,0,9.2-2,9.2-7.3v-15L68.5,7.7L68.5,7.7z M68.5,17.2c-0.7,1-1.9,1.4-3.2,1.4 c-2.1,0-3.8-1.2-3.8-3.4c0-2.2,1.7-3.4,3.8-3.4c1.3,0,2.5,0.6,3.2,1.5V17.2z M88.1,24.2c4,0,6.4-0.7,8.5-2V10h-11v4.7h5.8v4.1 c-0.8,0.2-1.8,0.4-3.2,0.4c-4.9,0-7.3-3.2-7.3-6.8c0-3.7,2.8-6.8,8-6.8c2.2,0,4.3,0.6,5.8,1.4V1.7c-1.5-0.6-3.4-1.1-6.1-1.1 c-7.6,0-13,5.3-13,11.8C75.5,19.1,80.4,24.2,88.1,24.2z M101.4,6.1c-1.7,0-3.1-1.4-3.1-3s1.4-3,3.1-3c1.8,0,3.2,1.4,3.2,3 S103.1,6.1,101.4,6.1z M98.8,23.8h5V7.7h-5V23.8z M115.1,15l-4.3-7.2H105l10.1,16.4l10.1-16.4h-5.8L115.1,15z M129.3,16.9h11.6 c0.1-7-4.2-9.5-8.4-9.5c-4.5,0-8.5,2.6-8.6,8.4c0,5.6,4.1,8.4,9.1,8.4c2.2,0,4.4-0.3,6.4-1.3v-4.4c-2.5,1.4-4.1,1.4-5.6,1.4 C131.7,19.8,129.5,19.2,129.3,16.9z M132.5,11.1c1.5,0,2.8,0.7,3,2.7h-6.2C129.6,11.9,131,11.1,132.5,11.1z M43.5,11.4 c1.2-1,1.8-2.4,1.8-4c0-3.1-3-6.3-7.3-6.3h-8v22.8h10.4c4.1,0,7.2-3,7.2-6.8C47.5,14.8,46.5,12.3,43.5,11.4z M35.2,5.7h2.4 C39,5.7,40,6.8,40,8c0,1.2-1,2.2-2.5,2.2h-2.4V5.7z M39.9,19.2h-4.7v-4.6h4.7c1.4,0,2.5,1,2.5,2.3C42.4,18.1,41.3,19.2,39.9,19.2z" />
                  <path d="M13.5,1l13.5,23H0L13.5,1z" />
                </svg>
                {/* <i class="bx bx-x"></i> */}
                <svg
                  class="bx bx-x fill-black"
                  id="x"
                  width="10"
                  height="10"
                  xmlns="http://www.w3.org/2000/svg"
                  viewBox={'0 0 ' + faX.icon[0] + ' ' + faX.icon[1]}
                  onClick={this.closeMobileMenu}
                >
                  <path d={faX.icon[4].toString()} />
                </svg>
              </div>
              <ul class="links">
                <li>
                  <a href="#">Explore Campaigns</a>
                </li>
                <li>
                  <a href="#">Match Funding</a>
                  {/* <i class="bx bxs-chevron-down sub-menu-arrow arrow  "></i> */}
                  {/* <svg
                    class="sub-menu-arrow arrow fill-black"
                    width="10"
                    height="10"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={'0 0 ' + faCaretRight.icon[0] + ' ' + faCaretRight.icon[1]}
                  >
                    <path d={faCaretRight.icon[4].toString()} />
                  </svg> */}
                  <biggive-misc-icon class="bx bxs-chevron-down sub-menu-arrow arrow" background-colour="white" icon-colour="black" icon="CaretRight"></biggive-misc-icon>

                  <ul class="sub-menu">
                    <li>
                      <a href="#">Match Funding Explained</a>
                    </li>
                    <li class="more">
                      <span>
                        <a href="#">Match Funding Opportunities</a>
                        {/* <i class="bx bxs-chevron-right arrow sub-sub-menu-arrow"></i> */}
                        {/* <svg
                          class="sub-sub-menu-arrow arrow fill-black"
                          width="10"
                          height="10"
                          xmlns="http://www.w3.org/2000/svg"
                          viewBox={'0 0 ' + faCaretRight.icon[0] + ' ' + faCaretRight.icon[1]}
                        >
                          <path d={faCaretRight.icon[4].toString()} />
                        </svg> */}
                        {/* IMPORTANT: notice this one has a class sub-sub-menu, not sub-menu */}
                        <biggive-misc-icon class="bx bxs-chevron-down sub-sub-menu-arrow arrow" background-colour="white" icon-colour="black" icon="CaretRight"></biggive-misc-icon>
                      </span>
                      <ul class="sub-sub-menu">
                        <li>
                          <a href="#" class="icon-green">
                            Christmas Challenge
                          </a>
                        </li>
                        <li>
                          <a href="#" class="icon-children">
                            Champions for Children
                          </a>
                        </li>
                        <li>
                          <a href="#" class="icon-green-match">
                            Green Match Fund
                          </a>
                        </li>
                        <li>
                          <a href="#" class="icon-women-girls">
                            Women & Girls Match Fund
                          </a>
                        </li>
                        <li>
                          <a href="#" class="icon-emergency">
                            Emergency Match Fund
                          </a>
                        </li>
                      </ul>
                    </li>
                    <li>
                      <a href="#">Run your match funding campaign</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">About us</a>
                  {/* <i class="bx bxs-chevron-down sub-menu-arrow arrow "></i> */}
                  {/* <svg
                    class="sub-menu-arrow arrow fill-black"
                    width="10"
                    height="10"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={'0 0 ' + faCaretRight.icon[0] + ' ' + faCaretRight.icon[1]}
                  >
                    <path d={faCaretRight.icon[4].toString()} />
                  </svg> */}
                  <biggive-misc-icon class="bx bxs-chevron-down sub-menu-arrow arrow" background-colour="white" icon-colour="black" icon="CaretRight"></biggive-misc-icon>
                  <ul class="sub-menu">
                    <li>
                      <a href="#">Our Story</a>
                    </li>
                    <li>
                      <a href="#">Our People</a>
                    </li>
                    <li>
                      <a href="#">Our Community</a>
                    </li>
                    <li>
                      <a href="#">Our Fees</a>
                    </li>
                    <li>
                      <a href="#">FAQs</a>
                    </li>
                  </ul>
                </li>
                <li>
                  <a href="#">For Charities</a>
                </li>
                <li>
                  <a href="#">For Funders</a>
                </li>
                <li>
                  <a href="#">Resources</a>
                  {/* <i class="bx bxs-chevron-down sub-menu-arrow arrow "></i> */}
                  {/* <svg
                    class="sub-menu-arrow arrow fill-black"
                    width="10"
                    height="10"
                    xmlns="http://www.w3.org/2000/svg"
                    viewBox={'0 0 ' + faCaretRight.icon[0] + ' ' + faCaretRight.icon[1]}
                  >
                    <path d={faCaretRight.icon[4].toString()} />
                  </svg> */}
                  <biggive-misc-icon class="bx bxs-chevron-down sub-menu-arrow arrow" background-colour="white" icon-colour="black" icon="CaretRight"></biggive-misc-icon>
                  <ul class="sub-menu">
                    <li>
                      <a href="#">Case Studies</a>
                    </li>
                    <li>
                      <a href="#">Webinars</a>
                    </li>
                    <li>
                      <a href="#">Blog</a>
                    </li>
                    <li>
                      <a href="#">Reports & Insights</a>
                    </li>
                    <li>
                      <a href="#">Press</a>
                    </li>
                  </ul>
                </li>
              </ul>
              <div class="mobile-social-icon-wrap mobile-only">
                <slot name="mobile-social-icons"></slot>
              </div>
            </div>
          </div>
        </nav>
      </Host>
    );
  }
}
