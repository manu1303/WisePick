import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

type HomeState =
  | 'DEMO'
  | 'NEW_USER'
  | 'COMPANY_CONFIGURED'
  | 'ACTIVE';

@Component({
  standalone: true,
  selector: 'app-home',
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.scss']
})
export class HomeComponent {

  homeState: HomeState = 'NEW_USER';

  constructor(private router: Router) {}

  startCompanySetup(): void {
    this.router.navigate(['/dashboard/company/setup']);
  }
}

