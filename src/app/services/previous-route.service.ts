import { Injectable } from '@angular/core';
import { Router, NavigationEnd, RoutesRecognized } from '@angular/router';
import {filter, pairwise } from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class PreviousRouteService {

  private previousUrl: string;
  private currentUrl: string;
  private routeList = [];
  private infiniteLoop = false;

  constructor(private router: Router) {

    this.router.events.pipe(filter((evt: any) => evt instanceof RoutesRecognized), pairwise())
      .subscribe((events: RoutesRecognized[]) => {
        this.previousUrl = events[0].urlAfterRedirects;
        this.currentUrl = events[1].urlAfterRedirects;
        this.infiniteLoop = false;
        if(this.routeList.includes(this.currentUrl)){
          this.infiniteLoop = true;
          this.routeList = [];
        }
        this.routeList.push(this.currentUrl);
      });
  }

  public getPreviousUrl() {
    return this.previousUrl;
  }

  public getLoop() {
    return this.infiniteLoop;
  }
}
