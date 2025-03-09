import { Component, ViewEncapsulation, OnInit, OnDestroy } from '@angular/core';
@Component({
  selector: 'app-frontoffice-layout',
  templateUrl: './frontoffice-layout.component.html',
  styleUrls: ['./frontoffice-layout.component.css'],
    encapsulation: ViewEncapsulation.None  
  
})
export class FrontofficeLayoutComponent  implements OnInit , OnDestroy {

  ngOnInit() {
   
    this.loadScripts([ 
      '../../../assets/front/js/jquery-3.3.1.min.js',
      '../../../assets/front/js/bootstrap.min.js',
      '../../../assets/front/js/jquery.nice-select.min.js',
      '../../../assets/front/js/jquery-ui.min.js',
      '../../../assets/front/js/jquery.slicknav.js',
      '../../../assets/front/js/mixitup.min.js',
      '../../../assets/front/js/owl.carousel.min.js',
      '../../../assets/front/js/main.js'

    ]);
   
   
  }
  ngOnDestroy() {
    this.removeScripts([ 
      '../../../assets/front/js/jquery-3.3.1.min.js',
      '../../../assets/front/js/bootstrap.min.js',
      '../../../assets/front/js/jquery.nice-select.min.js',
      '../../../assets/front/js/jquery-ui.min.js',
      '../../../assets/front/js/jquery.slicknav.js',
      '../../../assets/front/js/mixitup.min.js',
      '../../../assets/front/js/owl.carousel.min.js',
      '../../../assets/front/js/main.js'
    ]);
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
