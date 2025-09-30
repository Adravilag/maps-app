import { Component, inject, computed, signal } from '@angular/core';
import { NavigationEnd, Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AsyncPipe, NgIf } from '@angular/common';
import { filter, map, startWith } from 'rxjs';
import { routes } from '../../../app.routes';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [AsyncPipe, RouterLink, RouterLinkActive],
  templateUrl: './navbar.component.html',
})
export class NavbarComponent {
  private router = inject(Router);

  // Exponemos solo rutas válidas
  readonly routes = routes.filter(route => route.path && route.path !== '**');

  // Señal reactiva del título (Angular Signals)
  readonly pageTitle$ = this.router.events.pipe(
    filter((event): event is NavigationEnd => event instanceof NavigationEnd),
    map(event => event.urlAfterRedirects ?? event.url), // más robusto
    startWith(this.router.url), // para tener el valor inicial
    map(url => this.routes.find(route => '/' + route.path === url)?.title ?? 'Mapas')
  );

}
