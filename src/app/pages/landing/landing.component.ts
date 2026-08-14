import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router,RouterLink} from '@angular/router';


@Component({
  selector: 'app-landing',

  standalone: true,

  imports: [
    CommonModule,
    RouterLink
  ],

  templateUrl:
    './landing.component.html',

  styleUrls: [
    './landing.component.scss'
  ],
})
export class LandingComponent {


  year =
    new Date()
      .getFullYear();


  constructor(
    private router:
      Router
  ) {}


  goToDemo(): void {

    this.router.navigate([
      '/demo/home'
    ]);

  }


  goToMarketingDemo(): void {

    this.router.navigate([
      '/demo/marketing-ia'
    ]);

  }

}





