import { HttpInterceptorFn } from '@angular/common/http';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
   const reqWithAuth = req.clone({ withCredentials: true });
   return next(reqWithAuth);
};
