import {
  Component,
  OnInit,
  QueryList,
  ViewChildren,
  Input,
  Output,
} from '@angular/core';
import { GameScoreItem } from '../../common/kokopu-engine';
import { FlowItemComponent } from './flow-item/flow-item.component';

@Component({
  selector: 'score-flow',
  templateUrl: './score-flow.component.html',
  styleUrls: ['./score-flow.component.scss'],
})
// @ts-ignore
export class ScoreFlowComponent implements OnInit {
  // @ts-ignore
  @ViewChildren(FlowItemComponent) scoreItems: QueryList<FlowItemComponent> | null = null;
  @Output() currentItem: FlowItemComponent | null = null;
  @Input() items: GameScoreItem[] = [];
  constructor() { }

  ngOnInit(): void { }


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
}
