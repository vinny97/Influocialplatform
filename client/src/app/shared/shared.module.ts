import { NgxSliderModule } from '@angular-slider/ngx-slider';
import { CommonModule } from '@angular/common';
import { HttpClientModule } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NgbModule } from '@ng-bootstrap/ng-bootstrap';
import { NgSelectModule } from '@ng-select/ng-select';
import { OwlDateTimeModule, OwlNativeDateTimeModule } from 'ng-pick-datetime';
import { ChartsModule } from 'ng2-charts';
import { FileUploadModule } from 'ng2-file-upload';
import { Ng2SearchPipeModule } from 'ng2-search-filter';
import { ImageCropperModule } from 'ngx-image-cropper';
import { NgxPayPalModule } from 'ngx-paypal';
import { NgxPermissionsModule } from 'ngx-permissions';
import { AddToChatComponent } from './add-to-chat/add-to-chat.component';
import { ListTableComponent } from './campaign/list-table/list-table.component';
import { TableFiltersComponent } from './campaign/table-filters/table-filters.component';
import { TypeSelectComponent } from './campaign/type-select/type-select.component';
import { BarChartComponent } from './charts/bar-chart/bar-chart.component';
import { PieChartComponent } from './charts/pie-chart/pie-chart.component';
import { NumericOnlyDirective } from './directives/numeric.directive';
import { ErrorsComponent } from './errors/errors.component';
import { ImageCarousalComponent } from './image-carousal/image-carousal.component';
import { NGXImageCropperComponent } from './image-cropper/image-cropper.component';
import { ImagePreviewComponent } from './image-preview/image-preview.component';
import { ProposalCardStatsComponent } from './instagram/proposal-card-stats/proposal-card-stats.component';
import { PublishPostComponent } from './instagram/publish-post/publish-post.component';
import { LoaderComponent } from './loader/loader.component';
import { NoContentComponent } from './no-content/no-content.component';
import { PaginationComponent } from './pagination/pagination.component';
import { PaypalComponent } from './paypal/paypal.component';
import { AgoPipe } from './pipe/ago.pipe';
import { BrandProposalButtonPipe } from './pipe/brand-proposal-button.pipe';
import { CampaignStatusPipe } from './pipe/campaign-status.pipe';
import { CampaignCategoryPipe } from './pipe/campaignCategory.pipe';
import { CollabListButtonPipe } from './pipe/collab-list-button.pipe';
import { CountryFlagPipe } from './pipe/country-flag.pipe';
import { CountryImagePipe } from './pipe/country-image.pipe';
import { CountryNamePipe } from './pipe/country-name.pipe';
import { CountryPipe } from './pipe/country.pipe';
import { GenderPipe } from './pipe/gender.pipe';
import { ImagePipe } from './pipe/image.pipe';
import { NamePipe } from './pipe/name.pipe';
import { ObjectivePipe } from './pipe/objective.pipe';
import { OutrightStatusPipe } from './pipe/outright-status.pipe';
import { PhysicalOptionsPipe } from './pipe/physical-options.pipe';
import { PostTypePipe } from './pipe/post-type.pipe';
import { ProposalContentPipe } from './pipe/proposal-content.pipe';
import { ProposalStatusPipe } from './pipe/proposal-status.pipe';
import { RolesPipe } from './pipe/roles.pipe';
import { SanitizeUrlPipe } from './pipe/sanitize-url.pipe';
import { ShortNumberPipe } from './pipe/shortNumber.pipe';
import { SmLogoPipe } from './pipe/smLogo.pipe';
import { SmNamePipe } from './pipe/smName.pipe';
import { ThousandSuffixesPipe } from './pipe/suffix.pipe';
import { TransactionStatusPipe } from './pipe/transaction-status.pipe';
import { ContentViewComponent } from './proposal/content-view/content-view.component';
import { DeclineProposalComponent } from './proposal/decline-proposal/decline-proposal.component';
import { FavoriteToggleComponent } from './proposal/favorite-toggle/favorite-toggle.component';
import { OutrightComponent } from './proposal/outright/outright.component';
import { UploadFileComponent } from './upload-file/upload-file.component';
import { UploadImgComponent } from './upload-img/upload-img.component';

@NgModule({
  declarations: [
    // Proposal Components
    FavoriteToggleComponent,
    DeclineProposalComponent,
    OutrightComponent,
    ContentViewComponent,
    PaypalComponent,

    // Re target

    // Campaign
    ListTableComponent,
    TableFiltersComponent,
    TypeSelectComponent,

    // Instagram
    ProposalCardStatsComponent,
    PublishPostComponent,
    NGXImageCropperComponent,
    // Charts
    PieChartComponent,
    BarChartComponent,

    AddToChatComponent,
    ErrorsComponent,
    ImageCarousalComponent,
    NamePipe,
    ImagePipe,
    CountryImagePipe,
    ObjectivePipe,
    CampaignCategoryPipe,
    GenderPipe,
    CountryPipe,
    RolesPipe,
    SmLogoPipe,
    SmNamePipe,
    PostTypePipe,
    PhysicalOptionsPipe,
    ProposalStatusPipe,
    ProposalContentPipe,
    OutrightStatusPipe,
    SanitizeUrlPipe,
    AgoPipe,

    CountryNamePipe,
    CountryFlagPipe,
    CampaignStatusPipe,
    CollabListButtonPipe,
    BrandProposalButtonPipe,
    ShortNumberPipe,
    TransactionStatusPipe,
    ThousandSuffixesPipe,
    LoaderComponent,
    NoContentComponent,
    UploadFileComponent,
    UploadImgComponent,
    NumericOnlyDirective,
    PaginationComponent,
    ImagePreviewComponent,
  ],
  imports: [
    CommonModule,
    NgbModule,
    FormsModule,
    ReactiveFormsModule,
    NgSelectModule,
    FileUploadModule,
    HttpClientModule,
    NgxSliderModule,
    NgxPermissionsModule,
    ChartsModule,
    NgxPayPalModule,
    OwlNativeDateTimeModule,
    OwlDateTimeModule,
    ImageCropperModule,
    Ng2SearchPipeModule,
  ],
  exports: [
    ImageCropperModule,
    Ng2SearchPipeModule,
    PaginationComponent,
    // modules
    FormsModule,
    ReactiveFormsModule,
    NgbModule,
    NgSelectModule,
    NgxSliderModule,
    NgxPermissionsModule,
    NgxPayPalModule,
    FileUploadModule,
    // components
    AddToChatComponent,
    ErrorsComponent,
    LoaderComponent,
    NoContentComponent,
    UploadFileComponent,
    UploadImgComponent,
    ImageCarousalComponent,
    // Proposal Components
    FavoriteToggleComponent,
    DeclineProposalComponent,
    OutrightComponent,
    ContentViewComponent,
    PaypalComponent,

    // Campaign Components
    ListTableComponent,
    TableFiltersComponent,
    TypeSelectComponent,

    // Instagram
    NGXImageCropperComponent,
    ProposalCardStatsComponent,
    PublishPostComponent,
    // Charts
    BarChartComponent,
    PieChartComponent,
    //image preview
    ImagePreviewComponent,
    // pipes
    ThousandSuffixesPipe,
    NamePipe,
    ImagePipe,
    CountryImagePipe,
    ObjectivePipe,
    CampaignCategoryPipe,
    GenderPipe,
    CountryPipe,
    SmLogoPipe,
    SmNamePipe,

    PostTypePipe,
    RolesPipe,
    PhysicalOptionsPipe,
    ProposalStatusPipe,
    ProposalContentPipe,
    OutrightStatusPipe,
    SanitizeUrlPipe,
    CollabListButtonPipe,
    BrandProposalButtonPipe,
    AgoPipe,
    CampaignStatusPipe,
    ShortNumberPipe,
    TransactionStatusPipe,

    //countries
    CountryNamePipe,
    CountryFlagPipe,
    // directives
    NumericOnlyDirective,
  ],
  providers: [ImagePipe],
})
export class SharedModule {}
