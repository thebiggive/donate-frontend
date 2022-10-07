import { newSpecPage } from '@stencil/core/testing';
import { BiggiveCampaignCard } from '../biggive-campaign-card';

/**
 * @todo Ideally we should test *all* `@Prop`s and basics of SVG FontAwesome icon rendering.
 */
describe('biggive-campaign-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveCampaignCard],
      html: `<biggive-campaign-card
        campaign-type="Match Funded"
        days-remaining="10"
        currency-code="GBP"
        target="76543"
      ></biggive-campaign-card>`,
    });
    expect(page.root).toEqualHtml(`
     <biggive-campaign-card campaign-type="Match Funded" days-remaining="10" currency-code="GBP" target="76543">
      <mock:shadow-root>
      <div class="container">
        <div class="sleeve">
          <div class="campaign-type">
            <span>
              Match Funded
            </span>
          </div>
          <div class="title-wrap">
            <h3></h3>
            <div class="slug">By </div>
          </div>
          <div class="meta-wrap">
            <div class="meta-item">
              <span class="label">Match Funds Remaining</span>
              <span class="text">
                –
              </span>
            </div>
            <div class="meta-item">
              <span class="label">Total Funds Received</span>
              <span class="text">
                –
              </span>
            </div>
          </div>
          <biggive-progress-bar colour-scheme="primary"></biggive-progress-bar>
          <biggive-button colour-scheme="primary" label="Donate now"></biggive-button>
          <biggive-button colour-scheme="clear" label="Find out more"></biggive-button>
        </div>
      </div>
      </mock:shadow-root>
    </biggive-campaign-card>
    `);
  });
});
