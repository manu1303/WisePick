import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { Component, OnInit } from '@angular/core';


interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  cost: number;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
}
interface SaleForm {
  saleDate: string;
  customerName: string;

  productId: string;
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
export class SalesManualComponent implements OnInit {

  ngOnInit(): void {
  this.loadProducts();
  }

  private loadProducts(): void {

  const storedProducts =
    JSON.parse(
      localStorage.getItem('wisepick_products') || '[]'
    );

  this.products =
    storedProducts.filter(
      (product: Product) =>
        product.status === 'active'
    );
  }

  onProductSelected(): void {

  const product =
    this.products.find(
      item =>
        item.id === this.sale.productId
    );

  if (!product) {

    this.sale.productName = '';
    this.sale.unitPrice = 0;

    return;
  }

  this.sale.productName =
    product.name;

  this.sale.unitPrice =
    product.price;
 }

  products: Product[] = [];

  showErrors = false;

  saleSaved = false;

  sale: SaleForm = {
    saleDate: this.getToday(),
    customerName: '',

    productId: '',
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

    productId:
      this.sale.productId,

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
      this.sale.productId &&
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
      productId: '',
      productName: '',
      quantity: 1,
      unitPrice: 0,
      paymentMethod: '',
      notes: ''
    };

    this.saleSaved = false;

    this.showErrors = false;
  }

  goToSales(): void {
    this.router.navigate(['/dashboard/sales']);
  }

  goBack(): void {
    this.router.navigate(['/dashboard/sales/import']);
  }
}