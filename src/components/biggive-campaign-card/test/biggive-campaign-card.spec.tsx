import { newSpecPage } from '@stencil/core/testing';
import { BiggiveCampaignCard } from '../biggive-campaign-card';

describe('biggive-campaign-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveCampaignCard],
      html: `<biggive-campaign-card
        campaign-type="Match Funded"
        days-remaining="10"
        target="76543"
      ></biggive-campaign-card>`,
      supportsShadowDom: true,
    });
    expect(page.root).toEqualHtml(`
     <biggive-campaign-card campaign-type="Match Funded" days-remaining="10" target="76543">
      <mock:shadow-root>
        <div class="container">
          <div class="sleeve">
            <div class="campaign-type">
              <span>
                Match Funded
              </span>
            </div>
            <div class="content">
              <div class="meta-wrap style-1">
                <div class="meta-item">
                  <span class="label">
                    Days Remaining:
                  </span>
                  <span class="text">
                    10
                  </span>
                </div>
                <div class="meta-item">
                  <span class="label">
                    Target:
                  </span>
                  <span class="text">
                    £76,543
                  </span>
                </div>
              </div>
              <header>
                <div class="slug"></div>
                <h3></h3>
              </header>
              <div class="meta-wrap style-2">
                <div class="meta-item">
                  <span class="label">
                    Categories
                  </span>
                  <span class="text"></span>
                </div>
                <div class="meta-item">
                  <span class="label">
                    Helping
                  </span>
                  <span class="text"></span>
                </div>
              </div>
              <div class="meta-wrap style-3">
                <div class="meta-item">
                  <span class="label">
                    Match
                    <br>
                    Funds Remaining
                  </span>
                  <span class="text">
                    £NaN
                  </span>
                </div>
                <div class="meta-item">
                  <span class="label">
                    Total
                    <br>
                    Funds Received
                  </span>
                  <span class="text">
                    £NaN
                  </span>
                </div>
              </div>
              <div class="button-wrap">
                <a class="call-to-action"></a>
              </div>
            </div>
          </div>
        </div>
      </mock:shadow-root>
    </biggive-campaign-card>
    `);
  });
});
