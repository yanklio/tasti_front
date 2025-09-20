import { HttpInterceptorFn } from '@angular/common/http';

export const CredentialsInterceptor: HttpInterceptorFn = (req, next) => {
  const credentialsReq = req.clone({
    withCredentials: true,
  });

  return next(credentialsReq);
};
