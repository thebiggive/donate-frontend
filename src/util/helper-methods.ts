export const blogUrl = (blogUrlPrefix: string | undefined, relativeUrl: string) => {
  if (!blogUrlPrefix || !blogUrlPrefix.startsWith('http')) {
    throw new Error('Blog URL prefix must be set and start with http');
  }
  return blogUrlPrefix + '/' + relativeUrl;
};

export const donateUrl = (donateUrlPrefix: string | undefined, relativeUrl: string) => {
  if (!donateUrlPrefix || !donateUrlPrefix.startsWith('http')) {
    throw new Error('Donate URL prefix must set and start with http');
  }
  return donateUrlPrefix + '/' + relativeUrl;
};

export const experienceUrl = (experienceUrlPrefix: string | undefined, relativeUrl: string) => {
  if (!experienceUrlPrefix || !experienceUrlPrefix.startsWith('http')) {
    throw new Error('Experience URL prefix must be set set and start with http');
  }
  return experienceUrlPrefix + '/' + relativeUrl;
};
