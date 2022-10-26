import { newSpecPage } from '@stencil/core/testing';
import { BiggiveHeader } from '../biggive-header';

describe('biggive-header', () => {
  it('renders', async () => {
    const page = await newSpecPage({
      components: [BiggiveHeader],
      html: `<biggive-header></biggive-header>`,
    });
    expect(page.root).toEqualHtml(`
      <biggive-header>
        <mock:shadow-root>
          <header class="header space-below0">
            <div class="row row-top">
              <div class="social-icon-wrap">
                <biggive-social-icon background-colour="tertiary" icon-colour="black" service="Facebook" url="https://www.facebook.com"></biggive-social-icon>
                <biggive-social-icon background-colour="tertiary" icon-colour="black" service="Twitter" url="https://www.twitter.com"></biggive-social-icon>
                <biggive-social-icon background-colour="tertiary" icon-colour="black" service="LinkedIn" url="https://www.linkedin.com"></biggive-social-icon>
                <biggive-social-icon background-colour="tertiary" icon-colour="black" service="YouTube" url="https://www.youtube.com"></biggive-social-icon>
                <biggive-social-icon background-colour="tertiary" icon-colour="black" service="Instagram" url="https://www.instagram.com"></biggive-social-icon>
              </div>
              <nav class="nav nav-secondary">
                <ul></ul>
              </nav>
            </div>
            <div class="row row-bottom">
                <div class="logo-wrap">
                  <svg fill="none" height="30" viewBox="0 0 149 30" width="149" xmlns="http://www.w3.org/2000/svg">
                    <path d="M59.9362 6.08031C58.258 6.08031 56.8195 4.70363 56.8195 3.04015C56.8195 1.37667 58.258 0 59.9362 0C61.7342 0 63.1127 1.37667 63.1127 3.04015C63.1127 4.70363 61.7342 6.08031 59.9362 6.08031ZM57.4189 23.805H62.4534V7.74379H57.4189V23.805ZM76.5981 7.74379V8.71893C75.8189 7.97323 74.2606 7.34226 72.4626 7.34226C67.9674 7.34226 64.3114 10.5545 64.3114 15.2008C64.3114 19.9044 67.9674 23.0593 72.4626 23.0593C74.2606 23.0593 75.8189 22.543 76.5981 21.6826V22.6004C76.5981 24.6654 74.6801 25.6979 72.1629 25.6979C70.0052 25.6979 68.1472 25.239 66.4091 24.2639V29.0249C68.5068 29.7706 70.8443 30 72.4026 30C77.4371 30 81.6326 27.9924 81.6326 22.7151V7.68643H76.5981V7.74379ZM76.5981 17.2084C75.8788 18.1836 74.6801 18.6424 73.3616 18.6424C71.2639 18.6424 69.5257 17.4379 69.5257 15.2008C69.5257 13.021 71.2639 11.7591 73.3616 11.7591C74.6801 11.7591 75.8788 12.3327 76.5981 13.2505V17.2084ZM96.1368 24.2065C100.093 24.2065 102.55 23.5182 104.588 22.2562V9.98088H93.6196V14.6845H99.4332V18.8145C98.5942 19.044 97.6352 19.2161 96.2567 19.2161C91.342 19.2161 88.9446 16.0612 88.9446 12.3901C88.9446 8.71893 91.7016 5.56405 96.916 5.56405C99.0736 5.56405 101.171 6.13767 102.73 6.94073V1.72084C101.231 1.14723 99.3134 0.630979 96.6163 0.630979C89.0046 0.630979 83.6104 5.90822 83.6104 12.4474C83.5505 19.1013 88.4652 24.2065 96.1368 24.2065ZM109.442 6.08031C107.764 6.08031 106.326 4.70363 106.326 3.04015C106.326 1.37667 107.764 0 109.442 0C111.24 0 112.619 1.37667 112.619 3.04015C112.619 4.70363 111.18 6.08031 109.442 6.08031ZM106.925 23.805H111.96V7.74379H106.925V23.805ZM123.227 14.9713L118.972 7.74379H113.098L123.167 24.1491L133.237 7.74379H127.483L123.227 14.9713ZM137.372 16.9216H148.999C149.059 9.92352 144.804 7.39962 140.549 7.39962C136.053 7.39962 132.038 9.98088 131.978 15.7744C131.978 21.3958 136.113 24.1491 141.088 24.1491C143.246 24.1491 145.523 23.8623 147.501 22.8872V18.4704C144.984 19.847 143.366 19.9044 141.927 19.9044C139.769 19.847 137.552 19.2161 137.372 16.9216ZM140.608 11.1281C142.107 11.1281 143.425 11.8164 143.605 13.8241H137.372C137.732 11.8738 139.11 11.1281 140.608 11.1281ZM51.5453 11.3576C52.744 10.325 53.3433 9.00574 53.3433 7.34226C53.3433 4.24474 50.3466 1.03251 46.0313 1.03251H38V23.8623H48.4287C52.5042 23.8623 55.6209 20.8795 55.6209 17.0937C55.6209 14.7992 54.542 12.3327 51.5453 11.3576ZM43.2743 5.67878H45.6717C47.1101 5.67878 48.129 6.76865 48.129 7.97324C48.129 9.17782 47.1101 10.2103 45.6717 10.2103H43.2743V5.67878ZM47.9492 19.1587H43.2743V14.5698H47.9492C49.3876 14.5698 50.4665 15.6023 50.4665 16.8643C50.4665 18.1262 49.3876 19.1587 47.9492 19.1587Z" fill="black"></path>
                    <path d="M21.543 1.01514L35 23.9999H8.08594L21.543 1.01514Z" fill="black"></path>
                    <path d="M9.36142 16.9564L0 1H18.7228L9.36142 16.9564Z" fill="#2AF135"></path>
                  </svg>
                </div>
              <nav class="nav nav-primary"><ul></ul></nav>
            </div>
          </header>
        </mock:shadow-root>
      </biggive-header>
    `);
  });
});
