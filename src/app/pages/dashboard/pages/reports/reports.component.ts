import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import {
  SalesApiService
} from '../../../../core/services/sales-api.service';

import {
  ProductsApiService,
  ApiProduct
} from '../../../../core/services/products-api.service';

import {
  ClientsApiService,
  ApiClient
} from '../../../../core/services/clients-api.service';


interface Sale {
  id: string;
  saleDate: string;

  customerId?: string | null;
  customerName: string;

  productId?: string;
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

  createdAt?: string;
}


interface Product {
  id: string;
  name: string;
  category: string;

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

  status:
    | 'active'
    | 'inactive';
}


interface Campaign {
  id: string;
  name: string;

  objective: string;
  audience: string;
  channel: string;

  source:
    | 'manual'
    | 'marketing-ai';

  status:
    | 'draft'
    | 'active'
    | 'completed';

  createdAt: string;
}


interface ProductReport {
  id?: string;
  name: string;
  units: number;
  revenue: number;
}


interface ClientReport {
  id: string;
  name: string;
  purchases: number;
  total: number;
}


@Component({
  selector: 'app-reports',
  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl: './reports.component.html',
  styleUrls: ['./reports.component.scss']
})
export class ReportsComponent implements OnInit {


  sales: Sale[] = [];

  products: Product[] = [];

  clients: Client[] = [];

  campaigns: Campaign[] = [];


  period =
    'all';


  customStartDate =
    '';


  customEndDate =
    '';


  selectedReport =
    'executive';


  exportMessage =
    '';


  loading =
    false;


  globalError =
    '';


  isDemoMode =
    false;


  constructor(

    private router:
      Router,

    private salesApi:
      SalesApiService,

    private productsApi:
      ProductsApiService,

    private clientsApi:
      ClientsApiService

  ) {}


  ngOnInit(): void {

    this.isDemoMode =
      this.router.url.startsWith(
        '/demo'
      );


    this.loadData();

  }


  /* ============================
     LOAD
  ============================ */

  private loadData(): void {


    if (
      this.isDemoMode
    ) {

      this.loadDemoData();

      return;

    }


    this.loading =
      true;


    this.globalError =
      '';


    this.loadSales();

    this.loadProducts();

    this.loadClients();

    this.loadCampaigns();

  }


  /* ============================
     DEMO
  ============================ */

  private loadDemoData(): void {


    this.sales =
      JSON.parse(
        localStorage.getItem(
          'wisepick_sales'
        ) || '[]'
      );


    this.products =
      JSON.parse(
        localStorage.getItem(
          'wisepick_products'
        ) || '[]'
      );


    this.clients =
      JSON.parse(
        localStorage.getItem(
          'wisepick_clients'
        ) || '[]'
      );


    this.campaigns =
      JSON.parse(
        localStorage.getItem(
          'wisepick_campaigns'
        ) || '[]'
      );

  }


  /* ============================
     SALES API
  ============================ */

  private loadSales(): void {


    this.salesApi
      .getSales()
      .subscribe({


        next:
          sales => {


            this.sales =
              sales.map(
                sale =>
                  this.mapApiSale(
                    sale
                  )
              );


            this.loading =
              false;

          },


        error:
          error => {


            console.error(
              'Error cargando ventas en Reportes:',
              error
            );


            this.globalError =
              'No fue posible cargar las ventas.';


            this.loading =
              false;

          }

      });

  }


  private mapApiSale(
    sale: any
  ): Sale {


    return {

      id:
        sale.id,

      saleDate:
        sale.saleDate,

      customerId:
        sale.customerId || null,

      customerName:
        sale.customerName || '',

      productId:
        sale.productId || undefined,

      productName:
        sale.productName || '',

      quantity:
        Number(
          sale.quantity || 0
        ),

      unitPrice:
        Number(
          sale.unitPrice || 0
        ),

      total:
        Number(
          sale.total || 0
        ),

      paymentMethod:
        sale.paymentMethod || 'Otro',

      source:
        this.normalizeSource(
          sale.source
        ),

      createdAt:
        sale.createdAt || ''

    };

  }


  /* ============================
     PRODUCTS API
  ============================ */

  private loadProducts(): void {


    this.productsApi
      .getProducts()
      .subscribe({


        next:
          products => {


            this.products =
              products.map(
                product =>
                  this.mapApiProduct(
                    product
                  )
              );

          },


        error:
          error => {


            console.error(
              'Error cargando productos en Reportes:',
              error
            );


            this.globalError =
              'No fue posible cargar los productos.';

          }

      });

  }


  private mapApiProduct(
    product: ApiProduct
  ): Product {


    return {

      id:
        product.id,

      name:
        product.name,

      category:
        product.category || '',

      cost:
        Number(
          product.cost || 0
        ),

      price:
        Number(
          product.price || 0
        ),

      stock:
        Number(
          product.stock || 0
        ),

      status:
        product.status === 'ACTIVE'
          ? 'active'
          : 'inactive'

    };

  }


  /* ============================
     CLIENTS API
  ============================ */

  private loadClients(): void {


    this.clientsApi
      .getClients()
      .subscribe({


        next:
          clients => {


            this.clients =
              clients.map(
                client =>
                  this.mapApiClient(
                    client
                  )
              );

          },


        error:
          error => {


            console.error(
              'Error cargando clientes en Reportes:',
              error
            );


            this.globalError =
              'No fue posible cargar los clientes.';

          }

      });

  }


  private mapApiClient(
    client: ApiClient
  ): Client {


    return {

      id:
        client.id,

      name:
        client.name,

      status:
        client.status === 'ACTIVE'
          ? 'active'
          : 'inactive'

    };

  }


  /* ============================
     CAMPAIGNS
  ============================ */

  private loadCampaigns(): void {


    this.campaigns =
      JSON.parse(
        localStorage.getItem(
          'wisepick_campaigns'
        ) || '[]'
      );

  }


  /* ============================
     SOURCE NORMALIZATION
  ============================ */

  private normalizeSource(
    source: string
  ): Sale['source'] {


    switch (
      source?.toUpperCase()
    ) {


      case 'MANUAL':
        return 'manual';


      case 'EXCEL':
        return 'excel';


      case 'INVOICE':
        return 'invoice';


      case 'DEMO':
        return 'demo';


      default:
        return 'manual';

    }

  }


  /* ============================
     FILTERED SALES
  ============================ */

  get filteredSales(): Sale[] {

    if (
      this.period === 'all'
    ) {

      return this.sales;

    }


    const today =
      new Date();


    let startDate:
      Date | null = null;


    let endDate:
      Date = new Date();


    switch (
      this.period
    ) {


      case '7days':

        startDate =
          new Date();

        startDate.setDate(
          today.getDate() - 7
        );

        break;


      case '30days':

        startDate =
          new Date();

        startDate.setDate(
          today.getDate() - 30
        );

        break;


      case 'month':

        startDate =
          new Date(
            today.getFullYear(),
            today.getMonth(),
            1
          );

        break;


      case 'custom':

        if (
          !this.customStartDate ||
          !this.customEndDate
        ) {

          return this.sales;

        }


        startDate =
          new Date(
            this.customStartDate
          );


        endDate =
          new Date(
            this.customEndDate
          );


        endDate.setHours(
          23,
          59,
          59,
          999
        );

        break;

    }


    if (!startDate) {

      return this.sales;

    }


    return this.sales.filter(
      sale => {

        const saleDate =
          new Date(
            sale.saleDate
          );


        return (
          saleDate >= startDate! &&
          saleDate <= endDate
        );

      }
    );

  }


  /* ============================
     SALES KPIs
  ============================ */

  get totalRevenue(): number {

    return this.filteredSales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.total
        ),
      0
    );

  }


  get totalTransactions(): number {

    return this.filteredSales.length;

  }


  get totalUnits(): number {

    return this.filteredSales.reduce(
      (sum, sale) =>
        sum +
        Number(
          sale.quantity
        ),
      0
    );

  }


  get averageTicket(): number {

    if (
      !this.totalTransactions
    ) {

      return 0;

    }


    return (
      this.totalRevenue /
      this.totalTransactions
    );

  }


  /* ============================
     PROFIT
  ============================ */

  get estimatedGrossProfit(): number {

    return this.filteredSales.reduce(
      (sum, sale) => {

        if (!sale.productId) {

          return sum;

        }


        const product =
          this.products.find(
            item =>
              item.id ===
              sale.productId
          );


        if (!product) {

          return sum;

        }


        const profit =
          (
            Number(
              sale.unitPrice
            ) -
            Number(
              product.cost
            )
          ) *
          Number(
            sale.quantity
          );


        return (
          sum +
          profit
        );

      },
      0
    );

  }


  get estimatedMargin(): number {

    if (!this.totalRevenue) {

      return 0;

    }


    return (
      this.estimatedGrossProfit /
      this.totalRevenue
    ) * 100;

  }


  /* ============================
     PRODUCTS
  ============================ */

  get productRanking():
    ProductReport[] {


    const map =
      new Map<
        string,
        ProductReport
      >();


    this.filteredSales.forEach(
      sale => {


        const key =
          sale.productId ||
          sale.productName;


        const existing =
          map.get(key);


        if (existing) {


          existing.units +=
            Number(
              sale.quantity
            );


          existing.revenue +=
            Number(
              sale.total
            );

        }


        else {


          map.set(
            key,
            {

              id:
                sale.productId,

              name:
                sale.productName,

              units:
                Number(
                  sale.quantity
                ),

              revenue:
                Number(
                  sale.total
                )

            }
          );

        }

      }
    );


    return Array
      .from(
        map.values()
      )
      .sort(
        (a, b) =>
          b.units -
          a.units
      );

  }


  get topProducts():
    ProductReport[] {

    return this.productRanking
      .slice(
        0,
        5
      );

  }


  /* ============================
     CLIENTS
  ============================ */

  get identifiedSales(): number {

    return this.filteredSales
      .filter(
        sale =>
          !!sale.customerId
      )
      .length;

  }


  get identifiedSalesPercentage():
    number {


    if (
      !this.totalTransactions
    ) {

      return 0;

    }


    return (
      this.identifiedSales /
      this.totalTransactions
    ) * 100;

  }


  get clientRanking():
    ClientReport[] {


    const map =
      new Map<
        string,
        ClientReport
      >();


    this.filteredSales
      .filter(
        sale =>
          !!sale.customerId
      )
      .forEach(
        sale => {


          const id =
            sale.customerId as string;


          const existing =
            map.get(id);


          if (existing) {


            existing.purchases++;


            existing.total +=
              Number(
                sale.total
              );

          }


          else {


            map.set(
              id,
              {

                id,

                name:
                  sale.customerName,

                purchases:
                  1,

                total:
                  Number(
                    sale.total
                  )

              }
            );

          }

        }
      );


    return Array
      .from(
        map.values()
      )
      .sort(
        (a, b) =>
          b.total -
          a.total
      );

  }


  get recurringClients(): number {

    return this.clientRanking
      .filter(
        client =>
          client.purchases >= 2
      )
      .length;

  }


  /* ============================
     INVENTORY
  ============================ */

  get lowStockProducts():
    Product[] {

    return this.products
      .filter(
        product =>
          product.status ===
            'active'
          &&
          product.stock <= 5
      );

  }


  /* ============================
     CAMPAIGNS
  ============================ */

  get activeCampaigns(): number {

    return this.campaigns
      .filter(
        campaign =>
          campaign.status ===
          'active'
      )
      .length;

  }


  get completedCampaigns(): number {

    return this.campaigns
      .filter(
        campaign =>
          campaign.status ===
          'completed'
      )
      .length;

  }


  get aiCampaigns(): number {

    return this.campaigns
      .filter(
        campaign =>
          campaign.source ===
          'marketing-ai'
      )
      .length;

  }


  /* ============================
     FINDINGS
  ============================ */

  get businessFindings():
    string[] {


    const findings:
      string[] = [];


    const bestProduct =
      this.topProducts[0];


    if (bestProduct) {

      findings.push(
        `${bestProduct.name} es el producto con mayor número de unidades vendidas durante el período seleccionado.`
      );

    }


    if (
      this.recurringClients > 0
    ) {

      findings.push(
        `Se identificaron ${this.recurringClients} cliente(s) recurrentes con dos o más compras.`
      );

    }


    if (
      this.identifiedSalesPercentage <
      60 &&
      this.totalTransactions > 0
    ) {

      findings.push(
        `Solo el ${this.identifiedSalesPercentage.toFixed(0)}% de las ventas tienen un cliente identificado.`
      );

    }


    if (
      this.lowStockProducts.length > 0
    ) {

      findings.push(
        `${this.lowStockProducts.length} producto(s) presentan stock igual o inferior a 5 unidades.`
      );

    }


    if (
      this.estimatedMargin > 0
    ) {

      findings.push(
        `El margen bruto estimado del período es ${this.estimatedMargin.toFixed(1)}%.`
      );

    }


    return findings;

  }


  /* ============================
     REPORT SELECTION
  ============================ */

  selectReport(
    report: string
  ): void {

    this.selectedReport =
      report;

  }


  /* ============================
     EXPORT
  ============================ */

  exportReport(): void {

    this.exportMessage =
      'La exportación PDF quedará disponible al integrar el servicio de reportes del backend.';


    setTimeout(
      () => {

        this.exportMessage =
          '';

      },
      3500
    );

  }

}