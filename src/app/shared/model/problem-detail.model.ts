export interface FieldViolation {
  field: string;
  message: string;
}

export interface ProblemDetail {
  type: string;
  title: string;
  status: number;
  detail: string;
  instance: string;
  traceId: string;
  errors?: FieldViolation[];
}
