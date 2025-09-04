import { HttpErrorResponse, HttpHeaders, HttpStatusCode } from '@angular/common/http';

type Routes = 'signup' | 'login' | 'verification' | 'forgotPassword';

const requestFailedMessage = (status: number) => `Request failed (${status})`;

const tooManyRequestsMessage = (headers: HttpHeaders) => {
    const retryHeader =
        headers.get('Retry-After-Long') ?? headers.get('Retry-After-Medium');

    if (!retryHeader) {
        return 'Too many attempts. Please wait a few seconds before trying again';
    }

    if (+retryHeader > 60) {
        const minutes = Math.floor(+retryHeader / 60);
        return `Too many attempts. Please try again in ${minutes} minutes`;
    }

    return `Too many attempts. Please try again in ${retryHeader} seconds`;
};

export const AuthMessages: Record<Routes, Record<number, string>> = {
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
    error: HttpErrorResponse
): string => {
    const status = error.status;

    if (status === HttpStatusCode.TooManyRequests) {
        return tooManyRequestsMessage(error.headers);
    }

    const routeMessages = AuthMessages[route];

    if (!routeMessages[status]) {
        return requestFailedMessage(status);
    }

    return routeMessages[status];
};
