/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { from, Observable, of} from 'rxjs';
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

  updateEvent(eventToUpdate: any, params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.put(`${environment.baseUrl}/event${params}`, eventToUpdate, options);
    }));
  }

  updateEventStatus(eventToUpdate: any, params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.put(`${environment.baseUrl}/event/status${params}`, eventToUpdate, options);
    }));
  }

  deleteEvent(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.delete(`${environment.baseUrl}/event${params}`, options);
    }));
  }

  getCodes(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.get(`${environment.baseUrl}/code${params}`, options);
    }));
  }

  saveCode(codeToPost: any): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.post(`${environment.baseUrl}/code`, codeToPost, options);
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

  saveParticipantsList(participantToPost: any): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.post(`${environment.baseUrl}/event/participants/list`, participantToPost, options);
    }));
  }

  updateParticipant(participantToUpdate: any): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.put(`${environment.baseUrl}/event/participants`, participantToUpdate, options);
    }));
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

  deleteLike(params: string): Observable<object>{
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
