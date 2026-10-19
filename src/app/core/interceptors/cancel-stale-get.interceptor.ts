import type { HttpInterceptorFn } from '@angular/common/http';
import { Subject, takeUntil } from 'rxjs';

const pendingByUrl = new Map<string, Subject<void>>();

export const cancelStaleGetInterceptor: HttpInterceptorFn = (req, next) => {
  if (req.method !== 'GET') {
    return next(req);
  }

  const key = req.url;
  pendingByUrl.get(key)?.next();

  const cancelPrevious$ = new Subject<void>();
  pendingByUrl.set(key, cancelPrevious$);

  return next(req).pipe(takeUntil(cancelPrevious$));
};
