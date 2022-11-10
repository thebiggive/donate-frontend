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
