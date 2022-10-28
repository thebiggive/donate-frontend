import { Component, OnInit } from '@angular/core';
import { MatIconModule } from '@angular/material/icon';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatToolbarModule } from '@angular/material/toolbar';
import { Router, NavigationStart, RouterEvent } from '@angular/router';
import { filter } from 'rxjs/operators';

import { allChildComponentImports } from '../../allChildComponentImports';
import { FooterComponent } from '../footer/footer.component';
import { MainMenuComponent } from '../main-menu/main-menu.component';

@Component({
  standalone: true,
  selector: 'app-navigation',
  templateUrl: './navigation.component.html',
  styleUrls: ['./navigation.component.scss'],
  imports: [
    ...allChildComponentImports,
    FooterComponent,
    MainMenuComponent,
    MatIconModule,
    MatSidenavModule,
    MatToolbarModule,
  ],
})
export class NavigationComponent implements OnInit {
  opened = false;

  constructor(private router: Router) {
  }

  ngOnInit() {
    this.router.events.pipe(
      filter((event: RouterEvent) => event instanceof NavigationStart),
    ).subscribe(() => this.opened = false);
  }
}
