import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';

import jsPDF from 'jspdf';
import html2canvas from 'html2canvas';
import pptxgen from 'pptxgenjs';

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

  templateUrl:
    './reports.component.html',

  styleUrls: [
    './reports.component.scss'
  ]
})
export class ReportsComponent
  implements OnInit {


  sales:
    Sale[] = [];


  products:
    Product[] = [];


  clients:
    Client[] = [];


  campaigns:
    Campaign[] = [];


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


  exportingPdf =
    false;


  exportingPpt =
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

  get filteredSales():
    Sale[] {


    if (
      this.period === 'all'
    ) {

      return this.sales;

    }


    const today =
      new Date();


    let startDate:
      Date | null =
      null;


    let endDate:
      Date =
      new Date();


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


    if (
      !startDate
    ) {

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

  get totalRevenue():
    number {


    return this.filteredSales.reduce(
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


    return this.filteredSales.length;

  }


  get totalUnits():
    number {


    return this.filteredSales.reduce(
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

  get estimatedGrossProfit():
    number {


    return this.filteredSales.reduce(
      (
        sum,
        sale
      ) => {


        if (
          !sale.productId
        ) {

          return sum;

        }


        const product =
          this.products.find(
            item =>
              item.id ===
              sale.productId
          );


        if (
          !product
        ) {

          return sum;

        }


        const profit =
          (
            Number(
              sale.unitPrice
            )
            -
            Number(
              product.cost
            )
          )
          *
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


  get estimatedMargin():
    number {


    if (
      !this.totalRevenue
    ) {

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
          map.get(
            key
          );


        if (
          existing
        ) {


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
        (
          a,
          b
        ) =>
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

  get identifiedSales():
    number {


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
            map.get(
              id
            );


          if (
            existing
          ) {


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
        (
          a,
          b
        ) =>
          b.total -
          a.total
      );

  }


  get recurringClients():
    number {


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

  get activeCampaigns():
    number {


    return this.campaigns
      .filter(
        campaign =>
          campaign.status ===
          'active'
      )
      .length;

  }


  get completedCampaigns():
    number {


    return this.campaigns
      .filter(
        campaign =>
          campaign.status ===
          'completed'
      )
      .length;

  }


  get aiCampaigns():
    number {


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


    if (
      bestProduct
    ) {

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
        60
      &&
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
     EXPORT PDF
  ============================ */

  async exportReport():
    Promise<void> {


    if (
      this.exportingPdf
    ) {

      return;

    }


    this.exportingPdf =
      true;


    this.exportMessage =
      'Generando PDF...';


    try {


      const element =
        document.querySelector(
          '.reports-container'
        ) as HTMLElement;


      if (
        !element
      ) {


        this.exportMessage =
          'No fue posible encontrar el reporte.';


        this.exportingPdf =
          false;


        return;

      }


      const canvas =
        await html2canvas(
          element,
          {

            scale:
              2,

            useCORS:
              true,

            backgroundColor:
              '#ffffff'

          }
        );


      const imageData =
        canvas.toDataURL(
          'image/png'
        );


      const pdf =
        new jsPDF(
          'p',
          'mm',
          'a4'
        );


      const pdfWidth =
        pdf.internal
          .pageSize
          .getWidth();


      const pdfHeight =
        pdf.internal
          .pageSize
          .getHeight();


      /*
      * Márgenes laterales del PDF
      */

      const marginX = 8;

      const marginTop = 25;

      const imageWidth =
        pdfWidth -
        (marginX * 2);


      const imageHeight =
        (
          canvas.height *
          imageWidth
        )
        /
        canvas.width;


      const usablePageHeight =
        pdfHeight -
        (marginTop * 2);

      let heightLeft =
        imageHeight -
        usablePageHeight;


      let position =
        marginTop;


      pdf.addImage(
        imageData,
        'PNG',
        marginX,
        position,
        imageWidth,
        imageHeight
      );


      heightLeft -=
        pdfHeight;


      while (heightLeft > 0) {

        position =
          marginTop -
          (
            imageHeight -
            heightLeft
          );

        pdf.addPage();

        pdf.addImage(
          imageData,
          'PNG',
          marginX,
          position,
          imageWidth,
          imageHeight
        );

        heightLeft -=
          usablePageHeight;
      }


      const today =
        new Date()
          .toISOString()
          .split('T')[0];


      pdf.save(
        `WisePick_Reporte_${today}.pdf`
      );


      this.exportMessage =
        'Reporte PDF generado correctamente.';


    } catch (
      error
    ) {


      console.error(
        'Error generando PDF:',
        error
      );


      this.exportMessage =
        'No fue posible generar el PDF.';


    } finally {


      this.exportingPdf =
        false;


      setTimeout(
        () => {


          this.exportMessage =
            '';


        },
        3000
      );

    }

  }

  private getPowerPointPeriodLabel():
    string {


    switch (
      this.period
    ) {


      case '7days':

        return 'Últimos 7 días';


      case '30days':

        return 'Últimos 30 días';


      case 'month':

        return 'Este mes';


      case 'custom':

        if (
          this.customStartDate &&
          this.customEndDate
        ) {

          return (
            `${this.customStartDate} al ${this.customEndDate}`
          );

        }

        return 'Período personalizado';


      case 'all':

      default:

        return 'Todo el histórico';

    }

  }


  /* ============================
     EXPORT POWERPOINT
  ============================ */

  async exportPowerPoint():
    Promise<void> {


    if (
      this.exportingPpt
    ) {

      return;

    }


    this.exportingPpt =
      true;


    this.exportMessage =
      'Generando PowerPoint...';


    try {


      const pptx =
        new pptxgen();


      pptx.layout =
        'LAYOUT_WIDE';


      pptx.author =
        'WisePick';


      pptx.subject =
        'Reporte gerencial WisePick';


      pptx.title =
        'Reporte WisePick';


      pptx.company =
        'WisePick';


      /* ============================
        PALETA WISEPICK
      ============================ */

      const COLORS = {

        primary:
          '5B67F1',

        primarySoft:
          'EEF0FF',

        dark:
          '1E2433',

        text:
          '4E556A',

        muted:
          '8D93A6',

        background:
          'F7F8FC',

        white:
          'FFFFFF',

        border:
          'E7E9F2',

        success:
          '58B77B',

        successSoft:
          'EAF7EF'

      };


      const today =
        new Date();


      const formattedDate =
        today.toLocaleDateString(
          'es-EC'
        );


      const periodLabel =
        this.getPowerPointPeriodLabel();


      /* ============================
        SLIDE 1
        PORTADA
      ============================ */

      const cover =
        pptx.addSlide();


      cover.background = {

        color:
          COLORS.background

      };


      /*
      * Barra decorativa
      */

      cover.addShape(
        pptx.ShapeType.rect,
        {

          x:
            0,

          y:
            0,

          w:
            13.333,

          h:
            0.16,

          line: {

            color:
              COLORS.primary,

            transparency:
              100

          },

          fill: {

            color:
              COLORS.primary

          }

        }
      );


      /*
      * Marca
      */

      cover.addText(
        'W',
        {

          x:
            0.8,

          y:
            0.75,

          w:
            0.62,

          h:
            0.62,

          fontSize:
            20,

          bold:
            true,

          color:
            COLORS.white,

          align:
            'center',

          valign:
            'mid',

          fill: {

            color:
              COLORS.primary

          },

          margin:
            0

        } as any
      );


      cover.addText(
        'WisePick',
        {

          x:
            1.55,

          y:
            0.82,

          w:
            3.5,

          h:
            0.4,

          fontSize:
            20,

          bold:
            true,

          color:
            COLORS.dark

        }
      );


      cover.addText(
        'REPORTE EJECUTIVO',
        {

          x:
            0.85,

          y:
            2,

          w:
            5,

          h:
            0.35,

          fontSize:
            12,

          bold:
            true,

          color:
            COLORS.primary,

          charSpacing:
            1.3

        }
      );


      cover.addText(
        'Así está tu negocio',
        {

          x:
            0.8,

          y:
            2.45,

          w:
            8.7,

          h:
            0.75,

          fontSize:
            30,

          bold:
            true,

          color:
            COLORS.dark

        }
      );


      cover.addText(
        'WisePick transforma tus ventas, productos y clientes en información útil para apoyar la toma de decisiones.',
        {

          x:
            0.85,

          y:
            3.45,

          w:
            8.8,

          h:
            0.9,

          fontSize:
            15,

          color:
            COLORS.text,

          breakLine:
            false

        }
      );


      /*
      * Tarjeta de período
      */

      cover.addShape(
        pptx.ShapeType.roundRect,
        {

          x:
            0.85,

          y:
            5.2,

          w:
            4,

          h:
            1,

          rectRadius:
            0.08,

          fill: {

            color:
              COLORS.white

          },

          line: {

            color:
              COLORS.border,

            pt:
              1

          }

        } as any
      );


      cover.addText(
        'PERÍODO DEL REPORTE',
        {

          x:
            1.1,

          y:
            5.42,

          w:
            2.5,

          h:
            0.25,

          fontSize:
            9,

          bold:
            true,

          color:
            COLORS.muted

        }
      );


      cover.addText(
        periodLabel,
        {

          x:
            1.1,

          y:
            5.73,

          w:
            3.4,

          h:
            0.3,

          fontSize:
            13,

          bold:
            true,

          color:
            COLORS.dark

        }
      );


      cover.addText(
        `Generado: ${formattedDate}`,
        {

          x:
            9.5,

          y:
            6.7,

          w:
            2.8,

          h:
            0.25,

          fontSize:
            9,

          color:
            COLORS.muted,

          align:
            'right'

        }
      );


      /* ============================
        SLIDE 2
        RESUMEN EJECUTIVO
      ============================ */

      const kpiSlide =
        pptx.addSlide();


      kpiSlide.background = {

        color:
          COLORS.background

      };


      kpiSlide.addText(
        'RESUMEN EJECUTIVO',
        {

          x:
            0.65,

          y:
            0.4,

          w:
            4,

          h:
            0.25,

          fontSize:
            10,

          bold:
            true,

          color:
            COLORS.primary,

          charSpacing:
            1

        }
      );


      kpiSlide.addText(
        'Principales indicadores',
        {

          x:
            0.65,

          y:
            0.72,

          w:
            6,

          h:
            0.5,

          fontSize:
            23,

          bold:
            true,

          color:
            COLORS.dark

        }
      );


      kpiSlide.addText(
        periodLabel,
        {

          x:
            9.5,

          y:
            0.65,

          w:
            3,

          h:
            0.35,

          fontSize:
            10,

          color:
            COLORS.muted,

          align:
            'right'

        }
      );


      const kpis = [

        {

          label:
            'INGRESOS',

          value:
            `$${this.totalRevenue.toFixed(2)}`,

          description:
            'Ingresos registrados'

        },

        {

          label:
            'VENTAS',

          value:
            `${this.totalTransactions}`,

          description:
            'Transacciones'

        },

        {

          label:
            'TICKET PROMEDIO',

          value:
            `$${this.averageTicket.toFixed(2)}`,

          description:
            'Promedio por venta'

        },

        {

          label:
            'UNIDADES',

          value:
            `${this.totalUnits}`,

          description:
            'Unidades vendidas'

        },

        {

          label:
            'GANANCIA EST.',

          value:
            `$${this.estimatedGrossProfit.toFixed(2)}`,

          description:
            'Ganancia bruta estimada'

        },

        {

          label:
            'MARGEN EST.',

          value:
            `${this.estimatedMargin.toFixed(1)}%`,

          description:
            'Margen bruto'

        }

      ];


      kpis.forEach(
        (
          kpi,
          index
        ) => {


          const col =
            index % 3;


          const row =
            Math.floor(
              index / 3
            );


          const x =
            0.65 +
            (
              col *
              4.15
            );


          const y =
            1.55 +
            (
              row *
              2.35
            );


          kpiSlide.addShape(
            pptx.ShapeType.roundRect,
            {

              x,

              y,

              w:
                3.75,

              h:
                1.85,

              rectRadius:
                0.06,

              fill: {

                color:
                  COLORS.white

              },

              line: {

                color:
                  COLORS.border,

                pt:
                  1

              }

            } as any
          );


          kpiSlide.addText(
            kpi.label,
            {

              x:
                x + 0.28,

              y:
                y + 0.25,

              w:
                2.8,

              h:
                0.25,

              fontSize:
                9,

              bold:
                true,

              color:
                COLORS.muted

            }
          );


          kpiSlide.addText(
            kpi.value,
            {

              x:
                x + 0.28,

              y:
                y + 0.68,

              w:
                3.05,

              h:
                0.45,

              fontSize:
                21,

              bold:
                true,

              color:
                COLORS.dark

            }
          );


          kpiSlide.addText(
            kpi.description,
            {

              x:
                x + 0.28,

              y:
                y + 1.38,

              w:
                3,

              h:
                0.25,

              fontSize:
                9,

              color:
                COLORS.muted

            }
          );

        }
      );


      /* ============================
        SLIDE 3
        PRODUCTOS
      ============================ */

      const productsSlide =
        pptx.addSlide();


      productsSlide.background = {

        color:
          COLORS.background

      };


      productsSlide.addText(
        'PRODUCTOS',
        {

          x:
            0.65,

          y:
            0.4,

          w:
            4,

          h:
            0.25,

          fontSize:
            10,

          bold:
            true,

          color:
            COLORS.primary,

          charSpacing:
            1

        }
      );


      productsSlide.addText(
        'Productos destacados',
        {

          x:
            0.65,

          y:
            0.75,

          w:
            6,

          h:
            0.45,

          fontSize:
            23,

          bold:
            true,

          color:
            COLORS.dark

        }
      );


      productsSlide.addText(
        'Ranking según unidades vendidas e ingresos generados.',
        {

          x:
            0.65,

          y:
            1.2,

          w:
            7,

          h:
            0.3,

          fontSize:
            11,

          color:
            COLORS.muted

        }
      );


      const productRows =
        this.topProducts.map(
          (
            product,
            index
          ) => [

            `${index + 1}`,

            product.name,

            `${product.units}`,

            `$${product.revenue.toFixed(2)}`

          ]
        );


      const productTable:
        any[] = [

          [

            'POSICIÓN',

            'PRODUCTO',

            'UNIDADES',

            'INGRESOS'

          ],

          ...productRows

        ];


      productsSlide.addTable(
        productTable as any,
        {

          x:
            0.65,

          y:
            1.85,

          w:
            12,

          border: {

            type:
              'solid',

            color:
              COLORS.border,

            pt:
              1

          },

          fontFace:
            'Aptos',

          fontSize:
            11,

          color:
            COLORS.text,

          fill:
            COLORS.white,

          margin:
            0.12,

          rowH:
            0.58,

          bold:
            false,

          valign:
            'mid',

          autoFit:
            false,

          colW: [
            1.5,
            6,
            2,
            2.5
          ]

        } as any
      );


      /*
      * Destacado producto #1
      */

      const bestProduct =
        this.topProducts[0];


      if (
        bestProduct
      ) {


        productsSlide.addShape(
          pptx.ShapeType.roundRect,
          {

            x:
              0.65,

            y:
              5.65,

            w:
              12,

            h:
              1,

            rectRadius:
              0.05,

            fill: {

              color:
                COLORS.primarySoft

            },

            line: {

              color:
                COLORS.primarySoft,

              transparency:
                100

            }

          } as any
        );


        productsSlide.addText(
          '★ PRODUCTO LÍDER',
          {

            x:
              0.95,

            y:
              5.9,

            w:
              2,

            h:
              0.25,

            fontSize:
              9,

            bold:
              true,

            color:
              COLORS.primary

          }
        );


        productsSlide.addText(
          `${bestProduct.name} · ${bestProduct.units} unidades · $${bestProduct.revenue.toFixed(2)}`,
          {

            x:
              3,

            y:
              5.82,

            w:
              8.8,

            h:
              0.35,

            fontSize:
              13,

            bold:
              true,

            color:
              COLORS.dark

          }
        );

      }


      /* ============================
        SLIDE 4
        CLIENTES
      ============================ */

      const clientsSlide =
        pptx.addSlide();


      clientsSlide.background = {

        color:
          COLORS.background

      };


      clientsSlide.addText(
        'CLIENTES',
        {

          x:
            0.65,

          y:
            0.4,

          w:
            4,

          h:
            0.25,

          fontSize:
            10,

          bold:
            true,

          color:
            COLORS.primary,

          charSpacing:
            1

        }
      );


      clientsSlide.addText(
        'Comportamiento de clientes',
        {

          x:
            0.65,

          y:
            0.75,

          w:
            7,

          h:
            0.45,

          fontSize:
            23,

          bold:
            true,

          color:
            COLORS.dark

        }
      );


      /*
      * Tarjeta principal
      */

      clientsSlide.addShape(
        pptx.ShapeType.roundRect,
        {

          x:
            0.7,

          y:
            1.55,

          w:
            5.5,

          h:
            3.6,

          rectRadius:
            0.06,

          fill: {

            color:
              COLORS.white

          },

          line: {

            color:
              COLORS.border,

            pt:
              1

          }

        } as any
      );


      clientsSlide.addText(
        `${this.identifiedSalesPercentage.toFixed(0)}%`,
        {

          x:
            1.05,

          y:
            2,

          w:
            2,

          h:
            0.65,

          fontSize:
            32,

          bold:
            true,

          color:
            COLORS.primary

        }
      );


      clientsSlide.addText(
        'de las ventas tienen cliente identificado',
        {

          x:
            1.05,

          y:
            2.75,

          w:
            4.3,

          h:
            0.45,

          fontSize:
            13,

          color:
            COLORS.text

        }
      );


      /*
      * Barra visual
      */

      clientsSlide.addShape(
        pptx.ShapeType.roundRect,
        {

          x:
            1.05,

          y:
            3.45,

          w:
            4.4,

          h:
            0.14,

          rectRadius:
            0.03,

          fill: {

            color:
              COLORS.border

          },

          line: {

            transparency:
              100

          }

        } as any
      );


      const identifiedWidth =
        Math.max(
          0,
          Math.min(
            4.4,
            4.4 *
            (
              this.identifiedSalesPercentage /
              100
            )
          )
        );


      if (
        identifiedWidth > 0
      ) {


        clientsSlide.addShape(
          pptx.ShapeType.roundRect,
          {

            x:
              1.05,

            y:
              3.45,

            w:
              identifiedWidth,

            h:
              0.14,

            rectRadius:
              0.03,

            fill: {

              color:
                COLORS.primary

            },

            line: {

              transparency:
                100

            }

          } as any
        );

      }


      /*
      * Mini cards
      */

      const clientStats = [

        {

          label:
            'VENTAS IDENTIFICADAS',

          value:
            `${this.identifiedSales}`

        },

        {

          label:
            'CLIENTES RECURRENTES',

          value:
            `${this.recurringClients}`

        }

      ];


      clientStats.forEach(
        (
          stat,
          index
        ) => {


          const x =
            6.65 +
            (
              index *
              3
            );


          clientsSlide.addShape(
            pptx.ShapeType.roundRect,
            {

              x,

              y:
                1.55,

              w:
                2.65,

              h:
                1.65,

              rectRadius:
                0.05,

              fill: {

                color:
                  COLORS.white

              },

              line: {

                color:
                  COLORS.border,

                pt:
                  1

              }

            } as any
          );


          clientsSlide.addText(
            stat.label,
            {

              x:
                x + 0.25,

              y:
                1.85,

              w:
                2.15,

              h:
                0.28,

              fontSize:
                8,

              bold:
                true,

              color:
                COLORS.muted

            }
          );


          clientsSlide.addText(
            stat.value,
            {

              x:
                x + 0.25,

              y:
                2.35,

              w:
                2,

              h:
                0.45,

              fontSize:
                22,

              bold:
                true,

              color:
                COLORS.dark

            }
          );

        }
      );


      /*
      * Nota
      */

      clientsSlide.addShape(
        pptx.ShapeType.roundRect,
        {

          x:
            6.65,

          y:
            3.65,

          w:
            5.65,

          h:
            1.5,

          rectRadius:
            0.05,

          fill: {

            color:
              COLORS.primarySoft

          },

          line: {

            transparency:
              100

          }

        } as any
      );


      clientsSlide.addText(
        'CALIDAD DE DATOS',
        {

          x:
            6.95,

          y:
            3.95,

          w:
            2,

          h:
            0.25,

          fontSize:
            9,

          bold:
            true,

          color:
            COLORS.primary

        }
      );


      clientsSlide.addText(
        this.identifiedSalesPercentage < 60
          ? 'Existe una oportunidad importante para identificar más clientes y mejorar el análisis comercial.'
          : 'El nivel de identificación de clientes permite realizar análisis comerciales más precisos.',
        {

          x:
            6.95,

          y:
            4.3,

          w:
            4.85,

          h:
            0.55,

          fontSize:
            11,

          color:
            COLORS.text

        }
      );


      /* ============================
        SLIDE 5
        HALLAZGOS
      ============================ */

      const findingsSlide =
        pptx.addSlide();


      findingsSlide.background = {

        color:
          COLORS.background

      };


      findingsSlide.addText(
        'WISEPICK',
        {

          x:
            0.65,

          y:
            0.4,

          w:
            4,

          h:
            0.25,

          fontSize:
            10,

          bold:
            true,

          color:
            COLORS.primary,

          charSpacing:
            1

        }
      );


      findingsSlide.addText(
        'Principales observaciones',
        {

          x:
            0.65,

          y:
            0.75,

          w:
            7,

          h:
            0.5,

          fontSize:
            23,

          bold:
            true,

          color:
            COLORS.dark

        }
      );


      findingsSlide.addText(
        'Hallazgos generados a partir de la información registrada en el período seleccionado.',
        {

          x:
            0.65,

          y:
            1.25,

          w:
            8.5,

          h:
            0.35,

          fontSize:
            11,

          color:
            COLORS.muted

        }
      );


      if (
        this.businessFindings.length
      ) {


        this.businessFindings
          .slice(
            0,
            5
          )
          .forEach(
            (
              finding,
              index
            ) => {


              const y =
                1.95 +
                (
                  index *
                  0.9
                );


              findingsSlide.addShape(
                pptx.ShapeType.roundRect,
                {

                  x:
                    0.7,

                  y,

                  w:
                    11.9,

                  h:
                    0.67,

                  rectRadius:
                    0.04,

                  fill: {

                    color:
                      COLORS.white

                  },

                  line: {

                    color:
                      COLORS.border,

                    pt:
                      1

                  }

                } as any
              );


              findingsSlide.addShape(
                pptx.ShapeType.ellipse,
                {

                  x:
                    0.98,

                  y:
                    y + 0.2,

                  w:
                    0.25,

                  h:
                    0.25,

                  fill: {

                    color:
                      COLORS.primary

                  },

                  line: {

                    transparency:
                      100

                  }

                } as any
              );


              findingsSlide.addText(
                '✓',
                {

                  x:
                    1,

                  y:
                    y + 0.18,

                  w:
                    0.2,

                  h:
                    0.2,

                  fontSize:
                    8,

                  bold:
                    true,

                  color:
                    COLORS.white,

                  align:
                    'center',

                  margin:
                    0

                }
              );


              findingsSlide.addText(
                finding,
                {

                  x:
                    1.45,

                  y:
                    y + 0.16,

                  w:
                    10.6,

                  h:
                    0.34,

                  fontSize:
                    11,

                  color:
                    COLORS.text

                }
              );

            }
          );


      } else {


        findingsSlide.addShape(
          pptx.ShapeType.roundRect,
          {

            x:
              0.7,

            y:
              2,

            w:
              11.8,

            h:
              1.2,

            rectRadius:
              0.05,

            fill: {

              color:
                COLORS.white

            },

            line: {

              color:
                COLORS.border,

              pt:
                1

            }

          } as any
        );


        findingsSlide.addText(
          'No existen hallazgos suficientes para el período seleccionado.',
          {

            x:
              1,

            y:
              2.4,

            w:
              10,

            h:
              0.4,

            fontSize:
              13,

            color:
              COLORS.text

          }
        );

      }


      findingsSlide.addText(
        'WisePick · Inteligencia para pequeñas y medianas empresas',
        {

          x:
            0.7,

          y:
            6.8,

          w:
            6,

          h:
            0.25,

          fontSize:
            8,

          color:
            COLORS.muted

        }
      );


      /* ============================
        DOWNLOAD
      ============================ */

      const fileDate =
        new Date()
          .toISOString()
          .split(
            'T'
          )[0];


      await pptx.writeFile({

        fileName:
          `WisePick_Reporte_${fileDate}.pptx`

      });


      this.exportMessage =
        'PowerPoint generado correctamente.';


    } catch (
      error
    ) {


      console.error(
        'Error generando PowerPoint:',
        error
      );


      this.exportMessage =
        'No fue posible generar el PowerPoint.';


    } finally {


      this.exportingPpt =
        false;


      setTimeout(
        () => {


          this.exportMessage =
            '';


        },
        3000
      );

    }

  }

}