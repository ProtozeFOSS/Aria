import { Component, OnInit, ChangeDetectionStrategy, Input, Output, AfterViewInit, ViewChild } from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import { GameScoreService, GameScoreItem } from '../services/game-score.service';
import { MatMenuTrigger } from '@angular/material/menu';
interface Move {
  w: string;
  b: string;
}

@Component({
  selector: 'app-game-score-ux',
  templateUrl: './game-score.ux.html',
  styleUrls: ['./game-score.ux.scss']
})
  // animations: [
  //   trigger('resize', [
  //     // ...
  //     state('large', style({
  //       width: '65%',
  //       height: '50%',
  //       fontSize: '32px',
  //     })),
  //     state('medium', style({
  //       width: '45%',
  //       height: '50%',
  //       fontSize: '24px'
  //     })),
  //     state('small', style({
  //       width: '30%',
  //       height: '50%',
  //       fontSize: '18px'
  //     })),
  //     state('large-p', style({
  //       height: '40%',
  //       width: '100%',
  //       fontSize: '24px'
  //     })),
  //     state('medium-p', style({
  //       width: '100%',
  //       height: '25%',
  //       fontSize: '18px'
  //     })),
  //     state('small-p', style({
  //       height: '10%',
  //       width: '100%',
  //       fontSize: '14px'
  //     })),
  //     transition( 'small => large, small-p => large-p', [
  //       animate('1.5s')
  //     ]),
  //     transition('small => medium, medium => large, small => small-p, medium => medium-p, large => large-p,  small-p => small, medium-p => medium, large-p => large', [
  //       animate('1s')
  //     ]),
  //     transition('large => medium, medium => small, large-p => medium-p, medium-p => small-p', [
  //       animate('0.5s')
  //     ]),
  //   ]),
//   ]
// })
export class GamescoreUxComponent implements OnInit, AfterViewInit {
  @Input() gameScoreFontSize: number | null = 24;
  columnCount = 3;
  gameScore: Move[] = [];
  rowHeight = '50px';
  maxPlySize = 178;
  @Input() scoreWidth: number | null = 360;
  constructor( public gameScoreService: GameScoreService) {
    this.gameScore = [{w: 'd4', b: 'Qd5'}, {w: 'Nf3', b: 'Bf6'}, {w: 'Rf3', b: 'Qf6'}, {w: 'Kf3', b: 'f6'}];
    this.gameScoreService.figurineNotation.subscribe((figurineNotation) => {
      if (figurineNotation) {
        console.log('Setting Font to : ' + 'FigurineSymbolT1');
        this.gameScoreService.scoreFontFamily.next('FigurineSymbolT1');
      } else {
        console.log('Setting Font to : ' + 'Caveat');
        this.gameScoreService.scoreFontFamily.next('Cambria');
      }
    });

   }

  ngOnInit(): void {
    console.log(this.gameScore);
  }

  ngAfterViewInit(): void {
    this.gameScoreService.loadPGN('');
    this.resizeScore();
  }

  resizeScore(): void {
    if(this.scoreWidth) {
      this.columnCount = Math.floor(this.scoreWidth / this.maxPlySize);
    } else {
      this.columnCount = 3;
    }
  }

  openItemMenu(event: UIEvent, item: GameScoreItem): void {
    event.preventDefault();
    console.log('Right clicked on item ' + item?.moveData?.move);
  }

  setWidth(width: number| null): void {
    if (width) {
      this.columnCount = Math.floor(width / this.maxPlySize);
    }
  }
}
