import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Aria } from '../app.component';
import { AriaHeader } from '../aria-header/aria-header.component';
import { AriaScore } from '../aria-score/aria-score.component';
import { CanvasChessBoard } from '../canvas-chessboard/canvas-chessboard.component';
import { AriaControls } from '../aria-controls/aria-controls.component';
import { AriaStatus } from '../aria-status/aria-status.component';

export declare type Layout = 'auto' | 'landscape' | 'portrait';
function debounce(func: any, wait: number) {
  let timeout = -1;

  return function executedFunction(...args: any) {
    const later = () => {
      timeout = -1;
      func(...args);
    };
    clearTimeout(timeout);
    timeout = setTimeout(later, wait);
  };
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
  resizeElement: HTMLElement | null = null;
  preferredLayout: Layout = 'auto';
  doNotUse: number[] = [];
  preferredRatioLandscape = .75;
  preferredRatioPortrait = 0.46;
  preferredWidthPercentage = 1.0;
  preferredHeightPercentage = 1.0
  layoutDirection = true;
  gameScoreElement: HTMLElement | null = null;
  boardElement: HTMLElement | null = null;
  controlsElement: HTMLElement | null = null;
  statusElement: HTMLElement | null = null;
  headerElement: HTMLElement | null = null;
  state: number = 3;
  constructor() { }

  public settings(): object {
    let settings = {};
    return settings;
  }

  private rtl(width: number, height: number) {
    let boardWidth = Math.ceil(width * this.preferredRatioLandscape);
    boardWidth = boardWidth > (height - 2) ? height-2 : boardWidth;
    boardWidth = boardWidth < 192 ? 192 : boardWidth;
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
      window.setTimeout(()=>{this.rtl(width, height)}, 20);
      return;
    }
    this.header?.resize(c2width, hheight);
    this.board?.setSize(boardWidth);
    this.board?.requestRedraw();
    if (this.boardElement && this.headerElement && this.statusElement && this.controlsElement) {
      this.boardElement.style.marginBottom = '0px';
      switch (this.state) {
        case 3: { // landscape full
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
      this.statusElement.style.width = (c2width - 4) + 'px';
      this.status?.resize(c2width, 32);
      this.controlsElement.style.width = c2width + 'px';
      this.controls?.resize(c2width, 100);
      this.board?.setSize(boardWidth);
      this.boardElement.style.width = boardWidth + 'px';
      this.boardElement.style.height = boardWidth + 'px';
      this.aria.sendLayoutChanged(this.state);
    }else {
      window.setTimeout(()=>{this.rtl(width, height);}, 100);
    }
  }

  private rtp(width: number, height: number) { 
    width = width < 320 ? 320:width;
    let boardWidth = Math.floor(width * this.preferredRatioPortrait);
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
    if (this.boardElement && this.gameScoreElement && this.headerElement && this.statusElement && this.controlsElement) {
      this.boardElement.style.marginBottom = '2px';
      this.gameScoreElement.style.right = '';
      this.gameScoreElement.style.left = '';
      this.gameScoreElement.style.top = '';
      switch (this.state) {
        case 1: {
          height = height < 610 ? 610: height;       
          if (this.layoutDirection) { // RTL
            this.boardElement.style.marginLeft = (width - boardWidth)/2 + 'px';
          } else {
            this.boardElement.style.marginRight = (width - boardWidth)/2 + 'px';
          }
          this.gameScoreElement.style.maxWidth = '';
          this.gameScoreElement.style.width = '100%';
          this.gameScoreElement.style.height = 'auto';
          this.gameScore?.resize(width, -1);
          break;
        }
        case 2: {
          height = height < 580 ? 580: height; 
          this.boardElement.style.marginLeft = '';       
          if (this.layoutDirection) { // RTL
            this.boardElement.style.order = '0';
            this.gameScoreElement.style.order = '1'; 
          } else {
            this.boardElement.style.order = '1';
            this.gameScoreElement.style.order = '0'; 
          }
          const gsWidth = Math.floor(width - (6 +  boardWidth));   
          this.gameScoreElement.style.height = boardWidth + 'px';
          this.gameScoreElement.style.width = gsWidth + 'px';
          this.gameScoreElement.style.maxWidth = gsWidth + 'px';   
          this.gameScore?.resize(gsWidth, boardWidth);
          break;
        }
      }
      this.statusElement.style.bottom = '';
      this.statusElement.style.top = '';
      this.statusElement.style.height = '32px';
      this.statusElement.style.left = '';
      this.statusElement.style.right = '';
      this.statusElement.style.width = (width - 4) + 'px';
      this.status?.resize(width, 32);
      this.controlsElement.style.right = ''
      this.controlsElement.style.width = width + 'px';
      this.controlsElement.style.top = '';
      this.controlsElement.style.bottom = ''; 
      this.controlsElement.style.left = '';
      this.controls?.resize(width, 100);
      this.board?.setSize(boardWidth);
      this.boardElement.style.width = boardWidth + 'px';
      this.boardElement.style.height = boardWidth + 'px';
      this.header?.resize(width, -1);
      this.aria.sendLayoutChanged(this.state);
    }else {
      window.setTimeout(()=>{this.rtp(width, height);}, 100);
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
      if (this.preferredRatioLandscape < .1) {
        this.preferredRatioLandscape = .1;
      }
    } else {
      this.preferredRatioPortrait -= .02;
      if (this.preferredRatioPortrait < .1) {
        this.preferredRatioPortrait = .1;
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
