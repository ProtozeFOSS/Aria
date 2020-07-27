import {
  Component,
  OnInit,
  ChangeDetectionStrategy,
  Input,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
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
  GameScoreService,
  GameScoreItem,
} from '../services/game-score.service';
import { MenuGameScoreItemComponent } from './menu-game-score-item/menu-game-score-item.component';
interface Move {
  w: string;
  b: string;
}

@Component({
  selector: 'app-game-score-ux',
  templateUrl: './game-score.ux.html',
  styleUrls: ['./game-score.ux.scss'],
})
export class GamescoreUxComponent implements OnInit, AfterViewInit {
  @ViewChild(MenuGameScoreItemComponent)
  scoreItemMenu: MenuGameScoreItemComponent | null = null;
  @ViewChild('resizeHandle')
  resizeHandle: ElementRef | null = null;
  @Input() gameScoreFontSize: number | null = 24;
  columnCount = 3;
  gameScore: Move[] = [];
  rowHeight = '50px';
  maxPlySize = 178;
  @Output() resizing = false;
  @Input() scoreWidth: number | null = 360;
  protected previousCursor = 'pointer';
  constructor(public gameScoreService: GameScoreService) {
    this.gameScore = [
      { w: 'd4', b: 'Qd5' },
      { w: 'Nf3', b: 'Bf6' },
      { w: 'Rf3', b: 'Qf6' },
      { w: 'Kf3', b: 'f6' },
    ];
    this.gameScoreService.figurineNotation.subscribe((figurineNotation) => {
      if (figurineNotation) {
        console.log('Setting Font to : ' + 'FigurineSymbolT1');
        this.gameScoreService.scoreFontFamily.next('FigurineSymbolT1');
      } else {
        console.log('Setting Font to : ' + 'Caveat');
        this.gameScoreService.scoreFontFamily.next('Cambria');
      }
    });
  }

  ngOnInit(): void {
    console.log(this.gameScore);
  }

  ngAfterViewInit(): void {
    this.gameScoreService.loadPGN('');
    this.resizeScore();
  }

  resizeScore(): void {
    if (this.scoreWidth) {
      this.columnCount = Math.floor(this.scoreWidth / this.maxPlySize);
    } else {
      this.columnCount = 3;
    }
  }

  openItemMenu(event: MouseEvent, item: GameScoreItem): void {
    event.preventDefault();
    event.stopPropagation();
    console.log('Right clicked on item ' + item?.moveData?.move);
    this.scoreItemMenu?.openAt(item);
  }

  ignoreEvent(event: MouseEvent): void {
    console.log('Ignoring ' + event);
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
      document.body.style.cursor = this.previousCursor;
    }
    if (this.resizeHandleEvent) {
      this.resizeHandleEvent(event);
    }
  }

  setGrabCursor(event: DragEvent | MouseEvent): void {
    this.previousCursor = document.body.style.cursor;
    this.resizing = true;
    document.body.style.cursor = 'grab';
    if (this.resizeHandle) {
      this.resizeHandle.nativeElement.style.cursor = 'grab';
    }
  }

  resizeHandleEvent(event: DragEvent | MouseEvent): void {
    if (this.resizing) {
      console.log(event);
      this.resizeScore();
    }
  }

  resizeHandleCore(event: DragEvent | MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
    document.body.style.cursor = 'grab';
    if (this.resizeHandle) {
      this.resizeHandle.nativeElement.style.cursor = 'grab';
    }
    if (event.buttons > 0 && this.resizeHandleEvent) {
      this.resizeHandleEvent(event);
    }
  }
}
