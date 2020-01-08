import 'zone.js/dist/zone-node';
import 'reflect-metadata';
import { enableProdMode } from '@angular/core';
import { ngExpressEngine } from '@nguniversal/express-engine';
// Import module map for lazy loading
import { provideModuleMap } from '@nguniversal/module-map-ngfactory-loader';
import * as compression from 'compression';
import * as express from 'express';
import * as helmet from 'helmet';
import * as morgan from 'morgan';
import { join } from 'path';

import { environment } from './src/environments/environment';

// Faster server renders w/ Prod mode (dev mode never needed)
enableProdMode();

// Express server
const app = express();

app.use(compression());
app.use(helmet()); // Sane header defaults, e.g. remove powered by, add HSTS, stop MIME sniffing etc.
app.use(morgan('combined')); // Log requests to stdout in Apache-like format

const PORT = process.env.PORT || 4000;
const DIST_FOLDER = join(process.cwd(), 'dist/browser');

// * NOTE :: leave this as require() since this file is built Dynamically from webpack
const {AppServerModuleNgFactory, LAZY_MODULE_MAP} = require('./dist/server/main');

// Our Universal express-engine (found @ https://github.com/angular/universal/tree/master/modules/express-engine)
app.engine('html', ngExpressEngine({
  bootstrap: AppServerModuleNgFactory,
  providers: [
    provideModuleMap(LAZY_MODULE_MAP),
  ],
}));

app.set('view engine', 'html');
app.set('views', DIST_FOLDER);

app.get('/robots.txt', (req, res) => {
  res.type('text/plain');
  if (environment.production) {
    res.send('User-agent: *\nAllow: /');
  } else {
    res.send('User-agent: *\nDisallow: /');
  }
});

// Serve static files requested via /d/ from /browser/d - when deployed S3 serves these up to CloudFront
app.get('/d/favicon.ico', (req, res) => {
  res.sendFile(DIST_FOLDER + '/favicon.ico', {
    maxAge: '7 days', // Don't make the favicon immutable in case we want to update it
  });
});

app.use('/d', express.static(DIST_FOLDER, {
  immutable: true, // Everything in here should be named with an immutable hash
  maxAge: '1 year',
}));

app.use('/assets', express.static(DIST_FOLDER + '/assets', {
  maxAge: '1 day', // Assets should be served similarly but don't have name-hashes
}));

// All regular routes use the Universal engine
app.get('*', (req, res) => {
  // Note that the file output as `index.html` is actually dynamic. See `index` config keys in `angular.json`.
  // See https://github.com/angular/angular-cli/issues/10881#issuecomment-530864193 for info on the undocumented use of
  // this key to work around `fileReplacements` ending index support in Angular 8.
  res.render('index', { req });
});

// Start up the Node server
const server = app.listen(PORT, () => {
  console.log(`Node Express server listening on http://localhost:${PORT}`);
});

/**
 * ALBs are configured with 60s timeout and these should be longer.
 * @link https://shuheikagawa.com/blog/2019/04/25/keep-alive-timeout/
 * @link https://adamcrowder.net/posts/node-express-api-and-aws-alb-502/
 */
server.keepAliveTimeout = 65 * 1000;
server.timeout = 70 * 1000;
