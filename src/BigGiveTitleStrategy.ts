import { RouterStateSnapshot, TitleStrategy } from '@angular/router';
import { Injectable, inject } from '@angular/core';
import { Title } from '@angular/platform-browser';
import { bigGiveName } from './environments/common';

@Injectable()
export class BigGiveTitleStrategy extends TitleStrategy {
  private readonly title = inject(Title);


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
  if (!title.includes(bigGiveName)) {
    title = `${title} – ${bigGiveName}`;
  }

  return title;
}
