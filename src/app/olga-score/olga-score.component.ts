import {
  Component,
  OnInit,
  Output,
  AfterViewInit,
  ViewChild,
  ElementRef,
} from '@angular/core';
import {
  ChessMove,
  GameScoreItem,
  GameScoreType
} from '../common/kokopu-engine';
import { OlgaService, ScoreViewType } from '../services/olga.service';
import { LayoutService } from '../services/layout.service';
import { ScoreFlowComponent } from './score-flow/score-flow.component';
import { BehaviorSubject } from 'rxjs';
import { ScoreTableComponent } from './score-table/score-table.component';

@Component({
  selector: 'olga-score',
  templateUrl: './olga-score.html',
  styleUrls: ['./olga-score.scss'],
})
export class GamescoreUxComponent implements OnInit, AfterViewInit {
  // View Children Handles
  // @ts-ignore
  @ViewChild(ScoreFlowComponent) flowScore: ScoreFlowComponent | null;
  // @ts-ignore
  @ViewChild(ScoreTableComponent) tableScore: ScoreTableComponent | null;

  container: HTMLElement | null = null;
  GameScoreType = GameScoreType;
  ScoreViewType = ScoreViewType;
  @Output() _items: GameScoreItem[] = [];
  // @ts-ignore
  @Output() readonly currentData = new BehaviorSubject<GameScoreItem | null>(null);
  // @ts-ignore
  @Output() currentIndex: number = -1;
  // @ts-ignore
  @Output() currentItem: GameScoreItem | null;
  // Current item data and visual


  constructor(public olga: OlgaService, public layout: LayoutService) {
    this.olga.attachScore(this);
    this.layout.attachScore(this);
  }

  ngOnInit(): void {
    this.olga.attachScore(this);
    this.layout.attachScore(this);
    const gs = this.olga.getGame()?.generateGameScore();
    if (gs) {
      this._items = gs;
    }
  }

  ngAfterViewInit(): void {
    this.layout.gameScoreElement = this.container = document.getElementById('olga-score-' + this.olga.UUID);
    if (this.flowScore) {
      this.flowScore.items = this._items;
    }
    if (this.tableScore) {
      this.tableScore.items = this._items;
    }
  }

  public clearGameScore(): void {
    if (this.flowScore) {
      this.flowScore.clearGameScore();
    }
  }
  public setGameScoreItems(items: GameScoreItem[] | undefined): void {
    if (items) {
      this._items = items;
      this.updateSelection();
    } else {
      this._items = [];
    }
    if (this.flowScore) {
      this.flowScore.items = this._items;
    }
    if (this.tableScore) {
      this.tableScore.items = this._items;
    }
  }

  public plyCount(): number {
    if (this._items) {
      return (this._items.length / 2) + 1;
    }
    return 0;
  }

  public updateSelection(): void {
    window.setTimeout(() => { this.selectGameScoreItem(this.currentIndex); }, 5);
  }
  public clearSelection(): void {
    this.currentIndex = -1;
    window.setTimeout(() => { this.selectGameScoreItem(-1); }, 5);
  }

  protected navigateToItem(index: number): void {

  }

  resize(width: number, height: number) {
    if (height == 0 || width == 0) {
      return;
    }
    // if (this.container) {
    //   this.container.style.width = width + 'px';
    //   this.container.style.height = height + 'px';
    // }
    if (this.flowScore) {
      this.flowScore.resize(width, height);
    }
    if (this.tableScore) {
      this.tableScore.resize(width, height);
    }
  }


  ignoreEvent(event: MouseEvent): void {
    event.preventDefault();
    event.stopPropagation();
  }


  selectGameScoreItem(index: number) {
    if (this.flowScore) {
      this.flowScore.selectGameScoreItem(index);
    } else if (this.tableScore) {
      this.tableScore.selectGameScoreItem(index);
      window.setTimeout(this.tableScore.updateViewSize, 100);
    }
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
