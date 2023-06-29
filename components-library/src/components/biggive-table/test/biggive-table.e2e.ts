import { newE2EPage } from '@stencil/core/testing';

describe('biggive-table', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-table></biggive-table>');

    const element = await page.find('biggive-table');
    expect(element).toHaveClass('hydrated');
  });
});
