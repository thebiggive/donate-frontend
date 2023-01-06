import { newSpecPage } from '@stencil/core/testing';
import { BiggiveArticleCard } from '../biggive-article-card';

describe('biggive-article-card', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveArticleCard],
      html: `<biggive-article-card></biggive-article-card>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-article-card>
        <mock:shadow-root>
             <div class="container space-below-0">
               <div class="background-colour-hover-tertiary background-colour-white sleeve text-colour-black">
                  <div class="content-wrap">
                   <div class="slug text-colour-primary"></div>
                   <div class="date"></div>
                   <h3 class="title">
                     <a></a>
                   </h3>
                   <div class="image-group">
                     <div class="image-wrap" style="background-image: url('undefined');">
                       <img>
                     </div>
                     <div class="image-label"></div>
                   </div>
                  </div>
                </div>
              </div>
        </mock:shadow-root>
      </biggive-article-card>
    `);
  });
});
