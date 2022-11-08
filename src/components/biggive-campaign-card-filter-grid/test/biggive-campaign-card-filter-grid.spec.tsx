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
                <input class="input-text" placeholder="Search" type="text">
              </div>
              <button class="button button-primary">
                Search
              </button>
            </div>
          </div>
          <div class="sort-filter-wrap">
            <div class="sort-wrap">
             <biggive-form-field-select id="sort-by" placeholder="Sort by">
               <biggive-form-field-select-option label="Most raised" value="amountRaised"></biggive-form-field-select-option>
               <biggive-form-field-select-option label="Match funds remaining" value="matchFundsRemaining"></biggive-form-field-select-option>
              </biggive-form-field-select>
            </div>
            <div class="filter-wrap">
              <div class="button button-primary filter">
                <span class="filter-icon">
                  <svg fill="none" height="15" viewBox="0 0 16 15" width="16" xmlns="http://www.w3.org/2000/svg">
                    <path d="M0.12042 0.76576C0.327224 0.298 0.766961 0 1.25014 0H14.7517C15.2361 0 15.6736 0.298 15.8799 0.76576C16.0893 1.23352 16.0237 1.787 15.6924 2.18745L10.0011 9.67328V13.929C10.0011 14.3341 9.7886 14.7058 9.44793 14.8866C9.1104 15.0674 8.7041 15.0306 8.40094 14.7862L6.40072 13.179C6.14756 12.9781 6.00067 12.66 6.00067 12.3218V9.67328L0.282594 2.18745C-0.023284 1.787 -0.0864161 1.23352 0.120451 0.76576H0.12042Z" fill="white"></path>
                  </svg>
                </span>
                Filters
              </div>
              <biggive-popup id="filter-popup">
                <h4 class="colour-primary space-above-0 space-below-3">
                  Filters
                </h4>
                <biggive-form-field-select id="categories" placeholder="Category" space-below="2"></biggive-form-field-select>
                <biggive-form-field-select id="beneficiaries" placeholder="Beneficiary" space-below="2"></biggive-form-field-select>
                <biggive-form-field-select id="locations" placeholder="Location" space-below="2"></biggive-form-field-select>
                <biggive-form-field-select id="funding" placeholder="Funding" space-below="2"></biggive-form-field-select>
                <div class="align-right">
                  <button class="button button-primary">
                    Apply filters
                  </button>
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
