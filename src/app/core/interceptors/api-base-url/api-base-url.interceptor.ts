import { HttpInterceptorFn } from '@angular/common/http';
import { environment } from 'src/environments/environment.development';

export const apiBaseUrlInterceptor: HttpInterceptorFn = (req, next) => {
    if (req.url.startsWith('assets/')) {
        return next(req);
    }

    const urlWithBase = `${environment.baseUrl}/${req.url}`;
    const baseUrlReq = req.clone({ url: urlWithBase });
    return next(baseUrlReq);
};
