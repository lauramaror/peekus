import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { tap } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private userService: UserService,
               private router: Router,
               private storageService: StorageService) {}

  canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) {
  return this.storageService.getAccessToken()
    .pipe(
      tap( res => {
        if (!res) {
          this.router.navigateByUrl('/landing');
        }
      })
    );
  }

}
