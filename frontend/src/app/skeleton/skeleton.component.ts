import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-skeleton',
  standalone: false,
  templateUrl: './skeleton.component.html',
  styleUrl: './skeleton.component.css'
})
export class SkeletonComponent {
  @Input() width: string = '100px';
  @Input() height: string = '20px';
  @Input() shape: 'circle' | 'rectangle' = 'rectangle';
  @Input() rows: number = 1;
}
