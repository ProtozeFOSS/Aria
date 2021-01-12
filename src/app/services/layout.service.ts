import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Aria } from '../app.component';
import { AriaHeader } from '../aria-header/aria-header.component';
import { AriaScore } from '../aria-score/aria-score.component';
import { CanvasChessBoard } from '../canvas-chessboard/canvas-chessboard.component';
import { AriaControls } from '../aria-controls/aria-controls.component';
import { Renderer2 } from '@angular/core';
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



  // protected resizeEvent(entries: readonly ResizeObserverEntry[]) {
  //   const resume = this.controlsComponent?.pauseIfAutoPlay();
  //   // @ts-ignore
  //   const boundingRect = entries[0].contentRect as DOMRectReadOnly;
  //   if (!this.appContainer) {
  //     console.log('Invalid (Null) App Container %$@');
  //   } else {
  //     let height = boundingRect.height;
  //     if (boundingRect.width === height) {
  //       height - 2;
  //     }
  //     const landscape = (boundingRect.width > height);
  //     this.landscapeOrientation.next(landscape);
  //     switch (this.preferredLayout) {
  //       case 'auto': {
  //         if (landscape) {
  //           this.rtl(boundingRect.width, height);
  //         } else {
  //           this.rtp(boundingRect.width, height);
  //         }
  //         break;
  //       }
  //       case 'landscape': {
  //         this.rtl(boundingRect.width, height);
  //         break;
  //       }
  //       case 'portrait': {
  //         this.rtp(boundingRect.width, height);
  //         break;
  //       }
  //     }
  //   }
  //   if (resume) {
  //     this.controlsComponent?.toggleAutoPlay();
  //   }
  // }




  public attachHeader(header: AriaHeader) {
    this.header = header;
  }

  public attachScore(gs: AriaScore) {
    this.gameScore = gs;
  }

  private rtl(width: number, height: number) {
    let boardWidth = (width * this.preferredRatioLandscape);
    boardWidth = boardWidth > height ? height : boardWidth;
    boardWidth = boardWidth < 192 ? 192 : boardWidth;
    let c2width = width - (boardWidth + 4);
    if (c2width < 300) {
      let diff = 300 - c2width;
      c2width = 300;
      boardWidth -= diff;
    }
    let hheight = height - 153;
    this.state = c2width > 586 ? 3 : 4;
    this.header?.resize(c2width, hheight);
    this.controls?.resize(c2width, 64);
    this.board?.setSize(boardWidth);
    this.board.requestRedraw();
    if (this.boardElement && this.gameScoreElement && this.headerElement && this.statusElement && this.controlsElement) {
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
          this.controlsElement.style.width = c2width + 'px';
          this.controlsElement.style.top = hheight + 'px';
          this.controlsElement.style.right = '0px';
          this.controlsElement.style.left = '';
          //this.gameScore?.resize(c2width, 456);
          this.statusElement.style.bottom = '0px';
          this.statusElement.style.height = '32px';
          this.statusElement.style.right = '2px';
          this.statusElement.style.left = '';
          this.statusElement.style.top = '';
          this.statusElement.style.width = c2width - 2 + 'px';
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
          this.controlsElement.style.width = c2width + 'px';
          this.controlsElement.style.top = hheight + 'px';
          this.controlsElement.style.right = '0px';
          this.controlsElement.style.left = '';
          // this.gameScoreElement.style.right = '2px';
          // this.gameScoreElement.style.width = c2width - 24 + 'px';
          // this.gameScoreElement.style.height = '456px';
          // this.gameScoreElement.style.top = '340px';
          // this.gameScoreElement.style.left = '';
          //this.gameScore?.resize(c2width, 456);
          this.statusElement.style.bottom = '0px';
          this.statusElement.style.height = '32px';
          this.statusElement.style.right = '2px';
          this.statusElement.style.left = '';
          this.statusElement.style.top = '';
          this.statusElement.style.width = c2width - 2 + 'px';
          break;
        }
      }
    }
  }

  private rtp(width: number, height: number) {
    let boardWidth = Math.floor(width * this.preferredRatioPortrait);
    boardWidth = boardWidth < 192 ? 192 : boardWidth; // board minimum size 192
    this.state = width <= 480 ? 1:((width - boardWidth) >= 264 ? 2:1);
    if (this.boardElement && this.gameScoreElement && this.headerElement && this.statusElement && this.controlsElement) {
      this.boardElement.style.marginBottom = '2px';
      switch (this.state) {
        case 1: {         
          if (this.layoutDirection) { // RTL
            this.boardElement.style.marginLeft = (width - boardWidth)/2 + 'px';
          } else {
            this.boardElement.style.marginRight = (width - boardWidth)/2 + 'px';
          }
          this.boardElement.style.order = '0';
          this.gameScoreElement.style.order = '2';
          this.gameScoreElement.style.right = '';
          this.gameScoreElement.style.width = width + 'px';
          this.gameScoreElement.style.height = 'auto';
          this.gameScoreElement.style.top = '';
          this.gameScoreElement.style.left = '';
          this.gameScore?.resize(width, -1);
          break;
        }
        case 2: {
          this.boardElement.style.marginLeft = '';
          this.gameScoreElement.style.right = '';
          this.gameScoreElement.style.top = '';
          this.gameScoreElement.style.left = '';         
          if (this.layoutDirection) { // RTL
            this.boardElement.style.order = '0';
            this.gameScoreElement.style.order = '1'; 
          } else {
            this.boardElement.style.order = '1';
            this.gameScoreElement.style.order = '0'; 
          }
          const gsWidth = (width - (20 +  boardWidth));        
          this.gameScore?.resize(gsWidth, boardWidth);
          this.gameScoreElement.style.height = boardWidth + 'px';
          this.gameScoreElement.style.width = gsWidth + 'px';
          break;
        }
      }
      this.statusElement.style.bottom = '';
      this.statusElement.style.top = '';
      this.statusElement.style.height = '32px';
      this.statusElement.style.left = '';
      this.statusElement.style.right = '';
      this.statusElement.style.width = (width - 4) + 'px';
      this.status?.resize(width, 99);
      this.controlsElement.style.right = ''
      this.controlsElement.style.width = width + 'px';
      this.controlsElement.style.top = '';
      this.controlsElement.style.bottom = ''; 
      this.controlsElement.style.left = '';
      this.controlsElement.style.height = '99px';
      this.controls?.resize(width, 99);
      this.board?.setSize(boardWidth);
      this.boardElement.style.width = boardWidth + 'px';
      this.boardElement.style.height = boardWidth + 'px';
      this.header?.resize(width, -1);
    }else {
      window.setTimeout(()=>{this.rtp(width, height);}, 100);
    }
  }

  public openSettings(): void {
    // if (this.menuComponent) {
    //   this.menuComponent.open();
    // }
    // move to sending open signal to parent page if menu does not exist
  }

  public closeSettings(): void {
    // if (this.menuComponent) {
    //   this.menuComponent.close();
    // }
  }

  initializeLayout(aria: Aria): void {
    this.aria = aria;
    this.board = aria.canvasBoardComponent;
  }

  // onSliderTouch(event: TouchEvent): void {
  //   if (
  //     event.touches.length > 0 &&
  //     this.landscapeOrientation.value &&
  //     event &&
  //     event.touches[0].clientX > 64
  //   ) {
  //     if (this.aria && this.appContainer) {
  //       let gsSize = window.innerWidth - event.touches[0].clientX;
  //       const width = window.innerWidth
  //         || document.documentElement.clientWidth
  //         || document.body.clientWidth;

  //       const height = window.innerHeight
  //         || document.documentElement.clientHeight
  //         || document.body.clientHeight;

  //       switch (this.preferredLayout) {
  //         case 'auto': {
  //           if (width > height) {
  //             this.resizeToLandscape(width, height, gsSize);
  //           } else {
  //             this.resizeToPortrait(width, height, gsSize);
  //           }
  //           break;
  //         }
  //         case 'landscape': {
  //           this.resizeToLandscape(width, height, gsSize);
  //           break;
  //         }
  //         case 'portrait': {
  //           this.resizeToPortrait(width, height, gsSize);
  //           break;
  //         }
  //       }
  //     }
  //   } else {
  //     if (
  //       !this.landscapeOrientation.value &&
  //       event &&
  //       event.touches[0].clientY > 64
  //     ) {
  //       if (this.aria && this.appContainer) {
  //         let gsSize = window.innerHeight - event.touches[0].clientY;
  //         const width = window.innerWidth
  //           || document.documentElement.clientWidth
  //           || document.body.clientWidth;

  //         const height = window.innerHeight
  //           || document.documentElement.clientHeight
  //           || document.body.clientHeight;
  //         switch (this.preferredLayout) {
  //           case 'auto': {
  //             if (width > height) {
  //               this.resizeToLandscape(width, height, gsSize);
  //             } else {
  //               this.resizeToPortrait(width, height, gsSize);
  //             }
  //             break;
  //           }
  //           case 'landscape': {
  //             this.resizeToLandscape(width, height, gsSize);
  //             break;
  //           }
  //           case 'portrait': {
  //             this.resizeToPortrait(width, height, gsSize);
  //             break;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

  // onSliderDrag(event: DragEvent): void {
  //   if (this.landscapeOrientation.value && event && event.clientX > 64) {
  //     if (this.aria && this.appContainer) {
  //       let gsSize = window.innerWidth - event.clientX;
  //       const width = window.innerWidth
  //         || document.documentElement.clientWidth
  //         || document.body.clientWidth;

  //       const height = window.innerHeight
  //         || document.documentElement.clientHeight
  //         || document.body.clientHeight;

  //       switch (this.preferredLayout) {
  //         case 'auto': {
  //           if (width > height) {
  //             this.resizeToLandscape(width, height, gsSize);
  //           } else {
  //             this.resizeToPortrait(width, height, gsSize);
  //           }
  //           break;
  //         }
  //         case 'landscape': {
  //           this.resizeToLandscape(width, height, gsSize);
  //           break;
  //         }
  //         case 'portrait': {
  //           this.resizeToPortrait(width, height, gsSize);
  //           break;
  //         }
  //       }
  //     }
  //   } else {
  //     if (!this.landscapeOrientation && event && event.clientY > 64) {
  //       if (this.aria && this.appContainer) {
  //         let gsSize = window.innerHeight - event.clientY;
  //         const width = window.innerWidth
  //           || document.documentElement.clientWidth
  //           || document.body.clientWidth;

  //         const height = window.innerHeight
  //           || document.documentElement.clientHeight
  //           || document.body.clientHeight;
  //         switch (this.preferredLayout) {
  //           case 'auto': {
  //             if (width > height) {
  //               this.resizeToLandscape(width, height, gsSize);
  //             } else {
  //               this.resizeToPortrait(width, height, gsSize);
  //             }
  //             break;
  //           }
  //           case 'landscape': {
  //             this.resizeToLandscape(width, height, gsSize);
  //             break;
  //           }
  //           case 'portrait': {
  //             this.resizeToPortrait(width, height, gsSize);
  //             break;
  //           }
  //         }
  //       }
  //     }
  //   }
  // }

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
      if (this.preferredRatioLandscape >= .2) {
        this.preferredRatioLandscape -= .02;
        this.resizeLayout(window.innerWidth, window.innerHeight);
      }
    } else {
      if (this.preferredRatioPortrait >= .3) {
        this.preferredRatioPortrait -= .02;
      }
    }
    this.resizeLayout(window.innerWidth, window.innerHeight);
  }

  public grow() {
    if (this.landscapeOrientation.value) {
      if (this.preferredRatioLandscape <= .98) {
        this.preferredRatioLandscape += .02;
      }
    } else {
      if (this.preferredRatioPortrait <= .98) {
        this.preferredRatioPortrait += .02;
      }
    }    
    this.resizeLayout(window.innerWidth, window.innerHeight);
  }
}
