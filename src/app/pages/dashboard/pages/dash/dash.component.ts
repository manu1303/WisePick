import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';


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

  createdAt: string;
}


interface Product {
  id: string;
  name: string;
  category: string;
  stock: number;
  cost: number;
  price: number;
  status: 'active' | 'inactive';
}


interface Client {
  id: string;
  name: string;
  status: 'active' | 'inactive';
}


interface ProductRanking {
  productId?: string;
  productName: string;
  quantity: number;
  revenue: number;
}


interface DailySale {
  date: string;
  total: number;
  transactions: number;
}


interface DistributionItem {
  label: string;
  value: number;
  percentage: number;
}


@Component({
  selector: 'app-dash',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './dash.component.html',
  styleUrls: ['./dash.component.scss']
})
export class DashComponent implements OnInit {

  sales: Sale[] = [];

  products: Product[] = [];

  clients: Client[] = [];


  constructor(
    private router: Router
  ) {}


  ngOnInit(): void {

    this.loadData();

  }


  /* ============================
     LOAD DATA
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

  }


  /* ============================
     MAIN KPIs
  ============================ */

  get totalRevenue(): number {

    return this.sales.reduce(

      (sum, sale) =>
        sum + Number(sale.total),

      0
    );

  }


  get totalTransactions(): number {

    return this.sales.length;

  }


  get averageTicket(): number {

    if (!this.totalTransactions) {

      return 0;

    }


    return (
      this.totalRevenue /
      this.totalTransactions
    );

  }


  get totalUnits(): number {

    return this.sales.reduce(

      (sum, sale) =>
        sum + Number(sale.quantity),

      0
    );

  }


  get identifiedCustomers(): number {

    const ids =
      this.sales

        .filter(
          sale =>
            !!sale.customerId
        )

        .map(
          sale =>
            sale.customerId as string
        );


    return new Set(ids).size;

  }


  get anonymousSales(): number {

    return this.sales.filter(

      sale =>
        !sale.customerId

    ).length;

  }


  /* ============================
     PRODUCT RANKING
  ============================ */

  get productRanking(): ProductRanking[] {

    const map =
      new Map<
        string,
        ProductRanking
      >();


    this.sales.forEach(
      sale => {

        const key =
          sale.productId ||
          sale.productName;


        const existing =
          map.get(key);


        if (existing) {

          existing.quantity +=
            Number(sale.quantity);

          existing.revenue +=
            Number(sale.total);

        }

        else {

          map.set(
            key,
            {

              productId:
                sale.productId,

              productName:
                sale.productName,

              quantity:
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
      .from(map.values())
      .sort(
        (a, b) =>
          b.quantity -
          a.quantity
      );

  }


  get topProducts(): ProductRanking[] {

    return this.productRanking
      .slice(0, 5);

  }


  get bestProduct():
    ProductRanking | null {

    return (
      this.productRanking[0] ||
      null
    );

  }


  /* ============================
     DAILY SALES
  ============================ */

  get dailySales(): DailySale[] {

    const map =
      new Map<
        string,
        DailySale
      >();


    this.sales.forEach(
      sale => {

        const existing =
          map.get(
            sale.saleDate
          );


        if (existing) {

          existing.total +=
            Number(sale.total);

          existing.transactions++;

        }

        else {

          map.set(
            sale.saleDate,
            {

              date:
                sale.saleDate,

              total:
                Number(
                  sale.total
                ),

              transactions:
                1

            }
          );

        }

      }
    );


    return Array
      .from(map.values())
      .sort(
        (a, b) =>
          new Date(a.date).getTime() -
          new Date(b.date).getTime()
      );

  }


  get maxDailyRevenue(): number {

    const totals =
      this.dailySales.map(
        day =>
          day.total
      );


    return totals.length
      ? Math.max(...totals)
      : 0;

  }


  getBarHeight(
    value: number
  ): number {

    if (
      !this.maxDailyRevenue
    ) {

      return 0;

    }


    return (
      value /
      this.maxDailyRevenue
    ) * 100;

  }


  /* ============================
     PAYMENT DISTRIBUTION
  ============================ */

  get paymentDistribution():
    DistributionItem[] {

    return this.buildDistribution(

      this.sales.map(
        sale =>
          sale.paymentMethod ||
          'Otro'
      )

    );

  }


  /* ============================
     SOURCE DISTRIBUTION
  ============================ */

  get sourceDistribution():
    DistributionItem[] {

    return this.buildDistribution(

      this.sales.map(
        sale =>
          this.getSourceLabel(
            sale.source
          )
      )

    );

  }


  private buildDistribution(
    values: string[]
  ): DistributionItem[] {

    const map =
      new Map<string, number>();


    values.forEach(
      value => {

        map.set(
          value,
          (
            map.get(value) ||
            0
          ) + 1
        );

      }
    );


    const total =
      values.length;


    return Array
      .from(
        map.entries()
      )
      .map(
        ([label, value]) => ({

          label,

          value,

          percentage:
            total
              ? (
                  value /
                  total
                ) * 100
              : 0

        })
      )
      .sort(
        (a, b) =>
          b.value -
          a.value
      );

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
      )
      .sort(
        (a, b) =>
          a.stock -
          b.stock
      );

  }


  /* ============================
     DATA QUALITY
  ============================ */

  get identifiedSalesPercentage():
    number {

    if (
      !this.totalTransactions
    ) {

      return 0;

    }


    const identified =
      this.sales.filter(
        sale =>
          !!sale.customerId
      ).length;


    return (
      identified /
      this.totalTransactions
    ) * 100;

  }


  /* ============================
     LABELS
  ============================ */

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


  /* ============================
     NAVIGATION
  ============================ */

  goToSales(): void {

    this.router.navigate([
      '/dashboard/sales'
    ]);

  }


  goToProducts(): void {

    this.router.navigate([
      '/dashboard/products'
    ]);

  }


  goToClients(): void {

    this.router.navigate([
      '/dashboard/clients'
    ]);

  }


  goToAI(): void {

    this.router.navigate([
      '/dashboard/marketing-ia'
    ]);

  }

  /* ============================
   PROFIT / MARGIN
  ============================ */

  get estimatedGrossProfit(): number {

    return this.sales.reduce(
      (sum, sale) => {

        if (!sale.productId) {
          return sum;
        }

        const product =
          this.products.find(
            item =>
              item.id === sale.productId
          );

        if (!product) {
          return sum;
        }

        const profitPerUnit =
          Number(sale.unitPrice) -
          Number(product.cost);

        return (
          sum +
          (
            profitPerUnit *
            Number(sale.quantity)
          )
        );
      },
      0
    );
  }


  get estimatedMarginPercentage(): number {

    if (!this.totalRevenue) {
      return 0;
    }

    return (
      this.estimatedGrossProfit /
      this.totalRevenue
    ) * 100;
  }


  /* ============================
    RECURRING CLIENTS
  ============================ */

  get recurringCustomers(): number {

    const purchases =
      new Map<string, number>();


    this.sales
      .filter(
        sale =>
          !!sale.customerId
      )
      .forEach(
        sale => {

          const id =
            sale.customerId as string;

          purchases.set(
            id,
            (
              purchases.get(id) || 0
            ) + 1
          );

        }
      );


    return Array
      .from(purchases.values())
      .filter(
        count => count >= 2
      ).length;
  }


  get recurringCustomerPercentage(): number {

    if (!this.identifiedCustomers) {
      return 0;
    }

    return (
      this.recurringCustomers /
      this.identifiedCustomers
    ) * 100;
  }

}

