// TODO bring back all our previous server customisations!

import { APP_BASE_HREF } from '@angular/common';
import { CommonEngine, isMainModule } from '@angular/ssr/node';
import {renderToString} from '@biggive/components/hydrate';
import {setAssetPath} from '@biggive/components/dist/components';
import express, {Request, Response} from 'express';
import { dirname, join, resolve } from 'node:path';
import { fileURLToPath } from 'node:url';

import bootstrap from './main.server';
import {environment} from './environments/environment';

const serverDistFolder = dirname(fileURLToPath(import.meta.url));
const browserDistFolder = resolve(serverDistFolder, '../browser');
const indexHtml = join(serverDistFolder, 'index.server.html');

const app = express();
const commonEngine = new CommonEngine();

/**
 * Example Express Rest API endpoints can be defined here.
 * Uncomment and define endpoints as necessary.
 *
 * Example:
 * ```ts
 * app.get('/api/**', (req, res) => {
 *   // Handle API request
 * });
 * ```
 */

/**
 * Serve static files from /browser
 */
app.get('/robots.txt', (req: Request, res: Response) => {
  res.type('text/plain');
  if (environment.production) {
    res.send('User-agent: *\nAllow: /');
  } else {
    res.send('User-agent: *\nDisallow: /');
  }
});

app.get('/.well-known/apple-developer-merchantid-domain-association', (req: Request, res: Response) => {
  res.sendFile(`${browserDistFolder}/assets/stripe-apple-developer-merchantid-domain-association`, {
    maxAge: '7 days',
  });
});

// Serve static files requested via /d/ from dist/browser/d - when deployed, S3 serves these up to CloudFront.
app.use('/d', express.static(browserDistFolder, {
  immutable: true, // Everything in here should be named with an immutable hash.
  maxAge: '1 year',
}));

app.use('/assets', express.static(`${browserDistFolder}/assets`, {
  maxAge: '1 day', // Assets should be served similarly but don't have name-hashes, so cache less.
}));

/**
 * Handle all other requests by rendering the Angular application.
 */
app.get('**', (req, res, next) => {
  const { protocol, originalUrl, baseUrl, headers } = req;

  // Note that the file output as `index.html` is actually dynamic. See `index` config keys in `angular.json`.
  // See https://github.com/angular/angular-cli/issues/10881#issuecomment-530864193 for info on the undocumented use of
  // this key to work around `fileReplacements` ending index support in Angular 8.
  commonEngine
    .render({
      bootstrap,
      documentFilePath: indexHtml,
      url: `${protocol}://${headers.host}${originalUrl}`,
      publicPath: browserDistFolder,
      providers: [{ provide: APP_BASE_HREF, useValue: environment.donateUriPrefix }],
    })
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

/**
 * Start the server if this module is the main entry point.
 * The server listens on the port defined by the `PORT` environment variable, or defaults to 4000.
 */
if (isMainModule(import.meta.url)) {
  const port = process.env['PORT'] || 4000;
  app.listen(port, () => {
    console.log(`Node Express server listening on http://localhost:${port}`);
  });
}
