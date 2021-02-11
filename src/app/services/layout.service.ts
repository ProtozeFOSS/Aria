import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Aria } from '../app.component';
import { AriaHeader } from '../aria-header/aria-header.component';
import { AriaScore } from '../aria-score/aria-score.component';
import { CanvasChessBoard } from '../canvas-chessboard/canvas-chessboard.component';
import { AriaControls } from '../aria-controls/aria-controls.component';
import { AriaStatus } from '../aria-status/aria-status.component';

export declare type Layout = 'auto' | 'landscape' | 'portrait';

export enum LayoutDirection{
  RightToLeft = 0,
  LeftToRight = 1
}

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly landscapeOrientation = new BehaviorSubject<boolean>(true);
  readonly mobileView = new BehaviorSubject<boolean>(false);
  aria: Aria | null = null;
  header: AriaHeader | null = null;
  controls: AriaControls | null = null;
  gameScore: AriaScore | null = null;
  status: AriaStatus | null = null;
  board: CanvasChessBoard | null = null;
  preferredLayout: Layout = 'auto';
  doNotUse: number[] = [];
  preferredRatioLandscape = .75;
  preferredRatioPortrait = 0.46;
  layoutDirection = LayoutDirection.LeftToRight;
  gameScoreElement: HTMLElement | null = null;
  boardElement: HTMLElement | null = null;
  controlsElement: HTMLElement | null = null;
  statusElement: HTMLElement | null = null;
  headerElement: HTMLElement | null = null;
  public enableHeader = true;
  public enableScore = true;
  public enableControls = true;
  public enableStatus = true;
  state: number = 3;
  constructor() { }

  public settings(): object {
    let settings = {};
    return settings;
  }

  public setSettings(settings: object) {
    //@ts-ignore
    if(settings.header) {
      //@ts-ignore
      this.enableHeader = settings.header as boolean;
    }
    //@ts-ignore
    if(settings.controls) {
      //@ts-ignore
      this.enableControls = settings.controls as boolean;
    }
    //@ts-ignore
    if(settings.score) {
      //@ts-ignore
      this.enableScore = settings.score as boolean;
    }
    //@ts-ignore
    if(settings.status) {
      //@ts-ignore
      this.enableStatus = settings.status as boolean;
    }
    //@ts-ignore
    if(settings.state) {
      //@ts-ignore
      this.state = settings.state;
    }
    //@ts-ignore
    if(settings.layoutDirection) {
      //@ts-ignore
      this.layoutDirection = settings.layoutDirection as LayoutDirection;
    }
    //@ts-ignore
    if(settings.ratioLandscape) {
      //@ts-ignore
      this.preferredRatioLandscape = settings.ratioLandscape;
    }
    //@ts-ignore
    if(settings.ratioPortrait) {
      //@ts-ignore
      this.preferredRatioPortrait = settings.ratioPortrait;
    }
    //@ts-ignore
    if(settings.preferredLayout) {
      //@ts-ignore
      this.preferredLayout = settings.preferredLayout;
    }
  }

  private rtl(width: number, height: number) {
    let boardWidth = Math.floor(width * this.preferredRatioLandscape);
    
    boardWidth = this.board?.setSize(boardWidth);
    boardWidth = boardWidth > (height - 2) ? height-2 : boardWidth;
    boardWidth = boardWidth < 192 ? 192 : boardWidth;
    boardWidth = this.board?.setSize(boardWidth);
    let c2width = width - (boardWidth + 16);
    
    if (c2width < 300) {
      let diff = 300 - c2width;
      c2width = 300;
      boardWidth -= diff;
    }
    let hheight = height - 153;
    const state = c2width > 586 ? 3 : 4;
    if(state != this.state) {
      this.state = state;
      window.setTimeout(()=>{this.rtl(width, height);}, 20);
      return;
    }
    this.header?.resize(c2width, hheight);
    if (this.boardElement) {
      this.boardElement.style.marginBottom = '0px';
      switch (this.state) {
        case 3: { // landscape full
          if(this.headerElement){
            this.headerElement.style.maxHeight = hheight + 'px';
            this.headerElement.style.height = hheight + 'px';
            this.headerElement.style.width = c2width + 'px';
            this.headerElement.style.right = '0px';
            this.headerElement.style.left = '';
            this.header?.resize(c2width, hheight);
          }
          if (this.layoutDirection) { // RTL
            this.boardElement.style.left = '2px';
            this.boardElement.style.right = '';
          } else {
            this.boardElement.style.right = '2px';
            this.boardElement.style.left = '';
          }
          this.boardElement.style.top = '2px';
          break;
        }
        case 4: {
          this.headerElement.style.maxHeight = hheight + 'px';
          this.headerElement.style.height = hheight + 'px';
          this.headerElement.style.width = c2width + 'px';
          this.headerElement.style.right = '0px';
          this.headerElement.style.left = '';
          this.header?.resize(c2width, hheight);
          if (this.layoutDirection) { // RTL
            this.boardElement.style.left = '2px';
            this.boardElement.style.right = '';
          } else {
            this.boardElement.style.right = '2px';
            this.boardElement.style.left = '';
          }
          this.boardElement.style.top = '2px';       
          break;
        }
      }
      if(this.statusElement){
        this.statusElement.style.width = (c2width - 4) + 'px';
        this.status?.resize(c2width, 32);
      }
      if(this.controlsElement){
        this.controlsElement.style.width = c2width + 'px';
        this.controls?.resize(c2width, 100);
      }
      boardWidth = this.board?.setSize(boardWidth);
      this.boardElement.style.width = boardWidth + 'px';
      this.boardElement.style.height = boardWidth + 'px';
      this.sendLayoutChanged(width, height, this.state);
    }else {
      window.setTimeout(()=>{this.rtl(width, height);}, 20);
    }
  }

  public layoutChanged(width: number, height:number, state: number)
  {}
  public sendLayoutChanged(width:number, height:number, state: number): void {
    switch(state) {
      case 1:{ height = Math.max(document.body.clientHeight, document.documentElement.clientHeight, height); break;}
      case 2:{
        height = Math.max(document.body.clientHeight, document.documentElement.clientHeight, height);
        height = Math.min(document.body.scrollHeight, document.documentElement.scrollHeight,document.body.offsetHeight, document.documentElement.offsetHeight, height);
        break;
      }
      default:{
        height = Math.max(Math.min(window.innerHeight, document.body.clientHeight, document.documentElement.clientHeight,document.body.scrollHeight, document.documentElement.scrollHeight,document.body.offsetHeight,
          document.documentElement.offsetHeight), height);
        break;}
    }
    this.layoutChanged(width,height,state);
  }

  private rtp(width: number, height: number) { 
    width = width < 320 ? 320:width;
    let boardWidth = this.board?.setSize(Math.floor(width * this.preferredRatioPortrait));
    if(boardWidth < 96) {
      boardWidth = 96;
      this.preferredRatioPortrait = (96/width);
    }
    let state = width < 460 ? 1:((width - boardWidth) >= 230 ? 2:1);
    // States have minimum sizes
    /****************************
     *  - State 1 - Complete Portrait 
     *  Minimum width is 340 
     *  Minimum height is 740
     *  - State 2 SBS Portrait 
     *  Minimum width is 530 
     *  Minimum Height is 620  
     * */
    if(state != this.state) {
      this.state = state;
      window.setTimeout(()=>{this.rtp(width, height)}, 20);
      return;
    }
    boardWidth = this.board?.setSize(boardWidth);
    this.boardElement.style.width = boardWidth + 'px';
    this.boardElement.style.height = boardWidth + 'px';
    if (this.boardElement) {
      this.boardElement.style.marginBottom = '2px';      
      if(this.gameScoreElement){        
        this.gameScoreElement.style.right = '';
        this.gameScoreElement.style.left = '';
        this.gameScoreElement.style.top = '';
      }
      switch (this.state) {
        case 1: {
          height = height < 610 ? 610: height;
          const margin = (Math.floor(width - boardWidth)/2)-2;      
          if (this.layoutDirection) { // RTL
            this.boardElement.style.marginLeft =  margin + 'px';
          } else {
            this.boardElement.style.marginRight = margin + 'px';
          }      
          if(this.gameScoreElement){  
            this.gameScoreElement.style.maxWidth = '';
            this.gameScoreElement.style.width = '100%';
            this.gameScoreElement.style.height = 'auto';
            this.gameScore?.resize(width, -1);
          }
          break;
        }
        case 2: {
          height = height < 580 ? 580: height; 
          this.boardElement.style.marginLeft = '';
          if(this.gameScoreElement){         
            const gsWidth = Math.floor(width - boardWidth) - 12;
            const margin = (width - (boardWidth + gsWidth))/4 + 'px';
            if (this.layoutDirection) { // RTL
              this.boardElement.style.order = '0';
              this.gameScoreElement.style.order = '1';
              this.gameScoreElement.style.marginLeft = margin; 
              this.boardElement.style.marginLeft = margin; 
            } else {
              this.boardElement.style.order = '1';
              this.gameScoreElement.style.order = '0'; 
              this.gameScoreElement.style.marginRight = margin;
              this.boardElement.style.marginRight = margin; 
            }
            this.gameScoreElement.style.height = (boardWidth + 4) +  'px';
            this.gameScoreElement.style.maxHeight = (boardWidth + 4) + 'px';
            this.gameScoreElement.style.width = gsWidth + 'px';
            this.gameScoreElement.style.maxWidth = gsWidth + 'px';   
            this.gameScore?.resize(gsWidth, boardWidth + 4);
          } else {
            this.boardElement.style.order = '0';
          }
          break;
        }
      }
      if(this.statusElement){
        this.statusElement.style.bottom = '';
        this.statusElement.style.top = '';
        this.statusElement.style.height = '32px';
        this.statusElement.style.left = '';
        this.statusElement.style.right = '';
        this.statusElement.style.width = (width - 4) + 'px';
        this.status?.resize(width, 32);
      }
      if(this.controlsElement){
        this.controlsElement.style.right = ''
        this.controlsElement.style.width = width + 'px';
        this.controlsElement.style.top = '';
        this.controlsElement.style.bottom = ''; 
        this.controlsElement.style.left = '';
        this.controls?.resize(width, 100);
      }

      if(this.headerElement){
        this.header?.resize(width, -1);
      }
      this.sendLayoutChanged(width, height, this.state);
    }else {
      window.setTimeout(()=>{this.rtp(width, height);}, 20);
    }
  }

 
  initializeLayout(aria: Aria): void {
    this.aria = aria;
    this.board = aria.canvasBoardComponent;
  }

  resizeLayout(width: number, height: number): void {
    const landscape = (width >= height);
    this.landscapeOrientation.next(landscape);
    switch (this.preferredLayout) {
      case 'auto': {
        if (landscape) {
          this.rtl(width, height);
        } else {
          this.rtp(width, height);
        }
        break;
      }
      case 'landscape': {
        this.rtl(width, height);
        break;
      }
      case 'portrait': {
        this.rtp(width, height);
        break;
      }
    }    
  }


  public shrink() {
    if (this.landscapeOrientation.value) {
      this.preferredRatioLandscape -= .02;
      if (this.preferredRatioLandscape < .02) {
        this.preferredRatioLandscape = .02;
      }
    } else {
      this.preferredRatioPortrait -= .02;
      if (this.preferredRatioPortrait < .02) {
        this.preferredRatioPortrait = .02;
      }
    }
    this.resizeLayout(window.innerWidth, window.innerHeight);
  }

  public grow() {
    if (this.landscapeOrientation.value) {
      this.preferredRatioLandscape += .02;
      if (this.preferredRatioLandscape > 1) {
        this.preferredRatioLandscape = 1;
      }
    } else {
        this.preferredRatioPortrait += .02;
        if(this.preferredRatioPortrait > 1) {
          this.preferredRatioPortrait = 1;
        }
    }    
    this.resizeLayout(window.innerWidth, window.innerHeight);
  }
}
