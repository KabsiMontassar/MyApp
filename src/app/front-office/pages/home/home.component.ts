import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})
export class HomeComponent implements OnInit {
  
  ngOnInit() {
    this.createFloatingLeaves();
  }

  createFloatingLeaves() {
    const leaves = document.querySelectorAll('.floating-leaf');
    leaves.forEach((leaf: Element) => {
      const delay = Math.random() * 15;
      const duration = 15 + Math.random() * 10;
      (leaf as HTMLElement).style.animationDelay = `${delay}s`;
      (leaf as HTMLElement).style.animationDuration = `${duration}s`;
    });
  }
}
