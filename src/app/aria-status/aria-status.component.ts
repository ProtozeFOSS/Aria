import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

//@ts-ignore
import { Node as KNode } from 'kokopu';
import { AriaService } from '../services/aria.service';
import { ChessMove } from '../common/kokopu-engine';
import { environment } from '../../environments/environment';
@Component({
  selector: 'aria-status',
  templateUrl: './aria-status.component.html',
  styleUrls: ['./aria-status.component.scss']
})
export class AriaStatus implements OnInit {
  readonly status = new BehaviorSubject<string>('White to move.');
  lastNode: KNode | null = null;
  lastMove: ChessMove | undefined = undefined;
  environment = environment;
  constructor(public aria: AriaService) {
  }

  ngOnInit(): void {

  }

  sendForAnalysis(): void {
    if (this.lastNode) {
      let fen = this.aria.gameFEN();
      var addr = 'http://www.chessgames.com/perl/nph-analysis_prereq?atype=FEN&fen=';
      addr += fen.split(" ").join("%20");
      addr += '&move=';
      addr += ((this.lastNode.fullMoveNumber() - 1) * 2) - (this.lastNode.moveColor() === 'b' ? 1 : 0);
      addr += '&session_id=';
      addr += this.aria.UUID;
      window.open(addr);
      // TODO generate sendForAnalysis callback
    }
  }

  updateStatus(turn: string, last?: KNode, move?: ChessMove) {
    let message = '';
    if (last) {
      this.lastNode = last;
      this.lastMove = move;
      let position = last.position();
      if (position) {
        if (position.isCheckmate()) {
          message = (turn === 'b' ? 'White' : 'Black') + ' wins by checkmate. ';
        } else {
          if (position.isCheck()) {
            message += 'Check. '
          }
          message += (turn === 'w' ? 'White' : 'Black') + ' to move. ';
        }
      }
      let notation = this.aria.getMoveNotation(last);
      message += '' + last.fullMoveNumber() + (turn === 'b' ? '.' : '..') + notation;
    }
    this.status.next(message);
  }

  resetStatus(): void {
    this.status.next('White to move.');
    this.lastNode = null;
    this.lastMove = undefined;
  }

  resize(width: number, height: number) {

  }
}
