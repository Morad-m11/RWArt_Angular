type Routes = 'global' | 'signup' | 'login' | 'verification' | 'forgotPassword';

const requestFailedMessage = (status: number) => `Request failed (${status})`;

export const AuthMessages: Record<Routes, Record<number, string>> = {
    global: {
        429: 'Too many attempts. Please wait a bit before trying again'
    },
    signup: {
        400: 'Invalid email or username'
    },
    login: {
        401: 'Invalid username/password',
        403: "Your account hasn't been verified yet"
    },
    verification: {
        400: 'Invalid or expired link',
        401: 'Invalid or expired link'
    },
    forgotPassword: {
        400: 'Invalid or expired link'
    }
};

export const getErrorMessage = (
    route: keyof typeof AuthMessages,
    status: number
): string => {
    const routeMessages = AuthMessages[route];

    if (!routeMessages[status]) {
        return AuthMessages.global[status] || requestFailedMessage(status);
    }

    return routeMessages[status];
};
