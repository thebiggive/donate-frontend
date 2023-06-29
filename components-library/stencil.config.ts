import { angularOutputTarget } from '@stencil/angular-output-target';
import { Config } from '@stencil/core';
import { sass } from '@stencil/sass';

export const config: Config = {
  namespace: 'BigGive',
  plugins: [
    sass({
      injectGlobalPaths: [
        'src/globals/variables.scss',
        'src/globals/mixins.scss',
        'src/globals/global.scss'
      ]
    })
  ],
  outputTargets: [
    angularOutputTarget({
      // Without `dist/`, Angular build had errors saying the `components/` were missing.
      componentCorePackage: '@biggive/components/dist',
      directivesProxyFile: './angular/projects/components/src/lib/stencil-generated/components.ts',
      directivesArrayFile: './angular/projects/components/src/lib/stencil-generated/index.ts',
      includeImportCustomElements: true,
    }),
    {
      type: 'dist-hydrate-script',
    },
    {
      type: 'dist',
      esmLoaderPath: '../loader',
      copy: [
        { src: 'assets/fonts', warn: true },
        { src: 'assets/images', warn: true },
      ],
    },
    {
      type: 'dist-custom-elements', // Uses default `dist/components`.
    },
    {
      type: 'docs-readme',
    },
    {
      type: 'www',
      serviceWorker: null, // disable service workers
        copy: [
        { src: 'assets/fonts', warn: true },
        { src: 'assets/images', warn: true },
      ],
    },
  ],
  devServer: {
    port: 3939,
  },
};
