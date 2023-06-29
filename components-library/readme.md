![Built With Stencil](https://img.shields.io/badge/-Built%20With%20Stencil-16161d.svg?logo=data%3Aimage%2Fsvg%2Bxml%3Bbase64%2CPD94bWwgdmVyc2lvbj0iMS4wIiBlbmNvZGluZz0idXRmLTgiPz4KPCEtLSBHZW5lcmF0b3I6IEFkb2JlIElsbHVzdHJhdG9yIDE5LjIuMSwgU1ZHIEV4cG9ydCBQbHVnLUluIC4gU1ZHIFZlcnNpb246IDYuMDAgQnVpbGQgMCkgIC0tPgo8c3ZnIHZlcnNpb249IjEuMSIgaWQ9IkxheWVyXzEiIHhtbG5zPSJodHRwOi8vd3d3LnczLm9yZy8yMDAwL3N2ZyIgeG1sbnM6eGxpbms9Imh0dHA6Ly93d3cudzMub3JnLzE5OTkveGxpbmsiIHg9IjBweCIgeT0iMHB4IgoJIHZpZXdCb3g9IjAgMCA1MTIgNTEyIiBzdHlsZT0iZW5hYmxlLWJhY2tncm91bmQ6bmV3IDAgMCA1MTIgNTEyOyIgeG1sOnNwYWNlPSJwcmVzZXJ2ZSI%2BCjxzdHlsZSB0eXBlPSJ0ZXh0L2NzcyI%2BCgkuc3Qwe2ZpbGw6I0ZGRkZGRjt9Cjwvc3R5bGU%2BCjxwYXRoIGNsYXNzPSJzdDAiIGQ9Ik00MjQuNywzNzMuOWMwLDM3LjYtNTUuMSw2OC42LTkyLjcsNjguNkgxODAuNGMtMzcuOSwwLTkyLjctMzAuNy05Mi43LTY4LjZ2LTMuNmgzMzYuOVYzNzMuOXoiLz4KPHBhdGggY2xhc3M9InN0MCIgZD0iTTQyNC43LDI5Mi4xSDE4MC40Yy0zNy42LDAtOTIuNy0zMS05Mi43LTY4LjZ2LTMuNkgzMzJjMzcuNiwwLDkyLjcsMzEsOTIuNyw2OC42VjI5Mi4xeiIvPgo8cGF0aCBjbGFzcz0ic3QwIiBkPSJNNDI0LjcsMTQxLjdIODcuN3YtMy42YzAtMzcuNiw1NC44LTY4LjYsOTIuNy02OC42SDMzMmMzNy45LDAsOTIuNywzMC43LDkyLjcsNjguNlYxNDEuN3oiLz4KPC9zdmc%2BCg%3D%3D&colorA=16161d&style=flat-square)

# Big Give StencilJS Web Components

The project is based on a sample project from https://stenciljs.com/docs/getting-started

## Setup and Build


### Get latest version of codebase from github
```bash
git clone https://github.com/thebiggive/components.git
cd components
```

### Install StencilJS dependencies as defined in package.json

Set `FONTAWESOME_NPM_AUTH_TOKEN` in your environment so pro packages can be installed, and:

```bash
npm install
npm start
```

### Run tests

```bash
npm test
```

## Development

### Follow Stencil + repository conventions

CI runs lint checks, but there are tools to help you follow the expected code style so you don't have
to fix it later.

In Visual Studio Code, you might find [this ESLint extension](https://marketplace.visualstudio.com/items?itemName=dbaeumer.vscode-eslint)
and [this Prettier one](https://marketplace.visualstudio.com/items?itemName=esbenp.prettier-vscode)
helpful.

We use both tools to ensure both consistent code style and adherence to Stencil recommended practice.

Husky should also set you up a pre-commit hook that fixes anything it can automatically, and complains
about anything else. If you don't appear to have this and had already installed packages before this
feature was set up, run `npm install` again.

### Dependencies and build output

Anything externally managed should be loaded with npm and no copies checked into this codebase. We can use Stencil `copy` tasks and target app build strategies to get things in the right place.

Generated build outputs should similarly be `.gitignore`d.

Because Stencil components have *partly* generated readme docs, it is a good idea after changing any `@Prop`s or similar to `npm run build`
before committing your changes. The docs should be source controlled as they can include manual content. If you make a new one, it's a good
idea to add a one line description of its purpose to the readme before the generated section.

### Output targets

> Stencil is able to take an app's source and compile it to numerous targets

[Read more in Stencil's docs.](https://stenciljs.com/docs/output-targets)

Primary targets are:

* `angularOutputTarget()` – used in [Donate frontend](https://github.com/thebiggive/donate-frontend).
* `dist-custom-elements` – the docs don't make this terribly clear but with our current configuration,
  these are a dependency for the Angular project/target to build successfully. Angular needs to be told
  that they live inside `dist/` (so are published in `dist/components`).
* `dist-hydrate-script` for SSR – used in [Donate frontend](https://github.com/thebiggive/donate-frontend) as initially served by ECS. Stencil [document this one separately](https://stenciljs.com/docs/hydrate-app).
* `dist` for general web modules – used in [WordPress](https://github.com/thebiggive/wordpress).
* Storybook has its own build step using the component from source. Currently, this is also used in
  Salesforce to embed components in iframes, the only feasible way we've been able to get Experiences
  to dynamically pull in components.
* `docs-readme` for documentation.

Targets we have but just for local experiments:

* `www`

### Angular components

As well as the core package `@biggive/components`, CI automatically publishes a version best tailored to
Angular as `@biggive/components-angular`. The former are possible to load into Angular but the latter will
work better [as documented](https://stenciljs.com/docs/angular).

Our Angular workspace and library are set up as per that documentation, but our Stencil library lives in this
repo's root, one directory up from in the docs' structure. So far this seems to have no adverse effects.

### Asset dependencies

So far our strategy has been to avoid separate file assets where this is an out-the-box option, but
to choose copying over more complex build time changes (e.g. base-64-inlining images) otherwise.
This is to get the simplest working proof of concept up quickly and we may revisit it soon.

For now:

* FontAwesome uses pure SVGs and not fonts. This seems to work well and I suspect is the best option
  for performance, component interoperability, simplicity and licence compliance.
* The Euclid font is copied with a Stencil `copy` task and available in the dist output's
  `assets/fonts`. An Angular app's build, for example, can then use the style with the following
  addition to an `angular.json` `"styles"` key:
  `"node_modules/@biggive/components/dist/biggive/assets/fonts/EuclidTriangle/stylesheet.css"`
* Images are also copied with a Stencil `copy` task, and fixed references use getAssetPath() plus
  an absolute path, e.g. `getAssetPath('/assets/images/banner.png')`. See the
  [Stencil asset docs](https://stenciljs.com/docs/assets) for more on this. Angular seems to be
  able to use this without `setAssetPath()` if we config its `"assets"` key to put files in the same
  folder as the app's own images. This is the approach taken on [this proof of concept branch](https://github.com/thebiggive/donate-frontend/tree/COM-5-proof-of-concept).
  Should we find managing image assets messy in apps generally, an alternative approach we might
  try is importing images to component style and adding [`@rollup/plugin-image`](https://github.com/rollup/plugins/tree/master/packages/image/#readme)
  to Stencil's build config. Or if there are only a few, we could also investigate
  whether `assetsDirs` on a `@Component` folds in what's needed in a way that works
  in Angular et al.

### Make any required changes to the sample web components

The web components are configured in /src/components

The /src/index.html file can be used as a test area for displaying the web components in a static HTML page.

### Run the StencilJS build command to package your changes
```bash
npm run build
```


## Outputs

### dist directory - https://stenciljs.com/docs/distribution
This directory contains the distribtion files


### www directory - https://stenciljs.com/docs/www
This directory contains a static version of the web components which can be used for testing and inclusion in simple web apps. Due to CORS restrictions, the index.html file needs to be run from a webserver (not as a local file).

### Storybook

We've followed [this guide](https://ionicframework.com/blog/how-to-use-storybook-with-stencil/) to
provide sample usage of key components: a living style guide.

CI automatically publishes the Storybook preview:

* to [Staging](https://components-staging.thebiggivetest.org.uk) from `develop`; and
* to [Production](https://components-production.thebiggive.org.uk) from `main` – which also npm publishes a new major version automatically.

For now, the local `npm run storybook` won't load static image assets or fonts. We've prioritised realistic
renders in the deployed environment, where these work due to:
* CI separately copying the main build's `assets` output to S3: see e.g. `deploy-staging-storybook` in [CI config](./.circleci/config.yml)
* Storybook having a custom [`preview-head.html`](./.storybook/preview-head.html).

## Publish to NPM

### Versions and publishing

CircleCI will now create a new version, build and publish it to npm
on *every* commit to `main`. Version numbers are generated such that every release
is a new "major" release, so dependent packages must use version `"*"` to automatically
receive new versions on `npm update`.

#### Manual updates

It is no longer expected to manually update versions, but if the automatic process
is ever broken, the steps used before Jan '23 were:

* Update the root `package.json`'s `version` field.
* `npm install` to update `package-lock.json` to match.
* Update `angular/projects/components/package.json`'s `version` field so that `@biggive/components-angular` matches too.
* `git tag v0.0.1` (replace with your new version)
* `git push --tags`

You can also do the npm publish manually if necessary:

First, connect to npm if you have never done so before: `npm add_user`.

Then:

```bash
npm publish --access=public
```

The name of the NPM package and version number can be updated in the root package.json file. It's currently set to (@biggive/components, 0.0.1)

More information about publishing and distribution is available at https://stenciljs.com/docs/distribution

## Include components in web app

### Include the following script tag in the HTML head
```
<script type='module' src='https://unpkg.com/@biggive/components@0.0.1/dist/biggive/biggive.esm.js'></script>
```

### Include the markup for the sample web component
```
<demo-campaign-cards></demo-campaign-cards>
```



### Styled Component
The first styled components are available
- biggive-grid
- biggive-campaign-card

These can be added to an HTML page with the following code:
```
  <biggive-grid>

    <biggive-campaign-card
      banner="/assets/images/banner.png"
      days-remaining={50}
      target={50000}
      organisation-name="Ardent Theatre Company"
      campaign-type="Match Funded"
      campaign-title="Strike! A play by Tracy Ryan"
      categories="Arts/Culture/Heritage|Environment/Conservation|Health/Wellbeing"
      beneficiaries="General Public/Humankind"
      match-funds-remaining={17424}
      total-funds-raised={15424}
      call-to-action-url="#"
      call-to-action-label="Donate"
    />

  </biggive-grid>
```

