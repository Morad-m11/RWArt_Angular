import { Component } from '@angular/core';
import { MaterialModule } from 'src/app/shared/material.module';

@Component({
    selector: 'app-result-card',
    standalone: true,
    imports: [MaterialModule],
    templateUrl: './result-card.component.html',
    styleUrl: './result-card.component.scss'
})
export class ResultCardComponent {}
