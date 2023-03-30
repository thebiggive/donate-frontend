export const makeURL = (urlType: string, urlPrefix: string | undefined, relativeUrl: string) => {
  if (!urlPrefix || !urlPrefix.startsWith('http')) {
    throw new Error(`${urlType} URL prefix must be set and start with http`);
  }
  return urlPrefix + '/' + relativeUrl;
};
