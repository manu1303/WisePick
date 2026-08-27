import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router } from '@angular/router';

import * as XLSX from 'xlsx';

import {
  SalesApiService,
  SaleImportResponse
} from '../../../../../core/services/sales-api.service';

import {
  CompanyApiService
} from '../../../../../core/services/company-api.service';


interface ExcelSaleRow {
  Fecha?: string | number;
  Cliente?: string;
  Producto?: string;
  Cantidad?: number;
  PrecioUnitario?: number;
  MetodoPago?: string;
}


interface PreviewSale {
  saleDate: string;
  customerName: string;
  productName: string;
  quantity: number;
  unitPrice: number;
  total: number;
  paymentMethod: string;
  valid: boolean;
  errors: string[];
}


@Component({
  selector: 'app-sales-excel',
  standalone: true,

  imports: [
    CommonModule
  ],

  templateUrl:
    './sales-excel.component.html',

  styleUrls: [
    './sales-excel.component.scss'
  ]
})
export class SalesExcelComponent {


  selectedFile:
    File | null = null;


  previewSales:
    PreviewSale[] = [];


  fileName = '';


  processing = false;


  fileProcessed = false;


  importCompleted = false;


  importing = false;


  globalError = '';


  importResult:
    SaleImportResponse | null = null;


  constructor(

    private router:
      Router,

    private salesApi:
      SalesApiService,

    private companyApi:
      CompanyApiService  

  ) {}


  /* ==============================
     SELECT FILE
  ============================== */

  onFileSelected(
    event: Event
  ): void {


    const input =
      event.target as HTMLInputElement;


    if (
      !input.files ||
      input.files.length === 0
    ) {

      return;

    }


    const file =
      input.files[0];


    this.resetPreview();


    this.selectedFile =
      file;


    this.fileName =
      file.name;


    const extension =
      file.name
        .split('.')
        .pop()
        ?.toLowerCase();


    if (
      extension !== 'xlsx' &&
      extension !== 'xls'
    ) {


      this.globalError =
        'Selecciona un archivo Excel válido (.xlsx o .xls).';


      this.selectedFile =
        null;


      return;

    }


    this.readExcel(
      file
    );

  }


  /* ==============================
     READ EXCEL
  ============================== */

  private readExcel(
    file: File
  ): void {


    this.processing =
      true;


    const reader =
      new FileReader();


    reader.onload =
      (
        event:
          ProgressEvent<FileReader>
      ) => {


        try {


          const data =
            event.target?.result;


          if (!data) {

            throw new Error(
              'No se pudo leer el archivo.'
            );

          }


          const workbook =
            XLSX.read(
              data,
              {
                type: 'array',
                cellDates: true
              }
            );


          const firstSheetName =
            workbook.SheetNames[0];


          const worksheet =
            workbook.Sheets[
              firstSheetName
            ];


          const rows =
            XLSX.utils
              .sheet_to_json<ExcelSaleRow>(
                worksheet,
                {
                  defval: ''
                }
              );


          if (
            rows.length === 0
          ) {


            this.globalError =
              'El archivo no contiene registros.';


            this.processing =
              false;


            return;

          }


          this.previewSales =
            rows.map(
              row =>
                this.normalizeRow(
                  row
                )
            );


          this.fileProcessed =
            true;


        } catch (error) {


          console.error(
            'Error procesando Excel:',
            error
          );


          this.globalError =
            'No pudimos procesar el archivo Excel.';


        } finally {


          this.processing =
            false;

        }

      };


    reader.onerror =
      () => {


        this.processing =
          false;


        this.globalError =
          'Ocurrió un error al leer el archivo.';

      };


    reader.readAsArrayBuffer(
      file
    );

  }


  /* ==============================
     NORMALIZATION
  ============================== */

  private normalizeRow(
    row: ExcelSaleRow
  ): PreviewSale {


    const errors:
      string[] = [];


    const saleDate =
      this.normalizeDate(
        row.Fecha
      );


    const customerName =
      String(
        row.Cliente || ''
      ).trim() ||
      'Cliente no identificado';


    const productName =
      String(
        row.Producto || ''
      ).trim();


    const quantity =
      Number(
        row.Cantidad
      );


    const unitPrice =
      Number(
        row.PrecioUnitario
      );


    const paymentMethod =
      String(
        row.MetodoPago || ''
      ).trim();


    /* VALIDATION */


    if (!saleDate) {

      errors.push(
        'Fecha inválida'
      );

    }


    if (!productName) {

      errors.push(
        'Producto requerido'
      );

    }


    if (
      !quantity ||
      quantity <= 0
    ) {

      errors.push(
        'Cantidad inválida'
      );

    }


    if (
      !unitPrice ||
      unitPrice <= 0
    ) {

      errors.push(
        'Precio inválido'
      );

    }


    if (!paymentMethod) {

      errors.push(
        'Método de pago requerido'
      );

    }


    return {

      saleDate,

      customerName,

      productName,

      quantity,

      unitPrice,

      total:
        quantity *
        unitPrice,

      paymentMethod,

      valid:
        errors.length === 0,

      errors

    };

  }


  /* ==============================
     DATE NORMALIZATION
  ============================== */

  private normalizeDate(
    value:
      string |
      number |
      Date |
      undefined
  ): string {


    if (!value) {

      return '';

    }


    if (
      value instanceof Date
    ) {


      return value
        .toISOString()
        .split('T')[0];

    }


    if (
      typeof value === 'number'
    ) {


      const excelDate =
        XLSX.SSF
          .parse_date_code(
            value
          );


      if (!excelDate) {

        return '';

      }


      const month =
        String(
          excelDate.m
        ).padStart(
          2,
          '0'
        );


      const day =
        String(
          excelDate.d
        ).padStart(
          2,
          '0'
        );


      return `${excelDate.y}-${month}-${day}`;

    }


    const date =
      new Date(
        value
      );


    if (
      isNaN(
        date.getTime()
      )
    ) {

      return '';

    }


    return date
      .toISOString()
      .split('T')[0];

  }


  /* ==============================
     KPI PREVIEW
  ============================== */

  get validSales():
    PreviewSale[] {


    return this.previewSales
      .filter(
        sale =>
          sale.valid
      );

  }


  get invalidSales():
    PreviewSale[] {


    return this.previewSales
      .filter(
        sale =>
          !sale.valid
      );

  }


  get totalRows():
    number {


    return this.previewSales
      .length;

  }


  get totalValid():
    number {


    return this.validSales
      .length;

  }


  get totalInvalid():
    number {


    return this.invalidSales
      .length;

  }


  get totalAmount():
    number {


    return this.validSales
      .reduce(

        (
          sum,
          sale
        ) =>
          sum +
          sale.total,

        0

      );

  }


  /* ==============================
     BACKEND RESULT
  ============================== */

  get importedRows():
    number {


    return this.importResult
      ?.importedRows ?? 0;

  }


  get failedRows():
    number {


    return this.importResult
      ?.failedRows ?? 0;

  }


  get backendErrors():
    string[] {


    return this.importResult
      ?.errors ?? [];

  }


  /* ==============================
     IMPORT
  ============================== */

  importSales(): void {

  if (!this.selectedFile) {

    this.globalError =
      'Selecciona un archivo Excel.';

    return;
  }


  if (this.validSales.length === 0) {

    this.globalError =
      'No existen ventas válidas para importar.';

    return;
  }


  this.importing = true;

  this.globalError = '';

  this.importResult = null;


  /*
   * Obtenemos la empresa real
   * asociada al usuario Firebase.
   */

  this.companyApi
    .getMyCompany()
    .subscribe({

      next: company => {

        if (!company?.id) {

          this.globalError =
            'No se encontró una empresa configurada.';

          this.importing =
            false;

          return;
        }


        /*
         * Importamos usando
         * el ID real de PostgreSQL.
         */

        this.salesApi
          .importExcel(
            company.id,
            this.selectedFile!
          )
          .subscribe({

            next: response => {

              console.log(
                'Resultado importación:',
                response
              );

              this.importResult =
                response;

              this.importCompleted =
                true;

              this.importing =
                false;

            },

            error: error => {

              console.error(
                'Error importando ventas:',
                error
              );

              this.globalError =
                'No fue posible importar las ventas. Intenta nuevamente.';

              this.importing =
                false;

            }

          });

      },

      error: error => {

        console.error(
          'Error obteniendo empresa:',
          error
        );

        this.globalError =
          'No se encontró una empresa configurada para este usuario.';

        this.importing =
          false;

      }

    });

}


  /* ==============================
     NAVIGATION
  ============================== */

  goToSales(): void {


    this.router.navigate([
      '/dashboard/sales'
    ]);

  }


  goBack(): void {


    this.router.navigate([
      '/dashboard/sales/import'
    ]);

  }


  /* ==============================
     RESET
  ============================== */

  resetPreview(): void {


    this.previewSales =
      [];


    this.selectedFile =
      null;


    this.fileName =
      '';


    this.fileProcessed =
      false;


    this.importCompleted =
      false;


    this.importing =
      false;


    this.importResult =
      null;


    this.globalError =
      '';

  }

}