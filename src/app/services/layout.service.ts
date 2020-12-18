import { Injectable, ElementRef } from '@angular/core';
import { BehaviorSubject } from 'rxjs';
import { Olga } from '../app.component';
import { OlgaHeaderComponent } from '../olga-header/olga-header.component';
import { GamescoreUxComponent } from '../olga-score/olga-score.component';
import { CanvasChessBoard } from '../canvas-chessboard/canvas-chessboard.component';
import { OlgaMenuComponent } from '../olga-menu/olga-menu.component';
import { OlgaControlsComponent } from '../olga-controls/olga-controls.component';
import { Renderer2 } from '@angular/core';

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
  olga: Olga | null = null;
  header: OlgaHeaderComponent | null = null;
  controlsComponent: OlgaControlsComponent | null = null;
  appContainer: ElementRef | null = null;
  gameScore: GamescoreUxComponent | null = null;
  board: CanvasChessBoard | null = null;
  menuComponent: OlgaMenuComponent | null = null;
  resizeElement: HTMLElement | null = null;
  preferredLayout: Layout = 'auto';
  preferredRatioLandscape = .75;
  preferredRatioPortrait = 0.52;
  preferredWidthPercentage = 1.0;
  preferredHeightPercentage = 1.0
  layoutDirection = true;
  gameScoreElement: HTMLElement | null = null;
  boardElement: HTMLElement | null = null;
  controlsElement: HTMLElement | null = null;
  statusElement: HTMLElement | null = null;
  headerElement: HTMLElement | null = null;
  resizeObserver: ResizeObserver = new ResizeObserver(debounce(this.resizeEvent.bind(this), 6));
  state: number = 3;
  constructor() { }

  public settings(): object {
    let settings = {};
    return settings;
  }



  protected resizeEvent(entries: readonly ResizeObserverEntry[]) {
    // @ts-ignore
    const boundingRect = entries[0].contentRect as DOMRectReadOnly;
    if (!this.appContainer) {
      console.log('Invalid (Null) App Container %$@');
    } else {
      let height = boundingRect.height;
      if (boundingRect.width === height) {
        height - 2;
      }
      const landscape = (boundingRect.width > height);
      this.landscapeOrientation.next(landscape);
      switch (this.preferredLayout) {
        case 'auto': {
          if (landscape) {
            this.rtl(boundingRect.width, height);
          } else {
            this.rtp(boundingRect.width, height);
          }
          break;
        }
        case 'landscape': {
          this.rtl(boundingRect.width, height);
          break;
        }
        case 'portrait': {
          this.rtp(boundingRect.width, height);
          break;
        }
      }
    }
  }




  public attachHeader(header: OlgaHeaderComponent) {
    this.header = header;
  }

  public attachScore(gs: GamescoreUxComponent) {
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
    this.controlsComponent?.resize(c2width, 64);
    this.board?.setSize(boardWidth);
    console.log('State:' + this.state);
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
    if (this.boardElement && this.gameScoreElement && this.headerElement && this.statusElement && this.controlsElement) {
      let boardHeight = (height * this.preferredRatioPortrait);
      boardHeight = boardHeight > width ? width : boardHeight;
      boardHeight = boardHeight < 192 ? 192 : boardHeight;
      this.state = width <= 540 ? 1 : 2;
      let hheight = this.state == 1 ? 310 : 240;
      this.board?.setSize(boardHeight);
      console.log('State:' + this.state);
      if (this.appContainer) {
        this.appContainer.nativeElement.style.height = 'auto';
        this.appContainer.nativeElement.style.width = '100%';
        this.appContainer.nativeElement.style.overflowX = 'hidden';
      }
      switch (this.state) {
        case 1: {
          this.headerElement.style.maxHeight = hheight + 'px';
          this.headerElement.style.height = hheight + 'px';
          this.headerElement.style.width = width + 'px';
          this.headerElement.style.right = '0px';
          this.headerElement.style.left = '';
          this.headerElement.style.overflowY = 'hidden';
          this.headerElement.style.overflowX = 'hidden';
          this.header?.resize(width, hheight);
          this.boardElement.style.top = (hheight + 2) + 'px';
          const board_margin = Math.floor((width - boardHeight) / 2);
          this.boardElement.style.left = board_margin + 'px';
          this.boardElement.style.right = '';
          this.boardElement.style.bottom = '';
          this.controlsElement.style.right = '0px;'
          this.controlsElement.style.width = width + 'px';
          this.controlsElement.style.top = '';
          this.controlsElement.style.bottom = '0px'; // cant be bottom
          this.controlsElement.style.left = '0px';
          this.controlsElement.style.height = '99px';
          this.controlsComponent?.resize(width, 99);
          this.gameScoreElement.style.right = '2px';
          this.gameScoreElement.style.width = width - 24 + 'px';
          this.gameScoreElement.style.height = '456px';
          this.gameScoreElement.style.top = '340px';
          this.gameScoreElement.style.left = '';
          this.gameScore?.resize(width, 456);
          this.statusElement.style.bottom = '';
          this.statusElement.style.top = (hheight + boardHeight + 2) + 'px';
          this.statusElement.style.height = '32px';
          this.statusElement.style.left = '2px';
          this.statusElement.style.right = '2px';
          this.statusElement.style.width = (width - 4) + 'px';
          break;
        }
        case 2: {
          this.headerElement.style.maxHeight = hheight + 'px';
          this.headerElement.style.height = hheight + 'px';
          this.headerElement.style.width = width + 'px';
          this.headerElement.style.right = '0px';
          this.headerElement.style.left = '';
          this.header?.resize(width, hheight);
          // if (this.layoutDirection) { // RTL
          //   this.boardElement.style.left = '2px';
          //   this.boardElement.style.right = '';
          // } else {
          //   this.boardElement.style.right = '2px';
          //   this.boardElement.style.left = '';
          // }1
          this.boardElement.style.top = (hheight + 2) + 'px';
          const board_margin = Math.floor((width - boardHeight) / 2);
          this.boardElement.style.left = board_margin + 'px';
          this.boardElement.style.right = '';
          this.boardElement.style.bottom = '';
          this.controlsElement.style.right = '0px;'
          this.controlsElement.style.width = width + 'px';
          this.controlsElement.style.top = '';
          this.controlsElement.style.bottom = '0px'; // cant be bottom
          this.controlsElement.style.left = '0px';
          this.controlsElement.style.height = '99px';
          this.controlsComponent?.resize(width, 99);
          this.gameScoreElement.style.right = '2px';
          this.gameScoreElement.style.width = width - 24 + 'px';
          this.gameScoreElement.style.height = '456px';
          this.gameScoreElement.style.top = '340px';
          this.gameScoreElement.style.left = '';
          this.gameScore?.resize(width, 456);
          this.statusElement.style.bottom = '';
          this.statusElement.style.top = (hheight + boardHeight + 2) + 'px';
          this.statusElement.style.height = '32px';
          this.statusElement.style.left = '2px';
          this.statusElement.style.right = '2px';
          this.statusElement.style.width = (width - 4) + 'px';
          break;
        }
      }
    }
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
        this.header.resize(gsWidth, titleSize + gsHeight);
        this.headerElement.style.height = (titleSize + gsHeight) + 'px';
        this.headerElement.style.width = gsWidth + 'px';
        //this.gameScoreElement.style.height = gsHeight + 'px';
        // controls
        this.controlsElement.style.left = '';
        this.controlsElement.style.top = (titleSize + gsHeight + 2).toString() + 'px'; // 64 represents the
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

      this.header.resize(width, 360);
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
  initializeLayout(olga: Olga): void {
    this.olga = olga;
    this.board = olga.canvasBoardComponent;
    this.menuComponent = olga.menuComponent;
    this.appContainer = olga.appContainer;
    this.resizeObserver?.observe(this.appContainer.nativeElement);
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

  resizeLayout(width: number, height: number): void {
    if (!this.appContainer) {
      console.log('Invalid (Null) App Container %$@');
    } else {
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
  }


  public shrink() {
    if (this.appContainer) {
      if (this.landscapeOrientation.value) {
        if (this.preferredRatioLandscape >= .3) {
          this.preferredRatioLandscape -= .1;
          this.resizeLayout(this.appContainer.nativeElement.clientWidth, this.appContainer.nativeElement.clientHeight);
        }
      } else {
        if (this.preferredRatioPortrait >= .3) {
          this.preferredRatioPortrait -= .1;
          this.resizeLayout(this.appContainer.nativeElement.clientWidth, this.appContainer.nativeElement.clientHeight);
        }
      }
    }
  }

  public grow() {
    if (this.appContainer) {
      if (this.landscapeOrientation.value) {
        if (this.preferredRatioLandscape <= .9) {
          this.preferredRatioLandscape += .1;
          this.resizeLayout(this.appContainer.nativeElement.clientWidth, this.appContainer.nativeElement.clientHeight);
        }
      } else {
        if (this.preferredRatioPortrait <= .9) {
          this.preferredRatioPortrait += .1;
          this.resizeLayout(this.appContainer.nativeElement.clientWidth, this.appContainer.nativeElement.clientHeight);
        }
      }
    }
  }
}
