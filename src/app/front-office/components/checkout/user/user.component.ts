import { Component, Input, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-user',
  templateUrl: './user.component.html',
  styleUrls: ['./user.component.css']
})
export class UserComponent {
  @Input() orderId!: number;
  @Output() next = new EventEmitter<void>();
  @Output() back = new EventEmitter<void>();
  
  name: string = '';
  email: string = '';
  phone: string = '';
}
