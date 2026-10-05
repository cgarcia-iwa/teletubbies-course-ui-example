import { HttpClient, HttpParams } from '@angular/common/http';
import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { API } from '../../api-urls';

/**
 * Wrapper genérico sobre HttpClient. Los services de cada entidad
 * (CourseService, InstructorService) lo usan para no repetir la URL base
 * ni el armado de query params.
 */
@Injectable({ providedIn: 'root' })
export class ApiService {
  private readonly http = inject(HttpClient);

  get<T>(url: string, params?: object): Observable<T> {
    return this.http.get<T>(`${API.BASE_URL}/${url}`, { params: this.toHttpParams(params) });
  }

  post<T>(url: string, body: unknown): Observable<T> {
    return this.http.post<T>(`${API.BASE_URL}/${url}`, body);
  }

  put<T>(url: string, body: unknown): Observable<T> {
    return this.http.put<T>(`${API.BASE_URL}/${url}`, body);
  }

  delete<T>(url: string): Observable<T> {
    return this.http.delete<T>(`${API.BASE_URL}/${url}`);
  }

  /** Convierte un objeto de filtros a HttpParams ignorando valores vacíos. */
  private toHttpParams(params?: object): HttpParams {
    let httpParams = new HttpParams();
    for (const [key, value] of Object.entries(params ?? {})) {
      if (value !== null && value !== undefined && value !== '') {
        httpParams = httpParams.set(key, String(value));
      }
    }
    return httpParams;
  }
}
