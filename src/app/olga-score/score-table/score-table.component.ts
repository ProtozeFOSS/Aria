import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, AfterViewInit, QueryList, ViewChildren } from '@angular/core';

import { GameScoreItem } from '../../common/kokopu-engine';
import { LayoutService } from '../../services/layout.service';
import { OlgaService } from '../../services/olga.service';
import { ThemeService } from '../../services/themes.service';
import { ScoreColumnComponent } from './score-column/score-column.component';

@Component({
  selector: 'score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss']
})
export class ScoreTableComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChildren(ScoreColumnComponent) scoreTables!: QueryList<ScoreColumnComponent>;
  @Input() items: GameScoreItem[] = [];
  @Input() columns: number[] = [];
  @Input() rowCount = 0;
  width = 0;
  height = 0;

  constructor(public olga: OlgaService, public theme: ThemeService, public layout: LayoutService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
        this.resize(this.width, this.height);
    }
  }

  selectGameScoreItem(index: number): void {

  }

  resize(width: number, height: number) : void {
    if(this.items.length == 0) {
      return;
    }
    this.width = width;
    this.height = height;
    let existing_items = document.getElementsByClassName('gsi-container');
    let item_height = 25;
    let moves = Math.ceil(this.items.length/2);
    if(existing_items && existing_items.length) {
      const first = existing_items[0];
      item_height = first.clientHeight;
    }
    let max_row_count = Math.floor((height -10)/item_height);
    let max_columns = Math.floor(width/160);
    if(max_row_count * max_columns >= moves) {
      // it will fit
      max_columns = Math.ceil(moves / max_row_count); // determine columns
      this.rowCount = (max_row_count - Math.floor(((max_row_count * max_columns)-moves)/max_columns)); // even the columns out
    } else { // determine whats the best column count based on width
      this.rowCount = Math.ceil(moves / max_columns);
    }
    this.columns = Array.from({length: max_columns}, (_, i) => i + 1);
    this.theme.gsTableItemWidth.next(Math.round((width - (32 * this.columns.length))/ (this.columns.length* 2)) + 'px');
    window.setTimeout( () =>{
      if(this.scoreTables) {
        const tables = this.scoreTables.toArray();
        for (let i = 0; i < tables.length-1; ++i) {
          tables[i].setData(this.items, i * this.rowCount, this.rowCount);        
        }
        const last = tables.length-1;
        tables[last].setData(this.items, last * this.rowCount, moves - (last * this.rowCount));
      }
    }, 2);
  }

}
