import { inject, Injectable } from '@angular/core';
import { Observable, tap } from 'rxjs';
import { LOGIN_URL } from '../../api-urls';
import { LoginRequest, LoginResponse } from '../../shared/model/auth.model';
import { InstructorRoleType } from '../../shared/model/instructor-role.model';
import { ApiService } from './api.service';

export const AUTH_STORAGE_KEY = 'auth';

interface StoredSession {
  token: string;
  role: InstructorRoleType;
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.api.post<LoginResponse>(LOGIN_URL, request).pipe(
      tap(({ token, role }) => {
        const session: StoredSession = { token, role };
        localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(session));
      })
    );
  }

  logout(): void {
    localStorage.removeItem(AUTH_STORAGE_KEY);
  }

  /**
   * true si hay una sesión guardada. No valida expiración: si el token caducó,
   * el backend responde 401 y el authInterceptor cierra la sesión y redirige a login.
   */
  isAuthenticated(): boolean {
    return localStorage.getItem(AUTH_STORAGE_KEY) !== null;
  }

  getRole(): InstructorRoleType {
    return this.getSession().role;
  }

  getToken(): string {
    return this.getSession().token;
  }

  private getSession(): StoredSession {
    return JSON.parse(localStorage.getItem(AUTH_STORAGE_KEY)!) as StoredSession;
  }
}
