import { Component, inject } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { NavigationEnd, Router, RouterOutlet } from '@angular/router';
import { filter, map, startWith } from 'rxjs';
import { Sidebar } from './layout/sidebar/sidebar';

@Component({
  imports: [RouterOutlet, Sidebar],
  selector: 'app-root',
  styleUrl: './app.scss',
  templateUrl: './app.html'
})
export class App {
  private readonly router = inject(Router);

  // Rutas de pantalla completa (sin sidebar), como login.
  protected readonly showSidebar = toSignal(
    this.router.events.pipe(
      filter((event) => event instanceof NavigationEnd),
      map((event) => !event.urlAfterRedirects.startsWith('/login')),
      startWith(!this.router.url.startsWith('/login'))
    ),
    { initialValue: true }
  );
}
