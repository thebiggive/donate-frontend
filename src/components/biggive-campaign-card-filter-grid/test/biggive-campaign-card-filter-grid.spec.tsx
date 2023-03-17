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
                  <path d="M416 208c0 45.9-14.9 88.3-40 122.7L502.6 457.4c12.5 12.5 12.5 32.8 0 45.3s-32.8 12.5-45.3 0L330.7 376c-34.4 25.2-76.8 40-122.7 40C93.1 416 0 322.9 0 208S93.1 0 208 0S416 93.1 416 208zM208 352a144 144 0 1 0 0-288 144 144 0 1 0 0 288z"></path>
                </svg>
                <input class="input-text" placeholder="Search" type="text" value="">
              </div>
              <biggive-button label="Search"></biggive-button>
            </div>
          </div>
          <div class="sort-filter-wrap">
             <div class="clear-all">
             <svg class="icon icon-clear-all" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
               <path d="M38.8 5.1C28.4-3.1 13.3-1.2 5.1 9.2S-1.2 34.7 9.2 42.9l592 464c10.4 8.2 25.5 6.3 33.7-4.1s6.3-25.5-4.1-33.7L406.6 293.4 567 97.3c9.8-12 11.8-28.5 5.2-42.5S551.5 32 536 32H104c-8.1 0-15.8 2.5-22.3 6.8L38.8 5.1zM256 400c0 10.1 4.7 19.6 12.8 25.6l64 48c9.7 7.3 22.7 8.4 33.5 3s17.7-16.5 17.7-28.6V398.5L256 297.7V400z"></path>
             </svg>
             <a>
               Clear all
             </a>
            </div>
            <div class="sort-wrap">
             <biggive-form-field-select id="sort-by" placeholder="Sort by">
               <biggive-form-field-select-option label="Most raised" value="amountRaised"></biggive-form-field-select-option>
               <biggive-form-field-select-option label="Match funds remaining" value="matchFundsRemaining"></biggive-form-field-select-option>
               <biggive-form-field-select-option label="Relevance" value="Relevance"></biggive-form-field-select-option>
              </biggive-form-field-select>
            </div>
            <div class="filter-wrap">
              <biggive-button class="filter" colourscheme="primary" fullwidth="" label="Filters" space-below="0">
              </biggive-button>
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
