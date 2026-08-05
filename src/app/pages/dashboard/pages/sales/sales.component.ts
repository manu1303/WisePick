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
  source: 'manual' | 'excel' | 'invoice' | 'demo';
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

  sourceFilter = 'all';
  paymentFilter = 'all';

  constructor(
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadSales();
  }

  loadSales(): void {

    const storedSales =
      JSON.parse(
        localStorage.getItem('wisepick_sales') || '[]'
      );

    this.sales = storedSales.sort(
      (a: Sale, b: Sale) =>
        new Date(b.createdAt).getTime() -
        new Date(a.createdAt).getTime()
    );
  }

  get totalSales(): number {

    return this.sales.reduce(
      (sum, sale) => sum + Number(sale.total),
      0
    );
  }

  get totalTransactions(): number {
    return this.sales.length;
  }

  get totalProducts(): number {

    return this.sales.reduce(
      (sum, sale) =>
        sum + Number(sale.quantity),
      0
    );
  }

  get averageTicket(): number {

    if (this.totalTransactions === 0) {
      return 0;
    }

    return (
      this.totalSales /
      this.totalTransactions
    );
  }

  get identifiedCustomers(): number {

    const customers =
      this.sales
        .filter(
          sale =>
            sale.customerName &&
            sale.customerName !==
              'Cliente no identificado'
        )
        .map(
          sale =>
            sale.customerName
              .trim()
              .toLowerCase()
        );

    return new Set(customers).size;
  }

  get filteredSales(): Sale[] {

    const term =
      this.searchTerm
        .toLowerCase()
        .trim();

    return this.sales.filter(sale => {

      const matchesSearch =
        !term ||
        sale.productName
          .toLowerCase()
          .includes(term) ||
        sale.customerName
          .toLowerCase()
          .includes(term) ||
        sale.paymentMethod
          .toLowerCase()
          .includes(term);

      const matchesSource =
        this.sourceFilter === 'all' ||
        sale.source === this.sourceFilter;

      const matchesPayment =
        this.paymentFilter === 'all' ||
        sale.paymentMethod ===
          this.paymentFilter;

      return (
        matchesSearch &&
        matchesSource &&
        matchesPayment
      );

    });
  }

  get filteredTotal(): number {

    return this.filteredSales.reduce(
      (sum, sale) =>
        sum + Number(sale.total),
      0
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

  clearFilters(): void {

    this.searchTerm = '';
    this.sourceFilter = 'all';
    this.paymentFilter = 'all';
  }

  deleteSale(id: string): void {

    const confirmed =
      window.confirm(
        '¿Seguro que deseas eliminar esta venta?'
      );

    if (!confirmed) {
      return;
    }

    this.sales =
      this.sales.filter(
        sale => sale.id !== id
      );

    localStorage.setItem(
      'wisepick_sales',
      JSON.stringify(this.sales)
    );
  }

  getSourceLabel(
    source: Sale['source']
  ): string {

    switch (source) {

      case 'manual':
        return 'Manual';

      case 'excel':
        return 'Excel';

      case 'invoice':
        return 'Foto / Factura';

      case 'demo':
        return 'Demo';

      default:
        return source;
    }
  }

  analyzeWithAI(): void {

    this.router.navigate([
      '/dashboard/marketing-ia'
    ]);
  }

}