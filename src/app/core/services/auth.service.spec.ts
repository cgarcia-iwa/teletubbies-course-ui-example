import { provideHttpClient } from '@angular/common/http';
import { TestBed } from '@angular/core/testing';
import { AUTH_STORAGE_KEY, AuthService } from './auth.service';

describe('AuthService', () => {
  afterEach(() => localStorage.clear());

  it('should read the email from the JWT sub claim', () => {
    const payload = btoa(JSON.stringify({ sub: 'po@teletubbies.test', role: 'TEACHER' }));
    localStorage.setItem(
      AUTH_STORAGE_KEY,
      JSON.stringify({ token: `header.${payload}.signature`, role: 'TEACHER' })
    );
    TestBed.configureTestingModule({ providers: [provideHttpClient()] });

    expect(TestBed.inject(AuthService).getEmail()).toBe('po@teletubbies.test');
  });
});
