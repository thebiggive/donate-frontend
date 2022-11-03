import { newE2EPage } from '@stencil/core/testing';

describe('biggive-article-card', () => {
  it('renders', async () => {
    const page = await newE2EPage();
    await page.setContent('<biggive-article-card></biggive-article-card>');

    const element = await page.find('biggive-article-card');
    expect(element).toHaveClass('hydrated');
  });
});
