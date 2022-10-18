import { newSpecPage } from '@stencil/core/testing';
import { BiggiveCampaignCardFilterGrid } from '../biggive-campaign-card-filter-grid';

describe('biggive-campaign-card-filter-grid', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveCampaignCardFilterGrid],
      html: `<biggive-campaign-card-filter-grid></biggive-campaign-card-filter-grid>`,
    });
    expect(page.root).toEqualHtml(`
    <biggive-campaign-card-filter-grid>
    <mock:shadow-root>
      <div class="container">
        <div class="sleeve">
          <div class="search-wrap">
            <h4>
              Find a charity or project
            </h4>
            <div class="field-wrap">
              <div class="input-wrap">
                <svg class="icon" viewBox="0 0 512 512" xmlns="http://www.w3.org/2000/svg">
                  <path d="M500.3 443.7l-119.7-119.7c27.22-40.41 40.65-90.9 33.46-144.7C401.8 87.79 326.8 13.32 235.2 1.723C99.01-15.51-15.51 99.01 1.724 235.2c11.6 91.64 86.08 166.7 177.6 178.9c53.8 7.189 104.3-6.236 144.7-33.46l119.7 119.7c15.62 15.62 40.95 15.62 56.57 0C515.9 484.7 515.9 459.3 500.3 443.7zM79.1 208c0-70.58 57.42-128 128-128s128 57.42 128 128c0 70.58-57.42 128-128 128S79.1 278.6 79.1 208z"></path>
                </svg>
                <input class="input-text" placeholder="Search" type="text">
              </div>
              <button class="button button-primary">
                Search
              </button>
            </div>
          </div>
          <div class="filter-wrap"></div>
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
