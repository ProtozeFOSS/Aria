import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
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
  @ViewChild(GamescoreUxComponent)
  gameScoreComponent: GamescoreUxComponent | null = null;
  @ViewChild(CanvasChessBoard)
  canvasBoardComponent: CanvasChessBoard | null = null;
  @ViewChild('olgaContainer')
  appContainer: ElementRef | null = null;
  @ViewChild(OlgaMenuComponent)
  menuComponent: OlgaMenuComponent | null = null;
  @ViewChild(OlgaControlsComponent)
  controlsComponent: OlgaControlsComponent | null = null;
  @ViewChild(CookieConsentComponent)
  cookiesComponent: CookieConsentComponent | null = null;
  @ViewChild(OlgaHeaderComponent)
  headerComponent: OlgaHeaderComponent | null = null;
  @ViewChild(OlgaStatusComponent)
  statusComponent: OlgaStatusComponent | null = null;
  @Output() gameScoreWidth: number | null = 389;
  @Output() oldWidth: number | null = 0;
  @Output() keymap: Map<string, any> = new Map<string, any>();

  protected doneResizingScore = false;
  resizeObserver: ResizeObserver = new ResizeObserver(this.resizeEvent.bind(this));
  constructor(
    public olga: OlgaService,
    public themes: ThemeService,
    public layout: LayoutService
  ) {
    const date = new Date();
    this.olga.UUID = 'OLGA-' + date.getTime().toString();
    console.log('ID: ' + this.olga.UUID);
    this.loadKeymap();
    // this.olga..subscribe((game) => {
    //   this.currentGame = game;
    //   //this.gameScoreComponent.setGame(game);
    //   //this.canvasBoarComponent.setGame(game);
    //   //this.layout.updateLayout();
    // })
  }

 
  // tslint:disable-next-line: typedef
  ngAfterViewInit() {

    this.layout.boardElement = document.getElementById(this.olga.UUID + '-ccb');
    this.layout.controlsElement = document.getElementById('olga-controls-' + this.olga.UUID);
    this.layout.statusElement = document.getElementById('olga-status-' + this.olga.UUID);
    this.layout.headerElement = document.getElementById('olga-header-' + this.olga.UUID);
    
    this.olga.attachOlga(this);
    if (this.gameScoreComponent) {
      this.gameScoreComponent.resizeHandleEvent = this.layout.onSliderDrag.bind(this.layout);
      this.gameScoreComponent.resizeTouchEvent = this.layout.onSliderTouch.bind(this.layout);
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
    this.olga.loadPGN(TestPGNData + this.gameScoreComponent?.getPGN());
    this.resizeObserver.observe(this.appContainer.nativeElement);
    window.onkeydown = this.keyEvent.bind(this);
    window.setTimeout(()=>{ 
      this.olga.loadSettings();
      this.layout.initializeLayout(this);
      this.themes.initializeColorPalette();
    },1);


  }
  mouseMoved(event: MouseEvent): void {
    if (this.gameScoreComponent && this.gameScoreComponent.resizing) {
      this.gameScoreComponent.resizeHandleEvent(event);
      if (event.buttons === 0) {
        this.gameScoreComponent.resizing = false;
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

  protected resizeEvent(entries: []) {
    // @ts-ignore
    this.layout.resizeLayout(entries[0].contentRect);
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
    if (this.gameScoreComponent && this.gameScoreComponent.resizing) {
      this.gameScoreComponent.resizeTouchEvent(event);
    }
  }

  setBoardSize(size: number): void {
    if (this.canvasBoardComponent) {
      this.canvasBoardComponent.setSize(size);
    }
  }
  setGameScoreSize(size: number): void {
    this.gameScoreWidth = size;
    if (this.canvasBoardComponent) {
      this.canvasBoardComponent.setSize(this.gameScoreWidth);
    }
  }

  setMenuSize(size: number): void {
    this.menuComponent?.resize(size, size);
  }

  ignoreEvent(event: MouseEvent): void {
    //console.log('Ignoring ' + event);
    event.preventDefault();
    event.stopPropagation();
  }
}
