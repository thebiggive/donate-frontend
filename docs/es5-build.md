# ES5 Build for Legacy Browsers

This document explains how we create a more compatible ES5 build for older browsers like Chrome 73 that cannot run modern JavaScript features or module syntax like `require()`.

## Overview

The ES5 build process uses a combination of Webpack and Babel to:

1. Bundle JavaScript modules into browser-compatible code (removing `require()` statements)
2. Transpile modern JavaScript syntax to ES5-compatible code
3. Serve the resulting files from the `/d-es5/` path for legacy browsers

## Files Involved

- `webpack.es5.config.js` - Webpack configuration for bundling the ES5 build
- `scripts/create-legacy-build.js` - Script that orchestrates the build process
- `babel.config.json` - Babel configuration targeting Chrome 73
- `scripts/test-es5-build.js` - Script to test the ES5 build process

## How It Works

1. The build process starts with the modern build output in `dist/donate-frontend/browser`
2. Non-JavaScript assets are copied to `dist/donate-frontend/browser-es5`
3. Webpack bundles the JavaScript files, resolving all module dependencies
4. Babel transpiles the bundled JavaScript to ES5-compatible syntax
5. HTML files are updated to reference the ES5 assets via `/d-es5/` paths
6. The server detects legacy browsers and serves files from the ES5 build

## How to Use

### Building the ES5 Version

Run the following command to create the ES5 build:

```bash
npm run create-legacy-build
```

This will:

1. Create the ES5 build in `dist/donate-frontend/browser-es5`
2. Bundle and transpile all JavaScript files
3. Update HTML files to reference the ES5 assets

### Testing the ES5 Build

To verify the ES5 build process:

```bash
scripts/test-es5-build.js
```

This will run the build process and check that:

- The ES5 build directory is created
- JavaScript files are bundled (no `require()` statements)
- HTML files are updated to use `/d-es5/` paths

### Serving the ES5 Build

The server automatically detects legacy browsers using the `isLegacyBrowser()` function in `server.ts` and serves the appropriate build:

```javascript
// From server.ts
function isLegacyBrowser(userAgent: string): boolean {
  // Chrome < 80, Safari < 13, Edge < 80, IE, etc.
  return (
    /Chrome\/([5-7][0-9])/.test(userAgent) ||
    /MSIE|Trident/.test(userAgent) ||
    /Safari\/(12|11|10|9|8|7|6|5|4|3|2|1)\./.test(userAgent) ||
    /Edge\/(1[0-7]|[0-9])\./.test(userAgent)
  );
}
```

For legacy browsers, the server:

1. Serves static files from `/d-es5/` instead of `/d/`
2. Rewrites HTML to reference ES5 assets

## Troubleshooting

If you encounter issues with the ES5 build:

1. Check that Webpack is bundling all JavaScript files correctly
2. Verify that Babel is transpiling to ES5-compatible syntax
3. Ensure HTML files are correctly updated to reference ES5 assets
4. Check browser detection logic in `server.ts`

## Dependencies

The ES5 build process relies on:

- Webpack (^5.94.0)
- Webpack CLI (^4.5.0)
- Babel CLI (^7.28.3)
- @babel/preset-env (^7.28.3)

These are already included in the project's devDependencies.
