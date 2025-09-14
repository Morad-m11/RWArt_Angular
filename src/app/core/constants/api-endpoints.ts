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
        profile: (username: string) => `user/${username}`,
        updateUsername: 'user/update-username',
        checkUnique: 'user/check-unique'
    },
    post: {
        list: 'post',
        create: 'post',
        featured: 'post/featured',
        upvote: (id: string) => `post/${id}/upvote`
    }
};
