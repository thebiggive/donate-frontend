# Big Give Donate Frontend

_Draft_

We want donations to work as widely as possible within the constraints set by our technology partners, unless doing so would compromise
donors' security.

Browsers we expect to work fully with this app are all modern mobile & desktop browsers kept up to date, including extended support
release cycles.

Specifically, we intended to support the browser versions that we have recently seen people donating with, in addition to all more commonly
used and up-to-date browsers. For specific supported browsers see [.browserlistrc](../.browserslistrc).

Supporting a browser means that in developing and maintaining any features that are important parts of using our site we will endeavour to test with and
ensure that they work on all those browsers. However, some bugs will inevitably appear, so users may still want to try an alternate browser as a work-around
if they do encounter a bug when using one of our supported browsers.

Users running an unsupported browser will see a warning on the site.

## For Developers:

When updating the supported browser list please also review .browserslistrc and the `supportedBrowsers` npm script.
.browserslistrc is used to configure the angular build process, while the supportedBrowsers script controls which
browsers we show a "not supported" message to. These can be edited independently to allow working around any Angular /
vite issues when we ask it to support older browsers, and/or configuring angular to attempt to support older browsers than
the app as a whole, including e.g. stripe and 3DS, is usable with.

Also consider updating settings in the regression test project (e.g. `wdio.testingbot-all.conf.cjs`,
`wdio.testingbot-safari.conf.cjs`, etc) to reflect our supported browser selection.
