import { InjectionToken } from '@angular/core';

// Used to prove to Cloudflare (for APIs like MatchBot) that Donate SSR, while bot-like, is to be
// trusted and not issued managed challenges (which can't be completed unattended).
export const SSR_CLOUDFLARE_TOKEN = new InjectionToken<string>('SSR Cloudflare token');
