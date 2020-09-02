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
  readonly mobileView = new BehaviorSubject<boolean>(false);
  readonly boardSize = new BehaviorSubject<number>(480);
  readonly scoreSize = new BehaviorSubject<number>(340);
  olga: Olga | null = null;
  appContainer: ElementRef | null = null;
  gameScore: GamescoreUxComponent | null = null;
  board: CanvasChessBoard | null = null;
  resizeElement: HTMLElement | null = null;
  preferredLayout: Layout = 'auto';
  preferredRatioLandscape = 0.3;
  preferredRatioPortrait = 0.4;
  boardRatio = 1;
  constructor() {}

  private rtl(width: number, height: number, gsSize?: number) {
    const isMobile = this.mobileView.value;
    if (isMobile) {
      // perform mobile setup
    } else {
      // prepare desktop view
      // determine the size of Olga and preferred ratio (unless we have already )
    }
  }

  private rtp(width: number, height: number, gsSize?: number) {
    const isMobile = this.mobileView.value;
    if (isMobile) {
      // perform mobile setup
    } else {
      // prepare desktop view
    }
  }

  private resizeToLandscape(width: number, height: number, gsSize?: number) {
    if (
      this.olga &&
      this.olga.gameScoreElement &&
      this.olga.controlsElement &&
      this.olga.statusElement &&
      this.olga.settingsMenuComponent
    ) {
      let boardSize = 0;
      const titleSize = 80;
      if (this.resizeElement) {
        this.resizeElement.style.left = '-10px';
        this.resizeElement.style.top = 'calc(50% - 3em)';
        this.resizeElement.style.width = '1.2em';
        this.resizeElement.style.height = '6em';
      }
      if (!gsSize) {
        let padding = width * 0.05;
        if (padding >= 16 || padding <= 10) {
          padding = 12;
        }
        boardSize = Math.floor((1 - this.preferredRatioLandscape) * width);
        if (boardSize > height) {
          boardSize = height - padding / 2;
        }
        let controlsHeight = boardSize / 7;
        controlsHeight = controlsHeight > 62 ? 62 : controlsHeight;
        let gsWidth = width - boardSize - padding;
        this.board?.setSize(boardSize);
        let gsHeight = boardSize - 200 - controlsHeight;
        // game score
        this.olga.gameScoreElement.style.left = '';
        this.olga.gameScoreElement.style.top = titleSize + 2 + 'px'; // 64 represents the controls ux
        this.olga.gameScoreElement.style.width = gsWidth + 'px';
        this.olga.gameScoreElement.style.height = gsHeight + 'px';
        // controls
        this.olga.controlsElement.style.left = '';
        this.olga.controlsElement.style.top =
          (gsHeight + (titleSize + 10)).toString() + 'px'; // 64 represents the
        this.olga.controlsElement.style.width = (gsWidth - 2).toString() + 'px';
        this.olga.controlsElement.style.height = controlsHeight + 'px';
        this.olga.controlsElement.style.right = '1px';
        this.olga.statusElement.style.left = '';
        this.olga.statusElement.style.top =
          (gsHeight + titleSize + controlsHeight + 62).toString() + 'px'; // 64 represents the
        this.olga.statusElement.style.width = gsWidth.toString() + 'px';
        this.olga.statusElement.style.height = controlsHeight + 'px';
        this.olga.statusElement.style.right = '1px';
        this.scoreSize.next(gsWidth);
      } else {
        //this.preferredRatio = width / gsSize;
        let padding = width * 0.02;
        if (padding < 18) {
          padding = 18;
        }
        const widthAvailable = window.innerWidth - (gsSize + padding);
        boardSize = Math.floor(widthAvailable / 8) * 8;
        if (boardSize >= window.innerHeight) {
          boardSize = Math.floor((window.innerHeight - 16) / 8) * 8;
          gsSize = window.innerWidth - boardSize + padding;
        }
        this.board?.setSize(boardSize);
        let controlsHeight = boardSize / 7;
        controlsHeight = controlsHeight > 62 ? 62 : controlsHeight;
        let gsHeight = boardSize - 200 - controlsHeight;
        // game score
        this.olga.gameScoreElement.style.left = '';
        this.olga.gameScoreElement.style.top = titleSize + 2 + 'px'; // 64 represents the controls ux
        this.olga.gameScoreElement.style.width = gsSize + 'px';
        this.olga.gameScoreElement.style.height = gsHeight + 'px';
        // controls
        this.olga.controlsElement.style.left = '';
        this.olga.controlsElement.style.top =
          (gsHeight + titleSize + 34).toString() + 'px'; // 64 represents the
        this.olga.controlsElement.style.width = (gsSize - 2).toString() + 'px';
        this.olga.controlsElement.style.right = '1px';
        this.olga.statusElement.style.left = '';
        this.olga.statusElement.style.top =
          (gsHeight + titleSize + controlsHeight + 62).toString() + 'px'; // 64 represents the
        this.olga.statusElement.style.width = gsSize.toString() + 'px';
        this.olga.statusElement.style.right = '1px';
        this.scoreSize.next(gsSize);
      }
      this.olga.settingsMenuComponent.resize(width, height);
      this.boardSize.next(boardSize);
    }
  }
  private resizeToPortrait(width: number, height: number, gsSize?: number) {
    if (this.olga) {
      const boardSize = width * this.boardRatio - 6;
      this.board?.setSize(boardSize);
      if (this.olga.statusElement) {
        this.olga.statusElement.style.top = (boardSize - 32).toString() + 'px'; // 64 represents the controls ux
        this.olga.statusElement.style.left = 'calc(1% - 1px)';
        this.olga.statusElement.style.width = '98%';
        this.olga.statusElement.style.height = '52px';
      }
      if (this.olga.boardElement) {
        this.olga.boardElement.style.left =
          width * ((1 - this.boardRatio) / 2) + 'px';
      }
      if (this.olga.gameScoreElement) {
        this.olga.gameScoreElement.style.top = boardSize + 129 + 'px'; // 64 represents the controls ux
        this.olga.gameScoreElement.style.left = 'calc(1% - 1px)';
        this.olga.gameScoreElement.style.width = 'calc(98%  + 2px)';
        this.olga.gameScoreElement.style.height =
          (boardSize / 3 > 425 ? 425 : boardSize / 3).toString() + 'px';
      }
      if (this.olga.controlsElement) {
        this.olga.controlsElement.style.top =
          (boardSize + 30).toString() + 'px'; // 64 represents the controls ux
        this.olga.controlsElement.style.left = 'calc(1% - 1px)';
        this.olga.controlsElement.style.width = '98%';
        this.olga.controlsElement.style.height = '99px';
      }
      if (this.resizeElement) {
        this.resizeElement.style.left = 'calc(50% - 3em)';
        this.resizeElement.style.top = '-4px';
        this.resizeElement.style.width = '6em';
        this.resizeElement.style.height = '1.2em';
      }
      this.olga.settingsMenuComponent?.resize(width, height);
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
    this.resizeLayout();
    window.setTimeout(() => {
      this.resizeLayout();
    }, 250);
  }

  onSliderTouch(event: TouchEvent): void {
    if (
      event.touches.length > 0 &&
      this.landscapeOrientation &&
      event &&
      event.touches[0].clientX > 64
    ) {
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
      if (
        !this.landscapeOrientation &&
        event &&
        event.touches[0].clientY > 64
      ) {
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
