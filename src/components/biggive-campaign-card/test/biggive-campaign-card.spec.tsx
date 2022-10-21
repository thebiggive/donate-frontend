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
        space-below="4"
      ></biggive-campaign-card>`,
    });
    expect(page.root).toEqualHtml(`
    <biggive-campaign-card campaign-type="Match Funded" currency-code="GBP" days-remaining="10" space-below="4" target="76543">
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
               <span class="label"></span>
               <span class="text">
                 –
               </span>
             </div>
             <div class="meta-item">
               <span class="label"></span>
               <span class="text">
                 –
               </span>
             </div>
           </div>
           <div class="progress-bar-wrap">
             <biggive-progress-bar colour-scheme="primary" counter="100"></biggive-progress-bar>
           </div>
           <div class="button-wrap">
             <biggive-button colour-scheme="primary" full-width="true" label="Donate now"></biggive-button>
             <biggive-button colour-scheme="clear-primary" full-width="true" label="Find out more"></biggive-button>
           </div>
             </div>
           </div>
         </mock:shadow-root>
    </biggive-campaign-card>
    `);
  });
});
