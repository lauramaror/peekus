import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { from, Observable } from 'rxjs';
import { Event } from '../models/event.model';
import { StorageService } from './storage.service';
import { mergeMap, tap } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private event!: Event;

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

}
