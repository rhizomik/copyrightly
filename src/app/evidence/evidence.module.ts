import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AppRoutingModule } from '../app-routing.module';
import { UtilModule } from '../util/util.module';
import { AlertsModule } from '../alerts/alerts.module';
import { UploadEvidenceContractService } from './upload-evidence-contract.service';
import { UploadEvidenceEventComponent } from './upload-evidence-event.component';
import { UploadEvidenceComponent } from './create/upload-evidence.component';
import { UploadEvidenceDetailsComponent } from './details/upload-evidence-details.component';
import { UploadExistenceDirective } from './create/upload-existence.directive';
import { YouTubeEvidenceComponent } from './create/youtube-evidence.component';
import { YouTubeEvidenceEventComponent } from './youtube-evidence-event.component';
import { YouTubeEvidenceDetailsComponent } from './details/youtube-evidence-details.component';
import { YouTubeEvidenceContractService } from './youtube-evidence-contract.service';
import { VerificationRequestComponent } from './verification-request.component';

@NgModule({
  declarations: [
    UploadEvidenceComponent,
    UploadEvidenceEventComponent,
    UploadEvidenceDetailsComponent,
    UploadExistenceDirective,
    YouTubeEvidenceComponent,
    VerificationRequestComponent,
    YouTubeEvidenceEventComponent,
    YouTubeEvidenceDetailsComponent,
  ],
  imports: [
    CommonModule,
    FormsModule,
    AppRoutingModule,
    UtilModule,
    AlertsModule
  ],
  exports: [
    UploadEvidenceComponent,
    UploadEvidenceDetailsComponent,
    YouTubeEvidenceComponent,
    YouTubeEvidenceDetailsComponent
  ],
  providers: [
    UploadEvidenceContractService, YouTubeEvidenceContractService
  ],
  bootstrap: [ UploadEvidenceEventComponent, VerificationRequestComponent, YouTubeEvidenceEventComponent ]
})
export class EvidenceModule { }
