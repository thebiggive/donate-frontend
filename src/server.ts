import { APP_BASE_HREF } from '@angular/common';
import { enableProdMode } from '@angular/core';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import compression from 'compression';
import { createHash } from 'crypto';
import express, { Request, Response } from 'express';
import helmet from 'helmet';
import morgan from 'morgan';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import { REQUEST, RESPONSE } from './express.tokens';
import { COUNTRY_CODE } from './app/country-code.token';
import { GetSiteControlService } from './app/getsitecontrol.service';
import bootstrap from './main.server';
import { environment } from './environments/environment';
import { supportedBrowsers } from './supportedBrowsers';

const donateHost = new URL(environment.donateUriPrefix).host;
const matomoUriBase = 'https://biggive.matomo.cloud';
const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

function isLegacyBrowser(userAgent: string): boolean {
  // Use the same browserslist-generated logic as client-side code
  // Modern browsers (Tier 1) get modern bundle, all others get ES5 bundle
  return !supportedBrowsers.test(userAgent);
}

enableProdMode();
const app = express();
const commonEngine = new CommonEngine();

app.use(compression());
// Sane header defaults, e.g. remove powered by, add HSTS, stop MIME sniffing etc.
// https://github.com/helmetjs/helmet#reference

// frame-src and child-src do very nearly the same thing, specifying both the same.
const frameAndChildSrc = [
  'https://*.js.stripe.com',
  'https://js.stripe.com',
  'https://hooks.stripe.com',
  'blob:', // for friendly-captcha
  'player.vimeo.com',
  'www.youtube.com',
  'www.youtube-nocookie.com',
];

app.use(
  helmet({
    contentSecurityPolicy: {
      directives: {
        ...helmet.contentSecurityPolicy.getDefaultDirectives(),
        'connect-src': [
          'wss:', // For GetSiteControl. wss:// is for secure-only WebSockets.
          new URL(environment.sfApiUriPrefix).host,
          new URL(environment.matchbotApiPrefix).host,
          new URL(environment.identityApiPrefix).host,
          matomoUriBase,
          'api.getAddress.io',
          '*.getsitecontrol.com',
          'api.friendlycaptcha.com',
          'https://api.stripe.com',
        ],
        'default-src': [`'none'`],
        'font-src': [`'self'`, 'fonts.gstatic.com', 'data:'],
        'style-src': [`'self'`, `'unsafe-inline'`, 'fonts.googleapis.com', 'data:'],
        'img-src': [`'self'`, 'data:', 'https:', matomoUriBase],
        'script-src': [
          `'self'`,
          donateHost,
          matomoUriBase,
          `'unsafe-eval'`,
          // See index.html for the following 3.
          `'sha256-6ujEsJG/tOHYHv4tR719xOmWBHvakweTgiTKCrqxTmo='`, // globalThis support check
          `'sha256-DE6hwZ1S7dULOe0jGZBNN5/DfHRm5z2TSGvQ//6OJXg='`, // Modern / legacy bundle choice
          `'sha256-1ax1jsrfb/mp8BcqopMnSNZo5r5VMGq+/sqVWcWcwsk='`, // Fully unsupported check / message visibility toggle
          `'sha256-${createHash('sha256').update(GetSiteControlService.getConfigureContent()).digest('base64')}'`,
          'api.getAddress.io',
          '*.getsitecontrol.com', // GSC support suggested using wildcard. DON-459.
          'js.stripe.com',
          'www.gstatic.com',
          // Vimeo's iframe embed seems to need script access to not error with our current embed approach.
          'https://player.vimeo.com',
          `'wasm-unsafe-eval'`, // for friendly-captcha, see https://docs.friendlycaptcha.com/#/csp
          `'self'`, // for friendly-captcha, see https://docs.friendlycaptcha.com/#/csp
          'https://*.js.stripe.com',
          'https://js.stripe.com',
        ],
        'worker-src': [
          'blob:', // friendly-captcha
        ],
        'frame-src': frameAndChildSrc,
        'child-src': frameAndChildSrc,
      },
    },
    referrerPolicy: {
      // see https://helmetjs.github.io/#referrer-policy - helmet default is `no-referrer`.
      // strict-origin-when-cross-origin  is the browser default since 2020. We need to include
      // our referring origin header specifically to enable the fundraisingregulator.org.uk
      // verification badge in our footer, and this matches what we have in WP.
      policy: 'strict-origin-when-cross-origin',
    },
  }),
);
app.use(morgan('combined')); // Log requests to stdout in Apache-like format

/**
 * Serve static files from /browser
 */
app.get('/robots.txt', (_req: Request, res: Response) => {
  res.type('text/plain');
  const sitemapLine = `Sitemap: ${environment.matchbotApiOrigin}/sitemap`;

  if (environment.production) {
    res.send('User-agent: *\nAllow: /\n\n' + sitemapLine);
  } else {
    // no need for sitemap outside prod.
    res.send('User-agent: *\nDisallow: /\n');
  }
});

app.get('/.well-known/apple-developer-merchantid-domain-association', (_req: Request, res: Response) => {
  res.sendFile(`${browserDistFolder}/assets/stripe-apple-developer-merchantid-domain-association`, {
    maxAge: '7 days',
  });
});

// Serve static files requested via /d/ from dist/browser/d - when deployed, S3 serves these up to CloudFront.
app.use(
  '/d',
  express.static(browserDistFolder, {
    immutable: true, // Everything in here should be named with an immutable hash.
    maxAge: '1 year',
  }),
);

app.use(
  '/d-es5',
  express.static(resolve(serverDistFolder, '../browser-es5'), {
    immutable: true, // Everything in here should be named with an immutable hash.
    maxAge: '1 year',
  }),
);

app.use(
  '/assets',
  express.static(`${browserDistFolder}/assets`, {
    maxAge: '1 day', // Assets should be served similarly but don't have name-hashes, so cache less.
  }),
);

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, headers, query } = req;
  const ua = headers['user-agent'] || '';

  // Use legacy bundle if explicitly requested via query param or if User-Agent indicates legacy browser
  const legacyRequested = query.legacy === '1';
  const useLegacy = legacyRequested || isLegacyBrowser(ua);

  // Choose modern or ES5 bundle
  const bundleFolder = useLegacy ? resolve(serverDistFolder, '../browser-es5') : browserDistFolder;

  // For SSR, we always use the server-generated index.html from the server dist folder
  // The ES5 bundle will have its own static index.html, but SSR uses the server version
  const indexHtmlPath = indexHtml; // Always use the SSR-capable index

  // For legacy browsers, if this is a static request (non-SSR), serve from ES5 bundle
  // But for SSR, we use the server index and point to ES5 assets via bundleFolder

  // Note that the file output as `index.html` is actually dynamic. See `index` config keys in `angular.json`.
  // See https://github.com/angular/angular-cli/issues/10881#issuecomment-530864193 for info on the undocumented use of
  // this key to work around `fileReplacements` ending index support in Angular 8.
  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtmlPath,
      inlineCriticalCss: false,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: bundleFolder,
      providers: [
        // Ensure we render with a supported base HREF, including behind an ALB and regardless of the
        // base reported by CloudFront when talking to the origin.
        // (Stock Angular SSR uses `req.baseUrl` but based on the previous note about CloudFront, from Angular Universal
        // days, I suspect this will still not be reliable for us.)
        { provide: APP_BASE_HREF, useValue: environment.donateUriPrefix },
        { provide: COUNTRY_CODE, useValue: req.header('CloudFront-Viewer-Country') || undefined },
        { provide: RESPONSE, useValue: res },
        { provide: REQUEST, useValue: req },
      ],
    })
    .then((html) => {
      // For legacy browsers, rewrite paths to point to ES5 bundle
      if (useLegacy) {
        html = html.replace(/src="\/d\//g, 'src="/d-es5/').replace(/href="\/d\//g, 'href="/d-es5/');
      }
      res.send(html);
    })
    .catch((err) => next(err));
});

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;

  const server = app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });

  /**
   * ALBs are configured with 60s timeout and these should be longer.
   * @link https://shuheikagawa.com/blog/2019/04/25/keep-alive-timeout/
   * @link https://adamcrowder.net/posts/node-express-api-and-aws-alb-502/
   */
  server.keepAliveTimeout = 65 * 1_000;
  server.timeout = 70 * 1_000;
}
