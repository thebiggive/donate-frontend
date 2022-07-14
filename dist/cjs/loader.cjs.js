'use strict';

Object.defineProperty(exports, '__esModule', { value: true });

const index = require('./index-a4722dd6.js');

/*
 Stencil Client Patch Esm v2.17.1 | MIT Licensed | https://stenciljs.com
 */
const patchEsm = () => {
    return index.promiseResolve();
};

const defineCustomElements = (win, options) => {
  if (typeof window === 'undefined') return Promise.resolve();
  return patchEsm().then(() => {
  return index.bootstrapLazy([["my-component.cjs",[[1,"my-component",{"first":[1],"middle":[1],"last":[1]}]]],["sample-component_2.cjs",[[1,"sample-component",{"title":[1025],"meta":[1025],"callToActionUrl":[1025,"call-to-action-url"],"callToActionText":[1025,"call-to-action-text"]}],[1,"sample-component-child",{"url":[1025],"text":[1025]}]]]], options);
  });
};

exports.defineCustomElements = defineCustomElements;
