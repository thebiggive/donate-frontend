import { angularOutputTarget } from '@stencil/angular-output-target';
import { Config } from '@stencil/core';

export const config: Config = {
  namespace: 'BigGive',
  outputTargets: [
    angularOutputTarget({
      componentCorePackage: '@biggive/components',
      directivesProxyFile: '../angular-workspace/projects/component-library/src/lib/stencil-generated/components.ts',
      directivesArrayFile: '../angular-workspace/projects/component-library/src/lib/stencil-generated/index.ts',
    }),
    {
      type: 'dist',
      esmLoaderPath: '../loader',
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
