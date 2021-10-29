import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { Router, NavigationEnd, Event } from '@angular/router';

@Component({
  selector: 'app-main-menu',
  templateUrl: './main-menu.component.html',
  styleUrls: ['./main-menu.component.scss'],
})
export class MainMenuComponent implements OnInit, OnDestroy {
  @Input() listClass: 'bar' | 'tray';
  isGoGiveOneMenu: boolean;
  urlChanges;

  constructor(
    private router: Router,
  ) {
    // Listen to url changes and update 'this.isGoGiveOne' accordingly
    this.urlChanges = router.events.subscribe((event: Event) => {
      if (event instanceof NavigationEnd) {
        this.isGoGiveOneMenu = (event.url === '/gogiveone');
      }
    });
  }

  ngOnInit(): void {
  }

  ngOnDestroy(): void {
    this.urlChanges.unsubscribe();
  }
}
