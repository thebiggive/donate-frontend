# Big Give Donate Frontend

This Angular project is a web frontend allowing donors to discover Big Give
charities' campaigns and donate to them.

## Getting started

To use npm without setting an env var on every invocation, export
`FONTAWESOME_NPM_AUTH_TOKEN` to your environment with a valid
key as the value. Alternatively you can set it with a placeholder if
you don't need to work with FontAwesome and don't have a Pro key.

To run the app locally:

* clone it from GitHub
* `export FONTAWESOME_NPM_AUTH_TOKEN=<token id>`
* `npm install`
* `npm run start`

The app should be running at [localhost:4200](http://localhost:4200).

To use `ng` commands directly, e.g. to generate new code scaffolding with the CLI, install Angular globally:

    npm install -g @angular/cli

## Developing with local copy of Big Give Components (experimental)

To develop this app and the components together, ensure they are in sibling directories `donate-frontend` and `components` on your dev machine, then
from this directory run:
  `npm run link-components`

This will set up symlinks so that you can use your local copy of the components instead of the default behaviour which is to use the copy published to
NPM. You may need to re-run after making changes in the component code.

Note: make sure that you are checked out on the branch with your latest components updates before linking, to ensure that the changes are correctly shown
in Angular post-linking.

If you wish to see changes made in components reflected in front end in near-real time, then run
```shell
(cd ../components && npm run build.watch) &
````

## CI, e2e tests and Puppeteer

* `main` branch deploys to Production.
* `develop` branch deploys to Staging and Regression (for end-to-end regression tests).

To run style, unit and e2e tests together from your local, as CircleCI build checks do against every branch:

    npm run ci

### e2e tests

The latest tagged [Puppeteer](https://www.npmjs.com/package/puppeteer) typically uses the latest available Chromium and updates do not follow
semantic versioning. So for it to continue working, it currently needs to be pinned to a particular "feature release", e.g. `22.8.*` for Chromium 124.

In the past we have worked around some Chromium compatibilty issues using the
`puppeteer_skip_chromium_download` npm config flag, the `webdriver-manager` option
override `versions.chrome` and the Angular e2e env var `PUPPETEER_CHROMIUM_REVISION`.
These don't seem to be needed right now.

To deal with any difficulty matching Chromium / ChromeDriver / Puppeteer versions, it may be helpful to review
[this page](https://how-to.dev/how-to-find-the-right-chromiumrevision-value-for-a-given-chromium-version).
You might need to vary commands based on your platform, e.g. to check the Chrome release
version for a locally downloaded `chromium` on macOS:

`./node_modules/chromium/lib/chromium/chrome-mac/Chromium.app/Contents/MacOS/Chromium --version`

### Env vars

Environment Variables configured in the CircleCI interface for this app are:

* `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_ECR_ACCOUNT_URL`, `AWS_ECR_REPO_NAME` and `AWS_ECS_SERVICE_SUFFIX`, for ECS deploys.
  Key must belong to a user with ECS deploy rights and permission to deploy to the S3 static asset buckets.
* `CIRCLE_TOKEN` - set up within CircleCI itself and used to retrieve build & deploy metadata to report back to Jira.
* `SLACK_WEBHOOK` - destination URI to report deploys to Slack.

### Feature Flag(s)

We have currently one, but in future possible more or less feature flags used to separate code deployment from feature release. 
See [featureFlags.ts](./src/app/featureFlags.ts).

## Salesforce API requirements

For each sandbox, you need to ensure a Site is created for both `/campaigns` and `/funds`
and that public access is enabled for every Apex class the APIs use.

## Donation API

MatchBot's deployed environments implement the Donation API and manage real-time match
fund allocation. For data in Salesforce to be eventually consistent, it must also have a
`/donations` Site deployed with working public access as above.

## Browser support

We want donations to work as widely as possible within the constraints set by our technology partners, unless doing so would compromise
donors' security.

Browsers we expect to work fully with this app are all modern mobile & desktop browsers kept up to date, including extended support release cycles. Where we want to communicate specific brands that should work
we are likely best off mirroring [Stripe's appendix](https://stripe.com/docs/js/appendix/supported_browsers)
for Stripe.js, as we must depend on that library for donations.

We no longer support any versions of Internet Explorer as Stripe dropped support from February 2022, meaning
we cannot offer a meaningfully functional experience to IE donors.

See [`.browserslistrc`](./.browserslistrc) for the specific instructions that tell the Angular build system what support is needed during builds.

## Docker configuration

The `Dockerfile` in this repository and its `npm` scripts are used for Server-Side Rendering support and containerised deployments in AWS
Elastic Container Service (ECS). It is configured for production & staging builds - determined by env
var `BUILD_ENV`.

You can run it from any machine to test the build process, but typically working without Docker locally is currently easier because
things like live reload and source maps are intentionally switched off for production builds.

Because Angular unfortunately uses environment configurations inside JavaScript files rather than env vars, which are fiddly to replace
while keeping both client- and server-side logic correct, the `BUILD_ENV` will lead to separate and incompatible app bundles for staging
and production, based on which npm `build:*` command is invoked during the Docker build. Remember that this means built apps for staging
and production in the Elastic Container Registry are **not** interchangeable! The target for API calls is fixed and baked into the images,
which are always tagged with `staging*` or `production*`.

To test re-building the image (use FontAwesome token marked "Pro Package Token" from [Account](https://fontawesome.com/account)):

    docker build --rm --build-arg BUILD_ENV=staging --build-arg FONTAWESOME_NPM_AUTH_TOKEN=**token** -t thebiggive/donate-frontend:staging .

To prepare for CORS to work, you may need to update `environment.ts` to set `donateUriPrefix` to 'http://localhost:4000'.

To start it daemonised (in the background) and map to host port 4000 - assuming no running web server on that port:

    docker run -d -p 4000:4000 -e FONTAWESOME_NPM_AUTH_TOKEN=**token** --name donate-frontend-test-staging thebiggive/donate-frontend:staging

When running this way to test Server-Side Rendering, access the app at [localhost:4000](http://localhost:4000).

## Deployment strategy

We use ECS blue/green deploys for dynamically-routed app requests, which enables Server-Side Rendering.
However we also want to support long caching and effective cache-busting with build hashes for built
Angular JS & CSS files. We can't guarantee that somebody accessing a new ECS container would get the new
version when requesting the static resources, so to ensure that deploys don't break requests for anybody
while in progress, we serve copied assets and built JS + CSS via S3, and everything else via an ALB in front
of the ECS cluster.

Deploys must therefore:

* deploy to S3 by copying built files to S3 at `/d` and `/assets`; *then*
* deploy to ECS, which will use a mix of `<base href="/d/">` and providing `APP_BASE_HREF` *without* the `/d/`
  suffix to get everything working, referencing any updated file hashes in S3's `/d/` directory but with dynamic
  routes having no such suffix.

CloudFront is configured to route requests to the right place based on these prefixes.

### Server-side app

The ECS app we deploy runs on Express with `@angular/ssr`, the typical (since Angular 17) way to serve
SSR apps. There are a few configuration tweaks and middleware additions for our use case,
which all live in [`server.ts`](./server.ts).

#### Writing safe polymorphic code

Because TypeScript runs in both server and client contexts, we need to be very careful with JavaScript
globals to avoid server-side render crashes and glitchier or broken page loads for search engines.

See [Angular docs](https://angular.io/guide/ssr#working-around-the-browser-apis) for
general guidance on this.

In the few cases where we need to work with these browser APIs, we should check carefully that either:
* the use case can be invoked only by in-browser explicit visitor interaction, e.g. some
  infinite scroll `more()` calls make this assumption; or
* the entrypoint to code is explicitly limited with `isPlatformBrowser(this.platformId)`. See `AppComponent`
  or search for this snippet to see how the token injection and DI is done.

Finally, you can confirm your code runs OK on the server by checking CloudWatch logs for
errors in the ECS app's logs.

## Using Angular

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name --module app.module` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module [--module app.module]` (arg not needed for services).

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the (minimal) end-to-end tests via Cypress.

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
