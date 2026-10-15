import { Component, computed, input, output } from '@angular/core';

/**
 * Paginador reutilizable (presentacional): no sabe de cursos ni instructores,
 * solo recibe el estado y avisa con `pageChange` a qué página se quiere ir.
 * `page` es base 0, igual que el API.
 */
@Component({
  selector: 'app-pagination',
  templateUrl: './pagination.html'
})
export class Pagination {
  // input()/output(): forma moderna de @Input/@Output.
  readonly page = input.required<number>();
  readonly pageSize = input.required<number>();
  readonly totalElements = input.required<number>();
  readonly pageChange = output<number>();

  protected readonly totalPages = computed(() =>
    Math.max(1, Math.ceil(this.totalElements() / this.pageSize()))
  );
  protected readonly pages = computed(() =>
    Array.from({ length: this.totalPages() }, (_, index) => index)
  );

  protected goTo(page: number): void {
    if (page >= 0 && page < this.totalPages() && page !== this.page()) {
      this.pageChange.emit(page);
    }
  }
}
