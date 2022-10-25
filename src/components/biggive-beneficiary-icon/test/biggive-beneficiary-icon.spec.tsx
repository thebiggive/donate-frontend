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
        <mock:shadow-root>
          <slot></slot>
        </mock:shadow-root>
      </biggive-beneficiary-icon>
    `);
  });
});
