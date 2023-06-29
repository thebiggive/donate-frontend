import { newSpecPage } from '@stencil/core/testing';
import { BiggiveTimeline } from '../biggive-timeline';

describe('biggive-timeline', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveTimeline],
      html: `<biggive-timeline></biggive-timeline>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-timeline>
        <mock:shadow-root>
          <div class="button-background-colour-white button-icon-colour-primary container entry-background-colour-white entry-date-colour-black entry-highlight-colour-secondary entry-text-colour-black entry-title-colour-primary navigation-highlight-colour-grey-medium selected-navigation-highlight-colour-primary selected-text-colour-primary space-below-0 text-colour-black">
            <div class="navigation">
              <div class="button prev" title="Previous">
                <svg fill="none" height="16" viewBox="0 0 9 16" width="9" xmlns="http://www.w3.org/2000/svg">
                  <path d="M8.29311 14.5703L1.73926 8.01646L8.29311 1.46261" stroke="#000000" stroke-width="2"></path>
                </svg>
              </div>
              <div class="sleeve">
                <ul></ul>
              </div>
              <div class="button next" title="Next">
                <svg fill="none" height="16" viewBox="0 0 9 16" width="9" xmlns="http://www.w3.org/2000/svg">
                  <path d="M0.739117 1.46094L7.29297 8.01479L0.739118 14.5686" stroke="#000000" stroke-width="2"></path>
                </svg>
              </div>
            </div>
            <div class="entry-wrap"></div>
          </div>
        </mock:shadow-root>
      </biggive-timeline>
    `);
  });
});
