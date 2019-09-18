# The Big Give Donate Frontend

This Angular project is a web frontend which will eventually let donors discover the Big Give campaigns and
start a donation to them.

## Getting started

To run the app locally:

* clone it from GitHub
* `npm install`
* `npm start`

To use `ng` commands directly, e.g. to generate new code scaffolding with the CLI, install Angular globally:

    npm install -g @angular/cli

## CI, e2e tests and Puppeteer

The latest tagged [Puppeteer](https://www.npmjs.com/package/puppeteer) uses the very latest available Chromium, which is typically incompatible
with the latest *stable* tagged version that other libaries have available. So for it to continue working, we need to be careful with its version
and pin it to a specific point releases rather than allowing any `1.x` upgrade.

Environment Variables configured in the CircleCI interface for this app are:

* `AWS_ACCESS_KEY_ID`, `AWS_SECRET_ACCESS_KEY` and `AWS_REGION` - for S3 deploys. Should belong to a user with only write & ACL set permission on
  _only_ the S3 bucket used to host the demo.
* `CIRCLE_TOKEN` - set up within CircleCI itself and used to retrieve build & deploy metadata to report back to Jira.
* `SLACK_WEBHOOK` - destination URI to report deploys to Slack.

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
Angular Material so this is not an option. We use a conditional
IE HTML comment to explain the situation to users of these
browsers.

## Docker configuration

The `Dockerfile` in this repository and its `npm` scripts are used for Server-Side Rendering support and containerised deployments in AWS
Elastic Container Service (ECS). `Dockerfile` is therefore configured for production/staging builds. You can run it from any machine to test the build
process, but typically working without Docker locally is currently easier because things like live reload and source maps are intentionally
switched off for production builds.

To test re-building the image:

    docker build --rm -f "Dockerfile" -t thebiggive/donate-frontend:latest .

To start it daemonised (in the background) and map to host port 4000 - assuming no running web server on that port:

    docker run -d -p 4000:4000 --name donate-frontend-test1 thebiggive/donate-frontend

When running this way to test Server-Side Rendering, access the app at [localhost:4000](http://localhost:4000).

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
