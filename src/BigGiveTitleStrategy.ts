import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Injectable } from '@angular/core';
import { Title } from '@angular/platform-browser';

const bigGiveName = 'Big Give';

@Injectable()
export class BigGiveTitleStrategy extends TitleStrategy {
  constructor(private readonly title: Title) {
    super();
  }

  override updateTitle(routerState: RouterStateSnapshot): void {
    const title = this.buildTitle(routerState);
    if (title !== undefined) {
      this.title.setTitle(makeTitle(title));
    } else {
      this.title.setTitle(bigGiveName);
    }
  }
}

/**
 * Appends our name to the end of a string to make a title (unless the string already contains that)
 */
export function makeTitle(title: string): string {
  if (!title.includes('Big Give')) {
    title = `${title} – Big Give`;
  }

  return title;
}
