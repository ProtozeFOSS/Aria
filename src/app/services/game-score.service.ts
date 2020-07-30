import { Injectable, Input, Output } from '@angular/core';
import { BehaviorSubject } from 'rxjs';


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
  Variation
}



@Injectable({
  providedIn: 'root'
})
export class GameScoreService {
  //
  @Input() @Output() readonly figurineNotation = new BehaviorSubject<boolean>(false);
  @Output() readonly items = new BehaviorSubject<GameScoreItem[]>([]);
  @Output() readonly annotations = new BehaviorSubject<GameScoreAnnotation[]>([]);
  @Output() readonly variation = new BehaviorSubject<GameScoreVariation[]>([]);

  // Visual Settings
  @Output() readonly scoreFontFamily = new BehaviorSubject<string>('Caveat');
  @Output() readonly scoreFontSize = new BehaviorSubject<number>(18);
  constructor() { }

  public loadPGN(pgn: string) {
    const testmove = new GameScoreMove('ex4');
    const testItem = new GameScoreItem(GameScoreType.GameScoreGroup, testmove);
    this.items.next([testItem]);
  }
  public clearItems(): void {

  }
  public typeToString(type: GameScoreType): string {
    return GameScoreType[type];
  }

}
