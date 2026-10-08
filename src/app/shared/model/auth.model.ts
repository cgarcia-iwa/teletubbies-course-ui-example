import { InstructorRoleType } from './instructor-role.model';

export interface LoginRequest {
  email: string;
  password: string;
}

export interface LoginResponse {
  token: string;
  tokenType: 'Bearer';
  expiresIn: number;
  role: InstructorRoleType;
}

export interface JwtClaims {
  sub: string;
  role: InstructorRoleType;
  iat: number;
  exp: number;
}
