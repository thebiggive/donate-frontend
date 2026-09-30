import { RenderMode, ServerRoute } from '@angular/ssr';

// Use SSR, not e.g. prerendering, for all paths when in server mode.
export const serverRoutes: ServerRoute[] = [
  // /regular-giving has an Angular vs. Stencil hydration issue I can't yet figure out with a <biggive-text-input/>, so
  // make it client only for now.
  {
    path: 'regular-giving/**',
    renderMode: RenderMode.Client,
  },
  // These 2 are client only, as their guards etc. require cookies and they wouldn't be very useful to server load anyway.
  {
    path: 'login',
    renderMode: RenderMode.Client,
  },
  {
    path: 'register',
    renderMode: RenderMode.Client,
  },
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
