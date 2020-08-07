import { Injectable } from '@angular/core';
import { parseFen, makeFen, parsePiece } from 'chessops/fen';
import { makeSan, makeSanAndPlay } from 'chessops/san';
import { Chess, Position } from 'chessops/chess';
import { Piece, Move, ROLES } from 'chessops/types';
import { transformBoard } from 'chessops/transform';
import { makeSquare, parseUci } from 'chessops/util';
//import { Chess, Position } from 'chessops/variant'
import { BehaviorSubject } from 'rxjs';
import { SquareSet } from 'chessops/squareSet';

@Injectable({
  providedIn: 'root',
})
export class EngineService {
  chessEngine: Position = Chess.default();
  readonly startingFen = 'rnbqkbnr/pppppppp/8/8/8/8/PPPPPPPP/RNBQKBNR w KQkq - 0 1';
  readonly boardFen = new BehaviorSubject<string>(this.startingFen);
  readonly boardChanged = new BehaviorSubject<boolean>(false);
  readonly abreviatedSan = new BehaviorSubject<boolean>(false);
  constructor() {
    // this.chessEngine.board = transformBoard(this.chessEngine.board, (s: SquareSet) => { console.log(s); return s; });
    this.boardChanged.next(true);
  }
  private generateSAN(fromData: { tile: number; object: fabric.Group; piece: Piece | undefined }, toData: { tile: number; object: fabric.Group; piece: Piece | undefined }): string {
    if (this.abreviatedSan.value) {
      return ''; // abreviated
    }
    return ''// non abreviated
  }
  makeMove(fromData: { tile: number; object: fabric.Group; piece: Piece | undefined }, toData: { tile: number; object: fabric.Group; piece: Piece | undefined }): boolean {
    if (fromData.piece) {
      this.chessEngine.epSquare = fromData.tile;
      // console.log('from: ' + makeSquare(fromData.tile));
      // console.log(this.chessEngine.board.get(fromData.tile));
      // console.log('to: ' + makeSquare(toData.tile));
      // console.log(this.chessEngine.board.get(toData.tile));
      const move = { from: fromData.tile, to: toData.tile } as Move;
      if (this.chessEngine.isLegal(move)) {
        if (toData.object) {
          toData.object.remove();
        }
        const san = makeSanAndPlay(this.chessEngine, move);
        //const piece = {role:'', color:''} as Piece;
        //this.chessEngine.board.set(fromData.tile, piece);
        //this.boardChanged.next(!this.boardChanged.value);
        // add san to game score
        //console.log(san);
        return true;
      }
      const san = makeSan(this.chessEngine, { role: fromData.piece.role, to: toData.tile } as Move);
      if (san.search('@') >= 0) {

      }
      // console.log('Attempting to make invalid move ' + san);
      // console.log('board believes tile has:');
      // console.log(this.chessEngine.board.get(toData.tile));
    }
    return false;
  };

  public makeMoveFromSAN(san: string): void {
    console.log('Make Move: ' + san);
    const move = parseUci(san) as Move;
    if (this.chessEngine.isLegal(move)) {
      this.chessEngine.play(move);
    }
  }

  setFen(fen: string): void {
    this.boardFen.next(fen);
  }

  checkPosition(row: string, rank: string): Piece | undefined {
    return this.chessEngine?.board.get(0);
  }
  getFen(): string {
    return makeFen(this.chessEngine.toSetup());
  }
}
