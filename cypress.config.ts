import { defineConfig } from 'cypress';

export default defineConfig({
  blockHosts: ['dummy-matchbot.example.org'],
  e2e: {
    baseUrl: 'http://localhost:4200',
    includeShadowDom: true,
  },
});
