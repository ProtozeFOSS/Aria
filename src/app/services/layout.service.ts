import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Olga } from '../app.component';
import { GamescoreUxComponent } from '../game-score/game-score.ux';
import { CanvasChessBoard } from '../canvas-chessboard/canvas-chessboard.component';


export declare type Layout = 'auto' | 'landscape' | 'portrait';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly landscapeOrientation = new BehaviorSubject<boolean>(true);
  readonly boardSize = new BehaviorSubject<number>(480);
  readonly scoreSize = new BehaviorSubject<number>(340);
  olga: Olga | null = null;
  appContainer: ElementRef | null = null;
  gameScore: GamescoreUxComponent | null = null;
  board: CanvasChessBoard | null = null;
  resizeElement: HTMLElement | null = null;
  preferredLayout: Layout = 'auto';
  preferredRatio = .3;
  boardRatio = 1;
  constructor() { }
  private resizeToLandscape(width: number, height: number, gsSize?: number) {
    if (this.olga && this.olga.gameScoreElement && this.olga.controlsElement) {
      let boardSize = 0;
      if (this.resizeElement) {
        this.resizeElement.style.left = "-2px";
        this.resizeElement.style.top = "calc(50% - 3em)";
        this.resizeElement.style.width = "1.2em";
        this.resizeElement.style.height = "6em";
      }
      if (!gsSize) {
        let padding = width * 0.05;
        if (padding >= 16 || padding <= 10) {
          padding = 12;
        }
        let boardSize = Math.floor((1 - this.preferredRatio) * width);
        if (boardSize > height) {
          boardSize = height - (padding / 2);
        }
        let gsWidth = (width - boardSize) - padding;
        this.board?.setSize(boardSize);
        let gsHeight = (boardSize - 200);
        // game score
        this.olga.gameScoreElement.style.top = '60px'; // 64 represents the controls ux
        this.olga.gameScoreElement.style.width = gsWidth + 'px';
        this.olga.gameScoreElement.style.height = gsHeight + 'px';
        // controls
        this.olga.controlsElement.style.left = '';
        this.olga.controlsElement.style.top = (gsHeight + 51).toString() + 'px'; // 64 represents the 
        this.olga.controlsElement.style.width = gsWidth.toString() + 'px';
        this.olga.controlsElement.style.height = 64 + 'px';
        this.olga.controlsElement.style.right = '1px';
        this.scoreSize.next(gsWidth);
      } else {
        let padding = width * 0.05;
        if (padding >= 16 || padding <= 10) {
          padding = 12;
        }
        const widthAvailable = window.innerWidth - (gsSize + padding);
        let boardSize = Math.floor(widthAvailable / 8) * 8;
        if (boardSize >= window.innerHeight) {
          boardSize = Math.floor((window.innerHeight - 16) / 8) * 8;
          gsSize = window.innerWidth - boardSize + padding;
        }
        this.board?.setSize(boardSize);
        let gsHeight = (boardSize - 200);
        // game score
        this.olga.gameScoreElement.style.top = '60px'; // 64 represents the controls ux
        this.olga.gameScoreElement.style.width = gsSize + 'px';
        this.olga.gameScoreElement.style.height = gsHeight + 'px';
        // controls
        this.olga.controlsElement.style.left = '';
        this.olga.controlsElement.style.top = (gsHeight + 51).toString() + 'px'; // 64 represents the 
        this.olga.controlsElement.style.width = gsSize.toString() + 'px';
        this.olga.controlsElement.style.height = 64 + 'px';
        this.olga.controlsElement.style.right = '1px';
        this.scoreSize.next(gsSize);
      }
      this.boardSize.next(boardSize);
    }
  }
  private resizeToPortrait(width: number, height: number, gsSize?: number) {
    if (this.olga) {
      const boardSize = (width * this.boardRatio) - 6;
      this.board?.setSize(boardSize);
      if (this.olga.boardElement) {
        this.olga.boardElement.style.left = (width * ((1 - this.boardRatio) / 2)) + 'px';
      }
      if (this.olga.gameScoreElement) {
        this.olga.gameScoreElement.style.top = (boardSize + 74 + 'px'); // 64 represents the controls ux
        this.olga.gameScoreElement.style.width = '100%';
        this.olga.gameScoreElement.style.height = (boardSize / 3 > 425 ? 425 : boardSize / 3).toString() + 'px';
      }
      if (this.olga.controlsElement) {
        this.olga.controlsElement.style.top = (boardSize + 2).toString() + 'px'; // 64 represents the controls ux
        this.olga.controlsElement.style.width = '80%';
        this.olga.controlsElement.style.left = '10%';
        this.olga.controlsElement.style.height = '64px';
      }
      if (this.resizeElement) {
        this.resizeElement.style.left = "calc(50% - 3em)";
        this.resizeElement.style.top = "-4px";
        this.resizeElement.style.width = "6em";
        this.resizeElement.style.height = "1.2em";
      }
    }
  }
  initializeLayout(olga: Olga, autoResize = true): void {
    this.olga = olga;
    this.gameScore = olga.gameScoreComponent;
    this.board = olga.canvasBoardComponent;
    this.appContainer = olga.appContainer;
    if (autoResize) {
      window.removeEventListener('resize', this.resizeLayout.bind(this));
      window.addEventListener('resize', this.resizeLayout.bind(this));
    }
    this.resizeLayout()
    window.setTimeout(() => {
      this.resizeLayout();
    }, 250);
  }

  onSliderTouch(event: TouchEvent): void {
    if (event.touches.length > 0 && this.landscapeOrientation && event && event.touches[0].clientX > 64) {
      if (this.olga && this.appContainer) {
        let gsSize = window.innerWidth - event.touches[0].clientX;
        const width = this.appContainer.nativeElement.clientWidth;
        const height = this.appContainer.nativeElement.clientHeight;

        switch (this.preferredLayout) {
          case 'auto': {
            if (width > height) {
              this.resizeToLandscape(width, height, gsSize);
            } else {
              this.resizeToPortrait(width, height, gsSize);
            }
            break;
          }
          case 'landscape': {
            this.resizeToLandscape(width, height, gsSize);
            break;
          }
          case 'portrait': {
            this.resizeToPortrait(width, height, gsSize);
            break;
          }
        }
      }
    } else {
      if (!this.landscapeOrientation && event && event.touches[0].clientY > 64) {
        if (this.olga && this.appContainer) {
          let gsSize = window.innerHeight - event.touches[0].clientY;
          const width = this.appContainer.nativeElement.clientWidth;
          const height = this.appContainer.nativeElement.clientHeight;
          switch (this.preferredLayout) {
            case 'auto': {
              if (width > height) {
                this.resizeToLandscape(width, height, gsSize);
              } else {
                console.log('GSSize vertical slider: ' + gsSize);
                this.resizeToPortrait(width, height, gsSize);
              }
              break;
            }
            case 'landscape': {
              this.resizeToLandscape(width, height, gsSize);
              break;
            }
            case 'portrait': {
              this.resizeToPortrait(width, height, gsSize);
              break;
            }
          }
        }
      }
    }
  }

  onSliderDrag(event: DragEvent): void {
    if (this.landscapeOrientation && event && event.clientX > 64) {
      if (this.olga && this.appContainer) {
        let gsSize = window.innerWidth - event.clientX;
        const width = this.appContainer.nativeElement.clientWidth;
        const height = this.appContainer.nativeElement.clientHeight;

        switch (this.preferredLayout) {
          case 'auto': {
            if (width > height) {
              this.resizeToLandscape(width, height, gsSize);
            } else {
              this.resizeToPortrait(width, height, gsSize);
            }
            break;
          }
          case 'landscape': {
            this.resizeToLandscape(width, height, gsSize);
            break;
          }
          case 'portrait': {
            this.resizeToPortrait(width, height, gsSize);
            break;
          }
        }
      }
    } else {
      if (!this.landscapeOrientation && event && event.clientY > 64) {
        if (this.olga && this.appContainer) {
          let gsSize = window.innerHeight - event.clientY;
          const width = this.appContainer.nativeElement.clientWidth;
          const height = this.appContainer.nativeElement.clientHeight;
          switch (this.preferredLayout) {
            case 'auto': {
              if (width > height) {
                this.resizeToLandscape(width, height, gsSize);
              } else {
                console.log('GSSize vertical slider: ' + gsSize);
                this.resizeToPortrait(width, height, gsSize);
              }
              break;
            }
            case 'landscape': {
              this.resizeToLandscape(width, height, gsSize);
              break;
            }
            case 'portrait': {
              this.resizeToPortrait(width, height, gsSize);
              break;
            }
          }
        }
      }
    }
  }

  resizeLayout(): void {
    if (!this.appContainer) {
      console.log('Invalid (Null) App Container %$@');
    } else {
      const width = this.appContainer.nativeElement.clientWidth;
      const height = this.appContainer.nativeElement.clientHeight;
      switch (this.preferredLayout) {
        case 'auto': {
          if (width > height) {
            this.resizeToLandscape(width, height);
          } else {
            this.resizeToPortrait(width, height);
          }
          break;
        }
        case 'landscape': {
          this.resizeToLandscape(width, height);
          break;
        }
        case 'portrait': {
          this.resizeToPortrait(width, height);
          break;
        }
      }
    }
  }
}
