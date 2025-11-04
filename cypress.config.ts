import { defineConfig } from 'cypress';

export default defineConfig({
  blockHosts: ['sf-api-staging.thebiggivetest.org.uk'],
  e2e: {
    baseUrl: 'http://localhost:4200',
    includeShadowDom: true,
  },
});
