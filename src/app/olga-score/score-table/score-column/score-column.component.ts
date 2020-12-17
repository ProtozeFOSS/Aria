import { Component, Input, OnChanges, OnInit, Output, SimpleChanges } from '@angular/core';
import { GameScoreItem } from '../../../common/kokopu-engine';
import { OlgaService } from '../../../services/olga.service';

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
  @Input() index: number = 0;
  @Input() size: number = 3;
  @Output() rows: ScoreRow[] = [];
  
  constructor(public olga: OlgaService) {
  }

  ngOnInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      this.setItems();
    }
  }

  setData(items: GameScoreItem[], index: number, size: number) {
    this.items = items;
    this.index = index;
    this.size = size;
    this.setItems();
  }

  clearSelection(): void {

  }

  private setItems(): void {
    if (this.items.length && this.size) {
      let rows = this.items.slice((this.index*2),  (this.index*2) + (this.size * 2));
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
      for (let i = this.rows.length; i < this.size; ++i ) {
        this.rows.push({white:null, black: null});
      }
    }
  }
}
