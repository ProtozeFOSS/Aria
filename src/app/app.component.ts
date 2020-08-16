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
import { GameService, ChessGame } from './services/game.service';
import { OlgaService } from './services/olga.service';

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
  @Output() gameScoreElement: HTMLElement | null = null;
  @Output() boardElement: HTMLElement | null = null;
  @Output() controlsElement: HTMLElement | null = null;
  @Input() pgnString = '';
  @Input() olgaID = '12312321';
  @Output() gameScoreWidth: number | null = 389;
  @Output() oldWidth: number | null = 0;
  protected doneResizingScore = false;
  constructor(
    public olga: OlgaService,
    public colorService: ColorService,
    public gameService: GameService,
    public layoutService: LayoutService,
  ) {
    const date = new Date();
    this.olgaID = 'OLGA-' + date.getTime().toString();
    console.log('ID: ' + this.olgaID);
    // this.gameService..subscribe((game) => {
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
    this.colorService.initializeColorPalette();
    this.layoutService.initializeLayout(this);
    if (this.canvasBoardComponent) {
      this.gameService.attachBoard(this.canvasBoardComponent);
    }
    if (this.gameScoreComponent) {
      this.gameService.attachScore(this.gameScoreComponent);
      this.gameScoreComponent.resizeHandleEvent = this.layoutService.onSliderDrag.bind(this.layoutService);
      this.gameScoreComponent.resizeTouchEvent = this.layoutService.onSliderTouch.bind(this.layoutService);
    }
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
      this.gameScoreComponent.resizing = false;
    }
  }

  loadPGN(pgn: string) {
    this.gameService.loadPGN(pgn);
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
  ignoreEvent(event: MouseEvent): void {
    //console.log('Ignoring ' + event);
    event.preventDefault();
    event.stopPropagation();
  }
}
