import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { LOGIN_URL } from '../../api-urls';
import { LoginRequest, LoginResponse } from '../../shared/model/auth.model';
import { ApiService } from './api.service';

export const AUTH_STORAGE_KEY = 'auth';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly api = inject(ApiService);

  login(request: LoginRequest): Observable<LoginResponse> {
    return this.api.post(LOGIN_URL, request);
  }
}
