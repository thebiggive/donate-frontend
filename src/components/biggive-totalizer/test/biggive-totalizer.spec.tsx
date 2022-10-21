import { newSpecPage } from '@stencil/core/testing';
import { BiggiveTotalizer } from '../biggive-totalizer';

describe('biggive-totalizer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveTotalizer],
      html: `<biggive-totalizer></biggive-totalizer>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-totalizer>
        <mock:shadow-root>
          <div class="container space-below-0">
             <div class="sleeve">
               <div class="banner">
                 <div class="background-colour-secondary text-colour-black total-raised-wrap">
                   <span class="currency">
                     –
                   </span>
                   raised
                   <span>
                     inc. Gift Aid
                   </span>
                 </div>
                 <div class="background-colour-primary text-colour-white total-matched-funds-wrap">
                   <span class="currency">
                     –
                   </span>
                   total match funds
                 </div>
               </div>
             </div>
           </div>
        </mock:shadow-root>
      </biggive-totalizer>
    `);
  });
});
