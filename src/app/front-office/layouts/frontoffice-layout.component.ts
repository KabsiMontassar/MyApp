import { Component, ViewEncapsulation } from '@angular/core';
@Component({
  selector: 'app-frontoffice-layout',
  templateUrl: './frontoffice-layout.component.html',
  styleUrls: ['./frontoffice-layout.component.css'],
    encapsulation: ViewEncapsulation.None  
  
})
export class FrontofficeLayoutComponent {

  ngOnInit() {
   
    this.loadScripts([ 

      '../assets/js/jquery.min.js',
      '../assets/js/jquery-migrate-3.0.1.min.js',
      '../assets/js/bootstrap.min.js',
      '../assets/js/jquery.easing.1.3.js',
      '../assets/js/jquery.waypoints.min.js',
      '../assets/js/jquery.stellar.min.js',
      '../assets/js/owl.carousel.min.js',
      '../assets/js/jquery.magnific-popup.min.js',
      '../assets/js/jquery.animateNumber.min.js',
      '../assets/js/scrollax.min.js',
      '../assets/js/aos.js',
      '../assets/js/main.js'

    ]);
   
   
  }
  ngOnDestroy() {
    this.removeScripts([ 
      '../assets/js/jquery.min.js',
      '../assets/js/jquery-migrate-3.0.1.min.js',
      '../assets/js/bootstrap.min.js',
      '../assets/js/jquery.easing.1.3.js',
      '../assets/js/jquery.waypoints.min.js',
      '../assets/js/jquery.stellar.min.js',
      '../assets/js/owl.carousel.min.js',
      '../assets/js/jquery.magnific-popup.min.js',
      '../assets/js/jquery.animateNumber.min.js',
      '../assets/js/scrollax.min.js',
      '../assets/js/aos.js',
      '../assets/js/main.js']);
  }




  private loadScripts(scripts: string[]) {
    scripts.forEach((script) => {
      const scriptTag = document.createElement('script');
      scriptTag.src = script;
      scriptTag.async = true;
      document.body.appendChild(scriptTag);
    });
  }

 

  private removeScripts(scripts: string[]) {
    scripts.forEach((script) => {
      const scriptElements = document.body.getElementsByTagName('script');
      for (let i = 0; i < scriptElements.length; i++) {
        if (scriptElements[i].src === script) {
          document.body.removeChild(scriptElements[i]);
        }
      }
    });
  }
}
