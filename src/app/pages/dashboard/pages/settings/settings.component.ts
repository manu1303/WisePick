import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Auth,updateProfile} from '@angular/fire/auth';

import {CompanyApiService
} from '../../../../core/services/company-api.service';

import {UserPreferencesApiService,UserPreferenceRequest
} from '../../../../core/services/user-preferences-api.service';

import {Company
} from '../../../../core/models/company.model';

import {
  ThemeService
} from '../../../../core/services/theme.service';


interface UserSettings {

  fullName: string;

  email: string;

  language: string;

  currency: string;

  theme:
    'light' |
    'dark' |
    'system';

  notifications: {

    lowStock: boolean;

    campaigns: boolean;

    insights: boolean;

    reports: boolean;

  };

}


interface CompanySettings {

  name: string;

  industry: string;

  city: string;

  country: string;

  employees: string;

}


@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './settings.component.html',
  styleUrls: ['./settings.component.scss']
})
export class SettingsComponent
  implements OnInit {


  activeSection =
    'account';


  savedMessage =
    '';


  loading =
    false;


  private currentCompany:
    Company | null =
    null;


  userSettings:
    UserSettings = {

    fullName:
      '',

    email:
      '',

    language:
      'es',

    currency:
      'USD',

    theme:
      'system',

    notifications: {

      lowStock:
        true,

      campaigns:
        true,

      insights:
        true,

      reports:
        false

    }

  };


  companySettings:
    CompanySettings = {

    name:
      '',

    industry:
      '',

    city:
      '',

    country:
      'Ecuador',

    employees:
      ''

  };


  constructor(

    private auth:
      Auth,

    private companyApi:
      CompanyApiService,

    private preferencesApi:
      UserPreferencesApiService,

    private themeService:
      ThemeService  

  ) {}


  ngOnInit(): void {

    this.loadAccount();

    this.loadCompany();

    this.loadPreferences();

  }


  /* ============================
     LOAD ACCOUNT
  ============================ */

  private loadAccount(): void {

    const user =
      this.auth.currentUser;


    if (!user) {

      return;

    }


    this.userSettings.fullName =
      user.displayName || '';


    this.userSettings.email =
      user.email || '';

  }


  /* ============================
     LOAD COMPANY
  ============================ */

  private loadCompany(): void {

    this.companyApi
      .getMyCompany()
      .subscribe({

        next: company => {

          this.currentCompany =
            company;


          this.companySettings = {

            name:
              company.name || '',

            industry:
              company.industry || '',

            city:
              company.city || '',

            country:
              company.country ||
              'Ecuador',

            employees:
              company.employees || ''

          };

        },


        error: error => {

          console.error(
            'No se pudo cargar empresa:',
            error
          );

        }

      });

  }


  /* ============================
     LOAD PREFERENCES
  ============================ */

  private loadPreferences(): void {

    this.preferencesApi
      .getMyPreferences()
      .subscribe({

        next: preferences => {

          this.userSettings.language =
            preferences.language;


          this.userSettings.currency =
            preferences.currency;


          this.userSettings.theme =
            preferences.theme;

          this.themeService.setTheme(
            preferences.theme
          );  


          this.userSettings.notifications = {

            lowStock:
              preferences
                .notifications
                .lowStock,

            campaigns:
              preferences
                .notifications
                .campaigns,

            insights:
              preferences
                .notifications
                .insights,

            reports:
              preferences
                .notifications
                .reports

          };

        },


        error: error => {

          console.error(
            'No se pudieron cargar preferencias:',
            error
          );

        }

      });

  }


  /* ============================
     SECTION
  ============================ */

  selectSection(
    section: string
  ): void {

    this.activeSection =
      section;

  }


  /* ============================
     SAVE ACCOUNT
  ============================ */

  async saveAccount(): Promise<void> {

    const user =
      this.auth.currentUser;


    if (!user) {

      return;

    }


    try {

      await updateProfile(
        user,
        {
          displayName:
            this.userSettings
              .fullName
              .trim()
        }
      );


      this.showSavedMessage(
        'Información de cuenta actualizada.'
      );

    }

    catch (error) {

      console.error(
        'No se pudo actualizar el perfil:',
        error
      );

    }

  }

  /* ============================
   THEME CHANGE
  ============================ */

  onThemeChange(
  theme: 'light' | 'dark' | 'system'
  ): void {

    this.themeService.setTheme(
      theme
    );

  }


  /* ============================
     SAVE PREFERENCES
  ============================ */

  saveSettings(): void {

    const request:
      UserPreferenceRequest = {

      language:
        this.userSettings.language,

      currency:
        this.userSettings.currency,

      theme:
        this.userSettings.theme,

      notifyLowStock:
        this.userSettings
          .notifications
          .lowStock,

      notifyCampaigns:
        this.userSettings
          .notifications
          .campaigns,

      notifyInsights:
        this.userSettings
          .notifications
          .insights,

      notifyReports:
        this.userSettings
          .notifications
          .reports

    };


    this.preferencesApi
      .updateMyPreferences(
        request
      )
      .subscribe({

        next: preferences => {

          this.userSettings.language =
            preferences.language;


          this.userSettings.currency =
            preferences.currency;


          this.userSettings.theme =
            preferences.theme;


          this.userSettings.notifications = {

            lowStock:
              preferences
                .notifications
                .lowStock,

            campaigns:
              preferences
                .notifications
                .campaigns,

            insights:
              preferences
                .notifications
                .insights,

            reports:
              preferences
                .notifications
                .reports

          };


          this.showSavedMessage(
            'Configuración guardada correctamente.'
          );

        },


        error: error => {

          console.error(
            'No se pudo guardar configuración:',
            error
          );

        }

      });

  }


  /* ============================
     SAVE COMPANY
  ============================ */

  saveCompany(): void {

    if (
      !this.currentCompany ||
      !this.currentCompany.id
    ) {

      console.error(
        'No existe una empresa cargada.'
      );

      return;

    }


    const updatedCompany:
      Company = {

      ...this.currentCompany,

      name:
        this.companySettings.name,

      industry:
        this.companySettings.industry,

      city:
        this.companySettings.city,

      country:
        this.companySettings.country,

      employees:
        this.companySettings.employees

    };


    this.companyApi
      .updateCompany(
        this.currentCompany.id,
        updatedCompany
      )
      .subscribe({

        next: company => {

          this.currentCompany =
            company;


          this.companySettings = {

            name:
              company.name || '',

            industry:
              company.industry || '',

            city:
              company.city || '',

            country:
              company.country ||
              'Ecuador',

            employees:
              company.employees || ''

          };


          this.showSavedMessage(
            'Información de empresa actualizada.'
          );

        },


        error: error => {

          console.error(
            'No se pudo actualizar empresa:',
            error
          );

        }

      });

  }


  /* ============================
     MESSAGE
  ============================ */

  private showSavedMessage(
    message: string
  ): void {

    this.savedMessage =
      message;


    setTimeout(
      () => {

        this.savedMessage =
          '';

      },
      3000
    );

  }

}


