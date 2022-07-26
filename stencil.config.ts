import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'BigGive',
  outputTargets: [
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        { src: 'assets/fonts', warn: true },
        { src: 'assets/img', warn: true },
      ],
    },
    {
      type: 'dist-custom-elements',
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
    },
  ],
};
