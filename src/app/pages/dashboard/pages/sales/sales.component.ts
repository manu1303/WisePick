import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';
import { FormsModule } from '@angular/forms';

interface Sale {
  id: string;
  saleDate: string;
  customerName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  paymentMethod: string;
  source: string;
  createdAt: string;
}

@Component({
  selector: 'app-sales',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './sales.component.html',
  styleUrls: ['./sales.component.scss']
})
export class SalesComponent implements OnInit {

  sales: Sale[] = [];

  searchTerm = '';

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {

    this.sales =
      JSON.parse(
        localStorage.getItem('wisepick_sales') || '[]'
      );

    this.sales.sort(
      (a, b) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }


  get totalSales(): number {

    return this.sales.reduce(
      (sum, sale) => sum + sale.total,
      0
    );
  }


  get totalTransactions(): number {
    return this.sales.length;
  }


  get totalProducts(): number {

    return this.sales.reduce(
      (sum, sale) => sum + sale.quantity,
      0
    );
  }


  get averageTicket(): number {

    if (!this.sales.length) {
      return 0;
    }

    return (
      this.totalSales /
      this.totalTransactions
    );
  }


  get filteredSales(): Sale[] {

    const term =
      this.searchTerm
        .toLowerCase()
        .trim();

    if (!term) {
      return this.sales;
    }

    return this.sales.filter(
      sale =>
        sale.productName
          .toLowerCase()
          .includes(term) ||

        sale.customerName
          .toLowerCase()
          .includes(term) ||

        sale.paymentMethod
          .toLowerCase()
          .includes(term)
    );
  }


  addData(): void {
    this.router.navigate([
      '/dashboard/sales/import'
    ]);
  }


  addManualSale(): void {
    this.router.navigate([
      '/dashboard/sales/manual'
    ]);
  }
}