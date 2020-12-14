import {ActivatedRoute, Router, RoutesRecognized} from "@angular/router";
import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Output,
} from '@angular/core';
import { GamescoreUxComponent } from './olga-score/olga-score.component';
import { CanvasChessBoard } from './canvas-chessboard/canvas-chessboard.component';
import { ThemeService } from './services/themes.service';
import { LayoutService } from './services/layout.service';
import { OlgaService } from './services/olga.service';
import { OlgaControlsComponent } from './olga-controls/olga-controls.component';
import { OlgaMenuComponent } from './olga-menu/olga-menu.component';
import { CookieConsentComponent } from './cookie-consent/cookie-consent.component';
import { OlgaHeaderComponent } from './olga-header/olga-header.component';
import { TestPGNData } from './test';
import { OlgaStatusComponent } from './olga-status/olga-status.component';
const THEMES = 'themes';
const LAYOUT = 'layout';
const OLGA = 'olga';

@Component({
  selector: 'olga',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class Olga implements AfterViewInit {
  title = 'Olga PGN Viewer 2.0';
  resizeHandle: HTMLElement | null = null;
  // @ts-ignore
  @ViewChild(GamescoreUxComponent) gameScoreComponent: GamescoreUxComponent;
  // @ts-ignore
  @ViewChild(CanvasChessBoard) canvasBoardComponent: CanvasChessBoard;
  // @ts-ignore
  @ViewChild('olgaContainer') appContainer: ElementRef;
  // @ts-ignore
  @ViewChild(OlgaMenuComponent) menuComponent: OlgaMenuComponent;
  // @ts-ignore
  @ViewChild(OlgaControlsComponent) controlsComponent: OlgaControlsComponent;
  // @ts-ignore
  @ViewChild(CookieConsentComponent) cookiesComponent: CookieConsentComponent;
  // @ts-ignore
  @ViewChild(OlgaHeaderComponent) headerComponent: OlgaHeaderComponent | null;
  // @ts-ignore
  @ViewChild(OlgaStatusComponent) statusComponent: OlgaStatusComponent | null;
  // @ts-ignore
  @Output() gameScoreWidth: number = 389;
  // @ts-ignore
  @Output() oldWidth: number = 0;
  // @ts-ignore
  @Output() keymap: Map<string, any> = new Map<string, any>();
  // @ts-ignore
  @ViewChild('pgnData') pgnData: ElementRef; // To Be Deleted
  protected doneResizingScore = false;
  constructor(
    private route: ActivatedRoute,
    public olga: OlgaService,
    public themes: ThemeService,
    public layout: LayoutService,
    private router: Router
  ) {

    this.router.events.subscribe(val => {
      if (val instanceof RoutesRecognized) {
        const params = val?.state?.root?.firstChild?.params;
        if(params) {
          try {
            const decoded = atob(params.settings);
            const settings_obj = JSON.parse(decoded);
            this.applyJsonSettings(settings_obj);
            this.olga.cookiesAccepted.next(false);
          } catch(any) {

          }
        }
      }
    });
    const date = new Date();
    this.olga.UUID = 'OLGA-' + date.getTime().toString();
    console.log('ID: ' + this.olga.UUID);
    this.loadKeymap();
  }

 
  // tslint:disable-next-line: typedef
  ngAfterViewInit() {
    this.layout.boardElement = document.getElementById(this.olga.UUID + '-ccb');
    this.layout.controlsElement = document.getElementById('olga-controls-' + this.olga.UUID);
    this.layout.statusElement = document.getElementById('olga-status-' + this.olga.UUID);
    this.layout.headerElement = document.getElementById('olga-header-' + this.olga.UUID);
    this.layout.resizeElement = document.getElementById('resize-handle-' + this.olga.UUID);
    
    this.olga.attachOlga(this);
    this.layout.initializeLayout(this);
    if (this.gameScoreComponent) {
      //this.gameScoreComponent.resizeHandleEvent = this.layout.onSliderDrag.bind(this.layout);
      //this.gameScoreComponent.resizeTouchEvent = this.layout.onSliderTouch.bind(this.layout);
    }
    this.themes.boardBGLight.subscribe((light) => {
      if (this.canvasBoardComponent) {
        this.canvasBoardComponent.setLightTile(light);
      }
    });
    this.themes.boardBGDark.subscribe((dark) => {
      if (this.canvasBoardComponent) {
        this.canvasBoardComponent.setDarkTile(dark);
      }
    });
    this.olga.loadPGN(TestPGNData + this.pgnData.nativeElement.value);
    window.onkeydown = this.keyEvent.bind(this);
    window.setTimeout(()=>{ 
      this.olga.loadSettings();
      this.themes.initializeColorPalette();
      this.appContainer.nativeElement.style.width = '';
      this.appContainer.nativeElement.style.width = '100%';
      this.appContainer.nativeElement.style.height = '';
      this.appContainer.nativeElement.style.height = '100%';
    },1);


  }
  mouseMoved(event: MouseEvent): void {
    if (this.gameScoreComponent) {
      //this.gameScoreComponent.resizeHandleEvent(event);
      if (event.buttons === 0) {
      }
    }
  }

  public autoPlayActive(): boolean {
    if(this.controlsComponent) {
      return this.controlsComponent.playing;
    }
    return false;
  }

  public applyJsonSettings(settings: object) : boolean {
    if(settings) {
      // @ts-ignore
      if(settings[THEMES]) {
        // @ts-ignore
        this.themes.setSettings(settings[THEMES]);
      }
      return true;
    }
    return false;
  }

  public applyDefaultSettings(): boolean {
    this.themes.initializeColorPalette();
    return true;
  }

  public getJsonSettings(): string {
    const themeSettings = this.themes.settings();
    const layoutSettings = this.layout.settings();
    const olgaSettings = this.olga.settings();
    return JSON.stringify({themes: themeSettings, layout: layoutSettings, olga:olgaSettings});
  }


  public toggleAutoPlay(): void {
    if(this.olga) {
      this.olga.toggleAutoPlay();
    }
  }

  protected loadKeymap():void {
    // initial default keymap
    this.keymap.set('Space', ()=>{this.olga.toggleAutoPlay();});
    this.keymap.set('Home', ()=>{this.olga.moveToStart();});
    this.keymap.set('End', ()=>{this.olga.moveToEnd();});
    this.keymap.set('ArrowRight', ()=>{this.olga.advance();});
    this.keymap.set('ArrowLeft', ()=>{this.olga.previous();});
    this.keymap.set('KeyI', ()=>{this.olga.rotateBoardOrientation();});
  }

  keyEvent(event: any): void {
    console.log(event);
    if(this.keymap.has(event.code)) {
      console.log('Got this key: ' + event.code);
      const action = this.keymap.get(event.code);
      action();
    }
  }

  touchMoved(event: TouchEvent): void {
    if (this.gameScoreComponent) {
      //this.resizeTouchEvent(event);
    }
  }

  ignoreEvent(event: MouseEvent): void {
    //console.log('Ignoring ' + event);
    event.preventDefault();
    event.stopPropagation();
  }

  /// RESIZING FUNCTIONS
  // resetResizeHandle(event: DragEvent | MouseEvent): void {
  //   this.resizing = false;
  //   if (this.resizeHandle && event.buttons === 0) {
  //     document.body.style.cursor = 'pointer';
  //     this.resizeHandle.nativeElement.style.cursor = 'pointer';
  //   }
  //   if (this.resizeHandleEvent) {
  //     this.resizeHandleEvent(event);
  //   }
  // }

  // setGrabCursor(event: DragEvent | MouseEvent): void {
  //   this.resizing = true;
  //   document.body.style.cursor = 'grab';
  //   if (this.resizeHandle) {
  //     this.resizeHandle.nativeElement.style.cursor = 'grab';
  //   }
  // }

  // resetCursor(): void {
  //   document.body.style.cursor = 'pointer';
  //   if (this.resizeHandle) {
  //     this.resizeHandle.nativeElement.style.cursor = 'pointer';
  //   }
  // }

  // startTouch(event: TouchEvent): void {
  //   const touchPoint = event.touches[0];
  //   if (touchPoint) {
  //     if (this.layout.resizeElement) {
  //       this.resizing = true;
  //     }
  //   }
  // }

  // stopTouch(event: TouchEvent) {
  //   this.resizing = false;
  // }



  // resizeHandleEvent(event: DragEvent | MouseEvent): void {
  //   if (this.resizing) {
  //     this.resizeScore();
  //   }
  // }

  // resizeTouchEvent(event: TouchEvent): void {
  //   if (this.resizing) {
  //     this.resizeScore();
  //   }
  // }

  // resizeHandleCore(event: DragEvent | MouseEvent): void {
  //   event.preventDefault();
  //   event.stopPropagation();
  //   //document.body.style.cursor = 'grab';
  //   if (this.resizeHandle) {
  //     //this.resizeHandle.nativeElement.style.cursor = 'grab';
  //   }
  //   if (event.buttons > 0 && this.resizeHandleEvent) {
  //     this.resizeHandleEvent(event);
  //   }
  // }

}
