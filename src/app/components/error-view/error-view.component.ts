import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-error-view',
  standalone: true,
  imports: [],
  templateUrl: './error-view.component.html',
  styleUrl: './error-view.component.css'
})
export class ErrorViewComponent {
  @Input({required: true}) header!: string;
  @Input() body!: string;
}
