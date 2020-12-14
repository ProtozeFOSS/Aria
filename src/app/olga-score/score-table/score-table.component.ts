import { Component, OnInit, Input, OnChanges, SimpleChanges, Output, AfterViewInit, QueryList, ViewChildren, ViewChild, ElementRef } from '@angular/core';

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
  @ViewChild('comment',{static: false}) comment!: ElementRef;
  @ViewChild('variantBar',{static: false}) variantBar!: ElementRef;
  @ViewChild('scoreArea',{static: false}) scoreArea!: ElementRef;
  @Input() items: GameScoreItem[] = [];
  @Input() columns: number[] = [];
  @Input() rowCount = 0;
  @Input() currentItem: GameScoreItem | null = null;
  @Output() moveComment: string  = '';
  @Output() variations: [number,string][] = [];
  width = 0;
  height = 0;

  constructor(public olga: OlgaService, public theme: ThemeService, public layout: LayoutService) { }

  ngOnInit(): void {
  }
  ngAfterViewInit(): void {
    this.updateViewSize();
  }

  updateViewSize(): void {
    window.setTimeout(()=>{
      if(this.layout.gameScoreElement) {
        const width = this.layout.gameScoreElement.clientWidth;
        if(!isNaN(width)){
          this.width = width;
          this.height = this.layout.gameScoreElement.clientHeight;
          this.selectGameScoreItem(this.olga.getNodeIndex());
          this.resize(width, this.height);
        }
      }
    },4)
  }

  ngOnChanges(changes: SimpleChanges): void {
      this.updateViewSize();
  }

  selectGameScoreItem(index: number): void {
    if(this.currentItem) {
      this.currentItem.setSelected(false);
    }
    this.variations = [];
    if(index < this.items.length && index >= 0) {
      this.currentItem = this.items[index];
      const targetColumn = index % this.rowCount;
      this.currentItem.setSelected(true);
      if(this.currentItem.move) {
        const comment = this.currentItem.move.comment();
        if(comment) {
          this.moveComment = comment;
        }else {
          this.moveComment = '';
        }
        const variants = this.currentItem.move.variations();
        for(let i = 0; i < variants.length; ++i) {
          const variation = variants[i];
          this.variations.push([variation.initialFullMoveNumber(), variation.first().notation()])
        }
      }
    } else {
      this.currentItem = null;
    }
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
    let max_row_count = Math.floor((height -10)/item_height) + (this.olga.showTableHeader.value ? 0:1);
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
