import { newSpecPage } from '@stencil/core/testing';
import { DemoCampaignCards } from '../demo-campaign-cards';

describe('demo-campaign-cards', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [DemoCampaignCards],
      html: `<demo-campaign-cards></demo-campaign-cards>`,
      supportsShadowDom: true,
    });
    expect(page.root.shadowRoot).not.toBe(null);
  });
});
