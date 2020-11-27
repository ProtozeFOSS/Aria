import { Component, OnInit, QueryList, ViewChildren } from '@angular/core';
import { GameScoreItem } from '../../common/kokopu-engine';
import { FlowItemComponent } from './flow-item/flow-item.component';

@Component({
  selector: 'score-flow',
  templateUrl: './score-flow.component.html',
  styleUrls: ['./score-flow.component.scss']
})
// @ts-ignore
export class ScoreFlowComponent implements OnInit {
  // @ts-ignore
  @ViewChildren(FlowItemComponent) scoreItems: QueryList<FlowItemComponent> | null = null;
  items: GameScoreItem[] = [];
  constructor() { }

  ngOnInit(): void {
  }

}
