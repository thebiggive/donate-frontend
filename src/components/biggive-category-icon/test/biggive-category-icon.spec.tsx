import { newSpecPage } from '@stencil/core/testing';
import { BiggiveCategoryIcon } from '../biggive-category-icon';

describe('biggive-category-icon', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveCategoryIcon],
      html: `<biggive-category-icon></biggive-category-icon>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-category-icon>
        <div class="container">
          <div class="background-colour-primary category-icon-item">
            <a href="#">
              <svg class="fill-white" height="512" viewBox="0 0 448 512" width="448" xmlns="http://www.w3.org/2000/svg">
                <path d="M240 80c0-17.7-14.3-32-32-32s-32 14.3-32 32V224H32c-17.7 0-32 14.3-32 32s14.3 32 32 32H176V432c0 17.7 14.3 32 32 32s32-14.3 32-32V288H384c17.7 0 32-14.3 32-32s-14.3-32-32-32H240V80z"></path>
              </svg>
            </a>
          </div>
          <div class="label"></div>
        </div>
      </biggive-category-icon>
    `);
  });
});
