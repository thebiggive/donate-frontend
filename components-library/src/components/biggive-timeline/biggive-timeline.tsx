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
  scrollContextTab: HTMLElement | null;
  scrollOffset: number = 0;
  tabHeadings: Array<string> = [];
  children: Array<HTMLBiggiveTimelineEntryElement> = [];

  componentWillLoad() {
    this.children = Array.from(this.host.children) as Array<HTMLBiggiveTimelineEntryElement>;

    let tabHeadings = this.tabHeadings;

    this.children.forEach(function (entry) {
      let tab = entry.date.substring(0, 4);
      if (!tabHeadings.includes(tab)) {
        tabHeadings.push(tab);
      }
    });
  }

  componentDidRender() {
    this.showTab(0);
  }

  /*
   * Shows the i'th element in the timeline, counting from zero. Does nothing if i out of range.
   */
  showTab(i: number) {
    const tabs = this.host.shadowRoot?.querySelectorAll<HTMLElement>('.navigation ul li')!;
    const entries = this.host.shadowRoot?.querySelectorAll<HTMLElement>('.entry')!;

    if (tabs.length > 0) {
      this.scrollContextTab = this.host.shadowRoot?.querySelector<HTMLElement>('.navigation ul li')!;
    }

    if (i >= 0 && i <= tabs?.length - 1) {
      this.currentTab = i;
      let currentTabTitle = tabs[i]?.innerHTML;
      let j = 0;
      tabs?.forEach(function (tab) {
        if (i == j) {
          tab.classList.add('selected');
        } else {
          tab.classList.remove('selected');
        }
        j++;
      });

      entries.forEach(function (entry) {
        entry.style.display = entry.getAttribute('data-date')?.substring(0, 4) == currentTabTitle ? 'block' : 'none';
      });
    }
  }

  clickTabHandler = e => {
    let i = 0;
    for (let el of e.target.parentElement.children) {
      if (el == e.target) {
        this.showTab(i);
        return;
      }
      i++;
    }
  };

  scrollTab(direction: 'NEXT' | 'PREV') {
    if (!this.scrollContextTab) {
      return;
    }

    let sleeve: HTMLElement = this.scrollContextTab.parentElement!;
    let max = sleeve.scrollWidth - sleeve.parentElement?.offsetWidth!;

    if (direction == 'PREV') {
      if (this.scrollOffset + this.scrollContextTab.offsetWidth > 0) {
        return;
      }

      this.scrollOffset = this.scrollOffset + this.scrollContextTab.offsetWidth;
      if (this.scrollContextTab.previousElementSibling) {
        this.scrollContextTab = this.scrollContextTab.previousElementSibling as HTMLElement;
      }
    } else if (direction == 'NEXT') {
      if (0 - this.scrollOffset > max) {
        return;
      }

      this.scrollOffset = this.scrollOffset - this.scrollContextTab.offsetWidth;
      if (this.scrollContextTab.nextElementSibling) {
        this.scrollContextTab = this.scrollContextTab.nextElementSibling as HTMLElement;
      }
    }

    sleeve.querySelectorAll('li').forEach(li => {
      li.style.transitionDuration = '0.3s';
      li.style.transitionTimingFunction = 'ease-out';
      li.style.transform = 'translate3d(' + this.scrollOffset + 'px, 0, 0)';
    });
  }

  clickPrevHandler = () => {
    this.scrollTab('PREV');
  };

  clickNextHandler = () => {
    this.scrollTab('NEXT');
  };

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
          <div class="button prev" onClick={this.clickPrevHandler} title="Previous">
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M8.29311 14.5703L1.73926 8.01646L8.29311 1.46261" stroke="#000000" stroke-width="2" />
            </svg>
          </div>
          <div class="sleeve">
            <ul>
              {this.tabHeadings.map(tab => (
                <li onClick={this.clickTabHandler}>{tab}</li>
              ))}
            </ul>
          </div>
          <div class="button next" onClick={this.clickNextHandler} title="Next">
            <svg width="9" height="16" viewBox="0 0 9 16" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M0.739117 1.46094L7.29297 8.01479L0.739118 14.5686" stroke="#000000" stroke-width="2" />
            </svg>
          </div>
        </div>
        <div class="entry-wrap">
          {this.children.map(entry => (
            <div class="entry" data-date={entry.date}>
              <h4 class="title">{entry.heading}</h4>
              <div class="content" innerHTML={entry.innerHTML}></div>
            </div>
          ))}
        </div>
      </div>
    );
  }
}
