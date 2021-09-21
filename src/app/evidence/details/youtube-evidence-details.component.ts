import { Component, Input } from '@angular/core';
import { YouTubeEvidence } from '../youtubeEvidence';

@Component({
  selector: 'app-youtubeevidence-details',
  templateUrl: './youtube-evidence-details.component.html',
  styleUrls: ['./youtube-evidence-details.component.css']
})
export class YouTubeEvidenceDetailsComponent {
  @Input() evidence: YouTubeEvidence | undefined;
  @Input() evidenceIndex = 0;

  constructor() {}
}
