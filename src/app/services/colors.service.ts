import { Injectable, Output, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {  BoardTheme } from '../canvas-chessboard/types';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
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

  // Context menu
  @Input() readonly bgContext = '#CC9966';
  @Input() readonly textColorContext = 'white';
  @Input() readonly borderContext = 'solid black 1px';
  @Input() readonly overlayContextBackground = 'rgb(199,199,199)';
  @Input() readonly overlayContextBackgroundGradient =
    'linear-gradient(153deg, rgba(199,199,199,0.9051995798319328) 41%, rgba(249,249,249,0.8911939775910365) 83%)';

  // Control Elements (Buttons, sliders, number wheels, toggle switches)
  @Input() @Output() readonly fgItem = '#00ffffff';
  @Input() @Output() readonly fgItemContrast = '#e25400';

  // Board Colors
  @Input() @Output() readonly boardBGDark = new BehaviorSubject<string>(
    '#81388f'
  );
  @Input() @Output() readonly boardBGLight = new BehaviorSubject<string>(
    '#e0fffb'
  );
  @Input() @Output() readonly boardPieceSet = new BehaviorSubject<string>(
    '../../assets/images/pieces/merida/'
  );

  // Game Score Variables
  @Input() @Output() readonly gsTextColor = new BehaviorSubject<string>(
    'white'
  );
  @Input() @Output() readonly gsBackground = new BehaviorSubject<string>(
    '#353535'
  );
  @Input() @Output() readonly gsBorder = new BehaviorSubject<string>('');
  @Input() @Output() readonly gsTextSize = new BehaviorSubject<string>('16px');

  // Game Score Highlight Colors
  @Input() @Output() readonly gsTextColorHG = new BehaviorSubject<string>(
    'orange'
  );
  @Input() @Output() readonly gsBackgroundHG = new BehaviorSubject<string>(
    '#353535'
  );
  @Input() @Output() readonly gsBorderHG = new BehaviorSubject<string>(
    ''
  );

  // Game Score Annotation Colors
  @Input() @Output() readonly gsTextColorAN = new BehaviorSubject<string>(
    '#AED6F1'
  );
  @Input() @Output() readonly gsBackgroundAN = new BehaviorSubject<string>(
    '#333333'
  );
  @Input() @Output() readonly gsBorderAN = new BehaviorSubject<string>(
    ''
  );
  @Input() @Output() readonly gsTextSizeAN = new BehaviorSubject<string>('16px');

  // Game Score Variation Colors
  @Input() @Output() readonly gsTextColorVA = new BehaviorSubject<string>(
    'white'
  );
  @Input() @Output() readonly gsBackgroundVA = new BehaviorSubject<string>(
    '#353535'
  );
  @Input() @Output() readonly gsBorderVA = new BehaviorSubject<string>(
    'black 1px solid'
  );

  // Game Score Ply Count
  @Input() @Output() readonly gsTextColorPC = new BehaviorSubject<string>(
    'white'
  );
  @Input() @Output() readonly gsBackgroundPC = new BehaviorSubject<string>(
    '#353535'
  );
  @Input() @Output() readonly gsBorderPC = new BehaviorSubject<string>(
    ''
  );

  @Output() propertyMap = new Map<BehaviorSubject<string>, string>();
  // Menu specific Colors

  // Title Colors
  constructor() {
    this.propertyMap.set(this.gsTextColorPC, '--gsTextColorPC');
    this.propertyMap.set(this.gsBackgroundPC, '--gsBackgroundPC');
    this.propertyMap.set(this.gsBorderPC, '--gsBorderPC');
    this.propertyMap.set(this.gsTextColorVA, '--gsTextColorVA');
    this.propertyMap.set(this.gsBackgroundVA, '--gsBackgroundVA');
    this.propertyMap.set(this.gsBorderVA, '--gsBorderVA');
    this.propertyMap.set(this.gsTextColorAN, '--gsTextColorAN');
    this.propertyMap.set(this.gsBackgroundAN, '--gsBackgroundAN');
    this.propertyMap.set(this.gsBorderAN, '--gsBorderAN');
    this.propertyMap.set(this.gsTextColorHG, '--gsTextColorHG');
    this.propertyMap.set(this.gsBackgroundHG, '--gsBackgroundHG');
    this.propertyMap.set(this.gsBorderHG, '--gsBorderHG');
    this.propertyMap.set(this.gsTextColorHG, '--gsTextColorHG');
    this.propertyMap.set(this.gsBackgroundHG, '--gsBackgroundHG');
    this.propertyMap.set(this.gsBorderHG, '--gsBorderHG');
  }


  boardTheme(): BoardTheme {
    return new BoardTheme(
      this.boardBGLight.value,
      this.boardBGDark.value,
      this.boardPieceSet.value
    );
  }

  setDarkColorPalette(): void { }

  setLightColorPalette(): void { }

  setStoredColorPalette(): void {
    // 1.) Read User color palette sent from CG.com
    // 2.) Look for a cookie on disk (load from disk)
    // 3.) User default CSS Styled color palette
  }

  initializeColorPalette(): void {
    // Main Elements
    document.documentElement.style.setProperty('--textCoolor', this.textColor);
    document.documentElement.style.setProperty(
      '--itextColorAttention',
      this.textColorAttention
    );
    document.documentElement.style.setProperty(
      '--textColorRemove',
      this.textColorRemove
    );
    document.documentElement.style.setProperty(
      '--textColorAdd',
      this.textColorAdd
    );
    document.documentElement.style.setProperty(
      '--textColorActive',
      this.textColorActive
    );
    document.documentElement.style.setProperty('--background', this.background);
    document.documentElement.style.setProperty('--bgItem', this.bgItem);
    document.documentElement.style.setProperty(
      '--bgContainer',
      this.bgContainer
    );
    document.documentElement.style.setProperty('--bgMenu', this.bgMenu);

    // Context Menu
    document.documentElement.style.setProperty('--bgContext', this.bgContext);
    document.documentElement.style.setProperty(
      '--overlayContextBackground',
      this.overlayContextBackground
    );
    document.documentElement.style.setProperty(
      '--textColorContext',
      this.textColorContext
    );
    document.documentElement.style.setProperty('--bgContext', this.bgContext);
    document.documentElement.style.setProperty(
      '--overlayContextBackgroundGradient',
      this.overlayContextBackgroundGradient
    );
    document.documentElement.style.setProperty(
      '--borderContext',
      this.borderContext
    );

    // Game Score
    document.documentElement.style.setProperty('--gsBackground', this.gsBackground.value);
    document.documentElement.style.setProperty(
      '--gsTextColor',
      this.gsTextColor.value
    );
    document.documentElement.style.setProperty(
      '--gsTextSize',
      this.gsTextSize.value
    );
    document.documentElement.style.setProperty(
      '--gsBackground',
      this.gsBackground.value
    );
    document.documentElement.style.setProperty(
      '--gsBorder',
      this.gsBorder.value
    );
    document.documentElement.style.setProperty(
      '--boardBGDark',
      this.boardBGDark.value
    );
    this.propertyMap.forEach((value, key) => {
      document.documentElement.style.setProperty(
        value,
        key.value
      );
    })
  }
}
