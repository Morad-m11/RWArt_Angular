import { ResolveFn } from '@angular/router';

export const idResolver: ResolveFn<string | null> = (route) => {
    return route.paramMap.get('id')!;
};
