import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

interface ExtractedSale {
  saleDate: string;
  customerName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  paymentMethod: string;
  notes: string;
}

@Component({
  selector: 'app-sales-invoice',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './sales-invoice.component.html',
  styleUrls: ['./sales-invoice.component.scss']
})
export class SalesInvoiceComponent {

  selectedFile: File | null = null;

  imagePreview: string | null = null;

  fileName = '';

  analyzing = false;

  analysisCompleted = false;

  saleSaved = false;

  showErrors = false;

  globalError = '';

  extractedSale: ExtractedSale = {
    saleDate: '',
    customerName: '',
    productName: '',
    quantity: 1,
    unitPrice: 0,
    paymentMethod: '',
    notes: ''
  };

  constructor(
    private router: Router
  ) {}


  get total(): number {

    return (
      Number(this.extractedSale.quantity || 0) *
      Number(this.extractedSale.unitPrice || 0)
    );
  }


  /* ==========================
     SELECCIONAR IMAGEN
  =========================== */

  onFileSelected(event: Event): void {

    const input =
      event.target as HTMLInputElement;

    if (
      !input.files ||
      input.files.length === 0
    ) {
      return;
    }

    const file =
      input.files[0];

    this.resetAnalysis();

    const validTypes = [
      'image/jpeg',
      'image/png',
      'image/webp'
    ];

    if (!validTypes.includes(file.type)) {

      this.globalError =
        'Selecciona una imagen válida: JPG, PNG o WEBP.';

      return;
    }

    /*
      8 MB para esta primera versión.
    */

    const maxSize =
      8 * 1024 * 1024;

    if (file.size > maxSize) {

      this.globalError =
        'La imagen no puede superar los 8 MB.';

      return;
    }

    this.selectedFile = file;

    this.fileName = file.name;

    const reader =
      new FileReader();

    reader.onload = () => {

      this.imagePreview =
        reader.result as string;

    };

    reader.readAsDataURL(file);
  }


  /* ==========================
     ANALIZAR
  =========================== */

  analyzeInvoice(): void {

    if (!this.selectedFile) {
      return;
    }

    this.analyzing = true;

    /*
      AHORA:
      simulamos una respuesta.

      DESPUÉS:
      aquí llamaremos al
      microservicio de IA.
    */

    setTimeout(() => {

      this.extractedSale = {

        saleDate:
          new Date()
            .toISOString()
            .split('T')[0],

        customerName:
          'Cliente no identificado',

        productName:
          'Jean clásico',

        quantity:
          2,

        unitPrice:
          35,

        paymentMethod:
          'Efectivo',

        notes:
          'Información extraída automáticamente de la imagen.'
      };

      this.analyzing = false;

      this.analysisCompleted = true;

    }, 1400);
  }


  /* ==========================
     VALIDACIÓN
  =========================== */

  private isValid(): boolean {

    return !!(
      this.extractedSale.saleDate &&
      this.extractedSale.productName &&
      Number(this.extractedSale.quantity) > 0 &&
      Number(this.extractedSale.unitPrice) > 0 &&
      this.extractedSale.paymentMethod
    );
  }


  /* ==========================
     GUARDAR
  =========================== */

  saveSale(): void {

    this.showErrors = true;

    if (!this.isValid()) {
      return;
    }

    const normalizedSale = {

      id:
        crypto.randomUUID(),

      saleDate:
        this.extractedSale.saleDate,

      customerName:
        this.extractedSale.customerName ||
        'Cliente no identificado',

      productName:
        this.extractedSale.productName,

      quantity:
        Number(
          this.extractedSale.quantity
        ),

      unitPrice:
        Number(
          this.extractedSale.unitPrice
        ),

      total:
        this.total,

      paymentMethod:
        this.extractedSale.paymentMethod,

      notes:
        this.extractedSale.notes,

      source:
        'invoice',

      createdAt:
        new Date().toISOString()
    };


    const savedSales =
      JSON.parse(
        localStorage.getItem(
          'wisepick_sales'
        ) || '[]'
      );


    savedSales.push(
      normalizedSale
    );


    localStorage.setItem(
      'wisepick_sales',
      JSON.stringify(
        savedSales
      )
    );


    console.log(
      'Venta desde factura:',
      normalizedSale
    );


    this.showErrors = false;

    this.saleSaved = true;
  }


  /* ==========================
     RESET
  =========================== */

  resetAnalysis(): void {

    this.analysisCompleted = false;

    this.saleSaved = false;

    this.analyzing = false;

    this.showErrors = false;

    this.globalError = '';

    this.imagePreview = null;

    this.selectedFile = null;

    this.fileName = '';

    this.extractedSale = {

      saleDate: '',

      customerName: '',

      productName: '',

      quantity: 1,

      unitPrice: 0,

      paymentMethod: '',

      notes: ''
    };
  }


  /* ==========================
     NAVIGATION
  =========================== */

  goBack(): void {

    this.router.navigate([
      '/dashboard/sales/import'
    ]);
  }


  goToSales(): void {

    this.router.navigate([
      '/dashboard/sales'
    ]);
  }

}