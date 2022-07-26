import { newSpecPage } from '@stencil/core/testing';
import { BiggiveCampaignCard } from '../biggive-campaign-card';

describe('biggive-campaign-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveCampaignCard],
      html: `<biggive-campaign-card></biggive-campaign-card>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-campaign-card>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-campaign-card>
    `);
  });
});
