import { ResolveFn } from '@angular/router';

export const redirectResolver: ResolveFn<string | null> = (route) => {
    return route.queryParamMap.get('redirect');
};
