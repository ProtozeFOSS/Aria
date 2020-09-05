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
import { OlgaService, ChessGame } from './services/game.service';
import { OlgaService } from './services/olga.service';
import { SettingsMenuComponent } from './settings/settings-menu/settings-menu.component';

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
  @Output() gameScoreElement: HTMLElement | null = null;
  @Output() boardElement: HTMLElement | null = null;
  @Output() controlsElement: HTMLElement | null = null;
  @Output() statusElement: HTMLElement | null = null;
  @Input() pgnString = '';
  @Input() olgaID = '12312321';
  @Output() gameScoreWidth: number | null = 389;
  @Output() oldWidth: number | null = 0;
  protected doneResizingScore = false;
  constructor(
    public olga: OlgaService,
    public colorService: ColorService,
    public layoutService: LayoutService,
  ) {
    const date = new Date();
    this.olgaID = 'OLGA-' + date.getTime().toString();
    console.log('ID: ' + this.olgaID);
    // this.olga..subscribe((game) => {
    //   this.currentGame = game;
    //   //this.gameScoreComponent.setGame(game);
    //   //this.canvasBoarComponent.setGame(game);
    //   //this.layoutService.updateLayout();
    // })
  }

  // tslint:disable-next-line: typedef
  ngAfterViewInit() {
    this.gameScoreElement = document.getElementById('app-gamescore' + this.olgaID);
    this.boardElement = document.getElementById(this.olgaID + '-ccb');
    this.controlsElement = document.getElementById('olga-controls' + this.olgaID);
    this.statusElement = document.getElementById('olga-status' + this.olgaID);
    this.colorService.initializeColorPalette();
    this.colorService.boardBGDark.subscribe((bgDark) => {
      this.canvasBoardComponent?.setDarkTile(bgDark);
    })
    this.layoutService.initializeLayout(this);
    if (this.canvasBoardComponent) {
      this.olga.attachBoard(this.canvasBoardComponent);
    }
    if (this.gameScoreComponent) {
      this.olga.attachScore(this.gameScoreComponent);
      this.gameScoreComponent.resizeHandleEvent = this.layoutService.onSliderDrag.bind(this.layoutService);
      this.gameScoreComponent.resizeTouchEvent = this.layoutService.onSliderTouch.bind(this.layoutService);
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
  }
  mouseMoved(event: MouseEvent): void {
    if (this.gameScoreComponent && this.gameScoreComponent.resizing) {
      this.gameScoreComponent.resizeHandleEvent(event);
      if (event.buttons === 0) {
        this.gameScoreComponent.resizing = false;
      }
    }
  }

  touchMoved(event: TouchEvent): void {
    if (this.gameScoreComponent && this.gameScoreComponent.resizing) {
      this.gameScoreComponent.resizeTouchEvent(event);
    }
  }

  loadPGN(pgn: string) {
    this.olga.loadPGN(pgn);
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
