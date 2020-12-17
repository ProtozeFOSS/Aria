import { Injectable, Output, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { BoardTheme } from '../canvas-chessboard/types';
import { environment } from '../../environments/environment';
@Injectable({
  providedIn: 'root',
})
export class ThemeService {

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
  @Input() readonly overlayContextBackgroundGradient = 'linear-gradient(153deg, rgba(199,199,199,0.9051995798319328) 41%, rgba(249,249,249,0.8911939775910365) 83%)';


  // Board Colors
  @Input() @Output() readonly boardBGDark = new BehaviorSubject<string>('#81388f');
  @Input() @Output() readonly boardBGLight = new BehaviorSubject<string>('#e0fffb');
  @Input() @Output() readonly boardLabelDark = new BehaviorSubject<string>('#81388f');
  @Input() @Output() readonly boardLabelLight = new BehaviorSubject<string>('#e0fffb');
  @Input() @Output() readonly boardPieceSet = new BehaviorSubject<string>(environment.piecesPath + 'merida/');


  // Menu
  @Input() @Output() readonly meBackground = new BehaviorSubject<string>('#353535');
  @Input() @Output() readonly meTextColor = new BehaviorSubject<string>('white');

  // Game Score Variables
  @Input() @Output() readonly gsTextColor = new BehaviorSubject<string>('black');
  @Input() @Output() readonly gsBackground = new BehaviorSubject<string>('transparent');
  @Input() @Output() readonly gsListBackground = new BehaviorSubject<string>('#353535');
  @Input() @Output() readonly gsBorder = new BehaviorSubject<string>('');
  @Input() @Output() readonly gsTextSize = new BehaviorSubject<string>('16px');
  @Input() @Output() readonly gsTableItemWidth = new BehaviorSubject<string>('70px');
  @Input() @Output() readonly gsTablePlyWidth = new BehaviorSubject<string>('48px');

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


  // Control Elements (Buttons, sliders, number wheels, toggle switches)
  readonly csBackground = new BehaviorSubject<string>('#81388f');
  readonly csColor = new BehaviorSubject<string>('#e0fffb');
  readonly csFill = new BehaviorSubject<string>('#00ffffff');
  readonly csFill2 = new BehaviorSubject<string>('#00ffffff');
  readonly csAccent = new BehaviorSubject<string>('#e25400');
  readonly csAccent2 = new BehaviorSubject<string>('#e25400');



  // Font Sizes
  readonly gsFontSize = new BehaviorSubject<number>(14);
  readonly gsFontSizeHG = new BehaviorSubject<number>(14);
  readonly gsFontSizeAN = new BehaviorSubject<number>(14);
  readonly gsFontSizeVA = new BehaviorSubject<number>(14);
  readonly gsFontSizePC = new BehaviorSubject<number>(14);
  readonly hdrDataFontSize = new BehaviorSubject<number>(14);
  readonly hdrNameFontSize = new BehaviorSubject<number>(14);
  readonly hdrTitleFontSize = new BehaviorSubject<number>(14);
  readonly hdrVariantFontSize = new BehaviorSubject<number>(14);
  readonly hdrMatchDataFontSize = new BehaviorSubject<number>(14);
  readonly hdrResultFontSize = new BehaviorSubject<number>(14);
  readonly hdrRoundFontSize = new BehaviorSubject<number>(14);

  @Output() propertyMap = new Map<string, BehaviorSubject<string> | BehaviorSubject<number>>();
  // Menu specific Colors

  // Title Colors
  constructor() {
    // Game Score
    this.createColorMap();
  }

  updateColor(name: string, color: string): void {
    if (this.propertyMap.has(name)) {
      const subject = this.propertyMap.get(name) as BehaviorSubject<string>;
      if (subject) {
        subject.next(color);
      }
      document.documentElement.style.setProperty(
        name,
        color
      );
    }
  }

  boardTheme(): BoardTheme {
    return new BoardTheme(
      this.boardBGLight.value,
      this.boardBGDark.value,
      this.boardPieceSet.value
    );
  }

  private createColorMap(): void {
    this.propertyMap.clear();
    this.propertyMap.set('--gsTextColorPC', this.gsTextColorPC);
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
    this.propertyMap.set('--gsTableItemWidth', this.gsTableItemWidth);
    this.propertyMap.set('--gsTablePlyWidth', this.gsTablePlyWidth);
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
    this.propertyMap.set('--csFill', this.csFill);
    this.propertyMap.set('--csFill2', this.csFill2);
    this.propertyMap.set('--csAccent', this.csAccent);
    this.propertyMap.set('--csAccent2', this.csAccent2);


    // Font Sizes
    this.propertyMap.set('--gsFontSize', this.gsFontSize);
    this.propertyMap.set('--gsFontSizeAN', this.gsFontSizeAN);
    this.propertyMap.set('--gsFontSizeHG', this.gsFontSizeHG);
    this.propertyMap.set('--gsFontSizeVA', this.gsFontSizeVA);
    this.propertyMap.set('--gsFontSizePC', this.gsFontSizePC);
    this.propertyMap.set('--hdrDataFontSize', this.hdrDataFontSize);
    this.propertyMap.set('--hdrNameFontSize', this.hdrNameFontSize);
    this.propertyMap.set('--hdrTitleFontSize', this.hdrTitleFontSize);
    this.propertyMap.set('--hdrVariantFontSize', this.hdrVariantFontSize);
    this.propertyMap.set('--hdrMatchDataFontSize', this.hdrMatchDataFontSize);
    this.propertyMap.set('--hdrResultFontSize', this.hdrResultFontSize);
    this.propertyMap.set('--hdrRoundFontSize', this.hdrRoundFontSize);

    this.propertyMap.forEach((value, key) => {
      if (typeof value.value == "string") {
        (value as BehaviorSubject<string>).subscribe((newVal) => {
          document.documentElement.style.setProperty(key, newVal);
        });
      } else {
        (value as BehaviorSubject<number>).subscribe((newVal) => {
          document.documentElement.style.setProperty(key, newVal + "px");
        });
      }
    });
  }
  public settings(): object {
    let settings = {};
    this.propertyMap.forEach((behavior, key) => {
      // @ts-ignore
      settings[key] = behavior.value;
    });
    return settings;
  }

  public setSettings(settings: object): void {
    for (let key in settings) {
      if (this.propertyMap.has(key)) {
        const subject = this.propertyMap.get(key);
        if (subject) {
          // @ts-ignore
          subject.next(settings[key]);
        }
      }
    }
    this.initializeColorPalette();
  }

  setDarkColorPalette(): void {
    // Add hardcoded chessgames dark color pallete
  }

  setLightColorPalette(): void {
    // Add hardcoded chessgames dark color pallete
  }

  initializeColorPalette(): void {
    this.propertyMap.forEach((value, key) => {
      if (typeof value.value == "string") {
        document.documentElement.style.setProperty(key, value.value);
      } else {
        document.documentElement.style.setProperty(key, value.value + "px");
      }
    });
  }
}
