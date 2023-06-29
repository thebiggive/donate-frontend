import { Component, Prop, Element, h } from '@stencil/core';
import { brandColour } from '../../globals/brand-colour';

@Component({
  tag: 'biggive-sheet',
  styleUrl: 'biggive-sheet.scss',
  shadow: true,
})
export class BiggiveSheet {
  @Element() host: HTMLBiggiveSheetElement;

  /**
   * A string ID (no spaces) unique within the page context, used to trigger the opening of the sheet from an anchor hash.
   */
  @Prop() sheetId: string = '';

  @Prop() backgroundColour: brandColour = 'primary';

  @Prop() textColour: brandColour = 'white';

  openSheet(hash: string) {
    if (hash != '' && hash == this.sheetId) {
      this.host.shadowRoot?.querySelector('.container')?.classList.add('active');
    }
  }

  componentWillLoad() {
    window.addEventListener('hashchange', () => {
      this.openSheet(window.location.hash);
    });
  }

  componentDidRender() {
    this.openSheet(window.location.hash);
  }

  closeSheet = () => {
    this.host.shadowRoot?.querySelector('.container')?.classList.remove('active');
    history.pushState('', document.title, window.location.pathname);
  };

  render() {
    return (
      <div class={'container'}>
        <div class="background"></div>
        <div class={'popup background-colour-' + this.backgroundColour + ' text-colour-' + this.textColour}>
          <div class="header">
            <div class="back-link" onClick={this.closeSheet}>
              <span class={'svg-wrap colour-' + this.textColour}>
                <svg width="33" height="16" viewBox="0 0 33 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                  <path
                    d="M0.292892 7.29289C-0.0976295 7.68342 -0.0976295 8.31658 0.292892 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292892 7.29289ZM33 7L1 7V9L33 9V7Z"
                    fill="black"
                  />
                </svg>
              </span>
              Back
            </div>

            <div class="close-link" onClick={this.closeSheet}>
              <span class="svg-wrap">
                <svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
                  <path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z" />
                </svg>
              </span>
            </div>
          </div>
          <div class="content">
            <slot></slot>
          </div>
        </div>
      </div>
    );
  }
}
