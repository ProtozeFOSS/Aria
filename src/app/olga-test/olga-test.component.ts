import { Component, OnInit, ViewChild, ElementRef, AfterViewInit, Input, Output, EventEmitter } from '@angular/core';
import { MatSliderChange } from '@angular/material/slider';
import { GamescoreUxComponent } from '../game-score/game-score.ux';
import { OlgaBoardComponent } from '../olga-board/olga-board.component';
@Component({
  selector: 'app-olga-test',
  templateUrl: './olga-test.component.html',
  styleUrls: ['./olga-test.component.scss']
})
export class OlgaTestComponent implements OnInit, AfterViewInit {
  @ViewChild(GamescoreUxComponent)
  gameScoreItem: GamescoreUxComponent | null = null;
  @ViewChild(OlgaBoardComponent)
  olgaBoard: OlgaBoardComponent | null = null;
  @Input() gameScore: HTMLElement | null = null;
  @Input() olgaID = '12312321';
  @Output() gameScoreWidth: number | null =  389;
  @Output() oldWidth: number | null = 0;
  ngOnInit(): void {
  }

  // tslint:disable-next-line: typedef
  ngAfterViewInit() {
    this.gameScore  = document.getElementById('app-gamescore' + this.olgaID);
    console.log('Got Game Score');
    console.log(this.gameScoreItem);
    if(this.olgaBoard && this.gameScoreItem) {
      this.olgaBoard.setSize(window.innerHeight * .9);
      this.gameScoreWidth = (window.innerHeight * .9) - window.innerHeight;
      this.gameScoreItem?.setWidth(this.gameScoreWidth);
    }
  }

  resizeGameScore(event: MatSliderChange): void {
    if (event) {
      this.gameScoreWidth = event.value;
      if(this.gameScoreItem) {
        this.gameScoreItem?.setWidth(this.gameScoreWidth);
      }
    }
  }
  resizeBoard(event: MatSliderChange): void {
    if (event) {
      if(this.olgaBoard) {
        this.olgaBoard.setSize(event.value as number);
        console.log('Olga Board Size: ' + this.olgaBoard.boardSize);
      }
    }
  }
  setBoardSize( size: number ): void {
    if(this.olgaBoard) {
      console.log('Resizing Board: ' + size );
      this.olgaBoard.setSize(size);
    }
  }
  setGameScoreSize( size: number ): void {
    this.gameScoreWidth = size;
    if(this.gameScoreItem) {
      this.gameScoreItem?.setWidth(this.gameScoreWidth);
    }
  }
}
