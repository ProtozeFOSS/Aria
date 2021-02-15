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
import { ThemeService } from './themes.service';
import { LayoutService } from './layout.service';

export enum ScoreViewType {
  Table = 101,
  Flow = 202
};

export enum Actions {
  ToggleAutoPlay = 0,
  RotateBoard = 1,
  ShrinkBoard = 2,
  GrowBoard = 3,
  ShrinkFont = 4,
  GrowFont = 5,
  ToggleScoreView = 6,
  MoveToStart = 7,
  Previous = 8,
  Next = 9,
  MoveToEnd = 10,
  AutoPlayTime = 11,
  MoveToFirstGame = 12,
  PreviousGame = 13,
  NextGame = 14,
  MoveToLastGame = 15,
  Clear = 16
};




export const STOCK_IMAGE = 'player.png';

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
  public timeStarted = 0;
  public UUID: string = '';
  public setName: string = '';
  public setDate: string = '';
  public interactiveBoard = false;
  public interactiveControls = true;
  public interactiveScore = true;

  private _games: ChessGame[] = [];
  private _game: ChessGame | null = null;
  @Output() gameScoreItems: GameScoreItem[] = [];
  @Output() gameResult: string = '';
  @Output() currentIndex = -1;
  @Output() currentGame = -1;
  @Output() currentItem: GameScoreItem | null = null;

  private _board: CanvasChessBoard | null = null;
  private _score: AriaScore | null = null;
  private _status: AriaStatus | null = null;
  private _controls: AriaControls | null = null;
  private _header: AriaHeader | null = null;
  private _app: Aria | null = null;
  private layout: LayoutService | null = null;
  private theme: ThemeService | null = null;
  readonly isVariant = new BehaviorSubject<boolean>(false);

  // Keymap
  @Output() keymap: Map<string, any> = new Map<string, any>();
  @Output() PGNMeta: object = {};
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
    });    
    this.loadKeymap();
  }

  public settings(): object {
    var settings = {};
    return settings;
  }

  public setPGNMetaHash(hash: any) {
    if(hash) {
      try{
       const data =  atob(hash);
       const object = JSON.parse(data);
       this.setPGNMetaObject(object);
      } catch{
        console.log('Bad data passed to Aria.setPGNMetaHash!!');
      }
    }
  }
  public setPGNMetaObject(data: object) {
    this.PGNMeta = data;
    this._header?.refreshMetaData(this.PGNMeta);
  }

  public loadUrlHash(data: string) {
    try {
      const decoded = atob(data);
      const settings_obj = JSON.parse(decoded);
      this._app?.applyJsonSettings(settings_obj);
    } catch (any) {
    }
  }

  public setSettings(settings: object) {
    
    if(this._board){
      // @ts-ignore
      if(settings.interactiveBoard != undefined) {
        // @ts-ignore
        this.interactiveBoard = settings.interactiveBoard as boolean;
        // @ts-ignore
        this._board.setInteractive(this.interactiveBoard);
      }
      // @ts-ignore
      if(settings.interactiveControls != undefined) {
        // @ts-ignore
        this.interactiveControls = settings.interactiveControls as boolean;
        // @ts-ignore
        this._controls.setInteractive(this.interactiveBoard);
      }
      // @ts-ignore
      if(settings.fen) {
        // @ts-ignore
        const position = ChessGame.getPositionFromFEN(settings.fen);
        if(position) {
          this._board.setBoardToPosition(position);
        }
      }
    }
    // @ts-ignore
    if(settings.pgn) {
      // @ts-ignore
      this.loadPGN(settings.pgn);
      // @ts-ignore
      if(settings.game) {
        // @ts-ignore
        this.selectGame(settings.game-1);
      }
      // @ts-ignore
      if(settings.startPly) {
        // navigate to a node
        // @ts-ignore
        this.navigateToNode(settings.startPly);
      }
    }

    // @ts-ignore
    if(settings.keymap) {
      // @ts-ignore
      for (var prop in settings.keymap) {
        // @ts-ignore
        if (Object.prototype.hasOwnProperty.call(settings.keymap, prop)) { 
          // @ts-ignore
          const actionID = settings.keymap[prop];
          switch(actionID) { // fill in the actions here
            case Actions.ToggleAutoPlay:{
              this.keymap.set(prop, this.toggleAutoPlay.bind(this));
              break;
            }
            case Actions.RotateBoard:{
              this.keymap.set(prop, this.rotateBoardOrientation.bind(this));
              break;
            }
            case Actions.ShrinkBoard:{
              if(this._app && this.layout) {
                this.keymap.set(prop, this.layout.shrink.bind(this.layout));
              }
              break;
            }
            case Actions.GrowBoard:{
              if(this._app && this.layout) {
                this.keymap.set(prop, this.layout.grow.bind(this.layout));
              }
              break;
            }
            case Actions.ToggleScoreView:{
              this.keymap.set(prop, this.toggleScoreType.bind(this));
              break;
            }
            case Actions.MoveToStart:{
              this.keymap.set(prop, this.moveToStart.bind(this));
              break;
            }
            case Actions.Previous:{
              this.keymap.set(prop, this.previous.bind(this));
              break;
            }
            case Actions.Next:{
              this.keymap.set(prop, this.advance.bind(this));
              break;
            }
            case Actions.MoveToEnd:{
              this.keymap.set(prop, this.moveToEnd.bind(this));
              break;
            }
            case Actions.AutoPlayTime:{
              // Should be encoded
              // "6:1251" - Key '6' sets autoplay value to 1251(ms)
              // "q:800" - Key 'q' sets autoplay value to 800(ms)
              let values = prop.split(':');
              if(values.length == 2) {
                const time = parseInt(values[1]);
                if(!isNaN(time)){
                  this.keymap.set(values[0], ()=>{this.autoPlaySpeed.next(time);});
                }
              }
            }
            case Actions.MoveToFirstGame:{
              this.keymap.set(prop, this.moveToFirstGame.bind(this));
              break;
            }
            case Actions.PreviousGame:{
              this.keymap.set(prop, this.previousGame.bind(this));
              break;
            }
            case Actions.NextGame:{
              this.keymap.set(prop, this.nextGame.bind(this));
              break;
            }
            case Actions.MoveToLastGame:{
              this.keymap.set(prop, this.moveToLastGame.bind(this));
              break;
            }
            case Actions.Clear:{
              if(this.keymap.has(prop)) {
                this.keymap.set(prop,null);
              }
            }
            default:{
              console.log('Invalid Action ID in aria.keymap setting:' + prop + ' -> Invalid (' + actionID + ')' );
            }
          }
        }
      }
    }
  }

  public loadKeymap(): void {
    // initial default keymap
    this.keymap.set('Space', this.toggleAutoPlay.bind(this));
    this.keymap.set('Home', this.moveToStart.bind(this));
    this.keymap.set('End', this.moveToEnd.bind(this));
    this.keymap.set('ArrowRight', this.advance.bind(this));
    this.keymap.set('ArrowLeft', this.previous.bind(this));
    this.keymap.set('-', ()=>{this.layout.shrink()});
    this.keymap.set('=', ()=>{this.layout.grow()});
    this.keymap.set('i', this.rotateBoardOrientation.bind(this));
    this.keymap.set(']', this.nextGame.bind(this));
    this.keymap.set('[', this.previousGame.bind(this));
  }

  public keyEvent(event: any): void {
    if (this.keymap.has(event.key)) {
      const action = this.keymap.get(event.key);
      if(action) {
        action();
      }
    }
  }

  public moveToFirstGame():void{
    if(this.currentGame != 0) {
      this.selectGame(0);
    }
  }
  public moveToLastGame():void{
    if(this.currentGame != this._games.length-1) {
      this.selectGame(this._games.length-1);
    }
  }
  public previousGame(): void {
    if (this.currentGame > 0) {
      --this.currentGame;
    }
    if (this.currentGame >= 0) {
      this.selectGame(this.currentGame)
    }
  }
  public nextGame(): void {
    if (this.currentGame < (this._games.length-1)) {
      this.selectGame(++this.currentGame)
    }
  }

  public moveToStart(): void {
    this.navigateToNode(-1);
  }
  public moveToEnd(): void {
    this.navigateToNode(this.gameScoreItems.length-1);
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
    if (index === -1) {
      this.resetEngine();
      this._board?.setBoardToPosition(this._game.getPosition());
      this._board?.requestRedraw();
      this._score?.clearSelection();
      return;
    }
    if (this.currentIndex < index) {
      while (this.currentIndex < index) {
        const next = this.gameScoreItems[++this.currentIndex] as GameScoreItem;
        if (next) {
          if (this.play(next.move)) {
            const nodeMove = ChessMove.fromNode(next.move);
            if (nodeMove) {
              this.makeBoardMove(nodeMove);
            }
          } else {
            this.currentIndex = index;
          }
        } else {
          this.currentIndex = index;
        }
      }
    } else {
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
    }
    if (this._score) {
      this._score.updateSelection();
      window.setTimeout(()=>{this.layout.sendLayoutChanged(window.innerWidth,window.innerHeight,this.layout.state)},100);
    }
  }
  protected autoAdvance(): void {
    let millis = (this.autoPlaySpeed.value - (Date.now() - this.timeStarted));
    if (millis <= 0) {
      if (!this.isFinalPosition()) {
        this.advance();
      } else {
        this.toggleAutoPlay();
      }
      this.timeStarted = Date.now();
      millis = this.autoPlaySpeed.value;
    }
    if (this._controls) {
      this._controls.setTimer(millis);
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
      this.timeStarted = Date.now();
      this.autoIntervalID = window.setInterval(this.autoAdvance.bind(this), this.autoPlaySpeed.value / 4);
      if (this._controls) {
        this._controls.playing = true;
      }
    } else {
      window.clearInterval(this.autoIntervalID);
      this.autoIntervalID = -1;
      if (this._controls) {
        this._controls.setTimer(this.autoPlaySpeed.value);
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
      this.currentGame = index;
      this._game = this._games[index];
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
          this._header.setHeader(headerData, this.PGNMeta);
          this._header.currentGame = index;
          this._header.gameCount = this._games.length;
        }
      }
      window.setTimeout(()=>{this.layout.resizeLayout(document.body.clientWidth,window.innerHeight)},1);
    }
  }

  public attachAria(aria: Aria) {
    this._app = aria;
    this.layout = aria.layout;
    this.theme = aria.theme;
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
    window.setTimeout(()=>{this.updateScoreData();}, 1);
    const gamescore = this._game?.generateGameScore();
    if (gamescore) {
      this.gameScoreItems = gamescore;
    } else {
      this.gameScoreItems = [];
    }
    this._score?.updateSelection(); 
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
    if(this._game){
      const headerData = this._game?.generateHeaderData();
      if (headerData) {
        const result = headerData.get('Result');
        if (result) {
          this.gameResult = result;
        }
        if (this._header) {
          this._header.setHeader(headerData,this.PGNMeta);
          this._header.currentGame = this.currentGame;
          this._header.gameCount = this._games.length;
        }
      }
    }
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
    this.currentIndex = -1;
    this.currentItem = null;
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
