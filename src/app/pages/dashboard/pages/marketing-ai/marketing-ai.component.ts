import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  Router
} from '@angular/router';

import {
  MarketingAiApiService,
  MarketingAnalysisApi,
  MarketingInsightApi,
  ProductMetricApi
} from '../../../../core/services/marketing-ai-api.service';


interface Sale {
  id: string;
}


interface ProductMetric {

  id?: string | null;

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
    | 'inventory'
    | null;

  targetId?:
    string | null;

  targetName?:
    string | null;

}


@Component({
  selector:
    'app-marketing-ai',

  standalone:
    true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './marketing-ai.component.html',

  styleUrls: [
    './marketing-ai.component.scss'
  ]
})
export class MarketingAiComponent
  implements OnInit {


  sales:
    Sale[] = [];


  insights:
    Insight[] = [];


  bestProduct:
    ProductMetric | null =
    null;


  totalRevenue =
    0;


  identifiedSales =
    0;


  identifiedPercentage =
    0;


  recurringCustomers =
    0;


  lowStockProducts =
    0;


  loading =
    false;


  globalError =
    '';


  isDemoMode =
    false;


  constructor(

    private router:
      Router,

    private marketingAiApi:
      MarketingAiApiService

  ) {}


  ngOnInit(): void {


    this.isDemoMode =
      this.router.url
        .startsWith(
          '/demo'
        );


    if (
      this.isDemoMode
    ) {

      this.loadDemoData();

      return;

    }


    this.loadAnalysis();

  }


  /* ============================
     BACKEND ANALYSIS
  ============================ */

  private loadAnalysis():
  void {


    this.loading =
      true;


    this.globalError =
      '';


    this.marketingAiApi
      .getInsights()
      .subscribe({

        next:
          (
            response:
              MarketingAnalysisApi
          ) => {


            this.totalRevenue =
              Number(
                response.summary
                  .totalRevenue || 0
              );


            this.identifiedSales =
              Number(
                response.summary
                  .identifiedSales || 0
              );


            this.identifiedPercentage =
              Number(
                response.summary
                  .identifiedPercentage || 0
              );


            this.recurringCustomers =
              Number(
                response.summary
                  .recurringCustomers || 0
              );


            this.lowStockProducts =
              Number(
                response.summary
                  .lowStockProducts || 0
              );


            /*
             * El HTML actual usa sales.length
             * para decidir si muestra
             * estado vacío o análisis.
             *
             * No necesitamos traer todas
             * las ventas al frontend.
             *
             * Solo representamos la cantidad
             * indicada por el backend.
             */

            this.sales =
              Array.from(
                {
                  length:
                    response.summary
                      .totalSales || 0
                },
                (
                  _,
                  index
                ) => ({
                  id:
                    `${index}`
                })
              );


            this.bestProduct =
              response.bestProduct
                ? this.mapProductMetric(
                    response.bestProduct
                  )
                : null;


            this.insights =
              response.insights.map(
                insight =>
                  this.mapInsight(
                    insight
                  )
              );


            this.loading =
              false;

          },


        error:
          error => {


            console.error(
              'Error cargando Marketing IA:',
              error
            );


            this.globalError =
              'No fue posible generar el análisis de Marketing IA.';


            this.loading =
              false;

          }

      });

  }


  /* ============================
     API MAPPERS
  ============================ */

  private mapProductMetric(
    product:
      ProductMetricApi
  ): ProductMetric {


    return {

      id:
        product.id || null,

      name:
        product.name,

      quantity:
        Number(
          product.quantity || 0
        ),

      revenue:
        Number(
          product.revenue || 0
        )

    };

  }


  private mapInsight(
    insight:
      MarketingInsightApi
  ): Insight {


    return {

      id:
        insight.id,

      type:
        insight.type,

      priority:
        insight.priority,

      icon:
        insight.icon,

      title:
        insight.title,

      description:
        insight.description,

      evidence:
        insight.evidence,

      action:
        insight.action,

      targetType:
        insight.targetType || null,

      targetId:
        insight.targetId || null,

      targetName:
        insight.targetName || null

    };

  }


  /* ============================
     DEMO MODE
  ============================ */

  private loadDemoData():
  void {


    const demoSales =
      JSON.parse(
        localStorage.getItem(
          'wisepick_sales'
        ) || '[]'
      );


    const demoProducts =
      JSON.parse(
        localStorage.getItem(
          'wisepick_products'
        ) || '[]'
      );


    this.sales =
      demoSales;


    this.totalRevenue =
      demoSales.reduce(
        (
          sum: number,
          sale: any
        ) =>
          sum +
          Number(
            sale.total || 0
          ),
        0
      );


    this.identifiedSales =
      demoSales.filter(
        (sale: any) =>
          !!sale.customerId
      ).length;


    this.identifiedPercentage =
      demoSales.length
        ? (
            this.identifiedSales /
            demoSales.length
          ) * 100
        : 0;


    const metrics =
      new Map<
        string,
        ProductMetric
      >();


    demoSales.forEach(
      (sale: any) => {


        const key =
          sale.productId ||
          sale.productName;


        if (!key) {

          return;

        }


        const current =
          metrics.get(
            key
          );


        if (current) {

          current.quantity +=
            Number(
              sale.quantity || 0
            );


          current.revenue +=
            Number(
              sale.total || 0
            );

        }

        else {

          metrics.set(
            key,
            {

              id:
                sale.productId,

              name:
                sale.productName,

              quantity:
                Number(
                  sale.quantity || 0
                ),

              revenue:
                Number(
                  sale.total || 0
                )

            }
          );

        }

      }
    );


    const productMetrics =
      Array
        .from(
          metrics.values()
        )
        .sort(
          (
            a,
            b
          ) =>
            b.quantity -
            a.quantity
        );


    this.bestProduct =
      productMetrics[0] ||
      null;


    const customerPurchases =
      new Map<
        string,
        number
      >();


    demoSales
      .filter(
        (sale: any) =>
          !!sale.customerId
      )
      .forEach(
        (sale: any) => {


          customerPurchases.set(

            sale.customerId,

            (
              customerPurchases.get(
                sale.customerId
              ) || 0
            ) + 1

          );

        }
      );


    this.recurringCustomers =
      Array
        .from(
          customerPurchases.values()
        )
        .filter(
          purchases =>
            purchases >= 2
        )
        .length;


    const lowStock =
      demoProducts.filter(
        (product: any) =>
          product.status ===
            'active'
          &&
          Number(
            product.stock
          ) <= 5
      );


    this.lowStockProducts =
      lowStock.length;


    this.generateDemoInsights();

  }


  private generateDemoInsights():
  void {


    const result:
      Insight[] = [];


    if (
      this.bestProduct
    ) {

      result.push({

        id:
          'demo-product-highlight',

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
          this.bestProduct.id || null,

        targetName:
          this.bestProduct.name

      });

    }


    if (
      this.recurringCustomers > 0
    ) {

      result.push({

        id:
          'demo-recurring-customers',

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
          'customer',

        targetId:
          null,

        targetName:
          null

      });

    }


    if (
      this.sales.length >= 5
      &&
      this.identifiedPercentage <
        60
    ) {

      result.push({

        id:
          'demo-customer-identification',

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
          'sales',

        targetId:
          null,

        targetName:
          null

      });

    }


    if (
      this.lowStockProducts > 0
    ) {

      result.push({

        id:
          'demo-low-stock',

        type:
          'warning',

        priority:
          'high',

        icon:
          '📦',

        title:
          'Productos con stock bajo',

        description:
          `${this.lowStockProducts} producto(s) tienen 5 unidades o menos disponibles.`,

        evidence:
          'Evita promocionar productos con disponibilidad limitada antes de revisar inventario.',

        action:
          'Revisar productos',

        targetType:
          'inventory',

        targetId:
          null,

        targetName:
          null

      });

    }


    this.insights =
      result;

  }


  /* ============================
     ACTION
  ============================ */

  executeInsight(
    insight:
      Insight
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
        this.isDemoMode
          ? '/demo/products'
          : '/dashboard/products'
      ]);

      return;

    }


    if (
      insight.targetType ===
      'sales'
    ) {

      this.router.navigate([
        this.isDemoMode
          ? '/demo/clients'
          : '/dashboard/clients'
      ]);

    }

  }


  /* ============================
     CAMPAIGN BRIDGE
  ============================ */

  private createCampaignFromInsight(
    insight:
      Insight
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
        new Date()
          .toISOString()

    };


    localStorage.setItem(

      'wisepick_campaign_draft',

      JSON.stringify(
        campaignDraft
      )

    );


    this.router.navigate([

      this.isDemoMode
        ? '/demo/campaigns'
        : '/dashboard/campaigns'

    ]);

  }


  /* ============================
     GO TO CAMPAIGNS
  ============================ */

  goToCampaigns():
  void {


    this.router.navigate([

      this.isDemoMode
        ? '/demo/campaigns'
        : '/dashboard/campaigns'

    ]);

  }

}