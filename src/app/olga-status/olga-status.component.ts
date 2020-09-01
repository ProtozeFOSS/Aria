import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameService, ChessMove } from '../services/game.service';

//@ts-ignore
import { Node as KNode } from 'kokopu';
@Component({
  selector: 'olga-status',
  templateUrl: './olga-status.component.html',
  styleUrls: ['./olga-status.component.scss']
})
export class OlgaStatusComponent implements OnInit {
  readonly status = new BehaviorSubject<string>('White to move.');
  constructor(gameService: GameService) {
    gameService.attachStatus(this);
  }

  ngOnInit(): void {
  }

  openEngine(): void {

  }
  updateStatus(turn: string, last?: KNode) {
    let message = 'White';
    let move = '';
    if (turn === 'b') {
      message = 'Black';
    }
    message += ' to move. ';
    if (last) {
      message += 'Last: ' + last.fullMoveNumber() + (turn === 'b' ? '.' : '..') + move + last.notation();
    }
    this.status.next(message);
  }

  resetStatus(): void {
    this.status.next('White to move.');
  }
}
