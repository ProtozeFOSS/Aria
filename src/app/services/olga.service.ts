import { Injectable, Output, Input } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { GameScoreAnnotation, GameScoreVariation, GameScoreItem, ChessGame, GameScoreType, ChessMove } from '../common/kokopu-engine';
import { CanvasChessBoard } from '../canvas-chessboard/canvas-chessboard.component';
import { GamescoreUxComponent } from '../game-score/game-score.ux';
import { OlgaStatusComponent } from '../olga-status/olga-status.component';
// @ts-ignore
import { Database as KDatabase, pgnRead, Game as KGame, Node as KNode } from 'kokopu';
import { SettingsMenuComponent } from '../settings/settings-menu/settings-menu.component';
import { OlgaControlsComponent } from '../olga-controls/olga-controls.component';
@Injectable({
  providedIn: 'root'
})
export class OlgaService {
  @Output() readonly annotations = new BehaviorSubject<GameScoreAnnotation[]>([]);
  @Output() readonly showingPly = new BehaviorSubject<boolean>(true);
  @Output() readonly showingHalfPly = new BehaviorSubject<boolean>(false);
  @Output() readonly variation = new BehaviorSubject<GameScoreVariation[]>([]);
  protected autoIntervalID = -1;
  protected timeLeft = 600;
  public UUID: string = '';
  @Input() @Output() readonly figurineNotation = new BehaviorSubject<boolean>(
    false
  );
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

  private _controls: OlgaControlsComponent | null = null;
  readonly controls = new BehaviorSubject<OlgaControlsComponent | null>(null);

  readonly isVariant = new BehaviorSubject<boolean>(false);

  private parsePGN(pgn: string) {
    const gameCount = 1;
    if (gameCount == 1) {
      this.state = pgnRead(pgn) as KDatabase;
      const first = this.state.game(0) as KGame;
      const game = new ChessGame(this);
      this.gamesData.games.push(game);
      this._games.next(Object.assign({}, this.gamesData).games);
      this._game = game;
      this.game.next(game);
      this._game.setGame(first);
      const score = game.generateGameScore();
      this._items.next(score);
    }
  }

  public navigateToItem(item: GameScoreItem, isBlack = false) {
    this._game?.navigateToNode(item.getIndex());
  }

  // Visual Settings
  constructor() { }

  public moveToStart(): void {
    if (this._game) {
      this._game.moveToStart();
    }
  }
  public advance(): void {
    if (this._game) {
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
  
  protected autoAdvance():void {
    this.timeLeft -= 100;
    if(this._controls) {
      this._controls.setTimer(this.timeLeft);
    }
    if(this.timeLeft <= 0) {
      if(this._game && !this._game.isFinalPosition()){
        this.advance();
      } else {
        this.toggleAutoPlay();
      }
      this.timeLeft = 600;
    }
  }

  public toggleAutoPlay():void {
    if(this.autoIntervalID == -1) {
      this.autoIntervalID = window.setInterval(this.autoAdvance.bind(this), 100);
      if(this._controls) {
        this._controls.playing = true;
      }
    } else {
      window.clearInterval(this.autoIntervalID);
      this.autoIntervalID = -1;
      this.timeLeft = 600;
      if(this._controls) {
      this._controls.setTimer(600);
        this._controls.playing = false;
      }
    }
  }

  public openEngine(): void { }

  public toggleGameScoreViewType(): void {

  }

  public loadPGN(pgn: string) {
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
      this.scoreData.items = this._game.generateGameScore();
      this.game.next(this._game);
    }
  }

  public initializeComponents():void{}

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

  public attachControls(controls: OlgaControlsComponent) {
    this._controls = controls;
    this.controls.next(controls);
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



  // Board interface

  public redrawBoard(): void {
    this._board?.setBoardToGamePosition();
  }

  public updateStatus(turn: string, last?: KNode): void {
    this._status?.updateStatus(turn, last);
  }

  public isVariantChanged(isVariant: boolean): void {
    this.isVariant.next(isVariant);
  }

  public makeBoardMove(move: ChessMove): void {
    this._board?.makeMove(move);
  }

  public showPromotionDialog(move: ChessMove): void {
    this._board?.showPromotionDialog(move);
  }

  public gameScoreItemsChanged(items: GameScoreItem[]): void {
    this._items.next(items);
  }

  public selectScoreItem(index: number): void {
    this._score?.selectGameScoreItem(index);
  }

  unmakeBoardMove(move: ChessMove): void {
    this._board?.unMakeMove(move);
  }
}
