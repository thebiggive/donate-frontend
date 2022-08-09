import 'zone.js/node';

import { enableProdMode } from '@angular/core';
import { renderToString } from '@biggive/components/hydrate';
import { ngExpressEngine } from '@nguniversal/express-engine';
import * as compression from 'compression';
import { createHash } from 'crypto';
import * as express from 'express';
import { Request, Response } from 'express';
import { existsSync } from 'fs';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { join } from 'path';

import { AnalyticsService } from './src/app/analytics.service';
import { AppServerModule } from './src/main.server';
import { COUNTRY_CODE } from './src/app/country-code.token';
import { HOST } from './src/app/host.token';
import { environment } from './src/environments/environment';
import { GetSiteControlService } from './src/app/getsitecontrol.service';

const apiHost = (new URL(environment.apiUriPrefix)).host;
const donationsApiHost = (new URL(environment.donationsApiPrefix)).host;
const donateGlobalHost = (new URL(environment.donateGlobalUriPrefix)).host;
const donateHost = (new URL(environment.donateUriPrefix)).host;

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
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
          'api.getAddress.io',
          '*.getsitecontrol.com',
          'fonts.googleapis.com',
          'stats.g.doubleclick.net',
          'www.google-analytics.com',
        ],
        'default-src': [
          `'self'`,
          apiHost,
          donationsApiHost,
          'fonts.googleapis.com',
          'fonts.gstatic.com',
          'js.stripe.com',
          'optimize.google.com',
          'player.vimeo.com',
          // Next 2 needed for reCAPTCHA to fully load.
          'recaptcha.google.com',
          'www.google.com',
          'www.youtube.com',
        ],
        'img-src': [
          `'self'`,
          'data:',
          'https:',
        ],
        'script-src': [
          donateGlobalHost,
          donateHost,
          `'unsafe-eval'`,
          `'unsafe-inline'`,
          `'nonce-${environment.recaptchaNonce}'`,
          `'sha256-wNvBKHC/AcXH+tcTOtnmNx/Ag5exRdBFD8iL9UUQ8es='`, // Unsupported browser inline script.
          `'sha256-${createHash('sha256').update(AnalyticsService.getConfigureContent()).digest('base64')}'`,
          `'sha256-${createHash('sha256').update(AnalyticsService.getOptimizeAntiFlickerScript()).digest('base64')}'`,
          `'sha256-${createHash('sha256').update(GetSiteControlService.getConfigureContent()).digest('base64')}'`,
          'api.getAddress.io',
          '*.getsitecontrol.com', // GSC support suggested using wildcard. DON-459.
          'js.stripe.com',
          // Next 2 needed for reCAPTCHA to fully load.
          'www.google.com',
          'www.gstatic.com',
          // https://support.google.com/optimize/answer/7388531?hl=en
          'optimize.google.com',
          'www.googleanalytics.com',
          'www.google-analytics.com',
          'www.googleoptimize.com',
          'www.googletagmanager.com',
        ],
      },
    },
  }));
  server.use(morgan('combined')); // Log requests to stdout in Apache-like format

  const distFolder = join(process.cwd(), 'dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
    inlineCriticalCss: false, // https://github.com/angular/universal/issues/2106#issuecomment-859720224
  }));

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

  server.get('/d/favicon.ico', (req: Request, res: Response) => {
    res.sendFile(`${distFolder}/favicon.ico`, {
      maxAge: '7 days', // Don't make the favicon immutable in case we want to update it
    });
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

  // All regular routes use the Universal engine
  server.get('*', (req: Request, res: Response) => {
    // Note that the file output as `index.html` is actually dynamic. See `index` config keys in `angular.json`.
    // See https://github.com/angular/angular-cli/issues/10881#issuecomment-530864193 for info on the undocumented use of
    // this key to work around `fileReplacements` ending index support in Angular 8.
    res.render(indexHtml, { req, providers: [
      { provide: COUNTRY_CODE, useValue: req.header('CloudFront-Viewer-Country') || undefined },
      // Required to set up `APP_BASE_HREF`. See `app.module.ts`.
      { provide: HOST, useValue: req.header('Host') || undefined },
    ]}, async (err: Error, html: string) => {
      if (err) {
        console.log(`Render error: ${err}`);
        res.sendStatus(500);
        return;
      }

      const hydratedDoc = await renderToString(html, {
        prettyHtml: true, // Don't `removeScripts` like Ionic does: we need them to handover to browser JS runtime successfully!
      });

      res.send(hydratedDoc.html);
    });
  });

  return server;
}

function run() {
  const port = process.env.PORT || 4000;

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
