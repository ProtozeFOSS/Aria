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
  GameScoreItem,
  GameScoreType,
  GameScoreAnnotation,
  GameScoreVariation
} from '../common/kokopu-engine';
import { GameScoreItemMenu } from './menu-game-score-item/menu-game-score-item.component';
import { GameScoreItemComponent } from './game-score-item/game-score-item.component';
import { BehaviorSubject } from 'rxjs';
import { OlgaService } from '../services/olga.service';
import { LayoutService } from '../services/layout.service';

export enum ScoreViewType {
  Table = 101,
  Flow = 202
};

@Component({
  selector: 'app-game-score-ux',
  templateUrl: './game-score.ux.html',
  styleUrls: ['./game-score.ux.scss'],
})
export class GamescoreUxComponent implements OnInit, AfterViewInit {
  // Settings For Game Score Font
  @Input() viewType: ScoreViewType = ScoreViewType.Flow;

  // View Children Handles
  @ViewChild(GameScoreItemMenu)
  scoreItemMenu: GameScoreItemMenu | null = null;
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
      window.setTimeout(()=>{this.selectGameScoreItem(this.olga.getNodeIndex());}, 100);
    } else {
      this._items = [];
    }
  }

  resizeScore(): void {
    if (this.scoreWidth) {
      this.columnCount = Math.floor(this.scoreWidth / this.maxPlySize);
    } else {
      this.columnCount = 3;
    }
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
    //this.scoreItemMenu?.openAt(item);
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
      // TODO: Update on on ngChanges
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
}
