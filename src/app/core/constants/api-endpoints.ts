export const Endpoints = {
    auth: {
        me: 'auth/me',
        login: {
            local: 'auth/login',
            google: 'auth/google'
        },
        logout: 'auth/logout',
        refresh: 'auth/refresh',
        signup: 'auth/signup',
        verifyAccount: (token: string) => `auth/verify-account/${token}`,
        forgotPassword: 'auth/forgot-password',
        resetPassword: 'auth/reset-password',
        resendVerification: 'auth/resend-verification'
    },
    user: {
        id: (id: number) => `user/${id}`,
        profile: (username: string) => `user/${username}`,
        checkUnique: 'user/check-unique'
    },
    post: {
        base: 'post',
        id: (id: string) => `post/${id}`,
        featured: 'post/featured',
        upvote: (id: string) => `post/${id}/upvote`
    },
    feedback: 'feedback'
} as const;
