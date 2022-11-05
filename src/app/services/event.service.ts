/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { from, Observable } from 'rxjs';
import { EventPeekus } from '../models/event.model';
import { StorageService } from './storage.service';
import { mergeMap, tap } from 'rxjs/operators';
import { CommentPeekus } from '../models/comment.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private event!: EventPeekus;

  constructor(private http: HttpClient,
    private storageService: StorageService) { }


  getEvents(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.get(`${environment.baseUrl}/event${params}`, options);
    }));
  }

  saveEvent(eventToPost: any): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.post(`${environment.baseUrl}/event`, eventToPost, options);
    }));
  }

  getParticipantsByEvent(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.get(`${environment.baseUrl}/event/participants${params}`, options);
    }));
  }

  getCommentsByEvent(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.get(`${environment.baseUrl}/comment${params}`, options);
    }));
  }

  postComment(commentToPost: CommentPeekus): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.post(`${environment.baseUrl}/comment`, commentToPost, options);
    }));
  }

  saveParticipant(participantToPost: any): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.post(`${environment.baseUrl}/event/participants`, participantToPost, options);
    }));
  }

  async saveParticipants(participantList: any[], eventId: string){
    for await (const participantToPost of participantList){
      await this.saveParticipant({idEvent: eventId, idParticipant: participantToPost}).toPromise();
    }
    return true;
  }

  deleteParticipant(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.delete(`${environment.baseUrl}/event/participants${params}`, options);
    }));
  }

  saveLike(likeToPost: any): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.post(`${environment.baseUrl}/like`, likeToPost, options);
    }));
  }

  deletelike(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.delete(`${environment.baseUrl}/like${params}`, options);
    }));
  }

}
