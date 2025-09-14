import { ResolveFn } from '@angular/router';

export const profileResolver: ResolveFn<string> = (route) => {
    return route.paramMap.get('username')!;
};
