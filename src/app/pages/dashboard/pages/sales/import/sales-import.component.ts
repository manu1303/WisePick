import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

type ImportMethod =
  | 'manual'
  | 'excel'
  | 'invoice'
  | 'demo';

@Component({
  selector: 'app-sales-import',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './sales-import.component.html',
  styleUrls: ['./sales-import.component.scss']
})
export class SalesImportComponent {

  selectedMethod: ImportMethod | null = null;

  constructor(private router: Router) {}

  selectMethod(method: ImportMethod): void {
    this.selectedMethod = method;
  }

  continue(): void {

    if (!this.selectedMethod) {
      return;
    }

    switch (this.selectedMethod) {

      case 'manual':
        this.router.navigate(['/dashboard/sales/manual']);
        break;

      case 'excel':
        this.router.navigate(['/dashboard/sales/excel']);
        break;

      case 'invoice':
        this.router.navigate(['/dashboard/sales/invoice']);
        break;

      case 'demo':
        this.router.navigate(['/dashboard/sales/demo']);
        break;
    }
  }

  goBack(): void {
    this.router.navigate(['/dashboard/company']);
  }
}