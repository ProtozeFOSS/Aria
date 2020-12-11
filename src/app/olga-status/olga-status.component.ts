import { Component, OnInit } from '@angular/core';
import { BehaviorSubject } from 'rxjs';

//@ts-ignore
import { Node as KNode } from 'kokopu';
import { OlgaService } from '../services/olga.service';
import { ChessMove } from '../common/kokopu-engine';
import { environment } from '../../environments/environment';
@Component({
  selector: 'olga-status',
  templateUrl: './olga-status.component.html',
  styleUrls: ['./olga-status.component.scss']
})
export class OlgaStatusComponent implements OnInit {
  readonly status = new BehaviorSubject<string>('White to move.');
  lastNode: KNode | null = null;
  lastMove: ChessMove | undefined = undefined;
  environment = environment;
  constructor(public olga: OlgaService) {
  }

  ngOnInit(): void {

  }

  sendForAnalysis(): void {
    if (this.lastNode) {
      let fen = this.olga.gameFEN();
      var addr = 'http://www.chessgames.com/perl/nph-analysis_prereq?atype=FEN&fen=';
      addr += fen.split(" ").join("%20");
      addr += '&move=';
      addr += ((this.lastNode.fullMoveNumber() - 1) * 2) - (this.lastNode.moveColor() === 'b' ? 1 : 0);
      addr += '&session_id=';
      addr += this.olga.UUID;
      window.open(addr);
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
      let notation = this.olga.getMoveNotation(last);
      message += '' + last.fullMoveNumber() + (turn === 'b' ? '.' : '..') + notation;
    }
    this.status.next(message);
  }

  resetStatus(): void {
    this.status.next('White to move.');
    this.lastNode = null;
    this.lastMove = undefined;
  }
}
