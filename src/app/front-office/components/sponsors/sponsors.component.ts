import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-sponsors',
  template: `
    <div [style.color]="color">
      <!-- Add your sponsors template here -->
    </div>
  `
})
export class SponsorsComponent {
  @Input() color: string = "";
  @Input() Sponsors: any[]= [];
}
