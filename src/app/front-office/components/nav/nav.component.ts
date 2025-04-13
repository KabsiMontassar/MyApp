import { Component, OnInit } from '@angular/core';
import { CartService } from 'src/app/services/cart.service';

@Component({
  selector: 'app-frontnav',
  templateUrl: './nav.component.html',
  styleUrls: ['./nav.component.css']
})
export class FrontNavComponent implements OnInit {
  cartCount: number = 0;
constructor(private cartService: CartService){}
  ngOnInit(): void {
    this.cartService.numberOfProducts$.subscribe(count => {
      this.cartCount = count;
    });
  }
}
