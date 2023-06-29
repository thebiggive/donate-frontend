import { newSpecPage } from '@stencil/core/testing';
import { BiggiveTotalizer } from '../biggive-totalizer';

describe('biggive-totalizer', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveTotalizer],
      html: `<biggive-totalizer>
        <biggive-totalizer-ticker-item figure="£1000" label="match funds remaining"></biggive-totalizer-ticker-item>
      </biggive-totalizer>`,
    });

    // It seems like in tests, the item copying post-render doesn't kick in – possibly because
    // some of our element selector presence guards don't pass in the `newSpecPage` run context?
    expect(page.root).toEqualHtml(`
      <biggive-totalizer>
        <mock:shadow-root>
          <div class="container space-below-0">
             <div>
               <div class="banner">
                 <div class="background-colour-secondary main-message-wrap text-colour-black"></div>
                 <div class="background-colour-primary text-colour-white ticker-wrap">
                   <div class="sleeve" id="sleeve_1">
                     <slot name="ticker-items"></slot>
                   </div>
                   <div class="sleeve sleeve-delayed-copy" id="sleeve_2"></div>
                 </div>
               </div>
             </div>
           </div>
        </mock:shadow-root>
        <biggive-totalizer-ticker-item figure="£1000" label="match funds remaining"></biggive-totalizer-ticker-item>
      </biggive-totalizer>
    `);
  });
});
