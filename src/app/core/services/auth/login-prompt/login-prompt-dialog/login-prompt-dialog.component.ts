import { Component, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';

@Component({
    selector: 'app-login-prompt-dialog',
    standalone: true,
    imports: [MaterialModule, RouterLink],
    templateUrl: './login-prompt-dialog.component.html',
    styleUrl: './login-prompt-dialog.component.scss'
})
export class LoginPromptDialogComponent {
    routeUrl = inject(Router).url;
}
