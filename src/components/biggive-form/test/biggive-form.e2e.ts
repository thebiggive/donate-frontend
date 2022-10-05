import { newE2EPage } from '@stencil/core/testing';

describe('biggive-form', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-form></biggive-form>');

    const element = await page.find('biggive-form');
    expect(element).toHaveClass('hydrated');
  });
});
