import { Injectable } from '@angular/core';
import { Query, gql } from 'apollo-angular';
import { YouTubeEvidence } from '../evidence/youtubeEvidence';

export interface UploadEvidenceListResponse {
  youTubeEvidences: YouTubeEvidence[];
}
@Injectable({
  providedIn: 'root',
})
export class YouTubeEvidenceListQueryService extends Query<UploadEvidenceListResponse> {
  document = gql`
  query ListYouTubeEvidence($evidenced: String!) {
    youTubeEvidences(where: { evidenced: $evidenced } )
    {
      id
      registry
      evidenced
      evidencer
      videoId
      creationTime
      transaction
    }
  }`;
}