import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

//@ts-ignore
import { Node as KNode } from 'kokopu';
import { OlgaService } from '../services/olga.service';
import { ChessMove } from '../common/kokopu-engine';
@Component({
  selector: 'olga-status',
  templateUrl: './olga-status.component.html',
  styleUrls: ['./olga-status.component.scss']
})
export class OlgaStatusComponent implements OnInit {
  readonly status = new BehaviorSubject<string>('White to move.');
  constructor(public olga: OlgaService) {
  }

  ngOnInit(): void {
  }

  openEngine(): void {

  }
  updateStatus(turn: string, last?: KNode, move?: ChessMove) {
    let message = 'White';
    if (turn === 'b') {
      message = 'Black';
    }
    message += ' to move. ';
    if (last) {
      let notation = this.olga.getMoveNotation(last);
      message += 'Last: ' + last.fullMoveNumber() + (turn === 'b' ? '.' : '..') +  notation;
    }
    this.status.next(message);
  }

  resetStatus(): void {
    this.status.next('White to move.');
  }
}
