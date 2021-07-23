import { Component, Input } from '@angular/core';
import { UploadEvidence } from '../uploadEvidence';

@Component({
  selector: 'app-uploadevidence-details',
  templateUrl: './upload-evidence-details.component.html',
  styleUrls: ['./upload-evidence-details.component.css']
})
export class UploadEvidenceDetailsComponent {
  @Input() evidence: UploadEvidence | undefined;
  @Input() evidenceIndex = 0;

  stake = 1.5;

  constructor() {}
}
