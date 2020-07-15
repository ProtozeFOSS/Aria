import { Injectable, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class GamescoreService {
  @Input() @Output() readonly figurineNotation: BehaviorSubject<boolean> = new BehaviorSubject<boolean>(false);
  @Output() readonly scoreFontFamily: BehaviorSubject<string> = new BehaviorSubject<string>('Caveat');
  @Output() readonly scoreFontSize: BehaviorSubject<number> = new BehaviorSubject<number>(18);
  constructor() { }


}
