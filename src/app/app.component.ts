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
  width = 600;
  height = 400;
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
      this.olgaBoard.setSize(window.innerHeight * 0.9);
      this.gameScoreWidth = window.innerHeight * 0.9 - window.innerHeight;
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

  resizeGameScore(event: MatSliderChange): void {
    if (event) {
      this.gameScoreWidth = event.value;
      if (this.gameScoreUx) {
        this.gameScoreUx?.setWidth(this.gameScoreWidth);
      }
    }
  }

  resizeBoard(event: DragEvent): void {
    if (event && event.clientX > 64) {
      if (this.olgaBoard) {
        const gsSize = window.innerWidth - event.clientX;
        const widthAvailable = window.innerWidth - (gsSize + 18);
        if (window.innerHeight - 12 > widthAvailable) {
          this.doneResizingScore = false;
          this.setBoardSize(widthAvailable);
          this.setGameScoreSize(gsSize);
        } else if (!this.doneResizingScore) {
          this.setBoardSize(window.innerHeight - 12);
          this.setGameScoreSize(gsSize);
          this.doneResizingScore = true;
        }
      }
    }
  }
  setBoardSize(size: number): void {
    if (this.olgaBoard) {
      this.olgaBoard.setSize(size);
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
  onResize(event: Event): void {
    console.log('Width: ' + this.width);
    console.log('Height: ' + this.height);
  }
}
