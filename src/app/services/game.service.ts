import { Injectable, Input, Output, APP_INITIALIZER } from '@angular/core';

//@ts-ignore
import { Game as KGame, pgnRead, Database as KDatabase, Variation as KVariation, Node as KNode, Position as KPosition } from 'kokopu';
import { BehaviorSubject, onErrorResumeNext } from 'rxjs';
import { OlgaService } from './olga.service';
import { CanvasChessBoard, SquareNames, Piece } from '../canvas-chessboard/canvas-chessboard.component';
import { GamescoreUxComponent } from '../game-score/game-score.ux';
import { OlgaStatusComponent } from '../olga-status/olga-status.component';
import { getSupportedInputTypes } from '@angular/cdk/platform';
import { ɵallowPreviousPlayerStylesMerge } from '@angular/animations/browser';

// Game Score


export class GameScoreVariation {
  variationData: GameScoreItem[];
  constructor(variationData: GameScoreItem[] = []) { this.variationData = variationData; }
}

export class GameScoreAnnotation {
  annotation = '';
  constructor(annotation: string = '') { this.annotation = annotation; }
}

export class GameScoreItem {
  type = 0;
  move: KNode | null = null;
  selection = 0;
  current = false;

  // flatten the variables

  constructor(protected game: ChessGame | null = null, protected index: number, move?: KNode) {
    this.move = move;
    this.getType();
  }

  getType(): number {
    this.type = 0;
    if (this.move) {
      const previous = this.previous();
      const notation = this.move.notation();
      let variations = this.move.variations();
      if (previous) {
        if (previous.move.moveColor() == 'w') {
          this.type += GameScoreType.HalfPly;
          if (!previous.move.comment()) {
            this.type += GameScoreType.Group;
          }
        }
      }
      if (variations && variations.length > 0) {
        this.type += GameScoreType.Variation;
      } else if (this.move.comment()) {
        this.type += GameScoreType.Annotation;
      } else {
        let comment = null;
        if (previous && previous.move) {
          comment = previous.move.comment();
        }
        if ((!previous && this.move.moveColor() == 'w') || !comment) {
          this.type += GameScoreType.Group;
        }
      }
    }
    return this.type;
  }

  next(): GameScoreItem | null {
    if (this.game) {
      return this.game.getNext(this.index);
    }
    return null;
  }
  previous(): GameScoreItem | null {
    if (this.game) {
      return this.game.getPrevious(this.index);
    }
    return null;
  }
  select(): void {

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


export class ChessGame {
  protected position: KPosition | null = null;
  protected currentNode: KNode | null = null;
  protected currentVariation: KVariation | null = null;
  protected currentIndex = -1;
  protected nodeMap: Array<KNode | KVariation> = [];
  readonly score = new BehaviorSubject<GameScoreItem[] | null>(null);
  protected moveMap: KNode | KVariation[] = [];
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

  protected static compareVariation(left: KVariation, right: KVariation): boolean {
    if (left !== null && right !== null && left !== undefined && right !== undefined) {
      if (ChessGame.compareKNode(left.first(), right.first())) {
        return (left.comment() === right.comment() && left.initialFullMoveNumber() === right.initialFullMoveNumber());
      }
    }
    return false;
  }

  protected getLastNode(): KNode {
    let node = this.currentNode;
    while (node && node.next()) {
      node = node.next();
    }
    return node;
  }

  protected setNode(node: KNode) {
    this.position = node.position();
    this.currentNode = node.next();
    this.lastNode = this.getLastNode();
    if (!this.currentNode) {
      this.currentNode = this.lastNode;
    }
    this.fen = this.position.fen();
    this.gameService.board.value?.setBoardToGamePosition();
    this.gameService.status.value?.updateStatus(this.position.turn(), node);
  }

  public onVariant(): boolean {
    return this.isVariation;
  }

  public getNext(index: number): GameScoreItem | null {
    const next = index + 1;
    if (next >= 0 && next < this.nodeMap.length) {
      return this.nodeMap[next];
    }
    return null;
  }

  public getPrevious(index: number): GameScoreItem | null {
    const prev = index - 1;
    if (prev >= 0 && prev < this.nodeMap.length) {
      return this.nodeMap[prev];
    }
    return null;
  }

  public performPromotion(move: ChessMove) {
    if (move.promotion && move.promoteFunction) {
      //const moveDesc = 1
      const moveDesc = move.promoteFunction(move.promotion.role.toLowerCase());
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
    const lastNode = this.currentNode;
    if (this.currentNode) {
      const pgnMove = this.currentNode._info.moveDescriptor;
      const toSquare = SquareNames[move.to];
      const fromSquare = SquareNames[move.from];
      const next = this.currentNode.next();
      const legal = this.position.isMoveLegal(fromSquare, toSquare);
      if (pgnMove && pgnMove.from() == fromSquare && pgnMove.to() == toSquare) { // not a variant
        this.position.play(pgnMove);
        if (fromPGN) {
          if (pgnMove.isPromotion()) {
            move.promoteFunction = legal;
            this.gameService.board.value?.showPromotionDialog(move);
          }
          if (pgnMove.isCastling()) {
            this.gameService.board.value?.setBoardToGamePosition();
          }
          this.gameService.board.value?.makeMove(move);
        }
        this.currentNode = next;





        // const move = new ChessMove();
        // move.from = SquareNames.indexOf(this.currentNode._info.moveDescriptor.from());
        // move.to = SquareNames.indexOf(this.currentNode._info.moveDescriptor.to());
        // let newTo = move.to;
        // let newFrom = move.from;
        // if (this.currentNode._info.moveDescriptor._to >= 64) {
        //   let rowFrom = Math.ceil(newFrom / 8);
        //   let colFrom = newFrom % 8;
        //   newFrom = (rowFrom * 8) - colFrom;

        //   let rowTo = Math.floor(newTo / 8);
        //   let colTo = newTo % 8;

        //   newTo = (rowTo * 8) - colTo;
        //   console.log(SquareNames[newFrom]);
        //   console.log(SquareNames[newTo]);
        // }
        // if (fromPGN && this.gameService.board.value !== null) {
        //   this.gameService.board.value.makeMove(move);
        // }
        // this.gameService.status.value?.updateStatus(this.position.turn(), this.currentNode);
      } else {
        // look for an existing variant
        console.log('Check Variants= ' + pgnMove.from() + ' -> ' + pgnMove.to());
        const variations = this.currentNode.variations();
        this.isVariation = true;
        this.gameService.isVariant.next(this.isVariation);
        variations.forEach((variation: KVariation) => {
          const firstMove = variation.first();
          if (firstMove && firstMove._info.moveDescriptor) {
            const test = firstMove._info.moveDescriptor;
            if (test.to() == toSquare && test.from() == fromSquare) {
              this.variation = variation;
              this.startNode = firstMove;
              this.position.play(test);
              this.currentNode = firstMove.next();
              if (this.currentNode == null) {
                this.currentNode = this.lastNode = this.startNode;
              }
              if (this.position.play(this.currentNode.notation())) {
                const node = this.variation.play(this.currentNode.notation());
                if (node) {
                  if (!this.lastNode || this.lastNode == this.currentNode) {
                    this.lastNode = node;
                  }
                  if (!this.startNode) {
                    this.startNode = node;
                  }
                  this.currentNode = node;
                  this.currentNode._info.moveDescriptor = this.currentNode.notation();
                  this.gameService.board.value?.setBoardToGamePosition();
                }
              }
            } else {
              console.log('Variation checked: ' + test.from() + ' -> ' + test.to());
            }
          }
        });
      }
    }
    if (!ChessGame.compareKNode(lastNode, this.currentNode)) {
      this.gameService.status.value?.updateStatus(this.position.turn(), lastNode);
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
    this.gameVariations = [];
    this.gameVariations.push(this.variation);
    this.position = this.variation.initialPosition() as KPosition;
    this.fen = this.position.fen();
    this.currentNode = this.startNode = this.variation.first() as KNode;
    if (this.gameService.board.value) {
      this.gameService.board.value.setBoardToGamePosition();
    }
    const items = [];
    this.nodeMap = [];
    let nextScore = this.startNode as KNode;
    let index = 0;
    let previous: GameScoreItem | null = null;
    while (nextScore) {
      if (nextScore) {
        const gItem = new GameScoreItem(this, index, nextScore);
        this.nodeMap[index] = gItem;
        previous = gItem;
        //this.insertVariation(index, gItem);
        nextScore = nextScore.next();
        items.push(gItem);
        ++index;
      }
    }
    this.score.next(items);
    console.log(this.nodeMap);
  }


  // navigation
  public advance(updateBoard = true): boolean {
    if (!this.isFinalPosition()) {
      const next = this.currentIndex + 1;
      const node = this.nodeMap[next]
      if (node) { // next exists
        this.navigateToNode(node);
        return true;
      }

    }
    // if (this.position) {
    //   if (this.currentNode && (this.position.isMoveLegal(this.currentNode._info.moveDescriptor.from(), this.currentNode._info.moveDescriptor.to()) !== false)) {
    //     const move = new ChessMove();
    //     move.from = SquareNames.indexOf(this.currentNode._info.moveDescriptor.from());
    //     move.to = SquareNames.indexOf(this.currentNode._info.moveDescriptor.to());
    //     let newTo = move.to;
    //     let newFrom = move.from;
    //     if (this.currentNode._info.moveDescriptor._to >= 64) {
    //       let rowFrom = Math.ceil(newFrom / 8);
    //       let colFrom = newFrom % 8;
    //       newFrom = (rowFrom * 8) - colFrom;

    //       let rowTo = Math.floor(newTo / 8);
    //       let colTo = newTo % 8;

    //       newTo = (rowTo * 8) - colTo;
    //     }
    //     this.makeMove(move, true);
    //     return true;
    //   }
    // }
    return false;
  }

  public navigateToNode(node: GameScoreItem, variation?: KVariation) {
    if (variation == null || ChessGame.compareVariation(this.variation, variation)) {
      let searchNode = this.startNode;
      let notFound = true;
      while (searchNode && notFound) {
        if (ChessGame.compareKNode(node, searchNode)) {
          notFound = false;
        } else {
          searchNode = searchNode.next();
        }
      }
      if (!notFound) {
        this.setNode(searchNode);
      }
    }
  }

  public moveToStart(): void {
    this.position = this.game.initialPosition();
    this.variation = this.game.mainVariation();
    this.startNode = this.currentNode = this.variation.first();
    this.lastNode = this.getLastNode();
    if (!this.currentNode) {
      this.currentNode = this.lastNode;
    }
    this.fen = this.position.fen();
    this.gameService.board.value?.setBoardToGamePosition();
    this.gameService.status.value?.updateStatus(this.position.turn());
  }
  public moveToEnd(): void {
    this.setNode(this.lastNode);
    // if (this.currentNode && this.position && this.currentNode.next() && this.gameService.board.value) {
    //   while (this.advance()) { }
    // }
  }

  public previous(): boolean {
    if (!this.isStartingPosition() && this.gameService.board.value) {
      if (!ChessGame.compareKNode(this.startNode, this.currentNode)) {
        let currentNode = this.startNode;
        let previous = null;
        while (currentNode.next() && !ChessGame.compareKNode(currentNode.next(), this.currentNode)) {
          previous = currentNode;
          currentNode = currentNode.next();
        }
        const move = currentNode._info.moveDescriptor;
        if (this.gameService.board.value) {
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
        this.gameService.status.value?.updateStatus(this.position.turn(), previous);
        this.fen = this.position.fen();
        this.currentNode = currentNode;
        if (move.isCastling()) {
          this.gameService.board.value.setBoardToGamePosition();
        }
        return true;
      }
    }
    return false;
  }
  public isStartingPosition(): boolean {
    return ChessGame.compareKNode(this.variation.first(), this.currentNode);
  }

  public isFinalPosition(): boolean {
    return (!this.currentNode || this.currentNode.next() === null);
  }

  public createScoreItems(): GameScoreItem[] {
    return [];
  }

}

export enum GameScoreType {
  HalfPly = 1,
  Group = 2,
  Variation = 4,
  Annotation = 8,
  Selected = 16
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


  private _status: OlgaStatusComponent | null = null;
  readonly status = new BehaviorSubject<OlgaStatusComponent | null>(null);

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


  public navigateToItem(item: GameScoreItem, isBlack = false) {
    //this._game?.navigateToNode(isBlack ? item.blackMove : item.whiteMove, item.variation);
    console.log('Navigating to item -> ' + item.move.notation());
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
    if (this._game && !this._game.isFinalPosition()) {
      this._game.moveToEnd();
    }
  }

  public togglePlay(): void {

  }

  public openEngine(): void {

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

  public attachStatus(status: OlgaStatusComponent) {
    this._status = status;
    this.status.next(status);
  }


  public editComment(data: GameScoreItem): void {
    console.log('Editing Comment -> ' + data.move.comment());
  }

  public displayVariations(data: GameScoreItem): void {
    console.log('Displaying Variations');
    console.log(data.move.notation());
    const variations = data.move.variations();
    console.log(variations);
  }



}
