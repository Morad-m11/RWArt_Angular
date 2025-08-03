import { ResolveFn } from '@angular/router';

export const tokenResolver: ResolveFn<string | null> = (route) => {
    return route.paramMap.get('token');
};
