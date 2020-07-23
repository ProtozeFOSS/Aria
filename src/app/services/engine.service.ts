import { Injectable } from '@angular/core';
import { parseFen } from 'chessops/fen';
import { Chess } from 'chessops/chess';
import { Piece } from 'chessops/types';
import { BehaviorSubject } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class EngineService {
  chessEngine: Chess | null = null;
  readonly boardChanged = new BehaviorSubject<boolean>(false);
  constructor() {
    const setup = parseFen(
      'r1bqkbnr/ppp2Qpp/2np4/4p3/2B1P3/8/PPPP1PPP/RNB1K1NR b KQkq - 0 4'
    ).unwrap();
    this.chessEngine = Chess.fromSetup(setup).unwrap();
    this.boardChanged.next(true);
    console.assert(this.chessEngine.isCheckmate());
  }

  checkPosition(row: string, rank: string): Piece | undefined {
    return this.chessEngine?.board.get(0);
  }
}
