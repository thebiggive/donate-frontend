import { newSpecPage } from '@stencil/core/testing';
import { BiggiveBeneficiaryIcon } from '../biggive-beneficiary-icon';

describe('biggive-beneficiary-icon', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveBeneficiaryIcon],
      html: `<biggive-beneficiary-icon></biggive-beneficiary-icon>`,
    });
    
    expect(page.root).toEqualHtml(`
      <biggive-beneficiary-icon>
        <div class="container">
          <div class="background-colour-primary beneficiary-icon-item">
            <a href="#">
              <svg class="fill-white" height="512" viewBox="0 0 448 512" width="448" xmlns="http://www.w3.org/2000/svg">
                <path d="M432 256c0 17.69-14.33 32.01-32 32.01H256v144c0 17.69-14.33 31.99-32 31.99s-32-14.3-32-31.99v-144H48c-17.67 0-32-14.32-32-32.01s14.33-31.99 32-31.99H192v-144c0-17.69 14.33-32.01 32-32.01s32 14.32 32 32.01v144h144C417.7 224 432 238.3 432 256z"></path>
              </svg>
            </a>
          </div>
          <div class="label"></div>
        </div>
      </biggive-beneficiary-icon>
    `);
  });
});
