import { Injectable, Output, Input } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GameScoreItem, ChessGame, GameScoreType, ChessMove } from '../common/kokopu-engine';
import { CanvasChessBoard } from '../canvas-chessboard/canvas-chessboard.component';
import { AriaScore } from '../aria-score/aria-score.component';
import { AriaStatus } from '../aria-status/aria-status.component';
// @ts-ignore
import { Node as KNode, Variation as KVariation } from 'kokopu';
import { AriaControls } from '../aria-controls/aria-controls.component';
import { Aria } from '../app.component';
import { AriaHeader } from '../aria-header/aria-header.component';
import { environment } from '../../environments/environment';
import { trimTrailingNulls } from '@angular/compiler/src/render3/view/util';
export interface PlayerData {
  born?: string;
  elo?: number;
  image?: string;
}
export interface GameData {
  opening?: string;
  country?: string;
}
export enum ScoreViewType {
  Table = 101,
  Flow = 202
};


export const STOCK_IMAGE = environment.imagesPath + 'player.png';

@Injectable({
  providedIn: 'root'
})
export class AriaService {
  // Aria Score Toggles 
  @Output() readonly showingPly = new BehaviorSubject<boolean>(true);
  @Output() readonly showingHalfPly = new BehaviorSubject<boolean>(false);
  @Output() readonly scoreViewType = new BehaviorSubject<ScoreViewType>(ScoreViewType.Flow);
  @Output() readonly showTableHeader = new BehaviorSubject<boolean>(true);

  // Control Toggles
  @Output() readonly showSettings = new BehaviorSubject<boolean>(true);
  @Output() readonly autoPlaySpeed = new BehaviorSubject<number>(1000);

  // Score
  readonly figurineNotation = new BehaviorSubject<boolean>(true);
  @Output() readonly gsFontFamily = new BehaviorSubject<string>('FigurineSymbolT1');
  @Output() readonly gsFontScale = new BehaviorSubject<number>(1);
  @Output() readonly scoreFontSize = new BehaviorSubject<number>(32);
  @Output() readonly figurineSize = new BehaviorSubject<number>(20);

  // Board
  @Output() readonly showLabels = new BehaviorSubject<boolean>(true);


  protected autoIntervalID = -1;
  public timeLeft = 1000;
  public UUID: string = '';
  public setName: string = '';
  public setDate: string = '';
  public playerData: object = {};
  public gameData = [];


  private _games: ChessGame[] = [];
  private _game: ChessGame | null = null;
  @Output() gameScoreItems: GameScoreItem[] = [];
  @Output() gameResult: string = '';
  @Output() currentIndex = -1;
  @Output() currentItem: GameScoreItem | null = null;

  private _board: CanvasChessBoard | null = null;
  private _score: AriaScore | null = null;
  private _status: AriaStatus | null = null;
  private _controls: AriaControls | null = null;
  private _header: AriaHeader | null = null;
  private _app: Aria | null = null;
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
    this.autoPlaySpeed.subscribe((value)=>{
      this._controls?.setTimer(value);
    })
  }

  public settings(): object {
    let settings = {};
    return settings;
  }

  public moveToStart(): void {
    while (this.previous()) { }
  }
  public moveToEnd(): void {
    while (this.advance()) { }
  }

  public isStartingPosition(): boolean {
    return this.currentIndex === -1;
  }
  public isFinalPosition(): boolean {
    return this.currentIndex >= (this.gameScoreItems.length - 1);
  }
  public previous(): boolean {
    if (this.currentIndex !== -1) {
      const prev = this.currentIndex - 1;
      if (prev < this.gameScoreItems.length && prev >= -1) {
        this.navigateToNode(prev);
        return true;
      }
    }
    return false;
  }
  public advance(): boolean {
    if (!this.isFinalPosition()) {
      const next = this.currentIndex + 1;
      if (next < this.gameScoreItems.length && next >= 0) {
        this.navigateToNode(next);
        return true;
      }
    }
    return false;
  }

  public getPlyCount(): number {
    if (this.gameScoreItems) {
      return (this.gameScoreItems.length / 2) + 1;
    }
    return 0;
  }
  public navigateToNode(index: number) {
    if (this.currentIndex < index) {
      while (this.currentIndex < index) {
        const next = this.gameScoreItems[++this.currentIndex] as GameScoreItem;
        if (next) {
          if (this.play(next.move)) {
            const nodeMove = ChessMove.fromNode(next.move);
            if (nodeMove) {
              this.makeBoardMove(nodeMove);
            }
          }
        }
      }
      this.currentIndex = index;
      if (this._score) {
        this._score.updateSelection();
      }
      return;
    }
    while (this.currentIndex > index) {
      const node = this.gameScoreItems[this.currentIndex];
      let prev = null;
      if (this.currentIndex > 0) {
        prev = this.gameScoreItems[this.currentIndex - 1];
      }
      if (prev && node) {
        if (this.unPlay(node.move, prev.move)) {
          const nodeMove = ChessMove.fromNode(node.move);
          if (nodeMove) {
            this.reverseBoardMove(nodeMove);
          }
        }
      }
      --this.currentIndex;
    }
    if (index === -1) {
      this.resetEngine();
      this.redrawBoard();
    }
    if (this._score) {
      this._score.updateSelection();
    }
  }
  protected autoAdvance(): void {
    this.timeLeft -= 100;
    if (this._controls) {
      this._controls.setTimer(this.timeLeft);
    }
    if (this.timeLeft <= 0) {
      if (!this.isFinalPosition()) {
        this.advance();
      } else {
        this.toggleAutoPlay();
      }
      this.timeLeft = this.autoPlaySpeed.value;
    }
  }

  protected createJsonSettings(): string {
    if (this._app) {
      return this._app.getJsonSettings();
    }
    return '';
  }

  protected setJsonSettings(json: string): boolean {
    if (this._app) {
      if (json.length > 0) {
        const settings = JSON.parse(json);
        return this._app.applyJsonSettings(settings);
      }
      return this._app.applyDefaultSettings();
    }
    return false;
  }

  public toggleAutoPlay(): void {

    if (!this.isFinalPosition() && this.autoIntervalID == -1) {
      this.autoIntervalID = window.setInterval(this.autoAdvance.bind(this), 100);
      if (this._controls) {
        this._controls.playing = true;
      }
    } else {
      window.clearInterval(this.autoIntervalID);
      this.autoIntervalID = -1;
      this.timeLeft = this.autoPlaySpeed.value;
      if (this._controls) {
        this._controls.setTimer(this.timeLeft);
        this._controls.playing = false;
      }
    }
  }

  public toggleScoreType(): void {
    if (this.scoreViewType.value == ScoreViewType.Flow) {
      this.scoreViewType.next(ScoreViewType.Table);
    } else {
      this.scoreViewType.next(ScoreViewType.Flow);
    }
  }

  public openSettings(): void{
    if(this._app){
      //this._app. send(JRPC:OpenSettings);
    }
  }

  public openEngine(): void { }

  public gameCount(): number {
    if (this._games) {
      return this._games.length;
    }
    return 0;
  }


  public toggleGameScoreViewType(): void {
    if (this.scoreViewType.value === ScoreViewType.Flow) {
      this.scoreViewType.next(ScoreViewType.Table);
    } else {
      this.scoreViewType.next(ScoreViewType.Flow);
    }
  }

  public loadPGN(pgn: string) {
    let fIndex = pgn.indexOf('[Set ');
    if (fIndex >= 0) {
      const endSet = pgn.indexOf(']', fIndex);
      const setName = pgn.slice(fIndex, endSet + 1);
      if (setName.length > 0 && setName.length < 240) {
        this.setName = setName.slice(6, -2);
      }
      pgn = pgn.replace(setName, '');
    }
    fIndex = pgn.indexOf('[SetDate ');
    if (fIndex >= 0) {
      const endSet = pgn.indexOf(']', fIndex);
      const setDate = pgn.slice(fIndex, endSet + 1);
      if (setDate.length > 0 && setDate.length < 60) {
        this.setDate = setDate.slice(10, -2);
      }
      pgn = pgn.replace(setDate, '');
    }
    fIndex = pgn.indexOf('[PlayerImages ');
    let imagePath = '';
    if (fIndex >= 0) {
      const endSet = pgn.indexOf(']', fIndex);
      const iPath = pgn.slice(fIndex, endSet + 1);
      if (endSet >= 0 && endSet - fIndex <= 120) {
        imagePath = iPath.slice(15, -2);
      }
      pgn = pgn.replace(iPath, '');
    }
    fIndex = pgn.indexOf('[PlayerData ');
    this.playerData = {};
    if (fIndex >= 0) {
      const endSet = pgn.indexOf(']', fIndex);
      const pData = pgn.slice(fIndex, endSet + 1);
      if (endSet >= 0 && endSet - fIndex <= 1500) {
        const data = pData.slice(13, -2);
        if (data.length > 0) {
          try {
            this.playerData = JSON.parse(data) as object;
            if (this.playerData) {
              for (let k in this.playerData) {
                // @ts-ignore
                let pdata = this.playerData[k];
                if (pdata.image) {
                  pdata.image = imagePath + pdata.image;
                }
              }
            }
          } catch (ex) {
            console.log('Bad parse on JSON player data');
          }
        }
      }
      pgn = pgn.replace(pData, '');
    }
    fIndex = pgn.indexOf('[GameData ');
    this.gameData = [];
    if (fIndex >= 0) {
      let endSet = pgn.indexOf(']', fIndex);
      endSet = pgn.indexOf(']', endSet + 1);
      const pData = pgn.slice(fIndex, endSet + 1);
      if (endSet >= 0 && endSet - fIndex <= 1500) {
        const data = pData.slice(11, -2);
        if (data.length > 0) {
          try {
            this.gameData = JSON.parse(data);
          } catch (ex) {
            console.log('Bad parse on JSON for game data');
          }
        }
      }
      pgn = pgn.replace(pData, '');
    }
    this._games = ChessGame.parsePGN(this, pgn);
    if (this._games.length > 0) {
      const game = this._games[0];
      this._game = game;
      this.selectGame(0);
    }
  }

  public typeToString(type: GameScoreType): string {
    return GameScoreType[type];
  }

  public selectGame(index: number) {
    if (index >= 0 && index <= this._games.length) {
      this._game = this._games[index];
      window.setTimeout(() => {
        this._score?.clearSelection();
        const gamescore = this._game?.generateGameScore();
        if (gamescore) {
          this.gameScoreItems = gamescore;
        } else {
          this.gameScoreItems = [];
        }
        this._board?.setBoardToPosition(this._game?.getPosition());
        this._score?.updateSelection();
        const headerData = this._game?.generateHeaderData();
        if (headerData) {
          const result = headerData.get('Result');
          if (result) {
            this.gameResult = result;
          }
          if (this._header) {
            this._header.setHeader(headerData);
            this._header.currentGame = index;
            this._header.gameCount = this._games.length;
          }
        }
        window.setTimeout(()=>{this._app.layout.resizeLayout(window.innerWidth, window.innerHeight);},60);
      }, 1);
    }
  }

  public attachAria(aria: Aria) {
    this._app = aria;
    this.attachScore(aria.gameScoreComponent);
    this.attachBoard(aria.canvasBoardComponent);
    this.attachHeader(aria.headerComponent);
    this.attachControls(aria.controlsComponent);
    this.attachStatus(aria.statusComponent);
  }

  public attachControls(controls: AriaControls) {
    this._controls = controls;
    this._app?.registerControls(controls, document.getElementById('controls-' + this.UUID));
  }
  public attachBoard(board: CanvasChessBoard) {
    this._board = board;
    this._app?.registerBoard(board, document.getElementById('ccb-'+ this.UUID));
  }

  public attachScore(score: AriaScore): void {
    this._score = score;
    this._app?.registerScore(score, document.getElementById('score-'+ this.UUID));
    window.setTimeout(()=>{this.updateScoreData();}, 10);
  }

  public updateScoreData() : void {
    if(this._score && this._game){
      this._score.clearSelection();
        const gamescore = this._game.generateGameScore();
        if (gamescore) {
          this.gameScoreItems = gamescore;
        } else {
          this.gameScoreItems = [];
        }
        this._score.updateSelection();
      }
  }

  public attachHeader(header: AriaHeader): void {
    this._header = header;
    this._app?.registerHeader(header, document.getElementById('header-'+ this.UUID));
  }

  public attachStatus(status: AriaStatus): void {
    this._status = status;
    this._app?.registerStatus(status, document.getElementById('status-'+ this.UUID));
  }

  public editComment(data: GameScoreItem): void {
    console.log('Editing Comment -> ' + data.move.comment());
  }

  public openVariation(data: GameScoreItem): void {
    const variations = data.move.variations();
    if (this._score && variations && variations.length) {
      console.log('Editing Variations on: ' + data.move.notation());
      console.log(variations);
      // if (this._menu) {
      //   this._menu.openVariationMenu(data);
      // }
    }
  }

  public displayVariations(data: GameScoreItem): void {
    console.log('Displaying Variations');
    console.log(data.move.notation());
    const variations = data.move.variations();
    let previous = data;
    variations.forEach((variation: KVariation) => {
      console.log(variation);
      let current = variation.first();
      if (current) {
        console.log('Variation chain :');
        let chain = current.notation();
        if (previous) {
          chain = previous.move.notation() + '->' + chain;
        }
        while (current) {
          current = current.next();
          if (current) {
            chain += '->' + current.notation();
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
    if (this._board) {
      if (this._board.settings.orientation == 'white') {
        this._board.settings.orientation = 'black';
      } else {
        this._board.settings.orientation = 'white';
      }
      this._board.requestRedraw();
    }
  }
  public reRenderBoard(): void {
    if (this._board) {
      this._board.requestRedraw();
    }
  }
  public redrawBoard(): void {
    if (this._game && this._board) {
      const position = this._game.getPosition();
      if (position) {
        this._board.setBoardToPosition(position);
      }
    }
  }

  public updateStatus(turn: string, last?: KNode, move: any = null): void {
    //this._status?.updateStatus(turn, last, move);
  }

  public isVariantChanged(isVariant: boolean): void {
    this.isVariant.next(isVariant);
  }

  public makeBoardMove(move: ChessMove): void {
    this._board?.makeMove(move);
  }

  public reverseBoardMove(move: ChessMove): void {
    this._board?.unMakeMove(move);
  }

  public showPromotionDialog(move: ChessMove): void {
    this._board?.showPromotionDialog(move);
  }

  public gameScoreItemsChanged(items: GameScoreItem[]): void {
    this.gameScoreItems = items;
  }

  public validGame(): boolean {
    return this._game !== null;
  }

  public performPromotion(move: ChessMove): void {
    this._game?.performPromotion(move);
  }

  public getGame(): ChessGame | null {
    return this._game;
  }

  public getBoard(): CanvasChessBoard | null {
    return this._board;
  }

  public getPlayerData(player: string): PlayerData | null {
    // @ts-ignore
    return this.playerData[player] as PlayerData;
  }

  public getGameData(index: number): GameData | null {
    if (this.gameData.length > index && index >= 0) {
      return this.gameData[index] as GameData;
    }
    return null;
  }


  // engine interface
  public isMoveDescriptor(move: any): boolean {
    return ChessGame.isMoveDescriptor(move);
  }

  public gameFEN(): string {
    let fen = '';
    if (this._game) {
      return this._game.getPosition().fen();
    }
    return fen;
  }

  public getMoveNotation(node: KNode): string {
    if (this._game) {
      return this._game.getMoveNotation(node);
    }
    return '';
  }

  public play(next: GameScoreItem): boolean {
    if (this._game) {
      return this._game.play(next);
    }
    return false;
  }
  public unPlay(current: KNode, previous = null): boolean {
    if (this._game) {
      return this._game.unPlay(current, previous);
    }
    return false;
  }

  public makeEngineMove(next: ChessMove): boolean | null {
    if (this._game) {
      return this._game.makeMove(next);
    }
    return null;
  }

  public makeVariantMove(index: number, move: KNode): boolean {
    if (this._game) {
      return this._game.makeVariantMove(index, move);
    }
    return false;
  }


  public resetEngine(): void {
    if (this._game) {
      this._game.resetEngine();
    }
  }

  public saveSettings(): void {
    // if (this._cookies) {
    //   if (this.cookiesAccepted.value) {
    //     let settings = this.createJsonSettings();
    //     this._cookies.setCookie(settings, 365);
    //   } else {
    //     this._cookies.setCookie('', 0);
    //   }
    // }
    this._app?.saveSettings(this.createJsonSettings());
  }

  public loadSettings(): string {
    let settings = '{}';
    // if (this.cookiesAccepted.value) {
    //   if (this._cookies) {
    //     settings = this._cookies.getCookie();
    //   }
    //   this.setJsonSettings(settings);
    // }
    return settings;
  }
}
