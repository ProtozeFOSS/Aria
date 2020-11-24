import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Olga } from '../app.component';
import { OlgaHeaderComponent } from '../olga-header/olga-header.component';
import { GamescoreUxComponent } from '../olga-score/olga-score.component';
import { CanvasChessBoard } from '../canvas-chessboard/canvas-chessboard.component';
import { OlgaMenuComponent } from '../olga-menu/olga-menu.component';

export declare type Layout = 'auto' | 'landscape' | 'portrait';

@Injectable({
  providedIn: 'root',
})
export class LayoutService {
  readonly landscapeOrientation = new BehaviorSubject<boolean>(true);
  readonly mobileView = new BehaviorSubject<boolean>(false);
  olga: Olga | null = null;
  header: OlgaHeaderComponent | null = null;
  appContainer: ElementRef | null = null;
  gameScore: GamescoreUxComponent | null = null;
  board: CanvasChessBoard | null = null;
  resizeElement: HTMLElement | null = null;
  preferredLayout: Layout = 'auto';
  preferredRatioLandscape = 0.3;
  preferredRatioPortrait = 0.4;
  preferredWidthPercentage = 1.0;
  preferredHeightPercentage = 1.0
  layoutDirection = true;
  public gameScoreElement: HTMLElement | null = null;
  public boardElement: HTMLElement | null = null;
  public controlsElement: HTMLElement | null = null;
  public statusElement: HTMLElement | null = null;
  public headerElement: HTMLElement | null = null;
  public menuComponent: OlgaMenuComponent | null = null;
  constructor() { }

  public settings(): object {
    let settings = {};
    return settings;
  }

  public attachHeader(header: OlgaHeaderComponent) {
    this.header = header;
  }

  private rtl(boundingRect: DOMRectReadOnly) {
    let state = this.preferredRatioLandscape > .5 ? 4:3;
    let boardWidth = (boundingRect.width * this.preferredRatioLandscape);
    boardWidth = boardWidth > boundingRect.height ? boundingRect.height:boardWidth;    
    boardWidth = boardWidth < 192 ? 192: boardWidth;
    let c2width = boundingRect.width - (boardWidth + 4);
    let hheight = (boundingRect.height * .4);
    hheight = hheight > 320 ? 320: hheight;
    this.board.setSize(boardWidth);
    this.header?.resize(c2width, hheight, state);
    this.headerElement.style.height = '800px';
    this.headerElement.style.width = c2width + 'px';
    this.headerElement.style.right = '0px';
  }

  private rtp(boundingRect: DOMRectReadOnly) {
    let state = this.preferredRatioLandscape > .5 ? 2:1;

  }

  public openSettings(): void {
    if (this.menuComponent) {
      this.menuComponent.open();
    }
  }

  public closeSettings(): void {
    if (this.menuComponent) {
      this.menuComponent.close();
    }
  }

  private resizeToLandscape(width: number, height: number, gsSize?: number) {
    
    if (
      this.olga &&
      this.gameScoreElement &&
      this.controlsElement &&
      this.statusElement &&
      this.headerElement &&
      this.menuComponent &&
      this.boardElement &&
      this.header
    ) {
      

      let boardSize = 0;
      const titleSize = 200;
      width = (this.preferredWidthPercentage * width);
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
        let controlsHeight = 100;
        let gsWidth = width - boardSize - padding;
        this.board?.setSize(boardSize);
        let gsHeight = (boardSize - (titleSize + controlsHeight + 48));
        // game score
        if (this.layoutDirection) { // RTL
          //this.headerElement.style.right = '2px';
          //this.headerElement.style.left = '';
          this.boardElement.style.left = '2px';
          this.boardElement.style.right = '';
        } else {
          //this.headerElement.style.left = '2px';
          //this.headerElement.style.right = '';
          this.boardElement.style.right = '2px';
          this.boardElement.style.left = '';
        }
        this.boardElement.style.top = '2px';
        this.header.resize(gsWidth, titleSize + gsHeight, 0);
        this.headerElement.style.height = (titleSize + gsHeight) + 'px';
        this.headerElement.style.width = gsWidth + 'px';
        // this.gameScoreElement.style.left = '';
        // this.gameScoreElement.style.top = titleSize + 'px'; // 64 represents the controls ux
        // this.gameScoreElement.style.width = gsWidth + 'px';
        this.gameScoreElement.style.height = gsHeight + 'px';
        // controls
        this.controlsElement.style.left = '';
        this.controlsElement.style.top =
          (titleSize + gsHeight + 2).toString() + 'px'; // 64 represents the
        this.controlsElement.style.width = (gsWidth - 2).toString() + 'px';
        this.controlsElement.style.height = controlsHeight + 'px';
        this.controlsElement.style.right = '1px';
        this.statusElement.style.left = '';
        let statusTop = titleSize + gsHeight + controlsHeight + 4;
        this.statusElement.style.top =
          statusTop.toString() + 'px'; // 64 represents the
        this.statusElement.style.width = gsWidth.toString() + 'px';
        this.statusElement.style.height = '42px';
        this.statusElement.style.right = '1px';
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

        let controlsHeight = 100;
        let gsHeight = boardSize - (titleSize + controlsHeight + 64);
        // game score
        // this.gameScoreElement.style.left = '';
        // this.gameScoreElement.style.top = titleSize + 2 + 'px'; // 64 represents the controls ux
        // this.gameScoreElement.style.width = gsSize + 'px';
        this.gameScoreElement.style.height = gsHeight + 'px';
        // this.gameScoreElement.style.overflow = 'visible';
        // controls
        this.controlsElement.style.left = '';
        this.controlsElement.style.top =
          (gsHeight + titleSize + 34).toString() + 'px'; // 64 represents the
        this.controlsElement.style.width = (gsSize - 2).toString() + 'px';
        this.controlsElement.style.right = '1px';
        this.statusElement.style.left = '';

        let statusTop = titleSize + gsHeight + controlsHeight;
        this.statusElement.style.top = statusTop + 'px'; // 64 represents the
        this.statusElement.style.width = gsSize.toString() + 'px';
        this.statusElement.style.right = '1px';
        this.statusElement.style.height = '64px';
      }
      if (this.menuComponent && this.menuComponent.visible) {
        this.menuComponent.resize(width, height);
      }
    }
    this.landscapeOrientation.next(true);
  }
  private resizeToPortrait(width: number, height: number, gsSize?: number) {
    if (this.olga && this.boardElement && this.headerElement && this.header) {
      const boardSize = Math.floor((1 - this.preferredRatioPortrait) * width);
      this.board?.setSize(boardSize);
      let yOffset = 0;
      
      this.header.resize(width, 360, 0);
      if ((width - boardSize) > 340) { // side by side
        this.boardElement.style.top = '1px';
        if (this.layoutDirection) { // RTL
          // this.headerElement.style.right = '2px';
          // this.headerElement.style.left = '';
          
          this.boardElement.style.left = '2px';
        } else {
          // this.headerElement.style.left = '2px';
          // this.headerElement.style.right = '';
          this.boardElement.style.right = '2px';
        }
        //this.headerElement.style.width = ((width - boardSize) - 2) + 'px';
        //this.headerElement.style.height = boardSize + 'px';
      } else { // Header above board
        this.boardElement.style.top = '200px';
        //this.headerElement.style.height = '240px';
        //this.headerElement.style.width = '100%';
        this.boardElement.style.left = ((width - boardSize) / 2) + 'px';
        yOffset = 200;
      }

      if (this.gameScoreElement) {
        this.gameScoreElement.style.top = (yOffset + boardSize + 129) + 'px'; // 64 represents the controls ux
        this.gameScoreElement.style.left = 'calc(1% - 1px)';
        this.gameScoreElement.style.width = 'calc(98%  + 2px)';
        this.gameScoreElement.style.bottom = '6px';
        // MUST MOVE TO DYNAMICALLY RESIZING TO GAME SCORE

        let scoreHeight = (window.innerHeight - (boardSize + 174));
        if (scoreHeight < 225) {
          scoreHeight = 225;
        }
        this.gameScoreElement.style.height = scoreHeight + 'px';
        //  (boardSize / 3 > 425 ? 425 : boardSize / 3).toString() + 'px';
      }
      if (this.controlsElement) {
        this.controlsElement.style.top =
          (yOffset + boardSize + 30).toString() + 'px'; // 64 represents the controls ux
        this.controlsElement.style.left = 'calc(1% - 1px)';
        this.controlsElement.style.width = '98%';
        this.controlsElement.style.height = '100px';
      }
      if (this.statusElement) {
        this.statusElement.style.top = (yOffset + boardSize).toString() + 'px'; // 64 represents the controls ux
        this.statusElement.style.left = 'calc(1% - 1px)';
        this.statusElement.style.width = '98%';
        this.statusElement.style.height = '42px';
      }
      if (this.resizeElement) {
        this.resizeElement.style.left = 'calc(50% - 3em)';
        this.resizeElement.style.top = '-4px';
        this.resizeElement.style.width = '6em';
        this.resizeElement.style.height = '1.2em';
      }
      if (this.menuComponent && this.menuComponent.visible) {
        this.menuComponent.resize(width, height);
      }
    }
    this.landscapeOrientation.next(false);
  }
  initializeLayout(olga: Olga, autoResize = true): void {
    this.olga = olga;
    this.gameScore = olga.gameScoreComponent;
    this.board = olga.canvasBoardComponent;
    this.menuComponent = olga.menuComponent;
    this.appContainer = olga.appContainer;
    // if (autoResize) {
    //   window.removeEventListener('resize', this.resizeLayout.bind(this));
    //   window.addEventListener('resize', this.resizeLayout.bind(this));
    // }
  }

  public increaseBoardSize(): void {
    const landscape = this.landscapeOrientation.value;
    if (landscape && this.preferredRatioLandscape > .1) {
      this.preferredRatioLandscape -= .025;
    }
    if (!landscape && this.preferredRatioPortrait > .1) {
      this.preferredRatioPortrait -= .025;
    }
  }

  public decreaseBoardSize(): void {
    const landscape = this.landscapeOrientation.value;
    if (landscape && this.preferredRatioLandscape < .7) {
      this.preferredRatioLandscape += .025;
    }
    if (!landscape && this.preferredRatioPortrait < .7) {
      this.preferredRatioPortrait += .025;
    }
  }

  onSliderTouch(event: TouchEvent): void {
    if (
      event.touches.length > 0 &&
      this.landscapeOrientation.value &&
      event &&
      event.touches[0].clientX > 64
    ) {
      if (this.olga && this.appContainer) {
        let gsSize = window.innerWidth - event.touches[0].clientX;
        const width = window.innerWidth
          || document.documentElement.clientWidth
          || document.body.clientWidth;

        const height = window.innerHeight
          || document.documentElement.clientHeight
          || document.body.clientHeight;

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
        !this.landscapeOrientation.value &&
        event &&
        event.touches[0].clientY > 64
      ) {
        if (this.olga && this.appContainer) {
          let gsSize = window.innerHeight - event.touches[0].clientY;
          const width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

          const height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
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
  }

  onSliderDrag(event: DragEvent): void {
    if (this.landscapeOrientation.value && event && event.clientX > 64) {
      if (this.olga && this.appContainer) {
        let gsSize = window.innerWidth - event.clientX;
        const width = window.innerWidth
          || document.documentElement.clientWidth
          || document.body.clientWidth;

        const height = window.innerHeight
          || document.documentElement.clientHeight
          || document.body.clientHeight;

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
          const width = window.innerWidth
            || document.documentElement.clientWidth
            || document.body.clientWidth;

          const height = window.innerHeight
            || document.documentElement.clientHeight
            || document.body.clientHeight;
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
  }

  resizeLayout(boundingRect: DOMRectReadOnly): void {
    if (!this.appContainer) {
      console.log('Invalid (Null) App Container %$@');
    } else {
      const landscape = (boundingRect.width >= boundingRect.height);
      this.landscapeOrientation.next(landscape);
      switch (this.preferredLayout) {
        case 'auto': {
          if (landscape) {
            this.rtl(boundingRect);
          } else {
            this.rtp(boundingRect);
          }
          break;
        }
        case 'landscape': {
          this.rtl(boundingRect);
          break;
        }
        case 'portrait': {
          this.rtp(boundingRect);
          break;
        }
      }
    }
  }


  public shrink() {
    if (this.appContainer) {
      if (this.landscapeOrientation.value) {
        if (this.preferredWidthPercentage >= .3) {
          this.preferredWidthPercentage -= .1;
          this.appContainer.nativeElement.clientWidth = (window.innerWidth * this.preferredWidthPercentage);
        }
      } else {
        if (this.preferredHeightPercentage >= .3) {
          this.preferredHeightPercentage -= .1;
          this.appContainer.nativeElement.clientHeight = (window.innerHeight * this.preferredHeightPercentage);
        }
      }
    }
  }

  public grow() {
    if (this.appContainer) {
      if (this.landscapeOrientation.value) {
        if (this.preferredWidthPercentage <= .9) {
          this.preferredWidthPercentage += .1;
          this.appContainer.nativeElement.clientWidth = (window.innerWidth * this.preferredWidthPercentage);
        }
      } else {
        if (this.preferredHeightPercentage <= .9) {
          this.preferredHeightPercentage += .1;
          this.appContainer.nativeElement.clientHeight = (window.innerHeight * this.preferredHeightPercentage);
        }
      }
    }
  }
}
