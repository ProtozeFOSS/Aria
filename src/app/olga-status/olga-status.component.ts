import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

//@ts-ignore
import { Node as KNode } from 'kokopu';
import { OlgaService } from '../services/olga.service';
@Component({
  selector: 'olga-status',
  templateUrl: './olga-status.component.html',
  styleUrls: ['./olga-status.component.scss']
})
export class OlgaStatusComponent implements OnInit {
  readonly status = new BehaviorSubject<string>('White to move.');
  constructor(olga: OlgaService) {
    olga.attachStatus(this);
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
