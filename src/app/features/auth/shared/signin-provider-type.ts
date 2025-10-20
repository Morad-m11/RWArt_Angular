export type SignInProvider = 'google';

export interface SignInProviderInfo {
    provider: SignInProvider;
    token: string;
}
