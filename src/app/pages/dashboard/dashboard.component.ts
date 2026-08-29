import {
  Component,
  OnInit
} from '@angular/core';

import {
  CommonModule
} from '@angular/common';

import {
  ActivatedRoute,
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

import {
  Auth,
  onAuthStateChanged,
  signOut
} from '@angular/fire/auth';

import {
  SalesApiService
} from '../../core/services/sales-api.service';

import {
  ProductsApiService
} from '../../core/services/products-api.service';

import {
  CampaignsApiService,
  CampaignApi
} from '../../core/services/campaigns-api.service';


/* ============================
   INTERFACES
============================ */

interface CurrentUser {

  isAuthenticated: boolean;

  name?: string;

  email?: string;

}


interface NotificationItem {

  id: string;

  icon: string;

  title: string;

  description: string;

  route: string;

  type:
    | 'warning'
    | 'info'
    | 'success';

}


interface Product {

  id: string;

  name: string;

  stock: number;

  status:
    | 'active'
    | 'inactive';

}


interface Sale {

  id: string;

  customerId?:
    string | null;

}


interface Campaign {

  id: string;

  name: string;

  status:
    | 'draft'
    | 'active'
    | 'completed';

}


/* ============================
   COMPONENT
============================ */

@Component({

  selector:
    'app-dashboard',

  standalone:
    true,

  imports: [

    CommonModule,

    RouterLink,

    RouterLinkActive,

    RouterOutlet

  ],

  templateUrl:
    './dashboard.component.html',

  styleUrls: [
    './dashboard.component.scss'
  ]

})
export class DashboardComponent
  implements OnInit {


  /* ============================
     MODE
  ============================ */

  isDemoMode =
    false;


  baseRoute =
    '/dashboard';


  /* ============================
     SIDEBAR
  ============================ */

  isSidebarCollapsed =
    false;


  /* ============================
     DROPDOWNS
  ============================ */

  showAddMenu =
    false;


  showNotifications =
    false;


  showUserMenu =
    false;


  /* ============================
     USER
  ============================ */

  currentUser:
    CurrentUser = {

      isAuthenticated:
        false

    };


  /* ============================
     NOTIFICATIONS
  ============================ */

  notifications:
    NotificationItem[] = [];


  /*
   * El badge representa únicamente
   * las notificaciones todavía no vistas.
   */

  unreadNotifications =
    0;


  /*
   * Evita que una actualización producida
   * al abrir la campana vuelva a marcar
   * las mismas notificaciones como nuevas.
   */

  private notificationsViewed =
    false;


  /* ============================
     CONSTRUCTOR
  ============================ */

  constructor(

    private router:
      Router,

    private route:
      ActivatedRoute,

    private auth:
      Auth,

    private salesApi:
      SalesApiService,

    private productsApi:
      ProductsApiService,

    private campaignsApi:
      CampaignsApiService

  ) {}


  /* ============================
     INIT
  ============================ */

  ngOnInit(): void {


    /*
     * Determinamos si estamos en:
     *
     * /demo
     *
     * o:
     *
     * /dashboard
     */

    this.isDemoMode =
      this.route
        .snapshot
        .data['mode'] ===
        'demo';


    this.baseRoute =
      this.isDemoMode
        ? '/demo'
        : '/dashboard';


    /*
     * En demo ignoramos cualquier
     * sesión Firebase existente.
     */

    if (
      this.isDemoMode
    ) {

      this.currentUser = {

        isAuthenticated:
          false

      };

    }

    else {

      this.listenAuthState();

    }


    /*
     * Generamos las notificaciones
     * iniciales.
     */

    if (
      this.isDemoMode
    ) {

      this.generateDemoNotifications(
        true
      );

    }

    else {

      this.generateNotifications(
        true
      );

    }

  }


  /* ============================
     FIREBASE AUTH
  ============================ */

  private listenAuthState():
  void {

    onAuthStateChanged(

      this.auth,

      user => {


        if (
          user
        ) {

          this.currentUser = {

            isAuthenticated:
              true,

            name:
              user.displayName ||
              'Usuario WisePick',

            email:
              user.email ||
              ''

          };

        }

        else {

          this.currentUser = {

            isAuthenticated:
              false

          };

        }

      }

    );

  }


  /* ============================
     LOGOUT
  ============================ */

  async logout():
  Promise<void> {

    this.closeMenus();


    await signOut(
      this.auth
    );


    await this.router.navigate([
      '/login'
    ]);

  }


  /* ============================
     ROUTES
  ============================ */

  appRoute(
    route: string
  ): string {

    return (
      `${this.baseRoute}${route}`
    );

  }


  /* ============================
     SIDEBAR
  ============================ */

  toggleSidebar():
  void {

    this.isSidebarCollapsed =
      !this.isSidebarCollapsed;

  }


  /* ============================
     ADD DATA MENU
  ============================ */

  toggleAddMenu():
  void {

    this.showAddMenu =
      !this.showAddMenu;


    this.showNotifications =
      false;


    this.showUserMenu =
      false;

  }


  /* ============================
     NOTIFICATIONS
  ============================ */

  toggleNotifications():
  void {

    this.showNotifications =
      !this.showNotifications;


    this.showAddMenu =
      false;


    this.showUserMenu =
      false;


    /*
     * Al abrir la campana volvemos
     * a consultar las APIs.
     *
     * Así no hace falta refrescar
     * toda la página.
     */

    if (
      this.showNotifications
    ) {

      this.notificationsViewed =
        true;


      /*
       * Lo que ya abrió el usuario
       * deja de considerarse no leído.
       */

      this.unreadNotifications =
        0;


      if (
        this.isDemoMode
      ) {

        this.generateDemoNotifications(
          false
        );

      }

      else {

        this.generateNotifications(
          false
        );

      }

    }

  }


  /* ============================
     USER MENU
  ============================ */

  toggleUserMenu():
  void {

    this.showUserMenu =
      !this.showUserMenu;


    this.showAddMenu =
      false;


    this.showNotifications =
      false;

  }


  /* ============================
     CLOSE MENUS
  ============================ */

  closeMenus():
  void {

    this.showAddMenu =
      false;


    this.showNotifications =
      false;


    this.showUserMenu =
      false;

  }


  /* ============================
     NAVIGATION
  ============================ */

  navigateTo(
    route: string
  ): void {

    this.closeMenus();


    /*
     * Las rutas antiguas siguen
     * utilizando /dashboard.
     *
     * En demo cambiamos automáticamente
     * /dashboard por /demo.
     */

    if (

      this.isDemoMode &&

      route.startsWith(
        '/dashboard'
      )

    ) {

      route =
        route.replace(

          '/dashboard',

          '/demo'

        );

    }


    this.router.navigate([
      route
    ]);

  }


  goToLanding():
  void {

    this.closeMenus();


    this.router.navigate([
      '/'
    ]);

  }


  /* ============================
     NOTIFICATION ENGINE
  ============================ */

  private generateNotifications(
    markAsUnread:
      boolean = false
  ):
  void {


    /*
     * Este arreglo se reconstruye
     * completamente en cada consulta.
     *
     * Así evitamos duplicar
     * notificaciones.
     */

    const generated:
      NotificationItem[] = [];


    let productsLoaded =
      false;


    let salesLoaded =
      false;


    let campaignsLoaded =
      false;


    let products:
      Product[] = [];


    let sales:
      Sale[] = [];


    let campaigns:
      Campaign[] = [];


    /* ============================
       BUILD NOTIFICATIONS
    ============================ */

    const buildNotifications =
      () => {


        /*
         * Esperamos a que las tres
         * APIs hayan terminado.
         */

        if (

          !productsLoaded ||

          !salesLoaded ||

          !campaignsLoaded

        ) {

          return;

        }


        /* ============================
           STOCK BAJO
        ============================ */

        const lowStock =
          products.filter(

            product =>

              product.status ===
                'active'

              &&

              Number(
                product.stock
              ) <= 5

          );


        if (
          lowStock.length > 0
        ) {

          generated.push({

            id:
              'low-stock',

            icon:
              '📦',

            title:
              'Stock bajo',

            description:
              `${lowStock.length} producto(s) tienen 5 unidades o menos.`,

            route:
              `${this.baseRoute}/products`,

            type:
              'warning'

          });

        }


        /* ============================
           CLIENTES NO IDENTIFICADOS
        ============================ */

        if (
          sales.length > 0
        ) {


          const anonymous =
            sales.filter(

              sale =>
                !sale.customerId

            ).length;


          if (
            anonymous > 0
          ) {

            generated.push({

              id:
                'anonymous-sales',

              icon:
                '👥',

              title:
                'Clientes por identificar',

              description:
                `${anonymous} venta(s) no tienen cliente identificado.`,

              route:
                `${this.baseRoute}/clients`,

              type:
                'info'

            });

          }

        }


        /* ============================
           CAMPAÑAS ACTIVAS
        ============================ */

        const activeCampaigns =
          campaigns.filter(

            campaign =>
              campaign.status ===
              'active'

          );


        if (
          activeCampaigns.length > 0
        ) {

          generated.push({

            id:
              'active-campaigns',

            icon:
              '🎯',

            title:
              'Campañas activas',

            description:
              `${activeCampaigns.length} campaña(s) están actualmente activas.`,

            route:
              `${this.baseRoute}/campaigns`,

            type:
              'success'

          });

        }


        /*
         * Sustituimos el contenido
         * anterior.
         *
         * Nunca acumulamos notificaciones.
         */

        this.notifications =
          generated;


        /*
         * Solo la carga inicial
         * se marca como no leída.
         *
         * Cuando el usuario abre
         * la campana, hacemos refresh,
         * pero mantenemos el badge en 0.
         */

        if (
          markAsUnread &&
          !this.notificationsViewed
        ) {

          this.unreadNotifications =
            generated.length;

        }

      };


    /* ============================
       PRODUCTS API
    ============================ */

    this.productsApi
      .getProducts()
      .subscribe({

        next:
          apiProducts => {


            products =
              apiProducts.map(

                product => ({

                  id:
                    product.id,

                  name:
                    product.name,

                  stock:
                    Number(
                      product.stock || 0
                    ),

                  status:
                    product.status ===
                      'ACTIVE'
                        ? 'active'
                        : 'inactive'

                })

              );


            productsLoaded =
              true;


            buildNotifications();

          },


        error:
          error => {


            console.error(

              'Error cargando productos para notificaciones:',

              error

            );


            productsLoaded =
              true;


            buildNotifications();

          }

      });


    /* ============================
       SALES API
    ============================ */

    this.salesApi
      .getSales()
      .subscribe({

        next:
          apiSales => {


            sales =
              apiSales.map(

                sale => ({

                  id:
                    sale.id,

                  customerId:
                    sale.customerId || null

                })

              );


            salesLoaded =
              true;


            buildNotifications();

          },


        error:
          error => {


            console.error(

              'Error cargando ventas para notificaciones:',

              error

            );


            salesLoaded =
              true;


            buildNotifications();

          }

      });


    /* ============================
       CAMPAIGNS API
    ============================ */

    this.campaignsApi
      .getAll()
      .subscribe({

        next:
          (
            apiCampaigns:
              CampaignApi[]
          ) => {


            campaigns =
              apiCampaigns.map(

                campaign => ({

                  id:
                    campaign.id,

                  name:
                    campaign.name,

                  status:
                    campaign.status
                      ?.toUpperCase() ===
                      'ACTIVE'
                        ? 'active'

                        : campaign.status
                            ?.toUpperCase() ===
                            'COMPLETED'
                              ? 'completed'

                              : 'draft'

                })

              );


            campaignsLoaded =
              true;


            buildNotifications();

          },


        error:
          error => {


            console.error(

              'Error cargando campañas para notificaciones:',

              error

            );


            campaignsLoaded =
              true;


            buildNotifications();

          }

      });

  }


  /* ============================
     USER DISPLAY
  ============================ */

  get userInitials():
  string {


    if (
      this.isDemoMode
    ) {

      return 'DE';

    }


    if (
      !this.currentUser
        .isAuthenticated
    ) {

      return 'DE';

    }


    const name =
      this.currentUser.name ||

      this.currentUser.email ||

      'Usuario';


    const parts =
      name
        .trim()
        .split(' ')
        .filter(

          part =>
            part.length > 0

        );


    return parts

      .slice(
        0,
        2
      )

      .map(

        part =>
          part
            .charAt(0)
            .toUpperCase()

      )

      .join('');

  }


  /* ============================
     DEMO NOTIFICATIONS
  ============================ */

  private generateDemoNotifications(
    markAsUnread:
      boolean = false
  ):
  void {


    const generated:
      NotificationItem[] = [];


    const products:
      Product[] =

        JSON.parse(

          localStorage.getItem(
            'wisepick_products'
          ) || '[]'

        );


    const sales:
      Sale[] =

        JSON.parse(

          localStorage.getItem(
            'wisepick_sales'
          ) || '[]'

        );


    const campaigns:
      Campaign[] =

        JSON.parse(

          localStorage.getItem(
            'wisepick_campaigns'
          ) || '[]'

        );


    /* ============================
       STOCK BAJO
    ============================ */

    const lowStock =
      products.filter(

        product =>

          product.status ===
            'active'

          &&

          Number(
            product.stock
          ) <= 5

      );


    if (
      lowStock.length > 0
    ) {

      generated.push({

        id:
          'low-stock',

        icon:
          '📦',

        title:
          'Stock bajo',

        description:
          `${lowStock.length} producto(s) tienen 5 unidades o menos.`,

        route:
          `${this.baseRoute}/products`,

        type:
          'warning'

      });

    }


    /* ============================
       CLIENTES NO IDENTIFICADOS
    ============================ */

    if (
      sales.length > 0
    ) {


      const anonymous =
        sales.filter(

          sale =>
            !sale.customerId

        ).length;


      if (
        anonymous > 0
      ) {

        generated.push({

          id:
            'anonymous-sales',

          icon:
            '👥',

          title:
            'Clientes por identificar',

          description:
            `${anonymous} venta(s) no tienen cliente identificado.`,

          route:
            `${this.baseRoute}/clients`,

          type:
            'info'

        });

      }

    }


    /* ============================
       CAMPAÑAS ACTIVAS
    ============================ */

    const activeCampaigns =
      campaigns.filter(

        campaign =>
          campaign.status ===
          'active'

      );


    if (
      activeCampaigns.length > 0
    ) {

      generated.push({

        id:
          'active-campaigns',

        icon:
          '🎯',

        title:
          'Campañas activas',

        description:
          `${activeCampaigns.length} campaña(s) están actualmente activas.`,

        route:
          `${this.baseRoute}/campaigns`,

        type:
          'success'

      });

    }


    this.notifications =
      generated;


    if (
      markAsUnread &&
      !this.notificationsViewed
    ) {

      this.unreadNotifications =
        generated.length;

    }

  }

}