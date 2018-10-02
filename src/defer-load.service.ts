import { Injectable, isDevMode } from '@angular/core';
import { Observable, Subject } from 'rxjs';

export enum IntersectionState {
  Disconnected,
  None,
  Intersecting,
  Visible,
  Prerender
}

@Injectable({
  providedIn: 'root'
})
export class DeferLoadService {
  isDevMode = isDevMode();
  
  // announce order to directives of ngFor children
  private order$ = new Subject<string>();
  announcedOrder = this.order$.asObservable();
  announceOrder(name: string) {
    this.order$.next(name);
  }

  // announce intersecting event to ngFor children components
  private intersection$ = new Subject<any>(); 
  announcedIntersection = this.intersection$.asObservable();
  announceIntersection(params: object) { // { index: number, state: IntersectionState }
    this.intersection$.next(params);
  }
}
