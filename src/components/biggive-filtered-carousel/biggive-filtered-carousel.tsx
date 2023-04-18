import { Component, Prop, Element, h } from '@stencil/core';
import { brandColour } from '../../globals/brand-colour';
import { spacingOption } from '../../globals/spacing-option';

@Component({
  tag: 'biggive-filtered-carousel',
  styleUrl: 'biggive-filtered-carousel.scss',
  shadow: true,
})
export class BiggiveFilteredCarousel {
  @Element() host: HTMLBiggiveCarouselElement;

  @Prop() spaceBelow: spacingOption = 4;

  @Prop() columnCount: 1 | 2 | 3 | 4 | 5 = 3;

  @Prop() buttonBackgroundColour: brandColour = 'white';

  @Prop() buttonIconColour: brandColour = 'primary';

  children: Array<HTMLElement>;

  componentDidLoad() {
    const carousel: HTMLBiggiveCarouselElement = this.host.shadowRoot?.querySelector('biggive-carousel')!;
    const filterWrap = this.host.shadowRoot?.querySelector('.filters')!;

    this.children = new Array<HTMLElement>();

    Array.from(this.host.children).forEach(item => {
      this.children.push(item as HTMLElement);
    });

    let filters: string[] = [];

    this.children.forEach(item => {
      carousel.appendChild(item);

      let itemFilters: string[] = [];

      if (item.getAttribute('filters') != null) {
        itemFilters = item.getAttribute('filters')?.split('|') ?? [];
        filters.push(...itemFilters);
      }

      item.dataset['filters'] = JSON.stringify(itemFilters);
    });

    filters = [...new Set(filters)];

    filters.forEach(filter => {
      var button = document.createElement('span');
      button.innerHTML = filter;
      button.classList.add('button');
      button.classList.add('apply');
      button.setAttribute('data-filter', filter);
      button.addEventListener('click', e => {
        const button = e.target as HTMLElement;

        button.classList.toggle('active');

        let appliedFilters: string[] = [];
        let buttons = this.host.shadowRoot?.querySelectorAll('.filters span.button.active');
        buttons?.forEach(button => {
          appliedFilters.push(button.getAttribute('data-filter')!);
        });

        this.children.forEach(item => {
          let itemFilters: string[] = JSON.parse(item.dataset['filters']!);

          if (appliedFilters.length == 0 || appliedFilters.filter(x => itemFilters.includes(x)).length > 0) {
            item.classList.remove('hidden');
          } else {
            item.classList.add('hidden');
          }
        });

        carousel.resizeToFitContent();
      });

      filterWrap.appendChild(button);
    });

    var clear = document.createElement('span');
    clear.innerHTML =
      '<svg width="24" height="24" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path stroke-color="1" stroke="#000000" d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z" /></svg>';
    clear.classList.add('button');
    clear.classList.add('clear');
    clear.addEventListener('click', () => {
      filterWrap.querySelectorAll('.apply').forEach(button => {
        button.classList.remove('active');
      });

      this.children.forEach(item => {
        item.classList.remove('hidden');
      });

      carousel.resizeToFitContent();
    });

    filterWrap.appendChild(clear);

    /*
    Check added to confirm that carousel variable is set with a valid carousel. Ommiting this check fails the npm test - although works fine at runtime in browser.
    */
    if (typeof carousel.resizeToFitContent === 'function') {
      carousel.resizeToFitContent();
    }
  }

  render() {
    return (
      <div class={'container space-below-' + this.spaceBelow}>
        <div class="filters"></div>
        <biggive-carousel
          space-below="1"
          column-count={this.columnCount}
          button-background-colour={this.buttonBackgroundColour}
          button-icon-colour={this.buttonIconColour}
        ></biggive-carousel>
      </div>
    );
  }
}
