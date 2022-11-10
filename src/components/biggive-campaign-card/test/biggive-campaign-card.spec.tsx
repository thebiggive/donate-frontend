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
        primary-figure-label="Primary label"
        primary-figure-amount="£123"
        secondary-figure-label="Secondary label"
        secondary-figure-amount="£1,000"
        target="76543"
        space-below="4"
      ></biggive-campaign-card>`,
    });
    expect(page.root).toEqualHtml(`
    <biggive-campaign-card campaign-type="Match Funded"  days-remaining="10" primary-figure-label="Primary label" primary-figure-amount="£123" secondary-figure-label="Secondary label" secondary-figure-amount="£1,000" space-below="4" target="76543">
     <mock:shadow-root>
       <div class="container space-below-4">
             <div class="sleeve">
               <div class="campaign-type">
                 <span>
                   Match Funded
                 </span>
           </div>
           <div class="banner image-wrap"></div>
           <div class="title-wrap">
             <h3></h3>
             <div class="organisation-name">
               By
             </div>
           </div>
           <div class="meta-wrap">
             <div class="meta-item">
               <span class="label">Primary label</span>
               <span class="text">£123</span>
             </div>
             <div class="meta-item">
               <span class="label">Secondary label</span>
               <span class="text">£1,000</span>
             </div>
           </div>
             </div>
           </div>
         </mock:shadow-root>
    </biggive-campaign-card>
    `);
  });
});
