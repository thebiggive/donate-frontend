import { newSpecPage } from '@stencil/core/testing';
import { BiggiveIconButton } from '../biggive-icon-button';

describe('biggive-icon-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveIconButton],
      html: `<biggive-icon-button></biggive-icon-button>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-icon-button>
        <mock:shadow-root>
         <div class="background-colour-white background-padding-0 centered-false container rounded-false shadow-false space-below-1">
           <a target="_self">
             <div class="sleeve">
               <div class="circle-false icon-wrap size-medium">
                 <biggive-misc-icon></biggive-misc-icon>
               </div>
               <div class="text-colour-black text-padding-0 text-wrap"></div>
             </div>
           </a>
         </div>
        </mock:shadow-root>
      </biggive-icon-button>
    `);
  });
});
