import { Injectable, Input, Output } from '@angular/core';
import { BehaviorSubject, onErrorResumeNext } from 'rxjs';

//@ts-ignore
import { Game, pgnRead, Database, Variation, Node as ScoreNode, Position as ChessPosition } from 'kokopu';
import { EngineService } from './engine.service';
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

export enum GameScoreType {
  GameScoreGroup = 121,
  Variation = 222,
  Annotation = 323,
  AnnotatedVariation = 424
}



@Injectable({
  providedIn: 'root'
})
export class GameScoreService {
  //
  @Input() @Output() readonly figurineNotation = new BehaviorSubject<boolean>(false);
  @Output() readonly items = new BehaviorSubject<GameScoreItem[]>([]);
  @Output() readonly annotations = new BehaviorSubject<GameScoreAnnotation[]>([]);
  @Output() readonly showingPly = new BehaviorSubject<boolean>(true);
  @Output() readonly showingHalfPly = new BehaviorSubject<boolean>(false);
  @Output() readonly variation = new BehaviorSubject<GameScoreVariation[]>([]);

  // Visual Settings
  @Output() readonly scoreFontFamily = new BehaviorSubject<string>('Caveat');
  @Output() readonly scoreFontSize = new BehaviorSubject<number>(18);
  startNode: ScoreNode | null = null;
  currentNode: ScoreNode | null = null;
  game: Game | null = null;
  currentPosition: ChessPosition | null = null;
  constructor(public engineService: EngineService) { }
  public moveToStart(): void {
    this.currentPosition.reset();
    this.engineService.setFen(this.currentNode.fen);
    this.currentNode = this.startNode;
  }
  public advance(): void {
    if (this.currentPosition) {
      const currentItem = this.items.value[this.currentNode._fullMoveNumber - 1];
      currentItem.current = false;
      const move = this.currentNode.notation();
      if (this.currentPosition.play(move)) {
        console.log('Mad Move: ' + move);
      }
      this.engineService.setFen(this.currentPosition.fen());
      this.currentNode = this.currentNode.next();
    }
  }
  public previous(): void {
    if (this.currentPosition) {
      const previousMove = this.currentNode._fullMoveNumber - (2 - this.currentPosition._impl.turn);
      if (previousMove >= 0) {
        let previous = this.startNode;
        for (let i = 0; i < previousMove; ++i) {
          previous = previous.next();
        }
        console.log('Moving back to move: ' + previous.notation());
        this.currentPosition = this.currentNode.positionBefore();
        this.engineService.setFen(this.currentPosition.fen());
        this.currentNode = previous;
      }
    }
  }
  public moveToEnd(): void {
    //console.log('Advancing PGN');
    if (this.currentPosition) {
      const currentItem = this.items.value[this.currentNode._fullMoveNumber - 1];
      currentItem.current = false;
      const move = this.currentNode.notation();
      this.currentPosition.play(move);
      this.engineService.setFen(this.currentPosition.fen());
      this.currentNode = this.currentNode.next();
    }
  }
  public loadPGN(pgn: string) {
    const state = pgnRead(pgn) as Database;
    this.game = state.game(0) as Game;
    const variation = this.game.mainVariation() as Variation;
    this.currentPosition = this.game.initialPosition() as ChessPosition;
    this.engineService.setFen(this.currentPosition.fen());
    this.currentNode = this.startNode = variation.first() as ScoreNode;
    const items = [];
    let nextScore = this.startNode as ScoreNode;
    while (nextScore) {
      let notation = nextScore.notation();
      const isHalfPly = (nextScore._positionBefore._impl.turn % 2 != 0);
      if (nextScore._info && nextScore._info.comment) {
        items.push(new GameScoreItem(GameScoreType.Annotation, new GameScoreMove(notation, nextScore._fullMoveNumber + (isHalfPly ? .5 : 0)), new GameScoreAnnotation(nextScore._info.comment)));
      } else {
        items.push(new GameScoreItem(GameScoreType.GameScoreGroup, new GameScoreMove(notation, nextScore._fullMoveNumber + (isHalfPly ? .5 : 0))));
      }
      nextScore = nextScore.next();
    }
    items[0].current = true;
    this.items.next(items);
    this.items.complete();
  }
  public clearItems(): void {

  }
  public typeToString(type: GameScoreType): string {
    return GameScoreType[type];
  }

}
