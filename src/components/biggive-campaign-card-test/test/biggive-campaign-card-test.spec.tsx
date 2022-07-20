import { newSpecPage } from '@stencil/core/testing';
import { BiggiveCampaignCardTest } from '../biggive-campaign-card-test';

describe('biggive-campaign-card-test', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveCampaignCardTest],
      html: `<biggive-campaign-card-test></biggive-campaign-card-test>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-campaign-card-test>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-campaign-card-test>
    `);
  });
});
