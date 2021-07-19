import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { AlertsService } from '../../alerts/alerts.service';
import { AuthenticationService } from '../../navbar/authentication.service';
import { Web3Service } from '../../util/web3.service';
import { IpfsService } from '../../util/ipfs.service';
import { UploadEvidenceContractService } from '../upload-evidence-contract.service';
import { NgForm } from '@angular/forms';
import { UploadEvidenceEventComponent } from '../upload-evidence-event.component';
import { UploadEvidence } from '../uploadEvidence';
import { Manifestation } from '../../manifestations/manifestation';

@Component({
  selector: 'app-upload-evidence',
  templateUrl: './upload-evidence.component.html',
  styleUrls: ['./upload-evidence.component.css']
})
export class UploadEvidenceComponent implements OnInit {
  @Input() manifestation = new Manifestation();
  @Output() cancel: EventEmitter<void> = new EventEmitter();
  @Output() done: EventEmitter<void> = new EventEmitter();

  account = '';
  uploadEvidence = new UploadEvidence();
  status = 'Register';
  uploadToIpfs = true;
  stake = 1.5;

  constructor(private web3Service: Web3Service,
              private ipfsService: IpfsService,
              private uploadEvidencesContractService: UploadEvidenceContractService,
              private alertsService: AlertsService,
              private authenticationService: AuthenticationService) {}

  ngOnInit(): void {
    this.uploadEvidence.id = this.manifestation.id;
    this.authenticationService.getSelectedAccount()
      .subscribe(account => this.account = account );
  }

  loadFile(event: any) {
    if (event.files.length > 0) {
      this.status = 'Uploading...';
      this.ipfsService.uploadFile(event.files[0], this.uploadToIpfs).subscribe((hash: string) => {
        this.status = 'Register';
        this.uploadEvidence.id = hash;
      }, error => {
        this.status = 'Register';
        this.alertsService.error(error);
      });
    } else {
      this.uploadEvidence.id = '';
    }
  }

  addEvidence(form: NgForm) {
    this.uploadEvidencesContractService.addEvidence(this.uploadEvidence, this.account)
      .subscribe(result => {
        if (typeof result === 'string') {
          console.log('Transaction hash: ' + result);
          this.alertsService.info('Evidence submitted, you will be alerted when confirmed.<br>' +
            'Receipt: <a target="_blank" href="https://goerli.etherscan.io/tx/' + result + '">' + result + '</a>');
          form.reset();
          this.done.emit();
        } else {
          console.log(result);
          this.alertsService.modal(UploadEvidenceEventComponent, result);
        }
      }, error => {
        this.alertsService.error(error);
      });
  }

  cancelUpload() {
    this.cancel.emit();
  }
}
