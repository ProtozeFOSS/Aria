import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  Input,
  Output,
  OnChanges,
  SimpleChanges,
} from '@angular/core';
import { OlgaService } from 'src/app/services/olga.service';
import { GameScoreItem, ChessGame } from '../../common/kokopu-engine';
import { FlowItemComponent } from './flow-item/flow-item.component';

@Component({
  selector: 'score-flow',
  templateUrl: './score-flow.component.html',
  styleUrls: ['./score-flow.component.scss'],
})

export class ScoreFlowComponent implements OnInit, OnChanges {
  @ViewChildren(FlowItemComponent) scoreItems!: QueryList<FlowItemComponent>;
  @Output() currentItem: FlowItemComponent | null = null;
  @Input() items: GameScoreItem[] = [];
  @Output() result = '';
  constructor(public olga: OlgaService) { }

  ngOnInit(): void {
    const game = this.olga.getGame() as ChessGame;

  }

  ngOnChanges(changes: SimpleChanges): void {
    console.log()
  }

  selectGameScoreItem(index: number) {
    if (this.currentItem) {
      this.currentItem.setSelected(false);
      this.currentItem = null;
    }
    if (index >= 0) {
      const item = this.scoreItems?.toArray()[index];
      if (item && item != this.currentItem) {
        item.setSelected(!item.isSelected());
        this.currentItem = item;
      }
    }
  }

  openItemMenu(event: MouseEvent, item: FlowItemComponent): void {
    event.preventDefault();
    event.stopPropagation();
    console.log(item);
    if (item.data) {
      //item.setCurrent(!item.data.current);
    }
    switch (item.data.type) { // open different menus

    }
  }

  clearGameScore(): void {

  }

  resize(width: number, height: number): void {

  }
}
