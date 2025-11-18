import { Component, output } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';

@Component({
    selector: 'app-login-prompt',
    standalone: true,
    imports: [MaterialModule, RouterLink],
    templateUrl: './login-prompt.component.html',
    styleUrl: './login-prompt.component.scss'
})
export class LoginPromptComponent {
    redirect?: string;
    closed = output();
}
