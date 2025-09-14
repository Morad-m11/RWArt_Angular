import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';

@Component({
    selector: 'app-confirm-dialog',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './confirm-dialog.component.html',
    styleUrl: './confirm-dialog.component.scss'
})
export class ConfirmDialogComponent {}
