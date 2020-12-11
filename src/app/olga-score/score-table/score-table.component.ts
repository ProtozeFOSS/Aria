import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, AfterViewInit, QueryList, ViewChildren } from '@angular/core';
import { GameScoreItem } from 'src/app/common/kokopu-engine';
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

  constructor() { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes.items) {
      if(this.scoreItems) {
        const items = this.scoreItems.toArray();
        for (let i = 0; i < this.scoreItems.length; ++i) {
          items[i].items = this.items;
          items[i].setData(this.items, i, this.rowCount);  
        }
      }
    }
  }

  selectGameScoreItem(index: number): void {

  }

  resize(width: number, height: number) : void {
    console.log('Resizing score table');
    // reevaluate the column spacing
    const maxColumns = Math.floor(width/200);
    this.columns = Array.from({length: maxColumns}, (_, i) => i + 1);
    this.rowCount = this.items.length/(this.columns.length + 1);
    if(this.scoreItems) {
      const items = this.scoreItems.toArray();
      for (let i = 0; i < items.length; ++i) {
        items[i].setData(this.items, i, this.rowCount);        
      }
    }
  }

}
