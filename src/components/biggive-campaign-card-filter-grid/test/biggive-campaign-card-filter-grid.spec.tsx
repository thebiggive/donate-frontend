import { newSpecPage } from '@stencil/core/testing';
import { BiggiveCampaignCardFilterGrid } from '../biggive-campaign-card-filter-grid';

describe('biggive-campaign-card-filter-grid', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveCampaignCardFilterGrid],
      html: `<biggive-campaign-card-filter-grid ></biggive-campaign-card-filter-grid>`,
    });
    expect(page.root).toEqualHtml(`
    <biggive-campaign-card-filter-grid>
    <mock:shadow-root>
      <div class="container space-below-0">
        <div class="sleeve">
          <div class="search-wrap">
            <h4>
              Find a charity or project
            </h4>
            <div class="field-wrap">
              <div class="input-wrap">
                <svg class="icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352c79.5 0 144-64.5 144-144s-64.5-144-144-144S64 128.5 64 208s64.5 144 144 144z"></path>
                </svg>
                <input class="input-text" placeholder="Search" type="text" value="">
              </div>
              <biggive-button label="Search"></biggive-button>
            </div>
          </div>
          <div class="sort-filter-wrap">
            <div class="filter-wrap">
              <biggive-button class="filter" colourscheme="primary" fullwidth="" label="Filter" space-below="0"></biggive-button>
              <biggive-popup id="filter-popup">
                <h4 class="space-above-0 space-below-3 text-colour-primary">
                  Filters
                </h4>
                <biggive-form-field-select id="categories" placeholder="Category" space-below="2"></biggive-form-field-select>
                <biggive-form-field-select id="beneficiaries" placeholder="Beneficiary" space-below="2"></biggive-form-field-select>
                <biggive-form-field-select id="locations" placeholder="Location" space-below="2"></biggive-form-field-select>
                <biggive-form-field-select id="funding" placeholder="Funding" space-below="2"></biggive-form-field-select>
                <div class="align-right">
                  <biggive-button label="Apply filters"></biggive-button>
                </div>
              </biggive-popup>
            </div>
            <div class="sort-wrap">
              <biggive-form-field-select id="sort-by" placeholder="Sort by" select-style="underlined">
                <biggive-form-field-select-option label="Most raised" value="amountRaised"></biggive-form-field-select-option>
                <biggive-form-field-select-option label="Match funds remaining" value="matchFundsRemaining"></biggive-form-field-select-option>
                <biggive-form-field-select-option label="Relevance" value="Relevance"></biggive-form-field-select-option>
              </biggive-form-field-select>
            </div>
          </div>
          <div class="selected-filter-wrap">
            <div class="selected-filters"></div>
            <div class="clear-all">
              <a>
                Clear all
              </a>
            </div>
          </div>
          <div class="campaign-grid">
            <slot name="campaign-grid"></slot>
          </div>
        </div>
      </div>
    </mock:shadow-root>
  </biggive-campaign-card-filter-grid>
    `);
  });
});
