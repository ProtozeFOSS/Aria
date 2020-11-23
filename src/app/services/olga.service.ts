import { Injectable, Output, Input } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { GameScoreItem, ChessGame, GameScoreType, ChessMove } from '../common/kokopu-engine';
import { CanvasChessBoard } from '../canvas-chessboard/canvas-chessboard.component';
import { GamescoreUxComponent } from '../olga-score/olga-score.component';
import { OlgaStatusComponent } from '../olga-status/olga-status.component';
// @ts-ignore
import { Node as KNode, Variation as KVariation } from 'kokopu';
import { OlgaControlsComponent } from '../olga-controls/olga-controls.component';
import { OlgaMenuComponent } from '../olga-menu/olga-menu.component';
import { CookieConsentComponent } from '../cookie-consent/cookie-consent.component';
import { Olga } from '../app.component';
import { OlgaHeaderComponent } from '../olga-header/olga-header.component';

export interface PlayerData{
  born?: string;
  elo?: number;
  image?: string;
}
export const STOCK_IMAGE = '/assets/images/player.png';

@Injectable({
  providedIn: 'root'
})
export class OlgaService {
  @Output() readonly showingPly = new BehaviorSubject<boolean>(true);
  @Output() readonly showingHalfPly = new BehaviorSubject<boolean>(false);
  @Output() readonly cookiesAccepted = new BehaviorSubject<boolean>(false);
  @Output() readonly autoPlaySpeed = new BehaviorSubject<number>(300);
  @Output() readonly gameScoreAsTable = new BehaviorSubject<boolean>(false);
  protected autoIntervalID = -1;
  protected timeLeft = 300;
  public UUID: string = '';
  public setName: string = '';
  public setDate: string = '';
  public playerData: object = {};
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
  private _cookies: CookieConsentComponent | null = null;
  private _header: OlgaHeaderComponent | null = null;
  private _app: Olga | null = null;
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
    this.cookiesAccepted.subscribe((cookiesAccepted: boolean) => {
      this.setCookieConsent(cookiesAccepted);
    });
  }

  public settings(): object {
    let settings = {};
    return settings;
  }

  public setSettings(settings: object): void {

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
    if (this._score) {
      return this._score.currentIndex;
    }
    return -1;
  }

  protected autoAdvance(): void {
    this.timeLeft -= 100;
    if (this._controls) {
      this._controls.setTimer(this.timeLeft);
    }
    if (this.timeLeft <= 0) {
      if (this._score && !this._score.isFinalPosition()) {
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

    if (this._score && !this._score.isFinalPosition() && this.autoIntervalID == -1) {
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
  public getCookiesConsent(): boolean {
    return this.cookiesAccepted.value;
  }
  public setCookieConsent(consent: boolean): void {
    if (this.cookiesAccepted.value != consent) {
      this.cookiesAccepted.next(consent);
    }
    if (consent && this._cookies) {
      this._cookies.hide();
    }
  }

  public openEngine(): void { }

  public toggleGameScoreViewType(): void {
    this.gameScoreAsTable.next(!this.gameScoreAsTable);
  }

  public loadPGN(pgn: string) {
    let fIndex = pgn.indexOf('[Set ');
    if (fIndex >= 0) {
      const endSet = pgn.indexOf(']', fIndex);
      const setName = pgn.slice(fIndex, endSet + 1);
      if (setName.length > 0 && setName.length < 240) {
        this.setName = setName.substr(6, -2);
      }
      pgn = pgn.replace(setName, '');
    }
    fIndex = pgn.indexOf('[SetDate ');
    if (fIndex >= 0) {
      const endSet = pgn.indexOf(']', fIndex);
      const setDate = pgn.slice(fIndex, endSet + 1);
      if (setDate.length > 0 && setDate.length < 60) {
        this.setDate = setDate.substr(10, -2);
      }
      pgn = pgn.replace(setDate, '');
    }
    fIndex = pgn.indexOf('[ImagePath ');
    let imagePath = '';
    if (fIndex >= 0) {
      const endSet = pgn.indexOf(']', fIndex);
      const iPath = pgn.slice(fIndex, endSet + 1);
      if (endSet >= 0 && endSet - fIndex <= 120) {
        imagePath = iPath.slice(12, -2);
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
          this.playerData = JSON.parse(data) as object;
          if(this.playerData) {
            for(let k in this.playerData) {
              // @ts-ignore
              let pdata = this.playerData[k];
              if(pdata.image) {
                pdata.image = imagePath + pdata.image;
              }
            }
          }
        }
      }
      pgn = pgn.replace(pData, '');
    }
    this._games = ChessGame.parsePGN(this, pgn);
    if (this._games.length > 0) {
      const game = this._games[0];
      this._game = game;
      window.setTimeout(() => {
        // this._score?.setGameScoreItems(this._game?.generateGameScore());
        // this._board?.setBoardToPosition(this._game?.getPosition());
        // this._score?.updateSelection();
        const headerData = this._game?.generateHeaderData();
        if (headerData) {
          if (this._header) {
            this._header.gameCount = this._games.length;
            this._header.currentGame = 0;
            this._header.setHeader(headerData);
          }
        }
        this.selectGame(0);
      }, 1);
    }
  }

  public clearItems(): void {
    if (this._score) {
      this._score._items = [];
    }
  }

  public typeToString(type: GameScoreType): string {
    return GameScoreType[type];
  }

  public selectGame(index: number) {
    if (index >= 0 && index <= this._games.length && this._score) {
      this._game = this._games[index];
      window.setTimeout(() => {
        this._score?.clearGameScore();
        this._score?.setGameScoreItems(this._game?.generateGameScore());
        this._board?.setBoardToPosition(this._game?.getPosition());
        this._score?.updateSelection();
        const headerData = this._game?.generateHeaderData();
        if (headerData) {
          if (this._header) {
            this._header.gameCount = this._games.length;
            this._header.setHeader(headerData);
          }
        }
      }, 1);
    }
  }

  public attachOlga(olga: Olga) {
    this._app = olga;
    this._board = olga.canvasBoardComponent;
    this._header = olga.headerComponent;
    this._controls = olga.controlsComponent;
    this._cookies = olga.cookiesComponent;
    this._menu = olga.menuComponent;
    this._status = olga.statusComponent;
  }
  public attachScore(score: GamescoreUxComponent): void {
    this._score = score;
  }

  public attachHeader(header: OlgaHeaderComponent) {
    this._header = header;
  }

  public editComment(data: GameScoreItem): void {
    console.log('Editing Comment -> ' + data.move.comment());
  }

  public openVariation(data: GameScoreItem): void {
    const variations = data.move.variations();
    if (this._score && variations && variations.length) {
      console.log('Editing Variations on: ' + data.move.notation());
      console.log(variations);
      if (this._menu) {
        this._menu.openVariationMenu(data);
      }
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
    this._status?.updateStatus(turn, last, move);
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
    if (this._cookies) {
      if (this.cookiesAccepted.value) {
        let settings = this.createJsonSettings();
        this._cookies.setCookie(settings, 365);
      } else {
        this._cookies.setCookie('', 0);
      }
    }
  }

  public loadSettings(): string {
    let settings = '';
    if (this._cookies) {
      settings = this._cookies.getCookie();
    }
    this.setJsonSettings(settings);
    return settings;
  }
}
