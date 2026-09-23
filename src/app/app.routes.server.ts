import { RenderMode, ServerRoute } from '@angular/ssr';

// Use SSR, not e.g. prerendering, for all paths when in server mode.
export const serverRoutes: ServerRoute[] = [
  {
    path: '**',
    renderMode: RenderMode.Server,
  },
];
