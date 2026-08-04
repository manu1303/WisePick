import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface SaleForm {
  saleDate: string;
  customerName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  paymentMethod: string;
  notes: string;
}

@Component({
  selector: 'app-sales-manual',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './sales-manual.component.html',
  styleUrls: ['./sales-manual.component.scss']
})
export class SalesManualComponent {

  saleSaved = false;

  sale: SaleForm = {
    saleDate: this.getToday(),
    customerName: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
    paymentMethod: '',
    notes: ''
  };

  constructor(private router: Router) {}

  get total(): number {
    return this.sale.quantity * this.sale.unitPrice;
  }

  private getToday(): string {
    const today = new Date();

    return today.toISOString().split('T')[0];
  }

  saveSale(): void {
  
  if (!this.isValid()) {
    return;
  }

  const normalizedSale = {
    id: crypto.randomUUID(),

    saleDate: this.sale.saleDate,

    customerName:
      this.sale.customerName || 'Cliente no identificado',

    productName:
      this.sale.productName,

    quantity:
      Number(this.sale.quantity),

    unitPrice:
      Number(this.sale.unitPrice),

    total:
      this.total,

    paymentMethod:
      this.sale.paymentMethod,

    notes:
      this.sale.notes,

    source:
      'manual',

    createdAt:
      new Date().toISOString()
  };

  const savedSales =
    JSON.parse(
      localStorage.getItem('wisepick_sales') || '[]'
    );

  savedSales.push(normalizedSale);

  localStorage.setItem(
    'wisepick_sales',
    JSON.stringify(savedSales)
  );

  console.log(
    'Venta guardada:',
    normalizedSale
  );

  this.saleSaved = true;
}

  private isValid(): boolean {

    return !!(
      this.sale.saleDate &&
      this.sale.productName &&
      this.sale.quantity > 0 &&
      this.sale.unitPrice > 0 &&
      this.sale.paymentMethod
    );
  }

  newSale(): void {

    this.sale = {
      saleDate: this.getToday(),
      customerName: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      paymentMethod: '',
      notes: ''
    };

    this.saleSaved = false;
  }

  goToSales(): void {
    this.router.navigate(['/dashboard/sales']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard/sales/import']);
  }
}