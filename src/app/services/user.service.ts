import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Data } from '@angular/router';
import { tap } from  'rxjs/operators';
import { Login } from '../models/login.model';
import { StorageService } from './storage.service';

@Injectable({
  providedIn: 'root'
})
export class UserService {

  authSubject = new BehaviorSubject(false);
  private user!: User;

  constructor(
    private http: HttpClient,
    private storage: StorageService
    ) {
    }

  getUsers(): Observable<object>{
    return this.http.get(`${environment.baseUrl}/user`);
  }

  saveUser(userData: User): Observable<object> {
    return this.http.post(`${environment.baseUrl}/user`, userData)
    .pipe(
      tap( async (res: any) => {
        if(res.ok){
          await this.storage.set('ACCESS_TOKEN', res.token);
          this.user = new User(res.id);
          this.authSubject.next(true);
        }
      })
    );
  }

  login(userData: Login): Observable<object> {
    return this.http.post(`${environment.baseUrl}/auth`, userData)
      .pipe(
        tap( async (res: any) => {
          if(res.ok){
            await this.storage.set('ACCESS_TOKEN', res.token);
            this.user = new User(res.id);
            this.authSubject.next(true);
          }
        })
      );
  }

  async logout(){
    await this.storage.remove('ACCESS_TOKEN');
    await this.storage.clear();
    this.authSubject.next(false);
  }

  isLoggedIn() {
    // const token = await this.storage.get('ACCESS_TOKEN');
    // console.log('token en userservice',token);
    // if(token){
    //   this.authSubject.next(true);
    // }
    return this.authSubject.asObservable();
  }

  getUserId(): string {
    return this.user.id;
  }

}

