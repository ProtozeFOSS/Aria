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
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
})
export class AppComponent implements AfterViewInit {
  title = 'Olga2';
  @ViewChild(GamescoreUxComponent)
  gameScoreUx: GamescoreUxComponent | null = null;
  @ViewChild(OlgaBoardComponent)
  olgaBoard: OlgaBoardComponent | null = null;
  @ViewChild('olgaContainer')
  olgaContainer: ElementRef | null = null;
  @Input() gameScore: HTMLElement | null = null;
  @Input() olgaID = '12312321';
  @Output() gameScoreWidth: number | null = 389;
  @Output() oldWidth: number | null = 0;
  protected doneResizingScore = false;
  constructor(
    public layoutService: LayoutService,
    public colorService: ColorService,
    public chessEngine: EngineService
  ) {
    const date = new Date();
    this.olgaID = 'OLGA-' + date.getTime().toString();
    console.log('ID: ' + this.olgaID);
  }

  // tslint:disable-next-line: typedef
  ngAfterViewInit() {
    this.layoutService.initializeLayout(this.olgaContainer);
    this.gameScore = document.getElementById('app-gamescore' + this.olgaID);
    console.log('Got Game Score');
    console.log(this.gameScoreUx);
    this.colorService.initializeColorPalette();
    if (this.olgaBoard && this.gameScoreUx) {
      this.olgaBoard.setBoardSize(window.innerHeight - 12);
      this.gameScoreWidth = window.innerHeight - 12 - window.innerHeight;
      this.gameScoreUx?.setWidth(this.gameScoreWidth);
    }
    window.addEventListener('resize', (event) => {
      const boardSize = window.innerHeight - 24;
      this.setBoardSize(boardSize);
      this.setGameScoreSize(window.innerWidth - boardSize - 24);
    });

    if (this.gameScoreUx) {
      this.gameScoreUx.resizeHandleEvent = this.resizeBoard.bind(this);
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

  resizeBoard(event: DragEvent): void {
    if (event && event.clientX > 64) {
      if (this.olgaBoard) {
        let gsSize = window.innerWidth - event.clientX;
        const widthAvailable = window.innerWidth - (gsSize + 28);
        let boardSize = Math.floor(widthAvailable / 8) * 8;
        if (boardSize > window.innerHeight) {
          boardSize = Math.floor((window.innerHeight - 16) / 8) * 8;
          gsSize = window.innerWidth - boardSize + 28;
        }
        this.setBoardSize(boardSize);
        this.setGameScoreSize(gsSize);
      }
    }
  }
  setBoardSize(size: number): void {
    if (this.olgaBoard) {
      this.olgaBoard.setBoardSize(size);
    }
  }
  setGameScoreSize(size: number): void {
    this.gameScoreWidth = size;
    if (this.gameScoreUx) {
      this.gameScoreUx?.setWidth(this.gameScoreWidth);
    }
  }
  ignoreEvent(event: MouseEvent): void {
    console.log('Ignoring ' + event);
    event.preventDefault();
    event.stopPropagation();
  }
}
