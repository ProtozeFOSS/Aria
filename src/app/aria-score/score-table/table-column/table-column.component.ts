import { Component, Input, OnChanges, OnInit, Output, QueryList, SimpleChanges, ViewChildren } from '@angular/core';
import { GameScoreItem } from '../../../common/kokopu-engine';
import { AriaService } from '../../../services/aria.service';
import { TableItem } from '../table-item/table-item.component';

interface ScoreRow {
  white: GameScoreItem | null;
  black: GameScoreItem | null;
}

@Component({
  selector: 'table-column',
  templateUrl: './table-column.component.html',
  styleUrls: ['./table-column.component.scss']
})
export class TableColumn implements OnInit, OnChanges {
  @ViewChildren(TableItem) rowItems!: QueryList<TableItem>;
  @Input() index: number = 0;
  @Input() size: number = 3;
  @Output() rows: ScoreRow[] = [];

  constructor(public aria: AriaService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.setItems();
    }
  }

  setData(items: GameScoreItem[], index: number, size: number) {
    this.aria.gameScoreItems = items;
    this.index = index;
    this.size = size;
    this.setItems();
  }

  clearSelection(): void {
    const rows = this.rowItems.toArray();
    for (let i = 0; i < rows.length; ++i) {
      rows[i].clearSelection();
    }
  }

  private setItems(): void {
    if (this.aria.gameScoreItems.length && this.size) {
      let rows = this.aria.gameScoreItems.slice((this.index * 2), (this.index * 2) + (this.size * 2));
      this.rows = [];
      let white: GameScoreItem | null = null;
      let last = null;
      for (let i = 0; i < rows.length; ++i) {
        const item = rows[i];
        if (item.move) {
          if (item.move.moveColor() == 'w') {
            white = item;
          } else {
            this.rows.push({ white, black: item });
            white = null;
          }
        }
        last = item;
      }
      if (white) {
        this.rows.push({ white, black: null });
      }
      for (let i = this.rows.length; i < this.size; ++i) {
        this.rows.push({ white: null, black: null });
      }
    }
  }
}
