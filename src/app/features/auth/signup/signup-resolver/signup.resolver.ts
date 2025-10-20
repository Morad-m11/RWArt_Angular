import { ResolveFn } from '@angular/router';
import { SignInProviderInfo } from '../../shared/signin-provider-type';

export const signupResolver: ResolveFn<SignInProviderInfo | undefined> = (route) => {
    const thirdParty = route.queryParamMap.get('thirdParty');

    if (!thirdParty) {
        return undefined;
    }

    try {
        const parsed = JSON.parse(thirdParty) as SignInProviderInfo;
        return { provider: parsed.provider, token: parsed.token };
    } catch {
        console.error('failed to parse third party sign in info');
        return;
    }
};
