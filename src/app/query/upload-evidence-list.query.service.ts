import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { UploadEvidence } from '../evidence/uploadEvidence';

export interface UploadEvidenceListResponse {
  uploadEvidences: UploadEvidence[];
}
@Injectable({
  providedIn: 'root',
})
export class UploadEvidenceListQueryService extends Query<UploadEvidenceListResponse> {
  document = gql`
  query ListUploadEvidence($evidenced: String!) {
    uploadEvidences(where: { evidenced: $evidenced } )
    {
      id
      registry
      evidenced
      evidencer
      creationTime
      transaction
    }
  }`;
}
