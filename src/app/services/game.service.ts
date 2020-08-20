import { Injectable, Input, Output } from '@angular/core';

//@ts-ignore
import { isMoveDescriptor, Game as KGame, pgnRead, Database as KDatabase, Variation as KVariation, Node as KNode, Position as KPosition } from 'kokopu';
import { BehaviorSubject, onErrorResumeNext } from 'rxjs';
import { OlgaService } from './olga.service';
import { CanvasChessBoard, SquareNames, Piece } from '../canvas-chessboard/canvas-chessboard.component';
import { GamescoreUxComponent } from '../game-score/game-score.ux';

// Game Score
export class GameScoreMove {
  move = '';
  ply = 1;
  constructor(move = '', ply = 1) { this.move = move; this.ply = ply; }
}

export class GameScoreVariation {
  variationData: GameScoreItem[];
  constructor(variationData: GameScoreItem[] = []) { this.variationData = variationData; }
}

export class GameScoreAnnotation {
  annotation = '';
  constructor(annotation: string = '') { this.annotation = annotation; }
}

export class GameScoreItem {
  type: GameScoreType | null = null;
  moveData: GameScoreMove | null = null;
  annotationData: GameScoreAnnotation | null = null;
  variationData: GameScoreVariation | null = null;
  current = false;
  constructor(type: GameScoreType, moveData: GameScoreMove | null = null,
    annotationData: GameScoreAnnotation | null = null, variationData: GameScoreVariation | null = null) {
    this.type = type;
    this.moveData = moveData;
    this.annotationData = annotationData;
    this.variationData = variationData;
  }
}

export class ChessMove {
  to: number = 0;
  from: number = 0;
  role: string = '';
  color: string = '';
  capture?: { role: string, color: string };
  promotion?: { role: string };
  promoteFunction?: any;
}

export class ScoreMarker {

}


export class ChessGame {
  protected position: KPosition | null = null;
  protected currentNode: KNode | null = null;
  protected gameScore: GameScoreItem[] = [];
  readonly score = new BehaviorSubject<GameScoreItem[] | null>(null);
  protected gameVariations: KVariation[] = [];
  protected variation: KVariation | null = null;
  protected startNode: KNode | null = null;
  protected lastNode: KNode | null = null;
  protected isVariation = false;
  public fen = '';

  protected static compareKNode(left: KNode, right: KNode): boolean {
    if (left !== null && right !== null && left !== undefined && right !== undefined) {
      const leftMove = left._info.moveDescriptor;
      const rightMove = right._info.moveDescriptor;
      return (leftMove.from() === rightMove.from() && leftMove.to() === rightMove.to());
    }
    return false;
  }

  public onVariant(): boolean {
    return this.isVariation;
  }
  public performPromotion(move: ChessMove) {
    if (move.promotion && move.promoteFunction) {
      //const moveDesc = 1
      const moveDesc = move.promoteFunction(move.promotion.role.toLowerCase());
      console.log(this.position.notation(moveDesc));
      if (this.position.play(moveDesc)) {
        const node = this.variation.play(moveDesc);
        if (!this.lastNode || this.lastNode == this.currentNode) {
          this.lastNode = node;
        }
        if (!this.startNode) {
          this.startNode = node;
        }
        this.currentNode = node;
        this.currentNode._info.moveDescriptor = moveDesc;
      }
    }
  }
  public makeMove(move: ChessMove, fromPGN = false): void {
    if (this.currentNode) {
      const pgnMove = this.currentNode._info.moveDescriptor;
      const toSquare = SquareNames[move.to];
      const fromSquare = SquareNames[move.from];
      if (pgnMove && pgnMove.from() == fromSquare && pgnMove.to() == toSquare) {
        this.advance(false);
      } else {
        // look for an existing variant
        console.log('Normal Move: ' + pgnMove.from() + ' -> ' + pgnMove.to());
        const variations = this.currentNode.variations();
        let madeMove = false;
        this.isVariation = true;
        this.gameService.isVariant.next(this.isVariation);
        variations.forEach((variation: KVariation) => {
          const firstMove = variation.first();
          if (firstMove && firstMove._info.moveDescriptor) {
            const test = firstMove._info.moveDescriptor;
            if (test.to() == toSquare && test.from() == fromSquare) {
              this.startNode = firstMove;
              this.position.play(test);
              this.currentNode = firstMove.next();
              if (this.currentNode == null) {
                this.currentNode = this.lastNode = this.startNode;
              }
              madeMove = true;
              console.log('Found Exisiting Variation');
            } else {
              console.log('Variation checked: ' + test.from() + ' -> ' + test.to());
            }
          }
        });
        if (!madeMove) {
          // Create a user variant
          const legal = this.position.isMoveLegal(fromSquare, toSquare);
          if (legal !== false) {
            let variation = this.variation;
            if (this.currentNode != this.lastNode) {
              console.log('Variant Created: ' + fromSquare + ' -> ' + toSquare);
              variation = this.currentNode.addVariation();
              this.variation = variation;
              this.startNode = null;
              this.lastNode = null;
            } else {
              console.log('Variant Continued: ' + fromSquare + ' -> ' + toSquare);
            }
            if (legal.status === 'promotion') {
              move.promoteFunction = legal;
              this.gameService.board.value?.showPromotionDialog(move);
            } else {
              const legalMove = legal();
              if (this.position.play(legalMove)) {
                const node = this.variation.play(legalMove);
                if (!this.lastNode || this.lastNode == this.currentNode) {
                  this.lastNode = node;
                }
                if (!this.startNode) {
                  this.startNode = node;
                }
                this.currentNode = node;
                this.currentNode._info.moveDescriptor = legalMove;
              }
            }
          }
        }
      }
      console.log('Game is on a variant -> ' + (this.onVariant() ? 'Yes' : 'No'));
    }
  }
  constructor(protected gameService: GameService, public game?: KGame) {
    if (game) {
      this.setGame(this.game)
    }
  }

  public getPosition(): KPosition | null {
    return this.position;
  }

  setGame(game: KGame): void {
    this.game = game;
    this.variation = this.game.mainVariation() as KVariation;
    this.gameVariations.push(this.variation);
    this.position = this.variation.initialPosition() as KPosition;
    this.fen = this.position.fen();
    this.currentNode = this.startNode = this.variation.first() as KNode;
    if (this.gameService.board.value) {
      this.gameService.board.value.setBoardToGamePosition();
    }
    const items = [];
    let nextScore = this.startNode as KNode;
    let previous: KNode = null;
    while (nextScore) {
      let notation = nextScore.notation();
      const isHalfPly = (nextScore._positionBefore._impl.turn % 2 != 0);
      if (nextScore._info && nextScore._info.comment) {
        if (nextScore._info.variations.length) {
          this.gameVariations = this.gameVariations.concat(nextScore._info.variations);
        }
        if (previous) {
          items.push(new GameScoreItem(GameScoreType.GameScoreGroup, new GameScoreMove(previous.notation(), nextScore._fullMoveNumber)));
          previous = null;
        }
        items.push(new GameScoreItem(GameScoreType.Annotation, new GameScoreMove(notation, nextScore._fullMoveNumber + (isHalfPly ? .5 : 0)), new GameScoreAnnotation(nextScore._info.comment)));
      } else {
        if (isHalfPly) {
          if (previous) {
            notation += ' ' + previous.notation();
          }
          items.push(new GameScoreItem(GameScoreType.GameScoreGroup, new GameScoreMove(notation, nextScore._fullMoveNumber)));
          previous = null;
        } else {
          previous = nextScore;
        }
      }
      nextScore = nextScore.next();
    }
    items[0].current = true;
    this.gameScore = items;
    this.score.next(this.gameScore);
  }


  // navigation
  public advance(updateBoard = true): boolean {
    if (this.position) {
      const next = this.currentNode.next();
      if (next && (this.position.isMoveLegal(this.currentNode._info.moveDescriptor.from(), this.currentNode._info.moveDescriptor.to()) !== false)) {
        this.position.play(this.currentNode._info.moveDescriptor);
        const move = new ChessMove();
        move.from = SquareNames.indexOf(this.currentNode._info.moveDescriptor.from());
        move.to = SquareNames.indexOf(this.currentNode._info.moveDescriptor.to());

        let newTo = move.to;
        let newFrom = move.from;
        if (this.currentNode._info.moveDescriptor._to >= 64) {
          let rowFrom = Math.ceil(newFrom / 8);
          let colFrom = newFrom % 8;
          newFrom = (rowFrom * 8) - colFrom;

          let rowTo = Math.floor(newTo / 8);
          let colTo = newTo % 8;

          newTo = (rowTo * 8) - colTo;
          console.log(SquareNames[newFrom]);
          console.log(SquareNames[newTo]);
        }
        if (updateBoard && this.gameService.board.value !== null) {
          this.gameService.board.value.makeMove(move);
        }
        this.currentNode = next;
        return true;
      }
      // const items = this.gameScore;
      // const currentItem = items[previousIndex];
      // const nextItem = items[this.currentNode._fullMoveNumber];
      // this.position.items = items;
      // this._items.next(Object.assign({}, this.dataStore).items);

    }
    return false;
  }
  public moveToStart(): void {
    while (this.previous()) {
    }
  }
  public moveToEnd(): void {
    if (this.currentNode && this.position && this.currentNode.next() && this.gameService.board.value) {
      while (this.advance()) { }
    }
  }

  public previous(): boolean {
    if (!this.isStartingPosition() && this.gameService.board.value) {
      if (!ChessGame.compareKNode(this.startNode, this.currentNode)) {
        let currentNode = this.startNode;
        while (currentNode.next() && !ChessGame.compareKNode(currentNode.next(), this.currentNode)) {
          currentNode = currentNode.next();
        }
        if (this.gameService.board.value) {
          const move = currentNode._info.moveDescriptor;
          const unmove = new ChessMove();
          unmove.to = SquareNames.indexOf(move.to());
          unmove.from = SquareNames.indexOf(move.from());
          if (move.isCapture()) {
            const piece = move.capturedPiece();
            const color = move.color();
            if (piece && color) {
              unmove.capture = { role: piece.toUpperCase(), color: color === 'w' ? 'b' : 'w' };
            }
          }
          this.gameService.board.value.unMakeMove(unmove);
        }
        this.position = currentNode.positionBefore();
        this.lastNode = this.position._last;
        this.fen = this.position.fen();
        this.currentNode = currentNode;
        return true;
      }
    }
    return false;
  }
  public isStartingPosition(): boolean {
    return ChessGame.compareKNode(this.variation.first(), this.currentNode);
  }

  public isFinalPosition(): boolean {
    return (ChessGame.compareKNode(this.position.__last, this.currentNode) || this.currentNode.next() === null);
  }

  public createScoreItems(): GameScoreItem[] {
    return [];
  }

}

export enum GameScoreType {
  GameScoreGroup = 121,
  Variation = 222,
  Annotation = 323,
  AnnotatedVariation = 424
}


@Injectable({
  providedIn: 'root'
})
export class GameService {
  @Input() @Output() readonly figurineNotation = new BehaviorSubject<boolean>(false);
  public _items = new BehaviorSubject<GameScoreItem[]>([]);
  private scoreData: { items: GameScoreItem[] } = { items: [] };
  readonly currentScore = this._items.asObservable();

  private _fen = new BehaviorSubject<string>('');
  readonly fen = this._fen.asObservable();

  private _games = new BehaviorSubject<ChessGame[]>([]);
  private gamesData: { games: ChessGame[] } = { games: [] };
  readonly games = this._games.asObservable();

  private state: KDatabase | null = null;

  // current
  private _game: ChessGame | null = null;
  readonly game = new BehaviorSubject<ChessGame | null>(null);


  private _board: CanvasChessBoard | null = null;
  readonly board = new BehaviorSubject<CanvasChessBoard | null>(null);


  private _score: GamescoreUxComponent | null = null;
  readonly score = new BehaviorSubject<GamescoreUxComponent | null>(null);

  readonly isVariant = new BehaviorSubject<boolean>(false);

  private parsePGN(pgn: string) {
    const gameCount = 1;
    if (gameCount == 1) {
      this.state = pgnRead(pgn) as KDatabase;
      const first = this.state.game(0) as KGame;
      const game = new ChessGame(this);
      this.gamesData.games.push(game);
      this._games.next(Object.assign({}, this.gamesData).games)
      this._game = game;
      this.game.next(game);
      this._game.setGame(first);
      if (this._game.score.value !== null) {
        this._items.next(this._game.score.value);
      }
    }
  }



  public makeMove(move: ChessMove, fromPGN = false): void {
    // if (!fromPGN) {
    //   this._game?.moveOrCreateVariant(move, fromPGN);
    // }
    // this.attachedBoards.forEach((board) => {
    //   board.makeMove(move);
    // })
  }

  // Visual Settings
  constructor(public olga: OlgaService) { }
  public moveToStart(): void {
    if (this._game) {
      this._game.moveToStart();
    }
  }
  public advance(): void {
    if (this._game && !this._game.isFinalPosition()) {
      this._game.advance();
    }
  }
  public previous(): void {
    if (this._game) {
      this._game.previous();
    }
  }
  public moveToEnd(): void {
    const move = new ChessMove();
    move.to = 61;
    move.from = 53;
    move.color = 'w';
    move.role = 'P';
    if (this._board) {
      this._board.showPromotionDialog(move);
    }

    // if (this._game && !this._game.isFinalPosition()) {
    //   this._game.moveToEnd();
    // }
  }
  public loadPGN(pgn: string) {
    // parse potential multiple games
    console.log('Loading PGN: ');
    console.log(pgn);
    this.gamesData.games = [];
    this._games.next([]);
    this.parsePGN(pgn);
  }

  public clearItems(): void {
    this.scoreData.items = [];
    this._items.next(Object.assign({}, this.scoreData).items);
  }

  public typeToString(type: GameScoreType): string {
    return GameScoreType[type];
  }

  public selectGame(index: number) {
    if (index >= 0 && index <= this.gamesData.games.length) {
      this._game = this.gamesData.games[index];
      this.scoreData.items = this._game.createScoreItems();
      this.game.next(this._game);
    }
  }

  public attachBoard(board: CanvasChessBoard) {
    this._board = board;
    this.board.next(board);
  }

  public attachScore(score: GamescoreUxComponent) {
    this._score = score;
    this.score.next(score);
  }

}
