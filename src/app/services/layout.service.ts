import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Olga } from '../app.component';
import { GamescoreUxComponent } from '../game-score/game-score.ux';
import { OlgaBoardComponent } from '../olga-board/olga-board.component';


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
  board: OlgaBoardComponent | null = null;
  preferredLayout: Layout = 'auto';
  preferredRatio = .3;
  boardRatio = 1;
  constructor() { }
  private resizeToLandscape(width: number, height: number, gsSize?: number) {
    if (this.olga && this.olga.gameScoreElement && this.olga.controlsElement) {
      let boardSize = 0;
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
        this.board?.setBoardSize(boardSize);
        let gsHeight = (boardSize - 200);
        // game score
        this.olga.gameScoreElement.style.top = '60px'; // 64 represents the controls ux
        this.olga.gameScoreElement.style.width = gsWidth + 'px';
        this.olga.gameScoreElement.style.height = gsHeight + 'px';
        // controls

        this.olga.controlsElement.style.left = '';
        this.olga.controlsElement.style.top = (gsHeight + 55).toString() + 'px'; // 64 represents the 
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
        this.board?.setBoardSize(boardSize);
        let gsHeight = (boardSize - 200);
        // game score
        this.olga.gameScoreElement.style.top = '60px'; // 64 represents the controls ux
        this.olga.gameScoreElement.style.width = gsSize + 'px';
        this.olga.gameScoreElement.style.height = gsHeight + 'px';
        // controls
        this.olga.controlsElement.style.left = '';
        this.olga.controlsElement.style.top = (gsHeight + 55).toString() + 'px'; // 64 represents the 
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
      this.board?.setBoardSize(boardSize);
      if (this.olga.boardElement) {
        this.olga.boardElement.style.left = (width * ((1 - this.boardRatio) / 2)) + 'px';
      }
      if (this.olga.gameScoreElement) {
        this.olga.gameScoreElement.style.top = (boardSize + 64 + 'px'); // 64 represents the controls ux
        this.olga.gameScoreElement.style.width = '100%';
        this.olga.gameScoreElement.style.height = (boardSize / 3 > 425 ? 425 : boardSize / 3).toString() + 'px';
      }
      if (this.olga.controlsElement) {
        this.olga.controlsElement.style.top = (boardSize + 4).toString() + 'px'; // 64 represents the controls ux
        this.olga.controlsElement.style.width = '80%';
        this.olga.controlsElement.style.left = '10%';
        this.olga.controlsElement.style.height = '64px';
      }
    }
  }
  initializeLayout(olga: Olga, autoResize = true): void {
    this.olga = olga;
    this.gameScore = olga.gameScoreUx;
    this.board = olga.olgaBoard;
    this.appContainer = olga.olgaContainer;
    if (autoResize) {
      window.removeEventListener('resize', this.resizeLayout.bind(this));
      window.addEventListener('resize', this.resizeLayout.bind(this));
    }
    this.resizeLayout()
    window.setTimeout(() => {
      this.resizeLayout();
    }, 250);
  }

  onSliderDrag(event: DragEvent): void {
    if (event && event.clientX > 64) {
      if (this.olga?.olgaBoard && this.appContainer) {
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
