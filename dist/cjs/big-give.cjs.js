'use strict';

const index = require('./index-4fc1f774.js');

/*
 Stencil Client Patch Browser v2.17.1 | MIT Licensed | https://stenciljs.com
 */
const patchBrowser = () => {
    const importMeta = (typeof document === 'undefined' ? new (require('u' + 'rl').URL)('file:' + __filename).href : (document.currentScript && document.currentScript.src || new URL('big-give.cjs.js', document.baseURI).href));
    const opts = {};
    if (importMeta !== '') {
        opts.resourcesUrl = new URL('.', importMeta).href;
    }
    return index.promiseResolve(opts);
};

patchBrowser().then(options => {
  return index.bootstrapLazy([["sample-component-child.cjs",[[1,"sample-component-child",{"url":[1025],"text":[1025]}]]],["sample-component.cjs",[[1,"sample-component",{"label":[1025],"meta":[1025],"callToActionUrl":[1025,"call-to-action-url"],"callToActionText":[1025,"call-to-action-text"]}]]],["biggive-campaign-card-test_2.cjs",[[1,"biggive-campaign-card-test",{"cols":[1026],"banner":[1025],"daysRemaining":[1026,"days-remaining"],"target":[1026],"organisationName":[1025,"organisation-name"],"campaignTitle":[1025,"campaign-title"],"campaignType":[1025,"campaign-type"],"categoryIcons":[1025,"category-icons"],"beneficiaryIcons":[1025,"beneficiary-icons"],"matchFundsRemaining":[1026,"match-funds-remaining"],"totalFundsRaised":[1026,"total-funds-raised"],"callToActionUrl":[1025,"call-to-action-url"],"callToActionLabel":[1025,"call-to-action-label"]}],[1,"biggive-grid"]]]], options);
});
