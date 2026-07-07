# Donate browser support

We aim to support as many browsers as possible, as summarised in the
[Browser support readme section](../README.md#browser-support).

Supporting a browser means that in developing and maintaining any features that are important parts of using our site we will endeavour to test with and
ensure that they work on all those browsers. However, some bugs will inevitably appear, so users may still want to try an alternate browser as a work-around
if they do encounter a bug when using one of our supported browsers.

## Tier 1

Fully supported browsers are defined in our [browserlist](../.browserslistrc). These are our "tier 1" browsers.

This list affects the main Angular build process; and User-Agent detection for both choosing
the most appropriate build and deciding whether to show a warning alongside the app.

## Tier 2

We also make a best effort to support a wider range of browsers than tier 1, which goes beyond what modern Angular versions support out of the
box. We have an extra Webpack and babel [build conversion script](../scripts/create-legacy-build.js) to facilitate this. Donors should
receive the correct build (including behind CloudFront) through a mix of User-Agent detection and query params.

For donors running such a "tier 2" browser, we expect the ES5 legacy bundle to have a good chance of giving them a functional experience.
Some visual blips are expected in the older end of this range, but donating should still be possible. Visitors will see a reasonably
obvious but unobtrusive message permanently between the main menu and
the rest of the app.

Examples of tier 2 browsers include:

- Chrome 71 through 105, including on Android
- Safari 12.1 through 14.0
- Edge 79 through 105
- Firefox 65 through 103

# No support

Users running a fully unsupported browser see a message that replaces the whole Angular app. Unsupported browsers include any versions older than the tier 2 examples above.

It is possible to override the compatibility check with query params. However the
feature detection toggling the message uses `globalThis`, which the ES5 Webpack
build makes use of too, so it is highly unlikely to work unless we've made a
mistake in our assumptions.

## Updating supported browsers

When updating the tier 1 supported browser list please start from the [browserlist](../.browserslistrc).

Keep in mind that this affects both builds and User-Agent detection as above, and
review the `supportedBrowsers` script output before and after. (The regex is generated on each build and not checked into git.)

Also consider updating settings in the regression test project (e.g. `wdio.testingbot-all.conf.cjs`,
`wdio.testingbot-safari.conf.cjs`, etc) to reflect our supported browser selection.

To formally change the lower end of tier 2 will require considering new feature detection. It is likely best to leave
this as-is for the foreseeable future, until we see new technical challenges appear in supporting such browsers.
