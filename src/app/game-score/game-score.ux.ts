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
import { GameScoreItemComponent } from './game-score-item/game-score-item.component';
import { BehaviorSubject } from 'rxjs';
import { OlgaService } from '../services/olga.service';
import { LayoutService } from '../services/layout.service';

export enum ScoreViewType {
  Table = 101,
  Flow = 202
};



@Component({
  selector: 'olga-score',
  templateUrl: './game-score.ux.html',
  styleUrls: ['./game-score.ux.scss'],
})
export class GamescoreUxComponent implements OnInit, AfterViewInit {
  // Settings For Game Score Font
  @Input() viewType: ScoreViewType = ScoreViewType.Flow;

  // View Children Handles
  @ViewChild('resizeHandle')
  resizeHandle: ElementRef | null = null;
  @ViewChildren(GameScoreItemComponent) scoreItems: QueryList<GameScoreItemComponent> | null = null;
  @ViewChild('gamescore-container') container: ElementRef | null = null;
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
  @Output() currentItem: GameScoreItemComponent | null = null;
  @Output() currentIndex: number = -1;


  constructor(public olga: OlgaService, public layout: LayoutService) {
    this.resetCursor();

  }

  ngOnInit(): void {
    //console.log(this.gameScore);
  }

  ngAfterViewInit(): void {
    this.layout.resizeElement = document.getElementById('resize-handle-' + this.olga.UUID);
  }


  public setGameScoreItems(items: GameScoreItem[] | undefined): void {
    if(items) {
      this._items = items;
      this.updateSelection();
    } else {
      this._items = [];
    }
  }

  public updateSelection(): void {
    window.setTimeout(()=>{this.selectGameScoreItem(this.currentIndex);}, 75);
  }

  protected navigateToItem(index: number):void {

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

  openItemMenu(event: MouseEvent, item: GameScoreItemComponent): void {
    event.preventDefault();
    event.stopPropagation();
    console.log(item);
    if (item.data) {
      //item.setCurrent(!item.data.current);
    }
    switch (item.data.type) { // open different menus

    }
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
    if (this.currentItem) {
      this.currentItem.setSelected(false);
      this.currentItem = null;
    }
    if(index >= 0) {
      const item = this.scoreItems?.toArray()[index];
      if (item && item != this.currentItem) {
        item.setSelected(!item.isSelected());
        this.currentItem = item;
      }
    }
  }
  public getPGN(): string {
    return this.pgnData?.nativeElement.value;
  }

  // Navigation

  public takeVariation(index: number) {
    this.navigateToNode(index - 1);
    window.setTimeout(()=>{
      if(this.currentItem) {
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
                if(this.olga.play(next.move)) {
                  const nodeMove = ChessMove.fromNode(next.move);
                  if(nodeMove){
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
          prev = this._items[this.currentIndex-1];
        }
        if (prev && node) {
            if (this.olga.unPlay(node.move, prev.move)) {
              const nodeMove = ChessMove.fromNode(node.move);
              if(nodeMove){
                this.olga.reverseBoardMove(nodeMove);
              }
            }
        }
        --this.currentIndex;
    } 
    if(index === -1) {
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
    while(this.previous()){}
  }

  public moveToEnd(): void {
    while(this.advance()){}
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
      return this.currentIndex >= (this._items.length-1);
  }

  public incrementSelection(): void {
    ++this.currentIndex;
    this.updateSelection();
  }

}
