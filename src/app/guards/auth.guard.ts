import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot } from '@angular/router';
import { NavController } from '@ionic/angular';
import { tap } from 'rxjs/operators';
import { StorageService } from '../services/storage.service';
import { UserService } from '../services/user.service';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {

  constructor( private userService: UserService,
               private router: Router,
               private storageService: StorageService,
               private navController: NavController,
               ) {}

  canActivate(
  next: ActivatedRouteSnapshot,
  state: RouterStateSnapshot) {
  return this.userService.validateToken()
    .pipe(
      tap( res => {
        if (!res) {
          this.navController.navigateRoot(['/landing']);
        }
      })
    );
  }

}
