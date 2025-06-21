import { Component } from '@angular/core';
import { MaterialModule } from '../material.module';

@Component({
   selector: 'app-feedback',
   standalone: true,
   imports: [MaterialModule],
   templateUrl: './feedback.component.html',
   styleUrl: './feedback.component.scss'
})
export default class FeedbackComponent {}
