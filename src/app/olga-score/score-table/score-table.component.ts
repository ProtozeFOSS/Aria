import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { GameScoreItem } from 'src/app/common/kokopu-engine';
import { ThemeService } from '../../services/themes.service';
import { ScoreColumnComponent } from './score-column/score-column.component';

@Component({
  selector: 'score-table',
  templateUrl: './score-table.component.html',
  styleUrls: ['./score-table.component.scss']
})
export class ScoreTableComponent implements OnInit, OnChanges, AfterViewInit {
  @ViewChildren(ScoreColumnComponent) scoreItems!: QueryList<ScoreColumnComponent>;
  @Input() items: GameScoreItem[] = [];
  @Input() columns = [0, 1];
  @Input() rowCount = 21;

  constructor(public theme: ThemeService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      if(this.scoreItems) {
        const items = this.scoreItems.toArray();
        for (let i = 0; i < this.scoreItems.length; ++i) {
          items[i].setData(this.items, i, this.rowCount);  
        }
      }
    }
  }

  selectGameScoreItem(index: number): void {

  }

  resize(width: number, height: number) : void {
    let existing_items = document.getElementsByClassName('gsi-container');
    let item_height = 25;
    if(existing_items && existing_items.length) {
      const first = existing_items[0];
      item_height = first.clientHeight;
    }
    const ideal_row_count = ((height/item_height) -1);
    const maxColumns = Math.floor(width/200);
    this.columns = Array.from({length: maxColumns}, (_, i) => i + 1);
    this.rowCount = Math.round((this.items.length/this.columns.length)/2);
    this.theme.gsTableItemWidth.next(Math.round((width - (32 * this.columns.length))/ (this.columns.length* 2)) + 'px');
    if(this.scoreItems) {
      const items = this.scoreItems.toArray();
      for (let i = 0; i < items.length; ++i) {
        items[i].setData(this.items, i, this.rowCount);        
      }
    }
  }

}
