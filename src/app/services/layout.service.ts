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
  boardRatio = 0.75;
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
  state: number = 2;
  constructor() { }

  public settings(): object {
    let settings = {};
    return settings;
  }

  public setSettings(settings: object) {
    //@ts-ignore
    if(settings.header != undefined) {
      //@ts-ignore
      this.enableHeader = settings.header as boolean;
    }
    //@ts-ignore
    if(settings.controls != undefined) {
      //@ts-ignore
      this.enableControls = settings.controls as boolean;
    }
    //@ts-ignore
    if(settings.score != undefined) {
      //@ts-ignore
      this.enableScore = settings.score as boolean;
    }
    //@ts-ignore
    if(settings.status != undefined) {
      //@ts-ignore
      this.enableStatus = settings.status as boolean;
    }
    //@ts-ignore
    if(settings.state) {
      //@ts-ignore
      this.state = settings.state;
    }
    //@ts-ignore
    if(settings.layoutDirection != undefined) {
      //@ts-ignore
      this.layoutDirection = settings.layoutDirection as LayoutDirection;
    }
    //@ts-ignore
    if(settings.boardRatio != undefined) {
      //@ts-ignore
      this.boardRatio = settings.boardRatio;
    }
    //@ts-ignore
    if(settings.preferredLayout) {
      //@ts-ignore
      this.preferredLayout = settings.preferredLayout;
    }
    window.setTimeout(
      ()=>{
      this.resizeLayout(window.innerWidth, window.innerHeight);
    },100);
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

  private state2(width: number, height: number) {
    width = width < 320 ? 320:width;
    let boardWidth = this.board?.setSize(Math.floor(width * this.boardRatio));
    if(boardWidth < 96) {
      boardWidth = 96;
      this.boardRatio = (96/width);
    }
    let state = 2;
    if(this.preferredLayout[0] == 'a' && (width - boardWidth) < 180){
      state = 1;
    }
    if(state != this.state) {
        this.state = state;
        window.setTimeout(()=>{this.resizeLayout(width, height)}, 10);   
      return;
    }
    this.boardElement.style.width = boardWidth + 'px';
    this.boardElement.style.maxWidth = boardWidth + 'px';
    this.boardElement.style.height = boardWidth + 'px';
    this.boardElement.style.maxHeight = boardWidth + 'px';
    if (this.boardElement) {
      this.boardElement.style.marginBottom = '2px';      
      if(this.gameScoreElement){        
        this.gameScoreElement.style.right = '';
        this.gameScoreElement.style.left = '';
        this.gameScoreElement.style.top = '';
      }
      height = height < 580 ? 580: height; 
      if(this.gameScoreElement){         
        const gsWidth = Math.floor(width - boardWidth) - 20;
        if (this.layoutDirection) { // LTR
          this.boardElement.style.order = '0';
          this.gameScoreElement.style.order = '1'; 
          this.boardElement.style.marginLeft = '2px';
          this.boardElement.style.marginRight = '2px';
          this.gameScoreElement.style.marginRight = '0px';
          this.gameScoreElement.style.marginLeft = '4px';
        } else {
          this.boardElement.style.order = '1';
          this.gameScoreElement.style.order = '0'; 
          this.gameScoreElement.style.marginLeft = '0px';
          this.gameScoreElement.style.marginRight = '0px';
          this.boardElement.style.marginLeft = '0px';
          this.boardElement.style.marginRight = '2px';
        }
        this.gameScoreElement.style.height = (boardWidth + 4) +  'px';
        this.gameScoreElement.style.maxHeight = (boardWidth + 4) + 'px';
        this.gameScoreElement.style.width = 'auto';  
        this.gameScore?.resize(gsWidth, boardWidth + 4);
      } else {
        this.boardElement.style.order = '0';
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
      window.setTimeout(()=>{this.resizeLayout(width, height);}, 20);
    }
  }

  private state1(width: number, height: number) { 
    width = width < 320 ? 320:width;
    let boardWidth = Math.floor(width * this.boardRatio);
    if(boardWidth < 96) {
      boardWidth = 96;
      this.boardRatio = (96/width);
    }
    let state = 1;
    if(this.preferredLayout[0] == 'a') {
      if(width - boardWidth > 200){
        state = 2;
      }
    }
    if(state != this.state) {
      this.state = state;
      window.setTimeout(()=>{this.resizeLayout(width, height)}, 10);  
      return;
    }
    boardWidth = this.board?.setSize(boardWidth);
    this.boardElement.style.width = boardWidth + 'px';
    this.boardElement.style.height = boardWidth + 'px';
    if (this.boardElement) {
      this.boardElement.style.marginBottom = '2px';
      height = height < 610 ? 610: height;
      const margin = (Math.floor(width - boardWidth)/2)-2;
      this.boardElement.style.marginLeft =  margin + 'px';
      this.boardElement.style.marginRight = margin + 'px';
      if(this.gameScoreElement){  
        this.gameScoreElement.style.maxWidth = '';
        this.gameScoreElement.style.width = '100%';
        this.gameScoreElement.style.height = 'auto';
        this.gameScoreElement.style.marginRight = '0px';
        this.gameScoreElement.style.marginLeft = '0px';
        this.gameScoreElement.style.height = 'auto';
        this.gameScore?.resize(width, -1);
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
      this.board?.setSize(boardWidth);
      this.sendLayoutChanged(width, height, this.state);
    }else {
      window.setTimeout(()=>{this.resizeLayout(width, height);}, 20);
    }
  }

 
  initializeLayout(aria: Aria): void {
    this.aria = aria;
    this.board = aria.canvasBoardComponent;
  }

  resizeLayout(width: number, height: number): void {
    switch (this.preferredLayout[0]) {
      case 'l': {
        this.state2(width, height);
        break;
      }
      case 'p': {
        this.state1(width, height);
        break;
      }
      default: {
        let state = 1;
        if(width - Math.floor(this.boardRatio * width) >= 180){
          state = 2;
        }
        if (state == 2) {
          this.state2(width, height);
        } else {
          this.state1(width, height);
        }
        break;
      }
    }    
  }


  public shrink() {
    this.boardRatio -= .02;
    if (this.boardRatio * innerWidth <= 96) {
      this.boardRatio = (96/innerWidth);
    }    
    this.resizeLayout(innerWidth, innerHeight);
  }

  public grow() {
    this.boardRatio += .02;
    if (innerWidth - (this.boardRatio * innerWidth) < 180) {
      this.boardRatio = (innerWidth - 180)/innerWidth;
    }
    this.resizeLayout(innerWidth, innerHeight);
  }
}
