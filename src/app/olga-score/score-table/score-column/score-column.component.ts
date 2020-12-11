import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GameScoreItem } from 'src/app/common/kokopu-engine';

interface ScoreRow {
  white: GameScoreItem | null;
  black: GameScoreItem | null;
}

@Component({
  selector: 'score-column',
  templateUrl: './score-column.component.html',
  styleUrls: ['./score-column.component.scss']
})
export class ScoreColumnComponent implements OnInit, OnChanges {
  @Input() items: GameScoreItem[] = [];
  @Input() column: number = 0;
  @Input() size: number = 3;
  @Output() rows: ScoreRow[] = [];
  constructor() {
    console.log('hello ' + this.size);
  }

  ngOnInit(): void {
    this.setItems();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.setItems();
    }
  }

  setData(items: GameScoreItem[], column: number, size: number) {
    this.items = items;
    this.column = column;
    this.size = size;
    this.setItems();
  }

  private setItems(): void {
    if (this.items.length) {
      let rows = this.items.slice(this.column * (this.size * 2), (this.column + 1) * (this.size * 2));
      this.rows = [];
      let white: GameScoreItem | null = null;
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
      }
      if (white) {
        this.rows.push({ white, black: null });
      }
    }
  }
}
