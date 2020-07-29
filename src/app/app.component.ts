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
    this.resizeToScreen();
    window.addEventListener('resize', this.resizeToScreen.bind(this));

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

  resizeToScreen(): void {
    if (this.olgaBoard && this.gameScoreUx) {
      if (this.layoutService.landscapeOrientation) {
        let boardSize = Math.floor(window.innerWidth * 0.075) * 8;
        if (boardSize >= window.innerHeight) {
          boardSize = Math.floor((window.innerHeight - 8) / 8) * 8;
        }
        let padding = window.innerWidth * 0.05;
        if (padding >= 42 || padding <= 24) {
          padding = 38;
        }
        const gsSize = Math.floor(window.innerWidth - (boardSize + padding));
        this.setBoardSize(boardSize);
        this.setGameScoreSize(gsSize);
      }
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
        if (gsSize <= 100) {
          boardSize -= 100 - gsSize;
          gsSize = 100;
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
      this.gameScoreUx.setWidth(this.gameScoreWidth);
    }
  }
  ignoreEvent(event: MouseEvent): void {
    console.log('Ignoring ' + event);
    event.preventDefault();
    event.stopPropagation();
  }
}
