import { InstructorRole } from './instructor-role.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: 'Bearer';
  expiresIn: number;
  role: InstructorRole;
}

export interface JwtClaims {
  sub: string;
  role: InstructorRole;
  iat: number;
  exp: number;
}
