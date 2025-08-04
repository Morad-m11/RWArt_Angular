import { ResolveFn } from '@angular/router';

export const tokenResolver: ResolveFn<string> = (route) => {
    return route.paramMap.get('token')!;
};
