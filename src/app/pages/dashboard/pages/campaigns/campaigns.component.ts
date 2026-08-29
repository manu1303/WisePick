import {Component,OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule} from '@angular/forms';

import {
  CampaignsApiService,
  CampaignApi,
  CampaignRequest
} from '../../../../core/services/campaigns-api.service';

import {
  CompanyApiService
} from '../../../../core/services/company-api.service';

/* ============================
   INTERFACES
============================ */

interface CampaignDraft {

  source: string;

  insightId?: string;
  insightType?: string;

  title?: string;
  description?: string;

  targetType?: string | null;
  targetId?: string | null;
  targetName?: string | null;

  createdAt?: string;
}


interface Campaign {

  id: string;

  name: string;

  objective: string;

  audience: string;

  channel: string;

  message: string;

  source:
    | 'manual'
    | 'marketing-ai';

  targetType?: string | null;

  targetId?: string | null;

  targetName?: string | null;

  status:
    | 'draft'
    | 'active'
    | 'completed';

  createdAt: string;
}


interface CampaignForm {

  name: string;

  objective: string;

  audience: string;

  channel: string;

  message: string;

  source:
    | 'manual'
    | 'marketing-ai';

  targetType?: string | null;

  targetId?: string | null;

  targetName?: string | null;
}


@Component({
  selector: 'app-campaigns',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './campaigns.component.html',
  styleUrls: ['./campaigns.component.scss']
})
export class CampaignsComponent
  implements OnInit {


  /* ============================
     STATE
  ============================ */

  campaigns: Campaign[] = [];

  campaignDraft:
    CampaignDraft | null = null;

  editingCampaignId:
    string | null = null;

  selectedCampaign:
    Campaign | null = null;

  showForm = false;

  showErrors = false;

  generatingMessage = false;

  loading = false;

  saving = false;

  searchTerm = '';

  statusFilter = 'all';

  companyId:
    string | null = null;


  campaignForm: CampaignForm = {

    name: '',

    objective: '',

    audience: '',

    channel: '',

    message: '',

    source: 'manual',

    targetType: null,

    targetId: null,

    targetName: null
  };


  constructor(

    private campaignsApi:
      CampaignsApiService,

    private companyApi:
      CompanyApiService

  ) {}


  /* ============================
     DEMO MODE
  ============================ */

  get isDemoMode(): boolean {

    return window.location.pathname
      .startsWith('/demo');

  }


  /* ============================
     INIT
  ============================ */

  ngOnInit(): void {

    if (this.isDemoMode) {

      this.loadDemoCampaigns();

      this.loadCampaignDraft();

      return;
    }


    this.loadCompanyAndCampaigns();

  }


  /* ============================
     COMPANY
  ============================ */

  private loadCompanyAndCampaigns(): void {

    this.loading = true;


    this.companyApi
      .getMyCompany()
      .subscribe({

        next: company => {

          this.companyId =
            company.id ?? null;


          if (!this.companyId) {

            console.error(
              'La empresa no tiene un ID válido.'
            );

            this.loading = false;

            return;
          }


          this.loadCampaigns();

        },

        error: error => {

          console.error(
            'No se pudo cargar la empresa:',
            error
          );

          this.loading = false;

        }

      });

  }


  /* ============================
     LOAD CAMPAIGNS BACKEND
  ============================ */

  private loadCampaigns(): void {

    this.campaignsApi
      .getAll()
      .subscribe({

        next: campaigns => {

          this.campaigns =
            campaigns.map(
              campaign =>
                this.mapApiCampaign(
                  campaign
                )
            );

          this.loading = false;

          this.loadCampaignDraft();

        },

        error: error => {

          console.error(
            'No se pudieron cargar las campañas:',
            error
          );

          this.loading = false;

        }

      });

  }


  /* ============================
     LOAD DEMO CAMPAIGNS
  ============================ */

  private loadDemoCampaigns(): void {

    try {

      this.campaigns =
        JSON.parse(
          localStorage.getItem(
            'wisepick_campaigns'
          ) || '[]'
        );

    }

    catch (error) {

      console.error(
        'No se pudieron cargar campañas demo:',
        error
      );

      this.campaigns = [];

    }

  }


  /* ============================
     LOAD CAMPAIGN DRAFT
  ============================ */

  private loadCampaignDraft(): void {

    const storedDraft =
      localStorage.getItem(
        'wisepick_campaign_draft'
      );


    if (!storedDraft) {

      return;

    }


    try {

      this.campaignDraft =
        JSON.parse(
          storedDraft
        );


      this.openFromInsight(
        this.campaignDraft!
      );

    }

    catch (error) {

      console.error(
        'No se pudo leer el borrador:',
        error
      );

    }

  }


  /* ============================
     FROM MARKETING IA
  ============================ */

  private openFromInsight(
    draft: CampaignDraft
  ): void {

    this.editingCampaignId = null;

    this.selectedCampaign = null;


    this.campaignForm = {

      name:
        draft.targetName
          ? `Campaña - ${draft.targetName}`
          : draft.title
            ? `Campaña - ${draft.title}`
            : 'Nueva campaña',

      objective:
        draft.targetType === 'product'
          ? 'increase-sales'
          : draft.targetType === 'customer'
            ? 'loyalty'
            : '',

      audience:
        draft.targetType === 'customer'
          ? 'recurring'
          : 'all',

      channel: '',

      message: '',

      source:
        'marketing-ai',

      targetType:
        draft.targetType || null,

      targetId:
        draft.targetId || null,

      targetName:
        draft.targetName || null
    };


    this.showForm = true;

    this.showErrors = false;

  }


  /* ============================
     NEW CAMPAIGN
  ============================ */

  openNewCampaign(): void {

    this.editingCampaignId = null;

    this.selectedCampaign = null;

    this.campaignDraft = null;


    localStorage.removeItem(
      'wisepick_campaign_draft'
    );


    this.campaignForm = {

      name: '',

      objective: '',

      audience: '',

      channel: '',

      message: '',

      source: 'manual',

      targetType: null,

      targetId: null,

      targetName: null
    };


    this.showErrors = false;

    this.showForm = true;

  }


  /* ============================
     EDIT
  ============================ */

  editCampaign(
    campaign: Campaign
  ): void {

    this.editingCampaignId =
      campaign.id;


    this.selectedCampaign = null;


    this.campaignForm = {

      name:
        campaign.name,

      objective:
        campaign.objective,

      audience:
        campaign.audience,

      channel:
        campaign.channel,

      message:
        campaign.message,

      source:
        campaign.source,

      targetType:
        campaign.targetType || null,

      targetId:
        campaign.targetId || null,

      targetName:
        campaign.targetName || null
    };


    this.showErrors = false;

    this.showForm = true;

  }


  /* ============================
     VIEW
  ============================ */

  viewCampaign(
    campaign: Campaign
  ): void {

    this.selectedCampaign =
      campaign;

    this.showForm = false;

  }


  closeDetail(): void {

    this.selectedCampaign = null;

  }


  /* ============================
     MESSAGE GENERATOR
  ============================ */

  generateMessage(): void {

    if (
      !this.campaignForm.objective ||
      !this.campaignForm.channel
    ) {

      this.showErrors = true;

      return;

    }


    this.generatingMessage = true;


    setTimeout(() => {

      const product =
        this.campaignForm.targetName
        || 'nuestros productos';


      switch (
        this.campaignForm.objective
      ) {


        case 'increase-sales':

          this.campaignForm.message =
            `¡Tenemos una oportunidad especial para ti! Descubre ${product} y encuentra opciones pensadas para ti. Visítanos y conoce más.`;

          break;


        case 'loyalty':

          this.campaignForm.message =
            `¡Gracias por elegirnos nuevamente! Queremos premiar tu preferencia con una oportunidad especial pensada para nuestros clientes frecuentes.`;

          break;


        case 'reactivation':

          this.campaignForm.message =
            `¡Te extrañamos! Tenemos novedades que creemos que pueden interesarte. Vuelve a visitarnos y descubre lo nuevo que tenemos para ti.`;

          break;


        case 'promotion':

          this.campaignForm.message =
            `Aprovecha nuestra promoción especial por tiempo limitado. Descubre nuestros productos y encuentra tu próxima opción favorita.`;

          break;


        default:

          this.campaignForm.message =
            `Tenemos novedades para ti. Conoce nuestras opciones y descubre oportunidades pensadas para nuestros clientes.`;

      }


      this.generatingMessage = false;

    }, 1000);

  }


  /* ============================
     VALIDATION
  ============================ */

  private isValid(): boolean {

    return !!(

      this.campaignForm.name &&

      this.campaignForm.objective &&

      this.campaignForm.audience &&

      this.campaignForm.channel &&

      this.campaignForm.message

    );

  }


  /* ============================
     SAVE
  ============================ */

  saveCampaign(): void {

    this.showErrors = true;


    if (!this.isValid()) {

      return;

    }


    if (this.isDemoMode) {

      this.saveDemoCampaign();

      return;

    }


    if (!this.companyId) {

      console.error(
        'No existe companyId para guardar la campaña.'
      );

      return;

    }


    const request:
      CampaignRequest = {

      companyId:
        this.companyId,

      name:
        this.campaignForm.name.trim(),

      objective:
        this.campaignForm.objective,

      audience:
        this.campaignForm.audience,

      channel:
        this.campaignForm.channel,

      message:
        this.campaignForm.message,

      source:
        this.mapSourceToApi(
          this.campaignForm.source
        ),

      targetType:
        this.campaignForm.targetType,

      targetId:
        this.campaignForm.targetId,

      targetName:
        this.campaignForm.targetName,

      status:
        this.editingCampaignId
          ? this.getExistingStatus(
              this.editingCampaignId
            )
          : 'DRAFT'
    };


    this.saving = true;


    if (this.editingCampaignId) {

      this.campaignsApi
        .update(
          this.editingCampaignId,
          request
        )
        .subscribe({

          next: updated => {

            const mapped =
              this.mapApiCampaign(
                updated
              );


            const index =
              this.campaigns.findIndex(
                campaign =>
                  campaign.id ===
                  mapped.id
              );


            if (index !== -1) {

              this.campaigns[index] =
                mapped;

            }


            this.finishSave();

          },

          error: error => {

            console.error(
              'No se pudo actualizar la campaña:',
              error
            );

            this.saving = false;

          }

        });


      return;

    }


    this.campaignsApi
      .create(
        request
      )
      .subscribe({

        next: created => {

          this.campaigns.unshift(
            this.mapApiCampaign(
              created
            )
          );


          this.finishSave();

        },

        error: error => {

          console.error(
            'No se pudo crear la campaña:',
            error
          );

          this.saving = false;

        }

      });

  }


  private finishSave(): void {

    localStorage.removeItem(
      'wisepick_campaign_draft'
    );


    this.campaignDraft = null;

    this.editingCampaignId = null;

    this.selectedCampaign = null;

    this.showForm = false;

    this.showErrors = false;

    this.saving = false;

  }


  /* ============================
     DEMO SAVE
  ============================ */

  private saveDemoCampaign(): void {

    if (this.editingCampaignId) {

      const index =
        this.campaigns.findIndex(
          campaign =>
            campaign.id ===
            this.editingCampaignId
        );


      if (index !== -1) {

        this.campaigns[index] = {

          ...this.campaigns[index],

          name:
            this.campaignForm.name,

          objective:
            this.campaignForm.objective,

          audience:
            this.campaignForm.audience,

          channel:
            this.campaignForm.channel,

          message:
            this.campaignForm.message,

          source:
            this.campaignForm.source,

          targetType:
            this.campaignForm.targetType,

          targetId:
            this.campaignForm.targetId,

          targetName:
            this.campaignForm.targetName
        };

      }

    }

    else {

      const campaign:
        Campaign = {

        id:
          crypto.randomUUID(),

        name:
          this.campaignForm.name,

        objective:
          this.campaignForm.objective,

        audience:
          this.campaignForm.audience,

        channel:
          this.campaignForm.channel,

        message:
          this.campaignForm.message,

        source:
          this.campaignForm.source,

        targetType:
          this.campaignForm.targetType,

        targetId:
          this.campaignForm.targetId,

        targetName:
          this.campaignForm.targetName,

        status:
          'draft',

        createdAt:
          new Date()
            .toISOString()
      };


      this.campaigns.unshift(
        campaign
      );

    }


    this.persistDemoCampaigns();

    this.finishSave();

  }


  /* ============================
     ACTIVATE
  ============================ */

  activateCampaign(
    campaign: Campaign
  ): void {

    if (this.isDemoMode) {

      campaign.status =
        'active';

      this.persistDemoCampaigns();

      return;

    }


    this.changeStatus(
      campaign,
      'ACTIVE'
    );

  }


  /* ============================
     COMPLETE
  ============================ */

  completeCampaign(
    campaign: Campaign
  ): void {

    if (this.isDemoMode) {

      campaign.status =
        'completed';

      this.persistDemoCampaigns();

      return;

    }


    this.changeStatus(
      campaign,
      'COMPLETED'
    );

  }


  /* ============================
     CHANGE STATUS
  ============================ */

  private changeStatus(
    campaign: Campaign,
    status: 'ACTIVE' | 'COMPLETED'
  ): void {

    if (!this.companyId) {

      return;

    }


    const request:
      CampaignRequest = {

      companyId:
        this.companyId,

      name:
        campaign.name,

      objective:
        campaign.objective,

      audience:
        campaign.audience,

      channel:
        campaign.channel,

      message:
        campaign.message,

      source:
        this.mapSourceToApi(
          campaign.source
        ),

      targetType:
        campaign.targetType,

      targetId:
        campaign.targetId,

      targetName:
        campaign.targetName,

      status
    };


    this.campaignsApi
      .update(
        campaign.id,
        request
      )
      .subscribe({

        next: updated => {

          const index =
            this.campaigns.findIndex(
              item =>
                item.id ===
                campaign.id
            );


          if (index !== -1) {

            this.campaigns[index] =
              this.mapApiCampaign(
                updated
              );

          }


          if (
            this.selectedCampaign?.id ===
            campaign.id
          ) {

            this.selectedCampaign =
              this.campaigns[index];

          }

        },

        error: error => {

          console.error(
            'No se pudo cambiar el estado:',
            error
          );

        }

      });

  }


  /* ============================
     DELETE
  ============================ */

  deleteCampaign(
    campaign: Campaign
  ): void {

    const confirmed =
      window.confirm(
        `¿Deseas eliminar "${campaign.name}"?`
      );


    if (!confirmed) {

      return;

    }


    if (this.isDemoMode) {

      this.removeCampaignLocally(
        campaign.id
      );

      this.persistDemoCampaigns();

      return;

    }


    this.campaignsApi
      .delete(
        campaign.id
      )
      .subscribe({

        next: () => {

          this.removeCampaignLocally(
            campaign.id
          );

        },

        error: error => {

          console.error(
            'No se pudo eliminar la campaña:',
            error
          );

        }

      });

  }


  private removeCampaignLocally(
    id: string
  ): void {

    this.campaigns =
      this.campaigns.filter(
        item =>
          item.id !== id
      );


    if (
      this.selectedCampaign?.id ===
      id
    ) {

      this.selectedCampaign = null;

    }

  }


  /* ============================
     FILTER
  ============================ */

  get filteredCampaigns():
    Campaign[] {

    const term =
      this.searchTerm
        .trim()
        .toLowerCase();


    return this.campaigns.filter(
      campaign => {

        const searchMatches =

          !term ||

          campaign.name
            .toLowerCase()
            .includes(term) ||

          campaign.channel
            .toLowerCase()
            .includes(term);


        const statusMatches =

          this.statusFilter === 'all' ||

          campaign.status ===
            this.statusFilter;


        return (
          searchMatches &&
          statusMatches
        );

      }
    );

  }


  /* ============================
     KPIs
  ============================ */

  get totalCampaigns(): number {

    return this.campaigns.length;

  }


  get activeCampaigns(): number {

    return this.campaigns.filter(
      campaign =>
        campaign.status ===
        'active'
    ).length;

  }


  get aiCampaigns(): number {

    return this.campaigns.filter(
      campaign =>
        campaign.source ===
        'marketing-ai'
    ).length;

  }


  get draftCampaigns(): number {

    return this.campaigns.filter(
      campaign =>
        campaign.status ===
        'draft'
    ).length;

  }


  /* ============================
     LABELS
  ============================ */

  getObjectiveLabel(
    objective: string
  ): string {

    switch (objective) {

      case 'increase-sales':
        return 'Incrementar ventas';

      case 'loyalty':
        return 'Fidelización';

      case 'reactivation':
        return 'Reactivación';

      case 'promotion':
        return 'Promoción';

      default:
        return objective;

    }

  }


  getAudienceLabel(
    audience: string
  ): string {

    switch (audience) {

      case 'all':
        return 'Todos los clientes';

      case 'recurring':
        return 'Clientes frecuentes';

      case 'new':
        return 'Clientes nuevos';

      case 'inactive':
        return 'Clientes inactivos';

      default:
        return audience;

    }

  }


  /* ============================
     API MAPPERS
  ============================ */

  private mapApiCampaign(
    campaign: CampaignApi
  ): Campaign {

    return {

      id:
        campaign.id,

      name:
        campaign.name,

      objective:
        campaign.objective || '',

      audience:
        campaign.audience || '',

      channel:
        campaign.channel || '',

      message:
        campaign.message || '',

      source:
        this.mapSourceFromApi(
          campaign.source
        ),

      targetType:
        campaign.targetType,

      targetId:
        campaign.targetId,

      targetName:
        campaign.targetName,

      status:
        this.mapStatusFromApi(
          campaign.status
        ),

      createdAt:
        campaign.createdAt
    };

  }


  private mapStatusFromApi(
    status: string
  ):
    'draft' |
    'active' |
    'completed' {

    switch (
      status?.toUpperCase()
    ) {

      case 'ACTIVE':
        return 'active';

      case 'COMPLETED':
        return 'completed';

      default:
        return 'draft';

    }

  }


  private mapSourceFromApi(
    source: string
  ):
    'manual' |
    'marketing-ai' {

    const normalized =
      source
        ?.toUpperCase()
        .replace('-', '_');


    return normalized ===
      'MARKETING_AI'
        ? 'marketing-ai'
        : 'manual';

  }


  private mapSourceToApi(
    source:
      'manual' |
      'marketing-ai'
  ): string {

    return source ===
      'marketing-ai'
        ? 'MARKETING_AI'
        : 'MANUAL';

  }


  private getExistingStatus(
    id: string
  ): string {

    const campaign =
      this.campaigns.find(
        item =>
          item.id === id
      );


    switch (
      campaign?.status
    ) {

      case 'active':
        return 'ACTIVE';

      case 'completed':
        return 'COMPLETED';

      default:
        return 'DRAFT';

    }

  }


  /* ============================
     DEMO STORAGE
  ============================ */

  private persistDemoCampaigns(): void {

    localStorage.setItem(

      'wisepick_campaigns',

      JSON.stringify(
        this.campaigns
      )

    );

  }


  /* ============================
     CLOSE FORM
  ============================ */

  closeForm(): void {

    this.showForm = false;

    this.showErrors = false;

    this.editingCampaignId = null;

  }

}