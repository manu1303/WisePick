import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {Router} from '@angular/router';
import {FormsModule} from '@angular/forms';
import {SalesApiService,Sale as ApiSale} from '../../../../core/services/sales-api.service';


interface Sale {

  id: string;

  saleDate: string;

  customerName: string;

  productName: string;

  quantity: number;

  unitPrice: number;

  total: number;

  paymentMethod: string;

  source:
    | 'manual'
    | 'excel'
    | 'invoice'
    | 'demo';

  createdAt: string;

  
}


@Component({
  selector: 'app-sales',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './sales.component.html',

  styleUrls: [
    './sales.component.scss'
  ]
})
export class SalesComponent
  implements OnInit {


  sales:
    Sale[] = [];


  searchTerm = '';


  sourceFilter =
    'all';


  paymentFilter =
    'all';

  openSaleMenuId: string | null = null;  


  loading =
    false;


  errorMessage =
    '';


  constructor(

    private router:
      Router,

    private salesApi:
      SalesApiService

  ) {}


  ngOnInit(): void {

    this.loadSales();

  }


  /* ==========================
     LOAD SALES
  ========================== */

  loadSales(): void {


    this.loading =
      true;


    this.errorMessage =
      '';


    this.salesApi
      .getSales()
      .subscribe({


        next:
          response => {


            this.sales =
              response
                .map(
                  sale =>
                    this.mapApiSale(
                      sale
                    )
                )
                .sort(
                  (
                    a,
                    b
                  ) =>

                    new Date(
                      b.createdAt
                    ).getTime()

                    -

                    new Date(
                      a.createdAt
                    ).getTime()
                );


            this.loading =
              false;

          },


        error:
          error => {


            console.error(
              'Error cargando ventas:',
              error
            );


            this.errorMessage =
              'No fue posible cargar las ventas.';


            this.sales =
              [];


            this.loading =
              false;

          }

      });

  }


  /* ==========================
     API MAPPING
  ========================== */

  private mapApiSale(
    sale: ApiSale
  ): Sale {


    return {

      id:
        sale.id,

      saleDate:
        sale.saleDate,

      customerName:
        sale.customerName
          ?.trim()
          ||
          'Cliente no identificado',

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

      total:
        Number(
          sale.total
        ),

      paymentMethod:
        sale.paymentMethod
          ?.trim()
          ||
          'Otro',

      source:
        this.normalizeSource(
          sale.source
        ),

      createdAt:
        sale.createdAt

    };

  }


  /* ==========================
     SOURCE NORMALIZATION
  ========================== */

  private normalizeSource(
    source:
      string |
      null |
      undefined
  ):
    Sale['source'] {


    const normalized =
      String(
        source || ''
      )
        .trim()
        .toLowerCase();


    switch (
      normalized
    ) {


      case 'manual':

        return 'manual';


      case 'excel':

        return 'excel';


      case 'invoice':

        return 'invoice';


      case 'foto':

        return 'invoice';


      case 'factura':

        return 'invoice';


      case 'foto / factura':

        return 'invoice';


      case 'demo':

        return 'demo';


      default:

        return 'manual';

    }

  }


  /* ==========================
     KPIS
  ========================== */

  get totalSales():
    number {


    return this.sales
      .reduce(

        (
          sum,
          sale
        ) =>
          sum +
          Number(
            sale.total
          ),

        0

      );

  }


  get totalTransactions():
    number {


    return this.sales
      .length;

  }


  get totalProducts():
    number {


    return this.sales
      .reduce(

        (
          sum,
          sale
        ) =>

          sum +
          Number(
            sale.quantity
          ),

        0

      );

  }


  get averageTicket():
    number {


    if (
      this.totalTransactions ===
      0
    ) {

      return 0;

    }


    return (

      this.totalSales
      /
      this.totalTransactions

    );

  }


  get identifiedCustomers():
    number {


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


    return new Set(
      customers
    ).size;

  }


  /* ==========================
     FILTERS
  ========================== */

  get filteredSales():
    Sale[] {


    const term =
      this.searchTerm
        .toLowerCase()
        .trim();


    return this.sales
      .filter(
        sale => {


          const matchesSearch =
            !term ||

            sale.productName
              .toLowerCase()
              .includes(
                term
              )

            ||

            sale.customerName
              .toLowerCase()
              .includes(
                term
              )

            ||

            sale.paymentMethod
              .toLowerCase()
              .includes(
                term
              );


          const matchesSource =

            this.sourceFilter ===
              'all'

            ||

            sale.source ===
              this.sourceFilter;


          const matchesPayment =

            this.paymentFilter ===
              'all'

            ||

            sale.paymentMethod ===
              this.paymentFilter;


          return (

            matchesSearch &&

            matchesSource &&

            matchesPayment

          );

        }
      );

  }


  get filteredTotal():
    number {


    return this.filteredSales
      .reduce(

        (
          sum,
          sale
        ) =>

          sum +
          Number(
            sale.total
          ),

        0

      );

  }


  /* ==========================
     NAVIGATION
  ========================== */

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


    this.searchTerm =
      '';


    this.sourceFilter =
      'all';


    this.paymentFilter =
      'all';

  }

  /* ==========================
     EDIT SALE
  ========================== */

  toggleSaleMenu(
    id: string
  ): void {

    this.openSaleMenuId =
      this.openSaleMenuId === id
        ? null
        : id;
  }


  editSale(
    id: string
  ): void {

    this.openSaleMenuId = null;

    this.router.navigate([
      '/dashboard/sales/edit',
      id
    ]);
  }


  /* ==========================
     DELETE
  ========================== */



  deleteSale(
    id: string
  ): void {

    this.openSaleMenuId = null;


    const confirmed =
      window.confirm(
        '¿Seguro que deseas eliminar esta venta?'
      );


    if (!confirmed) {

      return;

    }


    this.salesApi
      .deleteSale(
        id
      )
      .subscribe({


        next: () => {


          /*
           * Volvemos a consultar
           * PostgreSQL.
           */

          this.loadSales();

        },


        error:
          error => {


            console.error(
              'Error eliminando venta:',
              error
            );


            this.errorMessage =
              'No fue posible eliminar la venta.';

          }

      });

  }


  /* ==========================
     SOURCE LABEL
  ========================== */

  getSourceLabel(
    source:
      Sale['source']
  ): string {


    switch (
      source
    ) {


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


  /* ==========================
     AI
  ========================== */

  analyzeWithAI(): void {


    this.router.navigate([
      '/dashboard/marketing-ia'
    ]);

  }

}