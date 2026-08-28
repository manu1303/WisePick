import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

import {
  ClientsApiService,
  ApiClient,
  ClientRequest
} from '../../../../core/services/clients-api.service';

import {
  CompanyApiService
} from '../../../../core/services/company-api.service';


interface Client {

  id: string;

  name: string;

  phone: string;

  email: string;

  city: string;

  status: 'active' | 'inactive';

  createdAt: string;
}


interface Sale {

  id: string;

  customerId?: string;

  customerName: string;

  total: number;

  saleDate: string;
}


interface ClientForm {

  name: string;

  phone: string;

  email: string;

  city: string;
}


@Component({
  selector: 'app-clients',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './clients.component.html',
  styleUrls: ['./clients.component.scss']
})
export class ClientsComponent implements OnInit {

  clients: Client[] = [];

  sales: Sale[] = [];

  searchTerm = '';

  statusFilter = 'all';

  showClientForm = false;

  editingClientId: string | null = null;

  showErrors = false;

  loading = false;

  saving = false;

  globalError = '';

  companyId: string | null = null;


  clientForm: ClientForm = {

    name: '',

    phone: '',

    email: '',

    city: ''

  };


  constructor(
    private clientsApi: ClientsApiService,
    private companyApi: CompanyApiService
  ) {}


  ngOnInit(): void {

    this.loadCompany();

    this.loadSales();
  }


  /* ============================
     LOAD COMPANY
  ============================ */

  private loadCompany(): void {

    this.loading = true;

    this.globalError = '';


    this.companyApi
      .getMyCompany()
      .subscribe({

        next: company => {

          if (!company?.id) {

            this.globalError =
              'No se encontró una empresa configurada.';

            this.loading = false;

            return;
          }


          this.companyId =
            company.id;


          this.loadClients();

        },


        error: error => {

          console.error(
            'Error cargando empresa:',
            error
          );


          this.globalError =
            'No fue posible cargar la empresa.';


          this.loading = false;

        }

      });

  }


  /* ============================
     LOAD
  ============================ */

  loadClients(): void {

    this.loading = true;

    this.globalError = '';


    this.clientsApi
      .getClients()
      .subscribe({

        next: clients => {

          this.clients =
            clients.map(
              client =>
                this.mapApiClient(
                  client
                )
            );


          this.loading = false;

        },


        error: error => {

          console.error(
            'Error cargando clientes:',
            error
          );


          this.globalError =
            'No fue posible cargar los clientes.';


          this.loading = false;

        }

      });

  }


  loadSales(): void {

    this.sales =
      JSON.parse(
        localStorage.getItem(
          'wisepick_sales'
        ) || '[]'
      );

  }


  /* ============================
     MAP API
  ============================ */

  private mapApiClient(
    client: ApiClient
  ): Client {

    return {

      id:
        client.id,

      name:
        client.name,

      phone:
        client.phone || '',

      email:
        client.email || '',

      city:
        client.city || '',

      status:
        client.status === 'ACTIVE'
          ? 'active'
          : 'inactive',

      createdAt:
        client.createdAt

    };

  }


  /* ============================
     KPIs
  ============================ */

  get totalClients(): number {

    return this.clients.length;
  }


  get activeClients(): number {

    return this.clients.filter(
      client =>
        client.status === 'active'
    ).length;

  }


  get clientsWithPurchases(): number {

    return this.clients.filter(

      client =>
        this.getClientSalesCount(
          client.id
        ) > 0

    ).length;

  }


  get totalClientRevenue(): number {

    return this.sales
      .filter(
        sale => !!sale.customerId
      )
      .reduce(
        (sum, sale) =>
          sum + Number(sale.total),
        0
      );

  }


  /* ============================
     ANALYTICS CLIENT
  ============================ */

  getClientSales(
    clientId: string
  ): Sale[] {

    return this.sales.filter(
      sale =>
        sale.customerId === clientId
    );

  }


  getClientSalesCount(
    clientId: string
  ): number {

    return this.getClientSales(
      clientId
    ).length;

  }


  getClientTotal(
    clientId: string
  ): number {

    return this.getClientSales(
      clientId
    ).reduce(

      (sum, sale) =>
        sum + Number(sale.total),

      0
    );

  }


  getClientAverageTicket(
    clientId: string
  ): number {

    const sales =
      this.getClientSales(
        clientId
      );


    if (!sales.length) {

      return 0;

    }


    return (
      this.getClientTotal(clientId) /
      sales.length
    );

  }


  getLastPurchase(
    clientId: string
  ): string {

    const sales =
      this.getClientSales(clientId);


    if (!sales.length) {

      return 'Sin compras';

    }


    const sorted =
      [...sales].sort(

        (a, b) =>
          new Date(b.saleDate).getTime() -
          new Date(a.saleDate).getTime()

      );


    return sorted[0].saleDate;

  }


  /* ============================
     FILTER
  ============================ */

  get filteredClients(): Client[] {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    return this.clients.filter(

      client => {

        const matchesSearch =

          !term ||

          client.name
            .toLowerCase()
            .includes(term) ||

          client.phone
            .toLowerCase()
            .includes(term) ||

          client.email
            .toLowerCase()
            .includes(term);


        const matchesStatus =

          this.statusFilter === 'all' ||

          client.status ===
            this.statusFilter;


        return (
          matchesSearch &&
          matchesStatus
        );

      }

    );

  }


  /* ============================
     CREATE
  ============================ */

  openNewClient(): void {

    this.editingClientId = null;

    this.showErrors = false;

    this.globalError = '';


    this.clientForm = {

      name: '',

      phone: '',

      email: '',

      city: ''

    };


    this.showClientForm = true;
  }


  /* ============================
     EDIT
  ============================ */

  editClient(
    client: Client
  ): void {

    this.editingClientId =
      client.id;


    this.clientForm = {

      name:
        client.name,

      phone:
        client.phone,

      email:
        client.email,

      city:
        client.city

    };


    this.showErrors = false;

    this.globalError = '';

    this.showClientForm = true;
  }


  /* ============================
     VALIDATION
  ============================ */

  private isValid(): boolean {

    return !!(
      this.clientForm.name
    );

  }


  /* ============================
     SAVE
  ============================ */

  saveClient(): void {

    this.showErrors = true;

    this.globalError = '';


    if (!this.isValid()) {

      return;

    }


    if (!this.companyId) {

      this.globalError =
        'No se encontró una empresa configurada.';

      return;
    }


    this.saving = true;


    const currentClient =
      this.editingClientId
        ? this.clients.find(
            client =>
              client.id ===
              this.editingClientId
          )
        : null;


    const request: ClientRequest = {

      companyId:
        this.companyId,

      name:
        this.clientForm.name.trim(),

      phone:
        this.clientForm.phone.trim(),

      email:
        this.clientForm.email.trim(),

      city:
        this.clientForm.city.trim(),

      status:
        currentClient?.status === 'inactive'
          ? 'INACTIVE'
          : 'ACTIVE'

    };


    /*
      EDITAR
    */

    if (this.editingClientId) {

      this.clientsApi
        .updateClient(
          this.editingClientId,
          request
        )
        .subscribe({

          next: response => {

            const index =
              this.clients.findIndex(
                client =>
                  client.id === response.id
              );


            if (index !== -1) {

              this.clients[index] =
                this.mapApiClient(
                  response
                );

            }


            this.saving = false;

            this.closeForm();

          },


          error: error => {

            console.error(
              'Error actualizando cliente:',
              error
            );


            this.globalError =
              'No fue posible actualizar el cliente.';


            this.saving = false;

          }

        });


      return;
    }


    /*
      CREAR
    */

    this.clientsApi
      .createClient(
        request
      )
      .subscribe({

        next: response => {

          this.clients.unshift(
            this.mapApiClient(
              response
            )
          );


          this.saving = false;

          this.closeForm();

        },


        error: error => {

          console.error(
            'Error creando cliente:',
            error
          );


          this.globalError =
            'No fue posible crear el cliente.';


          this.saving = false;

        }

      });

  }


  /* ============================
     DELETE
  ============================ */

  deleteClient(
    client: Client
  ): void {

    const purchases =
      this.getClientSalesCount(
        client.id
      );


    if (purchases > 0) {

      alert(
        'Este cliente tiene ventas asociadas. Puedes desactivarlo, pero no eliminarlo.'
      );

      return;

    }


    const confirmed =
      window.confirm(
        `¿Deseas eliminar a "${client.name}"?`
      );


    if (!confirmed) {

      return;

    }


    this.globalError = '';


    this.clientsApi
      .deleteClient(
        client.id
      )
      .subscribe({

        next: () => {

          this.clients =
            this.clients.filter(

              item =>
                item.id !== client.id

            );

        },


        error: error => {

          console.error(
            'Error eliminando cliente:',
            error
          );


          this.globalError =
            'No fue posible eliminar el cliente.';

        }

      });

  }


  /* ============================
     STATUS
  ============================ */

  toggleStatus(
    client: Client
  ): void {

    if (!this.companyId) {

      this.globalError =
        'No se encontró una empresa configurada.';

      return;
    }


    const newStatus =
      client.status === 'active'
        ? 'INACTIVE'
        : 'ACTIVE';


    const request: ClientRequest = {

      companyId:
        this.companyId,

      name:
        client.name,

      phone:
        client.phone,

      email:
        client.email,

      city:
        client.city,

      status:
        newStatus

    };


    this.clientsApi
      .updateClient(
        client.id,
        request
      )
      .subscribe({

        next: response => {

          const index =
            this.clients.findIndex(
              item =>
                item.id === client.id
            );


          if (index !== -1) {

            this.clients[index] =
              this.mapApiClient(
                response
              );

          }

        },


        error: error => {

          console.error(
            'Error cambiando estado del cliente:',
            error
          );


          this.globalError =
            'No fue posible cambiar el estado del cliente.';

        }

      });

  }


  /* ============================
     UI
  ============================ */

  closeForm(): void {

    this.showClientForm = false;

    this.editingClientId = null;

    this.showErrors = false;

    this.saving = false;

  }


  clearFilters(): void {

    this.searchTerm = '';

    this.statusFilter = 'all';

  }

}