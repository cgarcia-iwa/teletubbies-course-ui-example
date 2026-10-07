import { Component, computed, inject, signal } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { AUTH_STORAGE_KEY, AuthService } from '../../core/services/auth.service';
import { ValidationMessage } from '../../shared/components/validation-message/validation-message';
import { LOGIN_ERRORS } from './login-errors';

@Component({
  selector: 'app-login',
  imports: [ReactiveFormsModule, ValidationMessage],
  templateUrl: './login.html',
  styleUrl: './login.scss'
})
export class Login {
  private fb = inject(FormBuilder);
  private authService = inject(AuthService);

  validationMessages = LOGIN_ERRORS;

  showPassword = signal(false);
  passwordFieldType = computed(() => (this.showPassword() ? 'text' : 'password'));
  togglePasswordAriaLabel = computed(() =>
    this.showPassword() ? 'Hide password' : 'Show password'
  );

  form = this.fb.nonNullable.group({
    email: ['', [Validators.required, Validators.maxLength(150), Validators.email]],
    password: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(20)]]
  });

  togglePasswordVisibility(): void {
    this.showPassword.update((value) => !value);
  }

  onSave(): void {
    this.authService.login(this.form.getRawValue()).subscribe((response) => {
      localStorage.setItem(AUTH_STORAGE_KEY, JSON.stringify(response));
    });
  }
}
