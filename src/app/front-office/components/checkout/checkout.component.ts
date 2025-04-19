import { Component } from '@angular/core';
import { AddressStepComponent } from './address-step/address-step.component';
@Component({
  selector: 'app-checkout',
  templateUrl: './checkout.component.html',
  styleUrls: ['./checkout.component.css']
})
export class CheckoutComponent {
  step = 1;

  nextStep() {
    if (this.step < 4) this.step++;
  }
  
  prevStep() {
    if (this.step > 1) this.step--;
  }
  
}
