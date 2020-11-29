import {
  Component,
  OnInit,
  Input,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList
} from '@angular/core';
import {
  ChessMove,
  GameScoreItem,
  GameScoreType
} from '../common/kokopu-engine';
import { BehaviorSubject } from 'rxjs';
import { OlgaService, ScoreViewType } from '../services/olga.service';
import { LayoutService } from '../services/layout.service';
import { FlowItemComponent } from './score-flow/flow-item/flow-item.component';
import { ScoreFlowComponent } from './score-flow/score-flow.component';
import { ScoreTableComponent } from './score-table/score-table.component';

@Component({
  selector: 'olga-score',
  templateUrl: './olga-score.html',
  styleUrls: ['./olga-score.scss'],
})
export class GamescoreUxComponent implements OnInit, AfterViewInit {
  // View Children Handles
  @ViewChild('resizeHandle')
  resizeHandle: ElementRef | null = null;
  @ViewChild('gamescore-container') container: ElementRef | null = null;
  @ViewChild(ScoreFlowComponent) scoreFlow: ScoreFlowComponent | null = null;
  @ViewChild(ScoreTableComponent) scoreTable: ScoreTableComponent | null = null;
  @ViewChild('pgnData')
  pgnData: ElementRef | null = null; // To Be Deleted
  columnCount = 3;
  rowHeight = '50px';
  maxPlySize = 178;
  @Output() resizing = false;
  @Input() scoreWidth: number | null = 360;
  GameScoreType = GameScoreType;
  ScoreViewType = ScoreViewType;
  public _items: GameScoreItem[] = [];
  // Current item data and visual
  @Output() readonly currentData = new BehaviorSubject<GameScoreItem | null>(null);
  @Output() currentItem: FlowItemComponent | null = null;
  @Output() currentIndex: number = -1;


  constructor(public olga: OlgaService, public layout: LayoutService) {
    this.resetCursor();
    this.layout.gameScore = this;
    this.olga.attachScore(this);
  }

  ngOnInit(): void {
    //console.log(this.gameScore);
  }

  ngAfterViewInit(): void {
    // move to layout
    this.layout.resizeElement = document.getElementById('resize-handle-' + this.olga.UUID);
  }

  public clearGameScore(): void {
    this._items = []
    this.clearSelection();
  }
  public setGameScoreItems(items: GameScoreItem[] | undefined): void {
    if (items) {
      this._items = items;
      this.updateSelection();
    } else {
      this._items = [];
    }
  }

  public updateSelection(): void {
    window.setTimeout(() => { this.selectGameScoreItem(this.currentIndex); }, 75);
  }
  public clearSelection(): void {
    this.currentIndex = -1;
    window.setTimeout(() => { this.selectGameScoreItem(-1),, 75);
  }

  protected navigateToItem(index: number): void {

  }

  resize(width: number, height: number, state: number) {

  }

  resizeScore(): void {
    this.olga.toggleAutoPlay();
    if (this.scoreWidth) {
      this.columnCount = Math.floor(this.scoreWidth / this.maxPlySize);
    } else {
      this.columnCount = 3;
    }
    this.olga.toggleAutoPlay();
  }



  ignoreEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }

  setWidth(width: number | null): void {
    if (width) {
      this.columnCount = Math.floor(width / this.maxPlySize);
    }
  }

  resetResizeHandle(event: DragEvent | MouseEvent): void {
    this.resizing = false;
    if (this.resizeHandle && event.buttons === 0) {
      document.body.style.cursor = 'pointer';
      this.resizeHandle.nativeElement.style.cursor = 'pointer';
    }
    if (this.resizeHandleEvent) {
      this.resizeHandleEvent(event);
    }
  }

  setGrabCursor(event: DragEvent | MouseEvent): void {
    this.resizing = true;
    document.body.style.cursor = 'grab';
    if (this.resizeHandle) {
      this.resizeHandle.nativeElement.style.cursor = 'grab';
    }
  }

  resetCursor(): void {
    document.body.style.cursor = 'pointer';
    if (this.resizeHandle) {
      this.resizeHandle.nativeElement.style.cursor = 'pointer';
    }
  }

  startTouch(event: TouchEvent): void {
    const touchPoint = event.touches[0];
    if (touchPoint) {
      if (this.layout.resizeElement) {
        this.resizing = true;
      }
    }
  }

  stopTouch(event: TouchEvent) {
    this.resizing = false;
  }



  resizeHandleEvent(event: DragEvent | MouseEvent): void {
    if (this.resizing) {
      this.resizeScore();
    }
  }

  resizeTouchEvent(event: TouchEvent): void {
    if (this.resizing) {
      this.resizeScore();
    }
  }

  resizeHandleCore(event: DragEvent | MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    //document.body.style.cursor = 'grab';
    if (this.resizeHandle) {
      //this.resizeHandle.nativeElement.style.cursor = 'grab';
    }
    if (event.buttons > 0 && this.resizeHandleEvent) {
      this.resizeHandleEvent(event);
    }
  }
  selectGameScoreItem(index: number) {
    if (this.scoreFlow) {
      this.scoreFlow.selectGameScoreItem(index);
    }
    if (this.scoreTable) {
      this.scoreTable.selectGameScoreItem(index);
    }
  }

  public getPGN(): string {
    return this.pgnData?.nativeElement.value;
  }

  // Navigation

  public takeVariation(index: number) {
    this.navigateToNode(index - 1);
    window.setTimeout(() => {
      if (this.currentItem) {
        const item = this._items[++this.currentIndex];
        const variations = item.move.variations();
        if (variations.length > 0) {
          // show variation
          console.log('Taking first variation');
          console.log(variations[0]);
          this.olga.makeVariantMove(0, item.move);
          this.updateSelection();
        }
      }
    }, 200);
  }

  public navigateToNode(index: number) {
    if (this.currentIndex < index) {
      while (this.currentIndex < index) {
        const next = this._items[++this.currentIndex] as GameScoreItem;
        if (next) {
          if (this.olga.play(next.move)) {
            const nodeMove = ChessMove.fromNode(next.move);
            if (nodeMove) {
              this.olga.makeBoardMove(nodeMove);
            }
          }
        }
      }
      this.currentIndex = index;
      this.updateSelection();
      return;
    }
    while (this.currentIndex > index) {
      const node = this._items[this.currentIndex];
      let prev = null;
      if (this.currentIndex > 0) {
        prev = this._items[this.currentIndex - 1];
      }
      if (prev && node) {
        if (this.olga.unPlay(node.move, prev.move)) {
          const nodeMove = ChessMove.fromNode(node.move);
          if (nodeMove) {
            this.olga.reverseBoardMove(nodeMove);
          }
        }
      }
      --this.currentIndex;
    }
    if (index === -1) {
      this.olga.resetEngine();
      this.olga.redrawBoard();
    }
    this.updateSelection();
  }
  public advance(): boolean {
    if (!this.isFinalPosition()) {
      const next = this.currentIndex + 1;
      if (next < this._items.length && next >= 0) {
        this.navigateToNode(next);
        return true;
      }
    }
    return false;
  }

  public moveToStart(): void {
    while (this.previous()) { }
  }

  public moveToEnd(): void {
    while (this.advance()) { }
  }

  public previous(): boolean {
    if (this.currentIndex !== -1) {
      const prev = this.currentIndex - 1;
      if (prev < this._items.length && prev >= -1) {
        this.navigateToNode(prev);
        return true;
      }
    }
    return false;
  }

  public isStartingPosition(): boolean {
    return this.currentIndex === -1;
  }

  public isFinalPosition(): boolean {
    return this.currentIndex >= (this._items.length - 1);
  }

  public incrementSelection(): void {
    ++this.currentIndex;
    this.updateSelection();
  }

}
