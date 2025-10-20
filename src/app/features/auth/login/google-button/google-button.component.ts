import { Component, OnInit, output } from '@angular/core';
import { GOOGLE_CLIENT_ID } from 'src/app/constants';
import { SignInProviderInfo } from '../../shared/signin-provider-type';

declare const google: Google;

@Component({
    selector: 'app-google-button',
    standalone: true,
    imports: [],
    templateUrl: './google-button.component.html',
    styleUrl: './google-button.component.scss'
})
export class GoogleButtonComponent implements OnInit {
    signedIn = output<SignInProviderInfo>();

    ngOnInit(): void {
        google.accounts.id.initialize({
            client_id: GOOGLE_CLIENT_ID,
            prompt_parent_id: 'prompt_parent',
            callback: (response) => this.handleCredentialResponse(response)
        });

        google.accounts.id.renderButton(document.getElementById('google-signin'), {
            locale: 'en',
            theme: 'outline',
            shape: 'pill',
            text: 'signin_with'
        });
    }

    handleCredentialResponse(response: GoogleSigninResponse) {
        this.signedIn.emit({
            provider: 'google',
            token: response.credential
        });
    }
}
