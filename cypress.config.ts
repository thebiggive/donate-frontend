import { defineConfig } from 'cypress'

export default defineConfig({
  blockHosts: [
    'sf-api-staging.thebiggivetest.org.uk',
    'api.getAddress.io',
  ],
  e2e: {
    baseUrl: 'http://localhost:4200',
    includeShadowDom: true,
  },
})
