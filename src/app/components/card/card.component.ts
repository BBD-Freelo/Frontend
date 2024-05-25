import {Component, Input} from '@angular/core';
import {
  CdkDrag,
} from '@angular/cdk/drag-drop';

@Component({
  selector: 'app-card',
  standalone: true,
  imports: [CdkDrag],
  templateUrl: './card.component.html',
  styleUrl: './card.component.css'
})
export class CardComponent {
  @Input({ required: true }) item: any;
}
