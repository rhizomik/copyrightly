import { Injectable, NgZone } from '@angular/core';
import { Observable } from 'rxjs';

declare const require: any;

const iPFSClient = require('ipfs-http-client');

@Injectable({
  providedIn: 'root'
})
export class IpfsService {
  private ipfsApi: any;

  constructor(private ngZone: NgZone) {
    this.ipfsApi = iPFSClient({ host: 'ipfs.infura.io', port: '5001', protocol: 'https' });
  }

  public uploadFile(file: any, uploadToIpfs: any): Observable<string> {
    return new Observable((observer) => {
      this.ngZone.runOutsideAngular(() => {
        const reader = new FileReader();
        reader.onprogress = (progress) => console.log(`Loaded: ${progress.loaded}/${progress.total}`);
        reader.onloadend = () => {
          this.saveToIpfs(reader, uploadToIpfs).subscribe((hash: string) => {
            this.ngZone.run(() => {
              observer.next(hash);
              observer.complete();
            });
          }, error => this.ngZone.run(() => observer.error(error)) );
        };
        reader.readAsArrayBuffer(file);
      });
      return { unsubscribe: () => {} };
    });
  }

  private saveToIpfs(reader: any, uploadToIpfs: any): Observable<string> {
    return new Observable((observer) => {
      this.ngZone.runOutsideAngular(() => {
        const buffer = Buffer.from(reader.result);
        this.ipfsApi.add(buffer, {onlyHash: !uploadToIpfs, progress: (progress: string) => console.log(`Saved: ${progress}`)})
        .then((response: any) => {
          console.log(`IPFS_ID: ${response.path}`);
          observer.next(response.path);
          observer.complete();
        })
        .catch((error: string) => {
          console.error(error);
          observer.error(new Error('Error uploading file, see logs for details'));
        });
      });
      return { unsubscribe: () => {} };
    });
  }
}
