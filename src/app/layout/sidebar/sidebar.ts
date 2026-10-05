import { Component } from '@angular/core';
import { RouterLink, RouterLinkActive } from '@angular/router';

interface MenuItem {
  label: string;
  link: string;
}

/** Menú lateral: cada opción navega a una ruta definida en app.routes.ts. */
@Component({
  selector: 'app-sidebar',
  imports: [RouterLink, RouterLinkActive],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.scss',
})
export class Sidebar {
  protected readonly menuItems: MenuItem[] = [
    { label: 'Cursos', link: '/courses' },
    { label: 'Instructores', link: '/instructors' },
  ];
}
