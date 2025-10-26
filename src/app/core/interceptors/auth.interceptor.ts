import {
  HttpContextToken,
  HttpErrorResponse,
  HttpEvent,
  HttpHandlerFn,
  HttpInterceptorFn,
  HttpRequest,
} from '@angular/common/http';
import { Router } from '@angular/router';
import {
  BehaviorSubject,
  catchError,
  filter,
  finalize,
  Observable,
  switchMap,
  take,
  throwError,
} from 'rxjs';
import { AuthService } from '../services/auth.service';
import { inject } from '@angular/core';
import { AuthResponse } from '../models/auth.model';
import { SessionService } from '../services/session.service';

let isRefreshing = false;
let refreshTokenSubject: BehaviorSubject<string | null> = new BehaviorSubject<string | null>(null);

export const SKIP_AUTH = new HttpContextToken<boolean>(() => false);

export const AuthInterceptor: HttpInterceptorFn = (
  req: HttpRequest<unknown>,
  next: HttpHandlerFn,
): Observable<HttpEvent<unknown>> => {
  const router = inject(Router);
  const sessionService = inject(SessionService);
  const authService = inject(AuthService);

  if (req.context.get(SKIP_AUTH)) {
    return next(req);
  }

  const token = authService.accessToken;
  if (token) {
    req = addTokenToRequest(req, token);
  }

  return next(req).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401 && !isRefreshRequest(req)) {
        return handle401Error(req, next, sessionService, router);
      }
      return throwError(() => error);
    }),
  );
};

function addTokenToRequest(request: HttpRequest<any>, token: string): HttpRequest<any> {
  return request.clone({
    headers: request.headers.set('Authorization', `Bearer ${token}`),
  });
}

function isRefreshRequest(request: HttpRequest<any>): boolean {
  return request.url.endsWith('/auth/token/refresh');
}

function handle401Error(
  request: HttpRequest<unknown>,
  next: HttpHandlerFn,
  sessionService: SessionService,
  router: Router,
): Observable<HttpEvent<unknown>> {
  if (!isRefreshing) {
    isRefreshing = true;
    refreshTokenSubject.next(null);

    return sessionService.refreshToken().pipe(
      switchMap((response: AuthResponse) => {
        refreshTokenSubject.next(response.access);
        return next(addTokenToRequest(request, response.access));
      }),
      catchError((error) => {
        return throwError(() => error);
      }),
      finalize(() => {
        isRefreshing = false;
      }),
    );
  } else {
    return refreshTokenSubject.pipe(
      filter((token) => token !== null),
      take(1),
      switchMap((token) => {
        return next(addTokenToRequest(request, token));
      }),
    );
  }
}
