import { Component, ViewEncapsulation, OnInit , OnDestroy } from '@angular/core';



@Component({
  selector: 'app-backoffice-layout',
  templateUrl: './backoffice-layout.component.html',
  styleUrls: ['./backoffice-layout.component.css'],
  encapsulation: ViewEncapsulation.None
})
export class BackofficeLayoutComponent implements OnInit , OnDestroy {


  ngOnInit() {
   
    this.loadScripts([
    '../assets/vendor/jquery/jquery.min.js',
    '../assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
    '../assets/vendor/jquery-easing/jquery.easing.min.js',
    '../assets/js/ruang-admin.min.js',
    '../assets/vendor/datatables/jquery.dataTables.min.js',
    '../assets/vendor/datatables/dataTables.bootstrap4.min.js']);
   
   
  }
  ngOnDestroy() {
    this.removeScripts([
    '../assets/vendor/jquery/jquery.min.js',
    '../assets/vendor/bootstrap/js/bootstrap.bundle.min.js',
    '../assets/vendor/jquery-easing/jquery.easing.min.js',
    '../assets/js/ruang-admin.min.js',
    '../assets/vendor/datatables/jquery.dataTables.min.js',
    '../assets/vendor/datatables/dataTables.bootstrap4.min.js']);
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
