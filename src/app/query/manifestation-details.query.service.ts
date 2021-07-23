import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { Manifestation } from '../manifestations/manifestation';

export interface Response {
  manifestation: Manifestation;
}

@Injectable({
  providedIn: 'root',
})
export class ManifestationDetailsQueryService extends Query<Response> {
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
