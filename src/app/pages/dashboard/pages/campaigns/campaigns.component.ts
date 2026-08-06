import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';


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
export class CampaignsComponent implements OnInit {


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

  searchTerm = '';

  statusFilter = 'all';



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



  /* ============================
     INIT
  ============================ */

  ngOnInit(): void {

    this.loadCampaigns();

    this.loadCampaignDraft();

  }



  /* ============================
     LOAD CAMPAIGNS
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

    /*
      Si venimos desde Marketing IA,
      no estamos editando una campaña
      existente.
    */

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

      channel:
        '',

      message:
        '',

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

    /*
      IMPORTANTE:
      aquí estaba el método que
      te faltaba.
    */

    this.editingCampaignId = null;

    this.selectedCampaign = null;

    this.campaignDraft = null;


    /*
      Si crea una campaña manual,
      ya no necesitamos un draft
      anterior de Marketing IA.
    */

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
     EDIT CAMPAIGN
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
     VIEW CAMPAIGN
  ============================ */

  viewCampaign(
    campaign: Campaign
  ): void {

    this.selectedCampaign =
      campaign;

    this.showForm = false;

  }



  /* ============================
     CLOSE DETAIL
  ============================ */

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


    /*
      SIMULACIÓN TEMPORAL DE IA

      Luego sustituiremos esta lógica
      por una llamada al AI Service.
    */

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


      this.generatingMessage =
        false;

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
     SAVE / UPDATE CAMPAIGN
  ============================ */

  saveCampaign(): void {

    this.showErrors = true;


    if (!this.isValid()) {

      return;

    }



    /* ============================
       EDIT EXISTING CAMPAIGN
    ============================ */

    if (this.editingCampaignId) {

      const index =
        this.campaigns.findIndex(
          campaign =>
            campaign.id ===
            this.editingCampaignId
        );


      if (index !== -1) {

        this.campaigns[index] = {

          /*
            Conservamos:
            id
            status
            createdAt
          */

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



    /* ============================
       CREATE NEW CAMPAIGN
    ============================ */

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



    /*
      Guardamos tanto para CREATE
      como para EDIT.
    */

    this.persistCampaigns();



    /*
      Si existía un borrador
      procedente de Marketing IA,
      ya fue consumido.
    */

    localStorage.removeItem(
      'wisepick_campaign_draft'
    );


    this.campaignDraft = null;

    this.editingCampaignId = null;

    this.selectedCampaign = null;

    this.showForm = false;

    this.showErrors = false;

  }



  /* ============================
     ACTIVATE
  ============================ */

  activateCampaign(
    campaign: Campaign
  ): void {

    campaign.status =
      'active';


    this.persistCampaigns();

  }



  /* ============================
     COMPLETE
  ============================ */

  completeCampaign(
    campaign: Campaign
  ): void {

    campaign.status =
      'completed';


    this.persistCampaigns();

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


    this.campaigns =
      this.campaigns.filter(
        item =>
          item.id !== campaign.id
      );


    /*
      Si justo estábamos viendo
      la campaña eliminada,
      cerramos el detalle.
    */

    if (
      this.selectedCampaign?.id ===
      campaign.id
    ) {

      this.selectedCampaign = null;

    }


    this.persistCampaigns();

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
        campaign.status === 'active'
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
        campaign.status === 'draft'
    ).length;

  }



  /* ============================
     OBJECTIVE LABEL
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



  /* ============================
     AUDIENCE LABEL
  ============================ */

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
     STORAGE
  ============================ */

  private persistCampaigns(): void {

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