import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

interface CompanyProfile {
  name: string;
  city: string;
  employeesRange: string;
  businessType: string;
  categories: string[];
  dailySalesRange: string;
  salesRecordMethod: string;
  objectives: string[];
  preferredDataSource: string;
}

@Component({
  selector: 'app-company',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './company.component.html',
  styleUrls: ['./company.component.scss']
})
export class CompanyComponent {

  company: CompanyProfile = {
    name: 'Textiles Andinos',
    city: 'Quito',
    employeesRange: '1 - 5',
    businessType: 'Tienda física',
    categories: ['Jeans', 'Moda femenina'],
    dailySalesRange: '21 - 50',
    salesRecordMethod: 'Excel',
    objectives: ['Aumentar ventas', 'Marketing'],
    preferredDataSource: 'Excel'
  };

  constructor(private router: Router) {}

  editCompany(): void {
    this.router.navigate(['/dashboard/company/setup']);
  }

  addData(): void {
    this.router.navigate(['/dashboard/sales/import']);
  }
}