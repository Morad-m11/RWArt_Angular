export {};

declare global {
    interface Window {
        google: Google;
    }

    interface GoogleSigninResponse {
        clientId: string;
        client_id: string;
        credential: string;
        select_by: string;
    }

    interface GoogleIdConfiguration {
        client_id: string;
        /** One Tap color scheme */
        color_scheme?: 'default' | 'light' | 'dark';
        prompt_parent_id?: string;
        callback: (response: GoogleSigninResponse) => void;
    }

    interface GoogleGsiButtonConfiguration {
        theme?: 'outline' | 'filled_black' | 'filled_blue';
        shape?: 'rectangular' | 'pill' | (string & {});
        size?: 'small' | 'medium' | 'large';
        text?: 'signin' | 'signin_with' | 'signup_with' | 'continue_with';
        locale?: string;
    }

    interface PromptMomentNotification {
        isDisplayedMoment: () => boolean;
        isDisplayed: () => boolean;
        isNotDisplayed: () => boolean;
        getNotDisplayedReason: () => string;
        isSkippedMoment: () => void;
        getSkippedReason: () => string;
        isDismissedMoment: () => boolean;
        getDismissedReason: () => string;
        getMomentType: () => string;
    }

    type GooglePromptMomentFn = (notification: PromptMomentNotification) => void;

    interface Google {
        accounts: {
            id: {
                /** Initializes the Google sign in. Should be called only once **app-wide** */
                initialize: (options: GoogleIdConfiguration) => void;

                /** Renders the sign in button */
                renderButton: (
                    element: HTMLElement | null,
                    options: GoogleGsiButtonConfiguration
                ) => void;

                /** displays the One Tap dialog */
                prompt?: (momentListener?: GooglePromptMomentFn) => void;
            };
        };
    }
}
