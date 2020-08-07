import {
  Component,
  AfterViewInit,
  ViewChild,
  ElementRef,
  Input,
  Output,
} from '@angular/core';
import { GamescoreUxComponent } from './game-score/game-score.ux';
import { OlgaBoardComponent } from './olga-board/olga-board.component';
import { ColorService } from './services/colors.service';
import { MatSliderChange } from '@angular/material/slider';
import { EngineService } from './services/engine.service';
import { Piece } from 'chessops/types';
import { LayoutService } from './services/layout.service';
import { GameScoreService } from './services/game-score.service';
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class Olga implements AfterViewInit {
  title = 'Olga Test Bed';
  @ViewChild(GamescoreUxComponent)
  gameScoreUx: GamescoreUxComponent | null = null;
  @ViewChild(OlgaBoardComponent)
  olgaBoard: OlgaBoardComponent | null = null;
  @ViewChild('olgaContainer')
  olgaContainer: ElementRef | null = null;
  @Output() gameScoreElement: HTMLElement | null = null;
  @Output() boardElement: HTMLElement | null = null;
  @Output() controlsElement: HTMLElement | null = null;
  @Input() pgnString = '';
  @Input() olgaID = '12312321';
  @Output() gameScoreWidth: number | null = 389;
  @Output() oldWidth: number | null = 0;
  protected doneResizingScore = false;
  constructor(
    public layoutService: LayoutService,
    public colorService: ColorService,
    public chessEngine: EngineService,
    public scoreService: GameScoreService
  ) {
    const date = new Date();
    this.olgaID = 'OLGA-' + date.getTime().toString();
    console.log('ID: ' + this.olgaID);
  }

  // tslint:disable-next-line: typedef
  ngAfterViewInit() {
    this.gameScoreElement = document.getElementById('app-gamescore' + this.olgaID);
    this.boardElement = document.getElementById('app-board' + this.olgaID);
    this.controlsElement = document.getElementById('olga-controls' + this.olgaID);
    this.colorService.initializeColorPalette();
    this.layoutService.initializeLayout(this);
    if (this.gameScoreUx) {
      this.gameScoreUx.resizeHandleEvent = this.layoutService.onSliderDrag.bind(this.layoutService);
    }
  }
  mouseMoved(event: MouseEvent): void {
    if (this.gameScoreUx?.resizing) {
      this.gameScoreUx?.resizeHandleEvent(event);
    }
    if (this.gameScoreUx && event.buttons === 0) {
      this.gameScoreUx.resizing = false;
    }
  }

  loadPGN(pgn: string) {
    this.scoreService.loadPGN(pgn);
  }

  setBoardSize(size: number): void {
    if (this.olgaBoard) {
      this.olgaBoard.setBoardSize(size);
    }
  }
  setGameScoreSize(size: number): void {
    this.gameScoreWidth = size;
    if (this.gameScoreUx) {
      this.gameScoreUx.setWidth(this.gameScoreWidth);
    }
  }
  ignoreEvent(event: MouseEvent): void {
    //console.log('Ignoring ' + event);
    event.preventDefault();
    event.stopPropagation();
  }
}
