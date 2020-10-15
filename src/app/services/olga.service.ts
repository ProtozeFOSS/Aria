import { Injectable, Output, Input } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GameScoreItem, ChessGame, GameScoreType, ChessMove } from '../common/kokopu-engine';
import { CanvasChessBoard } from '../canvas-chessboard/canvas-chessboard.component';
import { GamescoreUxComponent } from '../game-score/game-score.ux';
import { OlgaStatusComponent } from '../olga-status/olga-status.component';
// @ts-ignore
import {Node as KNode, Variation as KVariation } from 'kokopu';
import { OlgaControlsComponent } from '../olga-controls/olga-controls.component';
import { OlgaMenuComponent } from '../olga-menu/olga-menu.component';
@Injectable({
  providedIn: 'root'
})
export class OlgaService {
  @Output() readonly showingPly = new BehaviorSubject<boolean>(true);
  @Output() readonly showingHalfPly = new BehaviorSubject<boolean>(false);
  @Output() readonly autoPlaySpeed = new BehaviorSubject<number>(1200);
  protected autoIntervalID = -1;
  protected timeLeft = 300;
  public UUID: string = '';
  @Input() @Output() readonly figurineNotation = new BehaviorSubject<boolean>(
    true
  );
  @Output() readonly gsFontFamily = new BehaviorSubject<string>('FigurineSymbolT1');
  @Output() readonly scoreFontSize = new BehaviorSubject<number>(32);
  @Output() readonly figurineSize = new BehaviorSubject<number>(20);
  @Output() readonly showLabels = new BehaviorSubject<boolean>(true);

  private _games: ChessGame[] = [];
  private _game: ChessGame | null = null;

  private _board: CanvasChessBoard | null = null;
  private _score: GamescoreUxComponent | null = null;
  private _status: OlgaStatusComponent | null = null;
  private _controls: OlgaControlsComponent | null = null;
  private _menu: OlgaMenuComponent | null = null;
  readonly isVariant = new BehaviorSubject<boolean>(false);


  // Visual Settings
  constructor() { 
    this.figurineNotation.subscribe((figurineNotation: boolean) => {
      if (figurineNotation) {
        this.gsFontFamily.next('FigurineSymbolT1');
      } else {
        this.gsFontFamily.next('Cambria');
      }
      document.documentElement.style.setProperty(
        '--gsFontFamily',
        this.gsFontFamily.value
      );
    });    
  }

  public moveToStart(): void {
    if (this._score) {
      this._score.moveToStart();
    }
  }
  public advance(): void {
    if (this._score) {
      this._score.advance();
    }
  }
  public previous(): void {
    if (this._score) {
      this._score.previous();
    }
  }
  public moveToEnd(): void {
    if (this._score && !this._score.isFinalPosition()) {
      this._score.moveToEnd();
    }
  }

  public getNodeIndex(): number {
    if(this._score) {
      return this._score.currentIndex;
    }
    return -1;
  }
  
  protected autoAdvance():void {
    this.timeLeft -= 100;
    if(this._controls) {
      this._controls.setTimer(this.timeLeft);
    }
    if(this.timeLeft <= 0) {
      if(this._score && !this._score.isFinalPosition()){
        this.advance();
      } else {
        this.toggleAutoPlay();
      }
      this.timeLeft = this.autoPlaySpeed.value;
    }
  }

  public toggleAutoPlay():void {
    
    if(this._score && !this._score.isFinalPosition() && this.autoIntervalID == -1) {
      this.autoIntervalID = window.setInterval(this.autoAdvance.bind(this), 100);
      if(this._controls) {
        this._controls.playing = true;
      }
    } else {
      window.clearInterval(this.autoIntervalID);
      this.autoIntervalID = -1;
      this.timeLeft = this.autoPlaySpeed.value;
      if(this._controls) {
      this._controls.setTimer(this.timeLeft);
        this._controls.playing = false;
      }
    }
  }

  public openEngine(): void { }

  public toggleGameScoreViewType(): void {

  }

  public loadPGN(pgn: string) {
    this._games = ChessGame.parsePGN(this, pgn);
    this._score?.setGameScoreItems([]);
    if(this._games.length > 0){
      const game = this._games[0];
      this._game = game;
      window.setTimeout( () => {
        this._score?.setGameScoreItems(this._game?.generateGameScore());
        this._board?.setBoardToPosition(this._game?.getPosition());
        this._score?.updateSelection();
      }, 1);
    }
  }

  public clearItems(): void {
    if(this._score) {
      this._score._items = [];
    }
  }

  public typeToString(type: GameScoreType): string {
    return GameScoreType[type];
  }

  public selectGame(index: number) {
    if (index >= 0 && index <= this._games.length && this._score) {
      this._game = this._games[index];
      this._score._items = this._game.generateGameScore();
    }
  }

  public initializeComponents():void{}

  public attachBoard(board: CanvasChessBoard) {
    this._board = board;
  }

  public attachScore(score: GamescoreUxComponent) {
    this._score = score;
  }

  public attachStatus(status: OlgaStatusComponent) {
    this._status = status;
  }

  public attachControls(controls: OlgaControlsComponent) {
    this._controls = controls;
  }

  public editComment(data: GameScoreItem): void {
    console.log('Editing Comment -> ' + data.move.comment());
  }

  public openVariation(data: GameScoreItem): void {
    const variations = data.move.variations();
    if(this._score && variations && variations.length) {
      console.log('Editing Variations on: ' + data.move.notation());
      console.log(variations);
      if(this._menu) {
        this._menu.openVariationMenu(data);
      }
    }
  }

  public displayVariations(data: GameScoreItem): void {
    console.log('Displaying Variations');
    console.log(data.move.notation());
    const variations = data.move.variations();
    let previous = data;
    variations.forEach((variation: KVariation) =>{
      console.log(variation);
      let current = variation.first();
      if(current) {
        console.log('Variation chain :');
        let chain = current.notation();
        if(previous) {
          chain = previous.move.notation() + '->' + chain;
        }
        while(current){
          current = current.next();
          if(current) {
            chain += '->'+ current.notation();
          }
        }
        console.log(chain);
      }
    });
    console.log(variations);
  }


  // game score interface


  // Board interface

  public rotateBoardOrientation(): void {
    if(this._board){
      if(this._board.settings.orientation == 'white'){
        this._board.settings.orientation = 'black';
      } else {
        this._board.settings.orientation = 'white';
      }
      this._board.requestRedraw();
    }
  }
  public reRenderBoard(): void {
    if(this._board) {
      this._board.requestRedraw();
    }
  }
  public redrawBoard(): void {
    if(this._game && this._board) {
    const position = this._game.getPosition();
      if(position) {
        this._board.setBoardToPosition(position);
      }
    }
  }

  public updateStatus(turn: string, last?: KNode, move: any = null): void {
    this._status?.updateStatus(turn, last, move);
  }

  public isVariantChanged(isVariant: boolean): void {
    this.isVariant.next(isVariant);
  }

  public makeBoardMove(move: ChessMove): void {
    this._board?.makeMove(move);
  }

  public reverseBoardMove(move: ChessMove) : void {
    this._board?.unMakeMove(move);
  }

  public showPromotionDialog(move: ChessMove): void {
    this._board?.showPromotionDialog(move);
  }

  public incrementGameScoreSelection(): void {
    this._score?.incrementSelection();
  }

  public gameScoreItemsChanged(items: GameScoreItem[]): void {
    this._score?.setGameScoreItems(items);
  }

  public validGame(): boolean {
    return this._game !== null;
  }

  public performPromotion(move: ChessMove): void {
    this._game?.performPromotion(move);
  }

  public getGame(): ChessGame | null{
    return this._game;
  }

  public getBoard(): CanvasChessBoard | null {
    return this._board;
  }



  // engine interface
  public isMoveDescriptor(move: any) : boolean {
    return ChessGame.isMoveDescriptor(move);
  }

  public getMoveNotation(node: KNode): string {
    if(this._game) {
      return this._game.getMoveNotation(node);
    }
    return '';
  }

  public play(next: GameScoreItem): boolean {
    if(this._game) {
      return this._game.play(next);
    }
    return false;
  }
  public unPlay(current: KNode, previous = null): boolean {
    if(this._game) {
      return this._game.unPlay(current, previous);
    }
    return false;
  }

  public makeEngineMove(next: ChessMove): boolean | null {
    if(this._game) {
      return this._game.makeMove(next);
    }
    return null;
  }

  public makeVariantMove(index: number, move: KNode): boolean {
    if(this._game) {
      return this._game.makeVariantMove(index, move);
    }
    return false;
  }
  
  public setPGN(pgn: string):void {
    if(this._game) {
      this._game.setPGN(pgn);
    }
  }

  public resetEngine(): void {
    if(this._game) {
      this._game.resetEngine();
    }
  }


}
