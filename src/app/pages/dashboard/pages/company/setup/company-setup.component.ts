import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface CompanyForm {
  name: string;
  city: string;
  businessType: string;
  categories: string[];
  employeesRange: string;
  dailySalesRange: string;
  salesRecordMethod: string;
  salesChannels: string[];
  objectives: string[];
  preferredDataSource: string;
}

@Component({
  selector: 'app-company-setup',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './company-setup.component.html',
  styleUrls: ['./company-setup.component.scss']
})
export class CompanySetupComponent {

  currentStep = 1;
  totalSteps = 5;

  company: CompanyForm = {
    name: '',
    city: '',
    businessType: '',
    categories: [],
    employeesRange: '',
    dailySalesRange: '',
    salesRecordMethod: '',
    salesChannels: [],
    objectives: [],
    preferredDataSource: ''
  };

  constructor(private router: Router) {}

  nextStep(): void {
    if (this.currentStep < this.totalSteps) {
      this.currentStep++;
    }
  }

  previousStep(): void {
    if (this.currentStep > 1) {
      this.currentStep--;
    }
  }

  toggleCategory(category: string): void {
    const index = this.company.categories.indexOf(category);

    if (index >= 0) {
      this.company.categories.splice(index, 1);
    } else {
      this.company.categories.push(category);
    }
  }

  toggleChannel(channel: string): void {
    const index = this.company.salesChannels.indexOf(channel);

    if (index >= 0) {
      this.company.salesChannels.splice(index, 1);
    } else {
      this.company.salesChannels.push(channel);
    }
  }

  toggleObjective(objective: string): void {
    const index = this.company.objectives.indexOf(objective);

    if (index >= 0) {
      this.company.objectives.splice(index, 1);
    } else {
      this.company.objectives.push(objective);
    }
  }

  isSelected(list: string[], value: string): boolean {
    return list.includes(value);
  }

  finishSetup(): void {
    console.log('Empresa configurada:', this.company);

    // Más adelante aquí guardaremos en Firebase.

    this.router.navigate(['/dashboard/company/setup']);
  }
}