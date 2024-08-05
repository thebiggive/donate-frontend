import 'zone.js/node';

import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode } from '@angular/core';
import { renderToString } from '@biggive/components/hydrate';
import { setAssetPath } from '@biggive/components/dist/components';
import * as compression from 'compression';
import { createHash } from 'crypto';
import { CommonEngine, CommonEngineRenderOptions } from '@angular/ssr';
import * as express from 'express';
import { existsSync } from 'node:fs';
import { join } from 'node:path';
import { Request, Response } from 'express';
import helmet from 'helmet';
import * as morgan from 'morgan';

import { AppServerModule } from './src/main.server';
import { REQUEST, RESPONSE } from './src/express.tokens';
import { COUNTRY_CODE } from './src/app/country-code.token';
import { environment } from './src/environments/environment';
import { GetSiteControlService } from './src/app/getsitecontrol.service';

const apiHost = (new URL(environment.apiUriPrefix)).host;
const donationsApiHost = (new URL(environment.donationsApiPrefix)).host;
const donateHost = (new URL(environment.donateUriPrefix)).host;
const identityApiHost = (new URL(environment.identityApiPrefix)).host;
const matomoUriBase = 'https://biggive.matomo.cloud';

// The Express app is exported so that it can be used by serverless Functions.
export function app(): express.Express {
  // Faster server renders w/ Prod mode (dev mode never needed)
  enableProdMode();

  const server = express();

  // Middleware
  server.use(compression());
  // Sane header defaults, e.g. remove powered by, add HSTS, stop MIME sniffing etc.
  // https://github.com/helmetjs/helmet#reference
  server.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'connect-src': [
          'wss:', // For GetSiteControl. wss:// is for secure-only WebSockets.
          apiHost,
          donationsApiHost,
          identityApiHost,
          matomoUriBase,
          'www.facebook.com', // Required for Meta Pixel in some browsers. https://josephpinder.com/blog/facebook-pixel-is-slowing-down-your-website-and-how-to-fix-it-securely
          'api.getAddress.io',
          '*.getsitecontrol.com',
          'fonts.googleapis.com',
          'api.friendlycaptcha.com',
        ],
        'default-src': [
          `'self'`,
          apiHost,
          donationsApiHost,
          identityApiHost,
          'fonts.googleapis.com',
          'fonts.gstatic.com',
          'js.stripe.com',
          'player.vimeo.com',
          'recaptcha.net',
          'www.recaptcha.net',
          'www.youtube.com',
          'www.youtube-nocookie.com',
        ],
        'img-src': [
          `'self'`,
          'data:',
          'https:',
          matomoUriBase,
        ],
        'script-src': [
          donateHost,
          matomoUriBase,
          `'unsafe-eval'`,
          `'unsafe-inline'`,
          `'nonce-OT22mYwcUVPp' *.facebook.net`, // Meta Pixel. https://josephpinder.com/blog/facebook-pixel-is-slowing-down-your-website-and-how-to-fix-it-securely
          `'nonce-${environment.recaptchaNonce}'`,
          `'sha256-wNvBKHC/AcXH+tcTOtnmNx/Ag5exRdBFD8iL9UUQ8es='`, // Unsupported browser inline script.
          `'sha256-${createHash('sha256').update(GetSiteControlService.getConfigureContent()).digest('base64')}'`,
          'api.getAddress.io',
          '*.getsitecontrol.com', // GSC support suggested using wildcard. DON-459.
          'js.stripe.com',
          'recaptcha.net',
          'www.gstatic.com',
          // Vimeo's iframe embed seems to need script access to not error with our current embed approach.
          'https://player.vimeo.com',
        ],
      },
    },
  }));
  server.use(morgan('combined')); // Log requests to stdout in Apache-like format

  const distFolder = join(process.cwd(), 'dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html'))
    ? join(distFolder, 'index.original.html')
    : join(distFolder, 'index.html');

  const commonEngine = new CommonEngine();

  server.set('view engine', 'html');
  server.set('views', distFolder);

  server.get('/robots.txt', (req: Request, res: Response) => {
    res.type('text/plain');
    if (environment.production) {
      res.send('User-agent: *\nAllow: /');
    } else {
      res.send('User-agent: *\nDisallow: /');
    }
  });

  server.get('/.well-known/apple-developer-merchantid-domain-association', (req: Request, res: Response) => {
    res.sendFile(`${distFolder}/assets/stripe-apple-developer-merchantid-domain-association`, {
      maxAge: '7 days',
    });
  });

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
      inlineCriticalCss: false,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: distFolder,
      providers: [
        // Ensure we render with a supported base HREF, including behind an ALB and regardless of the
        // base reported by CloudFront when talking to the origin.
        // (Stock Angular SSR uses `req.baseUrl` but based on the previous note about CloudFront, from Angular Universal
        // days, I suspect this will still not be reliable for us.)
        { provide: APP_BASE_HREF, useValue: environment.donateUriPrefix, },
        { provide: COUNTRY_CODE, useValue: req.header('CloudFront-Viewer-Country') || undefined },
        { provide: RESPONSE, useValue: res },
        { provide: REQUEST, useValue: req }
      ]
    };

    // Note that the file output as `index.html` is actually dynamic. See `index` config keys in `angular.json`.
    // See https://github.com/angular/angular-cli/issues/10881#issuecomment-530864193 for info on the undocumented use of
    // this key to work around `fileReplacements` ending index support in Angular 8.
    commonEngine.render(renderOptions)
      .then(async (html) => {
        setAssetPath(`${environment.donateUriPrefix}/assets`);

        const hydratedDoc = await renderToString(html, {
          // Don't `removeScripts` like Ionic does: we need them to handover to browser JS runtime successfully!
          prettyHtml: true,
          removeHtmlComments: true,
        });

        res.send(hydratedDoc.html);
      })
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

// Webpack will replace 'require' with '__webpack_require__'
// '__non_webpack_require__' is a proxy to Node 'require'
// The below code is to ensure that the server is run only when not requiring the bundle.
declare const __non_webpack_require__: NodeRequire;
const mainModule = __non_webpack_require__.main;
const moduleFilename = mainModule && mainModule.filename || '';
if (moduleFilename === __filename || moduleFilename.includes('iisnode')) {
  run();
}

export * from './src/main.server';
