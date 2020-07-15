import { Injectable, Output, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class ColorService {
  @Input() @Output() readonly fgItem = '#00ffffff';
  @Input() @Output() readonly bgItem = '#9e9e9e';
  @Input() @Output() readonly fgItemContrast = '#e25400';
  @Input() @Output() readonly textColor= 'white';
  @Input() @Output() readonly bgOuter = '#434343';
  @Input() @Output() readonly bgInner = '#353535';
  @Input() readonly boardBGDark = new BehaviorSubject<string>("#CC9966");
  @Input() readonly boardBGLight = new BehaviorSubject<string>("#FFCC99");
  constructor() { }
}
