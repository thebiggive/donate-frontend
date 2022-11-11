import { newSpecPage } from '@stencil/core/testing';
import { BiggiveCampaignHighlights } from '../biggive-campaign-highlights';

describe('biggive-campaign-highlights', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveCampaignHighlights],
      html: `<biggive-campaign-highlights
        primary-figure-label="Foo"
        primary-figure-amount="£123"
        secondary-figure-label="Bar"
        secondary-figure-amount="£456"
      ></biggive-campaign-highlights>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-campaign-highlights primary-figure-label="Foo" primary-figure-amount="£123" secondary-figure-label="Bar" secondary-figure-amount="£456">
        <mock:shadow-root>
          <div class="container space-below-0">
            <div class="sleeve">
              <div class="meta-wrap">
                <div class="meta-item">
                  <span class="label">Foo</span>
                  <span class="text">£123</span>
                </div>
                <div class="meta-item">
                  <span class="label">Bar</span>
                  <span class="text">£456</span>
                </div>
              </div>
              <div class="progress-bar-wrap">
                <biggive-progress-bar colour-scheme="primary" counter="100"></biggive-progress-bar>
              </div>
              <div class="stat-wrap"></div>
            </div>
          </div>
        </mock:shadow-root>
      </biggive-campaign-highlights>
    `);
  });
});
