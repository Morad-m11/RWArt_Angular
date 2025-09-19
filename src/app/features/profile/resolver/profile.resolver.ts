import { ResolveFn } from '@angular/router';

export const usernameResolver: ResolveFn<string> = (route) => {
    return route.paramMap.get('username')!;
};
