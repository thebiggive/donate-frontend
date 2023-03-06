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
        slugColour="my-slug-colour"
        mainTitleColour="my-main-title-colour"
        teaserColour="my-teaser-colour"
        main-title="This is my title"
        teaser="this is the intro text which I want to add"
      ></biggive-hero-image>`,
    });
    expect(page.root).toEqualHtml(`
     <biggive-hero-image main-title="This is my title" maintitlecolour="my-main-title-colour" slug="My Slug" slugcolour="my-slug-colour" teaser="this is the intro text which I want to add" teasercolour="my-teaser-colour">
       <mock:shadow-root>
         <div class="colour-scheme-primary container space-below-0">
           <div class="sleeve">
             <div class="content-wrap">
               <div class="image-wrap logo logo-height-3">
                <img alt="" src="">
               </div>
               <div class="slug text-colour-undefined">
                 My Slug
               </div>
               <h1 class="main-title">
                 This is my title
               </h1>
               <div class="teaser">
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
