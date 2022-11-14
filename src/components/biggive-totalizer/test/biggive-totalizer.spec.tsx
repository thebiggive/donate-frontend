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
                 <div class="background-colour-secondary main-message-wrap text-colour-black"></div>
                 <div class="background-colour-primary text-colour-white ticker-wrap">
                   <div class="sleeve" style="animation-duration: NaNs;">
                     <slot name="ticker-items"></slot>
                   </div>
                 </div>
               </div>
             </div>
           </div>
        </mock:shadow-root>
      </biggive-totalizer>
    `);
  });
});
