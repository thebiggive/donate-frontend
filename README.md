# The Big Give Donate Frontend

This Angular project is a web frontend allowing donors to discover the Big Give
charities' campaigns and donate to them.

## Getting started

To run the app locally:

* clone it from GitHub
* `npm install`
* `npm start`

The app should be running at [localhost:4200](http://localhost:4200).

To use `ng` commands directly, e.g. to generate new code scaffolding with the CLI, install Angular globally:

    npm install -g @angular/cli

## CI, e2e tests and Puppeteer

* `master` branch deploys to Production.
* `develop` branch deploys to Staging.

To run style, unit and e2e tests together from your local, as CircleCI build checks do against every branch:

    npm run ci

The latest tagged [Puppeteer](https://www.npmjs.com/package/puppeteer) uses the very latest available Chromium, which is typically incompatible
with the latest *stable* tagged version that other libaries have available. So for it to continue working, we need to be careful with its version
and pin it to a specific point releases rather than allowing any `1.x` upgrade.

Environment Variables configured in the CircleCI interface for this app are:

* `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY`, `AWS_REGION`, `AWS_ECR_ACCOUNT_URL` and `AWS_ECS_RESOURCE_NAME`, for ECS and S3 deploys.
Should belong to a user with ECS deploy rights and only write & ACL set permission on _only_ the S3 bucket used to host the demo.
* `CIRCLE_TOKEN` - set up within CircleCI itself and used to retrieve build & deploy metadata to report back to Jira.
* `SLACK_WEBHOOK` - destination URI to report deploys to Slack.

To make builds faster, CircleCI is configured to use a custom Docker image. This is defined in this repository, in `.circleci/Dockerfile`,
and updates to the `master` branch will trigger it to rebuild on Docker Hub.

## Salesforce API requirements

For each sandbox, you need to ensure a Site is created for both `/donations` and `/campaigns`
and that public access is enabled for every Apex class the APIs use.

## Browser support

We want donations to work as widely as possible within the constraints set by our technology partners, unless doing so would compromise
donors' security. Browsers we expect to work fully with this app are:

* all modern mobile & desktop browsers kept up to date, including extended support release cycles;
* Internet Explorer 11

See [`browserslist`](./browserslist) for the specific instructions that tell the Angular build system what support is needed during builds.

Although it would be good to extend support for Internet Explorer
9 and 10, they are unsupported by both Charity Checkout and
Angular Material so this is not an option. We use user agent
detection to explain the situation to users of these browsers.

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

To test re-building the image:

    docker build --rm --build-arg BUILD_ENV=staging -t thebiggive/donate-frontend:staging .

To start it daemonised (in the background) and map to host port 4000 - assuming no running web server on that port:

    docker run -d -p 4000:4000 --name donate-frontend-test-staging thebiggive/donate-frontend:staging

When running this way to test Server-Side Rendering, access the app at [localhost:4000](http://localhost:4000).

## Deployment strategy

We use ECS blue/green deploys for dynamically-routed app requests, which enables Server-Side Rendering.
However we also want to support long caching and effective cache-busting with build hashes for built
Angular JS & CSS files. We can't guarantee that somebody accessing a new ECS container would get the new
version when requesting the static resources, so to ensure that deploys don't break requests for anybody
while in progress, we serve static assets via S3 and everything else via an ALB in front of the ECS cluster.

Deploys must therefore:

* deploy to S3 by copying built files to S3 at `/d` and `/assets`; *then*
* deploy to ECS, which will reference any updated file hashes on S3 by using `--deploy-url=/d/`

CloudFront is configured to route requests to the right place based on these prefixes.

## Using Angular

### Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

### Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

### Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

### Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

### Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

### Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
