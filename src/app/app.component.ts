import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
} from '@angular/core';
import { GamescoreUxComponent } from './game-score/game-score.ux';
import { CanvasChessBoard } from './canvas-chessboard/canvas-chessboard.component';
import { ColorService } from './services/colors.service';
import { LayoutService } from './services/layout.service';
import { OlgaService } from './services/olga.service';
import { SettingsMenuComponent } from './settings/settings-menu/settings-menu.component';
import { OlgaControlsComponent } from './olga-controls/olga-controls.component';

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
  @ViewChild(SettingsMenuComponent)
  settingsMenuComponent: SettingsMenuComponent | null = null;
  @ViewChild(OlgaControlsComponent)
  controlsComponent: OlgaControlsComponent | null = null;
  @Input() pgnString = '';
  @Output() gameScoreWidth: number | null = 389;
  @Output() oldWidth: number | null = 0;
  @Output() keymap: Map<string, any> = new Map<string, any>();
  protected doneResizingScore = false;
  constructor(
    public olga: OlgaService,
    public colorService: ColorService,
    public layout: LayoutService,
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
    this.layout.gameScoreElement = document.getElementById('app-gamescore-' + this.olga.UUID);
    this.layout.boardElement = document.getElementById(this.olga.UUID + '-ccb');
    this.layout.controlsElement = document.getElementById('olga-controls-' + this.olga.UUID);
    this.layout.statusElement = document.getElementById('olga-status-' + this.olga.UUID);
    this.layout.settingsMenuElement = document.getElementById('settings-menu-' + this.olga.UUID );
    this.colorService.initializeColorPalette();
    this.colorService.boardBGDark.subscribe((bgDark) => {
      this.canvasBoardComponent?.setDarkTile(bgDark);
    })
    if (this.canvasBoardComponent) {
      this.olga.attachBoard(this.canvasBoardComponent);
    }
    if(this.controlsComponent) {
      this.olga.attachControls(this.controlsComponent);
    }
    if (this.gameScoreComponent) {
      this.olga.attachScore(this.gameScoreComponent);
      this.gameScoreComponent.resizeHandleEvent = this.layout.onSliderDrag.bind(this.layout);
      this.gameScoreComponent.resizeTouchEvent = this.layout.onSliderTouch.bind(this.layout);
    }

    if (this.canvasBoardComponent) {
      this.olga.attachBoard(this.canvasBoardComponent);
    }

    this.colorService.boardBGLight.subscribe((light) => {
      if (this.canvasBoardComponent) {
        this.canvasBoardComponent.setLightTile(light);
      }
    });
    this.colorService.boardBGDark.subscribe((dark) => {
      if (this.canvasBoardComponent) {
        this.canvasBoardComponent.setDarkTile(dark);
      }
    });
    const pgn = this.gameScoreComponent?.getPGN();
    if (pgn) {
      this.olga.loadPGN(pgn);
    }
    window.onkeydown = this.keyEvent.bind(this);
    this.layout.initializeLayout(this);
  }
  mouseMoved(event: MouseEvent): void {
    if (this.gameScoreComponent && this.gameScoreComponent.resizing) {
      this.gameScoreComponent.resizeHandleEvent(event);
      if (event.buttons === 0) {
        this.gameScoreComponent.resizing = false;
      }
    }
  }

  protected loadKeymap():void {
    // initial default keymap

    this.keymap.set('Space', ()=>{this.olga.toggleAutoPlay();});
    this.keymap.set('Home', ()=>{this.olga.moveToStart();});
    this.keymap.set('End', ()=>{this.olga.moveToEnd();});
    this.keymap.set('ArrowRight', ()=>{this.olga.advance();});
    this.keymap.set('ArrowLeft', ()=>{this.olga.previous();});
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
    this.settingsMenuComponent?.resize(size, size);
  }

  ignoreEvent(event: MouseEvent): void {
    //console.log('Ignoring ' + event);
    event.preventDefault();
    event.stopPropagation();
  }
}
