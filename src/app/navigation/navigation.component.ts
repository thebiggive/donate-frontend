import { Component, OnInit } from '@angular/core';
import { Router, NavigationStart, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
})
export class NavigationComponent implements OnInit {
  // TODO we should probably close the new kind on nav events as we used to?
  opened = false;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart),
    ).subscribe(() => this.opened = false);
  }

  /**
   * Ensure browsers don't try to navigate to non-targets. Top level items with a sub-menu
   * work on hover using pure CSS only.
   */
  noNav(event: Event) {
    event.preventDefault();
  }
}
