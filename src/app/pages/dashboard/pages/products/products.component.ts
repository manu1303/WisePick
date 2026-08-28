import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ProductsApiService,
  ApiProduct,
  ProductRequest
} from '../../../../core/services/products-api.service';

import {
  CompanyApiService
} from '../../../../core/services/company-api.service';


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

  createdAt: string;

}


interface ProductForm {

  name: string;

  category: string;

  sku: string;

  cost: number;

  price: number;

  stock: number;

}


@Component({
  selector: 'app-products',

  standalone: true,

  imports: [
    CommonModule,
    FormsModule
  ],

  templateUrl:
    './products.component.html',

  styleUrls: [
    './products.component.scss'
  ]
})
export class ProductsComponent
  implements OnInit {


  products:
    Product[] = [];


  searchTerm =
    '';


  categoryFilter =
    'all';


  showProductForm =
    false;


  editingProductId:
    string | null =
    null;


  showErrors =
    false;


  loading =
    false;


  saving =
    false;


  globalError =
    '';


  companyId:
    string | null =
    null;


  productForm:
    ProductForm = {

      name:
        '',

      category:
        '',

      sku:
        '',

      cost:
        0,

      price:
        0,

      stock:
        0

    };


  constructor(

    private productsApi:
      ProductsApiService,

    private companyApi:
      CompanyApiService

  ) {}


  ngOnInit(): void {

    this.loadCompany();

  }


  /* ============================
     LOAD COMPANY
  ============================ */

  private loadCompany(): void {


    this.loading =
      true;


    this.globalError =
      '';


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


              this.loading =
                false;


              return;

            }


            this.companyId =
              company.id;


            this.loadProducts();

          },


        error:
          error => {


            console.error(
              'Error cargando empresa:',
              error
            );


            this.globalError =
              'No fue posible cargar la empresa.';


            this.loading =
              false;

          }

      });

  }


  /* ============================
     LOAD PRODUCTS
  ============================ */

  loadProducts(): void {


    this.loading =
      true;


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


            this.loading =
              false;

          },


        error:
          error => {


            console.error(
              'Error cargando productos:',
              error
            );


            this.globalError =
              'No fue posible cargar los productos.';


            this.loading =
              false;

          }

      });

  }


  /* ============================
     API MAPPING
  ============================ */

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

      sku:
        product.sku || '',

      cost:
        Number(
          product.cost || 0
        ),

      price:
        Number(
          product.price
        ),

      stock:
        Number(
          product.stock
        ),

      status:
        product.status === 'ACTIVE'
          ? 'active'
          : 'inactive',

      createdAt:
        product.createdAt

    };

  }


  /* ============================
     KPIs
  ============================ */

  get totalProducts(): number {


    return this.products.length;

  }


  get activeProducts(): number {


    return this.products.filter(
      product =>
        product.status ===
        'active'
    ).length;

  }


  get totalStock(): number {


    return this.products.reduce(
      (
        sum,
        product
      ) =>
        sum +
        Number(
          product.stock
        ),
      0
    );

  }


  get inventoryValue(): number {


    return this.products.reduce(
      (
        sum,
        product
      ) =>
        sum +
        (
          Number(
            product.cost
          )
          *
          Number(
            product.stock
          )
        ),
      0
    );

  }


  /* ============================
     FILTER
  ============================ */

  get filteredProducts():
    Product[] {


    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    return this.products.filter(
      product => {


        const matchesSearch =
          !term ||

          product.name
            .toLowerCase()
            .includes(
              term
            )

          ||

          product.sku
            .toLowerCase()
            .includes(
              term
            );


        const matchesCategory =
          this.categoryFilter ===
            'all'

          ||

          product.category ===
            this.categoryFilter;


        return (
          matchesSearch &&
          matchesCategory
        );

      }
    );

  }


  get categories():
    string[] {


    return [

      ...new Set(

        this.products

          .map(
            product =>
              product.category
          )

          .filter(
            Boolean
          )

      )

    ];

  }


  /* ============================
     MARGIN
  ============================ */

  getMargin(
    product: Product
  ): number {


    if (
      !product.price ||
      product.price <= 0
    ) {

      return 0;

    }


    return (

      (
        product.price -
        product.cost
      )

      /

      product.price

    ) * 100;

  }


  /* ============================
     NEW PRODUCT
  ============================ */

  openNewProduct(): void {


    this.editingProductId =
      null;


    this.showErrors =
      false;


    this.globalError =
      '';


    this.productForm = {

      name:
        '',

      category:
        '',

      sku:
        '',

      cost:
        0,

      price:
        0,

      stock:
        0

    };


    this.showProductForm =
      true;

  }


  /* ============================
     EDIT
  ============================ */

  editProduct(
    product: Product
  ): void {


    this.editingProductId =
      product.id;


    this.productForm = {

      name:
        product.name,

      category:
        product.category,

      sku:
        product.sku,

      cost:
        product.cost,

      price:
        product.price,

      stock:
        product.stock

    };


    this.showErrors =
      false;


    this.globalError =
      '';


    this.showProductForm =
      true;

  }


  /* ============================
     VALIDATE
  ============================ */

  private isValid():
    boolean {


    return !!(

      this.productForm.name &&

      this.productForm.category &&

      Number(
        this.productForm.price
      ) > 0 &&

      Number(
        this.productForm.cost
      ) >= 0 &&

      Number(
        this.productForm.stock
      ) >= 0

    );

  }


  /* ============================
     SAVE
  ============================ */

  saveProduct(): void {


    this.showErrors =
      true;


    this.globalError =
      '';


    if (
      !this.isValid()
    ) {

      return;

    }


    if (
      !this.companyId
    ) {


      this.globalError =
        'No se encontró una empresa configurada.';


      return;

    }


    this.saving =
      true;


    const currentProduct =
      this.editingProductId

        ? this.products.find(
            product =>
              product.id ===
              this.editingProductId
          )

        : null;


    const request:
      ProductRequest = {


      companyId:
        this.companyId,


      name:
        this.productForm.name
          .trim(),


      category:
        this.productForm.category,


      sku:
        this.productForm.sku
          .trim()

          ||

          this.generateSku(),


      cost:
        Number(
          this.productForm.cost
        ),


      price:
        Number(
          this.productForm.price
        ),


      stock:
        Number(
          this.productForm.stock
        ),


      status:
        currentProduct?.status ===
          'inactive'

          ? 'INACTIVE'

          : 'ACTIVE'

    };


    /*
     * EDIT
     */

    if (
      this.editingProductId
    ) {


      this.productsApi
        .updateProduct(
          this.editingProductId,
          request
        )
        .subscribe({


          next:
            response => {


              const index =
                this.products.findIndex(
                  product =>
                    product.id ===
                    response.id
                );


              if (
                index !== -1
              ) {


                this.products[index] =
                  this.mapApiProduct(
                    response
                  );

              }


              this.saving =
                false;


              this.closeForm();

            },


          error:
            error => {


              console.error(
                'Error actualizando producto:',
                error
              );


              this.globalError =
                'No fue posible actualizar el producto.';


              this.saving =
                false;

            }

        });


      return;

    }


    /*
     * CREATE
     */

    this.productsApi
      .createProduct(
        request
      )
      .subscribe({


        next:
          response => {


            this.products.unshift(
              this.mapApiProduct(
                response
              )
            );


            this.saving =
              false;


            this.closeForm();

          },


        error:
          error => {


            console.error(
              'Error creando producto:',
              error
            );


            this.globalError =
              'No fue posible crear el producto.';


            this.saving =
              false;

          }

      });

  }


  /* ============================
     DELETE
  ============================ */

  deleteProduct(
    product: Product
  ): void {


    const confirmed =
      window.confirm(
        `¿Deseas eliminar "${product.name}"?`
      );


    if (
      !confirmed
    ) {

      return;

    }


    this.globalError =
      '';


    this.productsApi
      .deleteProduct(
        product.id
      )
      .subscribe({


        next:
          () => {


            this.products =
              this.products.filter(
                item =>
                  item.id !==
                  product.id
              );

          },


        error:
          error => {


            console.error(
              'Error eliminando producto:',
              error
            );


            this.globalError =
              'No fue posible eliminar el producto.';

          }

      });

  }


  /* ============================
     STATUS
  ============================ */

  toggleStatus(
    product: Product
  ): void {


    if (
      !this.companyId
    ) {


      this.globalError =
        'No se encontró una empresa configurada.';


      return;

    }


    const newStatus =
      product.status ===
        'active'

        ? 'INACTIVE'

        : 'ACTIVE';


    const request:
      ProductRequest = {


      companyId:
        this.companyId,


      name:
        product.name,


      category:
        product.category,


      sku:
        product.sku,


      cost:
        Number(
          product.cost
        ),


      price:
        Number(
          product.price
        ),


      stock:
        Number(
          product.stock
        ),


      status:
        newStatus

    };


    this.productsApi
      .updateProduct(
        product.id,
        request
      )
      .subscribe({


        next:
          response => {


            const index =
              this.products.findIndex(
                item =>
                  item.id ===
                  product.id
              );


            if (
              index !== -1
            ) {


              this.products[index] =
                this.mapApiProduct(
                  response
                );

            }

          },


        error:
          error => {


            console.error(
              'Error cambiando estado del producto:',
              error
            );


            this.globalError =
              'No fue posible cambiar el estado del producto.';

          }

      });

  }


  /* ============================
     SKU
  ============================ */

  private generateSku():
    string {


    const name =
      this.productForm.name
        .trim()
        .toUpperCase()
        .replace(
          /\s+/g,
          '-'
        )
        .substring(
          0,
          8
        );


    const number =
      Math.floor(
        1000 +
        Math.random() *
        9000
      );


    return `${name}-${number}`;

  }


  /* ============================
     CLOSE
  ============================ */

  closeForm(): void {


    this.showProductForm =
      false;


    this.editingProductId =
      null;


    this.showErrors =
      false;


    this.saving =
      false;

  }


  /* ============================
     FILTERS
  ============================ */

  clearFilters(): void {


    this.searchTerm =
      '';


    this.categoryFilter =
      'all';

  }

}