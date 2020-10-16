import { Injectable, Output, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import {  BoardTheme } from '../canvas-chessboard/types';

@Injectable({
  providedIn: 'root',
})
export class ColorService {
  // DEFAULTING TO DARK COLOR PALLETE
  // Main Elements (background, sub containers, context menu)
  protected olga: any | null = null;
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
  @Input() readonly overlayContextBackgroundGradient='linear-gradient(153deg, rgba(199,199,199,0.9051995798319328) 41%, rgba(249,249,249,0.8911939775910365) 83%)';

  // Control Elements (Buttons, sliders, number wheels, toggle switches)
  @Input() @Output() readonly fgItem = '#00ffffff';
  @Input() @Output() readonly fgItemContrast = '#e25400';

  // Board Colors
  @Input() @Output() readonly boardBGDark = new BehaviorSubject<string>('#81388f');
  @Input() @Output() readonly boardBGLight = new BehaviorSubject<string>('#e0fffb');
  @Input() @Output() readonly boardLabelDark = new BehaviorSubject<string>('#81388f');
  @Input() @Output() readonly boardLabelLight = new BehaviorSubject<string>('#e0fffb');
  @Input() @Output() readonly boardPieceSet = new BehaviorSubject<string>('../../assets/images/pieces/merida/');


  // Menu
  @Input() @Output() readonly meBackground = new BehaviorSubject<string>('#353535');
  @Input() @Output() readonly meTextColor = new BehaviorSubject<string>('white');

  // Game Score Variables
  @Input() @Output() readonly gsTextColor = new BehaviorSubject<string>('white');
  @Input() @Output() readonly gsBackground = new BehaviorSubject<string>('#353535');
  @Input() @Output() readonly gsListBackground = new BehaviorSubject<string>('#353535');
  @Input() @Output() readonly gsBorder = new BehaviorSubject<string>('');
  @Input() @Output() readonly gsTextSize = new BehaviorSubject<string>('16px');

  // Game Score Highlight Colors
  @Input() @Output() readonly gsTextColorHG = new BehaviorSubject<string>('orange');
  @Input() @Output() readonly gsAnnotationColorHG = new BehaviorSubject<string>('lightcoral');
  @Input() @Output() readonly gsBackgroundHG = new BehaviorSubject<string>('#353535');
  @Input() @Output() readonly gsBorderHG = new BehaviorSubject<string>('');

  // Game Score Annotation Colors
  @Input() @Output() readonly gsTextColorAN = new BehaviorSubject<string>('#AED6F1');
  @Input() @Output() readonly gsBackgroundAN = new BehaviorSubject<string>('#333333');
  @Input() @Output() readonly gsBorderAN = new BehaviorSubject<string>('');
  @Input() @Output() readonly gsTextSizeAN = new BehaviorSubject<string>('16px');

  // Game Score Variation Colors
  @Input() @Output() readonly gsTextColorVA = new BehaviorSubject<string>('white');
  @Input() @Output() readonly gsBackgroundVA = new BehaviorSubject<string>('#353535');
  @Input() @Output() readonly gsBorderVA = new BehaviorSubject<string>('black 1px solid');

  // Game Score Ply Count
  @Input() @Output() readonly gsTextColorPC = new BehaviorSubject<string>('white');
  @Input() @Output() readonly gsBackgroundPC = new BehaviorSubject<string>('#353535');
  @Input() @Output() readonly gsBorderPC = new BehaviorSubject<string>('');

  @Input() @Output() readonly csBackground = new BehaviorSubject<string>('#81388f');
  @Input() @Output() readonly csColor = new BehaviorSubject<string>('#e0fffb');


  @Output() propertyMap = new Map<string, BehaviorSubject<string>>();
  // Menu specific Colors

  // Title Colors
  constructor() {
    // Game Score
    this.propertyMap.set( '--gsTextColorPC', this.gsTextColorPC);
    this.propertyMap.set('--gsTextColor', this.gsTextColor);
    this.propertyMap.set('--gsBackgroundPC', this.gsBackgroundPC);
    this.propertyMap.set('--gsBorderPC', this.gsBorderPC);
    this.propertyMap.set('--gsTextColorVA', this.gsTextColorVA);
    this.propertyMap.set('--gsBackgroundVA', this.gsBackgroundVA);
    this.propertyMap.set('--gsBorderVA', this.gsBorderVA);
    this.propertyMap.set('--gsTextColorAN', this.gsTextColorAN);
    this.propertyMap.set('--gsBackgroundAN', this.gsBackgroundAN);
    this.propertyMap.set('--gsBorderAN', this.gsBorderAN);
    this.propertyMap.set('--gsTextColorHG', this.gsTextColorHG);
    this.propertyMap.set('--gsBackgroundHG', this.gsBackgroundHG);
    this.propertyMap.set('--gsBackground', this.gsBackground);
    this.propertyMap.set('--gsListBackground', this.gsListBackground);
    this.propertyMap.set('--gsBorderHG', this.gsBorderHG);
    this.propertyMap.set('--gsTextColorHG', this.gsTextColorHG);
    this.propertyMap.set('--gsBackgroundHG', this.gsBackgroundHG);
    this.propertyMap.set('--gsAnnotationColorHG', this.gsAnnotationColorHG);
    // Menu
    this.propertyMap.set('--meBackground', this.meBackground);
    // Board
    this.propertyMap.set('--boardLabelDark', this.boardLabelDark);
    this.propertyMap.set('--boardLabelLight', this.boardLabelLight);
    this.propertyMap.set('--boardBGDark', this.boardBGDark);
    this.propertyMap.set('--boardBGLight', this.boardBGLight);
    // Controls
    this.propertyMap.set('--csBackground', this.csBackground);
    this.propertyMap.set('--csColor', this.csColor);
  }
  public setOlga(olga: any) : void {
    this.olga = olga;
  }
  updateColor(name: string, color: string) : void {
    if(this.propertyMap.has(name)) {
      const subject = this.propertyMap.get(name);
      if(subject) {
        subject.next(color);
      }
      document.documentElement.style.setProperty(
        name,
        color
      );
    }
    // if(name.indexOf('board') >= 0) {
    //   if(this.olga && this.olga.reRenderBoard) {
    //     this.olga.reRenderBoard();
    //   }
    // }
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
      '--textColorAttention',
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
    this.propertyMap.forEach((value, key) => {
      document.documentElement.style.setProperty(
        key,
        value.value
      );
    })
  }
}
