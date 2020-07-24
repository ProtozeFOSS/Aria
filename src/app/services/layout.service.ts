import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly landscapeOrientation = new BehaviorSubject<boolean>(true);
  appContainer: ElementRef | null = null;
  constructor() {}

  initializeLayout(appContainer: ElementRef | null): void {
    if (!appContainer) {
      console.log('Invalid App Container %$@');
      console.log(appContainer);
      this.appContainer = appContainer;
    } else {
      const width = appContainer.nativeElement.style.width;
      const height = appContainer.nativeElement.style.height;
      if (width > height) {
        console.log('Initializing Olga with Landscape layout');
      } else {
        console.log('Initializing Olga with Portrait layout');
      }
    }
  }
}
