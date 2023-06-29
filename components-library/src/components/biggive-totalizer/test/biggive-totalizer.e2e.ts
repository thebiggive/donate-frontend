import { newE2EPage } from '@stencil/core/testing';

describe('biggive-totalizer', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-totalizer></biggive-totalizer>');

    const element = await page.find('biggive-totalizer');
    expect(element).toHaveClass('hydrated');
  });
});
