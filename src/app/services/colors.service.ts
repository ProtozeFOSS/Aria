import { Injectable, Output, Input  } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class ColorService  {
  // DEFAULTING TO DARK COLOR PALLETE
  // Main Elements (background, sub containers, context menu)
  @Input() @Output() readonly textColor = 'white'; // Main Text Color
  @Input() @Output() readonly textColorAttention = 'purple'; // Attention text
  @Input() @Output() readonly textColorRemove = 'red'; // Remove/Delete/Close
  @Input() @Output() readonly textColorAdd = 'green'; // Add/Create/Open
  @Input() @Output() readonly textColorActive = 'light-blue'; // Add/Create/Open
  @Input() @Output() readonly background = '#434343'; // Main background Color
  @Input() @Output() readonly bgContainer = '#353535'; // background of Containers
  @Input() @Output() readonly bgMenu = '#353535'; // background of Menus
  @Input() @Output() readonly bgItem = '#353535'; // background of containers

  // Context menu specifically
  @Input() readonly bgContext = '#CC9966';
  @Input() readonly textColorContext = 'white';
  @Input() readonly borderContext = '#CC9966';


  // Control Elements (Buttons, sliders, number wheels, toggle switches)
  @Input() @Output() readonly fgItem = '#00ffffff';
  @Input() @Output() readonly fgItemContrast = '#e25400';

  // Board Colors
  @Input() readonly boardBGDark = new BehaviorSubject<string>("#CC9966");
  @Input() readonly boardBGLight = new BehaviorSubject<string>("#FFCC99");

  // Game Score Colors
  @Input() @Output() readonly gsFontColor = new BehaviorSubject<string>('white');
  @Input() @Output() readonly gsBackground = new BehaviorSubject<string>('#353535');
  @Input() @Output() readonly gsBorder = new BehaviorSubject<string>('#353535');

  // Game Score Highlight Colors
  @Input() @Output() readonly gsFontColorHG = new BehaviorSubject<string>('white');
  @Input() @Output() readonly gsBgColorHG = new BehaviorSubject<string>('#353535');
  @Input() @Output() readonly gsBorderHG = new BehaviorSubject<string>('black 1px solid');

  // Game Score Item Colors
  @Input() @Output() readonly gsFontColorItem = new BehaviorSubject<string>('white');
  @Input() @Output() readonly gsBgColorItem = new BehaviorSubject<string>('#353535');
  @Input() @Output() readonly gsBorderItem = new BehaviorSubject<string>('black 1px solid');

  // Game Score Ply Count
  @Input() @Output() readonly gsFontColorCount = new BehaviorSubject<string>('white');
  @Input() @Output() readonly gsBgColorCount = new BehaviorSubject<string>('#353535');
  @Input() @Output() readonly gsBorderCount = new BehaviorSubject<string>('black 1px solid');

  // Menu specific Colors


  // Title Colors
  constructor() { }

  setDarkColorPalette(): void {
  }

  setLightColorPalette(): void {
  }

  setStoredColorPalette(): void {
    // 1.) Read User color palette sent from CG.com
    // 2.) Look for a cookie on disk (load from disk)
    // 3.) User default CSS Styled color palette
  }

  initializeColorPalette(): void {
    console.log('Setting primary color to ' + this.fgItem);
    // Main Elements
    document.documentElement.style.setProperty('--textCoolor', this.textColor);
    document.documentElement.style.setProperty('--itextColorAttention', this.textColorAttention);
    document.documentElement.style.setProperty('--textColorRemove', this.textColorRemove);
    document.documentElement.style.setProperty('--textColorAdd', this.textColorAdd);
    document.documentElement.style.setProperty('--textColorActive', this.textColorActive);
    document.documentElement.style.setProperty('--background', this.background);
    document.documentElement.style.setProperty('--bgItem', this.bgItem);
    document.documentElement.style.setProperty('--bgContainer', this.bgContainer);
    document.documentElement.style.setProperty('--bgMenu', this.bgMenu);

    // Context Menu
    document.documentElement.style.setProperty('--bgContext', this.bgContext);
    document.documentElement.style.setProperty('--textColorContext', this.textColorContext);
    document.documentElement.style.setProperty('--borderContext', this.borderContext);
  }
}
