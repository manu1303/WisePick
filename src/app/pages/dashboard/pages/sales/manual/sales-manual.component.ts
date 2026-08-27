import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  FormsModule
} from '@angular/forms';

import {
  ActivatedRoute,
  Router
} from '@angular/router';

import {
  SalesApiService,
  SaleRequest
} from '../../../../../core/services/sales-api.service';

import {
  CompanyApiService
} from '../../../../../core/services/company-api.service';


interface Product {

  id: string;

  name: string;

  category: string;

  sku: string;

  cost: number;

  price: number;

  stock: number;

  status:
    | 'active'
    | 'inactive';

}


interface Client {

  id: string;

  name: string;

  phone: string;

  email: string;

  city: string;

  status:
    | 'active'
    | 'inactive';

}


interface SaleForm {

  saleDate: string;

  customerId: string;

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

  templateUrl:
    './sales-manual.component.html',

  styleUrls: [
    './sales-manual.component.scss'
  ]
})
export class SalesManualComponent
  implements OnInit {


  products:
    Product[] = [];


  clients:
    Client[] = [];


  showErrors =
    false;


  saleSaved =
    false;


  saving =
    false;


  loadingSale =
    false;


  globalError =
    '';


  /* ==========================
     EDIT MODE
  ========================== */

  isEditMode =
    false;


  editingSaleId:
    string | null = null;


  /* ==========================
     FORM
  ========================== */

  sale:
    SaleForm = {

      saleDate:
        this.getToday(),

      customerId:
        '',

      customerName:
        '',

      productId:
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

    private route:
      ActivatedRoute,

    private router:
      Router,

    private salesApi:
      SalesApiService,

    private companyApi:
      CompanyApiService

  ) {}


  ngOnInit(): void {

    this.loadProducts();

    this.loadClients();


    const id =
      this.route.snapshot
        .paramMap
        .get('id');


    if (id) {

      this.isEditMode =
        true;

      this.editingSaleId =
        id;

      this.loadSaleForEdit(
        id
      );

    }

  }


  /* ==========================
     PRODUCTS
  ========================== */

  private loadProducts(): void {


    const storedProducts =
      JSON.parse(
        localStorage.getItem(
          'wisepick_products'
        ) || '[]'
      );


    this.products =
      storedProducts.filter(
        (product: Product) =>
          product.status ===
          'active'
      );

  }


  /* ==========================
     CLIENTS
  ========================== */

  private loadClients(): void {


    const storedClients =
      JSON.parse(
        localStorage.getItem(
          'wisepick_clients'
        ) || '[]'
      );


    this.clients =
      storedClients.filter(
        (client: Client) =>
          client.status ===
          'active'
      );

  }


  /* ==========================
     LOAD SALE FOR EDIT
  ========================== */

  private loadSaleForEdit(
    id: string
  ): void {


    this.loadingSale =
      true;


    this.globalError =
      '';


    this.salesApi
      .getSaleById(
        id
      )
      .subscribe({


        next:
          sale => {


            this.sale = {

              saleDate:
                sale.saleDate,

              customerId:
                sale.customerId
                  || '',

              customerName:
                sale.customerName
                  || '',

              productId:
                sale.productId
                  || '',

              productName:
                sale.productName,

              quantity:
                Number(
                  sale.quantity
                ),

              unitPrice:
                Number(
                  sale.unitPrice
                ),

              paymentMethod:
                sale.paymentMethod
                  || '',

              notes:
                sale.notes
                  || ''

            };


            this.loadingSale =
              false;

          },


        error:
          error => {


            console.error(
              'Error cargando venta:',
              error
            );


            this.globalError =
              'No fue posible cargar la venta.';


            this.loadingSale =
              false;

          }

      });

  }


  /* ==========================
     PRODUCT SELECTED
  ========================== */

  onProductSelected(): void {


    const product =
      this.products.find(
        item =>
          item.id ===
          this.sale.productId
      );


    if (!product) {


      this.sale.productName =
        '';


      this.sale.unitPrice =
        0;


      return;

    }


    this.sale.productName =
      product.name;


    this.sale.unitPrice =
      product.price;

  }


  /* ==========================
     CLIENT SELECTED
  ========================== */

  onClientSelected(): void {


    if (
      !this.sale.customerId
    ) {


      this.sale.customerName =
        '';


      return;

    }


    const client =
      this.clients.find(
        item =>
          item.id ===
          this.sale.customerId
      );


    if (!client) {


      this.sale.customerName =
        '';


      return;

    }


    this.sale.customerName =
      client.name;

  }


  /* ==========================
     TOTAL
  ========================== */

  get total(): number {


    return (

      Number(
        this.sale.quantity
      )

      *

      Number(
        this.sale.unitPrice
      )

    );

  }


  /* ==========================
     TODAY
  ========================== */

  private getToday():
    string {


    const today =
      new Date();


    return today
      .toISOString()
      .split('T')[0];

  }


  /* ==========================
     SAVE / UPDATE
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
     * Obtenemos la empresa
     * asociada al usuario.
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
             * Request común para
             * creación y edición.
             */

            const request:
              SaleRequest = {


              companyId:
                company.id,


              saleDate:
                this.sale.saleDate,


              customerId:
                this.sale.customerId
                  || null,


              customerName:
                this.sale.customerName
                  || null,


              productId:
                this.sale.productId
                  || null,


              productName:
                this.sale.productName,


              quantity:
                Number(
                  this.sale.quantity
                ),


              unitPrice:
                Number(
                  this.sale.unitPrice
                ),


              paymentMethod:
                this.sale.paymentMethod,


              source:
                'MANUAL',


              notes:
                this.sale.notes
                  ?.trim()
                  || null

            };


            /*
             * CREATE o UPDATE
             */

            const operation =

              this.isEditMode &&
              this.editingSaleId

                ? this.salesApi
                    .updateSale(
                      this.editingSaleId,
                      request
                    )

                : this.salesApi
                    .createSale(
                      request
                    );


            operation
              .subscribe({


                next:
                  response => {


                    console.log(

                      this.isEditMode
                        ? 'Venta actualizada:'
                        : 'Venta guardada:',

                      response

                    );


                    this.saleSaved =
                      true;


                    this.saving =
                      false;


                    this.showErrors =
                      false;

                  },


                error:
                  error => {


                    console.error(

                      this.isEditMode
                        ? 'Error actualizando venta:'
                        : 'Error guardando venta:',

                      error

                    );


                    this.globalError =

                      this.isEditMode

                        ? 'No fue posible actualizar la venta.'

                        : 'No fue posible guardar la venta. Intenta nuevamente.';


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
     VALIDATION
  ========================== */

  private isValid():
    boolean {


    return !!(

      this.sale.saleDate &&

      this.sale.productId &&

      this.sale.productName &&

      Number(
        this.sale.quantity
      ) > 0 &&

      Number(
        this.sale.unitPrice
      ) > 0 &&

      this.sale.paymentMethod

    );

  }


  /* ==========================
     NEW SALE
  ========================== */

  newSale(): void {


    /*
     * Si venimos de editar,
     * abrimos una venta nueva.
     */

    if (
      this.isEditMode
    ) {


      this.router.navigate([
        '/dashboard/sales/manual'
      ]);


      return;

    }


    this.sale = {

      saleDate:
        this.getToday(),

      customerId:
        '',

      customerName:
        '',

      productId:
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


    this.saleSaved =
      false;


    this.showErrors =
      false;


    this.saving =
      false;


    this.globalError =
      '';

  }


  /* ==========================
     NAVIGATION
  ========================== */

  goToSales(): void {


    this.router.navigate([
      '/dashboard/sales'
    ]);

  }


  goBack(): void {


    if (
      this.isEditMode
    ) {


      this.router.navigate([
        '/dashboard/sales'
      ]);


      return;

    }


    this.router.navigate([
      '/dashboard/sales/import'
    ]);

  }

}