import 'zone.js/dist/zone-node';

import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode } from '@angular/core';
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
import { environment } from './src/environments/environment';
import { GetSiteControlService } from './src/app/getsitecontrol.service';

// The Express app is exported so that it can be used by serverless Functions.
export function app() {
  // Faster server renders w/ Prod mode (dev mode never needed)
  enableProdMode();

  const server = express();

  // Middleware
  server.use(compression());
  // Sane header defaults, e.g. remove powered by, add HSTS, stop MIME sniffing etc.
  // https://github.com/helmetjs/helmet#reference
  const apiHost = (new URL(environment.apiUriPrefix)).host;
  const donationsApiHost = (new URL(environment.donationsApiPrefix)).host;
  const donateHost = (new URL(environment.donateUriPrefix)).host;
  server.use(helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'connect-src': [
          'fonts.googleapis.com',
          'stats.g.doubleclick.net',
          'www.google-analytics.com',
        ],
        'default-src': [
          `'self'`,
          apiHost,
          donationsApiHost,
          'fonts.googleapis.com',
          'js.stripe.com',
          'player.vimeo.com',
          'www.youtube.com',
        ],
        'img-src': [
          `'self'`,
          'data:',
          'https:',
        ],
        'script-src': [
          'strict-dynamic',
          'unsafe-inline', // Backwards compat. https://csp-evaluator.withgoogle.com/
          donateHost,
          `'sha256-lAAe/2BNa8LfOLFsGspOHNtIPGU+RpI2Ne1/HaNdnLE='`, // IE fallback inline script?
          `'sha256-${createHash('sha256').update(AnalyticsService.getConfigureContent()).digest('base64')}'`,
          `'sha256-${createHash('sha256').update(GetSiteControlService.getConfigureContent()).digest('base64')}'`,
          'st.getsitecontrol.com',
          'widgets.getsitecontrol.com',
          'www.google-analytics.com',
          'www.googletagmanager.com',
          'js.stripe.com',
        ],
      },
    },
  }));
  server.use(morgan('combined')); // Log requests to stdout in Apache-like format

  const distFolder = join(process.cwd(), 'dist/browser');
  const indexHtml = existsSync(join(distFolder, 'index.original.html')) ? 'index.original.html' : 'index';

  // Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
  // @ts-ignore Suppress param type error for now. See https://github.com/angular/universal/issues/1210
  server.engine('html', ngExpressEngine({
    bootstrap: AppServerModule,
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

  // Serve static files requested via /d/ from dist/browser/d - when deployed S3 serves these up to CloudFront
  server.use('/d', express.static(distFolder, {
    immutable: true, // Everything in here should be named with an immutable hash
    maxAge: '1 year',
  }));

  server.use('/assets', express.static(`${distFolder}/assets`, {
    maxAge: '1 day', // Assets should be served similarly but don't have name-hashes
  }));

  // All regular routes use the Universal engine
  server.get('*', (req: Request, res: Response) => {
    // Note that the file output as `index.html` is actually dynamic. See `index` config keys in `angular.json`.
    // See https://github.com/angular/angular-cli/issues/10881#issuecomment-530864193 for info on the undocumented use of
    // this key to work around `fileReplacements` ending index support in Angular 8.
    res.render(indexHtml, { req, providers: [{ provide: APP_BASE_HREF, useValue: req.baseUrl }] });
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
