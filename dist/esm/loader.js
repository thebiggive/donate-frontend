import { p as promiseResolve, b as bootstrapLazy } from './index-1aa2facf.js';

/*
 Stencil Client Patch Esm v2.17.1 | MIT Licensed | https://stenciljs.com
 */
const patchEsm = () => {
    return promiseResolve();
};

const defineCustomElements = (win, options) => {
  if (typeof window === 'undefined') return Promise.resolve();
  return patchEsm().then(() => {
  return bootstrapLazy([["sample-component_2",[[1,"sample-component",{"label":[1025],"meta":[1025],"callToActionUrl":[1025,"call-to-action-url"],"callToActionText":[1025,"call-to-action-text"]}],[1,"sample-component-child",{"url":[1025],"text":[1025]}]]]], options);
  });
};

export { defineCustomElements };
