import {
  Component,
  OnInit,
  Input,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
  ViewChildren,
  QueryList,
} from '@angular/core';
import {
  trigger,
  state,
  style,
  animate,
  transition,
  // ...
} from '@angular/animations';
import {
  OlgaService,
  GameScoreItem,
  GameScoreType,
  GameScoreAnnotation,
  GameScoreVariation
} from '../services/game.service';
import { MenuGameScoreItemComponent } from './menu-game-score-item/menu-game-score-item.component';
import { GameScoreItemComponent } from './game-score-item/game-score-item.component';
import { BehaviorSubject } from 'rxjs';
import { OlgaService } from '../services/olga.service';
import { LayoutService } from '../services/layout.service';
interface Move {
  w: string;
  b: string;
};

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
  @Output() readonly scoreFontFamily = new BehaviorSubject<string>('Caveat');
  @Output() readonly scoreFontSize = new BehaviorSubject<number>(18);
  @ViewChild(MenuGameScoreItemComponent)
  scoreItemMenu: MenuGameScoreItemComponent | null = null;
  @ViewChild('resizeHandle')
  resizeHandle: ElementRef | null = null;
  @ViewChild('pgnData')
  pgnData: ElementRef | null = null;
  @ViewChild('gamescore-container') container: ElementRef | null = null;
  @Input() gameScoreFontSize: number | null = 24;
  @Input() UUID = '';
  columnCount = 3;
  gameScore: Move[] = [];
  rowHeight = '50px';
  maxPlySize = 178;
  @Output() resizing = false;
  @Input() scoreWidth: number | null = 360;
  @Input() viewType: ScoreViewType = ScoreViewType.Flow;
  GameScoreType = GameScoreType;
  ScoreViewType = ScoreViewType;

  // Settings
  @Output() readonly currentItem = new BehaviorSubject<GameScoreItem | null>(null);

  @ViewChildren(GameScoreItemComponent) scoreItems: QueryList<GameScoreItemComponent> | null = null;
  @Output() currentScoreItem: GameScoreItemComponent | null = null;
  constructor(public olga: OlgaService, public layoutService: LayoutService) {
    this.resetCursor();
    this.olga.figurineNotation.subscribe((figurineNotation: boolean) => {
      if (figurineNotation) {
        this.scoreFontFamily.next('FigurineSymbolT1');
      } else {
        this.scoreFontFamily.next('Cambria');
      }
    });
  }

  ngOnInit(): void {
    //console.log(this.gameScore);
  }

  ngAfterViewInit(): void {
    if (this.pgnData) {
      this.olga.loadPGN(this.pgnData.nativeElement.value);
      this.layoutService.resizeElement = document.getElementById('resize-handle-' + this.UUID);
      //console.log(this.scoreItems);
      window.setTimeout(() => {
        if (this.scoreItems) {
          this.currentScoreItem = this.scoreItems.first;
        }
      }, 300);
    }
    this.resizeScore();
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
      if (this.layoutService.resizeElement) {
        this.resizing = true;
      }
    }
  }

  stopTouch(event: TouchEvent) {
    this.resizing = false;
  }

  loadPGN(pgn: string) {
    this.olga.loadPGN(pgn);
    this.ngOnInit();
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
    const item = this.scoreItems?.toArray()[index];
    if (this.currentScoreItem) {
      this.currentScoreItem.setSelected(!this.currentScoreItem.isSelected());
    }
    if (item && item != this.currentScoreItem) {
      item.setSelected(!item.isSelected());
      this.currentScoreItem = item;
    }
  }
}
