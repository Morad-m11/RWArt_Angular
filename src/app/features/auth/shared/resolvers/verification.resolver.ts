import { ResolveFn } from '@angular/router';

export const verificationTokenResolver: ResolveFn<string | null> = (route) => {
    return route.queryParamMap.get('token');
};
