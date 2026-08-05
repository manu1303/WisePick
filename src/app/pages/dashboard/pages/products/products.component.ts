import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

interface Product {
  id: string;
  name: string;
  category: string;
  sku: string;
  cost: number;
  price: number;
  stock: number;
  status: 'active' | 'inactive';
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
  templateUrl: './products.component.html',
  styleUrls: ['./products.component.scss']
})
export class ProductsComponent implements OnInit {

  products: Product[] = [];

  searchTerm = '';

  categoryFilter = 'all';

  showProductForm = false;

  editingProductId: string | null = null;

  showErrors = false;


  productForm: ProductForm = {
    name: '',
    category: '',
    sku: '',
    cost: 0,
    price: 0,
    stock: 0
  };


  ngOnInit(): void {
    this.loadProducts();
  }


  /* ============================
     LOAD
  ============================ */

  loadProducts(): void {

    this.products =
      JSON.parse(
        localStorage.getItem(
          'wisepick_products'
        ) || '[]'
      );
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
        product.status === 'active'
    ).length;
  }


  get totalStock(): number {

    return this.products.reduce(
      (sum, product) =>
        sum + Number(product.stock),
      0
    );
  }


  get inventoryValue(): number {

    return this.products.reduce(
      (sum, product) =>
        sum +
        (
          Number(product.cost) *
          Number(product.stock)
        ),
      0
    );
  }


  /* ============================
     FILTER
  ============================ */

  get filteredProducts(): Product[] {

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
            .includes(term) ||
          product.sku
            .toLowerCase()
            .includes(term);


        const matchesCategory =
          this.categoryFilter === 'all' ||
          product.category ===
            this.categoryFilter;


        return (
          matchesSearch &&
          matchesCategory
        );

      }
    );
  }


  get categories(): string[] {

    return [
      ...new Set(
        this.products
          .map(product => product.category)
          .filter(Boolean)
      )
    ];
  }


  /* ============================
     MARGIN
  ============================ */

  getMargin(product: Product): number {

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
      ) /
      product.price
    ) * 100;
  }


  /* ============================
     NEW PRODUCT
  ============================ */

  openNewProduct(): void {

    this.editingProductId = null;

    this.showErrors = false;

    this.productForm = {
      name: '',
      category: '',
      sku: '',
      cost: 0,
      price: 0,
      stock: 0
    };

    this.showProductForm = true;
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

    this.showErrors = false;

    this.showProductForm = true;
  }


  /* ============================
     VALIDATE
  ============================ */

  private isValid(): boolean {

    return !!(
      this.productForm.name &&
      this.productForm.category &&
      this.productForm.price > 0 &&
      this.productForm.cost >= 0 &&
      this.productForm.stock >= 0
    );
  }


  /* ============================
     SAVE
  ============================ */

  saveProduct(): void {

    this.showErrors = true;

    if (!this.isValid()) {
      return;
    }


    /*
      EDIT
    */

    if (this.editingProductId) {

      const index =
        this.products.findIndex(
          product =>
            product.id ===
            this.editingProductId
        );


      if (index !== -1) {

        this.products[index] = {

          ...this.products[index],

          name:
            this.productForm.name,

          category:
            this.productForm.category,

          sku:
            this.productForm.sku,

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
            )
        };
      }

    }

    /*
      CREATE
    */

    else {

      const newProduct: Product = {

        id:
          crypto.randomUUID(),

        name:
          this.productForm.name,

        category:
          this.productForm.category,

        sku:
          this.productForm.sku ||
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
          'active',

        createdAt:
          new Date().toISOString()
      };


      this.products.unshift(
        newProduct
      );

    }


    this.persistProducts();

    this.closeForm();
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


    if (!confirmed) {
      return;
    }


    this.products =
      this.products.filter(
        item =>
          item.id !== product.id
      );


    this.persistProducts();
  }


  /* ============================
     STATUS
  ============================ */

  toggleStatus(
    product: Product
  ): void {

    product.status =
      product.status === 'active'
        ? 'inactive'
        : 'active';


    this.persistProducts();
  }


  /* ============================
     STORAGE
  ============================ */

  private persistProducts(): void {

    localStorage.setItem(
      'wisepick_products',
      JSON.stringify(
        this.products
      )
    );
  }


  /* ============================
     SKU
  ============================ */

  private generateSku(): string {

    const name =
      this.productForm.name
        .trim()
        .toUpperCase()
        .replace(/\s+/g, '-')
        .substring(0, 8);


    const number =
      Math.floor(
        1000 +
        Math.random() * 9000
      );


    return `${name}-${number}`;
  }


  /* ============================
     CLOSE
  ============================ */

  closeForm(): void {

    this.showProductForm = false;

    this.editingProductId = null;

    this.showErrors = false;
  }


  clearFilters(): void {

    this.searchTerm = '';

    this.categoryFilter = 'all';
  }

}