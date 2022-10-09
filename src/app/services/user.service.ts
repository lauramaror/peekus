import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Observable } from 'rxjs';
import { User } from '../models/user.model';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  private user!: User;

  constructor(private http: HttpClient) { }

  getUsers(): Observable<object>{ console.log(environment.baseUrl);
    return this.http.get(`${environment.baseUrl}/user`);
  }

}
