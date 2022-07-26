import { newSpecPage } from '@stencil/core/testing';
import { DemoCampaignCards } from '../demo-campaign-cards';

describe('demo-campaign-cards', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DemoCampaignCards],
      html: `<demo-campaign-cards></demo-campaign-cards>`,
    });
    expect(page.root).toEqualHtml(`
      <demo-campaign-cards>
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </demo-campaign-cards>
    `);
  });
});
