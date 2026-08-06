import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


interface UserSettings {

  fullName: string;
  email: string;

  language: string;
  currency: string;

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
export class SettingsComponent implements OnInit {


  activeSection =
    'account';


  savedMessage =
    '';


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


  ngOnInit(): void {

    this.loadSettings();

  }



  /* ============================
     LOAD
  ============================ */

  private loadSettings(): void {

    const storedUser =
      localStorage.getItem(
        'wisepick_settings'
      );


    if (storedUser) {

      try {

        this.userSettings =
          JSON.parse(
            storedUser
          );

      }

      catch (error) {

        console.error(
          'No se pudo cargar configuración:',
          error
        );

      }

    }


    /*
      Intentamos leer los datos
      de empresa existentes.
    */

    const company =
      localStorage.getItem(
        'wisepick_company'
      );


    if (company) {

      try {

        const parsed =
          JSON.parse(
            company
          );


        this.companySettings = {

          name:
            parsed.name || '',

          industry:
            parsed.industry || '',

          city:
            parsed.city || '',

          country:
            parsed.country ||
            'Ecuador',

          employees:
            parsed.employees || ''

        };

      }

      catch (error) {

        console.error(
          'No se pudo cargar empresa:',
          error
        );

      }

    }

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
     SAVE USER SETTINGS
  ============================ */

  saveSettings(): void {

    localStorage.setItem(
      'wisepick_settings',
      JSON.stringify(
        this.userSettings
      )
    );


    this.showSavedMessage(
      'Configuración guardada correctamente.'
    );

  }



  /* ============================
     SAVE COMPANY
  ============================ */

  saveCompany(): void {

    const stored =
      JSON.parse(
        localStorage.getItem(
          'wisepick_company'
        ) || '{}'
      );


    const updated = {

      ...stored,

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


    localStorage.setItem(
      'wisepick_company',
      JSON.stringify(
        updated
      )
    );


    this.showSavedMessage(
      'Información de empresa actualizada.'
    );

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
