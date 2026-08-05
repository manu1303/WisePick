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
}


interface Product {

  id: string;

  name: string;

  category: string;

  cost: number;

  price: number;

  stock: number;

  status: 'active' | 'inactive';
}


interface Client {

  id: string;

  name: string;

  status: 'active' | 'inactive';
}


interface ProductMetric {

  id?: string;

  name: string;

  quantity: number;

  revenue: number;
}


interface Insight {

  id: string;

  type:
    | 'opportunity'
    | 'warning'
    | 'success'
    | 'customer';

  icon: string;

  title: string;

  description: string;

  action: string;

  route:
    | 'products'
    | 'clients'
    | 'campaigns'
    | 'sales';
}


@Component({
  selector: 'app-marketing-ai',
  standalone: true,
  imports: [
    CommonModule
  ],
  templateUrl: './marketing-ai.component.html',
  styleUrls: ['./marketing-ai.component.scss']
})
export class MarketingAiComponent
implements OnInit {

  sales: Sale[] = [];

  products: Product[] = [];

  clients: Client[] = [];

  insights: Insight[] = [];


  constructor(
    private router: Router
  ) {}


  ngOnInit(): void {

    this.loadData();

    this.generateInsights();

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

  }


  /* ============================
     KPIs
  ============================ */

  get totalRevenue(): number {

    return this.sales.reduce(
      (sum, sale) =>
        sum + Number(sale.total),
      0
    );

  }


  get identifiedSales(): number {

    return this.sales.filter(
      sale =>
        !!sale.customerId
    ).length;

  }


  get identifiedPercentage(): number {

    if (!this.sales.length) {
      return 0;
    }

    return (
      this.identifiedSales /
      this.sales.length
    ) * 100;

  }


  /* ============================
     PRODUCT ANALYTICS
  ============================ */

  get productMetrics():
    ProductMetric[] {

    const map =
      new Map<
        string,
        ProductMetric
      >();


    this.sales.forEach(
      sale => {

        const key =
          sale.productId ||
          sale.productName;


        const current =
          map.get(key);


        if (current) {

          current.quantity +=
            Number(
              sale.quantity
            );

          current.revenue +=
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


  get bestProduct():
    ProductMetric | null {

    return (
      this.productMetrics[0] ||
      null
    );

  }


  /* ============================
     CUSTOMER ANALYTICS
  ============================ */

  get recurringCustomers():
    number {

    const map =
      new Map<
        string,
        number
      >();


    this.sales
      .filter(
        sale =>
          !!sale.customerId
      )
      .forEach(
        sale => {

          const id =
            sale.customerId as string;


          map.set(
            id,
            (
              map.get(id) ||
              0
            ) + 1
          );

        }
      );


    return Array
      .from(map.values())
      .filter(
        purchases =>
          purchases >= 2
      ).length;

  }


  /* ============================
     INSIGHT GENERATOR
  ============================ */

  private generateInsights(): void {

    const generated:
      Insight[] = [];


    /*
      PRODUCTO MÁS VENDIDO
    */

    if (this.bestProduct) {

      generated.push({

        id:
          'top-product',

        type:
          'success',

        icon:
          '🔥',

        title:
          'Producto destacado',

        description:
          `${this.bestProduct.name} lidera tus ventas con ${this.bestProduct.quantity} unidades vendidas y $${this.bestProduct.revenue.toFixed(2)} en ingresos.`,

        action:
          'Ver productos',

        route:
          'products'

      });

    }


    /*
      CLIENTES RECURRENTES
    */

    if (
      this.recurringCustomers > 0
    ) {

      generated.push({

        id:
          'recurring-customers',

        type:
          'customer',

        icon:
          '👥',

        title:
          'Oportunidad de fidelización',

        description:
          `Tienes ${this.recurringCustomers} cliente(s) que han comprado más de una vez. Puedes crear una campaña especial para fortalecer su fidelidad.`,

        action:
          'Crear campaña',

        route:
          'campaigns'

      });

    }


    /*
      IDENTIFICACIÓN DE CLIENTES
    */

    if (
      this.identifiedPercentage <
      60
    ) {

      generated.push({

        id:
          'customer-data',

        type:
          'opportunity',

        icon:
          '🎯',

        title:
          'Conoce mejor a tus clientes',

        description:
          `Solo el ${this.identifiedPercentage.toFixed(0)}% de tus ventas tienen un cliente identificado. Registrar más clientes mejorará la segmentación y las recomendaciones.`,

        action:
          'Ver clientes',

        route:
          'clients'

      });

    }


    /*
      STOCK BAJO
    */

    const lowStock =
      this.products.filter(
        product =>
          product.status ===
            'active' &&
          product.stock <= 5
      );


    if (
      lowStock.length > 0
    ) {

      generated.push({

        id:
          'low-stock',

        type:
          'warning',

        icon:
          '📦',

        title:
          'Stock bajo detectado',

        description:
          `${lowStock.length} producto(s) tienen 5 unidades o menos disponibles. Revisa el inventario antes de impulsar campañas sobre estos productos.`,

        action:
          'Revisar productos',

        route:
          'products'

      });

    }


    this.insights =
      generated;

  }


  /* ============================
     NAVIGATION
  ============================ */

  executeInsight(
    insight: Insight
  ): void {

    switch (
      insight.route
    ) {

      case 'products':

        this.router.navigate([
          '/dashboard/products'
        ]);

        break;


      case 'clients':

        this.router.navigate([
          '/dashboard/clients'
        ]);

        break;


      case 'campaigns':

        this.router.navigate([
          '/dashboard/campaigns'
        ]);

        break;


      case 'sales':

        this.router.navigate([
          '/dashboard/sales'
        ]);

        break;

    }

  }


  goToCampaigns(): void {

    this.router.navigate([
      '/dashboard/campaigns'
    ]);

  }

}