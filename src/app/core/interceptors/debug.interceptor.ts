import { HttpInterceptorFn } from '@angular/common/http';

export const DebugInterceptor: HttpInterceptorFn = (req, next) => {
  console.log('Request URL:', req.url);
  console.log('Request Method:', req.method);
  console.log(
    'Request Headers:',
    req.headers.keys().map((key) => `${key}: ${req.headers.get(key)}`),
  );
  console.log('Request Body:', req.body);

  return next(req);
};
