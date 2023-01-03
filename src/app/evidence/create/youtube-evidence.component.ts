import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertsService } from '../../alerts/alerts.service';
import { AuthenticationService } from '../../navbar/authentication.service';
import { Web3Service } from '../../util/web3.service';
import { IpfsService } from '../../util/ipfs.service';
import { YouTubeEvidenceContractService } from '../youtube-evidence-contract.service';
import { NgForm } from '@angular/forms';
import { YouTubeEvidence } from '../youtubeEvidence';
import { Manifestation } from '../../manifestations/manifestation';
import { VerificationRequestComponent } from '../verification-request.component';
import { YouTubeEvidenceEvent } from '../youtube-evidence-event';
import { VerificationRequest } from '../verification-request';

@Component({
  selector: 'app-youtube-evidence',
  templateUrl: './youtube-evidence.component.html',
  styleUrls: ['./youtube-evidence.component.css']
})
export class YouTubeEvidenceComponent implements OnInit {
  @Input() manifestation = new Manifestation();
  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() done: EventEmitter<void> = new EventEmitter();
  @Output() evidence: EventEmitter<VerificationRequest> = new EventEmitter();

  account = '';
  youtubeEvidence = new YouTubeEvidence();
  linkedFromYouTube = false;

  constructor(private web3Service: Web3Service,
              private ipfsService: IpfsService,
              private youtubeEvidenceContractService: YouTubeEvidenceContractService,
              private alertsService: AlertsService,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.youtubeEvidence.evidenced = this.manifestation.hash;
    this.authenticationService.getSelectedAccount()
      .subscribe(account => this.account = account );
  }

  addEvidence(form: NgForm) {
    this.youtubeEvidenceContractService.addEvidence(this.youtubeEvidence, this.account)
    .subscribe(result => {
      if (typeof result === 'string') {
        console.log('Transaction hash: ' + result);
        this.alertsService.info('Evidence request submitted, you will be alerted when confirmed.<br>' +
          'Receipt: <a target="_blank" href="https://goerli.etherscan.io/tx/' + result + '">' + result + '</a>');
        this.done.emit();
      } else {
        console.log(result);
        this.evidence.emit(result);
        this.alertsService.modal(VerificationRequestComponent, result);
        this.youtubeEvidence.id = '';
      }
    }, error => {
      this.alertsService.error(error);
    });
  }

  cancelEvidence() {
    this.cancel.emit();
  }
}
