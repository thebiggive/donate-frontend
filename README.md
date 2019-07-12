# The Big Give Donate Frontend

This Angular project is a web frontend which will eventually let donors discover the Big Give campaigns and
start a donation to them.

## Getting started

To run the app locally:

* clone it from GitHub
* `npm install`
* `npm start`

To use `ng` commands directly, e.g. to generate new code scaffolding with the CLI, install Angular globally:

* `npm install -g @angular/cli`

## CI, e2e tests and Puppeteer

The latest tagged [Puppeteer](https://www.npmjs.com/package/puppeteer) uses the very latest available Chromium, which is typically incompatible
with the latest *stable* tagged version that other libaries have available. So for it to continue working, we need to be careful with its version
and pin it to a specific point releases rather than allowing any `1.x` upgrade.

## Salesforce API requirements

For each sandbox, you need to ensure a Site is created for both `/donations` and `/campaigns`
and that public access is enabled for every Apex class the APIs use.

# Angular info

The below docs are part of the `ng init` boilerplate starter info. We'll adpat them to our most common use cases later.

## Development server

Run `ng serve` for a dev server. Navigate to `http://localhost:4200/`. The app will automatically reload if you change any of the source files.

## Code scaffolding

Run `ng generate component component-name` to generate a new component. You can also use `ng generate directive|pipe|service|class|guard|interface|enum|module`.

## Build

Run `ng build` to build the project. The build artifacts will be stored in the `dist/` directory. Use the `--prod` flag for a production build.

## Running unit tests

Run `ng test` to execute the unit tests via [Karma](https://karma-runner.github.io).

## Running end-to-end tests

Run `ng e2e` to execute the end-to-end tests via [Protractor](http://www.protractortest.org/).

## Further help

To get more help on the Angular CLI use `ng help` or go check out the [Angular CLI README](https://github.com/angular/angular-cli/blob/master/README.md).
