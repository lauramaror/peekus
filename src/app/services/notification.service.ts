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
export class NotificationService {

  constructor(private http: HttpClient,
    private storageService: StorageService) { }

  getNotifications(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.get(`${environment.baseUrl}/notification${params}`, options);
    }));
  }

  saveNotification(notifToPost: any): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.post(`${environment.baseUrl}/notification`, notifToPost, options);
    }));
  }

  getNotificationUsers(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.get(`${environment.baseUrl}/notification/users${params}`, options);
    }));
  }

  saveNotificationUsers(notifUserToPost: any): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.post(`${environment.baseUrl}/notification/users`, notifUserToPost, options);
    }));
  }

  updateNotificationUser(params: any): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.put(`${environment.baseUrl}/notification/users${params}`, {}, options);
    }));
  }

}
