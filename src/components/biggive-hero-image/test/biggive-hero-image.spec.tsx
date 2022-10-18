/* eslint-disable prettier/prettier */
import { newSpecPage } from '@stencil/core/testing';
import { BiggiveHeroImage } from '../biggive-hero-image';

/**
 * @todo Ideally we should test *all* `@Prop`s and basics of SVG FontAwesome icon rendering.
 */
describe('biggive-hero-image', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveHeroImage],
      html: `<biggive-hero-image
        slug="My Slug"
        main-image=""
        main-title="This is my title"
        teaser="this is the intro text which I want to add"
      ></biggive-hero-image>`,
    });
    expect(page.root).toEqualHtml(`
     <biggive-hero-image slug="My Slug" main-image="" main-title="This is my title" teaser="this is the intro text which I want to add">
       <mock:shadow-root>
         <div class="colour-scheme-primary container">
           <div class="sleeve">
             <div class="content-wrap">
               <div class="slug text-colour-null">
                 My Slug
               </div>
               <h1 class="main-title text-colour-null">
                 This is my title
               </h1>
               <div class="teaser text-colour-null">
                 this is the intro text which I want to add
               </div>
             </div>
             <div class="graphic-wrap"></div>
           </div>
          </div>
        </mock:shadow-root>
      </biggive-hero-image>
    `);
  });
});
