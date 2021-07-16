import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { Manifestation } from '../manifestations/manifestation';

@Injectable({
  providedIn: 'root',
})
export class ManifestationQuery extends Query<any> {
  document = gql`
  query GetManifestation($manifestationId: ID!) {
    manifestation(id: $manifestationId)
    {
      id
      authors
      title
      creationTime
      expiryTime
      evidenceCount
      transaction
    }
  }`;
}
