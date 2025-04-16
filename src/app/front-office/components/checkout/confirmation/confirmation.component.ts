import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-confirmation',
  templateUrl: './confirmation.component.html',
  styleUrls: ['./confirmation.component.css']
})
export class ConfirmationComponent {
  @Input() orderSummary: any;
  @Input() paymentMethod: string | undefined;

  printInvoice() {
    window.print(); // simple impression de la page
  }
}
