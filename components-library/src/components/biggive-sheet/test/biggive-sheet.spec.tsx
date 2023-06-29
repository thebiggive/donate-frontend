import { newSpecPage } from '@stencil/core/testing';
import { BiggiveSheet } from '../biggive-sheet';

describe('biggive-sheet', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveSheet],
      html: `<biggive-sheet></biggive-sheet>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-sheet>
        <mock:shadow-root>
          <div class="container">
            <div class="background"></div>
            <div class="background-colour-primary popup text-colour-white">
              <div class="header">
                <div class="back-link">
                  <span class="colour-white svg-wrap">
                    <svg fill="none" height="16" viewBox="0 0 33 16" width="33" xmlns="http://www.w3.org/2000/svg">
                      <path d="M0.292892 7.29289C-0.0976295 7.68342 -0.0976295 8.31658 0.292892 8.70711L6.65685 15.0711C7.04738 15.4616 7.68054 15.4616 8.07107 15.0711C8.46159 14.6805 8.46159 14.0474 8.07107 13.6569L2.41421 8L8.07107 2.34315C8.46159 1.95262 8.46159 1.31946 8.07107 0.928932C7.68054 0.538408 7.04738 0.538408 6.65685 0.928932L0.292892 7.29289ZM33 7L1 7V9L33 9V7Z" fill="black"></path>
                    </svg>
                  </span>
                  Back
                </div>
                <div class="close-link">
                  <span class="svg-wrap">
                    <svg height="24" viewBox="0 0 24 24" width="24" xmlns="http://www.w3.org/2000/svg">
                      <path d="M11 11v-11h1v11h11v1h-11v11h-1v-11h-11v-1h11z"></path>
                    </svg>
                  </span>
                </div>
              </div>
              <div class="content">
                <slot></slot>
              </div>
            </div>
          </div>
        </mock:shadow-root>
      </biggive-sheet>
    `);
  });
});
