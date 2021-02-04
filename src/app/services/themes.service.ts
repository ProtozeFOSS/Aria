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
  @Input() @Output() readonly gsTableItemWidth = new BehaviorSubject<string>('70px');
  @Input() @Output() readonly gsTablePlyWidth = new BehaviorSubject<string>('48px');

   // Game Score Ply Count
  gsFontSizeSL = 14;
  gsFontSizeST = 24;
  gsFontSizeSF = 20;
  gsFontSizeGF = 20;
  gsFontSizeAN = 14;
  gsFontSizePC = 14;
  gsFontSizeVA = 14;
  gsFontSizeBH = 14;
  gsFontSizeWM = 14;
  gsFontSizeBM = 14;
  gsFontSizeCA = 14;
  gsFontSizeCP = 18;
  gsFontSizeCV = 14;
  gsFontSizeCH = 14;
  gsFontSizeCW = 14;
  gsFontSizeCB = 14;

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
  readonly gsTextColorVA = new BehaviorSubject<string>('white');
  readonly gsBackgroundVA = new BehaviorSubject<string>('#353535');
  readonly gsBorderVA = new BehaviorSubject<string>('black 1px solid');


  // Game Score SVG Icon properties
  gsIconSF = 'chevron-down';
  gsIconGF = 'chevron-up';


  // Control Elements
  // Navigation Bar (Start, Previous, Next, End)




  // Font Sizes
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
    this.propertyMap.set('gsTextColor', this.gsTextColor);
    this.propertyMap.set('gsTextColorVA', this.gsTextColorVA);
    this.propertyMap.set('gsBackgroundVA', this.gsBackgroundVA);
    this.propertyMap.set('gsBorderVA', this.gsBorderVA);
    this.propertyMap.set('gsTextColorAN', this.gsTextColorAN);
    this.propertyMap.set('gsBackgroundAN', this.gsBackgroundAN);
    this.propertyMap.set('gsBorderAN', this.gsBorderAN);
    this.propertyMap.set('gsTextColorHG', this.gsTextColorHG);
    this.propertyMap.set('gsBackgroundHG', this.gsBackgroundHG);
    this.propertyMap.set('gsBorderHG', this.gsBorderHG);
    this.propertyMap.set('gsTextColorHG', this.gsTextColorHG);
    this.propertyMap.set('gsBackgroundHG', this.gsBackgroundHG);
    this.propertyMap.set('gsAnnotationColorHG', this.gsAnnotationColorHG);
    this.propertyMap.set('gsTableItemWidth', this.gsTableItemWidth);
    this.propertyMap.set('gsTablePlyWidth', this.gsTablePlyWidth);
    
    // Board   
    this.propertyMap.set('boardLabelDark', this.boardLabelDark);
    this.propertyMap.set('boardLabelLight', this.boardLabelLight);
    this.propertyMap.set('boardBGDark', this.boardBGDark);
    this.propertyMap.set('boardBGLight', this.boardBGLight);

    // Controls Navigation Bar
    document.documentElement.style.setProperty('--csFillNV','#00ffffff');
    document.documentElement.style.setProperty('--csFillNV', '#00ffffff');
    document.documentElement.style.setProperty('--csFill2NV', 'transparent');
    document.documentElement.style.setProperty('--csBorderNV', '2px black solid');
    document.documentElement.style.setProperty('--csBorder2NV', 'white');
    document.documentElement.style.setProperty('--csAccentNV', '#e25400');
    
    // Controls Quick Action Bar
    document.documentElement.style.setProperty('--csFillQA', '#00ffffff');
    document.documentElement.style.setProperty('--csFill2QA', 'transparent');
    document.documentElement.style.setProperty('--csBorderQA', '3px black solid');
    document.documentElement.style.setProperty('--csBorder2QA', 'transparent');
    document.documentElement.style.setProperty('--csAccentQA', '#e25400');
    document.documentElement.style.setProperty('--csAccent2QA', '#e25400');
    

    // Game Score Parent
    document.documentElement.style.setProperty('--gsBorder', '2px black solid');
    document.documentElement.style.setProperty('--gsBorderRadius', '8px');
    document.documentElement.style.setProperty('--gsBackground', 'darkgrey');

    // Game Score Score List
    document.documentElement.style.setProperty('--gsFontFamilySL', 'Arial');
    document.documentElement.style.setProperty('--gsFontSizeSL', '14px');
    document.documentElement.style.setProperty('--gsFontWeightSL', 'bold');
    document.documentElement.style.setProperty('--gsFontColorSL', 'red');
    document.documentElement.style.setProperty('--gsBackgroundSL', 'none');
    document.documentElement.style.setProperty('--gsMarginSL', 'none');
    document.documentElement.style.setProperty('--gsPaddingSL', 'none');
    document.documentElement.style.setProperty('--gsBorderSL', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusSL', '0px');

    // Game Score Title
    document.documentElement.style.setProperty('--gsFontFamilyST', 'Trebuchet MS');
    document.documentElement.style.setProperty('--gsFontSizeST', this.gsFontSizeST + 'px');
    document.documentElement.style.setProperty('--gsFontWeightST', 'bold');
    document.documentElement.style.setProperty('--gsFontColorST', 'black');
    document.documentElement.style.setProperty('--gsBackgroundST', 'transparent');
    document.documentElement.style.setProperty('--gsMarginST', '0px 0px 2px 0px');
    document.documentElement.style.setProperty('--gsPaddingST', '1px 1px 1px 1px');
    document.documentElement.style.setProperty('--gsBorderST', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusST', '2px');

    // Game Score Shrink Font
    document.documentElement.style.setProperty('--gsWidthSF', '20px');
    document.documentElement.style.setProperty('--gsHeightSF', '20px');
    document.documentElement.style.setProperty('--gsStrokeWidthSF', '1.5');
    document.documentElement.style.setProperty('--gsStrokeSF', '#ee75ff');
    document.documentElement.style.setProperty('--gsBackgroundSF', '#0c0c0c6b');
    document.documentElement.style.setProperty('--gsMarginSF', '-3px 3px 0px 0px');
    document.documentElement.style.setProperty('--gsPaddingSF', '2px 3px 3px 3px');
    document.documentElement.style.setProperty('--gsBorderSF', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusSF', '4px');

    // Game Score Grow Font
    document.documentElement.style.setProperty('--gsWidthGF', '26px');
    document.documentElement.style.setProperty('--gsHeightGF', '26px');
    document.documentElement.style.setProperty('--gsStrokeWidthGF', '3');
    document.documentElement.style.setProperty('--gsStrokeGF', '#62bdff');
    document.documentElement.style.setProperty('--gsBackgroundGF', '#0c0c0c6b');
    document.documentElement.style.setProperty('--gsMarginGF', '-4px 4px 0px 0px');
    document.documentElement.style.setProperty('--gsPaddingGF', '0px 0px 0px 0px');
    document.documentElement.style.setProperty('--gsBorderGF', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusGF', '4px');

    // Game Score Annotation
    document.documentElement.style.setProperty('--gsFontFamilyAN', 'Arial');
    document.documentElement.style.setProperty('--gsFontSizeAN', this.gsFontSizeAN + 'px');
    document.documentElement.style.setProperty('--gsFontWeightAN', 'bold');
    document.documentElement.style.setProperty('--gsFontColorAN', 'black');
    document.documentElement.style.setProperty('--gsBackgroundAN', 'transparent');
    document.documentElement.style.setProperty('--gsMarginAN', '0px 0px 2px 0px');
    document.documentElement.style.setProperty('--gsPaddingAN', '1px 1px 1px 1px');
    document.documentElement.style.setProperty('--gsBorderAN', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusAN', '2px');

    // Game Score Ply Count
    document.documentElement.style.setProperty('--gsFontFamilyPC', 'Arial');
    document.documentElement.style.setProperty('--gsFontSizePC', this.gsFontSizePC + 'px');
    document.documentElement.style.setProperty('--gsFontWeightPC', 'bold');
    document.documentElement.style.setProperty('--gsFontColorPC', 'black');
    document.documentElement.style.setProperty('--gsBackgroundPC', 'transparent');
    document.documentElement.style.setProperty('--gsMarginPC', '0px 0px 2px 0px');
    document.documentElement.style.setProperty('--gsPaddingPC', '1px 1px 1px 1px');
    document.documentElement.style.setProperty('--gsBorderPC', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusPC', '2px');
    
    // Game Score Variation
    document.documentElement.style.setProperty('--gsFontFamilyVA', 'Arial');
    document.documentElement.style.setProperty('--gsFontSizeVA', this.gsFontSizeVA + 'px');
    document.documentElement.style.setProperty('--gsFontWeightVA', 'bold');
    document.documentElement.style.setProperty('--gsFontColorVA', 'black');
    document.documentElement.style.setProperty('--gsBackgroundVA', 'transparent');
    document.documentElement.style.setProperty('--gsMarginVA', '0px 0px 2px 0px');
    document.documentElement.style.setProperty('--gsPaddingVA', '1px 1px 1px 1px');
    document.documentElement.style.setProperty('--gsBorderVA', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusVA', '2px');     

    // Game Score Branched Variation
    document.documentElement.style.setProperty('--gsFontFamilyBH', 'Arial');
    document.documentElement.style.setProperty('--gsFontSizeBH', this.gsFontSizeBH + 'px');
    document.documentElement.style.setProperty('--gsFontWeightBH', 'bold');
    document.documentElement.style.setProperty('--gsFontColorBH', 'black');
    document.documentElement.style.setProperty('--gsBackgroundBH', 'transparent');
    document.documentElement.style.setProperty('--gsMarginBH', '0px 0px 2px 0px');
    document.documentElement.style.setProperty('--gsPaddingBH', '1px 1px 1px 1px');
    document.documentElement.style.setProperty('--gsBorderBH', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusBH', '2px');

    // Game Score White Move
    document.documentElement.style.setProperty('--gsFontFamilyWM', 'FigurineSymbolT1');
    document.documentElement.style.setProperty('--gsFontSizeWM', this.gsFontSizeWM + 'px');
    document.documentElement.style.setProperty('--gsFontWeightWM', 'none');
    document.documentElement.style.setProperty('--gsFontColorWM', 'black');
    document.documentElement.style.setProperty('--gsBackgroundWM', 'transparent');
    document.documentElement.style.setProperty('--gsMarginWM', '0px 0px 2px 0px');
    document.documentElement.style.setProperty('--gsPaddingWM', '1px 1px 1px 1px');
    document.documentElement.style.setProperty('--gsBorderWM', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusWM', '2px');

    // Game Score Black Move
    document.documentElement.style.setProperty('--gsFontFamilyBM', 'FigurineSymbolT1');
    document.documentElement.style.setProperty('--gsFontSizeBM', this.gsFontSizeBM + 'px');
    document.documentElement.style.setProperty('--gsFontWeightBM', 'none');
    document.documentElement.style.setProperty('--gsFontColorBM', 'black');
    document.documentElement.style.setProperty('--gsBackgroundBM', 'transparent');
    document.documentElement.style.setProperty('--gsMarginBM', '0px 0px 2px 0px');
    document.documentElement.style.setProperty('--gsPaddingBM', '1px 1px 1px 1px');
    document.documentElement.style.setProperty('--gsBorderBM', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusBM', '2px');

    //  Current Selected Annotation
    document.documentElement.style.setProperty('--gsFontFamilyCA', 'Arial');
    document.documentElement.style.setProperty('--gsFontSizeCA', this.gsFontSizeCA + 'px');
    document.documentElement.style.setProperty('--gsFontWeightCA', 'bold');
    document.documentElement.style.setProperty('--gsFontColorCA', 'black');
    document.documentElement.style.setProperty('--gsBackgroundCA', 'transparent');
    document.documentElement.style.setProperty('--gsMarginCA', '0px 0px 2px 0px');
    document.documentElement.style.setProperty('--gsPaddingCA', '1px 1px 1px 1px');
    document.documentElement.style.setProperty('--gsBorderCA', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusCA', '2px');

    //  Current Selected Ply Count
    document.documentElement.style.setProperty('--gsFontFamilyCP', 'Arial');
    document.documentElement.style.setProperty('--gsFontSizeCP', this.gsFontSizeCP + 'px');
    document.documentElement.style.setProperty('--gsFontWeightCP', 'bold');
    document.documentElement.style.setProperty('--gsFontColorCP', 'blue');
    document.documentElement.style.setProperty('--gsBackgroundCP', 'transparent');
    document.documentElement.style.setProperty('--gsMarginCP', '0px 0px 2px 0px');
    document.documentElement.style.setProperty('--gsPaddingCP', '1px 1px 1px 1px');
    document.documentElement.style.setProperty('--gsBorderCP', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusCP', '2px');

    //  Current Selected Variation
    document.documentElement.style.setProperty('--gsFontFamilyCV', 'Arial');
    document.documentElement.style.setProperty('--gsFontSizeCV', this.gsFontSizeCV + 'px');
    document.documentElement.style.setProperty('--gsFontWeightCV', 'bold');
    document.documentElement.style.setProperty('--gsFontColorCV', 'black');
    document.documentElement.style.setProperty('--gsBackgroundCV', 'transparent');
    document.documentElement.style.setProperty('--gsMarginCV', '0px 0px 2px 0px');
    document.documentElement.style.setProperty('--gsPaddingCV', '1px 1px 1px 1px');
    document.documentElement.style.setProperty('--gsBorderCV', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusCV', '2px');

    // Game Score Current Branched Variation
    document.documentElement.style.setProperty('--gsFontFamilyCH', 'Arial');
    document.documentElement.style.setProperty('--gsFontSizeCH', this.gsFontSizeCH + 'px');
    document.documentElement.style.setProperty('--gsFontWeightCH', 'bold');
    document.documentElement.style.setProperty('--gsFontColorCH', 'black');
    document.documentElement.style.setProperty('--gsBackgroundCH', 'transparent');
    document.documentElement.style.setProperty('--gsMarginCH', '0px 0px 2px 0px');
    document.documentElement.style.setProperty('--gsPaddingCH', '1px 1px 1px 1px');
    document.documentElement.style.setProperty('--gsBorderCH', 'none');
    document.documentElement.style.setProperty('--gsBorderRadiusCH', '2px');

    //  Current Selected White Move
    document.documentElement.style.setProperty('--gsFontFamilyCW', 'Arial');
    document.documentElement.style.setProperty('--gsFontSizeCW', this.gsFontSizeCW + 'px');
    document.documentElement.style.setProperty('--gsFontWeightCW', 'bold');
    document.documentElement.style.setProperty('--gsFontColorCW', 'black');
    document.documentElement.style.setProperty('--gsBackgroundCW', 'grey');
    document.documentElement.style.setProperty('--gsMarginCW', '0px 0px 2px 0px');
    document.documentElement.style.setProperty('--gsPaddingCW', '1px 1px 1px 1px');
    document.documentElement.style.setProperty('--gsBorderCW', '2px solid black');
    document.documentElement.style.setProperty('--gsBorderRadiusCW', '2px');

    //  Current Selected Black Move
    document.documentElement.style.setProperty('--gsFontFamilyCB', 'Arial');
    document.documentElement.style.setProperty('--gsFontSizeCB', this.gsFontSizeCB + 'px');
    document.documentElement.style.setProperty('--gsFontWeightCB', 'bold');
    document.documentElement.style.setProperty('--gsFontColorCB', 'white');
    document.documentElement.style.setProperty('--gsBackgroundCB', 'black');
    document.documentElement.style.setProperty('--gsMarginCB', '0px 0px 2px 0px');
    document.documentElement.style.setProperty('--gsPaddingCB', '1px 1px 1px 1px');
    document.documentElement.style.setProperty('--gsBorderCB', '2px solid grey');
    document.documentElement.style.setProperty('--gsBorderRadiusCB', '2px');

   
    // Font Sizes
    this.propertyMap.set('hdrDataFontSize', this.hdrDataFontSize);
    this.propertyMap.set('hdrNameFontSize', this.hdrNameFontSize);
    this.propertyMap.set('hdrTitleFontSize', this.hdrTitleFontSize);
    this.propertyMap.set('hdrVariantFontSize', this.hdrVariantFontSize);
    this.propertyMap.set('hdrMatchDataFontSize', this.hdrMatchDataFontSize);
    this.propertyMap.set('hdrResultFontSize', this.hdrResultFontSize);
    this.propertyMap.set('hdrRoundFontSize', this.hdrRoundFontSize);

    this.propertyMap.forEach((value, key) => {
      if (typeof value.value == "string") {
        (value as BehaviorSubject<string>).subscribe((newVal) => {
          document.documentElement.style.setProperty('--' + key, newVal);
        });
      } else {
        (value as BehaviorSubject<number>).subscribe((newVal) => {
          document.documentElement.style.setProperty('--' + key, newVal + "px");
        });
      }
    });
  }

  public rescaleScoreFont(scale: number): void {
    // for all game score font sizes
    // set the document property to value * scale
    // end
    document.documentElement.style.setProperty('--gsFontSizeSL', (this.gsFontSizeSL *scale) + 'px');
    document.documentElement.style.setProperty('--gsFontSizePC', (this.gsFontSizePC *scale) + 'px');
    document.documentElement.style.setProperty('--gsFontSizeAN', (this.gsFontSizeAN *scale) + 'px');
    document.documentElement.style.setProperty('--gsFontSizeVA', (this.gsFontSizeVA *scale) + 'px');
    document.documentElement.style.setProperty('--gsFontSizeWM', (this.gsFontSizeWM *scale) + 'px');
    document.documentElement.style.setProperty('--gsFontSizeBM', (this.gsFontSizeBM *scale) + 'px');
    document.documentElement.style.setProperty('--gsFontSizeCA', (this.gsFontSizeCA *scale) + 'px');
    document.documentElement.style.setProperty('--gsFontSizeCP', (this.gsFontSizeCP *scale) + 'px');
    document.documentElement.style.setProperty('--gsFontSizeCV', (this.gsFontSizeCV *scale) + 'px');
    document.documentElement.style.setProperty('--gsFontSizeCW', (this.gsFontSizeCW *scale) + 'px');
    document.documentElement.style.setProperty('--gsFontSizeCB', (this.gsFontSizeCB *scale) + 'px');
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
      const docValue = document.documentElement.style.getPropertyValue('--' + key);
      const value = settings[key];
      if(docValue) {
        if (typeof value == "string") {
          document.documentElement.style.setProperty('--' + key, value);
        } else {
          document.documentElement.style.setProperty('--' + key, value + "px");
        }
      }
      if (this.propertyMap.has(key)) {
        const subject = this.propertyMap.get(key);
        if (subject) {
          // @ts-ignore
          subject.next(settings[key]);
          if (typeof value.value == "string") {
            document.documentElement.style.setProperty('--' + key, value);
          } else {
            document.documentElement.style.setProperty('--' + key, value + "px");
          }
        }
      }else if(this[key] != undefined) {
        this[key] = value;
      }
    }
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
        document.documentElement.style.setProperty('--' + key, value.value);
      } else {
        document.documentElement.style.setProperty('--' + key, value.value + "px");
      }
    });
  }
}
