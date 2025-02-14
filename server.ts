import 'zone.js/node';

import {APP_BASE_HREF} from '@angular/common';
import {enableProdMode} from '@angular/core';
import {renderToString} from '@biggive/components/hydrate';
import {setAssetPath} from '@biggive/components/dist/components';
import * as compression from 'compression';
import {createHash} from 'crypto';
import {CommonEngine, CommonEngineRenderOptions} from '@angular/ssr/node';
import * as express from 'express';
import {Request, Response} from 'express';
import {existsSync} from 'node:fs';
import {join} from 'node:path';
import helmet from 'helmet';
import * as morgan from 'morgan';

import {AppServerModule} from './src/main.server';
import {REQUEST, RESPONSE} from './src/express.tokens';
import {COUNTRY_CODE} from './src/app/country-code.token';
import {environment} from './src/environments/environment';
import {GetSiteControlService} from './src/app/getsitecontrol.service';

const donateHost = (new URL(environment.donateUriPrefix)).host;
const matomoUriBase = 'https://biggive.matomo.cloud';

console.log('ROOT COPY OF SERVER USED');

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  console.log('ROOT COPY app() CALLED');

  // Faster server renders w/ Prod mode (dev mode never needed)
  // enableProdMode();

  const server = express();

  // will set both of these the same, see
  // https://stackoverflow.com/questions/30023608/how-to-use-frame-src-and-child-src-in-firefox-and-other-browsers
  // Middleware
  // server.use(compression());
  // Sane header defaults, e.g. remove powered by, add HSTS, stop MIME sniffing etc.
  // https://github.com/helmetjs/helmet#reference

  // frame-src and child-src do very nearly the same thing, specifying both the same.
  // const frameAndChildSrc = [
  //   'https://*.js.stripe.com',
  //   'https://js.stripe.com',
  //   'https://hooks.stripe.com',
  //   'blob:', // for friendly-captcha
  //   'player.vimeo.com',
  //   'www.youtube.com',
  //   'www.youtube-nocookie.com',
  // ];
  //
  // server.use(helmet({
  //   contentSecurityPolicy: {
  //     directives: {
  //       ...helmet.contentSecurityPolicy.getDefaultDirectives(),
  //       'connect-src': [
  //         'wss:', // For GetSiteControl. wss:// is for secure-only WebSockets.
  //         (new URL(environment.apiUriPrefix)).host,
  //         (new URL(environment.donationsApiPrefix)).host,
  //         (new URL(environment.identityApiPrefix)).host,
  //         matomoUriBase,
  //         'www.facebook.com', // Required for Meta Pixel in some browsers. https://josephpinder.com/blog/facebook-pixel-is-slowing-down-your-website-and-how-to-fix-it-securely
  //         'api.getAddress.io',
  //         '*.getsitecontrol.com',
  //         'api.friendlycaptcha.com',
  //         'https://api.stripe.com',
  //       ],
  //       'default-src': [
  //         `'none'`
  //       ],
  //       'font-src': [
  //         `'self'`,
  //         'fonts.gstatic.com',
  //         'data:',
  //       ],
  //       'style-src': [
  //         `'self'`,
  //         `'unsafe-inline'`,
  //         'fonts.googleapis.com',
  //         'data:',
  //       ],
  //       'img-src': [
  //         `'self'`,
  //         'data:',
  //         'https:',
  //         matomoUriBase,
  //       ],
  //       'script-src': [
  //         `'self'`,
  //         donateHost,
  //         matomoUriBase,
  //         `'unsafe-eval'`,
  //         `'nonce-OT22mYwcUVPp' *.facebook.net`, // Meta Pixel. https://josephpinder.com/blog/facebook-pixel-is-slowing-down-your-website-and-how-to-fix-it-securely
  //         `'sha256-wNvBKHC/AcXH+tcTOtnmNx/Ag5exRdBFD8iL9UUQ8es='`, // Unsupported browser inline script.
  //         `'sha256-${createHash('sha256').update(GetSiteControlService.getConfigureContent()).digest('base64')}'`,
  //         'api.getAddress.io',
  //         '*.getsitecontrol.com', // GSC support suggested using wildcard. DON-459.
  //         'js.stripe.com',
  //         'www.gstatic.com',
  //         // Vimeo's iframe embed seems to need script access to not error with our current embed approach.
  //         'https://player.vimeo.com',
  //         `'wasm-unsafe-eval'`,`'self'`, // for friendly-captcha, see https://docs.friendlycaptcha.com/#/csp
  //         'https://*.js.stripe.com',
  //         'https://js.stripe.com',
  //       ],
  //       'worker-src': [
  //         'blob:', // friendly-captcha
  //       ],
  //       'frame-src': frameAndChildSrc,
  //       'child-src': frameAndChildSrc,
  //     },
  //   },
  // }));
  // server.use(morgan('combined')); // Log requests to stdout in Apache-like format

  const distFolder = join(process.cwd(), 'dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  // server.get('/robots.txt', (req: Request, res: Response) => {
  //   res.type('text/plain');
  //   if (environment.production) {
  //     res.send('User-agent: *\nAllow: /');
  //   } else {
  //     res.send('User-agent: *\nDisallow: /');
  //   }
  // });
  //
  // server.get('/.well-known/apple-developer-merchantid-domain-association', (req: Request, res: Response) => {
  //   res.sendFile(`${distFolder}/assets/stripe-apple-developer-merchantid-domain-association`, {
  //     maxAge: '7 days',
  //   });
  // });

  // Serve static files requested via /d/ from dist/browser/d - when deployed, S3 serves these up to CloudFront.
  server.use('/d', express.static(distFolder, {
    immutable: true, // Everything in here should be named with an immutable hash.
    maxAge: '1 year',
  }));

  server.use('/assets', express.static(`${distFolder}/assets`, {
    maxAge: '1 day', // Assets should be served similarly but don't have name-hashes, so cache less.
  }));

  // All regular routes use the SSR engine
  server.get('*', async (req: Request, res: Response, next) => {
    const { protocol, originalUrl, headers } = req;

    const renderOptions: CommonEngineRenderOptions = {
      bootstrap: AppServerModule,
      documentFilePath: indexHtml,
      // inlineCriticalCss: false,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: distFolder,
      providers: [
        // Ensure we render with a supported base HREF, including behind an ALB and regardless of the
        // base reported by CloudFront when talking to the origin.
        // (Stock Angular SSR uses `req.baseUrl` but based on the previous note about CloudFront, from Angular Universal
        // days, I suspect this will still not be reliable for us.)
        { provide: APP_BASE_HREF, useValue: environment.donateUriPrefix, },
        // { provide: COUNTRY_CODE, useValue: req.header('CloudFront-Viewer-Country') || undefined },
        // { provide: RESPONSE, useValue: res },
        // { provide: REQUEST, useValue: req }
      ]
    };

    // Note that the file output as `index.html` is actually dynamic. See `index` config keys in `angular.json`.
    // See https://github.com/angular/angular-cli/issues/10881#issuecomment-530864193 for info on the undocumented use of
    // this key to work around `fileReplacements` ending index support in Angular 8.
    commonEngine.render(renderOptions)
      // .then(async (html) => {
      //   setAssetPath(`${environment.donateUriPrefix}/assets`);
      //
      //   const hydratedDoc = await renderToString(html, {
      //     // Don't `removeScripts` like Ionic does: we need them to handover to browser JS runtime successfully!
      //     // prettyHtml: true,
      //     // removeHtmlComments: true,
      //   });
      //
      //   res.send(hydratedDoc.html);
      // })
      .then((html) => res.send(html))
      .catch((err) => next(err));
  });

  return server;
}

function run(): void {
  const port = process.env['SSR_PORT'] || 4000;

  // Start up the Node server
  const server = app();
  const liveServer = server.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });

  /**
   * ALBs are configured with 60s timeout and these should be longer.
   * @link https://shuheikagawa.com/blog/2019/04/25/keep-alive-timeout/
   * @link https://adamcrowder.net/posts/node-express-api-and-aws-alb-502/
   */
  liveServer.keepAliveTimeout = 65 * 1000;
  liveServer.timeout = 70 * 1000;
}

run();

// export * from './src/main.server';
