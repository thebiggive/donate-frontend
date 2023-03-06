import { Component, Prop, Element, h } from '@stencil/core';
import { brandColour } from '../../globals/brand-colour';
import { spacingOption } from '../../globals/spacing-option';

@Component({
  tag: 'biggive-tabbed-content',
  styleUrl: 'biggive-tabbed-content.scss',
  shadow: true,
})
export class BiggiveTabbedContent {
  @Element() host: HTMLBiggiveTabbedContentElement;

  @Prop() spaceBelow: spacingOption = 0;

  @Prop() textColour: brandColour = 'black';

  @Prop() selectedTextColour: brandColour = 'primary';

  @Prop() navigationHighlightColour: brandColour = 'grey-medium';

  @Prop() selectedNavigationHighlightColour: brandColour = 'primary';

  @Prop() buttonBackgroundColour: brandColour = 'white';

  @Prop() buttonIconColour: brandColour = 'primary';

  currentTab = 0;
  children: Array<HTMLBiggiveTabElement> = [];

  componentWillLoad() {
    this.children = Array.from(this.host.children) as Array<HTMLBiggiveTabElement>;
  }

  componentDidRender() {
    this.showTab(0);
  }

  /*
   * Shows the i'th tab, counting from zero. Does nothing if i out of range.
   */
  showTab(i: number) {
    const tabs = this.host.shadowRoot?.querySelectorAll('.navigation ul li')!;

    if (tabs && i >= 0 && i <= tabs?.length - 1) {
      this.currentTab = i;
      let j = 0;
      tabs?.forEach(function (tab) {
        if (i == j) {
          tab.classList.add('selected');
        } else {
          tab.classList.remove('selected');
        }
        j++;
      });

      j = 0;
      this.host.querySelectorAll('biggive-tab').forEach(function (tab) {
        tab.style.display = i == j ? 'block' : 'none';
        j++;
      });
    }
  }

  clickTabHandler(e) {
    let i = 0;
    for (let el of e.target.parentElement.children) {
      if (el == e.target) {
        this.showTab(i);
        return;
      }
      i++;
    }
  }

  clickPrevHandler() {
    this.showTab(this.currentTab - 1);
  }

  clickNextHandler() {
    this.showTab(this.currentTab + 1);
  }

  render() {
    return (
      <div
        class={
          'container space-below-' +
          this.spaceBelow +
          ' text-colour-' +
          this.textColour +
          ' selected-text-colour-' +
          this.selectedTextColour +
          ' navigation-highlight-colour-' +
          this.navigationHighlightColour +
          ' selected-navigation-highlight-colour-' +
          this.selectedNavigationHighlightColour +
          ' button-background-colour-' +
          this.buttonBackgroundColour +
          ' button-icon-colour-' +
          this.buttonIconColour
        }
      >
        <div class="navigation">
          <div class="button prev" onClick={() => this.clickPrevHandler()} title="Previous">
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.29311 14.5703L1.73926 8.01646L8.29311 1.46261" stroke="#000000" stroke-width="2" />
            </svg>
          </div>
          <ul>
            {this.children.map(child => (
              <li onClick={event => this.clickTabHandler(event)}>{child.tabTitle}</li>
            ))}
          </ul>
          <div class="button next" onClick={() => this.clickNextHandler()} title="Next">
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.739117 1.46094L7.29297 8.01479L0.739118 14.5686" stroke="#000000" stroke-width="2" />
            </svg>
          </div>
        </div>
        <slot></slot>
      </div>
    );
  }
}
