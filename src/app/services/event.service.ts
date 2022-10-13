import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { Event } from '../models/event.model';

@Injectable({
  providedIn: 'root'
})
export class EventService {

  private event!: Event;

  constructor(private http: HttpClient) { }

  getEvents(): Observable<object>{
    return this.http.get(`${environment.baseUrl}/event`);
  }

}
