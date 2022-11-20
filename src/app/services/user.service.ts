/* eslint-disable arrow-body-style */
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { BehaviorSubject, Observable, of, throwError } from 'rxjs';
import { User } from '../models/user.model';
import { Data } from '@angular/router';
import { catchError, map, mergeMap, tap } from  'rxjs/operators';
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

  getUsers(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.get(`${environment.baseUrl}/user${params}`, options);
    }));
  }

  getFriends(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.get(`${environment.baseUrl}/friend${params}`, options);
    }));
  }

  saveFriend(friendToPost: any): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.post(`${environment.baseUrl}/friend`, friendToPost, options);
    }));
  }

  updateFriend(friendToUpdate: any): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.put(`${environment.baseUrl}/friend`, friendToUpdate, options);
    }));
  }

  deleteFriend(params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.delete(`${environment.baseUrl}/friend${params}`, options);
    }));
  }

  saveUser(userData: User): Observable<object> {
    return this.http.post(`${environment.baseUrl}/user`, userData)
    .pipe(
      mergeMap( async (res: any) => {
          await this.storageService.set('ACCESS_TOKEN', res.token);
          this.user = new User(res.id, res.username, '', true, res.name, '', 0, res.idProfilePicture);
          await this.storageService.set('USER', this.user);
          this.authSubject.next(true);
          return this.authSubject.asObservable();
      })
    );
  }

  updateUser(userData: User, params: string): Observable<object>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
      const options = {
        headers: {
          token: authToken
        }
      };
      return this.http.put(`${environment.baseUrl}/user${params}`, userData, options);
    }));
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
            this.user = new User(res.id, res.username, '', true, res.name, '', 0, res.idProfilePicture);
            await this.storageService.set('USER', this.user);
            this.authSubject.next(true);
            return this.authSubject.asObservable();
        }), catchError(err =>{
          return of(err);
        })
      );
  }

  validateToken(): Observable<boolean>{
    return this.storageService.getAccessToken().pipe(mergeMap(authToken=>{
        const options = {
          headers: {
            token: authToken ? authToken : ''
          }
        };
        return this.http.get(`${environment.baseUrl}/auth/token`, options);
      })).pipe(mergeMap(async (res: any)=>{
          await this.storageService.set('ACCESS_TOKEN', res.token);
          this.user = new User(res.id, res.username, '', true, res.name, '', 0, res.idProfilePicture);
          await this.storageService.set('USER', this.user);
          this.authSubject.next(true);
          return true;
      }), catchError(err =>{
        return of(false);
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

