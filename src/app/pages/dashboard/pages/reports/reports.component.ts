import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


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


  ngOnInit(): void {

    this.loadData();

  }


  /* ============================
     LOAD
  ============================ */

  private loadData(): void {

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
            'active' &&
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

    /*
      TEMPORAL.

      Más adelante conectaremos
      un servicio real de PDF.
    */

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