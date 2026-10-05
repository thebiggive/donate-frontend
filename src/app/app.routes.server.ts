import { RenderMode, ServerRoute } from '@angular/ssr';
import { myAccountPath, registerPath, transferFundsPath } from './app.routes';

// Use SSR, not e.g. prerendering, for all paths when in server mode.
export const serverRoutes: ServerRoute[] = [
  // /regular-giving has an Angular vs. Stencil hydration issue I can't yet figure out with a <biggive-text-input/>, so
  // make it client only for now. (If changing this, we'll need to make the subset of RG routes that require login
  // client-only, insetad of all RG routes.)
  {
    path: 'regular-giving/**',
    renderMode: RenderMode.Client,
  },
  // These 4 (inc. all sub pages of my-account) are client only, as their guards etc. require cookies and
  // they wouldn't be very useful to server load anyway.
  {
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: `${myAccountPath}/**`,
    renderMode: RenderMode.Client,
  },
  {
    path: registerPath,
    renderMode: RenderMode.Client,
  },
  {
    path: transferFundsPath,
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
