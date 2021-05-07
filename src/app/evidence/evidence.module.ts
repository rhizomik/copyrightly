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

@NgModule({
  declarations: [
    UploadEvidenceComponent,
    UploadEvidenceEventComponent,
    UploadEvidenceDetailsComponent,
    UploadExistenceDirective,
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
  ],
  providers: [
    UploadEvidenceContractService,
  ],
  bootstrap: [ UploadEvidenceEventComponent, ]
})
export class EvidenceModule { }
