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
  phone?: string;
  email?: string;
  city?: string;
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

  priority:
    | 'high'
    | 'medium'
    | 'low';

  icon: string;

  title: string;
  description: string;

  evidence: string;

  action: string;

  targetType?:
    | 'product'
    | 'customer'
    | 'sales'
    | 'inventory';

  targetId?: string;
  targetName?: string;
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
export class MarketingAiComponent implements OnInit {

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
     DATA
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
     KPI
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
     PRODUCTS
  ============================ */

  get productMetrics(): ProductMetric[] {

    const map =
      new Map<string, ProductMetric>();

    this.sales.forEach(
      sale => {

        const key =
          sale.productId ||
          sale.productName;

        const current =
          map.get(key);

        if (current) {

          current.quantity +=
            Number(sale.quantity);

          current.revenue +=
            Number(sale.total);

        } else {

          map.set(
            key,
            {
              id:
                sale.productId,

              name:
                sale.productName,

              quantity:
                Number(sale.quantity),

              revenue:
                Number(sale.total)
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
     CLIENTS
  ============================ */

  get recurringCustomers(): number {

    const map =
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

          map.set(
            id,
            (
              map.get(id) || 0
            ) + 1
          );
        }
      );

    return Array
      .from(map.values())
      .filter(
        purchases =>
          purchases >= 2
      )
      .length;
  }


  /* ============================
     INSIGHT ENGINE
  ============================ */

  private generateInsights(): void {

    const result: Insight[] = [];


    /* PRODUCTO DESTACADO */

    if (this.bestProduct) {

      result.push({

        id:
          crypto.randomUUID(),

        type:
          'success',

        priority:
          'high',

        icon:
          '🔥',

        title:
          'Producto destacado',

        description:
          `${this.bestProduct.name} es actualmente tu producto con mayor número de unidades vendidas.`,

        evidence:
          `${this.bestProduct.quantity} unidades vendidas y $${this.bestProduct.revenue.toFixed(2)} en ingresos.`,

        action:
          'Crear campaña',

        targetType:
          'product',

        targetId:
          this.bestProduct.id,

        targetName:
          this.bestProduct.name
      });
    }


    /* CLIENTES RECURRENTES */

    if (
      this.recurringCustomers > 0
    ) {

      result.push({

        id:
          crypto.randomUUID(),

        type:
          'customer',

        priority:
          'high',

        icon:
          '👥',

        title:
          'Oportunidad de fidelización',

        description:
          `Tienes ${this.recurringCustomers} cliente(s) que han comprado más de una vez.`,

        evidence:
          'Los clientes recurrentes pueden ser candidatos para promociones o campañas de fidelización.',

        action:
          'Crear campaña',

        targetType:
          'customer'
      });
    }


    /* CLIENTES NO IDENTIFICADOS */

    if (
      this.identifiedPercentage <
      60
    ) {

      result.push({

        id:
          crypto.randomUUID(),

        type:
          'opportunity',

        priority:
          'medium',

        icon:
          '🎯',

        title:
          'Mejora la identificación de clientes',

        description:
          `Solo el ${this.identifiedPercentage.toFixed(0)}% de tus ventas tienen un cliente identificado.`,

        evidence:
          'Identificar clientes permite mejorar segmentación, recurrencia y campañas personalizadas.',

        action:
          'Ver clientes',

        targetType:
          'sales'
      });
    }


    /* STOCK BAJO */

    const lowStock =
      this.products.filter(
        product =>
          product.status === 'active' &&
          product.stock <= 5
      );


    if (
      lowStock.length > 0
    ) {

      result.push({

        id:
          crypto.randomUUID(),

        type:
          'warning',

        priority:
          'high',

        icon:
          '📦',

        title:
          'Productos con stock bajo',

        description:
          `${lowStock.length} producto(s) tienen 5 unidades o menos disponibles.`,

        evidence:
          'Evita promocionar productos con disponibilidad limitada antes de revisar inventario.',

        action:
          'Revisar productos',

        targetType:
          'inventory'
      });
    }


    this.insights =
      result;
  }


  /* ============================
     ACTION
  ============================ */

  executeInsight(
    insight: Insight
  ): void {

    if (
      insight.action ===
      'Crear campaña'
    ) {

      this.createCampaignFromInsight(
        insight
      );

      return;
    }


    if (
      insight.targetType ===
      'inventory'
    ) {

      this.router.navigate([
        '/dashboard/products'
      ]);

      return;
    }


    if (
      insight.targetType ===
      'sales'
    ) {

      this.router.navigate([
        '/dashboard/clients'
      ]);
    }
  }


  /* ============================
     CAMPAIGN BRIDGE
  ============================ */

  private createCampaignFromInsight(
    insight: Insight
  ): void {

    const campaignDraft = {

      source:
        'marketing-ai',

      insightId:
        insight.id,

      insightType:
        insight.type,

      title:
        insight.title,

      description:
        insight.description,

      targetType:
        insight.targetType,

      targetId:
        insight.targetId || null,

      targetName:
        insight.targetName || null,

      createdAt:
        new Date().toISOString()
    };


    localStorage.setItem(
      'wisepick_campaign_draft',
      JSON.stringify(
        campaignDraft
      )
    );


    this.router.navigate([
      '/dashboard/campaigns'
    ]);
  }
  /* ============================
   GO TO CAMPAIGNS
============================ */

goToCampaigns(): void {

  this.router.navigate([
    '/dashboard/campaigns'
  ]);

}
}