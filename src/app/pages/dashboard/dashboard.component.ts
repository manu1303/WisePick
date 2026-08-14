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
  type: 'warning' | 'info' | 'success';
}


interface Product {
  id: string;
  name: string;
  stock: number;
  status: 'active' | 'inactive';
}


interface Sale {
  id: string;
  customerId?: string | null;
}


interface Campaign {
  id: string;
  name: string;

  status:
    | 'draft'
    | 'active'
    | 'completed';
}


@Component({
  selector: 'app-dashboard',
  standalone: true,

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
  ],
})
export class DashboardComponent
  implements OnInit {


  /* ============================
     MODE
  ============================ */

  isDemoMode = false;

  baseRoute =
    '/dashboard';


  /* ============================
     SIDEBAR
  ============================ */

  isSidebarCollapsed = false;


  /* ============================
     DROPDOWNS
  ============================ */

  showAddMenu = false;

  showNotifications = false;

  showUserMenu = false;


  /* ============================
     USER
  ============================ */

  currentUser:
    CurrentUser = {

      isAuthenticated: false

    };


  /* ============================
     NOTIFICATIONS
  ============================ */

  notifications:
    NotificationItem[] = [];


  constructor(

    private router:
      Router,

    private route:
      ActivatedRoute,

    private auth:
      Auth

  ) {}


  ngOnInit(): void {

    /*
     * Determinamos si el Dashboard
     * fue abierto desde:
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
        .data['mode'] === 'demo';


    this.baseRoute =
      this.isDemoMode
        ? '/demo'
        : '/dashboard';


    /*
     * En modo demo ignoramos
     * deliberadamente cualquier
     * sesión Firebase existente.
     */

    if (
      this.isDemoMode
    ) {

      this.currentUser = {

        isAuthenticated:
          false

      };

    } else {

      this.listenAuthState();

    }


    this.generateNotifications();

  }


  /* ============================
     FIREBASE AUTH
  ============================ */

  private listenAuthState(): void {

    onAuthStateChanged(
      this.auth,
      user => {

        if (user) {

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

        } else {

          this.currentUser = {

            isAuthenticated:
              false

          };

        }

      }
    );

  }


  async logout(): Promise<void> {

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

    return `${this.baseRoute}${route}`;

  }


  /* ============================
     SIDEBAR
  ============================ */

  toggleSidebar(): void {

    this.isSidebarCollapsed =
      !this.isSidebarCollapsed;

  }


  /* ============================
     ADD DATA MENU
  ============================ */

  toggleAddMenu(): void {

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

  toggleNotifications(): void {

    this.showNotifications =
      !this.showNotifications;


    this.showAddMenu =
      false;

    this.showUserMenu =
      false;

  }


  /* ============================
     USER MENU
  ============================ */

  toggleUserMenu(): void {

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

  closeMenus(): void {

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
     * Las rutas antiguas del
     * componente siguen usando
     * /dashboard.
     *
     * Si estamos en demo,
     * las convertimos automáticamente
     * a /demo.
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


  goToLanding(): void {

    this.closeMenus();


    this.router.navigate([
      '/'
    ]);

  }


  /* ============================
     NOTIFICATION ENGINE
  ============================ */

  private generateNotifications():
    void {

    const generated:
      NotificationItem[] = [];


    const products: Product[] =
      JSON.parse(
        localStorage.getItem(
          'wisepick_products'
        ) || '[]'
      );


    const sales: Sale[] =
      JSON.parse(
        localStorage.getItem(
          'wisepick_sales'
        ) || '[]'
      );


    const campaigns: Campaign[] =
      JSON.parse(
        localStorage.getItem(
          'wisepick_campaigns'
        ) || '[]'
      );


    /* STOCK BAJO */

    const lowStock =
      products.filter(
        product =>
          product.status ===
            'active' &&
          Number(product.stock) <= 5
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


    /* CLIENTES NO IDENTIFICADOS */

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


    /* CAMPAÑAS ACTIVAS */

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

  }


  /* ============================
     USER DISPLAY
  ============================ */

  get userInitials(): string {

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
      .slice(0, 2)
      .map(
        part =>
          part
            .charAt(0)
            .toUpperCase()
      )
      .join('');

  }

}