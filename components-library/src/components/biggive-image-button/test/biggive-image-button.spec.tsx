import { newSpecPage } from '@stencil/core/testing';
import { BiggiveImageButton } from '../biggive-image-button';

describe('biggive-image-button', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveImageButton],
      html: `<biggive-image-button></biggive-image-button>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-image-button>
        <mock:shadow-root>
         <div class="background-colour-white background-padding-0 centered-false container rounded-false shadow-false space-below-1">
           <a target="_self">
             <div class="sleeve">
               <div class="circle-false image-style-cover image-wrap size-medium" style="background-image: url(undefined);"></div>
               <div class="text-colour-black text-padding-0 text-wrap"></div>
             </div>
           </a>
         </div>
        </mock:shadow-root>
      </biggive-image-button>
    `);
  });
});
