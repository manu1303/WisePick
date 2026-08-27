import {Component} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {SalesApiService,SaleRequest} from '../../../../../core/services/sales-api.service';
import {CompanyApiService} from '../../../../../core/services/company-api.service';


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

  templateUrl:
    './sales-invoice.component.html',

  styleUrls: [
    './sales-invoice.component.scss'
  ]
})
export class SalesInvoiceComponent {


  selectedFile:
    File | null = null;


  imagePreview:
    string | null = null;


  fileName =
    '';


  analyzing =
    false;


  analysisCompleted =
    false;


  saleSaved =
    false;


  saving =
    false;


  showErrors =
    false;


  globalError =
    '';


  extractedSale:
    ExtractedSale = {

      saleDate:
        '',

      customerName:
        '',

      productName:
        '',

      quantity:
        1,

      unitPrice:
        0,

      paymentMethod:
        '',

      notes:
        ''

    };


  constructor(

    private router:
      Router,

    private salesApi:
      SalesApiService,

    private companyApi:
      CompanyApiService

  ) {}


  /* ==========================
     TOTAL
  ========================== */

  get total(): number {


    return (

      Number(
        this.extractedSale.quantity
        || 0
      )

      *

      Number(
        this.extractedSale.unitPrice
        || 0
      )

    );

  }


/* ==========================
   SELECT IMAGE
========================== */

  onFileSelected(
    event: Event
  ): void {

    const input =
      event.target;


    if (
      !(input instanceof HTMLInputElement) ||
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


    if (
      !validTypes.includes(
        file.type
      )
    ) {

      this.globalError =
        'Selecciona una imagen válida: JPG, PNG o WEBP.';

      return;

    }


    const maxSize =
      8 * 1024 * 1024;


    if (
      file.size > maxSize
    ) {

      this.globalError =
        'La imagen no puede superar los 8 MB.';

      return;

    }


    this.selectedFile =
      file;


    this.fileName =
      file.name;


    const reader =
      new FileReader();


    reader.onload = () => {

      const result =
        reader.result;


      if (
        typeof result === 'string'
      ) {

        this.imagePreview =
          result;

      }

    };


    reader.onerror = () => {

      this.globalError =
        'No fue posible leer la imagen.';

    };


    reader.readAsDataURL(
      file
    );

  }


  /* ==========================
     ANALYZE
  ========================== */

  analyzeInvoice(): void {


    if (
      !this.selectedFile
    ) {

      return;

    }


    this.analyzing =
      true;


    this.globalError =
      '';


    /*
     * TEMPORAL:
     *
     * En esta fase simulamos
     * la extracción.
     *
     * Posteriormente esta parte
     * será reemplazada por el
     * microservicio OCR / IA.
     */

    setTimeout(
      () => {


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


        this.analyzing =
          false;


        this.analysisCompleted =
          true;

      },

      1400

    );

  }


  /* ==========================
     VALIDATION
  ========================== */

  private isValid():
    boolean {


    return !!(

      this.extractedSale.saleDate &&

      this.extractedSale.productName
        ?.trim() &&

      Number(
        this.extractedSale.quantity
      ) > 0 &&

      Number(
        this.extractedSale.unitPrice
      ) > 0 &&

      this.extractedSale.paymentMethod

    );

  }


  /* ==========================
     SAVE SALE
  ========================== */

  saveSale(): void {


    this.showErrors =
      true;


    this.globalError =
      '';


    if (
      !this.isValid()
    ) {

      return;

    }


    this.saving =
      true;


    /*
     * Obtenemos la empresa real
     * asociada al usuario Firebase.
     */

    this.companyApi
      .getMyCompany()
      .subscribe({


        next:
          company => {


            if (
              !company?.id
            ) {


              this.globalError =
                'No se encontró una empresa configurada.';


              this.saving =
                false;


              return;

            }


            /*
             * La factura actualmente
             * trabaja con texto extraído,
             * por eso customerId y
             * productId quedan null.
             *
             * Cuando Products y Clients
             * estén completamente en backend
             * podremos hacer asociación real.
             */

            const request:
              SaleRequest = {


              companyId:
                company.id,


              saleDate:
                this.extractedSale
                  .saleDate,


              customerId:
                null,


              customerName:

                this.extractedSale
                  .customerName
                  ?.trim()

                  || null,


              productId:
                null,


              productName:

                this.extractedSale
                  .productName
                  .trim(),


              quantity:

                Number(
                  this.extractedSale
                    .quantity
                ),


              unitPrice:

                Number(
                  this.extractedSale
                    .unitPrice
                ),


              paymentMethod:
                this.extractedSale
                  .paymentMethod,


              source:
                'INVOICE',


              notes:

                this.extractedSale
                  .notes
                  ?.trim()

                  || null

            };


            this.salesApi
              .createSale(
                request
              )
              .subscribe({


                next:
                  response => {


                    console.log(
                      'Venta desde factura guardada:',
                      response
                    );


                    this.showErrors =
                      false;


                    this.saving =
                      false;


                    this.saleSaved =
                      true;

                  },


                error:
                  error => {


                    console.error(
                      'Error guardando venta desde factura:',
                      error
                    );


                    this.globalError =
                      'No fue posible guardar la venta. Intenta nuevamente.';


                    this.saving =
                      false;

                  }

              });

          },


        error:
          error => {


            console.error(
              'Error obteniendo empresa:',
              error
            );


            this.globalError =
              'No se encontró una empresa configurada para este usuario.';


            this.saving =
              false;

          }

      });

  }


  /* ==========================
     RESET
  ========================== */

  resetAnalysis(): void {


    this.analysisCompleted =
      false;


    this.saleSaved =
      false;


    this.analyzing =
      false;


    this.saving =
      false;


    this.showErrors =
      false;


    this.globalError =
      '';


    this.imagePreview =
      null;


    this.selectedFile =
      null;


    this.fileName =
      '';


    this.extractedSale = {


      saleDate:
        '',


      customerName:
        '',


      productName:
        '',


      quantity:
        1,


      unitPrice:
        0,


      paymentMethod:
        '',


      notes:
        ''

    };

  }


  /* ==========================
     NAVIGATION
  ========================== */

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