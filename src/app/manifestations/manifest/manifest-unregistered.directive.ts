import { Directive, NgZone } from '@angular/core';
import { AbstractControl, AsyncValidator, NG_ASYNC_VALIDATORS, ValidationErrors
} from '@angular/forms';
import { Observable } from 'rxjs';
import { ManifestationsContractService } from '../manifestations-contract.service';
import { Manifestation } from '../manifestation';
import { ManifestationDetailsQueryService } from '../../query/manifestation-details.query.service';

@Directive({
  selector: '[appManifestUnregistered]',
  providers: [{provide: NG_ASYNC_VALIDATORS, useClass: ManifestUnregisteredDirective, multi: true}]
})
export class ManifestUnregisteredDirective implements AsyncValidator {

  constructor(private manifestationDetailsQuery: ManifestationDetailsQueryService,
              private ngZone: NgZone) {}

  validate(control: AbstractControl): Observable<ValidationErrors | null> {
    return new Observable((observer) => {
      this.ngZone.runOutsideAngular(() => {
        this.manifestationDetailsQuery.fetch({ manifestationId: control.value })
        .subscribe(({data}) => {
          const manifestation = new Manifestation(({...data.manifestation}));
          if (!manifestation.title) {
            this.ngZone.run(() => {
              observer.next(null);
              observer.complete();
            });
          } else {
            this.ngZone.run(() => {
              if (manifestation.evidenceCount > 0 || manifestation.expiryTime >= new Date()) {
                observer.next({manifestUnregistered: {title: manifestation.title}});
                observer.complete();
              } else {
                observer.next(null);
                observer.complete();
              }
            });
          }
        }, error => {
          this.ngZone.run(() => {
            observer.next(null);
            observer.complete();
          });
        });
      });
    });
  }
}