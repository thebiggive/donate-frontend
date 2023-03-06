import { Component, Prop, Element, h } from '@stencil/core';
import { brandColour } from '../../globals/brand-colour';
import { spacingOption } from '../../globals/spacing-option';

@Component({
  tag: 'biggive-timeline',
  styleUrl: 'biggive-timeline.scss',
  shadow: true,
})
export class BiggiveTimeline {
  @Element() host: HTMLBiggiveTimelineElement;

  @Prop() spaceBelow: spacingOption = 0;

  @Prop() textColour: brandColour = 'black';

  @Prop() selectedTextColour: brandColour = 'primary';

  @Prop() navigationHighlightColour: brandColour = 'grey-medium';

  @Prop() selectedNavigationHighlightColour: brandColour = 'primary';

  @Prop() buttonBackgroundColour: brandColour = 'white';

  @Prop() buttonIconColour: brandColour = 'primary';

  @Prop() entryBackgroundColour: brandColour = 'white';

  @Prop() entryHighlightColour: brandColour = 'secondary';

  @Prop() entryDateColour: brandColour = 'black';

  @Prop() entryTitleColour: brandColour = 'primary';

  @Prop() entryTextColour: brandColour = 'black';

  currentTab = 0;
  tabs: Array<any> = [];
  children: Array<any> = [];

  componentWillLoad() {
    this.children = Array.from(this.host.children);

    let tabs = this.tabs;

    this.children.forEach(function (entry) {
      let year = entry.entryDate.substring(0, 4);
      entry.entryYear = year;
      if (!tabs.includes(year)) {
        tabs.push(year);
      }
    });

    this.tabs = tabs;
  }

  componentDidRender() {
    this.showTab(0);
  }

  showTab(i: number) {
    let tabs = this.host.shadowRoot?.querySelectorAll<HTMLElement>('.navigation ul li');
    let entries = this.host.shadowRoot?.querySelectorAll<HTMLElement>('.entry');

    if (tabs) {
      if (i < 0) {
        i = 0;
      } else if (i > tabs?.length - 1) {
        i = tabs?.length - 1;
      }

      this.currentTab = i;
      let currentTabYear = tabs[i]?.innerHTML;
      let j = 0;
      tabs?.forEach(function (tab) {
        if (i == j) {
          tab.classList.add('selected');
        } else {
          tab.classList.remove('selected');
        }
        j++;
      });

      entries?.forEach(function (entry) {
        console.log(entry.getAttribute('data-year') + ' : ' + currentTabYear);

        entry.style.display = entry.getAttribute('data-year') == currentTabYear ? 'block' : 'none';
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
          this.buttonIconColour +
          ' entry-background-colour-' +
          this.entryBackgroundColour +
          ' entry-highlight-colour-' +
          this.entryHighlightColour +
          ' entry-date-colour-' +
          this.entryDateColour +
          ' entry-title-colour-' +
          this.entryTitleColour +
          ' entry-text-colour-' +
          this.entryTextColour
        }
      >
        <div class="navigation">
          <div class="button prev" onClick={() => this.clickPrevHandler()} title="Previous">
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.29311 14.5703L1.73926 8.01646L8.29311 1.46261" stroke="#000000" stroke-width="2" />
            </svg>
          </div>
          <ul>
            {this.tabs.map(tab => (
              <li onClick={event => this.clickTabHandler(event)}>{tab}</li>
            ))}
          </ul>
          <div class="button next" onClick={() => this.clickNextHandler()} title="Next">
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.739117 1.46094L7.29297 8.01479L0.739118 14.5686" stroke="#000000" stroke-width="2" />
            </svg>
          </div>
        </div>
        <div class="entry-wrap">
          {this.children.map(entry => (
            <div class="entry" data-year={entry.entryYear}>
              <div class="date">{entry.entryDate}</div>
              <h4 class="title">{entry.entryTitle}</h4>
              <div class="content" innerHTML={entry.innerHTML}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
