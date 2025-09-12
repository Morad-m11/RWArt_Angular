import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { MaterialModule } from 'src/app/shared/material.module';

@Component({
    selector: 'app-login-prompt-dialog',
    standalone: true,
    imports: [MaterialModule, RouterLink],
    templateUrl: './login-prompt-dialog.component.html',
    styleUrl: './login-prompt-dialog.component.scss'
})
export class LoginPromptDialogComponent {}
