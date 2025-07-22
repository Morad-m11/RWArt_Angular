export const CoreSnackbarMessages = {
    login: {
        success: 'Welcome',
        failed: 'Login failed'
    },
    logout: {
        success: 'Logged out',
        failed: 'Logout failed'
    },
    expired: 'Your session has expired. Please log in again',
    connection: 'The server is unreachable. Please check your connection',
    unhandled: 'Unhandled error'
} as const;
