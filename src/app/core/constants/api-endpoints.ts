export const Endpoints = {
    auth: {
        login: 'auth/login',
        logout: 'auth/logout',
        refresh: 'auth/refresh',
        signup: 'auth/signup',
        verifyAccount: (token: string) => `auth/verify-account/${token}`,
        forgotPassword: 'auth/forgot-password',
        resetPassword: 'auth/reset-password'
    },
    user: {
        profile: 'user/profile',
        checkUnique: 'user/check-unique'
    },
    images: 'image'
};
