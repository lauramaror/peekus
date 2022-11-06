import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable } from 'rxjs';
import { User } from '../models/user.model';
import { Data } from '@angular/router';
import { map, mergeMap, tap } from  'rxjs/operators';
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
    private storageService: StorageService
    ) {
    }

  getUsers(): Observable<object>{
    return this.http.get(`${environment.baseUrl}/user`);
  }

  saveUser(userData: User): Observable<object> {
    return this.http.post(`${environment.baseUrl}/user`, userData)
    .pipe(
      mergeMap( async (res: any) => {
          await this.storageService.set('ACCESS_TOKEN', res.token);
          this.user = new User(res.id, res.username, '', true, res.name, '', 0, res.profilePic);
          await this.storageService.set('USER', this.user);
          this.authSubject.next(true);
          return this.authSubject.asObservable();
      })
    );
  }

  updateProfilePic(imgUser: any): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.put(`${environment.baseUrl}/user/profilepic`, imgUser, options);
    }));
  }

  login(userData: Login): Observable<object> {
    return this.http.post(`${environment.baseUrl}/auth`, userData)
      .pipe(
        mergeMap( async (res: any) => {
            await this.storageService.set('ACCESS_TOKEN', res.token);
            this.user = new User(res.id, res.username, '', true, res.name, '', 0, res.profilePic);
            await this.storageService.set('USER', this.user);
            this.authSubject.next(true);
            return this.authSubject.asObservable();
        })
      );
  }

  validateToken(): Observable<boolean>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
        const options = {
          headers: {
            token: authToken
          }
        };
        return this.http.get(`${environment.baseUrl}/auth/token`, options);
      })).pipe(mergeMap(async (res: any)=>{
        if(res.ok){
          await this.storageService.set('ACCESS_TOKEN', res.token);
          this.user = new User(res.id, res.username, '', true, res.name, '', 0, res.profilePic);
          await this.storageService.set('USER', this.user);
          this.authSubject.next(true);
          return true;
        }
        else{
          return false;
        }
      }));
  }

  async logout(){
    await this.storageService.remove('ACCESS_TOKEN');
    await this.storageService.remove('USER');
    await this.storageService.clear();
    this.authSubject.next(false);
  }

  getUserId(): string {
    return this.user.id;
  }

}

